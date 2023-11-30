import React from "react";

export default class ClassEffectCom extends React.Component {
    state = {
        count: 0,
    }

    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any): void {
        
    }

    render(): React.ReactNode {
        return (
            <div>
                <div>
                    count：{this.state.count}
                </div>
                <button onClick={() => {
                    this.setState({
                        count: this.state.count + 1,
                    })
                }}>
                    增加count
                </button>
                <button onClick={() => {
                    setTimeout(() => {
                        alert(`count：${this.state.count}`); 
                    }, 3000);
                }}>
                    显示count
                </button>
            </div>
        )
    }
}