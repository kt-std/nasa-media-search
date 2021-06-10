import { createContext, useContext } from './framework';

export const MediaTypesContext = createContext([]);
export const useMediaTypesContext = () => useContext(MediaTypesContext);
