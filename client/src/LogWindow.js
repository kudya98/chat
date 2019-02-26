import React, { Component } from 'react';


class LogWindow extends Component {

    render() {
        return (
            <div className="log-window">
                {this.props.logs.map((item, i) => {
                        return <div key={i} className={"message log"}>
                            <div className="message-content">{item.content}</div>
                        </div>
                    }
                )}
            </div>
        );
    }
}
export default LogWindow;