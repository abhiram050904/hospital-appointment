import { createContext, useState } from "react";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [aToken, setAToken] = useState('');

    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

    const value = {
        aToken,
        setAToken,
        backendUrl
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
