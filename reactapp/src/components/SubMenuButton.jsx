import React from "react";

const SubMenuButton = ({onClick,classNameExtra,activeCondition,children}) => {
    return <button className={`flex gap-1 ${classNameExtra} items-center !shadow-none !rounded-none justify-center btn-white h-14 ${activeCondition?"choice":""}`} onClick={onClick}>
        {children}
    </button>
}


export default SubMenuButton;