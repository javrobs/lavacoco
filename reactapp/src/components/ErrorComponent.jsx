import React from "react";
import {useNavigate} from "react-router";

const ErrorComponent = ({children}) => {
    const navigate = useNavigate();

    function goBack(){
        history.back();
    }
    return <div className="flex text-center p-3">
        <button className="btn btn-go" onClick={goBack}>Go back!</button>
    </div>
}

export default ErrorComponent;