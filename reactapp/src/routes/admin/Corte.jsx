import React from "react";
import { useLoaderData } from "react-router";
import MainContainer from "../../components/MainContainer.jsx";

const Corte = () => {
    const initialData = useLoaderData();
    console.log(initialData);

    return <MainContainer size="md">
        <div className="bubble-div">
            <h1 className="text-orange-700">Corte</h1>
        </div>
    </MainContainer>
}

export default Corte