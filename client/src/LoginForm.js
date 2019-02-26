import React, { Component } from 'react';


class LoginForm extends Component {

    render() {
        return (
            <form className="login-form"  action="">
            <input placeholder={"Логин"} name="lgn" maxLength={20} autoComplete="off"/>
                <input placeholder={"Пароль"} name="psw" maxLength={20} autoComplete="off"/>
            <button onClick={(e)=>{this.props.onSubmit(e)}}>Вход</button>
                <button onClick={(e)=>{this.props.onSignUp(e)}}>Регистрация</button>
    </form>
        );
    }
}
export default LoginForm;