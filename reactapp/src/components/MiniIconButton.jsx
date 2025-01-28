import React from "react";

const MiniIconButton = ({onClick,icon,classNameExtra}) => {
    return <button 
    type="button"
    className={`${classNameExtra} h-5 w-5 rounded-full right-2 bg-sky-200 flex hover:bg-sky-300 justify-center items-center`}
    onClick={onClick}>
        <span className="text-sm material-symbols-outlined">
            {icon}
        </span>
    </button>
}

export default MiniIconButton;