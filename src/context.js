import { createContext, useContext } from 'react';

export const SearchValueContext = createContext({});
export const useSearchValueContext = () => useContext(SearchValueContext);
