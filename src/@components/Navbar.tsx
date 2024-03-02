import { useState } from 'react'
import { NavLink } from 'react-router-dom';
import { FaBars, FaChartLine, FaFileCode, FaHouse, FaUserLock } from "react-icons/fa6";
import { SlSpeech } from "react-icons/sl";

import { Button, Divider, MenuItem } from '@mui/material';

import NavbarMenu from "components/NavbarMenu";

const Navbar = (): JSX.Element => {

    // Submenu items
    const [mainMenuAnchorEl, setMainMenuAnchorEl] = useState<null | HTMLElement>(null);
    const openMainMenu = Boolean(mainMenuAnchorEl);

    const openMenu = (event: React.MouseEvent<HTMLElement>) => {

        event.preventDefault();

        switch(event.currentTarget.id) {
            case "mainMenuControl":
                setMainMenuAnchorEl(event.currentTarget);
                break;
        }
    };
    const closeMenu = () => {

        setMainMenuAnchorEl(null);
    };

    return (
        <>
            <nav>
                <div className="NavMenu">
                    {/* Main Menu */}
                    <Button
                        id="mainMenuControl"
                        className="stats"
                        aria-controls={openMainMenu ? 'mainMenu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openMainMenu ? 'true' : undefined}
                        onClick={openMenu}
                    >
                        <FaBars />
                    </Button>
                        <NavbarMenu
                            id="mainMenu"
                            MenuListProps={{ 'aria-labelledby': 'mainMenuControl' }}
                            anchorEl={mainMenuAnchorEl}
                            open={openMainMenu}
                            onClose={closeMenu}>
                            <NavLink to={(process.env.REACT_APP_BASENAV ?? "") + "/home"}>
                                <MenuItem onClick={closeMenu} disableRipple>
                                    <FaHouse />Home
                                </MenuItem>
                            </NavLink>
                            <Divider />
                            <NavLink to={(process.env.REACT_APP_BASENAV ?? "") + "/faqs"}>
                                <MenuItem onClick={closeMenu} disableRipple>
                                    <SlSpeech />FAQs
                                </MenuItem>
                            </NavLink>
                            <NavLink to={(process.env.REACT_APP_BASENAV ?? "") + "/faqs#How_does_the_site_use_my_data"}>
                                <MenuItem onClick={closeMenu} disableRipple >
                                    <FaUserLock />Privacy Policy
                                </MenuItem>
                            </NavLink>
                            <Divider />
                            <NavLink to={(process.env.REACT_APP_BASENAV ?? "") + "/stats"}>
                                <MenuItem onClick={closeMenu} disableRipple >
                                    <FaChartLine />Reporting Stats
                                </MenuItem>
                            </NavLink>
                            <NavLink to="https://github.com/halfacandan/BinWarden">
                                <MenuItem onClick={closeMenu} disableRipple >
                                    <FaFileCode />View Source Code
                                </MenuItem>
                            </NavLink>
                        </NavbarMenu>
                    <h1>Bin Warden</h1>
                </div>
            </nav>
        </>
    );
};
 
export default Navbar;