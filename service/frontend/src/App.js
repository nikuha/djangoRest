import React from 'react';
import axios from 'axios';
import './App.css';
import UserList from './components/User';
import {ProjectInfo, ProjectList} from './components/Project';
import TodoList from "./components/Todo";
import Menu from './components/Menu';
import Footer from './components/Footer';
import PageNotFound from './components/PageNotFound';

import {HashRouter, Routes, Route, Navigate} from "react-router-dom";

const API_ROOT = 'http://127.0.0.1:8000/api/';
const get_api_url = (method) => `${API_ROOT}${method}/`;

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            'menu': [],
            'users': [],
            'projects': [],
            'todos': [],
            'project': {}
        }
    }

    getApiData(name) {

        axios.get(get_api_url(name))
            .then(response => {
                this.setState({[name]: response.data.results})
            }).catch(error => console.log(error))

    }

    getProject(uid) {

        // this.setState({project: {}});
        axios.get(get_api_url(`projects/${uid}`))
            .then(response => {
                this.setState({project: response.data})
            }).catch(error => {
                this.setState({project: {uid: uid}})
            })

    }

    componentDidMount() {
        const menu = [
            {
                'name': 'Пользователи',
                'link': '/'
            },
            {
                'name': 'Проекты',
                'link': '/projects/'
            },
            {
                'name': 'Todo',
                'link': '/todos/'
            }
        ]
        this.setState({'menu': menu});

        this.getApiData('users');
        this.getApiData('projects');
        this.getApiData('todos');
    }

    render() {
        return (
            <div className="container">
                <HashRouter>
                    <Menu menu={this.state.menu}/>
                    <Routes>
                        <Route path="/" element={<UserList users={this.state.users}/>} />
                        <Route path="/projects" element={<ProjectList projects={this.state.projects}/>} />
                        <Route path="/project/:uid/" element={<ProjectInfo project={this.state.project}
                                                                           getProject={(uid) => this.getProject(uid)}/>}/>
                        <Route path="/todos" element={<TodoList todos={this.state.todos}/>} />
                        <Route path="/users" element={<Navigate replace to="/" />} />
                        <Route path="*"  element={<PageNotFound/>} />
                    </Routes>
                </HashRouter>

                <Footer/>
            </div>
        );
    }
}

export default App;
