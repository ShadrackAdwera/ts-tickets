import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { CircularProgress } from '@mui/material';

import useHttp from '../hooks/http-hook';
import AuthForm from '../components/auth/auth-form';

const Auth = () => {
  const router = useRouter();
  const { isLoading, sendRequest } = useHttp();

  const loginHandler = useCallback(async(email, password, url) => {
    const response = await sendRequest(url, 'POST', JSON.stringify({email, password}), {
      'Content-Type': 'application/json'
    }); 
    if(response && response.user) {
      router.replace('/');
    }
  },[]);

  const signUpHandler = useCallback(async(email, password, url) => {
    const response = await sendRequest(url, 'POST', JSON.stringify({email, password}), {
      'Content-Type': 'application/json'
    });
    if(response && response.user) {
      router.replace('/');
    }
  },[]);

  return <AuthForm onLogin={loginHandler} onSignUp={signUpHandler} isLoading={isLoading}/>
};

export default Auth;
