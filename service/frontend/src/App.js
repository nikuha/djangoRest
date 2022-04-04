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

import {HashRouter, Routes, Route, Navigate} from "react-router-dom";
import Cookies from 'universal-cookie';


const API_ROOT = 'http://127.0.0.1:8000/';
const API_VERSION = 'v1';
const getApiUrl = (method, use_version) => {
    if(use_version) {
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
            todos: [],
            project: {},
            auth: {username: '', is_authenticated: false}
        }
    }

    getApiData(name) {
        const headers = this.getHeaders()
        axios.get(getApiUrl(name, true), {headers})
            .then(response => {
                this.setState({[name]: response.data.results})
            }).catch(error => {
                if(error.response.status === 401){
                    this.refresh()
                }
            })
    }

    getProject(uid) {
        const headers = this.getHeaders()
        axios.get(getApiUrl(`projects/${uid}`, true), {headers})
            .then(response => {
                this.setState({project: response.data})
            }).catch(error => {
                if(error.response.status === 401){
                    this.refresh()
                }
                this.setState({project: {uid: uid}})
            })
    }

    setAuthState(username, is_authenticated) {
        this.setState({
            auth: {username: username, is_authenticated: is_authenticated}},
            ()=>this.loadData()
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

    refresh() {
        const cookies = new Cookies()
        const refresh = cookies.get('refresh')
        axios.post(getApiUrl('jwt/token/refresh'), {refresh: refresh})
            .then(response => {
                const username = cookies.get('username')
                cookies.set('access', response.data.access)
                this.setAuthState(username, true)
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
        if(this.state.auth.is_authenticated){
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
            {name: 'Todo', link: '/todos/'}
        ]
        this.setState({'menu': menu})
    }

    render() {
        return (
            <div className="d-flex flex-column min-vh-100">
                <HashRouter>
                    <Menu menu={this.state.menu} auth={this.state.auth} logout={() => this.logout()}/>
                    <div className="container">
                        <Routes>
                            <Route path="/" element={this.state.auth.is_authenticated ?
                                <UserList users={this.state.users}/> :
                                <Navigate replace to="/login/" />} />
                            <Route path="/projects/" element={this.state.auth.is_authenticated ?
                                <ProjectList projects={this.state.projects}/>:
                                <Navigate replace to="/login/" />} />
                            <Route path="/project/:uid/" element={this.state.auth.is_authenticated ?
                                <ProjectInfo project={this.state.project} getProject={(uid) => this.getProject(uid)}/> :
                                <Navigate replace to="/login/" />}/>
                            <Route path="/todos/" element={this.state.auth.is_authenticated ?
                                <TodoList todos={this.state.todos}/>:
                                <Navigate replace to="/login/" />} />
                            <Route path="/users/" element={<Navigate replace to="/" />} />
                            <Route path="/login/" element={this.state.auth.is_authenticated ? <Navigate replace to="/projects" /> :
                                <LoginForm login={(username, password) => this.login(username, password)}/>} />
                            <Route path="*"  element={<PageNotFound/>} />
                        </Routes>
                    </div>
                </HashRouter>

                <Footer/>
            </div>
        )
    }
}

export default App;
