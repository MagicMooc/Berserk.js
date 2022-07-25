!(function (e, t) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = t())
    : 'function' == typeof define && define.amd
    ? define('berserk-js', [], t)
    : 'object' == typeof exports
    ? (exports['berserk-js'] = t())
    : (e['berserk-js'] = t());
})(self, () =>
  (() => {
    var __webpack_modules__ = {
        349: (e) => {
          e.exports = {
            Dep: class {
              constructor() {
                this.subs = [];
              }
              add() {
                window.target &&
                  (this.subs.push(window.target), (window.target = null));
              }
              notify() {
                this.subs.forEach((e) => {
                  e.update();
                });
              }
            }
          };
        },
        42: (e, t, r) => {
          const { Dep: n } = r(349),
            o = (e) => {
              const t = Array.isArray(e) ? [] : {};
              return (
                Object.keys(e).forEach((r) => {
                  'object' != typeof e[r] || Array.isArray(e[r])
                    ? ((e, t, r) => {
                        const o = new n();
                        Object.defineProperty(e, t, {
                          get: () => (o.add(), r),
                          set(n) {
                            e[t] !== n && ((r = n), (e[t] = n), o.notify());
                          }
                        });
                      })(t, r, e[r])
                    : (t[r] = o(e[r]));
                }),
                t
              );
            };
          e.exports = { observer: o };
        },
        266: (e) => {
          e.exports = {
            get: (e, t, r = '') => {
              const n = t.split('.');
              let o = e;
              for (; n.length; )
                try {
                  o = o[`${n.shift()}`];
                } catch (e) {
                  return r;
                }
              return o;
            }
          };
        },
        865: (e) => {
          e.exports = {
            Watcher: class {
              constructor(e) {
                this.cb = e;
              }
              update() {
                this.cb();
              }
            }
          };
        }
      },
      __webpack_module_cache__ = {};
    function __webpack_require__(e) {
      var t = __webpack_module_cache__[e];
      if (void 0 !== t) return t.exports;
      var r = (__webpack_module_cache__[e] = { exports: {} });
      return (
        __webpack_modules__[e](r, r.exports, __webpack_require__), r.exports
      );
    }
    var __webpack_exports__ = {};
    return (
      (() => {
        const { Watcher } = __webpack_require__(865),
          { observer } = __webpack_require__(42),
          { get } = __webpack_require__(266);
        class Berserk {
          constructor(e) {
            (this.states = {}),
              (this.mutations = {}),
              (this.renderer = e),
              (this.created = () => {}),
              (this.mounted = () => {});
          }
          useReactive(e) {
            this.states = observer(e);
          }
          register(e, t) {
            this.mutations[e] = t.bind(this);
          }
          render(root) {
            const compile = (node) => {
              if (
                Object.keys(window.Berserk).includes(node.tagName.toLowerCase())
              ) {
                const e = node.tagName.toLowerCase();
                node.parentNode.insertBefore(window.Berserk[e], node),
                  node.parentNode.removeChild(node);
              }
              if (node.getAttribute('b-if')) {
                const e = node.style.display,
                  t = () => {
                    const t = get(this.states, node.getAttribute('b-if'));
                    node.style.display = t ? e : 'none';
                  };
                (window.target = new Watcher(t)),
                  window.target.update(),
                  get(this.states, node.getAttribute('b-if'));
              }
              if (node.getAttribute('b-bind')) {
                const type = 'INPUT' === node.tagName ? 'value' : 'innerText',
                  renderData = () => {
                    const e = get(this.states, node.getAttribute('b-bind'));
                    node[type] = e;
                  };
                (window.target = new Watcher(renderData)),
                  window.target.update(),
                  get(this.states, node.getAttribute('b-bind')),
                  'INPUT' === node.tagName &&
                    node.addEventListener('input', (e) => {
                      eval(
                        `this.states.${node.getAttribute('b-bind')} = '${
                          e.target.value
                        }'`
                      );
                    });
              }
              if (node.getAttribute('b-for')) {
                const e = () => {
                  const e = get(this.states, node.getAttribute('b-for')),
                    t = node.children[0];
                  (node.innerHTML = ''),
                    e.forEach((e, r) => {
                      const n = (t) => {
                          if (
                            t.getAttribute('b-bind') &&
                            -1 !== t.getAttribute('b-bind').indexOf('item')
                          ) {
                            const r = t
                              .getAttribute('b-bind')
                              .split('.').length;
                            t.innerText =
                              1 === r
                                ? e
                                : get(e, t.getAttribute('b-bind').slice(5));
                          }
                          return (
                            t.children &&
                              [...t.children].forEach((e) => {
                                n(e);
                              }),
                            t
                          );
                        },
                        o = n(t.cloneNode(!0));
                      node.appendChild(o);
                    });
                };
                return (
                  (window.target = new Watcher(e)),
                  window.target.update(),
                  void get(this.states, node.getAttribute('b-for'))
                );
              }
              if (
                (node.getAttribute('b-click') &&
                  node.addEventListener(
                    'click',
                    this.mutations[node.getAttribute('b-click')]
                  ),
                node.children)
              )
                for (const e of node.children) compile(e);
              return node;
            };
            compile(root);
          }
          onCreate(e) {
            if ('function' != typeof e)
              throw new Error('arguments should be function.');
            this.created = e.bind(this);
          }
          onMount(e) {
            if ('function' != typeof e)
              throw new Error('arguments should be function.');
            this.mounted = e.bind(this);
          }
        }
        (Berserk.createApp = (e) => new Berserk(e)),
          (Berserk.define = (e, t) => {
            t.created();
            const r = document.createElement('div');
            (r.id = e),
              (r.innerHTML = t.renderer),
              t.render(r),
              (window.Berserk[e] = r),
              t.mounted();
          }),
          ((e) => {
            (e.Berserk = {}), (e.B = Berserk);
          })(window);
      })(),
      __webpack_exports__
    );
  })()
);
