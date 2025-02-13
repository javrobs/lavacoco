import React from "react";

const MiniIconButton = ({onClick,icon,classNameExtra,disabled}) => {
    return <button 
    type="button"
    className={`h-5 w-5 rounded-full right-2 flex ${disabled?"bg-slate-200 text-slate-400":"bg-sky-200 hover:bg-sky-300"} ${classNameExtra} justify-center items-center`}
    onClick={onClick}
    disabled={disabled}>
        <span className="text-sm material-symbols-outlined">
            {icon}
        </span>
    </button>
}

export default MiniIconButton;