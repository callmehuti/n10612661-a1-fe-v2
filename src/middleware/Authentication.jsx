// node packages
import { Navigate } from "react-router-dom";

// constant
import { token } from "../constant/token";

// components
import Layout from "../components/Layout/Layout";

export default function Authentication() {
  const authorized = localStorage.getItem(token.ACCESS_TOKEN);
  return authorized ? (
    <Layout />
  ) : (
    <Navigate to={"/login"} />
  );
}
