import React from "react"
import { useLoaderData } from "react-router";

const Tintoreria = () => {
    const loader = useLoaderData();
    console.log(loader);
    return <main className="container mx-auto max-w-screen-md flex flex-col my-3">
        <div className="bubble-div p-4">
            <h1 className="text-orange-700">Tintorería</h1>
            
        </div>
    </main>
}

export default Tintoreria;
