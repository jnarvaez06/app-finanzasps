import { createContext, useEffect, useState } from "react";
import { getAccountsSelect, getCategoriesSelect, getSubCategoriesSelect, getTypesMovement } from "../api/catalogos";

export const CatalogosContext = createContext();

export const CatalogosProvider = ({children}) => {
    const [catalogos, setCatalogos] = useState({accounts:[]});

    useEffect(() => {
        Promise.all([
            getAccountsSelect(),
            getCategoriesSelect(),
            getSubCategoriesSelect(),
            getTypesMovement
        ]).then(([
                accounts,
                categories,
                subCategories,
                typesMovement
            ]) => {
                setCatalogos({
                    accounts,
                    categories,
                    subCategories,
                    typesMovement
                });
            }
        );
      }, []);
    
      return (
        <CatalogosContext.Provider value={catalogos}>
          {children}
        </CatalogosContext.Provider>
      );
}