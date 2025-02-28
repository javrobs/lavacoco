import React,{useState, useEffect, useRef} from "react"
import Icon from "./Icon.jsx";

const CopyLinkButton = ({textToCopy}) => {
    const [copied,setCopied] = useState(false);
    const buttonRef = useRef(null);


    function copyLinkToClipboard(){
        navigator.clipboard.writeText(textToCopy).then(()=>{
            console.log("texto copiado")
            setCopied(true);
        },()=>{
            console.log("algo falló :(")
        })
    }

    useEffect(()=>{
        if(copied){
            function returnCopiedState(e){
                if(buttonRef.current!=e.target){
                    setCopied(false);
                    document.removeEventListener("click",returnCopiedState);
                }
            }
            document.addEventListener("click",returnCopiedState);
            return ()=>{document.removeEventListener("click",returnCopiedState);}
        }
    },[copied])

    return <button ref={buttonRef} onClick={copyLinkToClipboard} className={`flex gap-1 items-center btn-go ${copied?"!bg-lime-500 hover:!bg-lime-600":""}`}>
        {copied?
        <>Copiado<Icon icon='check'/></>:
        <>Copiar liga<Icon icon='link'/></>
        }
    </button>
}


export default CopyLinkButton