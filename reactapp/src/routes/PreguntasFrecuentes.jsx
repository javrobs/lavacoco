import React,{useState} from "react";
import {useLoaderData} from "react-router";
import Icon from "../components/Icon.jsx"

const PreguntasFrecuentes = () => {
    const loader = useLoaderData();
    const [expandQuestion,setExpandQuestion] = useState(null)
    
    const Questions = loader.questions.map((each,i)=>{

        const style={
            transition:"1s ease-in-out max-height",
            overflow:"hidden",
            maxHeight:(i==expandQuestion?"1000px":"0px")
        }

        const rotateStyle={
            transition:".3s ease-in-out transform",
            transform:(i==expandQuestion?"rotate(180deg)":"rotate(0deg)")
        }

        return <div className={`py-3 ${i<loader.questions.length-1?"border-b-2 border-slate-800":""}`} key={`question-${i}`} >
            <div className="flex text-lg justify-between transition-colors hover:text-sky-700 cursor-pointer" onClick={()=>{setExpandQuestion(oldValue=>oldValue==i?null:i)}}>
                {each.question} 
                <div style={rotateStyle} className="flex items-center">
                    <Icon icon='keyboard_arrow_down'/>
                </div>
            </div>
            <div style={style} className="overflow-hidden rounded-lg bg-slate-300">
                <div className="p-2 italic">
                    {each.answer}
                </div>
            </div>
        </div>
    })

    return <div className="container mx-auto bubble-div my-3">
        <h1 className="text-orange-700">Preguntas frecuentes</h1>
        {Questions}
    </div>
}



export default PreguntasFrecuentes;