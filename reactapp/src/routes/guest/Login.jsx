import React, {useState,useContext} from "react"
import {Link,useNavigate} from "react-router"
import cookieCutter from "../../utils/cookieCutter.js"
import ErrorMessage from "../../components/ErrorMessage.jsx"
import Icon from "../../components/Icon.jsx"
import {userContext} from "../../components/App.jsx"
import HoverInput from "../../components/HoverInput.jsx"

export default function Login(){
    const [loginState,setLoginState] = useState({})
    const [loginFailed,setLoginFailed] = useState("");
    const {refreshFunction} = useContext(userContext);
    const [redirect,setRedirect] = useState(false);
    const navigate = useNavigate();
    
    function phoneInputChange(e){
        const {value} = e.target;
        const onlyNumbers = new RegExp(/^[0-9]*$/);
        const tenNumbers = new RegExp(/^[0-9]{10}$/);
        if (onlyNumbers.test(value)){
            setLoginState(oldState=>({...oldState,username:value}));
        }
        if (tenNumbers.test(value)){
        }
    }

    function handleChange(e){
        const {name,value} = e.target;
        setLoginState(oldState=>({...oldState,[name]:value}))
    }

    function handleSubmit(e){
        e.preventDefault();
        fetch("/api/login_user/",{
            method:"POST",
            headers:{"X-CSRFToken":cookieCutter("csrftoken")},
            body:JSON.stringify(loginState)
        })
        .then(response=>response.json())
        .then(data=>{
            if(data.success){
                refreshFunction().then(()=>{
                    setRedirect(true);
                });
            } else {
                setLoginFailed(data.error);
            }
        });
    }

    if (redirect) {
        navigate('/');
    }

    return <main className="container mx-auto">
        <form className="flex max-w-lg mx-auto flex-col sm:mt-3 gap-3 bubble-div justify-center text-center" onSubmit={handleSubmit} autoComplete="on">
            <h1 className="text-center text-orange-700">Inicia sesión</h1>
            <ErrorMessage errorContent={loginFailed}/>
            <HoverInput label="Teléfono (10 dígitos)">
                <input type="tel" id='username' value={loginState.username||""} onInput={phoneInputChange} pattern='[0-9]{10}' name="username" autoComplete="username" required/>
            </HoverInput>
            <HoverInput label="Contraseña">
                <input id='pw' value={loginState.pw||""} onInput={handleChange} minLength={8} name="pw" type="password" autoComplete="current-password" required/>
            </HoverInput>
            <button className="btn-go btn self-center mt-3" >Ingresar<Icon icon='login'/></button>
            <Link className="self-center" to='/crear-cuenta'>Todavía no tengo usuario</Link>
        </form>
        </main>
}