# TS在react中的应用手册

[官方备忘录](https://react-typescript-cheatsheet.netlify.app/docs/basic/setup)

## 函数组件

```ts
interface IProps {
};

const compA = React.FC<IProps> = (props) => ()

const compB = (props: IProps) => ()
```

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