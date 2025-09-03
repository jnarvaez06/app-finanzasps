import { createContext, useEffect, useState } from "react";
import { getAccountsSelect, getCategoriesSelect, getMonths, getSubCategoriesSelect, getTypesMovement, getYears } from "../api/catalogos";

export const CatalogosContext = createContext();

export const CatalogosProvider = ({children}) => {
    const [catalogos, setCatalogos] = useState({accounts:[]});

    useEffect(() => {
        Promise.all([
            getAccountsSelect(),
            getCategoriesSelect(),
            getSubCategoriesSelect(),
            getTypesMovement,
            getMonths(),
            getYears(),
        ]).then(([
                accounts,
                categories,
                subCategories,
                typesMovement,
                months,
                years,
            ]) => {
                setCatalogos({
                    accounts,
                    categories,
                    subCategories,
                    typesMovement,
                    months,
                    years,
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