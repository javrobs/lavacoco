import React, {useState} from "react";
import { useLoaderData, useNavigate } from "react-router";
import MainContainer from "../../components/MainContainer.jsx";
import TextSelect from "../../components/TextSelect.jsx"
import Icon from "../../components/Icon.jsx";
import cookieCutter from "../../utils/cookieCutter.js";
import Notify from "../../components/Notify.jsx";
import SubMenuButton from "../../components/SubMenuButton.jsx";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import CopyLinkButton from "../../components/CopyLinkButton.jsx";

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

    function selectEditClient(id){
        nav("/editar-cliente/"+id+"/")
    }

    return <MainContainer size="md">
        <div className="bubble-div flex flex-col gap-2 !p-0">
            <div className="grid gap-0.5 overflow-hidden rounded-t-lg shrink-0 bg-slate-300 shadow-sm grid-cols-2">
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
                <TextSelect
                    label="Cliente" 
                    className="grow"
                    idName="user"
                    changeState={selectEditClient} 
                    optionList={clients.map(each=>({id:each.id,text:each.name}))}
                />
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


    function handleSelect(id){
        setSelectUser(id);
        setResults({});
        setErrorContent("");
    }

    async function getLink(){
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
        setNotify(()=>{
            return {show:true,
            number:results.phone,
            message:results.message,
            backFunction: ()=>{setNotify({show:false})}
        }})
    }

    return <div className="p-3 pt-0 sm:px-5">
        {text}
        <ErrorMessage errorContent={errorContent}/>
        <div className="flex items-center">
            <TextSelect 
                className="grow" 
                label="Cliente"
                value={selectUser}
                idName="user"
                inFlex={true}
                changeState={handleSelect}
                optionList={options.map(each=>({id:each.id,text:`${each.name}`}))}
            />
            <button className="btn-go !h-8 mt-3 !text-base !rounded-s-none disabled:!bg-slate-400 flex gap-1 items-center" onClick={getLink} disabled={!selectUser}>Generar link<Icon icon="link"/></button>
        </div>
        {results.link && 
        <div className="flex flex-col gap-2 mt-3">
            <p>La siguiente liga expira en 12 horas:</p>
            <div className="bg-slate-300 shadow-md rounded-md p-3 break-words italic">
                {results.link}
            </div>
            <div className="flex justify-center gap-1 items-center">
                <CopyLinkButton textToCopy={results.link}/>
                <button className="btn-green flex gap-1 items-center" onClick={()=>notifyOn(results.link,selectUser)}>Notificar <i className="bi bi-whatsapp"></i></button>
            </div>
        </div>}
        <Notify {...notify}/>
    </div>
}