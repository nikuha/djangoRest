import React from 'react';
import axios from 'axios'
import './App.css';
import UserList from './components/User'
import Menu from './components/Menu'
import Footer from './components/Footer'

class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            'users': [],
            'menu': []
        }
    }

    componentDidMount() {
        const menu = [
            {
                'name': 'Пользователи',
                'link': '/'
            }
        ]
        this.setState({'menu': menu})

        axios.get('http://127.0.0.1:8000/api/users/')
            .then(response => {
                const users = response.data
                this.setState({'users': users})
            }).catch(error => console.log(error))

    }

    render() {
        return (
            <div className="container">
                <header>
                    <Menu menu={this.state.menu}/>
                </header>

                <main>
                    <UserList users={this.state.users}/>
                </main>

                <footer>
                    <Footer/>
                </footer>

            </div>
        );
    }
}

export default App;
