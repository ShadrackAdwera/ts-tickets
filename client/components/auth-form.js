import { TextField, Button } from '@mui/material';
import { useState } from "react";
import classes from "./auth-form.module.css";

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  const submitHandler = () => {}

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
         <div className={classes.control}>
            <TextField label='Email' type='email' fullWidth variant='standard'/>
         </div>
         <div className={classes.control}>
            <TextField label='Password' type='password' fullWidth variant='standard'/>
         </div>
        <div className={classes.actions}>
          <Button>{isLogin ? "Login" : "Create Account"}</Button>
          <Button type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}>
             {isLogin ? "Create new account" : "Login with existing account"}
          </Button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;