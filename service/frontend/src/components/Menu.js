import React from "react";
import {Link} from "react-router-dom";

const MenuItem = ({menu_item, auth, logout}) => {
    return (
        <Link className="nav-link link-light" to={menu_item.link}>{menu_item.name}</Link>
    )
}

const AuthMenu = ({auth, logout}) => {
    if (auth.is_authenticated) {
        return (
            <>
                <span className="text-info">{auth.username}</span>
                <Link className="nav-link link-light" to="/login/" onClick={() => logout()}>Выход</Link>
            </>
        )
    }
    return (
        <Link className="nav-link link-light" to="/login/">Вход</Link>
    )
}

const Menu = ({menu, auth, logout}) => {
    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-secondary">
            <div className="container">
                <div className="navbar-collapse collapse">
                    {menu.map((menu_item, i) => <MenuItem menu_item={menu_item} key={i}/>)}
                </div>
                {<AuthMenu auth={auth} logout={() => logout()}/>}
            </div>
        </nav>
    )
}

export {Menu}