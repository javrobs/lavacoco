import React,{useState} from "react"
import Icon from "./Icon.jsx"

const MiniMenu = ({children}) => {
    const [menuShowing,setMenuShowing] = useState(false);

    const style = {
        transition: ".2s",
        transform: menuShowing?"translate(-16rem,0rem)":"translate(0rem,0rem)"
    }

    return <>
        <button className='miniMenuButton' onClick={()=>setMenuShowing(true)}>
            <Icon classNameExtra='text-3xl' icon="menu"/>
        </button>
        <div style={style} className={`mini-menu`}>
            <button className="text-start px-2" onClick={()=>setMenuShowing(false)}><Icon icon='close'/></button>
            {children}
            <a>Tu mama es mi perro</a>
            <a>Tu mama es mi gato</a>
            <a>Tu mama es mi lagarto</a>
        </div></>
}

export default MiniMenu;