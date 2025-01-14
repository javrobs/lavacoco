import React,{useState} from "react";

const Carrousel = ({options}) => {
    const [selected,setSelected] = useState(0);



    const list = options.map(({title,image,content},index)=>{

        const style = {
            background:`url('/static/frontend/home/${image}')`,
            backgroundSize:"cover",
            backgroundAttachment:"fixed",
            backgroundPosition:"50%",
            transition:"1s flex-grow"
        };

        return <div key={`service-${title}`} onClick={()=>{setSelected(index)}} style={style} className={`${selected==index?"grow p-3":"hover:text-sky-400"} text-slate-200 cursor-pointer flex relative flex-col items-center justify-center gap-3`}>
            <div className={`transition-all flex flex-col justify-center items-center dark-bubble ${selected==index?"md:p-12":"self-stretch h-24 !rounded-none"} p-3 gap-3`}>
                <h2 className="text-3xl text-center font-semibold">{title}</h2>
                {selected==index&&<div className="border-t-2 border-orange-400">
                    {content}
                </div>}
            </div>
        </div>
    })


    return <div className='grow no-scrollbar-x scroll-m-0 snap-x snap-mandatory self-stretch flex flex-col overflow-x-scroll'>          
        {list}
    </div>
}



export default Carrousel;