import React from "react";
import Icon from "./Icon.jsx";
import MainContainer from "./MainContainer.jsx";

const ExpiredJWT = () => {

    function goBack(){
        history.back();
    }

    return <MainContainer size="sm">
        <div className="bubble-div flex flex-col items-center gap-3">
            <h1 className="text-orange-700">La liga expiró</h1>
            <p>Pide otra liga al administrador</p>
            <button className="btn btn-back" onClick={goBack}>Regresar<Icon icon='undo'/></button>
        </div>
    </MainContainer>
}

export default ExpiredJWT;