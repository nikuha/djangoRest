import React from "react";
import {Navigate} from "react-router-dom";

class ProjectForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectData: {
                name: '',
                repository: '',
                users: []
            },
            isAdded: false
        }
    }

    handleOnChange(event) {
        const projectData = this.state.projectData
        if(event.target.name === 'users') {
            const selected = document.querySelectorAll('#select-users option:checked');
            projectData[event.target.name] = Array.from(selected).map(el => el.value);
        } else {
            projectData[event.target.name] =  event.target.value
        }
        this.setState({'projectData': projectData})
    }

    handleOnSubmit(event) {
        event.preventDefault()
        this.props.createProject(this.state.projectData)
        this.setState({isAdded: true})
    }

    render() {
        if(this.state.isAdded) {
            return <Navigate replace to="/projects"/>
        }
        return (
            <>
                <h4 className="mt-4 text-center">
                    Добавление проекта
                </h4>
                <form className="mt-4 text-center" onSubmit={(event) => this.handleOnSubmit(event)}>
                    <div className="form-group mt-3">
                        <div className="col-md-3 margin-center">
                            <input type="text" name="name" className="form-control"
                                   placeholder="Название" onChange={(event) => this.handleOnChange(event)}/>
                        </div>
                    </div>
                    <div className="form-group mt-3">
                        <div className="col-md-3 margin-center">
                            <input type="text" name="repository" className="form-control" placeholder="Репозиторий"
                                   onChange={(event) => this.handleOnChange(event)}/>
                        </div>
                    </div>
                    <div className="form-group mt-3">
                        <div className="col-md-3 margin-center">
                            <select className="form-select" name="users" multiple id="select-users"
                                    onChange={(event) => this.handleOnChange(event)}>
                                {this.props.users.map((user, key) => (
                                    <option value={user.uid} key={key}>{user.firstName}</option>
                                ))}
                            </select>
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

export default ProjectForm