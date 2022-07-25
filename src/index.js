const { Watcher } = require('./watcher.js');
const { observer } = require('./reactive.js');
const { get } = require('./utils.js');

class Berserk {
  constructor(html) {
    this.states = {};
    this.mutations = {};
    this.renderer = html;
    this.created = () => {};
    this.mounted = () => {};
  }

  useReactive(obj) {
    this.states = observer(obj);
  }

  register(name, fn) {
    this.mutations[name] = fn.bind(this);
  }

  render(root) {
    const compile = (node) => {
      if (Object.keys(window.Berserk).includes(node.tagName.toLowerCase())) {
        const name = node.tagName.toLowerCase();
        node.parentNode.insertBefore(window.Berserk[name], node);
        node.parentNode.removeChild(node);
      }
      if (node.getAttribute('b-if')) {
        const display = node.style.display;
        const renderShow = () => {
          const isShow = get(this.states, node.getAttribute('b-if'));
          node.style.display = isShow ? display : 'none';
        };
        window.target = new Watcher(renderShow);
        window.target.update();
        get(this.states, node.getAttribute('b-if'));
      }
      if (node.getAttribute('b-bind')) {
        const type = node.tagName === 'INPUT' ? 'value' : 'innerText';
        const renderData = () => {
          const val = get(this.states, node.getAttribute('b-bind'));
          node[type] = val;
        };
        window.target = new Watcher(renderData);
        window.target.update();
        get(this.states, node.getAttribute('b-bind'));
        if (node.tagName === 'INPUT') {
          node.addEventListener('input', (e) => {
            eval(
              `this.states.${node.getAttribute('b-bind')} = '${e.target.value}'`
            );
          });
        }
      }
      if (node.getAttribute('b-for')) {
        const renderFor = () => {
          const val = get(this.states, node.getAttribute('b-for'));
          const tpl = node.children[0];
          node.innerHTML = '';
          val.forEach((item, index) => {
            const travel = (node) => {
              if (
                node.getAttribute('b-bind') &&
                node.getAttribute('b-bind').indexOf('item') !== -1
              ) {
                const isChain = node.getAttribute('b-bind').split('.').length;
                node.innerText =
                  isChain === 1
                    ? item
                    : get(item, node.getAttribute('b-bind').slice(5));
              }
              if (node.children) {
                [...node.children].forEach((child) => {
                  travel(child);
                });
              }
              return node;
            };
            const n = travel(tpl.cloneNode(true));
            node.appendChild(n);
          });
        };
        window.target = new Watcher(renderFor);
        window.target.update();
        get(this.states, node.getAttribute('b-for'));
        return;
      }
      if (node.getAttribute('b-click')) {
        node.addEventListener(
          'click',
          this.mutations[node.getAttribute('b-click')]
        );
      }
      if (node.children) {
        for (const el of node.children) {
          compile(el);
        }
      }
      return node;
    };
    compile(root);
  }

  onCreate(cb) {
    if (typeof cb !== 'function')
      throw new Error('arguments should be function.');
    this.created = cb.bind(this);
  }

  onMount(cb) {
    if (typeof cb !== 'function')
      throw new Error('arguments should be function.');
    this.mounted = cb.bind(this);
  }
}

Berserk.createApp = (html) => {
  return new Berserk(html);
};

Berserk.define = (name, app) => {
  app.created();
  const root = document.createElement('div');
  root.id = name;
  root.innerHTML = app.renderer;
  app.render(root);
  window.Berserk[name] = root;
  app.mounted();
};

((window) => {
  window.Berserk = {};
  window.B = Berserk;
})(window);
