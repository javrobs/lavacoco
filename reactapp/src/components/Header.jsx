import React from "react"
import {Link} from "react-router"
import MiniMenu from "./MiniMenu.jsx"



const Header = () => {
    return <header className="shadow-lg bg-[#102142] flex z-10 h-24">
    <Link className='inline-flex' to='/'>
    <img src='/static/frontend/logomini.svg' className='logo p-2 max-h-24 min-w-16 sm:hidden'/>
    <img src='/static/frontend/logo.png' className='logo max-h-24 min-w-40 hidden sm:block'/>
    </Link>
    <MiniMenu/>
</header>
}



export default Header;