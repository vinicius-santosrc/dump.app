import React, { useEffect, useState } from 'react';
import '../../../style/feed.css'
import 'firebase/auth'
import { auth, provider, signInWithPopup, app, db, database } from '../../../lib/firebase'
import { addDoc, collection, doc, getFirebase, setDoc } from 'firebase/firestore'
import { signOutUser } from "../../../lib/firebase"
import Suggestions_User from './Suggestions_User';
import { useCollection } from 'react-firebase-hooks/firestore';
import firebase from "firebase/compat/app"
import databases from '../../../lib/appwrite';
import { Query } from 'appwrite';

function gotoHome() {
    window.location.href = window.location.origin
}

function createnewpost() {
    document.querySelector('.createneewpost-card').style.display = 'block';
    document.querySelector('.background-posts').style.display = 'block';
}
const gotomyprofile = () => {

    const getprofile = async () => {

        await databases.listDocuments(
            "64f9329a26b6d59ade09",
            "64f93be88eee8bb83ec3"
        ).then((res) => {
            res.documents.filter(a => a.uid == auth.currentUser.uid).map((r) => {
                window.location.href = `${window.location.origin}/user/${r.$id}`
            })
        })
    }
    getprofile()

    /*database
    .collection('users')
    .where('uid' , '==', auth.currentUser.uid)
    .get()
    .then(s => {
        s.docs.map(yourprofile => {
            window.location.href=window.location.origin + '#/?user=' + yourprofile.data().username
        })
    })*/
}


function CurtidasList() {
    const CurrentUserId = auth.currentUser.uid

    const [notfy, setNot] = useState('')
    const [sender, setSENDER] = useState(null)

    async function getUserAtual2() {
        await databases.listDocuments(
            "64f9329a26b6d59ade09",
            "64fd4c66a7628f81bde8",
            [Query.orderDesc("$createdAt")]
        ).then((response) => {
            const DB_UID = '64f9329a26b6d59ade09'
            const USER_COL = '64f93be88eee8bb83ec3'

            response.documents.filter(e => e.TO_UID == CurrentUserId).map(async (notification) => {
                await databases.getDocument(
                    DB_UID,
                    USER_COL,
                    notification.SENDER_UID
                )
                    .then(sender => {
                        getNoty(sender)
                    })

            })
        })
    }


    const getNoty = async (sender) => {
        await databases.listDocuments(
            "64f9329a26b6d59ade09",
            "64fd4c66a7628f81bde8",
            [Query.orderDesc("$createdAt")]
        )
            .then(res => {
                if (res.documents.filter(e => e.TO_UID == CurrentUserId).length == 0) {
                    setNot(
                        <div className='curtidas-null-dump'>
                            <img src="../static/media/undraw_void_-3-ggu.svg" />
                            <h2>Nada por aqui.</h2>
                            <p>Aqui aparecerão suas notificações.</p>
                        </div>
                    )
                }
                else {
                    setNot(res.documents.filter(e => e.TO_UID == CurrentUserId).map((not) => {
                        const datanotcriada = new Date(not.$createdAt)

                        const datanotcriadacomparar = Date(not.$createdAt)
                        const datahoje = new Date()

                        const mesdoPost = datanotcriada.getMonth()
                        const diadoPost = datanotcriada.getDate()

                        const MesesDoAno = [
                            "Janeiro",
                            "Fevereiro",
                            "Março",
                            "Abril",
                            "Maio",
                            "Junho",
                            "Julho",
                            "Agosto",
                            "Setembro",
                            "Outubro",
                            "Novembro",
                            "Dezembro"
                        ]

                        return (

                            <div className='curtida-user-dump'>
                                <a href={window.location.origin + '/posts/' + not.PHOTO_REL}>
                                    <div className='curtida-index'>
                                        <i className="fa-solid fa-heart fa-beat-fade"></i>
                                    </div>
                                    <div className='leftsidecontent-alert'>
                                        <img src={sender.photoURL} />
                                        <div className='content-name-curtida'>
                                            <h2>{sender.username} {sender.isthisverifiqued == 'true' ? <><i alt="CONTA VERIFICADA" className="fa-solid fa-circle-check fa-fade verifyaccount" ></i></> : <></>}</h2>
                                            <label>{datahoje == datanotcriadacomparar ?
                                                'Hoje' :
                                                `${diadoPost} de ${MesesDoAno[mesdoPost]} `
                                            }</label>
                                        </div>

                                    </div>
                                    <div className='contentalert'>
                                        <p>{not.ACTION == 'like' ? 'curtiu sua publicação' :
                                            <>
                                                {not.ACTION == 'follow' ?
                                                    'começou a seguir você'
                                                    :
                                                    ''
                                                }
                                            </>
                                        }</p>
                                    </div>
                                </a>
                            </div>
                        )




                    }))
                }

            })
    }

    useEffect(() => {
        getUserAtual2()
    }, [])


    return notfy
}

