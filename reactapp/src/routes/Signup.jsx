import React, {useState, useRef, useContext} from "react"
import { userContext } from "../components/App.jsx"
import {useNavigate,Link} from "react-router"
import Icon from "../components/Icon.jsx"
import ErrorMessage from "../components/ErrorMessage.jsx"
import cookieCutter from "../utils/cookieCutter.js"
import HoverInput from "../components/HoverInput.jsx"

export default function Signup({admin}){

    const [signupState,setSignupState] = useState({})
    const [signupFailed,setSignupFailedState] = useState(false)
    const pw2 = useRef(null);
    const [extendAddressForm,setExtendAddressForm] = useState(false);
    const navigate = useNavigate();
    const {refreshFunction} = useContext(userContext);

    function toggleAddressForm(e){
        setExtendAddressForm(value=>value==false);
    }

    function verifyPW(e){
        const {value} = e.target;
        handleChange(e);
        pw2.current.setCustomValidity(signupState.password_2 != value?'Las contraseñas no coinciden':"");
    }

    function verifyPW2(e){
        const {value} = e.target;
        handleChange(e);
        pw2.current.setCustomValidity(signupState.password != value?'Las contraseñas no coinciden':"");  
    }
    

    function phoneInputChange(e){
        const {value} = e.target;
        const onlyNumbers = new RegExp(/^[0-9]*$/);
        const tenNumbers = new RegExp(/^[0-9]{10}$/);
        if (onlyNumbers.test(value)){
            setSignupState(oldState=>({...oldState,username:value}));
        }
        if (tenNumbers.test(value)){
            console.log("REMEMBER TO DO THIS");
        }
    }
    
    function handleChange(e){
        const {name,value} = e.target;
        setSignupState(oldState=>({...oldState,[name]:value}))
    }

    const apiURL = admin?"/api/create_client/":"/api/signup/";
    let afterSubmitURL = admin?'/crear-orden/':'/iniciar-sesion';

    function handleSubmit(e){
        e.preventDefault();
        console.log(e);
        fetch(apiURL,{
            method:"POST",
            headers:{"X-CSRFToken":cookieCutter("csrftoken")},
            body:JSON.stringify(signupState)
        }).then(response=>response.json())
        .then(data=>{
            console.log(data);
            if (data.success){
                console.log("succesful!");
                if(admin){
                    afterSubmitURL += `${data.user_id}/`
                } else {
                    refreshFunction();
                }
                navigate(afterSubmitURL);
            } else {
                setSignupFailedState(data.error)
            }
        });
    }

    console.log(signupState)

    return <form className="flex max-w-lg mx-auto flex-col gap-y-3 p-3 px-5 sm:mt-3 rounded-xl bubble-div justify-center text-center" onSubmit={handleSubmit}>
        <h1 className="text-center text-orange-700">{admin?"Cliente nuevo":"Regístrate"}</h1>
        
        {signupFailed&&<div className="w-full">
            <ErrorMessage errorContent={signupFailed}/>
        </div>}
        <div className="grid sm:grid-cols-2 gap-1 mx-6">
            {!admin&&<p className='text-left sm:col-span-2 -mx-3'>Lleva seguimiento de tus órdenes y accede al programa de cliente frecuente.</p>}
            <HoverInput label="Teléfono" className='sm:col-span-2'>
                <input type="tel" pattern='[0-9]{10}' required value={signupState.username||""} onInput={phoneInputChange} name="username"/>
            </HoverInput>
            <HoverInput label="Nombre">
                <input required value={signupState.first_name||""} onInput={handleChange} name="first_name"/>
            </HoverInput>
            <HoverInput label="Apellido">
                <input required value={signupState.last_name||""} onInput={handleChange} name="last_name" />
            </HoverInput>
            {!admin&&<>
                <HoverInput label="Contraseña">
                <input required value={signupState.password||""} onInput={verifyPW} name="password" type="password" minLength={8}/>
            </HoverInput>
            <HoverInput label="Repite la contraseña">
                <input required ref={pw2} value={signupState.password_2||""} onInput={verifyPW2} name="password_2" type="password" />
            </HoverInput>
            </>
            }
        </div>
        <label className="flex gap-1 items-start mx-3">
            <input value={extendAddressForm} onClick={toggleAddressForm} className="accent-blue-600 mt-1.5" type='checkbox'/>
            <span className="text-start">{admin?"Registrar dirección para entregas a domicilio.":"Opcional: Proporcionar mi dirección para entregas a domicilio, si están disponibles en mi zona."}</span>
        </label>
        {extendAddressForm&&<AddressForm formState={signupState} handleChange={handleChange}/>}
        <div className="justify-center flex gap-2">
            {admin?
            <button className="btn-back btn" onClick={()=>{history.back()}}>
                Regresar
                <Icon icon='undo'/>
            </button>:
            <Link className="btn-back btn" to='/iniciar-sesion/'>
                Regresar
                <Icon icon='undo'/>
            </Link>}
            <button className="btn-go btn">
                Continuar
                <Icon icon='arrow_forward'/>
            </button>
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