import React from "react"
import Plot from "react-plotly.js"

const MonthBalancePlot = ({report}) => {

    // const [labels,parents,values] = Object.entries(spending).reduce((agg,[key,value])=>{
        
    //     return agg[]
    // },[["Entradas","Salidas"],["Febrero 2025", "Febrero 2025"],[earnings, 0]]);
    // const labels = [" Entradas ", " Salidas "];
    // const parents = [passData.report_date[1], passData.report_date[1]];
    // const values = [earnings, 0];

    // for(let [key,value] of Object.entries(spending)){
    //     labels.push(" "+key+" ");
    //     parents.push(" Salidas ");
    //     values[1] += value;
    //     values.push(value);
    // }

    const labels= report.labels.map(each=>{
        
        return each.replace(","," <br> ").replace("-"," <br> ")
    })

    const data = [{
        type: "sunburst",
        labels: labels,
        parents: report.parents,
        values:  report.values,
        branchvalues: 'total',
        marker: {line: {width: 2, color:"#FFF"}},
        maxdepth:3,
        leaf:{opacity:.8},
        hoverinfo:"label+text+value+percent parent",
        insidetextorientation: "radial",
        textfont:{size:14},
    }];

    const layout = {
        height:"500",
        paper_bgcolor:"#0000",
        sunburstcolorway:["#00a6f4","#ED5900"],
        margin: {l:0,r:0,t:0,b:0}
    };

    const config = {
        displayModeBar:false,
        // staticPlot:true,
        responsive:true
    };

    return <Plot className="w-full" data={data} layout={layout} config={config} />
    
}


export default MonthBalancePlot