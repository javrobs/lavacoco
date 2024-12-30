import React from "react"

export default function Icon({icon,classNameExtra}){
    return <span className={[classNameExtra,"material-symbols-outlined"].join(" ")}>{icon}</span>
}