import React from "react";
import Icon from "./Icon.jsx";

const MiniIconButton = ({onClick,icon,classNameExtra,disabled,type}) => {
    return <button 
    type={type||"button"}
    className={`h-5 w-5 rounded-full right-2 flex ${disabled?"bg-slate-200 text-slate-400":"bg-sky-200 hover:bg-sky-300"} ${classNameExtra} justify-center items-center`}
    onClick={onClick}
    disabled={disabled}>
        <Icon classNameExtra="text-sm" icon={icon}/>
    </button>
}

export default MiniIconButton;