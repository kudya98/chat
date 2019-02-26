import React, { Component } from 'react';


class RegistrationForm extends Component {

    render() {
        return (
            <form className="registration-form"  action="">
                <input placeholder={"Логин"} name="lgn" maxLength={20} autoComplete="off"/>
                <input placeholder={"Пароль"} name="psw" maxLength={20} autoComplete="off"/>
                <button onClick={(e)=>{this.props.onSubmit(e)}}>Регистрация</button>
                <button type="button" onClick={(e)=>{this.props.onClose(e)}}>Отмена</button>
            </form>
        );
    }
}
export default RegistrationForm;