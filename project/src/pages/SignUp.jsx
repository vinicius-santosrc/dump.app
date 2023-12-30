import React, { useEffect } from "react";

//COMPONENTS
import Header from '../components/Header'
import AuthPageComponentRegistro from "../components/pages/authpage/Registro";
import { auth } from "../lib/firebase";



function Cadastrar() {
    useEffect(() => {
        
    })
    return(
        <>
        <Header />
        <AuthPageComponentRegistro />
        </>
    )
}

export default Cadastrar