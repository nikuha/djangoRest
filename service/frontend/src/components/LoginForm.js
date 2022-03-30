import React from "react";

class LoginForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    handleOnChange(event) {
        this.setState({[event.target.name]: event.target.value})
    }

    handleOnSubmit(event) {
        event.preventDefault()
        this.props.login(this.state.username, this.state.password)
    }

    render() {
        return (
            <form className="text-center" onSubmit={(event) => this.handleOnSubmit(event)}>
                <div className="form-group mt-3">
                    <div className="col-md-3 margin-center">
                        <input type="text" name="username" className="form-control"
                               placeholder="Логин" onChange={(event) => this.handleOnChange(event)}/>
                    </div>
                </div>
                <div className="form-group mt-3">
                    <div className="col-md-3 margin-center">
                        <input type="password"  name="password" className="form-control" placeholder="Пароль"
                               onChange={(event) => this.handleOnChange(event)}/>
                    </div>
                </div>
                <div className="form-group mt-3">
                    <button type="submit" className="btn btn-primary">Вход</button>
                </div>
            </form>
        )
    }
}

export default LoginForm