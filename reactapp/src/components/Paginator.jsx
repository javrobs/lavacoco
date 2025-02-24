import React, {useRef} from "react"
import defaultLoader from "../utils/defaultLoader.js";
import MiniIconButton from "./MiniIconButton.jsx";

const Paginator = ({page,num_pages,children,resetState,loader,className}) => {
    const pageInput = useRef(null);


    async function backPage(){
        const {success, ...getFreshState} = await defaultLoader(loader,page-1);
        if(success){
            resetState(getFreshState);
            console.log("is this happening?", getFreshState)
            pageInput.current.value = getFreshState.page;
        }
    }

    async function nextPage(){
        const {success, ...getFreshState} = await defaultLoader(loader,page+1);
        if(success){
            resetState(getFreshState);
            console.log("is this happening?", getFreshState)
            pageInput.current.value = getFreshState.page;
        }
    }

    async function changePage(e){
        let {value} = e.target;
        value = Number(value);
        if(value > num_pages) value = num_pages;
        if(value > 0){
            const {success,...getFreshState} = await defaultLoader(loader,value);
            if(success){
                resetState(getFreshState);
                pageInput.current.value = getFreshState.page;
                pageInput.current.blur();
            }
        }
    }

    async function changePageOnEnter(e){
        if(e.key=="Enter") changePage(e);
    }

    return <div className={`${className}`}>
        {children}
        {num_pages > 1 && <div className="flex justify-center gap-1 py-1 items-center">
        <MiniIconButton icon="chevron_backward" onClick={backPage} disabled={page == 1}/>
        <input ref={pageInput} className="!w-12 !h-6" onBlur={changePage} onKeyDown={changePageOnEnter} defaultValue={page}/> de {num_pages}
        <MiniIconButton icon="chevron_forward" onClick={nextPage} disabled={page == num_pages}/>
        </div>}
    </div>
}


export default Paginator;