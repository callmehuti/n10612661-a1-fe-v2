// hooks
import { useState } from "react";
import { useRef } from "react";

// node packages
import { Link, Navigate, useNavigate } from "react-router-dom";

// constant
import { api } from "../constant/api";
import { token } from "../constant/token";

// style
import styles from "../assets/scss/form.module.scss";

// icons
import { PiUserDuotone } from "react-icons/pi";
import { MdOutlineLock } from "react-icons/md";

export default function Login() {
  const inputUsername = useRef();
  const inputPassword = useRef();
  const [errorLogin, setErrorLogin] = useState("");
  const navigate = useNavigate();


  const authorized = localStorage.getItem(token.ACCESS_TOKEN);
  console.log(authorized, "render");
  if (authorized) return <Navigate to="/" />

  const onSignIn = async () => {
    const username = inputUsername.current.value;
    const password = inputPassword.current.value;

    try {
      const res = await fetch(api.login(), {
        method: "POST",
        body: JSON.stringify({ username, password }),
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const parseRes = await res.json();
      if (!parseRes.accessToken) {
        setErrorLogin(parseRes.message);
        return;
      }
      localStorage.setItem(token.ACCESS_TOKEN, parseRes.accessToken);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.screen}>
      <div className={styles.formContainer}>
        <div>
          <PiUserDuotone />
          <input type="text" placeholder="Please enter your username" ref={inputUsername} />
        </div>
        <div>
          <MdOutlineLock />
          <input type="text" placeholder="Password" ref={inputPassword} />
        </div>
        <button type="button" onClick={onSignIn}>
          Sign in
        </button>
        {errorLogin ? <p>{errorLogin}</p> : null}
        <p>
          Do not have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
