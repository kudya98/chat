import React, { Component } from 'react';
import './App.css';
import ChatWindow from './ChatWindow';
import $ from 'jquery';
import axios from 'axios';
import MessageForm from "./MessageForm";
import Users from "./Users";
import io from "socket.io-client";
import LogWindow from "./LogWindow";


class App extends Component {
    constructor(props) {
        super(props);
        const socket = io('http://localhost:3002/',{query:{username:this.props.username}});
        this.state={username:this.props.username,socket:socket,logs:[],clients:[],messages:[]};
        this.updateClients();
        //this.updateMessages();
        socket.on('update-clients', () => {
            this.updateClients();
        });
        socket.on('chat message', (msg) => {
            this.updateMessages(msg);
        });
        socket.on('disconnect', () => {

        });
    }
    updateClients(){
        axios.get("/api/Clients")
            .then(res=>res.data)
            .then(data=>this.setState({clients:data}))
    }
    newMessage(e){
              e.preventDefault();
        this.state.socket.emit('chat message', {content:$('.message-form>input').val(),sender:this.state.username});
                $('.message-form>input').val('');
                return false;
    }
    updateMessages(msg){
        if(msg) {
            if (msg.log) {
                let logs = this.state.logs;
                logs.push(msg);
                this.setState({logs: logs});
                $('.log-window').scrollTop($('.chat-window')[0].scrollHeight);
            } else {
                let messages = this.state.messages;
                messages.push(msg);
                this.setState({messages: messages});
                $('.chat-window').scrollTop($('.chat-window')[0].scrollHeight);
            }
        } /*else{
            axios.get("/api/Messages")
                .then(res=>res.data)
                .then(data=>this.setState({messages:data}))
        }*/ //История чата
    }
  render() {
    return (
      <div className="chat">
          <div className={"left-bar"}>
          <Users current_user={this.state.username} users={this.state.clients}/>
          <LogWindow logs={this.state.logs}/>
          </div>
         <ChatWindow current_user={this.state.username} messages={{messages:this.state.messages}}/>
          <MessageForm onSubmit={(e)=>this.newMessage(e)}/>
      </div>
    );
  }
}

export default App;

