import React,{useState, useContext} from "react";
import MainContainer from "../../components/MainContainer.jsx";
import { useLoaderData, Link, useNavigate } from "react-router"; 
import { PasswordInputs } from "../Signup.jsx";
import Icon from "../../components/Icon.jsx";
import ExpiredJWT from "../../components/ExpiredJWT.jsx";
import cookieCutter from "../../utils/cookieCutter.js";
import ErrorMessage from "../../components/ErrorMessage.jsx";
import HoverInput from "../../components/HoverInput.jsx";
import { userContext } from "../../components/App.jsx";


const RegisterPassword = ({recover,config}) => {
    const {user_info,expired} = config?{}:useLoaderData();
    const [signupState,setSignupState] = useState({});
    const [changesSaved,setChangesSaved] = useState(false);
    const [errorMessage,setErrorMessage] = useState('');
    const {refreshFunction} = useContext(userContext);
    const nav = useNavigate();

    if(expired){
        return <ExpiredJWT/>
    }
    
    const handleChange = (e) => {
        setChangesSaved(false);
        setErrorMessage("");
        const {value,name} = e.target;
        setSignupState(oldValue=>({...oldValue,[name]:value}));
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        const sendState = config? signupState:{userId:user_info.id,...signupState}
        const response = await fetch(recover?"/api/set_recover_password/":config?"/api/change_my_password/":"/api/add_password_admin_invite/",{
            method:"POST",
            headers:{"X-CSRFToken":cookieCutter("csrftoken")},
            body:JSON.stringify(sendState)
        })
        const data = await response.json();
        if(data.success){
            if(config){
                setChangesSaved(true);
                setSignupState({});
                refreshFunction();
            } else {
                nav("/iniciar-sesion");
            }
        } else {
            setErrorMessage(data.error);
        }
    }


    return <MainContainer size="sm" ignore={config}>
        <form className={`${config?"p-3 px-5":"bubble-div items-center"} flex flex-col gap-2`} onSubmit={handleSubmit}>
            <h1 className="text-orange-700 mb-2 ">{config?"Cambiar contraseña":`Hola, ${user_info.first_name}`}</h1>
                <p className="self-start">{recover?
                "Escribe una nueva contraseña y recupera el acceso a tu cuenta.":
                config?
                "Introduce tu contraseña actual y una contraseña de al menos 8 caracteres para continuar.": 
                "Inicia sesión con esta contraseña y tu número de teléfono para acceder a tus órdenes y a nuestro programa de cliente frecuente."}
                </p>
            <ErrorMessage errorContent={errorMessage}/>
            <div className="grid sm:grid-cols-2 gap-2 self-stretch">
                {config &&
                <HoverInput className="col-span-2" label="Contraseña actual">
                    <input value={signupState.password||""} onChange={handleChange} name="password" minLength={8} type="password" required/>
                </HoverInput>
                }
                <PasswordInputs signupState={signupState} handleChange={handleChange} config={true}/>
            </div>
            {changesSaved?
                <button className="btn-green gap-1 items-center flex text-nowrap self-center mt-4">Cambios guardados<Icon icon='check'/></button>:
                <button className="btn-go gap-1 items-center flex text-nowrap self-center mt-4">{recover?"Continuar":config?"Guardar cambios":"Registrarme"}<Icon icon="arrow_forward"/></button>
            }
            {!config &&
                <Link to="/">No soy {user_info.first_name}</Link>
            }
        </form>
    </MainContainer>
}

export default RegisterPassword