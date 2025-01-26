import React from "react";


const ModalWarning = ({show,warningMessage,children}) => {
    return show && <div className="absolute top-0 left-0 flex justify-center items-center w-full h-dvh z-10 bg-black bg-opacity-80">
        <div className="p-5 rounded-md shadow-md gap-3 bg-slate-200 flex flex-col">
            <h2 className="self-center text-orange-700">Atención</h2>
            {warningMessage}.
            <div className="flex justify-center gap-1">
                {children}
            </div>
        </div>
    </div>
}

export default ModalWarning