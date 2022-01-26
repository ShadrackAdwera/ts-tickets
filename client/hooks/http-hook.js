import { useState, useEffect, useRef, useCallback } from 'react';

const useHttp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortionRef = useRef([]);

    const sendRequest = useCallback(async(url, method='GET', body=null, headers={})=>{
        setIsLoading(true);
        const AbortController = window.AbortController;
        const abortion = new AbortController();
        abortionRef.current.push(abortion);
        try {
            const response = await fetch(url, {
                method, body, headers, signal: abortion.signal
            });
            const resData = await response.json();
            if(!response.ok) {
                throw new Error(resData.message);
            }
            setIsLoading(false);
            return resData;
        } catch (error) {
            setIsLoading(false);
            setError(error);
            throw error;
        }
    },[]);

    const clearError = () => {
        setError(null);
    }

    useEffect(()=>{
        return ()=> {
            abortionRef.current.forEach(abt=>abt.abort());
        }
    },[]);

    return { isLoading, sendRequest, error, clearError };
}

export default useHttp;

export default useHttp;