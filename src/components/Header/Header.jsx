import React, {useState} from 'react';
import {
    Collapse,
    Nav,
    Navbar,
    NavbarToggler,
    NavItem
} from 'reactstrap';
import {NavLink as RouterLink} from "react-router-dom";
import style from "./Header.module.css";

const Header = (props) => {
    const {logo, navItems} = props;

    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    const itemList = navItems.map((item) => {
        // Removed activeClassName={style.active} from RouterLink props
        return (
            <NavItem key={item.url} className={style.navItem}>
                <RouterLink to={item.url}
                            className="nav-link">
                    {item.text}
                </RouterLink>
            </NavItem>
        )
    });

    return (
        <div className={style.navBar}>
            <Navbar expand="md" light>
                <div className="container">
                    <RouterLink to="/">
                        <img className={style.logo} src={logo} alt=""/>
                    </RouterLink>
                    <NavbarToggler onClick={toggle}/>
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            {itemList}
                        </Nav>
                    </Collapse>
                </div>
            </Navbar>
        </div>

    );
}

export default Header;

