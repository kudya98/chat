import React, { Component } from 'react';


class MessageForm extends Component {

    render() {
        return (
                <form onSubmit={(e)=>this.props.onSubmit(e)} className="message-form" action="">
                    <input maxLength={600} autoComplete="off"/>
                    <button >Отправить</button>
                </form>

        );
    }
}
export default MessageForm;