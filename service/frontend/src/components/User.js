const UserItem = ({user}) => {
    return (
        <tr>
            <td>{user.username}</td>
            <td>{user.firstName}</td>
            <td>{user.lastName}</td>
            <td>{user.email}</td>
        </tr>
    )
}

const UserList = ({users}) => {
    return (
        <table className="table mt-2">
            <thead>
                <tr>
                    <th>Логин</th>
                    <th>Имя</th>
                    <th>Фамилия</th>
                    <th>E-Mail</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user, i) => <UserItem user={user} key={i}/>)}
            </tbody>
        </table>
    )
}

export default UserList