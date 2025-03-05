import React from "react"


const MainContainer = ({children, size,ignore}) => {
    
    let sizeClass = ""
    switch(size){
        case "lg":
            sizeClass = "max-lg:max-w-full max-w-screen-lg";
            break;
        case "md":
            sizeClass = "max-md:max-w-full max-w-screen-md";
            break;
        case "sm":
            sizeClass = "max-sm:max-w-full max-w-screen-sm";
            break;
    }

    return ignore?<>{children}</>:<main className={`sm:py-3 flex flex-col sm:gap-3 mx-auto container ${sizeClass}`}>
        {children}
    </main>
}

export default MainContainer;