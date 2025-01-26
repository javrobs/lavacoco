import React, {useRef} from "react"
import {Link} from "react-router"
import scrollToRef from "../../utils/scrollToRef.js"
import MiniMenu from "../../components/MiniMenu.jsx"
import Carrousel from "../../components/Carrousel.jsx"
import DiscList from "../../components/DiscList.jsx"
import Icon from "../../components/Icon.jsx"



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
                <h1 className='!text-slate-300 text-4xl text-center font-semibold'>Diligencia, rapidez y gran cariño</h1>
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
                        <div className="grow flex gap-2 flex-wrap">
                            Lunes a Sábado <span className="ms-auto">10:00AM a 7:00PM</span>
                        </div>
                    </div>
                </div>
                
            </div>
        </section>
    </div>
}

export default NotLoggedUser;