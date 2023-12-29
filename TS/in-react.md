# TS在react中的应用手册

[官方备忘录](https://react-typescript-cheatsheet.netlify.app/docs/basic/setup)

## 函数组件

```ts
interface IProps {
};

const compA: React.FC<IProps> = (props) => (<div>函数表达式形式的组件</div>)

const compB = (props: IProps) => ()
```

---

除了`React.FC`之外，还有另一种形式:

```js
function CompC(): React.ReactNode {
    return <div>声明式函数组件</div>
}
```

这里使用`React.ReactNode`定义，是因为`function CompC`返回的是一个**声明**，而`compA`返回的是一个**函数**，既不是值也是不是表达式，所以需要用`React.FC`定义为一个函数组件


## HOC

- `HOC`既可以接收一个类组件，也可以接收函数组件，所以类型是`React.ComponentType`

- 源码：`type ComponentType = <P = {}>ComponentClass<P> | FunctionComponent<P>`

```ts
import * as React from 'react';

interface ILoading {
    loading: boolean;
}

function loadingHOC<P>(WrappedComponent: React.ComponentType<P>) {
    return class LoadingComponent extends React.Component<P & ILoading> {
        render() {
            const { loading } = this.props;
            return loading ? <span>loading...</span> : <WrappedComponent {...this.props as P}/>
        }
    }
}
```

## 关于注释

使用`TSDoc`，`/** comment */`

```ts
type Props = {
    /** background color */
    colors: string;
}
```

## 关于 type 还是 interface 的选择

> [官方参考](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example/#types-or-interfaces)

> Here's a helpful rule of thumb:

- always use interface for public API's definition when authoring a library or 3rd party ambient type definitions, as this allows a consumer to extend them via declaration merging if some definitions are missing.
- consider using type for your React Component Props and State, for consistency and because it is more constrained.

网上有很多关于这个问题的讨论，我个人认为不需要纠结。

优先使用`interface`，需要时候使用`type`