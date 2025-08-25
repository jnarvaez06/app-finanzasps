import { useContext } from "react";
import { CatalogosContext } from "../context/CatalogosContext";

export const useCatalogos = () => {
  return useContext(CatalogosContext);
};
