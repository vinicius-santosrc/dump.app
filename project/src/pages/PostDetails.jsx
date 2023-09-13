import { useEffect, useState } from "react";

import { HideLoading } from "../components/Loading";
import databases from "../lib/appwrite";
import { useParams } from "react-router-dom";


export default function PostDetails() {
    const { idPost } = useParams();
    const [publicacao, setPublicacao] = useState(null);
    const [userPub, setUserPub] = useState(null)

    useEffect(() => {
        HideLoading()
        databases.getDocument(
            "64f9329a26b6d59ade09",
            '64f93c1c40d294e4f379',
            idPost
        )
            .then((response) => {
                setPublicacao(response)
            })
            .catch((e) => {
                console.log(e)
            })
    }, [idPost])



    const usergoto = async () => {
        await databases.listDocuments(
            '64f9329a26b6d59ade09',
            '64f93be88eee8bb83ec3',
        ).then((response) => {
            response.documents.filter(r => r.email == publicacao.email).map((e) => {
                setUserPub(e.$id)
            })
        }).catch((e) => {
            console.log(e)
        })
    }
    usergoto()

    function gotoUserPage() {

        window.location.href = `${window.location.origin}/user/${userPub}`


    }

    if (!publicacao) {
        return (
            <>

                <div>Carregando...</div>
            </>
        );
    }

    var datepost = new Date(publicacao.$createdAt)
    var datefilepost = `${datepost.toLocaleDateString()} as ${datepost.getHours()}:${datepost.getMinutes()}:${datepost.getSeconds()}`

    function open_options_post() {
        document.querySelector(".dump-post-options-background").style.display = 'block'
        document.querySelector(".dump-post-options").style.display = 'block'

        document.querySelector(".dump-post-show-mobile .dump-post-options-background").style.display = 'block'
        document.querySelector(".dump-post-show-mobile .dump-post-options").style.display = 'block'
    }

    function close_options_post() {
        document.querySelector(".dump-post-options ").style.display = 'none'
        document.querySelector(".dump-post-show-mobile .dump-post-options ").style.display = 'none'
    }

    function copiarlink() {
        navigator.clipboard.writeText(window.location.href);
        document.querySelector("#copylink").innerHTML = `Copiado!`
        document.querySelector(".dump-post-show-mobile #copylink").innerHTML = `Copiado!`
        setTimeout(() => {
            document.querySelector("#copylink").innerHTML = `Copiar link`
            document.querySelector(".dump-post-show-mobile #copylink").innerHTML = `Copiar link`
        }, 2000);
    }
    function compartilhar() {
        close_options_post()
        document.querySelector(".dump-post-options-compartilhar").style.display = 'block'
        document.querySelector(".compartilhar-options").style.display = 'block'

        document.querySelector(".dump-post-show-mobile .dump-post-options-compartilhar").style.display = 'block'
        document.querySelector(".dump-post-show-mobile .compartilhar-options").style.display = 'block'
    }


    function fecharcompartilhar() {
        document.querySelector(".dump-post-options-compartilhar").style.display = 'none'
        document.querySelector(".compartilhar-options").style.display = 'none'

        document.querySelector(".dump-post-show-mobile .dump-post-options-compartilhar").style.display = 'none'
        document.querySelector(".dump-post-show-mobile .compartilhar-options").style.display = 'none'
    }

    function compartilhar_whatsapp() {
        close_options_post()
        window.open(`https://api.whatsapp.com/send?phone=&text=${window.location.href}`)
    }

    function fecharbackground() {
        document.querySelector(".dump-post-options-background").style.display = 'none'
        document.querySelector(".dump-post-show-mobile .dump-post-options-background").style.display = 'none'
    }

    function closepopups() {
        fecharbackground()
        close_options_post()
        fecharcompartilhar()
    }

    function changeInfoPage() {
        document.querySelector("title").innerText = `${publicacao.displayName} | Dump`
    }
    changeInfoPage()
    return (
        <>
            <div className="dump-post-show-pc">
                <div className="dump-post-options-background"></div>
                <div className="dump-post-show">
                    <div className="dump-post-show">
                        <div className="dump-post-header-show">
                            <a href='javascript:history.back()'><i className="fa-solid fa-chevron-left"></i></a>
                            <img src='../static/media/dumplogo.f3r818ht813gh78t13t.webp' />
                            <label onClick={open_options_post}><i className="fa-solid fa-ellipsis"></i></label>
                        </div>
                        <div className="dump-post-options">
                            <div className="select-post-options">
                                <a onClick={compartilhar}>Compartilhar</a>
                            </div>
                            <div className="select-post-options">
                                <a id="copylink" onClick={copiarlink}>Copiar link</a>
                            </div>
                            <div className="select-post-options">
                                <a onClick={closepopups} id="cancel">Fechar</a>
                            </div>
                        </div>
                        <div className="compartilhar-options">
                            <div className="dump-post-options-compartilhar">
                                <h4>Compartilhar:</h4>
                                <div className="select-post-options">
                                    <button id="whatsapp-btn" onClick={compartilhar_whatsapp}><i className="fa-brands fa-whatsapp"></i> WhatsApp</button>
                                </div>
                                <div className="select-post-options">
                                    <a onClick={closepopups} id="cancel">Cancelar</a>
                                </div>
                            </div>
                        </div>
                        <div className="dump-post-img-inner">
                            <div className="dump-post-topimage">
                                <img src={publicacao.filePost} />
                            </div>
                            <div className="dump-post-middle-bottom-img">
                                <div className="flex-dump-info-image">
                                    <div className="info-user-dump-post">
                                        <h1 onClick={gotoUserPage}>{publicacao.displayName}</h1>
                                        <label className="time-display-dump">{datefilepost}</label>
                                    </div>
                                </div>
                                <div className="bottom-desc">
                                    <p>{publicacao.legenda}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="dump-post-show-mobile">
                <div onClick={closepopups} className="dump-post-options-background"></div>
                <div className="dump-post-show">
                    <div className="dump-post-header-show">
                        <a href='javascript:history.back()'><i className="fa-solid fa-chevron-left"></i></a>
                        <img src='../static/media/dumplogo.f3r818ht813gh78t13t.webp' />
                        <label onClick={open_options_post}><i className="fa-solid fa-ellipsis"></i></label>
                    </div>
                    <div className="dump-post-options">
                        <div className="select-post-options">
                            <a onClick={compartilhar}>Compartilhar</a>
                        </div>
                        <div className="select-post-options">
                            <a id="copylink" onClick={copiarlink}>Copiar link</a>
                        </div>
                        <div className="select-post-options">
                            <a onClick={closepopups} id="cancel">Fechar</a>
                        </div>
                    </div>
                    <div className="compartilhar-options">
                        <div className="dump-post-options-compartilhar">
                            <h4>Compartilhar:</h4>
                            <div className="select-post-options">
                                <button id="whatsapp-btn" onClick={compartilhar_whatsapp}><i className="fa-brands fa-whatsapp"></i> WhatsApp</button>
                            </div>
                            <div className="select-post-options">
                                <a onClick={closepopups} id="cancel">Cancelar</a>
                            </div>
                        </div>
                    </div>
                    <div className="dump-post-img-inner">
                        <div className="dump-post-topimage">
                            <img src={publicacao.filePost} />
                        </div>
                        <div className="dump-post-middle-bottom-img">
                            <div className="flex-dump-info-image">
                                <div className="info-user-dump-post">
                                    <h1>{publicacao.displayName}</h1>
                                    <label className="time-display-dump">{datefilepost}</label>
                                </div>
                            </div>
                            <div className="bottom-desc">
                                <p>{publicacao.legenda}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}