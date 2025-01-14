import React, {useRef,useContext,useState,useEffect} from "react"
import {userContext} from "../components/App.jsx"
import {Link,useLoaderData, useNavigate, useNavigation} from "react-router"
import Icon from "../components/Icon.jsx"
import scrollToRef from "../utils/scrollToRef.js"
import MiniMenu from "../components/MiniMenu.jsx"
import FrequentCustomerPlot from "../plots/FrequentCustomerPlot.jsx"
import IconButton from "../components/IconButton.jsx"
import cookieCutter from "../utils/cookieCutter.js"
import Carrousel from "../components/Carrousel.jsx"
import DiscList from "../components/DiscList.jsx"


export default function Home(){
    const user = useContext(userContext);   
    
    return user.logged_in?(user.superuser?<AdminUser/>:<LoggedUser user={user}/>):<NotLoggedUser/>
}



const NotLoggedUser = () => {
    const services = useRef(null);
    const contact = useRef(null);

    const serviceList = [{title:"Lavandería",
                            image:"services.jpg",
                            content:<DiscList list={[
                                "Separamos tu ropa cuidadosamente por colores y tejidos para evitar daños",
                                "Eliminamos las manchas más difíciles",
                                "Secamos tu ropa preservando la calidad de las telas",
                                "Entregamos tu ropa doblada, libre de arrugas y con un aroma fresco"
                                ]}/>},
                        {title:"Planchaduría",
                            image:"iron.jpg",
                            content:<DiscList list={[
                                "Planchamos pieza por pieza con atención al detalle",
                                "Utilizamos vapor para cuidar tu ropa y eliminar arrugas difíciles",
                                "Ofrecemos servicios especializados para prendas delicadas como seda y lino"
                                ]}/>},
                        {title:"Tintorería",
                            image:"dryclean.jpg", 
                            content:<DiscList list={[
                            "Tenemos servicio de tintorería para las prendas más delicadas",
                            "Utilizamos productos especializados para proteger tus prendas",
                            "Tus chamarras, abrigos, vestidos y trajes quedarán como nuevos"
                            ]}/>
                        }
                    ];

    return <div className="relative h-dvh no-scrollbar snap-proximity">
        <video autoPlay muted loop src='/static/frontend/bg-5.mp4' id="hero-vid"/>
        <header className="fixed top-0 z-20 right-0">
            <MiniMenu/>
        </header>
        <section className="z-10 snap-start relative min-h-dvh flex items-center px-3 justify-center">
            <div className='dark-bubble gap-5 p-8 text-center items-center justify-center flex flex-col'>
                <img src='/static/frontend/logo.png' width="300"/>
                <h1 className='text-slate-300 text-4xl text-center font-semibold'>Diligencia, rapidez y gran cariño</h1>
                <div className="flex flex-wrap justify-center gap-3 text-lg">
                    <button className="btn cta" onClick={()=>{scrollToRef(services)}}>
                        Servicios<Icon icon='laundry'/>
                    </button>
                    <button className="btn cta" onClick={()=>{scrollToRef(contact)}}>
                        Contacto<Icon icon='call'/>
                    </button>
                    <Link className="btn cta" to='/lista-de-precios'>
                        Precios<Icon icon='payments'/>
                    </Link>
                </div>
            </div>
        </section>
        <section ref={services} className="z-10 snap-start relative min-h-dvh flex flex-col items-center justify-center mx-auto" id="servicios">
            <Carrousel options={serviceList}/>
        </section>
        <section ref={contact} className="z-10 snap-start relative min-h-dvh px-3 flex flex-col items-center justify-center p-2 mx-auto" id="contacto">
            
            <div className="grid md:grid-cols-2 overflow-hidden dark-bubble">
                <img className="object-cover" src='/static/frontend/home/store.png'/>
                <div className="text-slate-200 p-4 flex flex-col justify-center gap-3">
                    <h2 className="text-3xl font-semibold">Contacto</h2>
                    <div className="flex items-center gap-2">
                    <Icon icon='location_on'/>Luis Elizondo #300-7<br/> Col Tecnológico, CP 64700
                    </div>
                    <div className="flex items-center gap-2">
                    <Icon icon="phone"/>811-732-8650
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon icon='schedule'/>
                        <div className="grow">
                            <div className="flex gap-2 flex-wrap justify-between">
                                Lunes a Viernes <span className="ms-auto">10:00AM a 7:30PM</span>
                            </div>
                            <div className="flex gap-2 flex-wrap justify-between">
                                Sábado <span className="ms-auto">10:00AM a 6:00PM</span>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </section>
    </div>
}

