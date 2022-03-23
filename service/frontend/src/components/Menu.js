import React from "react";
import {Link} from "react-router-dom";

const MenuItem = ({menu_item}) => {
    return (
        <Link className="nav-link" to={menu_item.link}>{menu_item.name}</Link>
    )
}

const Menu = ({menu}) => {
    return (
        <nav className="navbar navbar-light bg-light">
            {menu.map((menu_item, i) => <MenuItem menu_item={menu_item} key={i}/>)}
        </nav>
    )
}

export default Menu