// hooks
import { useRef, useState } from "react";

// node packages
import { Link, Navigate, useNavigate } from "react-router-dom";

// constant
import { api } from "../constant/api";

// style
import styles from "../assets/scss/form.module.scss";

// icons
import { PiUserDuotone } from "react-icons/pi";
import { PiPassword } from "react-icons/pi";
import { token } from "../constant/token";

export default function Register() {
  const inputUsername = useRef();
  const inputPassword = useRef();
  const inputConfirmPassword = useRef();
  const [errorRegister, setErrorRegister] = useState("");
  const navigate = useNavigate();

  const authorized = localStorage.getItem(token.ACCESS_TOKEN);
  console.log(authorized, "render");
  if (authorized) return <Navigate to="/" />;

  const onRegister = async () => {
    const username = inputUsername.current.value;
    const password = inputPassword.current.value;
    const confirmPassword = inputConfirmPassword.current.value;

    if (password !== confirmPassword) {
      setErrorRegister("Password is not match");
      return;
    }

    try {
      const response = await fetch(api.register(), {
        method: "POST",
        body: JSON.stringify({ username, password }),
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const parseResponse = await response.json();
      if (!response.ok) {
        setErrorRegister(parseResponse.message);
        return;
      }
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  console.log(errorRegister);

  return (
    <div className={styles.screen}>
      <div className={styles.formContainer}>
        <div>
          <PiUserDuotone />
          <input
            type="text"
            placeholder="Please enter your username"
            ref={inputUsername}
          />
        </div>
        <div>
          <PiPassword />
          <input type="text" placeholder="Password" ref={inputPassword} />
        </div>
        <div>
          <PiPassword />
          <input
            type="text"
            placeholder="Confirm password"
            ref={inputConfirmPassword}
          />
        </div>
        <button type="button" onClick={onRegister}>
          Create Account
        </button>
        {errorRegister ? <p>{errorRegister}</p> : null}
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
