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
        {concepto:"Cobertor",precios:[140,160,180,250]},
        {concepto:"Edredón",precios:[160,180,200,300]}
    ]

    return <div className='flex flex-wrap gap-2 max-w-2xl'>
    <ListaDePrecios title="Lavandería" elements={listaDePreciosLavanderia}/>
    <ListaDePrecios title="Planchaduría" elements={listaDePreciosPlancha}/>
    <ListaDePrecios title="Tintorería" elements={listaDePreciosTintoreria}/>
    <TablaDePrecios title="Ropa de cama" elements={listaDePreciosSabanas} cols={["Individual","Matrimonial","Queen o King","Voluminoso"]}/>
    </div>
}

function ListaDePrecios(props){
    const asList = props.elements.map((each,i)=>(
            <li className="flex" key={`lava-${i}`}>{each.concepto}<div className="ms-auto">$ {each.precio}</div></li>
        ))

    return <div className="bg-slate-800 grow bg-opacity-75 shadow-md p-8 gap-5 rounded-xl text-center items-center flex flex-col">
        <h1 className='text-orange-600'>{props.title}</h1>
        <ul className='text-slate-300 self-stretch text-lg'>
            {asList}
        </ul>
    </div>
}

function TablaDePrecios(props){
    console.log(props);

    const tabla = props.elements.map((each, i) => {
        console.log(each);
        return (each.precio)?<div className="flex text-slate-300 text-lg" key={`lava-${i}`}>
            {each.concepto}
            <div className="ms-auto">$ {each.precio}</div>
        </div>:<div key={`lava-${i}`}>
        {each.concepto}No tiene precio bb 
        </div>
    })

    return <div className="bg-slate-800 grow bg-opacity-75 shadow-md p-8 gap-5 rounded-xl text-center items-center flex flex-col">
        <h1 className='text-orange-600'>{props.title}</h1>
        <div className="self-stretch text-slate-300 text-lg">
            <div className="flex">
                    Set de sábanas
                    <span className="ms-auto">$ 95</span>
            </div>
            <div className="grid grid-cols-3">
                <div></div><div className="text-end">Cobertor</div><div className="text-end">Edredón</div>
                <div className="text-start">Individual</div><div className="text-end">$140</div><div className="text-end">$160</div>
                <div className="text-start">Matrimonial</div><div className="text-end">$160</div><div className="text-end">$180</div>
                <div className="text-start">Queen o King</div><div className="text-end">$180</div><div className="text-end">$200</div>
                <div className="text-start">Voluminoso</div><div className="text-end">$250</div><div className="text-end">$300</div>
            </div>
        </div>
        
    </div>
}