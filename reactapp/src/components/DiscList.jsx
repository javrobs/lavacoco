import React from "react";

const DiscList = ({list}) => {
    return <ul className="list-disc text-lg">
        {list.map((each,i)=><li className="ms-3" key={`li-${i}`}>{each}</li>)}
    </ul>
}


export default DiscList