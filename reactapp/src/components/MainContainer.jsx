import React from "react"


const MainContainer = ({children, size}) => {
    
    let sizeClass = ""
    switch(size){
        case "lg":
            sizeClass = "max-w-screen-lg";
            break;
        case "md":
            sizeClass = "max-w-screen-md";
            break;
        case "sm":
            sizeClass = "max-w-screen-sm";
            break;
    }

    return <main className={`sm:py-3 flex flex-col sm:gap-3 mx-auto container ${sizeClass}`}>
        {children}
    </main>
}

export default MainContainer;