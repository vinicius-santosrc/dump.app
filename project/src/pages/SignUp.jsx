import React, { useEffect } from "react";

//COMPONENTS
import Header from '../components/Header'
import AuthPageComponentRegistro from "../components/pages/authpage/Registro";
import { Loading, HideLoading } from "../components/Loading";
import { auth } from "../lib/firebase";


function Cadastrar() {
    useEffect(() => {
        
        if (auth.currentUser == null) {
          HideLoading()
        }
      })
    return(
        <>
        <Header />
        <AuthPageComponentRegistro />
        </>
    )
}

export default Cadastrar