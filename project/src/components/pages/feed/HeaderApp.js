import React, { useEffect, useState } from 'react';
import '../../../style/feed.css'
import 'firebase/auth'
import { auth, provider, signInWithPopup, app, db, database } from '../../../lib/firebase'
import {addDoc, collection, doc, getFirebase, setDoc} from 'firebase/firestore'
import { signOutUser } from "../../../lib/firebase"
import Suggestions_User from './Suggestions_User';
import { useCollection } from 'react-firebase-hooks/firestore';
import firebase from "firebase/compat/app"
import {User, UserNotFound } from '../../../pages/User';

getUrlUser()
function getUrlUser() {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('user')
}

function isnewuser() {
    return getUrlUser() ? false : true;
}

function gotoHome() {
    window.location.href= window.location.origin
}

function createnewpost() {
    document.querySelector('.createneewpost-card').style.display = 'block';
    document.querySelector('.background-posts').style.display = 'block';
}

const gotomyprofile = () => {
    database
    .collection('users')
    .where('uid' , '==', auth.currentUser.uid)
    .get()
    .then(s => {
        s.docs.map(yourprofile => {
            window.location.href=window.location.origin + '#/?user=' + yourprofile.data().username
        })
    })
}

function CurtidasList() {
    return(
        <div className='curtidas-null-dump'>
            <img src="../static/media/undraw_void_-3-ggu.svg" />
            <h2>Nada por aqui.</h2>
            <p>Aqui aparecerão suas curtidas.</p>
        </div>
        /*<div className='curtida-user-dump'>
            <img src={auth.currentUser.photoURL} />
            <div className='content-name-curtida'>
                <h2>{auth.currentUser.displayName}</h2>
                <p>{auth.currentUser.displayName}</p>
            </div>
        </div>*/
    )
}

function gotoHomePage() {
    if(window.location.href == window.location.origin) {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }
}

function openCurtidas() {
    document.querySelector(".curtidaspage-dump").style.display = 'block'
}

function fecharCurtidas() {
    document.querySelector(".curtidaspage-dump").style.display = 'none'

}

export default function HeaderFeed() {
    const [i_ison, setUserOn] = useState('')
    const SignWithGoogle =()=> {
        signInWithPopup(auth, provider).then((i) => {
        })
    }

    useEffect(() => {
        auth.onAuthStateChanged(function (u) {
        setUserOn(u)
        })
    })
    if(!isnewuser()) {
        let usernameuser = getUrlUser();
            database
            .collection("users")
            .where('username', '==', usernameuser)
            .get()
            .then(u => {
                if(u.docs.length != 0) {
                    u.docs.map(a => {
                        return(
                            <User
                                displayname={a.data().name}
                                username={a.data().username}
                                photoURL={a.data().photoURL}
                            />
                        )
                     })
                }
                else {
                     u.docs.map(a => {
                            return(
                                <UserNotFound/>
                            )
                        })
                        }
                    })
    }
    return(
        
        <>
            <header className="App-Header-Feed FeedHeader">
                <div className="App-Header-Feed-LeftSide leftsideheader">
                    <img onClick={gotoHome} src= {window.location.origin  + "/static/media/dumplogo.f3r818ht813gh78t13t.webp"} alt="Logo Dump" />
                    <div>
                    <div className="LeftSidePageHeader leftsidepagefeed">
                        <div className="LeftsideRedirect">
                            <a className="Redirect"><i className="fa-solid fa-house"></i> Página Inicial</a>
                        </div>
                        <div className="LeftsideRedirect" onClick={createnewpost}>
                            <a className="Redirect"><i className="fa-solid fa-square-plus"></i> Criar publicação</a>
                        </div>
                        <div className="account-div">
                        <div className="account-div-flexbox" onClick={gotomyprofile}>
                                <img src={i_ison.photoURL} />
                                <div>
                                    <h3 className="currentuser-displayname">{i_ison.displayName}</h3>
                                    <p className="currentuser-id">@{i_ison.displayName}</p>
                                </div>
                        </div>
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
                <a><i className="fa-solid fa-magnifying-glass"></i></a>
                <a onClick={createnewpost}><i className="fa-solid fa-square-plus"></i></a>
                <a onClick={gotomyprofile}><img src={auth.currentUser.photoURL} /></a>
            </nav>  
            <div className='curtidaspage-dump'>
                <div className='curtidasheader'>
                    <h2><i className="fa-regular fa-heart"></i> Curtidas</h2>
                    <button onClick={fecharCurtidas}><i className="fa-solid fa-xmark"></i></button>
                </div>
                <CurtidasList />
            </div>
        </>
    )
}