const LoggedUser = ({user}) => {
    const loaderData = useLoaderData()

    function copyLinkToClipboard(){
        navigator.clipboard.writeText(loaderData.user_link).then(()=>{
            console.log("texto copiado")
        },()=>{
            console.log("algo falló :(")
        })
    }

    return <main className="container grow mx-auto grid grid-cols-12 p-3 gap-3 grid-rows-2">
        <div className="col-span-12 sm:col-span-6 bubble-div-with-title">
            <div className="bubble-div-title">Cliente frecuente<Icon icon='award_star'/></div>
            <div className="p-4">
                <h1>Hola, {user.first_name}</h1>
                
                {loaderData.cliente_freq==5?
                'Acumulaste 5 visitas ¡Tienes una carga gratis!':
                `Llevas ${loaderData.cliente_freq} visita${loaderData.cliente_freq>1?"s":""}. Junta 5 para obtener una carga gratis en tu siguiente visita.`}
                <div className="shadow-sm h-8 relative">
                <FrequentCustomerPlot value={loaderData.cliente_freq}/>
                </div>
            </div>
        </div>
        <div className="col-span-12 sm:col-span-6 sm:row-span-2 bubble-div-with-title">
            <div className="bubble-div-title">Órdenes<Icon icon='receipt_long'/></div>
            <div className="p-4">
                
                {loaderData.orden_activa?<div className="border-b-2 border-orange-700">
                    Órden activa
                </div>:<div className="rounded-md bg-slate-300 text-center flex flex-col gap-1 p-3">
                    No tienes una órden activa por el momento.</div>}
                {loaderData.ordenes_pasadas?.length>0 && <div className="border-b-2 border-orange-700">
                    Órdenes pasadas
                </div>}
            </div>
        </div>
        <div className="col-span-12 sm:col-span-6 bubble-div-with-title">
            <div className="bubble-div-title">Invita a un amigo<Icon icon='group_add'/></div>
            <div className="p-4 flex items-stretch flex-col gap-2">
                ¡Comparte tu enlace de lavandería coco y obtén una carga gratis con la primera visita de tu amigo!
                <div className="rounded-md bg-slate-300 text-center flex flex-col gap-1 p-3">
                    {loaderData.user_link}
                    <button onClick={copyLinkToClipboard} className="btn btn-go mx-auto">Copiar enlace<Icon icon='content_copy'/></button>
                </div>
                
            </div>
        </div>
    </main>
}

const AdminUser = () => {

    const initialLoaderData = useLoaderData()
    const [loaderData,setLoaderData] = useState(initialLoaderData); 
    const nav = useNavigate();

    async function promoteOrder(id,promote){
        const response = await fetch("/api/promote_order/",{
            method:"POST",
            headers:{"X-CSRFToken":cookieCutter("csrftoken")},
            body:JSON.stringify({id:id,promote:promote})})
        const data = await response.json();
        if(data.success){
            console.log("promoted this:",id);
            const newLoaderData = await defaultLoader("home");
            setLoaderData(newLoaderData);
        } else {
            console.log("error in promoting",id);
        }
    }

    function Orders ({statusValue}) {
        const orders = [<div key="title-1" className="p-1">ID</div>,
                        <div key="title-2" className="p-1 col-span-3 lg:col-span-5">Nombre</div>,
                        <div key="title-3" className="p-1 col-span-3 lg:col-span-2">Entrega</div>,
                        <div key="title-4" className="p-1 col-span-3 lg:col-span-2">Estado</div>,
                        <div key="title-5" className="p-1 col-span-2">Acciones</div>,
                    ];
        const status = ["Creada","Abierta","Cerrada","Lista","Entregada"];
        // const daysOfWeek = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
        const daysOfWeek = ["Dom","Lun","Mar","Mie","Jue","Vie","Sab"];
        
        let counter = 0;
        loaderData.orders.forEach((each,i)=>{
            if(each.status==statusValue){
                counter++;
                orders.push(<div className={`p-1 ${counter%2?"":"bg-slate-200"}`} key={`id-${i}`}>{each.id}</div>);
                orders.push(<div className={`p-1 col-span-3 lg:col-span-5 ${counter%2?"":"bg-slate-200"}`} key={`name-${i}`}>{each.user__first_name} {each.user__last_name}</div>);
                orders.push(<div className={`p-1 col-span-3 lg:col-span-2 ${counter%2?"":"bg-slate-200"}`} key={`date-${i}`}>{daysOfWeek[each.date__week_day-1]}, {each.date__day||each.date__day}</div>);
                orders.push(<div className={`p-1 col-span-3 lg:col-span-2 ${counter%2?"":"bg-slate-200"}`} key={`status-${i}`}>{status[each.status]}</div>);
                switch(statusValue){
                    default:
                        case 0:
                            orders.push(<div className={`p-1 flex gap-1 flex-wrap col-span-2 ${counter%2?"":"bg-slate-200"}`} key={`action-${i}`}>
                                        <IconButton onClick={()=>promoteOrder(each.id,true)} icon='arrow_right_alt'/>
                                    </div>);
                            break;
                        case 1:
                            orders.push(<div className={`p-1 flex gap-1 flex-wrap col-span-2 ${counter%2?"":"bg-slate-200"}`} key={`action-${i}`}>
                                <IconButton onClick={()=>nav(`/orden/${each.id}`)} icon='list'/>
                            </div>);
                }
            }
        })
        return <div className="grid grid-cols-12">{orders}</div>
    }
        
    return <main className="container mx-auto py-3 grid lg:grid-cols-2 gap-2">
        <div className="bubble-div-with-title lg:col-span-2">
            <div className="bubble-div-title">Acceso rápido<Icon icon='select_check_box'/></div>
            <div className="flex gap-2 justify-center p-3">
                <Link className="btn btn-go" to='/crear-orden'>Crear orden<Icon icon='receipt_long'/></Link>
                <Link className="btn btn-go" to='/crear-cliente'>Nuevo cliente<Icon icon='person_add'/></Link>
            </div>
        </div>
        <div className="bubble-div-with-title">
            <div className="bubble-div-title">Órdenes nuevas<Icon icon='work'/></div>
            <Orders statusValue={0}/>
        </div>
        <div className="bubble-div-with-title">
            <div className="bubble-div-title">Órdenes abiertas<Icon icon='work'/></div>
            <Orders statusValue={1}/>
        </div>
        <div className="bubble-div-with-title">
            <div className="bubble-div-title">Órdenes nuevas<Icon icon='work'/></div>
            <Orders statusValue={2}/>
        </div>
        <div className="bubble-div-with-title">
            <div className="bubble-div-title">Órdenes abiertas<Icon icon='work'/></div>
            <Orders statusValue={3}/>
        </div>
    </main>
}
