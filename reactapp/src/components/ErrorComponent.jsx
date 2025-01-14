import React, {useState} from "react";
import {useNavigate,useRouteError} from "react-router";
import Header from "./Header.jsx";
import Icon from "./Icon.jsx";

const ErrorComponent = ({children}) => {
    const navigate = useNavigate();
    const [showError,setShowError] = useState(false);
    const error = useRouteError();

    console.log(error);

    function goBack(){
        history.back();
    }

    function toggleShowError(){
        setShowError(value=>!value);
    }

    return <>
        <Header/>
        <main className="flex flex-col gap-2 bubble-div sm:mt-3 container mx-auto items-center p-3">
            <h1>Algo salió mal?</h1>
            <p>Hubo un error pero nadie sabe <span onClick={toggleShowError} className="hover:text-blue-500 cursor-pointer">cual</span> es.</p>
            {showError&&<p className="bg-red-300 rounded-md p-2 mx-4"><b>Error {error.status}</b><br/>{error.data}</p>}
        <button className="btn btn-back" onClick={goBack}>Regresar<Icon icon='undo'/></button>
        </main>
        </>
}

export default ErrorComponent;