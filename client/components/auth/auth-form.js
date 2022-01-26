import { TextField, Button, CircularProgress } from '@mui/material';
import { useState, useReducer } from "react";

import Layout from '../layout/layout';
import classes from "./auth-form.module.css";

const initialState = {
  email: '',
  password: ''
}

const reducer = (state, action) => {
  switch(action.type) {
    case 'INPUT_EMAIL':
      return {...state, email: action.value}
    case 'INPUT_PASSWORD':
      return {...state, password: action.value}
    default:
      return state;
  }
}

function AuthForm({onLogin, onSignUp, isLoading}) {
  const [isLogin, setIsLogin] = useState(true);
  const [inputState, dispatch] = useReducer(reducer, initialState);

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  const submitHandler = (e) => {
    e.preventDefault();
    const { email, password } = inputState;
    let url = 'http://192.168.49.2:31072/api/auth';
    if(isLogin) {
      onLogin(email, password, `${url}/login`);
    } else {
      onSignUp(email, password, `${url}/sign-up`);
    }
  }

  return (
    <Layout>
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
         <div className={classes.control}>
            <TextField label='Email' 
            type='email' 
            fullWidth 
            variant='standard' 
            value={inputState.email} 
            onChange={e=>dispatch({type: 'INPUT_EMAIL', value: e.target.value})}/>
         </div>
         <div className={classes.control}>
            <TextField label='Password' 
            type='password' 
            fullWidth 
            variant='standard' 
            value={inputState.password} 
            onChange={e=>dispatch({type: 'INPUT_PASSWORD', value: e.target.value})}/>
         </div>
        <div className={classes.actions}>
          {isLoading? <CircularProgress /> : <Button type='submit'>{isLogin ? "Login" : "Create Account"}</Button>}
          <Button type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}>
             {isLogin ? "Create new account" : "Login with existing account"}
          </Button>
        </div>
      </form>
    </section>
    </Layout>
  );
}

export default AuthForm;