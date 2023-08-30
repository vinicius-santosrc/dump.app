import React from "react";

//COMPONENTS
import Header from '../components/Header'
import AuthPageComponentRegistro from "../components/pages/authpage/Registro";
import { Loading, HideLoading } from "../components/Loading";

function Cadastrar() {

    return(
        <>
        <Header />
        <AuthPageComponentRegistro />
        </>
    )
}

export default Cadastrar