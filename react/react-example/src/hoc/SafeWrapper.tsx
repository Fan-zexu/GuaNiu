import * as React from "react";

interface IState {
    showError: boolean;
}

export default function SafeWrapperHoc(Component: React.ComponentType) {
    return class SafeComp extends React.Component<any, IState> {
        state = {
            showError: false,
        }

        // not work 
        // static getDerivedStateFromError() {
        //     console.log('getDerivedStateFromError');
            
        //     return { showError: true };
        // }

        componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
            console.log('componentDidCatch,,,', error, errorInfo);
            this.setState({
                showError: true
            })
        }


        render(): React.ReactNode {
            const { showError } = this.state;
            return (
                showError ? (
                    <div>渲染错误</div>
                ) : <Component {...this.props}/>
            )
        }
    }
}