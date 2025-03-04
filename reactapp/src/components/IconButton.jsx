import React from "react";

const IconButton = ({onClick,icon,classNameExtra,color,type}) => {
    const colorClass = color=="white"?
    " text-black hover:bg-sky-200 hover:text-sky-700 font-thin":
    " text-white bg-sky-500 hover:bg-sky-700";

    return <button type={type} onClick={onClick} className={` rounded-full h-8 w-8 flex gap-1 justify-center items-center ${colorClass} ${classNameExtra}`}>
        <span className="material-symbols-outlined">
        {icon}
        </span>
    </button>
}

export default IconButton;