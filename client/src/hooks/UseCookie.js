import { useState } from "react";
import Cookies from 'universal-cookie';



function UseCookie(key, initialValue) {
        const cookies = new Cookies();
                
        const [storedValue, setStoredValue] = useState(() => {
        try {
                const item = cookies.get(key)
                return item ? item : initialValue;
        } catch (error) {
                return initialValue;
        }
        });
    
        const setValue = (value) => {
                try {
                        const valueToStore =  value instanceof Function ? value(storedValue) : value;
                        setStoredValue(valueToStore);
                        cookies.set(key, valueToStore);
                } catch (error) {
                        console.log(error);
                }

        };
    
        return [storedValue, setValue];
  }

  export default UseCookie;