function gotoHomePage() {
    {
        window.location.pathname == '/' ?
            window.scrollTo({
                top: 0,
                behavior: "smooth" // Comportamento de rolagem suave
            })
            :
            window.location.href = window.location.origin
    }


}

function openCurtidas() {
    document.querySelector(".curtidaspage-dump").classList.toggle('showcurtidas')
}

function fecharCurtidas() {
    document.querySelector(".curtidaspage-dump").classList.toggle('showcurtidas')



}

export default function HeaderFeed() {
    const [i_ison, setUserOn] = useState('')
    const SignWithGoogle = () => {
        signInWithPopup(auth, provider).then((i) => {
        })
    }

    useEffect(() => {
        auth.onAuthStateChanged(function (u) {
            setUserOn(u)
        })
    }, [])

    const [db_userison, Set_USER_IS_ON_VERIF] = useState('')

    function gotoLoginPage() {
        window.location.href = window.location.origin + '/accounts/signup'
    }

    let ID_ACCOUNT = ''
    if (auth.currentUser) {
        ID_ACCOUNT = auth.currentUser.uid
    }

    const [ID_ACCOUNT_I, SetAccount] = useState(null)

    const getUserAtual = async () => {
        await databases.getDocument(
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

    }

    useEffect(() => {
        getUserAtual()
    })

    function gotoSearch() {
        window.location.href = window.location.origin + '/search'
    }

    function gotoSaves() {
        window.location.href = window.location.origin + '/saves'
    }

    function gotomyprofilenav() {
        window.location.href = window.location.origin + '/user/' + ID_ACCOUNT_I.uid
    }

    function accountoptions() {
        document.querySelector(".account-div-options").style.display = 'block'
        document.querySelector(".background-button").style.display = 'block'
    }

    function closeaccountoptions() {
        document.querySelector(".account-div-options").style.display = 'none'
        document.querySelector(".background-button").style.display = 'none'
    }



    return (

        <>
            <div onClick={closeaccountoptions} className='background-button'></div>
            <header className="App-Header-Feed FeedHeader">
                <div className="App-Header-Feed-LeftSide leftsideheader">
                    <img onClick={gotoHome} src={window.location.origin + "/static/media/dumplogo.f3r818ht813gh78t13t.webp"} alt="Logo Dump" />
                    <div>
                        <div className="LeftSidePageHeader leftsidepagefeed">
                            <div className="LeftsideRedirect" onClick={gotoHomePage}>
                                <a className="Redirect"><i className="fa-solid fa-house"></i> Página Inicial</a>
                            </div>
                            <div className="LeftsideRedirect" onClick={gotoSearch}>
                                <a className="Redirect"><i className="fa-solid fa-magnifying-glass"></i> Pesquisar</a>
                            </div>
                            <div className="LeftsideRedirect" onClick={openCurtidas}>
                                {i_ison && ID_ACCOUNT_I ? <a className="Redirect"><i className="fa-solid fa-bell"></i> Notificações</a> : ''}
                            </div>
                            <div className="LeftsideRedirect" onClick={''}>
                                {i_ison && ID_ACCOUNT_I ? <a className="Redirect"><i className="fa-regular fa-comment-dots"></i> Mensagens</a> : ''}
                            </div>
                            <div className="LeftsideRedirect" onClick={gotoSaves}>
                                {i_ison && ID_ACCOUNT_I ? <a className="Redirect"><i className="fa-solid fa-bookmark"></i> Salvos</a> : <></>}
                            </div>
                            <div className="LeftsideRedirect" onClick={createnewpost}>
                                {i_ison && ID_ACCOUNT_I ? <a className="Redirect"><i className="fa-solid fa-square-plus"></i> Criar publicação</a> : <></>}
                            </div>

                            <div className="account-div">
                                {i_ison && ID_ACCOUNT_I && auth.currentUser && auth.currentUser.uid?
                                    <div className='account-div-options'>
                                        <div className='button-action-account'>
                                            <button onClick={gotomyprofilenav}>Ver sua conta</button>
                                        </div>
                                        <div className='button-action-account'>
                                            <button onClick={signOutUser}>Sair da sua conta</button>
                                        </div>

                                    </div>
                                    :
                                    <></>
                                }
                                {i_ison && ID_ACCOUNT_I && auth.currentUser && auth.currentUser.uid ?
                                    <a href={window.location.origin + '/user/' + ID_ACCOUNT_I.uid}><div className="account-div-flexbox">
                                        {ID_ACCOUNT_I.photoURL ? <img src={ID_ACCOUNT_I.photoURL} /> : <img></img>}
                                        <div>
                                            {ID_ACCOUNT_I.displayName ? <h3 className="currentuser-displayname">{ID_ACCOUNT_I.displayName}</h3> : <h3>$Name</h3>}
                                            {ID_ACCOUNT_I.username ? <p className="currentuser-id">@{ID_ACCOUNT_I.username}</p> : <p>@$username</p>}
                                        </div>
                                    </div></a>
                                    :
                                    <div className="account-off-div-flexbox" >
                                        <i className="fa-solid fa-right-to-bracket"></i>
                                        <div onClick={gotoLoginPage}>
                                            <h3 className="currentuser-displayname">
                                                Faça seu login
                                            </h3>
                                            <p className="currentuser-id">
                                                Entre agora para o dump
                                            </p>
                                        </div>
                                    </div>
                                }
                            </div>

                        </div>
                    </div>
                </div>
                <div className="App-Header-Feed-RightSide rightsideheader">
                    <a onClick={openCurtidas}>
                        <i className="fa-regular fa-heart"></i>
                    </a>
                    <a href="">
                        <i className="fa-regular fa-comment-dots"></i>
                    </a>
                </div>
            </header>
            <nav className='nav-bar-mobile'>
                <a onClick={gotoHomePage}><i className="fa-solid fa-house"></i></a>
                <a href={window.location.origin + '/search'}><i className="fa-solid fa-magnifying-glass"></i></a>
                {i_ison && ID_ACCOUNT_I ? <a onClick={createnewpost}><i className="fa-solid fa-square-plus"></i></a> : <></>}
                {i_ison && ID_ACCOUNT_I ? <a href={window.location.origin + '/saves'}><i className="fa-solid fa-bookmark"></i></a> : ''}
                {i_ison && ID_ACCOUNT_I && ID_ACCOUNT_I.photoURL ? <a href={window.location.origin + '/user/' + ID_ACCOUNT_I.uid}><img src={ID_ACCOUNT_I.photoURL} /></a> : <><a href="./accounts/signup"><i className="fa-solid fa-circle-user"></i></a></>}
            </nav>
            <div className='curtidaspage-dump'>
                <div className='curtidasheader'>

                    <button onClick={fecharCurtidas}>
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <h2>Notificações</h2>

                    {i_ison && ID_ACCOUNT_I && ID_ACCOUNT_I.photoURL ? <img src={ID_ACCOUNT_I.photoURL} /> : <></>}



                </div>
                {i_ison ? <CurtidasList /> : <></>}
            </div>
        </>
    )
}