import React, {useState} from 'react';
import {
    Collapse,
    Nav,
    Navbar,
    NavbarToggler,
    NavItem
} from 'reactstrap';
import {NavLink} from "react-router-dom";
import style from "./Header.module.css";

const Header = (props) => {
    const {logo, navItems} = props;

    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    const itemList = navItems.map((item) => {
        // Removed activeClassName={style.active} from RouterLink props
        return (
            <NavItem key={item.url} className={style.navItem}>
                <NavLink to={item.url}
                            className="nav-link">
                    {item.text}
                </NavLink>
            </NavItem>
        )
    });

    return (
        <div className={style.navBar}>
            <Navbar expand="md" light>
                <div className={`container ${style.navbarContainer}`}>
                    <NavLink to="/">
                        <img className={style.logo} src={logo} alt=""/>
                    </NavLink>
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

