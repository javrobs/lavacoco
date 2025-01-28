import React, {useEffect, useState} from "react"
import {useLoaderData, useNavigate, useParams} from "react-router"
import HoverInput from "../../components/HoverInput.jsx";
import HoverSelect from "../../components/HoverSelect.jsx";
import Icon from "../../components/Icon.jsx";
import cookieCutter from "../../utils/cookieCutter.js";
import ErrorMessage from '../../components/ErrorMessage.jsx';
import {AddressForm} from "../Signup.jsx"

const CrearOrden = () => {

    const { userId } = useParams();
    const load = useLoaderData();
    const [formState,setFormState] = useState({user:userId || ""})
    const [orderFailed,setOrderFailedState] = useState("");
    const [addressEditing,setAddressEditing] = useState(false);
    const navigate = useNavigate();

    console.log(load);
    console.log(formState);

    function handleChange(e){
        const {value,name,type,checked} = e.target;
        if(type=="checkbox"){
            setFormState(oldValues=>({...oldValues,[name]:checked}));
        } else {
            setFormState(oldValues=>({...oldValues,[name]:value}));
        }
    }

    function handleSubmit(e){
        e.preventDefault();
        fetch("/api/create_order/",{
            method:"POST",
            headers:{"X-CSRFToken":cookieCutter("csrftoken")},
            body:JSON.stringify(formState)
        }).then(response=>response.json())
        .then(data=>{
            if(data.success){
                console.log(data);
                navigate("/");
            } else {
                setOrderFailedState(data.error);
            }
        })
    }    
    
    function handleUserChange(e){
        const {value} = e.target;
        if(value=="new"){
            navigate('/crear-cliente');
        } else {
            setFormState(oldState=>{
                const {calle,colonia,numero_int,numero_ext,cp,...newItems} = oldState;
                return newItems;
            })
            setAddressEditing(false);            
        }
        handleChange(e);
    }

    useEffect(()=>{
        const userInfo = load.users.find(each=> each.id == formState.user);
        if(userInfo?.address){
            setFormState(oldState => {
                const {user,...newItems} = userInfo.address;
                return {...oldState, ...newItems}
            })
            setAddressEditing(true);
        }
    },[formState.user])
    

    const AddressElement = 
        <div className="sm:col-span-2 relative">
                {addressEditing?
                <button type="button" onClick={()=>setAddressEditing(false)} className="text-orange-700 flex items-center gap-1 hover:text-orange-500 cursor-pointer absolute right-0 top-2">
                    Editar dirección
                    <Icon icon='edit'/>
                </button>:
                <p>Proporciona la dirección de entrega:</p>}
            <AddressForm formState={formState} handleChange={handleChange} notEditable={addressEditing}/>
        </div>

    return <main className="container mx-auto py-3">
        <form className="bubble-div max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-2 gap-1 align-middle" onSubmit={handleSubmit}>
            <div className="flex flex-wrap items-center justify-between sm:col-span-2">
                <h1 className="text-orange-700">Nueva orden</h1>
                <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-1">
                        <input type="checkbox" className="accent-blue-700" name="deliver" value={formState.deliver||""} id="deliver" onChange={handleChange}/>
                        <Icon classNameExtra="text-blue-600 shadow-sm bg-blue-200 rounded-full" icon="directions_car"/>
                    </label>
                    <label className="flex items-center gap-1">
                        <input type="checkbox" className="accent-orange-700" name="priority" value={formState.priority||""} id="priority" onChange={handleChange}/>
                        <Icon classNameExtra="text-orange-600 shadow-sm bg-orange-200 rounded-full" icon="brightness_alert"/>
                    </label>
                </div>
                
            </div>
            {orderFailed&&<div className="text-center sm:col-span-2">
                <ErrorMessage errorContent={orderFailed}/>
            </div>}
            <div className="mx-6 grid sm:col-span-2 gap-1">
                <HoverSelect className="sm:col-span-2" label="Cliente">
                    <select onChange={handleUserChange} id="user" name="user" value={formState.user||""} required>
                        <option value="" disabled>Selecciona...</option>
                        {load.users.map(each=><option key={`user-${each.id}`} value={each.id}>{each.first_name} {each.last_name}</option>)}
                        <option className="bg-blue-200" value='new'>Cliente nuevo</option>
                    </select>
                </HoverSelect>
                <HoverInput className="sm:col-span-2" label="Entrega">
                    <input onChange={handleChange} type="date" name="date" id="date" value={formState.date||""} required/>
                </HoverInput>
            </div>
            
            {formState.deliver&&formState.user&&AddressElement}
            <button className="btn btn-go sm:col-span-2 justify-self-center mt-2">Crear orden<Icon icon='add_box'/></button>
        </form>
        
    </main>
}

export default CrearOrden;
