import React from "react"
import Plot from "react-plotly.js"

const MonthBalancePlot = ({passData}) => {

    const {earnings,spending} = passData;

    console.log(earnings,spending)

    const data = [{
        type: "sunburst",
        labels: ["Entradas", "Salidas", "Tintorería", "agua", "electricidad", "jabon"],
        parents: ["Febrero 2025", "Febrero 2025", "Salidas", "Salidas", "Salidas", "Salidas"],
        values:  [1450, 325+700+100+150, 325, 700, 100, 150],
        branchvalues: 'total',
        marker: {line: {width: 2}},
        maxdepth:3,
    }];

    const layout = {
        // xaxis: {fixedrange:true,range:[0,5]},
        // yaxis: {fixedrange:true,domain:[-0,1]},
        // barmode: 'stack',
        height:400,
        sunburstcolorway:["#f54a00","#00a6f4"],
        // showlegend:false,
        // margin:{l:0,r:0,t:0,b:0}
        margin: {l:20,r:20,t:20,b:20}
    };

    const config = {
        displayModeBar:false,
        // staticPlot:true,
        responsive:true
    };

    return <Plot className="w-full shadow-sm" data={data} layout={layout} config={config} />
    
}


export default MonthBalancePlot