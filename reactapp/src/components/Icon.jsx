import React from "react"

export default function Icon({icon,classNameExtra}){
    return <span translate="no" className={`${classNameExtra||""} material-symbols-outlined notranslate skiptranslate`}>{icon}</span>
}