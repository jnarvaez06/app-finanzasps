import { createContext, useEffect, useState } from "react";
import { getAccountsSelect } from "../api/catalogos";

export const CatalogosContext = createContext();

export const CatalogosProvider = ({children}) => {
    const [catalogos, setCatalogos] = useState({accounts:[]});

    useEffect(() => {
        Promise.all([getAccountsSelect()]).then(([accounts]) => {
          setCatalogos({ accounts });
        });
      }, []);
    
      return (
        <CatalogosContext.Provider value={catalogos}>
          {children}
        </CatalogosContext.Provider>
      );
}