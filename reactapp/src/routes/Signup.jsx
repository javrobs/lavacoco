import React, {useState, useRef, useContext, useEffect} from "react"
import { userContext } from "../components/App.jsx"
import {useNavigate,Link, useLoaderData} from "react-router"
import Icon from "../components/Icon.jsx"
import ErrorMessage from "../components/ErrorMessage.jsx"
import cookieCutter from "../utils/cookieCutter.js"
import HoverInput from "../components/HoverInput.jsx"
import HoverSelect from "../components/HoverSelect.jsx"
import MiniBlueLabel from "../components/MiniBlueLabel.jsx"
import defaultLoader from "../utils/defaultLoader.js"

export default function Signup({admin,config}){
    const {codes,reference_user,select_user} = useLoaderData();
    const [signupState,setSignupState] = useState(config?select_user.info:{});
    const [signupFailed,setSignupFailedState] = useState(false);
    const [trackChanges,setTrackChanges] = useState(false);
    const [extendAddressForm,setExtendAddressForm] = useState(config?select_user.has_address:false);
    const [chooseCountryCode,setChooseCountryCode] = useState(config?select_user.has_country_code:false);
    const navigate = useNavigate();
    const {refreshFunction} = useContext(userContext);
    const selectCountryRef = useRef(null);

    useEffect(()=>{
        if(selectCountryRef.current){
            selectCountryRef.current.focus();           
        }},[chooseCountryCode])

    function toggleAddressForm(e){
        setTrackChanges(true);
        setExtendAddressForm(e.target.checked);
        if(e.target.checked==false){
            setSignupState(oldValue=>{
                const {calle,colonia,cp,numero_ext,numero_int,...filtered} = oldValue;
                return filtered;
            })
        }
    }

    function toggleCountryCode(e){
        setTrackChanges(true);
        setChooseCountryCode(e.target.checked);
        if(e.target.checked==false){
            setSignupState(oldValue => {
                const {countryCode,...others} = oldValue;
                return others;
            })
        }
    }

    function phoneInputChange(e){
        setTrackChanges(true);
        const {value} = e.target;
        const onlyNumbers = new RegExp(/^[0-9]*$/);
        const tenNumbers = new RegExp(/^[0-9]{10}$/);
        if (onlyNumbers.test(value)&&value.length<11){
            setSignupState(oldState=>({...oldState,username:value}));
        }
        if (tenNumbers.test(value)){
            console.log("REMEMBER TO DO THIS");
        }
    }
    
    function handleChange(e){
        setTrackChanges(true)
        const {name,value} = e.target;
        setSignupState(oldState=>({...oldState,[name]:value}))
    }

    async function syncChanges(){
        const result =  admin ? await defaultLoader("edit_user",select_user.info.id):await defaultLoader("config");
        const selectUser = result.select_user;
        console.log(selectUser);
        setSignupState(selectUser.info);
        setTrackChanges(false);
        setExtendAddressForm(selectUser.has_address);
        setChooseCountryCode(selectUser.has_country_code);
        setSignupFailedState("");
    }

    const apiURL = admin?
        (config?
            "/api/edit_user/":
            "/api/create_client/"):
        (config?
            "/api/edit_my_user/":
            "/api/signup/");
    let afterSubmitURL = admin?'/crear-orden/':'/iniciar-sesion/';

    function handleSubmit(e){
        e.preventDefault();
        const sendState = reference_user? {...signupState,reference_user_id:reference_user.id}: signupState
        fetch(apiURL,{
            method:"POST",
            headers:{"X-CSRFToken":cookieCutter("csrftoken")},
            body:JSON.stringify(sendState)
        }).then(response=>response.json())
        .then(data=>{
            console.log(data);
            if (data.success){
                console.log("succesful!");
                if(config){
                    syncChanges();
                } else {
                    if(admin){
                        afterSubmitURL += `${data.user_id}/`
                    } else {
                        refreshFunction();
                    }
                    navigate(afterSubmitURL);
                }
            } else {
                setSignupFailedState(data.error)
            }
        });
    }

    const countryOptions = codes?codes.map(each=>{
        return <option key={each.id} value={each.id}>{each.name} {String.fromCodePoint(each.code[0])+String.fromCodePoint(each.code[1])}</option>
    }):[]

    return <form className={`flex ${ config && !admin ?"":"bubble-div text-center max-w-lg rounded-xl sm:mt-3"} mx-auto flex-col gap-y-3 p-3 px-5`} onSubmit={handleSubmit}>
        <h1 className="text-orange-700">{admin?(config?`Editar datos de ${select_user.info.first_name}`:"Cliente nuevo"):config?"Modificar mis datos":"Regístrate"}</h1>
        {reference_user && <div className="flex flex-wrap gap-3 mx-3 items-center">
            Referencia:
            <MiniBlueLabel icon="person" text={reference_user.name}/>
        </div>}
        {signupFailed&&<div className="w-full">
            <ErrorMessage errorContent={signupFailed}/>
        </div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mx-6">
            {!admin && !config && 
            <p className='text-left sm:col-span-2 -mx-3'>
                {reference_user?
                `Recibe tu segunda carga gratis y ${reference_user.name.split(" ")[0]} recibirá una cuando finalices tu primera órden. ¡Ganar, ganar!`:
                "Lleva seguimiento de tus órdenes y accede al programa de cliente frecuente."}
            </p>}
            <HoverInput className="flex sm:col-span-2" label="Teléfono (10 dígitos)">
                <input type="tel" pattern='[0-9]{10}' required value={signupState.username||""} onInput={phoneInputChange} name="username"/>
            </HoverInput>
            <HoverInput label="Nombre">
                <input required value={signupState.first_name||""} onInput={handleChange} name="first_name"/>
            </HoverInput>
            <HoverInput label="Apellido">
                <input required value={signupState.last_name||""} onInput={handleChange} name="last_name" />
            </HoverInput>
            {!admin && !config && <PasswordInputs signupState={signupState} handleChange={handleChange}/>}
        </div>
        {(!config || !select_user.is_admin) &&
        <>
        <label className="flex gap-1 items-center mx-3 mt-2">
            <input checked={chooseCountryCode} onChange={toggleCountryCode} className="accent-blue-600" type='checkbox'/>
            <div className="text-start text-nowrap">{admin?"El teléfono no es mexicano.":"Mi teléfono no es mexicano"}</div>
            {chooseCountryCode && 
            <HoverSelect className="grow ms-2 !mt-0 flex" label="País">
                <select className="!mt-0" ref={selectCountryRef} value={signupState.countryCode||""} name="countryCode" onChange={handleChange} required={true}>
                    <option value="" disabled={true}>Selecciona...</option>
                    {countryOptions}
                </select>
            </HoverSelect>
            }
        </label>
        <label className="flex gap-1 items-start mx-3">
            <input checked={extendAddressForm} onChange={toggleAddressForm} className="accent-blue-600 mt-1.5" type='checkbox'/>
            <span className="text-start">{admin?"Registrar dirección para entregas a domicilio.":"Opcional: Proporcionar mi dirección para entregas a domicilio, si están disponibles en mi zona."}</span>
        </label>
        </>
        }
        {extendAddressForm&&<AddressForm formState={signupState} handleChange={handleChange}/>}
        
        <div className="justify-center flex gap-2">
        {config?<>
            <button className="btn btn-back disabled:!bg-slate-400" type="button" onClick={syncChanges} disabled={!trackChanges}>Reestablecer<Icon icon="undo"/></button>
            <button className="btn-go text-nowrap flex items-center gap-1 disabled:!bg-slate-400" disabled={!trackChanges}>Guardar cambios<Icon icon='arrow_forward'/></button>
        </>:
        <>{
            admin?
                <button className="btn-back btn" onClick={()=>{history.back()}}>
                    Regresar
                    <Icon icon='undo'/>
                </button>:
                <Link className="btn-back btn" to='/iniciar-sesion/'>
                    Regresar
                    <Icon icon='undo'/>
                </Link>}
            <button className="btn-go text-nowrap flex items-center gap-1">
                {config?"Guardar cambios":"Continuar"}
                <Icon icon='arrow_forward'/>
            </button>
        </>}
        </div>
    </form>
}

export function AddressForm({handleChange,formState,notEditable}){
    return <fieldset className="flex flex-col items gap-2" disabled={notEditable||false}>
            <legend className="text-start text-lg">Dirección</legend>
            <div className="grid sm:grid-cols-2 gap-1 mx-6">
                <HoverInput label="Calle" className='sm:col-span-2'>
                    <input required id='calle' value={formState.calle||""} onInput={handleChange} name="calle"/>
                </HoverInput>
                <HoverInput label="# Externo">
                    <input required id='numero_ext' value={formState.numero_ext||""} onInput={handleChange} name="numero_ext" type='number' min={0} step="1"/>
                </HoverInput>
                <HoverInput label="# Interno*">
                    <input value={formState.numero_int||""} id='numero_int' onInput={handleChange} name="numero_int" type='number' min={0} step="1"/>
                </HoverInput>
                <HoverInput label="Colonia">
                    <input required id='colonia' value={formState.colonia||""} onInput={handleChange} name="colonia"/>
                </HoverInput>
                <HoverInput label="Código Postal*">
                    <input value={formState.cp||""} onInput={handleChange} id='cp' name="cp" pattern="[0-9]{5}" />
                </HoverInput>
                <span className="text-center sm:col-span-2">* = opcional</span>
            </div>
        </fieldset>
}

export const PasswordInputs = ({signupState,handleChange,config}) => {
    const pw2 = useRef(null);
    const [showRule, setShowRule] = useState(false);

    function verifyPW(e){
        const {value} = e.target;
        handleChange(e);
        pw2.current.setCustomValidity(signupState.password_2 != value?'Las contraseñas no coinciden':"");
    }

    function verifyPW2(e){
        const {value} = e.target;
        handleChange(e);
        if(config){
            pw2.current.setCustomValidity(signupState.new_password != value?'Las contraseñas no coinciden':""); 
        } else {
            pw2.current.setCustomValidity(signupState.password != value?'Las contraseñas no coinciden':""); 
        }
    }
    
    const condition = ((config?signupState.new_password:signupState.password)||"").length>=8&&((config?signupState.new_password:signupState.password)||"").length<=20

    return <>
    
    <div style={{transition:".4s"}} className={`${showRule?'max-h-40':'max-h-0'} overflow-hidden sm:col-span-2`}>
        <div className={`flex p-1 shadow-sm gap-1 items-center rounded-lg ${condition?'bg-emerald-300':'bg-red-300'} px-3`}>
        <Icon icon={condition?"check_circle":"cancel"}/>La contraseña debe tener entre 8 y 20 caracteres.
        </div>
    </div>
    <HoverInput label={config?"Nueva contraseña":"Contraseña"}>
        <input required value={config?signupState.new_password||"":(signupState.password||"")} onInput={verifyPW} onFocus={()=>setShowRule(true)} onBlur={()=>setShowRule(false)} name={config?"new_password":"password"} type="password" minLength={8} maxLength={20}/>
    </HoverInput>
    <HoverInput label="Repite la contraseña">
        <input required ref={pw2} value={signupState.password_2||""} onInput={verifyPW2} name="password_2" type="password" minLength={8} maxLength={20} />
    </HoverInput>
    </>
}