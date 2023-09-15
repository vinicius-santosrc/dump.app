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
    const getNoty = async () => {
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
                            <p>Aqui aparecerão suas curtidas.</p>
                        </div>
                    )
                }
                else {
                    setNot(res.documents.filter(e => e.TO_UID == CurrentUserId).map((not) => {

                        return (
                            <div className='curtida-user-dump'>
                                <div className='curtida-index'>
                                    <i className="fa-solid fa-heart fa-beat-fade"></i>
                                </div>
                                <div className='leftsidecontent-alert'>
                                    <img src={not.SENDER_PIC} />
                                    <div className='content-name-curtida'>
                                        <h2>{not.SENDER_NAME}</h2>
                                    </div>
                                </div>
                                <div className='contentalert'>
                                    <p>{not.ACTION == 'like' ? 'curtiu sua publicação' : ''}</p>
                                </div>

                            </div>
                        )

                    }))
                }

            })
    }

    useEffect(() => {
        getNoty()
    }, [])


    return notfy
}

function gotoHomePage() {

    window.scrollTo({
        top: 0,
        behavior: "smooth" // Comportamento de rolagem suave
    });

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


    return (

        <>
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
                            <div className="LeftsideRedirect" onClick={createnewpost}>
                                {i_ison ? <a className="Redirect"><i className="fa-solid fa-square-plus"></i> Criar publicação</a> : <></>}
                            </div>
                            <div className="account-div">
                                {i_ison ?
                                    <a href={window.location.origin + '/user/' + ID_ACCOUNT_I.uid} ><div className="account-div-flexbox" onClick={gotomyprofile}>
                                        <img src={ID_ACCOUNT_I.photoURL} />
                                        <div>
                                            <h3 className="currentuser-displayname">{ID_ACCOUNT_I.displayName}</h3>
                                            <p className="currentuser-id">@{ID_ACCOUNT_I.username}</p>
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
                {i_ison ? <a onClick={createnewpost}><i className="fa-solid fa-square-plus"></i></a> : <></>}
                {i_ison ? <a href={window.location.origin + '/user/' + ID_ACCOUNT_I.uid}><img src={ID_ACCOUNT_I.photoURL} /></a> : <><a href="./accounts/signup"><i className="fa-solid fa-circle-user"></i></a></>}
            </nav>
            <div className='curtidaspage-dump'>
                <div className='curtidasheader'>

                    <button onClick={fecharCurtidas}>
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <h2>Notificações</h2>

                    {i_ison ? <img src={ID_ACCOUNT_I.photoURL} /> : <></>}



                </div>
                {i_ison ? <CurtidasList /> : <></>}
            </div>
        </>
    )
}