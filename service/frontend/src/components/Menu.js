import React from "react";
import {Link} from "react-router-dom";

const MenuItem = ({menu_item, is_authenticated, logout}) => {
    if(menu_item.link.includes('login') && is_authenticated()){
        return (
           <Link className="nav-link" to={menu_item.link} onClick={() => logout()}>Выход</Link>
        )
    }
    return (
        <Link className="nav-link" to={menu_item.link}>{menu_item.name}</Link>
    )
}


const Menu = ({menu, is_authenticated, logout}) => {
    return (
        <nav className="navbar navbar-light bg-light">
            {menu.map((menu_item, i) => <MenuItem menu_item={menu_item}
                                                  is_authenticated={() => is_authenticated()}
                                                  logout={() => logout()} key={i}/>)}
        </nav>
    )
}

export default Menu