import React from "react"
import Header from "../components/Header.jsx"

export default function Lista(){

    const listaDePreciosLavanderia = [
        {concepto:"Carga lavado y secado",precio:95},
        {concepto:"Carga sólo secado",precio:60},
        {concepto:"Carga lavado y secado, mismo día",precio:115},
        
    ]

    const listaDePreciosPlancha = [
        {concepto:"Prenda",precio:20},
        {concepto:"Gancho",precio:5}
    ]

    const listaDePreciosTintoreria = [
        {concepto:"Traje dos piezas",precio:140},
        {concepto:"Saco",precio:100},
        {concepto:"Falda, blusa, pantalón", precio:50},
    ]

    const listaDePreciosSabanas = [
        {concepto:"Set de sábanas",precio:95},
        {concepto:"Cobertor individual",precio:140},
        {concepto:"Cobertor Matrimonial",precio:160},
        {concepto:"Cobertor Queen o King",precio:180},
        {concepto:"Cobertor Voluminoso",precio:250},
        {concepto:"Edredón individual",precio:160},
        {concepto:"Edredón Matrimonial",precio:180},
        {concepto:"Edredón Queen o King",precio:200},
        {concepto:"Edredón Voluminoso",precio:300}
    ]

    return <>
    <Header/><div className='flex flex-wrap gap-2 p-2 max-w-xl mx-auto'>
    <BorderBlueDiv title="Lavandería" elements={listaDePreciosLavanderia}/>
    <BorderBlueDiv title="Planchaduría" elements={listaDePreciosPlancha}/>
    <BorderBlueDiv title="Tintorería" elements={listaDePreciosTintoreria}/>
    <BorderBlueDiv title="Ropa de cama" elements={listaDePreciosSabanas}/>
    </div>
    </>
}

function BorderBlueDiv(props){
    const asList = props.elements.map((each,i)=>(
            <li className="flex" key={`lava-${i}`}>{each.concepto}<div className="ms-auto">$ {each.precio}</div></li>
        ))

    return <div className="border-blue-div">
        <h1>{props.title}</h1>
        <ul>
            {asList}
        </ul>
    </div>
}