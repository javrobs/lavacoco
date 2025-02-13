import React from "react";
import { useLoaderData, useNavigate } from "react-router";
import MonthBalancePlot from "../../plots/MonthBalancePlot.jsx"
import HoverSelect from "../../components/HoverSelect.jsx";


const Reportes = () => {
    const {success,...data} = useLoaderData();
    const navigator = useNavigate();
    
    console.log(data);

    const listOfReports = data.dates.map(([value,text])=>{
        return <option key={text} value={value}>{text}</option>
    })

    const changeDate = (e) => {
        const {value} = e.target;
        navigator(`/reportes/${value}`)
    }

    return <main className="container max-w-screen-md mx-auto py-3">
        <div className="bubble-div flex flex-col gap-3">
            <div className="flex gap-3 items-end">

                <h1 className="text-orange-700">Reportes</h1>
                <HoverSelect className="grow" label="Selecciona un reporte">
                    <select value={data.report_date} onChange={changeDate}>
                        <option value="" disabled={true}>Selecciona..</option>
                        {listOfReports}
                    </select>
                </HoverSelect>
            </div>
            {/* <ul className="list-disc">
                {Object.entries(data).map(([key,value])=><li key={key}>{key}: {JSON.stringify(value)}</li>)}
            </ul> */}
            <MonthBalancePlot report={data.report}/>
        </div>
    </main>
}

export default Reportes;