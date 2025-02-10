import React from "react";
import { useLoaderData } from "react-router";


const Reportes = () => {
    const {success,...data} = useLoaderData();
    
    console.log(data);

    return <main className="container mx-auto py-3">
        <div className="bubble-div">
            <h1 className="text-orange-700">Reportes</h1>
            <ul className="list-disc">
                {Object.entries(data).map(([key,value])=><li key={key}>{key}: {JSON.stringify(value)}</li>)}
            </ul>
        </div>
    </main>
}

export default Reportes;