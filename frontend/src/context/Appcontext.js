import { createContext } from "react";
import { doctors } from "../assets/assets";
import { FaRupeeSign } from "react-icons/fa";

export const Appcontext = createContext();

const AppcontextProvider = (props) => {
  const Currency_symbol = <FaRupeeSign />;
  
  const value = {
    doctors,
    Currency_symbol
  };

  return (
    <Appcontext.Provider value={value}>
      {props.children}
    </Appcontext.Provider>
  );
};

export default AppcontextProvider;
