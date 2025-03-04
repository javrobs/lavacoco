import React, { useState, useRef, useEffect} from "react"
import lowerCaseNoAccent from "../utils/lowerCaseNoAccent.js"

const TextSelect = ({label,className,idName,optionList,value,changeState,inFlex}) => {
    const [searchValue,setSearchValue] = useState(optionList.find(({id})=>id==value)?.text||"");
    const [showList,setShowList] = useState(false);
    const inputRef = useRef(null);
    const divRef = useRef(null);

    const listOfMatches = optionList
        .filter(({text})=>lowerCaseNoAccent(text).includes(lowerCaseNoAccent(searchValue)))
        .map(({id,text})=>(
        <button 
            type="button" 
            onClick={()=>selectOption(id)} 
            className="px-3 w-full py-1 text-start bg-slate-50 hover:bg-sky-200" 
            key={id}
        >
            {text}
        </button>));

    function manageInput(e){
        setSearchValue(e.target.value);
    }

    function checkEnter(e){
        if(e.key=="Enter"){
            e.preventDefault();
            const {id} = optionList.find(({text})=>lowerCaseNoAccent(text).includes(lowerCaseNoAccent(searchValue)))
            selectOption(id)
        }
    }

    function selectOption(id){
        setSearchValue(optionList.find(each=>each.id==id)?.text);
        changeState(id);
        setShowList(false);
        inputRef.current.blur();
    }

    useEffect(()=>{
        const matchWithValue = optionList.find(({text}) => {
            return lowerCaseNoAccent(text) == lowerCaseNoAccent(searchValue)
        });
        console.log('match', matchWithValue, value);
        inputRef.current.setCustomValidity(matchWithValue && matchWithValue.id == value?"":"Elige un elemento de la lista")
    },[searchValue])

    useEffect(()=>{
        if(showList){
            function listenForClickOut(e){
                if(divRef.current !== e.target && !divRef.current.contains(e.target)){
                    setShowList(false);
                    inputRef.current.blur();
                    window.removeEventListener("click", listenForClickOut)
                } 
            }
            window.addEventListener("click", listenForClickOut)
            return () => {window.removeEventListener("click", listenForClickOut)}
        }
    },[showList])

    return <div className={`flex flex-col  ${className}`} ref={divRef} >
        <label className={`inputLabel ${searchValue?"valued":""}`}>
            <input ref={inputRef} 
                className={inFlex?(showList?"!rounded-b-none !rounded-tr-none !rounded-tl-xl":"!rounded-r-none"):(showList?"!rounded-b-none !rounded-t-xl":"")}
                type="text" 
                onChange={manageInput} 
                onFocus={()=>setShowList(true)}
                onKeyDown={checkEnter}
                id={idName} 
                name={idName}
                value={searchValue}
                required
            />
            <span>{label}</span>
        </label>
        <div className="relative">
            {showList && 
            <div className="z-10 max-h-[50dvh] border-sky-600  border-2 border-t-0 shadow-md rounded-b-xl overflow-auto no-scrollbar-x absolute w-full divide-y-[1px] divide-sky-600">
                {listOfMatches}
            </div>}
        </div>
    </div>
}


export default TextSelect;