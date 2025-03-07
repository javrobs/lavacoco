import React from "react";
import Icon from "./Icon.jsx";
import ModalConfirm from "./ModalConfirm.jsx";

const Notify = ({show,number,message,backFunction,afterFunction}) => {
    return <ModalConfirm show={show}>
        <h1 className="self-center text-orange-700">Notificar</h1>
        <div className="mx-3 text-lg">Mensaje:</div>
        <div className="text-wrap break-words bg-white rounded-md shadow-md p-3 -mt-2"><i>{message}</i></div>
        <div className="flex justify-center flex-wrap gap-3">
            {backFunction && <button className="flex items-center gap-1 btn-back text-nowrap justify-center grow" type="button" onClick={backFunction}>Regresar<Icon icon="undo"/></button>}
            <a target="_blank" href={`https://api.whatsapp.com/send/?phone=${number}&text=${message}`} className="flex justify-center items-center gap-1 grow btn-green text-nowrap" type="button" name="save-and-promote">
                Notificar
                <i className="bi bi-whatsapp" />
            </a>
            {afterFunction && <button className="btn-go justify-center text-nowrap grow flex items-center gap-1" onClick={afterFunction} type="button">Continuar<Icon icon="check_circle"/></button>}
        </div>
    </ModalConfirm>
}

export default Notify