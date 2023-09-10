import React, { useEffect } from "react";

//COMPONENTS
import Header from '../components/Header'
import ComponentLogin from "../components/pages/authpage/Login";
import { Loading, HideLoading } from "../components/Loading";
import { auth } from "../lib/firebase";


function Login() {
    useEffect(() => {
        if (auth.currentUser == null) {
          HideLoading()
        }
      })
    return(
        <>
        <Header />
        <ComponentLogin />
        </>
    )
}

export default Login