import React from "react";
import Icon from "./Icon.jsx";


const Notify = ({show,number,message,backFunction,afterFunction}) => {
    return show && <div className="absolute top-0 left-0 flex justify-center items-center w-full h-dvh z-10 bg-black bg-opacity-80">
        <div className="py-5 px-8 max-w-screen-sm rounded-md shadow-md gap-3 bg-slate-200 flex flex-col">
            <h1 className="self-center text-orange-700">Notificar</h1>
            <div className="mx-3 text-lg">Mensaje:</div>
            <div className="text-wrap bg-white rounded-md shadow-md p-3 -mt-2"><i>{message}</i></div>
            <div className="flex justify-center flex-wrap gap-3">
                {backFunction && <button className="flex items-center gap-1 btn-back text-nowrap justify-center grow" type="button" onClick={backFunction}>Regresar<Icon icon="undo"/></button>}
                <a target="_blank" href={`https://api.whatsapp.com/send/?phone=52${number}&text=${message}`} className="flex justify-center items-center gap-1 grow btn-green text-nowrap" type="button" name="save-and-promote">
                    Notificar
                    <i className="bi bi-whatsapp" />
                </a>
                {afterFunction && <button className="btn-go justify-center text-nowrap grow flex items-center gap-1" onClick={afterFunction} type="button">Continuar<Icon icon="check_circle"/></button>}
            </div>
        </div>
    </div>
}

export default Notify