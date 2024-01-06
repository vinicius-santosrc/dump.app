import React, { useEffect, useState } from 'react';
import '../../../style/feed.css'
import 'firebase/auth'
import { auth, provider, signInWithPopup, app, db, database } from '../../../lib/firebase'
import { addDoc, collection, doc, getFirebase, setDoc } from 'firebase/firestore'
import { signOutUser } from "../../../lib/firebase"
import Suggestions_User from './Suggestions_User';
import { useCollection } from 'react-firebase-hooks/firestore';
import firebase from "firebase/compat/app"
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { Link, useLocation } from 'react-router-dom';
import UserGet from '../../../lib/user';
import CreatePost from './CreatePost';

function gotoHome() {
    window.location.href = window.location.origin
}

export default function HeaderFeed(props) {

    const [openSettingsAccount, setopenSettingsAccount] = useState(false)

    const [AccountOptions, setAccountsOptions] = useState(false)
    const [notificationsNotSeen, setNotificationsNotSeen] = useState(false)

    const [i_ison, setUserOn] = useState('');


    useEffect(() => {
        auth.onAuthStateChanged(function (u) {
            setUserOn(u)
        })
    }, [])


    let ID_ACCOUNT = ''
    if (auth.currentUser) {
        ID_ACCOUNT = auth.currentUser.uid
    }

    const ID_ACCOUNT_I = UserGet()


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

    async function notificationUpShow() {
        if (!ID_ACCOUNT_I) {
            return
        }
        const res = await databases.listDocuments("64f9329a26b6d59ade09", "64fd4c66a7628f81bde8", [Query.limit(100), Query.equal("TO_UID", ID_ACCOUNT_I.$id), Query.orderDesc("$createdAt")]);

        if (res.documents.length > 0) {
            setNotificationsNotSeen(true)
        }
    }



    useEffect(() => {
        notificationUpShow()
    })

    if (window.location.href.includes("/accounts/login") || window.location.href.includes("/accounts/signup")) {
        return
    }

    return (

        <>
            <div onClick={closeaccountoptions} className='background-button'></div>
            <header aria-live="polite" role='navigation' className="App-Header-Feed FeedHeader">
                <div className="App-Header-Feed-LeftSide leftsideheader">
                    <Link to={window.location.origin}> <img src={window.location.origin + "/static/media/dumplogo.f3r818ht813gh78t13t.svg"} alt="Logo Dump" /></Link>
                    <div>
                        <div className="LeftSidePageHeader leftsidepagefeed">
                            <div className="LeftsideRedirect">
                                <Link className="Redirect" to={window.location.origin} title='Página Inicial' id={window.location.pathname === '/' ? 'selected' : ''}><i className="fa-solid fa-house"></i><span>Página Inicial</span></Link>
                            </div>
                            <div className="LeftsideRedirect" >
                                <Link to={window.location.origin + '/search'} className="Redirect" title='Explorar' id={window.location.pathname === '/search' ? 'selected' : ''}><i className="fa-solid fa-magnifying-glass"></i><span>Explorar</span></Link>
                            </div>
                            <div className="LeftsideRedirect" >
                                <Link to={window.location.origin + '/dreams'} className="Redirect" title='Explorar' id={window.location.href.includes('/dreams') ? 'selected' : ''}><i className="fa-solid fa-tv"></i><span>Dreams</span></Link>
                            </div>
                            <div className="LeftsideRedirect">
                                {ID_ACCOUNT_I ? <Link to={window.location.origin + "/notifications"} className="Redirect" title='Notificações'><i className="fa-solid fa-bell"></i><span>Notificações</span></Link> : ''}
                            </div>

                            <div className="LeftsideRedirect">
                                {ID_ACCOUNT_I ? <Link to={window.location.origin + '/saves'} className="Redirect" title='Salvos'><i className="fa-solid fa-bookmark"></i><span>Dumps Salvos</span></Link> : <></>}
                            </div>
                            <div className="LeftsideRedirect">
                                {ID_ACCOUNT_I ? <Link className="Redirect" title='Perfil' to={window.location.origin + '/user/' + ID_ACCOUNT_I.uid}><i className="fa-regular fa-user"></i><span>Perfil</span></Link> : <></>}
                            </div>
                            <div className="LeftsideRedirect">
                                {ID_ACCOUNT_I ? <Link to={window.location.origin + "/posts/create"} className="PublicarButton" title='Criar publicação'><span>Publicar</span></Link> : <></>}
                            </div>
                            <div className="LeftsideRedirect" >
                                {ID_ACCOUNT_I ? <Link to={window.location.origin + "/posts/create"} className="PublicarButtoniPad" title='Criar publicação'><span><i className="fa-solid fa-feather"></i></span></Link> : <></>}
                            </div>

                            <div className="account-div">
                                {ID_ACCOUNT_I ?
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
                                {ID_ACCOUNT_I ?
                                    <>


                                        {AccountOptions ?
                                            <div className='Account-Options-Box' onClick={() => { setAccountsOptions(false) }}>
                                                <div className='Account-Option'>
                                                    <Link to={window.location.origin + '/user/' + ID_ACCOUNT_I.uid}>
                                                        <p>Visualizar meu perfil</p>
                                                    </Link>
                                                </div>
                                                <div className='Account-Option'>
                                                    <Link onClick={signOutUser}>
                                                        <p id='endsession'>Finalizar sessão</p>
                                                    </Link>
                                                </div>
                                            </div>
                                            : null}

                                        <Link title='Sua conta' onClick={() => { AccountOptions ? setAccountsOptions(false) : setAccountsOptions(true) }} ><div className="account-div-flexbox">
                                            {ID_ACCOUNT_I.photoURL ? <img src={ID_ACCOUNT_I.photoURL} /> : <img></img>}
                                            <div className='leftside-account-dump-index'>
                                                {ID_ACCOUNT_I.displayName ?
                                                    <div className='top-show-account'>
                                                        <h3 className="currentuser-displayname">{ID_ACCOUNT_I.displayName}</h3>
                                                        {ID_ACCOUNT_I.isthisverifiqued == 'true' ? <><i alt="CONTA VERIFICADA" title='Verificado' className="fa-solid fa-circle-check fa-fade verifyaccount" ></i></>
                                                            :
                                                            <></>
                                                        }
                                                    </div>
                                                    :
                                                    <h3></h3>
                                                }
                                                {ID_ACCOUNT_I.username ? <p className="currentuser-id">@{ID_ACCOUNT_I.username}</p> : <p></p>}
                                            </div>
                                        </div></Link>
                                    </>
                                    :
                                    <a href={window.location.origin + "/accounts/signup"}>
                                        <div className="account-off-div-flexbox" title='Fazer login'>
                                            <i className="fa-solid fa-right-to-bracket"></i>
                                            <div className='right-side-enter-account'>
                                                <h3 className="currentuser-displayname">
                                                    Faça seu login
                                                </h3>
                                                <p className="currentuser-id">
                                                    Entre agora para o dump
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                }

                            </div>

                        </div>
                    </div>
                </div>


                <div className="App-Header-Feed-RightSide rightsideheader">
                    <Link to={window.location.origin + "/notifications"}>
                        <i className="fa-regular fa-heart"></i>
                        {notificationsNotSeen ? <label className='notification-show'></label> : null}

                    </Link>

                </div>
            </header>


            <header aria-live="polite" role='navigation' className='dump-mobile-header'>

                <div className='top-header-mobile'>
                    <img onClick={gotoHome} src={window.location.origin + "/static/media/dumplogo.f3r818ht813gh78t13t.svg"} alt="Logo Dump" />
                    <div className="top-header-mobile-icons-rightside rightsideheadermobile">
                        {ID_ACCOUNT_I ?
                            <Link id={window.location.pathname.includes('/posts/create') ? 'selected' : ''} to={window.location.origin + "/posts/create"}><i className="fa-solid fa-square-plus"></i></Link>
                            :
                            null
                        }
                        {ID_ACCOUNT_I ?
                            <Link to={window.location.origin + "/notifications"}>
                                <i className="fa-regular fa-heart"></i>
                                {notificationsNotSeen ? <label className='notification-show'></label> : null}
                            </Link>
                            :
                            null
                        }


                        {/*i_ison && ID_ACCOUNT_I && ID_ACCOUNT_I.photoURL ? <img alt='Foto de perfil' src={ID_ACCOUNT_I.photoURL} /> : <></>*/}
                        {ID_ACCOUNT_I ? <img onClick={() => { setopenSettingsAccount(openSettingsAccount == false) }} src={ID_ACCOUNT_I.photoURL} /> : <></>}
                    </div>
                </div>
                {openSettingsAccount ?
                    <div className='Account-Options-Box' onClick={() => { setopenSettingsAccount(openSettingsAccount == false) }}>
                        <div className='Account-Option'>
                            <Link to={window.location.origin + '/user/' + ID_ACCOUNT_I.uid}>
                                <p>Visualizar meu perfil</p>
                            </Link>
                        </div>
                        <div className='Account-Option'>
                            <Link onClick={signOutUser}>
                                <p id='endsession'>Finalizar sessão</p>
                            </Link>
                        </div>
                    </div>
                    :
                    null
                }


            </header >
            <nav aria-live="polite" role='navigation' className='nav-bar-mobile'>
                <div>
                    <Link to={window.location.origin} id={window.location.pathname == '/' || window.location.pathname == '/following' ? 'selected' : ''}><i className="fa-solid fa-house"></i></Link>
                </div>

                <Link to={window.location.origin + '/search'} id={window.location.pathname == '/search' ? 'selected' : ''}><i className="fa-solid fa-magnifying-glass"></i></Link>
                <Link to={window.location.origin + "/dreams"}><i className="fa-solid fa-tv"></i></Link>
                {ID_ACCOUNT_I ? <Link id={window.location.pathname.includes('/saves') ? 'selected' : ''} to={window.location.origin + '/saves'}><i className="fa-solid fa-bookmark"></i></Link> : ''}
                {ID_ACCOUNT_I ?
                    <Link id={window.location.pathname.includes('/user') ? 'selected' : ''} to={window.location.origin + '/user/' + ID_ACCOUNT_I.uid}>
                        <img src={ID_ACCOUNT_I.photoURL} />
                    </Link>
                    :

                    <a id={window.location.pathname.includes('/user') ? 'selected' : ''} href={window.location.origin + "/accounts/signup"}>
                        <i className="fa-solid fa-right-to-bracket"></i>
                    </a>

                }
            </nav>





        </>
    )
}