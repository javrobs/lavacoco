import React from "react"
import Plot from "react-plotly.js"

const FrequentCustomerPlot = ({value}) => {

    const data = [{
        x : [value],
        orientation: "h",
        width:1,
        marker: {color:"hsla(200,80,60,1)"},
        type:"bar"
    }];

    const layout = {
        xaxis: {fixedrange:true,range:[0,5]},
        yaxis: {fixedrange:true,domain:[-0,1]},
        barmode: 'stack',
        height:32,
        showlegend:false,
        margin:{l:0,r:0,t:0,b:0}
    };
    const config = {
        displayModeBar:false,
        staticPlot:true,
        responsive:true
    };

    return <Plot className="w-full shadow-sm" data={data} layout={layout} config={config} />
    
}


export default FrequentCustomerPlot