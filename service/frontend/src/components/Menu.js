import React from "react";

const MenuItem = ({menu_item}) => {
    return (
        <a className="nav-link" href={menu_item.link}>{menu_item.name}</a>
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