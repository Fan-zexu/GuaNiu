# TS在react中的应用手册

[官方备忘录](https://react-typescript-cheatsheet.netlify.app/docs/basic/setup)

## 函数组件

```ts
interface IProps {
};

const compA = React.FC<IProps> = (props) => (<div>函数表达式形式的组件</div>)

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
