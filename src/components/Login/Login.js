import React, { useEffect, useReducer, useState, useContext, useRef } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Input/Input';

const Login = () => {
  const authCtx = useContext(AuthContext);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(
    (state, action) => {
      if (action.type === 'USER_INPUT') {
        return {
          value: action.emailVal,
          isValid: action.emailVal.includes('@'),
        };
      }
      if (action.type === 'INPUT_BLUR') {
        return { value: state.value, isValid: state.value.includes('@') };
      }
      return { value: '', isValid: false };
    },
    {
      value: '',
      isValid: undefined,
    }
  );

  const [passwordState, dispatchPassword] = useReducer(
    (state, action) => {
      if (action.type === 'USER_INPUT') {
        return {
          value: action.passwordVal,
          isValid: action.passwordVal.trim().length > 6,
        };
      }
      if (action.type === 'INPUT_BLUR') {
        return { value: state.value, isValid: state.value.trim().length > 6 };
      }
      return { value: '', isValid: false };
    },
    {
      value: '',
      isValid: undefined,
    }
  );

  useEffect(() => {
    console.log('effect running');

    return () => {
      console.log('EFFECT CLEANUP');
    };
  }, []);

  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);

    return () => {
      console.log('cleanup');
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({
      type: 'USER_INPUT',
      emailVal: event.target.value,
    });

    setFormIsValid(event.target.value.includes('@') && passwordState.isValid);
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({
      type: 'USER_INPUT',
      passwordVal: event.target.value,
    });

    // setFormIsValid(
    //   emailState.value.includes('@') && event.target.value.trim().length > 6
    // );
  };

  const validateEmailHandler = () => {
    dispatchEmail({
      type: 'INPUT_BLUR',
    });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({
      type: 'INPUT_BLUR',
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if(formIsValid){
      authCtx.onLogin(emailState.value, passwordState.value);
    }
    else if(!emailIsValid){
      emailInputRef.current.focus();
    }
    else{
      passwordInputRef.current.focus();

    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailInputRef}
          id='email'
          label='E-Mail'
          type='email'
          isValid={emailIsValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
        ref={passwordInputRef}
          id='password'
          label='Password'
          type='password'
          isValid={passwordIsValid}
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type='submit' className={classes.btn} >
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
