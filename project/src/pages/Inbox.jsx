import { useEffect } from "react";
import Header from "../components/Header";
import { HideLoading } from "../components/Loading";

export default function Inbox() {
    useEffect(() => {
        HideLoading()
    })
    return(
        <>
        <Header />
        <p>Inbox page</p>
        </>
    )
}