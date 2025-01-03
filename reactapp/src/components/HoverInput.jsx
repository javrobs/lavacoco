import React from "react"

const HoverInput = ({label,children,className}) => {
    const {value} = children.props;

    return <label className={`inputLabel ${className||""} ${value?"valued":""}`}>
            {children}
            <span>{label}</span>
        </label>
}

export default HoverInput