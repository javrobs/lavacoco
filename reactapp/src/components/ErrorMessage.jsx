import React from "react"

export default function ErrorMessage({errorContent}){
    return errorContent && <div className="bg-rose-300 p-1 italic rounded-md shadow-sm">
        {errorContent}
    </div>
}