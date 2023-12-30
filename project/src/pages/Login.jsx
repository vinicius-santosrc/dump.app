import React, { useEffect } from "react";

//COMPONENTS
import Header from '../components/Header'
import ComponentLogin from "../components/pages/authpage/Login";
import { Loading, HideLoading } from "../components/Loading";
import { auth } from "../lib/firebase";


function Login() {
    useEffect(() => {
        
    })
    return(
        <>
        <Header />
        <ComponentLogin />
        </>
    )
}

export default Login