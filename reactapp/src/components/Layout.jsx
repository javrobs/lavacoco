import React, {useContext} from "react"
import Header from "./Header.jsx"
import { Outlet, useLocation } from "react-router";
import { userContext } from "./App.jsx";


const Layout = () => {
    const location = useLocation();
    const user = useContext(userContext);
    const showHeader = location.pathname !== "/";
    return <div className="flex flex-col h-dvh">
        {(showHeader||user.logged_in) && <Header />}
        <Outlet />
    </div>
}

export default Layout;