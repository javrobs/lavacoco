import React, {useState} from "react";
import { useLoaderData } from "react-router";
import MainContainer from "../../components/MainContainer.jsx";
import HoverSelect from "../../components/HoverSelect.jsx";
import Icon from "../../components/Icon.jsx";
import cookieCutter from "../../utils/cookieCutter.js";
import Notify from "../../components/Notify.jsx";

const Clientes = () => {
    const {clients} = useLoaderData();
    const [selectUser,setSelectUser] = useState("");
    const [resultingLink,setResultingLink] = useState("");
    const [notify,setNotify] = useState({show:false});
    console.log(clients);

    const clientOptions = clients.map(each=>{
        return <option key={each.id} value={each.id}>{each.name}</option>
;    })

    function handleSelect(e){
        setSelectUser(e.target.value);
    }

    async function getLink(){
        const response = await fetch('/api/get_link_invite_admin/',{
            method:"POST",
            headers:{"X-CSRFToken":cookieCutter("csrftoken")},
            body:JSON.stringify({selectUser:selectUser})
        });
        const data = await response.json();
        if(data.success){
            console.log(data);
            setResultingLink(data.link);
        } else {
            console.log(data.error)
        }
    }

    function notifyOn (){
        setNotify(()=>{
            const {name,phone} = clients.find(({id})=>id==selectUser)
            return {show:true,
            number:phone,
            message:`Hola ${name.split(" ")[0]}, te invito al sitio web de lavandería coco. Regístrate aquí: ${resultingLink}`,
            backFunction: ()=>{setNotify({show:false})}
        }})
    }

    console.log(selectUser)
    return <MainContainer size="md">
        <div className="bubble-div flex flex-col gap-2">
            <h1 className="text-orange-700">Clientes</h1>
            <div className="flex items-center">
                <HoverSelect className="grow" label="Clientes sin cuenta">
                    <select className="!rounded-e-none" value={selectUser||""} onChange={handleSelect}>
                        <option value="" disabled>Selecciona...</option>
                        {clientOptions}
                    </select>
                </HoverSelect>
                <button className="btn-go !h-8 mt-3 !text-base !rounded-s-none disabled:!bg-slate-400 flex gap-1 items-center" onClick={getLink} disabled={!selectUser}>Generar link<Icon icon="link"/></button>
            </div>
            {resultingLink && 
            <div className="flex flex-col gap-2">
                <p>La siguiente liga expira en 3 horas, con esta, tu cliente puede registrarse agregando una contraseña:</p>
                <div className="bg-slate-300 shadow-md rounded-md p-3 break-words italic">
                    {resultingLink}
                </div>
                <div className="flex justify-center gap-1 items-center">
                    <button className="btn-back flex gap-1 items-center">Copiar <Icon icon="content_copy"/></button>
                    <button className="btn-green flex gap-1 items-center" onClick={notifyOn}>Notificar <i className="bi bi-whatsapp"></i></button>
                </div>
            </div>}
        </div>
        <Notify {...notify}/>
        
    </MainContainer>
}

export default Clientes;