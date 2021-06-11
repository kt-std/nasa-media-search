import { createContext, useContext } from 'react';

export const MediaTypesContext = createContext([]);
export const useMediaTypesContext = () => useContext(MediaTypesContext);
