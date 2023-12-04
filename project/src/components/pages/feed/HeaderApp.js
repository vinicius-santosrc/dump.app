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
import { Link, useLocation } from 'react-router-dom';
import UserGet from '../../../lib/user';

function gotoHome() {
    window.location.href = window.location.origin
}

function createnewpost() {
    document.querySelector('.createneewpost-card').style.display = 'block';
    document.querySelector('.background-posts').style.display = 'block';
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




export default function HeaderFeed(props) {
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








    return (

        <>
            <div onClick={closeaccountoptions} className='background-button'></div>
            <header aria-live="polite" role='navigation' className="App-Header-Feed FeedHeader">
                <div className="App-Header-Feed-LeftSide leftsideheader">
                    <img onClick={gotoHome} src={window.location.origin + "/static/media/dumplogo.f3r818ht813gh78t13t.svg"} alt="Logo Dump" />
                    <div>
                        <div className="LeftSidePageHeader leftsidepagefeed">
                            <div className="LeftsideRedirect">
                                <Link className="Redirect" to={window.location.origin} title='Página Inicial' id={window.location.pathname == '/' ? 'selected' : ''}><i className="fa-solid fa-house"></i><span>Página Inicial</span></Link>
                            </div>
                            <div className="LeftsideRedirect" >
                                <Link to={window.location.origin + '/search'} className="Redirect" title='Pesquisar' id={window.location.pathname == '/search' ? 'selected' : ''}><i className="fa-solid fa-magnifying-glass"></i><span>Pesquisar</span></Link>
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
                            <div className="LeftsideRedirect" onClick={createnewpost}>
                                {ID_ACCOUNT_I && window.location.pathname == '/' || window.location.pathname == '/following' ? <Link className="PublicarButton" title='Criar publicação'><span>Publicar</span></Link> : <></>}
                            </div>
                            <div className="LeftsideRedirect" onClick={createnewpost}>
                                {ID_ACCOUNT_I && window.location.pathname == '/' || window.location.pathname == '/following' ? <Link className="PublicarButtoniPad" title='Criar publicação'><span><i className="fa-solid fa-feather"></i></span></Link> : <></>}
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
                                    <Link title='Sua conta' to={window.location.origin + '/user/' + ID_ACCOUNT_I.uid}><div className="account-div-flexbox">
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
                                    :
                                    <Link to={window.location.origin + "/accounts/login"}>
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
                                    </Link>
                                }

                            </div>

                        </div>
                    </div>
                </div>
                {(window.location.href).includes("inbox") ?
                    <div aria-live="polite" role='navigation' className='dump-header-flexible-messagens'>
                        <div className='header-posts-msg'>
                            <Link to={window.location.origin}><i className="fa-solid fa-arrow-left"></i></Link>
                            <h1>Mensagens</h1>
                        </div>

                    </div>
                    : <></>}
                <div aria-live="polite" role='navigation' className='dump-header-flexible'>
                    {window.location.pathname == '/' || window.location.pathname == '/following' ?
                        <>
                            <h1>Página Inicial</h1>
                            <div className='buttons-change-view'>
                                <div className='option-view' >
                                    <Link to={window.location.pathname == '/' ? '#' : window.location.origin + '/'} id={window.location.pathname == '/' ? 'selectedview' : ''}>
                                        Para você
                                    </Link>
                                </div>
                                <div className='option-view'>
                                    <Link to={window.location.pathname == '/following' ? '#' : window.location.origin + '/following'} id={window.location.pathname == '/following' ? 'selectedview' : ''}>
                                        Seguindo
                                    </Link>
                                </div>

                            </div>
                        </>
                        : <></>}
                    {window.location.pathname == '/search' ?
                        <>
                            <h1>Pesquisar</h1>
                            <div className='buttons-change-view'>
                                <div className='option-view' >
                                    <Link id='selectedview'>
                                        Tudo
                                    </Link>
                                </div>
                                <div className='option-view'>
                                    <Link >
                                        Pessoas
                                    </Link>
                                </div>
                                <div className='option-view'>
                                    <Link >
                                        Posts
                                    </Link>
                                </div>

                            </div>
                        </>
                        : <></>}
                    {(window.location.href).includes("posts") ?
                        <>
                            <div className='header-posts'>
                                <Link to={window.location.origin}><i className="fa-solid fa-arrow-left"></i></Link>
                                <h1>Post</h1>
                            </div>

                        </>
                        : <></>}

                    {(window.location.href).includes("user") ?
                        <>
                            <div className='header-posts'>
                                <Link to={window.location.origin}><i className="fa-solid fa-arrow-left"></i></Link>
                                <div className='right-side-header-posts accountheader'>
                                    <h1>{props.username}</h1>
                                    <p>{props.dumps} dumps</p>
                                </div>
                            </div>

                        </>
                        : <></>}
                    {(window.location.href).includes("saves") ?
                        <>
                            <div className='header-posts'>

                                <div className='right-side-header-posts accountheader'>
                                    <h1>Dumps Salvos</h1>
                                    <p>{props.savesuername}</p>
                                </div>
                            </div>

                        </>
                        : <></>}
                    {(window.location.href).includes("accounts/edit") ?
                        <>
                            <div className='header-posts'>
                                <Link to={auth.currentUser ? window.location.origin + "/user/" + auth.currentUser.uid : ""}><i className="fa-solid fa-arrow-left"></i></Link>
                                <div className='right-side-header-posts accountheader'>
                                    <h1>Editar perfil</h1>
                                </div>
                            </div>

                        </>
                        : <></>}
                    {(window.location.href).includes("notifications") ?
                        <>
                            <div className='header-posts'>
                                <Link to={window.location.origin}><i className="fa-solid fa-arrow-left"></i></Link>
                                <div className='right-side-header-posts accountheader'>
                                    <h1>Notificações</h1>
                                </div>
                            </div>

                        </>
                        : <></>}
                </div>
                <div className="App-Header-Feed-RightSide rightsideheader">
                    <Link to={window.location.origin + "/notifications"}>
                        <i className="fa-regular fa-heart"></i>
                        <label className='notification-show'></label>
                    </Link>

                </div>
            </header>
            <header aria-live="polite" role='navigation' className='dump-mobile-header'>
                {(window.location.href).includes("user") || (window.location.href).includes("saves") || (window.location.href).includes("edit") || (window.location.href).includes("posts") ? <></> :
                    <div className='top-header-mobile'>
                        <img onClick={gotoHome} src={window.location.origin + "/static/media/dumplogo.f3r818ht813gh78t13t.svg"} alt="Logo Dump" />
                        <div className="top-header-mobile-icons-rightside rightsideheadermobile">
                            {ID_ACCOUNT_I ? 
                                <Link to={window.location.origin + "/notifications"}>
                                    <i className="fa-regular fa-heart"></i>
                                    <label className='notification-show'></label>
                                </Link>
                             :
                                null
                            }


                            {/*i_ison && ID_ACCOUNT_I && ID_ACCOUNT_I.photoURL ? <img alt='Foto de perfil' src={ID_ACCOUNT_I.photoURL} /> : <></>*/}
                            {ID_ACCOUNT_I ? <img src={ID_ACCOUNT_I.photoURL} /> : <></>}
                        </div>
                    </div>}
                {window.location.pathname == '/' ?
                    <div className='bottom-header-mobile'>
                        <div className='option-feed-show'>
                            <Link id='selected'>Para você</Link>
                        </div>
                        <div className='option-feed-show'>
                            <Link to={window.location.origin + "/following"}>Seguindo</Link>
                        </div>

                    </div> : ''}
                {window.location.pathname == '/search' ?
                    <div className='bottom-header-mobile'>
                        <div className='option-feed-show'>
                            <Link id='selected'>Tudo</Link>
                        </div>
                        <div className='option-feed-show'>
                            <Link >Pessoas</Link>
                        </div>
                        <div className='option-feed-show'>
                            <Link >Publicações</Link>
                        </div>

                    </div> : ''
                }
                {window.location.pathname == '/following' ?
                    <div className='bottom-header-mobile'>
                        <div className='option-feed-show'>
                            <Link to={window.location.origin}>Para você</Link>
                        </div>
                        <div className='option-feed-show'>
                            <Link id='selected'>Seguindo</Link>
                        </div>

                    </div> : ''
                }
                {(window.location.href).includes("user") ?
                    (
                        <>
                            <div className='header-posts'>
                                <Link to={window.location.origin}><i className="fa-solid fa-arrow-left"></i></Link>
                                <div className='right-side-header-posts accountheader'>
                                    <h1>{props.username}</h1>
                                    <p>{props.dumps} dumps</p>
                                </div>
                            </div>
                        </>)
                    :

                    <></>}
                {(window.location.href).includes("saves") ?
                    (
                        <>
                            <div className='header-posts'>
                                <Link to={window.location.origin}><i className="fa-solid fa-arrow-left"></i></Link>
                                <div className='right-side-header-posts accountheader'>
                                    <h1>Dumps Salvos</h1>
                                    <p>{props.savesuername}</p>
                                </div>
                            </div>
                        </>)
                    :

                    <></>}
                {(window.location.href).includes("posts") ?
                    (
                        <>
                            <div className='header-posts'>
                                <Link to={window.location.origin}><i className="fa-solid fa-arrow-left"></i></Link>
                                <div className='right-side-header-posts accountheader'>
                                    <h1>Post</h1>

                                </div>
                            </div>
                        </>)
                    :

                    <></>}
                {(window.location.href).includes("accounts/edit") ?
                    (
                        <>
                            <div className='header-posts'>
                                <Link to={window.location.origin + "/user/" + auth.currentUser.uid}><i className="fa-solid fa-arrow-left"></i></Link>
                                <div className='right-side-header-posts accountheader'>
                                    <h1>Editar perfil</h1>

                                </div>
                            </div>
                        </>)
                    :

                    <></>}
                {(window.location.href).includes("notifications") ?
                    (
                        <>
                            <div className='header-posts'>
                                <Link to={window.location.origin}><i className="fa-solid fa-arrow-left"></i></Link>
                                <div className='right-side-header-posts accountheader'>
                                    <h1>Notificações</h1>

                                </div>
                            </div>
                        </>)
                    :

                    <></>}



            </header >
            <nav aria-live="polite" role='navigation' className='nav-bar-mobile'>
                <div>
                    <Link onClick={gotoHomePage} id={window.location.pathname == '/' || window.location.pathname == '/following' ? 'selected' : ''}><i className="fa-solid fa-house"></i></Link>
                </div>

                <Link to={window.location.origin + '/search'} id={window.location.pathname == '/search' ? 'selected' : ''}><i className="fa-solid fa-magnifying-glass"></i></Link>
                {ID_ACCOUNT_I ? <Link onClick={createnewpost}><i className="fa-solid fa-square-plus"></i></Link> : <></>}
                {ID_ACCOUNT_I ? <Link to={window.location.origin + '/saves'}><i className="fa-solid fa-bookmark"></i></Link> : ''}
                {ID_ACCOUNT_I ? <Link to={window.location.origin + '/user/' + ID_ACCOUNT_I.uid}><img src={ID_ACCOUNT_I.photoURL} /></Link> : <><Link to="./accounts/signup"><i className="fa-solid fa-circle-user"></i></Link></>}
            </nav>

        </>
    )
}