import React, { useEffect, useState } from 'react';
import '../../../style/feed.css'
import 'firebase/auth'
import { auth, provider, signInWithPopup, app, db } from '../../../lib/firebase'
import {addDoc, collection, doc, getFirebase, setDoc} from 'firebase/firestore'
import { signOutUser } from "../../../lib/firebase"


function gotoHome() {
    window.location.href= window.location.origin
}

function createnewpost() {
    document.querySelector('.createneewpost-card').style.display = 'block';
    document.querySelector('.background-posts').style.display = 'block';
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
                        <div className="account-div" onClick={signOutUser}>
                        <div className="account-div-flexbox">
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
                    <a href="">
                        <i className="fa-regular fa-heart"></i>
                    </a>
                    <a href="">
                        <i className="fa-regular fa-comment-dots"></i>
                    </a>
                </div>
            </header>
            <nav className='nav-bar-mobile'>
                <a><i className="fa-solid fa-house"></i></a>
                <a><i className="fa-solid fa-magnifying-glass"></i></a>
                <a onClick={createnewpost}><i className="fa-solid fa-square-plus"></i></a>
                <a><img src={auth.currentUser.photoURL} /></a>
            </nav>  
        </>
    )
}