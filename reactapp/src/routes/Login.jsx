import React, {useState} from "react"
import {Link} from "react-router"
import cookieCutter from "../utils/cookieCutter.js"
import Header from "../components/Header.jsx"
import ErrorMessage from "../components/ErrorMessage.jsx"
import Icon from "../components/Icon.jsx"

export default function Login(){
    const [loginState,setLoginState] = useState({})
    const [loginFailed,setLoginFailed] = useState("");

    function handleChange(e){
        const {name,value} = e.target;
        setLoginState(oldState=>({...oldState,[name]:value}))
    }

    function handleSubmit(e){
        e.preventDefault();
        console.log(e);
        fetch("/api/login_user",{
            method:"POST",
            headers:{"X-CSRFToken":cookieCutter("csrftoken")},
            body:JSON.stringify(loginState)
        }).then(response=>response.json()).then(data=>{
            console.log(data);
            setLoginFailed((oldState)=>"La cagaste bb");
        });
    }

    return <>
        <header>
            <img src='/static/frontend/logomini.svg' className='logo p-2 max-h-24 min-w-16'/>
        </header>
        <form className="flex max-w-lg mx-auto flex-col gap-3 my-3 rounded-xl bubble-div justify-center text-center" onSubmit={handleSubmit}>
            <h1 className="text-center text-orange-700">Inicia sesión</h1>
            <ErrorMessage errorContent={loginFailed}/>
            <label className="inputLabel">
                <input value={loginState.phone} onInput={handleChange} minLength={10} name="phone" type="number" required/>
                <span>Teléfono</span>
            </label>
            <label className="inputLabel">
                <input value={loginState.pw} onInput={handleChange} minLength={8} name="pw" type="password" required/>
                <span>Contraseña</span>
            </label>
            <button className="btn-go btn self-center mt-3" >Ingresar<Icon icon='login'/></button>
            <Link to='/crear-cuenta'>Todavía no tengo usuario</Link>
        </form>
    </>
}