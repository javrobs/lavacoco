import React from "react";
import {NavLink, Outlet} from "react-router";

const Configuracion = () => {

    return <main className="flex max-sm:flex-col bg-slate-200 grow">
        <div className="bg-slate-900 sm:w-44 lg:w-80 shrink-0">
            <NavLink className="p-3 text-center block [&.active]:bg-slate-800 [&.active]:underline !text-white" to='/configuracion/mis-datos/'>Mis datos</NavLink>
            <NavLink className="p-3 text-center block [&.active]:bg-slate-800 [&.active]:underline !text-white" to='/configuracion/cambiar-contrasena/'>Cambiar contraseña</NavLink>
        </div>
        <div className="sm:col-span-2 lg:col-span-3 grow">
            <Outlet/>
        </div>
    </main>
}

export default Configuracion;