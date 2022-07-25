# Berserk.js

# ![facebook_cover_photo_2](https://picmagic.oss-cn-beijing.aliyuncs.com/img/facebook_cover_photo_2.png)

# Berserk.js

> 一款渐进式 MVVM 轻量级框架（Berserk取自《剑风传奇》的英文名）


## 1. 快速上手

1. 通过cdn引入`Berserk`
```
<script src="https://cdn.jsdelivr.net/npm/berserk-js@1.0.0/lib/index.js"></script>
```

2. 创建一个`app`对象
``` js
const App = B.createApp(`
    <div>
        My name is: 
        <span b-bind="test"></span>
    </div>
`);
```

3. 设置响应式数据
``` js
App.useReactive({
    name: 'panda'
});
```

4. 添加方法
``` js
App.register('handleClick', () => {
    console.log('this is a func');
    App.states.name = 'cat';
});
```

5. 将该组件定义到全局`Berserk`对象中
``` js
B.define('app', App);
```
    
6. 当组件编译完成后，将组件添加到当前DOM树中
``` js
App.onMount(() => {
    console.log('this is mounted');
    document.querySelector('#root').appendChild(window.Berserk.app);
});

## 2. 设计思想

我没有深入接触过vue，但是MVVM是现代前端领域的重要思想，故自己动手写一个MVVM简易框架来加深对此的理解


- MVVM

Berserk的响应式基础是`Object.defineProperty`，通过观察者模式，进行依赖收集，在必要时进行更新，实现双向数据绑定（Two-way data binding）。

- template

HTML部分由模板字符串直接生成至真实DOM，再通过递归对每一个元素添加Berserk api的能力。

- component

Berserk是将所有声明过的组件都注册在`window.Berserk`这个对象里，这样将有利于组件间的任意调用和外部组件的引入。




