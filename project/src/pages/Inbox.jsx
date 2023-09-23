import { useEffect } from "react";
import { HideLoading } from "../components/Loading";
import HeaderFeed from "../components/pages/feed/HeaderApp";
import Suggestions from "../components/pages/feed/Suggestions";

export default function Inbox() {
    useEffect(() => {
        HideLoading()
    })
    return(
        <>
            <HeaderFeed />
            <div className="inbox-dump-page">
                <div className="inbox-content-contacts">
                    <h1>Seja bem vindo ao Inbox</h1>
                    <p>Escreva, converse com seus amigos e muito mais.</p>
                    <button>Escrever uma mensagem</button>
                </div>
                <div className="inbox-content-chat">
                    
                </div>
            </div>
        </>
    )
}