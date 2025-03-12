import React, {useContext} from "react"
import Header from "./Header.jsx"
import { Outlet, useLocation} from "react-router";
import { userContext } from "./App.jsx";


const Layout = () => {
    const location = useLocation();
    const {logged_in} = useContext(userContext);

    return <div className="flex flex-col max-h-dvh h-dvh overflow-hidden">
        {(location.pathname !== "/" || logged_in) && <Header />}
        <div className="h-full overflow-y-auto">
            <Outlet />
        </div>
    </div>
}

export default Layout;