import React from "react";
import {Link} from "react-router-dom";

const MenuItem = ({menu_item, auth, logout}) => {
    return (
        <Link className="nav-link" to={menu_item.link}>{menu_item.name}</Link>
    )
}

const AuthMenu = ({auth, logout}) => {
    if (auth.is_authenticated) {
        return (
            <>
                <span>{auth.username}</span>
                <Link className="nav-link" to="/login/" onClick={() => logout()}>Выход</Link>
            </>
        )
    }
    return (
        <Link className="nav-link" to="/login/">Вход</Link>
    )
}

const Menu = ({menu, auth, logout}) => {
    return (
        <nav className="navbar navbar-light bg-light">
            {menu.map((menu_item, i) => <MenuItem menu_item={menu_item} key={i}/>)}
            {<AuthMenu auth={auth} logout={() => logout()}/>}
        </nav>
    )
}

export {Menu}