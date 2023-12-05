import { useEffect } from "react";
import { HideLoading } from "../components/Loading";


export default function CreatePost() {

    useEffect(() => {
        HideLoading()
        window.document.title = 'Criação Dump'
    })

    return (
        <section className="Dump-CreateNewDump-Content">
            <CreatePost />
        </section>
    )
}