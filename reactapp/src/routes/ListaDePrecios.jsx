import React, { useContext, useState } from "react";
import { useLoaderData , useNavigate} from "react-router"
import GridDivider from "../components/GridDivider.jsx";
import Icon from '../components/Icon.jsx'
import cookieCutter from "../utils/cookieCutter.js";
import MiniIconButton from "../components/MiniIconButton.jsx";



const ListaDePrecios = () => {

    const [priceChanges,setPriceChanges] = useState({})
    const navigator = useNavigate();
    const loader = useLoaderData();
    const adminMode = Object.keys(loader.prices[0].prices[0]).includes("price_dryclean");

    function editPrice(e) {
        const {value,name} = e.target;
        const pattern = new RegExp(/^[0-9]*$/)
        if(pattern.test(value)){
            setPriceChanges((oldValues)=>{
                return {...oldValues,[name]:value}
            });
        }
    }

    function deleteChange(key){
        setPriceChanges((oldValue)=>{
            const {[key]:something, ...newItems} = oldValue;  
            return newItems;
        })
    }

    function submitChanges(){
        fetch("/api/change_prices/",{
            method:"POST",
            headers:{"X-CSRFToken":cookieCutter("csrftoken")},
            body:JSON.stringify(priceChanges)
        }).then(response=>response.json())
        .then(data=>{
            if(data.success){
                console.log(data);
                navigator(0);
            }
        })
    }


    const listOfPrices = loader.prices.map((each,i)=>{

        const innerList = [];

        if(each.id==4&&!adminMode){
            each['Sábana'].forEach((eachAgain,j)=>{
                innerList.push(<div key={`text-${j}`} className="col-span-3">{eachAgain.text}</div>);
                innerList.push(<div key={`price-${j}`} className="text-end">$ {eachAgain.price}</div>);
                if (j == 0){
                    innerList.push(<GridDivider key={`divider1-${j}}`} cols={4}/>)
                }
            })
            innerList.push(<div key="blank" className="col-span-2"></div>)
            innerList.push(<div key="title1" className="text-end">Cobertor</div>)
            innerList.push(<div key="title2" className="text-end">Edredón</div>)
            for(let j = 0; j < each["Cobertor"].length ; j++){
                innerList.push(<div key={`textcobertores-${j}`} className="col-span-2">{each["Cobertor"][j].text}</div>)
                innerList.push(<div key={`cobertor-${j}`} className="text-end">$ {each["Cobertor"][j].price}</div>)
                innerList.push(<div key={`edredon-${j}`} className="text-end">$ {each["Edredón"][j].price}</div>)
                if (j < each["Cobertor"].length - 1) innerList.push(<GridDivider key={`divider2-${j}}`} cols={4}/>)
            }
        } else {
            each.prices.forEach((eachAgain,j)=>{
                innerList.push(<div key={`text-${j}`} className={adminMode?"flex col-span-2 items-end":"col-span-2"}>{eachAgain.text}</div>);
                innerList.push(<div key={`price-${j}`} className={adminMode?"flex gap-1 items-baseline":"text-end"}>
                    $ {adminMode?
                        <label className="relative flex items-center">
                            <input onInput={editPrice} type='number' value={Object.keys(priceChanges).includes(`price-${eachAgain.id}`)?priceChanges[`price-${eachAgain.id}`]:eachAgain.price} className='no-arrow min-w-16' autoComplete="off" name={`price-${eachAgain.id}`}/>
                            {Object.keys(priceChanges).includes(`price-${eachAgain.id}`)&&<MiniIconButton classNameExtra="absolute" onClick={()=>deleteChange(`price-${eachAgain.id}`)} icon="undo"/>}
                        </label>
                        :
                        eachAgain.price}
                    </div>);
                if(adminMode){
                    innerList.push(<div key={`price-dc-${j}`} className="flex gap-1 items-baseline">
                        $ <label className="relative flex items-center">
                            <input onInput={editPrice} type='number' value={Object.keys(priceChanges).includes(`tinto-${eachAgain.id}`)?priceChanges[`tinto-${eachAgain.id}`]:eachAgain.price_dryclean} className='no-arrow min-w-16' autoComplete="off" name={`tinto-${eachAgain.id}`}/>
                            {Object.keys(priceChanges).includes(`tinto-${eachAgain.id}`)&&<MiniIconButton classNameExtra="absolute" onClick={()=>deleteChange(`tinto-${eachAgain.id}`)} icon="undo"/>}
                        </label>
                        </div>);
                }
                if(j < each.prices.length-1) innerList.push(<GridDivider key={`divider-${j}}`} cols={adminMode?4:3}/>)   
            })
        }

        const tableTitles = <>
            <div className="col-span-2 mt-1">Concepto</div>
            <div className=" mt-1">Precio</div>
            <div className=" mt-1">Tinto</div>
        </>

        return <div style={{flexBasis:"min-content"}} className="bubble-div min-w-72 sm:min-w-96 grow" key={`price-${i}`}>
            <h1 className="text-center text-orange-700">{each.text}</h1>
            <div className={`grid gap-1 ${adminMode||each.id==4?"grid-cols-4":"grid-cols-3"}`}>
            {each.id==1&&!adminMode&&<div className='col-span-3 text-start text-sky-800 italic mx-2'>Por carga:</div>}
            {adminMode&&tableTitles}
            {innerList}
            {each.id==4&&!adminMode&&<div className='col-span-4 text-start text-sky-800 italic mx-2'>No aplica para edredones gruesos, de pluma de ganso, o de lavado en seco.</div>}
            </div>
        </div>
    });


    return <main className="container max-w-4xl mx-auto gap-3 py-3 flex flex-wrap">
            {listOfPrices}
            {adminMode && 
            <button className="btn btn-go disabled:bg-slate-400 grow min-w-full" onClick={submitChanges} disabled={Object.keys(priceChanges).length==0}>
                {Object.keys(priceChanges).length==0?
                    <>No hay cambios<Icon icon="check"/></>:
                    <>Guardar cambios<Icon icon="upgrade"/></>}
            </button>}
        </main>
}

export default ListaDePrecios;

