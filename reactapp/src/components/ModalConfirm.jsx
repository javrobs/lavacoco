import React from "react";

const ModalConfirm = ({show,children}) => {
    return show && <div className="absolute top-0 left-0 flex justify-center items-center w-full h-dvh z-10 bg-black bg-opacity-80">
        <div className="py-5 px-8 max-sm:max-w-full max-w-screen-sm rounded-md shadow-md gap-3 bg-slate-200 flex flex-col">
            {children}
        </div>
    </div>
}


export default ModalConfirm