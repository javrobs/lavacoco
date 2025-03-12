import React, {useState, useEffect, useContext} from "react"
import { Outlet } from "react-router"
import { userContext } from "./App.jsx";
import MainContainer from "./MainContainer.jsx";
import Icon from "./Icon.jsx";
import defaultPost from "../utils/defaultPost.js";


const PasswordProtectedAdminView = ({setUser}) => {
    const [password,setPassword] = useState("");
    const {refreshFunction,extraPassword} = useContext(userContext);
    const [error,setError] = useState(false);



    useEffect(()=>{
        return refreshFunction;
    },[])

    async function go(){
        const data = await defaultPost("/api/load_user_extra_password/",{password:password});
        console.log(data)
        if(data.success){
            setUser(data);
        } else {
            setError(true)
            setPassword("");
        }
    }

    function append(number){
        setPassword(oldValue=>oldValue+String(number))
    }

    function backspace() {
        setPassword(oldValue=>oldValue.slice(0,oldValue.length-1))
    }

    const buttons = [7,8,9,4,5,6,1,2,3,"D",0,"E"].map(each=>{
        switch(each){
            case "D":
                return <button className="btn-orange flex items-center justify-center" key={each} onClick={backspace}><Icon icon="arrow_back"/></button>
            case "E":
                return <button className="btn-go flex items-center justify-center" key={each} onClick={go}><Icon icon="send"/></button>
            default:
                return <button className="btn-white" key={each} onClick={()=>append(each)}>{each}</button>
        }
    })

    

    return <div>
        {extraPassword ?
        <Outlet/>:
        <MainContainer size="sm">
            <div className="bubble-div flex flex-col gap-3">
                <h1 className="text-orange-700">Vista de administrador</h1>
                <p>A continuación, introduce el patrón de administrador para ver el contenido de la página.</p>
                <div className={`self-center grid w-40 gap-2 grid-cols-3 grid-rows-5`}>
                    <div className={`col-span-3 px-3 py-2 text-lg text-center overflow-x-hidden rounded-lg shadow-sm  ${error?"shake":"bg-white"} `}>{password.split("").map(each=>"●")}</div>
                    {buttons}
                </div>
            </div>
            
        </MainContainer>}
    </div>
}

export default PasswordProtectedAdminView