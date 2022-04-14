import React from 'react';
import axios from 'axios';
import './App.css';
import UserList from './components/User';
import {ProjectInfo, ProjectList} from './components/Project';
import TodoList from "./components/Todo";
import {Menu} from './components/Menu';
import Footer from './components/Footer';
import PageNotFound from './components/PageNotFound';
import LoginForm from "./components/LoginForm";
import ProjectForm from "./components/ProjectForm";
import TodoForm from "./components/TodoForm";

import {HashRouter, Routes, Route, Navigate} from "react-router-dom";
import Cookies from 'universal-cookie';


const API_ROOT = 'http://185.46.10.244:8000/';
const API_VERSION = 'v1';
const getApiUrl = (method, use_version) => {
    if (use_version) {
        return `${API_ROOT}api/${API_VERSION}/${method}/`
    }
    return `${API_ROOT}api/${method}/`
};

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            menu: [],
            users: [],
            projects: [],
            filteredProjects: [],
            todos: [],
            project: {},
            auth: {username: '', is_authenticated: false},
            projectsFilters: {text: ''},
            todosFilters: {project: ''}
        }
    }

    getApiData(name, selected_project) {
        const config = {headers: this.getHeaders()}
        if (name === 'todos' && this.state.todosFilters.project !== '') {
            config['params'] = {project: this.state.todosFilters.project}
        }
        axios.get(getApiUrl(name, true), config)
            .then(response => {
                const callback = name === 'projects' ? () => this.filterProjects() : null;
                this.setState({[name]: response.data.results}, callback)
            }).catch(error => {
                this.checkStatus(error.response.status, () => this.getApiData(name, selected_project))
            })
    }

    getProject(uid) {
        const headers = this.getHeaders()
        axios.get(getApiUrl(`projects/${uid}`, true), {headers})
            .then(response => {
                this.setState({project: response.data})
            }).catch(error => {
                this.checkStatus(error.response.status, () => this.getProject(uid))
            })
    }

    deleteItem(uid, modelName, ruModelName) {
        if (window.confirm(`Вы действительно хотите удалить ${ruModelName}?`)) {
            const headers = this.getHeaders()
            axios.delete(getApiUrl(`${modelName}/${uid}`, true), {headers})
                .then(response => {
                    const callback = modelName === 'projects' ? () => this.filterProjects() : null;
                    this.setState({[modelName]: this.state[modelName].filter((item) => item.uid !== uid)},
                        callback)
                }).catch(error => {
                    this.checkStatus(error.response.status,
                        () => {this.deleteItem(uid, modelName, ruModelName)}
                    )
                })
        }
    }

    createItem(data, modelName) {
        // console.log(data)
        const headers = this.getHeaders()
        axios.post(getApiUrl(`${modelName}`, true),
            data,
            {headers})
            .then(response => {
                let item = response.data
                this.setState({[modelName]: [item, ...this.state[modelName]]})
                this.getApiData(modelName)
            }).catch(error => {
                this.checkStatus(error.response.status,
                    () => {this.createItem(data, modelName)}
                )
            })
    }

    deleteTodo(uid) {
        this.deleteItem(uid, 'todos', 'задачу')
    }

    deleteProject(uid) {
        this.deleteItem(uid, 'projects', 'проект')
    }

    filterProjects() {
        let filteredProjects;
        if (this.state.projectsFilters.text !== '') {
            filteredProjects = this.state.projects.filter(el => {
                return new RegExp(this.state.projectsFilters.text, 'i').test(el.name)
            });
        } else {
            filteredProjects = this.state.projects;
        }

        this.setState({filteredProjects: filteredProjects})
    }

    searchProject(event) {
        this.setState({projectsFilters: {text: event.target.value}},
            () => this.filterProjects())
    }

    selectProject(event) {
        this.setState({todosFilters: {project: event.target.value}},
            () => this.getApiData('todos'))
    }

    createProject(projectData) {
        this.createItem(projectData, 'projects')
    }

    createTodo(todoData) {
        this.createItem(todoData, 'todos')
    }

    setAuthState(username, is_authenticated) {
        this.setState({
                auth: {username: username, is_authenticated: is_authenticated}
            },
            () => this.loadData()
        )
    }

    getTokenFromStorage() {
        const cookies = new Cookies()
        const is_authenticated = cookies.get('access') && cookies.get('access') !== ''
        const username = cookies.get('username')
        this.setAuthState(username, is_authenticated)
    }

    login(username, password) {
        axios.post(getApiUrl('jwt/token'), {username: username, password: password})
            .then(response => {
                const cookies = new Cookies()
                cookies.set('access', response.data.access)
                cookies.set('refresh', response.data.refresh)
                cookies.set('username', username)
                this.setAuthState(username, true)
            }).catch(error => alert('Неверные данные авторизации!'))
    }

    checkStatus(statusCode, success_callback) {
        if (statusCode === 401) {
            this.refresh(success_callback)
        }
    }

    refresh(success_callback) {
        const cookies = new Cookies()
        const refresh = cookies.get('refresh')
        axios.post(getApiUrl('jwt/token/refresh'), {refresh: refresh})
            .then(response => {
                const username = cookies.get('username')
                cookies.set('access', response.data.access)
                this.setAuthState(username, true)
                if (success_callback) {
                    success_callback()
                }
            }).catch(error => this.logout())
    }

    logout() {
        const cookies = new Cookies()
        cookies.remove('access')
        cookies.remove('refresh')
        this.setAuthState('', false)
    }

    getHeaders() {
        let headers = {'Content-Type': 'application/json'}
        if (this.state.auth.is_authenticated) {
            const cookies = new Cookies()
            headers['Authorization'] = 'Bearer ' + cookies.get('access')
        }
        return headers
    }

    loadData() {
        if (this.state.auth.is_authenticated) {
            this.getApiData('users')
            this.getApiData('projects')
            this.getApiData('todos')
        } else {
            this.setState({users: [], projects: [], todos: []})
        }
    }

    componentDidMount() {
        this.getTokenFromStorage()
        const menu = [
            {name: 'Пользователи', link: '/users/'},
            {name: 'Проекты', link: '/projects/'},
            {name: 'Todo', link: '/todos/'}
        ]
        this.setState({'menu': menu})
    }

    routers() {
        if (this.state.auth.is_authenticated) {
            return (
                <Routes>
                    <Route path="/users/" element={<UserList users={this.state.users}/>}/>
                    <Route path="/projects/" element={<ProjectList
                        projects={this.state.filteredProjects}
                        projectsFilters={this.state.projectsFilters}
                        deleteProject={(uid) => this.deleteProject(uid)}
                        searchProject={(event) => this.searchProject(event)}/>}/>
                    <Route path="/project/:uid/" element={<ProjectInfo project={this.state.project}
                                                                       getProject={(uid) => this.getProject(uid)}/>}/>
                    <Route path="/project/create/" element={<ProjectForm
                        createProject={(projectData) => this.createProject(projectData)}
                        users={this.state.users}/>}/>
                    <Route path="/todos/" element={<TodoList todos={this.state.todos} projects={this.state.projects}
                                                             todosFilters={this.state.todosFilters}
                                                             deleteTodo={(uid) => this.deleteTodo(uid)}
                                                             selectProject={(event) => this.selectProject(event)}/>}/>
                    <Route path="/todo/create/" element={<TodoForm
                        createTodo={(todoData) => this.createTodo(todoData)}
                        projects={this.state.projects}
                        users={this.state.users}/>}/>
                    <Route path="/login/" element={<Navigate replace to="/projects"/>}/>}/>
                    <Route path="/" element={<Navigate replace to="/users/"/>}/>
                    <Route path="*" element={<PageNotFound/>}/>
                </Routes>
            )
        }
        return (
            <Routes>
                <Route path="/" element={<Navigate replace to="/login/"/>}/>
                <Route path="/users/" element={<Navigate replace to="/login/"/>}/>
                <Route path="/projects/" element={<Navigate replace to="/login/"/>}/>
                <Route path="/todos/" element={<Navigate replace to="/login/"/>}/>
                <Route path="/login/" element={
                    <LoginForm login={(username, password) => this.login(username, password)}/>}/>
                <Route path="*" element={<PageNotFound/>}/>
            </Routes>
        )
    }

    render() {
        return (
            <div className="d-flex flex-column min-vh-100">
                <HashRouter>
                    <Menu menu={this.state.menu} auth={this.state.auth} logout={() => this.logout()}/>
                    <div className="container">
                        {this.routers()}
                    </div>
                </HashRouter>

                <Footer/>
            </div>
        )
    }
}

export default App;
