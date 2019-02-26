import React, { Component } from 'react';


class ChatWindow extends Component {
    render() {
        return (
            <div className="chat-window">
                {this.props.messages.messages.map((item, i) => {
                            return <div key={i} className={"message"+
                            (this.props.current_user===item.sender ? ' client' : '')}>
                                <div className="message-sender">{item.sender}</div>
                                <div className="message-content">{item.content}</div>
                            </div>
                    }
                )}
            </div>
        );
    }
}
export default ChatWindow;