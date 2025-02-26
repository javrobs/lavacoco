import React, {useState} from "react";
import { useLoaderData, useNavigate } from "react-router";
import MainContainer from "../../components/MainContainer.jsx";
import HoverSelect from "../../components/HoverSelect.jsx";
import Icon from "../../components/Icon.jsx";
import cookieCutter from "../../utils/cookieCutter.js";
import Notify from "../../components/Notify.jsx";
import SubMenuButton from "../../components/SubMenuButton.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";

const Clientes = () => {
    const {clients} = useLoaderData();
    const [selectStatus,setSelectStatus] = useState(0)
    const nav = useNavigate();

    const clientShowLink = [
        {key:"pw",
        options: clients.filter(({has_password})=>!has_password),
        text: "Invita a tus clientes a crear una cuenta para llevar seguimiento de sus órdenes.",
        link: '/api/get_link_invite_admin/'},
        {key: "not-pw",
        options: clients.filter(({has_password})=>has_password),
        text: "¿Uno de tus clientes no recuerda su contraseña? Genera una liga aquí para recuperarla.", 
        link: '/api/get_link_recover_password_admin/'}
    ]

    return <MainContainer size="md">
        <div className="bubble-div flex flex-col gap-2 !p-0 overflow-hidden">
            <div className="grid gap-0.5 shrink-0 bg-slate-300 shadow-sm grid-cols-2">
                {[["Invitar clientes","group_add"],["Reestablecer contraseña","key"]].map((each,i)=>{
                    return <SubMenuButton 
                        classNameExtra="!py-0"
                        key = {`submenu-${i}`}
                        onClick = {() => setSelectStatus(i)}
                        activeCondition = {i == selectStatus}>
                            {each[0]}
                            <Icon icon={each[1]}/>
                        </SubMenuButton>
                })}
            </div>
            <SelectClientShowLink {...clientShowLink[selectStatus]}/>
        </div>
        <div className="bubble-div">
            <h1 className="text-orange-700">Editar datos de cliente</h1>
            <div className="flex">
                <HoverSelect className="grow" label="Cliente">
                    <select onChange={(e)=>nav("/editar-cliente/"+e.target.value+"/")}>
                        <option value="" disabled>Selecciona...</option>
                        {clients.map(each=><option key={each.id} value={each.id}>{each.name}</option>)}
                    </select>
                </HoverSelect>
            </div>
        </div>
    </MainContainer>
}

export default Clientes;


const SelectClientShowLink = ({options,notifyOn,text,link}) =>{
    const [selectUser,setSelectUser] = useState("");
    const [results,setResults] = useState({});
    const [notify,setNotify] = useState({show:false});
    const [errorContent,setErrorContent] = useState("");
    const [copied,setCopied] = useState(false);


    const clientOptions = options.map(each=>{
        return <option key={each.id} value={each.id}>{each.name}</option>;
    })

    function handleSelect(e){
        setSelectUser(e.target.value);
        setCopied(false);
        setResults({});
        setErrorContent("");
    }

    async function getLink(){
        setCopied(false);
        const response = await fetch(link,{
            method:"POST",
            headers:{"X-CSRFToken":cookieCutter("csrftoken")},
            body:JSON.stringify({selectUser:selectUser})
        });
        const data = await response.json();
        const {success,...results} = data;
        if(success){
            setResults(results);
            setErrorContent("");
        } else {
            setErrorContent(data.error);
        }
    }

    function notifyOn(){
        setCopied(false);
        setNotify(()=>{
            return {show:true,
            number:results.phone,
            message:results.message,
            backFunction: ()=>{setNotify({show:false})}
        }})
    }

    function copyLink(){
        navigator.clipboard.writeText(results.link).then(()=>{
            setCopied(true);
        })
    }

    return <div className="p-3 pt-0 sm:px-5">
        {text}
        <ErrorMessage errorContent={errorContent}/>
        <div className="flex items-center">
            <HoverSelect className="grow" label="Cliente">
                <select className="!rounded-e-none" value={selectUser||""} onChange={handleSelect}>
                    <option value="" disabled>Selecciona...</option>
                    {clientOptions}
                </select>
            </HoverSelect>
            <button className="btn-go !h-8 mt-3 !text-base !rounded-s-none disabled:!bg-slate-400 flex gap-1 items-center" onClick={getLink} disabled={!selectUser}>Generar link<Icon icon="link"/></button>
        </div>
        {results.link && 
        <div className="flex flex-col gap-2 mt-3">
            <p>La siguiente liga expira en 12 horas:</p>
            <div className="bg-slate-300 shadow-md rounded-md p-3 break-words italic">
                {results.link}
            </div>
            <div className="flex justify-center gap-1 items-center">
                <button className={`btn-back flex gap-1 items-center ${copied?"!bg-lime-500 hover:!bg-lime-600":""}`} onClick={copyLink}>{copied?<>Copiado <Icon icon="check"/></>:<>Copiar <Icon icon="content_copy"/></>}</button>
                <button className="btn-green flex gap-1 items-center" onClick={()=>notifyOn(results.link,selectUser)}>Notificar <i className="bi bi-whatsapp"></i></button>
            </div>
        </div>}
        <Notify {...notify}/>
    </div>
}