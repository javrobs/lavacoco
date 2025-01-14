import React from "react";

const IconButton = ({onClick,icon}) => {
    return <button onClick={onClick} className="rounded-full text-white bg-sky-500 hover:bg-sky-700 flex gap-1 items-center">
        <span className="material-symbols-outlined">
        {icon}
        </span>
    </button>
}

export default IconButton;