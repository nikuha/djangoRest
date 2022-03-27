import React from 'react';
import axios from 'axios';
import './App.css';
import UserList from './components/User';
import {ProjectInfo, ProjectList} from './components/Project';
import TodoList from "./components/Todo";
import Menu from './components/Menu';
import Footer from './components/Footer';
import PageNotFound from './components/PageNotFound';
import LoginForm from "./components/LoginForm";

import {HashRouter, Routes, Route, Navigate} from "react-router-dom";
import Cookies from 'universal-cookie';


const API_ROOT = 'http://127.0.0.1:8000/';
const getApiUrl = (method) => `${API_ROOT}api/${method}/`;
const getAuthUrl = (method) => `${API_ROOT}${method}/`;

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            menu: [],
            users: [],
            projects: [],
            todos: [],
            project: {},
            token: ''
        }
    }

    getApiData(name) {
        const headers = this.getHeaders()
        axios.get(getApiUrl(name), {headers})
            .then(response => {
                this.setState({[name]: response.data.results})
            }).catch(error => console.log(error))
    }

    getProject(uid) {
        const headers = this.getHeaders()
        axios.get(getApiUrl(`projects/${uid}`), {headers})
            .then(response => {
                this.setState({project: response.data})
            }).catch(error => {
                this.setState({project: {uid: uid}})
            })
    }

    setToken(token) {
        const cookies = new Cookies()
        cookies.set('token', token)
        this.setState({token: token})
        this.loadData()
    }

    getTokenFromStorage() {
        const cookies = new Cookies()
        const token = cookies.get('token')
        this.setState({'token': token}, ()=>this.loadData())
    }

    login(username, password) {
        axios.post(getAuthUrl(`api-token-auth`), {username: username, password: password})
            .then(response => {
                this.setToken(response.data.token)
            }).catch(error => alert('Неверные данные авторизации!'))
    }

    logout() {
        this.setToken('')
    }

    is_authenticated() {
        return this.state.token && this.state.token.length;
    }

    getHeaders() {
        let headers = {'Content-Type': 'application/json'}
        if (this.is_authenticated()) {
            headers['Authorization'] = 'Token ' + this.state.token
        }
        return headers
    }

    loadData() {
        if(this.is_authenticated()){
            this.getApiData('users')
            this.getApiData('projects')
            this.getApiData('todos')
        }
        else {
            this.setState({users: [], projects: [], todos: []})
        }
    }

    componentDidMount() {
        this.getTokenFromStorage()
        const menu = [
            {name: 'Пользователи', link: '/'},
            {name: 'Проекты', link: '/projects/'},
            {name: 'Todo', link: '/todos/'},
            {name: 'Вход', link: '/login/'}
        ]
        this.setState({'menu': menu})
    }

    render() {
        return (
            <div className="container d-flex flex-column min-vh-100">
                <HashRouter>
                    <Menu menu={this.state.menu} is_authenticated={() => this.is_authenticated()}
                        logout={() => this.logout()}/>
                    <Routes>
                        <Route path="/" element={this.is_authenticated() ?
                            <UserList users={this.state.users}/> :
                            <Navigate replace to="/login/" />} />
                        <Route path="/projects/" element={<ProjectList projects={this.state.projects}/>} />
                        <Route path="/project/:uid/" element={<ProjectInfo project={this.state.project}
                                                                           getProject={(uid) => this.getProject(uid)}/>}/>
                        <Route path="/todos/" element={<TodoList todos={this.state.todos}/>} />
                        <Route path="/users/" element={<Navigate replace to="/" />} />
                        <Route path="/login/" element={this.is_authenticated() ? <Navigate replace to="/projects" /> :
                            <LoginForm login={(username, password) => this.login(username, password)}/>} />
                        <Route path="*"  element={<PageNotFound/>} />
                    </Routes>
                </HashRouter>

                <Footer/>
            </div>
        )
    }
}

export default App;
