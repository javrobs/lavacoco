import React from "react";

const GridDivider = ({cols}) => {
    return <div className={`bg-slate-300 h-0.5 col-span-${cols}`}/>
}


export default GridDivider