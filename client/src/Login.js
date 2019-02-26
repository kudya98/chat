import React, { Component } from 'react';
import App from "./App";
import $ from 'jquery';
import axios from 'axios';
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";

class Login extends Component {
    constructor(props){
        super(props);
        this.state={logged:false,registration:false};
        this.check();
    }
    check(){
        axios.get("http://localhost:3000/api/session")
            .then(res=>res.data)
            .then(data=> {
                    if (data.logged) this.setState({username: data.username, logged: true})
                }
            )
    }
    auth(e){
        e.preventDefault();
        axios.post("http://localhost:3000/api/auth",
            {username:$('.login-form>input[name="lgn"]').val(),
                password:$('.login-form>input[name="psw"]').val()})
            .then(res=>res.data)
            .then(data=>this.setState({username:data.username,logged:true}))
            .catch((err)=>alert('User not found or password incorrect'))
        return false;
    }
    signup_form(e){
        e.preventDefault();
        this.setState({registration:true});
    }
    close_signup_form(e){
        this.setState({registration:false});
    }
    signup(e){
        e.preventDefault();
        if ($('.registration-form>input[name="lgn"]').val().substr(0, 1).match(/[A-Za-zА-Яа-я]/) == null){
            alert("Недопустимое имя");
            return false;
        }
        if ($('.registration-form>input[name="lgn"]').val().length<4){
            alert("Слишком короткий логин");
            return false;
        }
        if ($('.registration-form>input[name="psw"]').val().length<4){
            alert("Слишком короткий пароль");
            return false;
        }
        axios.post("http://localhost:3000/api/registration",
            {username:$('.registration-form>input[name="lgn"]').val(),
                password:$('.registration-form>input[name="psw"]').val()})
            .then(res=>res.data)
            .then(data=>{alert(data);this.setState({registration:false})})
            .catch((err)=>alert(err))
        return false;
    }
    render() {

        if (this.state.logged)
            return <App username={this.state.username} session={this.state.id}/>;
        else if (this.state.registration) return <RegistrationForm onSubmit={(e)=>this.signup(e)} onClose={(e)=>this.close_signup_form(e)}/>;
            else return <LoginForm onSubmit={(e)=>{this.auth(e)}} onSignUp={(e)=>this.signup_form(e)}/>
    }
}

export default Login;