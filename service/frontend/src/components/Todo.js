const TodoItem = ({todo}) => {
    return (
        <tr>
            <td>{todo.text}</td>
            <td>{todo.user.firstName} {todo.user.lastName}</td>
            <td>{todo.created}</td>
        </tr>
    )
}

const TodoList = ({todos}) => {
    return (
        <table className="table mt-2">
            <thead>
                <tr>
                    <th>Что сделать</th>
                    <th>Пользователь</th>
                    <th>Создано</th>
                </tr>
            </thead>
            <tbody>
                {todos.map((todo, i) => <TodoItem todo={todo} key={i}/>)}
            </tbody>
        </table>
    )
}

export default TodoList