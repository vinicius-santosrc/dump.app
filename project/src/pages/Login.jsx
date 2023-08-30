import React from "react";

//COMPONENTS
import Header from '../components/Header'
import ComponentLogin from "../components/pages/authpage/Login";
import { Loading, HideLoading } from "../components/Loading";

function Login() {

    return(
        <>
        <Header />
        <ComponentLogin />
        </>
    )
}

export default Login