import React from "react"
import {Link,NavLink} from "react-router"
import Icon from "./Icon.jsx"

export default function Header(){
    return <header className="drop-shadow-xl flex z-10 relative">
    <Link className='inline-flex' to='/'>
    <img src='/static/frontend/logomini.svg' className='logo p-2 max-h-24 min-w-16 sm:hidden'/>
    <img src='/static/frontend/logo.png' className='logo max-h-24 min-w-40 hidden sm:block'/>
    </Link>
    <nav className=' grow p-3 inline-flex items-center justify-end gap-6'>
        <Link className='ms-auto btn border-4 p-2 rounded-full login-button' to='/iniciar-sesion'>
            Ingresar
            <Icon icon="login"/>
        </Link>
    </nav>
</header>
}