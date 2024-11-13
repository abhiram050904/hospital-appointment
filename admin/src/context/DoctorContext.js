import { createContext } from "react";


export const doctorcontext=createContext()

const DoctorcontextProvider=(props)=>{
    const value={

    }

    return (
        <doctorcontext.Provider value={value}>
            {props.children}
        </doctorcontext.Provider>
    )
}

export default DoctorcontextProvider