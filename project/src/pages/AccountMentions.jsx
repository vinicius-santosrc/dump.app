import { useEffect, useState } from "react";
import Header from "../components/Header";
import { HideLoading } from "../components/Loading";
import { useParams } from "react-router-dom";
import databases from "../lib/appwrite";
import { Query } from "appwrite";

export default function AccountMentions() {
    const { ID_ACCOUNT } = useParams();

    const [ID_ACCOUNT_I, SetAccount] = useState(null)


    useEffect(() => {
        HideLoading()
        databases.getDocument(
            "64f9329a26b6d59ade09",
            "64f93be88eee8bb83ec3",
            ID_ACCOUNT
        )
            .then((response) => {
                SetAccount(response)
            })
            .catch((e) => {
                console.log(e)
            })


    }, [ID_ACCOUNT])
    const [nofposts, setNumberofPosts] = useState()

    function backtoprofile() {
        let url = (window.location.href).replace('/mentions', '')
        window.location.href = url
    }


    if (!ID_ACCOUNT_I) {
        return (
            <>

                <div>Carregando...</div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="dump-account-page">

                <div className="dump-account-background">

                </div>
                <div className="dump-account-infos">
                    <div className="top-account">
                        <div className="leftside-account">
                            <img src={ID_ACCOUNT_I.photoURL} />
                            <div className="account-details">
                                <h1>{ID_ACCOUNT_I.displayName} {ID_ACCOUNT_I.isthisverifiqued == 'true' ? <><i alt="CONTA VERIFICADA" className="fa-solid fa-circle-check fa-fade verifyaccount" ></i></> : <></>}</h1>
                                <p>@{ID_ACCOUNT_I.username}</p>
                            </div>
                        </div>
                        <div className="rightside-account">
                            <div className="btns-links">
                                <button>SEGUIR</button>
                                <button><i className="fa-solid fa-inbox"></i></button>
                            </div>
                            <div className="followers-card">
                                <p>{0} seguidores</p>
                                <p>{0} seguindo</p>
                                <p>{nofposts} dumps</p>
                            </div>
                        </div>
                    </div>
                    <div className="middle-account-top">
                        <p>Sem descrição</p>

                    </div>
                </div>
                <div className="dumps-of-user">
                    <div className="selecttypeofpublic">
                        <label onClick={backtoprofile}><i className="fa-regular fa-image"></i> Dumps</label>
                        <label id="selected"><i className="fa-solid fa-quote-left"></i> Menções</label>
                    </div>
                    <div className="dumps-account-user-show">
                        
                    </div>
                </div>
            </div>
        </>
    )
}