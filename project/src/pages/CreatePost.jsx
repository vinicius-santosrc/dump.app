import { useEffect } from "react";



export default function CreatePost() {

    useEffect(() => {
        
        window.document.title = 'Criação Dump'
    })

    return (
        <section className="Dump-CreateNewDump-Content">
            <CreatePost />
        </section>
    )
}