import React from "react";
import {Navigate} from "react-router-dom";

class TodoForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todoData: {
                project: null,
                user: null,
                text: '',
                done: false
            },
            isAdded: false
        }
    }

    setDefaultValue(key) {
        const todoData = this.state.todoData
        todoData[key] =  document.querySelector(`#select-${key}-for-todo`).value
        this.setState({'todoData': todoData})
    }

    handleOnChange(event) {
        const todoData = this.state.todoData
        todoData[event.target.name] =  event.target.value
        this.setState({'todoData': todoData})
    }

    handleOnSubmit(event) {
        event.preventDefault()
        if(!this.state.todoData.project) {
            this.setDefaultValue('project')
        }
        if(!this.state.todoData.user) {
            this.setDefaultValue('user')
        }
        this.props.createTodo(this.state.todoData)
        this.setState({isAdded: true})
    }

    render() {
        if(this.state.isAdded) {
            return <Navigate replace to="/todos"/>
        }
        return (
            <>
                <h4 className="mt-4 text-center">
                    Добавление задания
                </h4>
                <form className="mt-4 text-center" onSubmit={(event) => this.handleOnSubmit(event)}>
                    <div className="form-group mt-3">
                        <div className="col-md-3 margin-center">
                            <select className="form-select shadow-none" name="project" id="select-project-for-todo"
                                    onChange={(event) => this.handleOnChange(event)}>
                                {this.props.projects.map((project, key) => (
                                    <option value={project.uid} key={key}>{project.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="form-group mt-3">
                        <div className="col-md-3 margin-center">
                            <select className="form-select shadow-none" name="user" id="select-user-for-todo"
                                    onChange={(event) => this.handleOnChange(event)}>
                                {this.props.users.map((user, key) => (
                                    <option value={user.uid} key={key}>{user.firstName} {user.lastName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="form-group mt-3">
                        <div className="col-md-3 margin-center">
                            <textarea name="text" className="form-control shadow-none" placeholder="Текст задания" required=""
                                      onChange={(event) => this.handleOnChange(event)}>
                            </textarea>
                        </div>
                    </div>
                    <div className="form-group mt-3">
                        <button type="submit" className="btn btn-primary">Добавить</button>
                    </div>
                </form>
            </>
        )
    }
}

export default TodoForm