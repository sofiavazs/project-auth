import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { user } from "../reducers/user";

const SIGNUP_URL = "https://authentication-sandra-sofia.herokuapp.com/users";
const LOGIN_URL = "https://authentication-sandra-sofia.herokuapp.com/sessions";

export const SignIn = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector((store) => store.user.login.accessToken);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  // FUNCTION TO HANDLE THE LOGIN
  const handleLoginSuccess = (loginResponse) => {
    dispatch(
      user.actions.setAccessToken({ accessToken: loginResponse.accessToken })
    );
    dispatch(user.actions.setUserId({ userId: loginResponse.userId }));
    dispatch(user.actions.setStatusMessage({ statusMessage: "Login Success" }));
  };

  // FUNCTION TO HANDLE THE LOGIN WHEN IT FAILED
  const handleLoginFailed = (loginError) => {
    dispatch(user.actions.setAccessToken({ accessToken: null }));
    dispatch(user.actions.setStatusMessage({ statusMessage: loginError }));
  };

  // REGISTRATION FUNCTION
  const handleSignup = (event) => {
    event.preventDefault();

    fetch(SIGNUP_URL, {
      method: "POST",
      body: JSON.stringify({ name, password }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Signup Failed");
        }
        return response.json();
      })
      .then((json) => handleLoginSuccess(json))
      .catch((err) => handleLoginFailed(err));
  };

  // LOGIN FUNCTION
  const handleLogin = (event) => {
    event.preventDefault();

    fetch(LOGIN_URL, {
      method: "POST",
      body: JSON.stringify({ name, password }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Login Failed");
        }
        return response.json();
      })
      .then((json) => handleLoginSuccess(json))
      .catch((err) => handleLoginFailed(err));
  };

  const handleLogout = (loggingout) => { 
    dispatch(user.actions.logout({ logout: loggingout }));
    window.location.reload();
  };

  if(accessToken) {
    return <>
    <h2>{`Hello ${name} you are logged in! shhh this is a secret area just for you`}</h2>
    <button className="logout-button" type="submit" onClick={handleLogout}>
      Logout
    </button>
    </>
  };

  return (
    <section className="login-form">
      <form className="form">
        <h1>Sign Up/Login</h1>
        <label>
          Name
          <input
            required
            minLength="3"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button className="signup-button" type="submit" onClick={handleSignup}>
          Sign Up
        </button>
        <button className="login-button" type="submit" onClick={handleLogin}>
          Login
        </button>
      </form>
    </section>
  );
};
