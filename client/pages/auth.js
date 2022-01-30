import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { signIn, getSession } from 'next-auth/client';

import useHttp from "../hooks/http-hook";
import AuthForm from "../components/auth/auth-form";

const Auth = () => {
  const router = useRouter();
  const { isLoading, sendRequest } = useHttp();

  const loginHandler = useCallback(async (email, password, url) => {
    try {
      const response = await signIn("credentials", { redirect: false, email, password });
        console.log(response);
      if(response.error) {
        throw new Error(response.error);
      }
      if(!response.error) {
          console.log('Method to login. . . ');
          //login(response.user);
          setTimeout(()=>{
            router.push('/');
          },1500);
      }
    } catch (error) {
        console.log(error);
    }
  }, []);

  const signUpHandler = useCallback(async (email, password, url) => {
    const response = await sendRequest(
      url,
      "POST",
      JSON.stringify({ email, password }),
      {
        "Content-Type": "application/json",
      }
    );
    if (response && response.user) {
      router.replace("/auth");
      // alert('Login to continue');
    }
  }, []);

  return (
    <AuthForm
      onLogin={loginHandler}
      onSignUp={signUpHandler}
      isLoading={isLoading}
    />
  );
};

export async function getServerSideProps({req}) {
  const session = await getSession({req});
  if(session) {

      return {
          props: {
              session
          },
          redirect: {
              destination: '/',
              permanent: false
          }

      }
  }
  return {
      props: {
          session: null
      }
  }
}

export default Auth;
