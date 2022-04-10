import { format } from 'date-fns'
import {Link} from "react-router-dom";
import React from "react";

const formatDate = (date) => {
    return format(new Date(date), 'dd.mm.yyyy H:mm')
}

const TodoItem = ({todo, deleteTodo}) => {
    return (
        <tr className={todo.done ? 'opacity-50' : ''}>
            <td>{todo.project.name}</td>
            <td>{todo.text}</td>
            <td>{todo.user.firstName} {todo.user.lastName}</td>
            <td>{formatDate(todo.created)}</td>
            <td>
                <button className="btn btn-danger"
                        onClick={(uid) => deleteTodo(todo.uid)}>
                    Удалить
                </button>
            </td>
        </tr>
    )
}

const TodoList = ({todos, deleteTodo}) => {
    return (
        <>
            <div className="mt-4 text-right">
                <Link to="/todo/create/"><button className="btn btn-info float-right">Добавить замметку</button></Link>
            </div>
            <table className="table mt-2">
                <thead>
                    <tr>
                        <td>Проект</td>
                        <th>Что сделать</th>
                        <th>Пользователь</th>
                        <th>Создано</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {todos.map((todo, i) => <TodoItem todo={todo} deleteTodo={(uid) => deleteTodo(uid)} key={i}/>)}
                </tbody>
            </table>
        </>
    )
}

export default TodoList