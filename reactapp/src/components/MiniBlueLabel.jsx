import React from "react";
import Icon from "./Icon.jsx";

const MiniBlueLabel = ({icon,text}) => {
    return <div className="text-sm items-center flex py-1 px-3 rounded-full bg-sky-200 text-sky-900 shadow-md">
        <Icon classNameExtra="text-sm icon-full text-sky-800" icon={icon}/> {text} 
    </div>
}


export default MiniBlueLabel;