const UserItem = ({user}) => {
    return (
        <tr>
            <td>{user.username}</td>
            <td>{user.first_name}</td>
            <td>{user.last_name}</td>
            <td>{user.email}</td>
        </tr>
    )
}

const UserList = ({users}) => {
    return (
        <table>
            <th>Логин</th>
            <th>Имя</th>
            <th>Фамилия</th>
            <th>E-Mail</th>
            {users.map((user) => <UserItem user={user}/>)}
        </table>
    )
}

export default UserList