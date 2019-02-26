import React, { Component } from 'react';


class Users extends Component {

    render() {
        return (
            <div className="users">
                <div className="user client">{this.props.current_user}</div>
                <div className={"users-info"}>{"Участников: "+this.props.users.length}</div>
                {this.props.users.map((item, i) =>
                    <div key={item}  className="user">{item}</div>
                )}

            </div>
        );
    }
}
export default Users;