import React from "react"

const HoverSelect = ({children,label,className}) => {
    const {value} = children.props;

    

    return <label className={`inputLabel ${className||""} ${value?"valued":""}`}>
        {children}
        <span>{label}</span>
    </label>
}


export default HoverSelect;