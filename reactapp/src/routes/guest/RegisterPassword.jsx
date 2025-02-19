import React,{useState} from "react";
import MainContainer from "../../components/MainContainer.jsx";
import { useLoaderData, Link, useNavigate } from "react-router"; 
import { PasswordInputs } from "../Signup.jsx";
import Icon from "../../components/Icon.jsx";
import ExpiredJWT from "../../components/ExpiredJWT.jsx";
import cookieCutter from "../../utils/cookieCutter.js";
import ErrorMessage from "../../components/ErrorMessage.jsx";


const RegisterPassword = ({recover}) => {
    const {user_info,expired} = useLoaderData();
    const [signupState,setSignupState] = useState({});
    const [errorMessage,setErrorMessage] = useState('');
    const nav = useNavigate();

    if(expired){
        return <ExpiredJWT/>
    }
    
    const handleChange = (e) => {
        const {value,name} = e.target;
        console.log(name,value);
        setSignupState(oldValue=>({...oldValue,[name]:value}));
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(signupState);
        const response = await fetch(recover?"/api/set_recover_password/":"/api/add_password_admin_invite/",{
            method:"POST",
            headers:{"X-CSRFToken":cookieCutter("csrftoken")},
            body:JSON.stringify({userId:user_info.id,...signupState})
        })
        const data = await response.json();
        if(data.success){
            nav("/iniciar-sesion");
        } else {
            setErrorMessage(data.error);
        }
    }

    const title = recover? `Recupera tu contraseña`:`Hola, ${user_info.first_name}`

    return <MainContainer size="sm">
        <form className="bubble-div flex flex-col gap-2" onSubmit={handleSubmit}>
            
            <div className="flex gap-1 mb-2 flex-wrap">
                <h1 className="text-orange-700">{title}</h1>
                <div className="text-sm items-center ms-auto flex py-1 px-3 rounded-full bg-sky-200 text-sky-900 shadow-md">
                    <Icon classNameExtra="text-sm icon-full text-sky-800" icon="phone"/> {user_info.username} 
                </div>
                <div className="text-sm items-center flex py-1 px-3 rounded-full bg-sky-200 text-sky-900 shadow-md">
                    <Icon classNameExtra="text-sm icon-full" icon="person"/> {user_info.first_name} {user_info.last_name}
                </div>
            </div>
            {!recover && <p>Inicia sesión con esta contraseña y tu número de teléfono para acceder a tus órdenes y a nuestro programa de cliente frecuente.</p>}
            <ErrorMessage errorContent={errorMessage}/>
            <div className="grid sm:grid-cols-2 gap-2">
                <PasswordInputs signupState={signupState} handleChange={handleChange}/>
            </div>
            <button className="btn-go btn self-center mt-4">{recover?"Continuar":"Registrarme"}<Icon icon="arrow_forward"/></button>
            <Link className="self-center" to="/">No soy {user_info.first_name}</Link>
        </form>
    </MainContainer>
}

export default RegisterPassword