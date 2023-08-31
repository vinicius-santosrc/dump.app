import React, { useEffect, useState } from 'react';
import 'firebase/auth'
import { auth, provider, signInWithPopup, app, db, database } from '../../../lib/firebase'
import {addDoc, collection, doc, getFirebase, onSnapshot, setDoc} from 'firebase/firestore'
import CommentsPost from './CommentsPost';

export default function UserPerfil(props) {
    function closeuserpop() {
        document.querySelector(".dump-profile-app").style.display = 'none'
        window.location.href = '#'
    }
    return (
        <div className="dump-profile-app">
            <header onClick={closeuserpop}>
                <a><i className="fa-solid fa-chevron-left"></i></a>
                <img src="./static/media/dumplogo.f3r818ht813gh78t13t.webp" />
            </header>
            <div className="dump-profile">
                <div className="dump-profile-cap">
                    <img src={props.photoURL} />
                </div>
                <div className="dump-profile-info">
                    <div className="leftside-profile">
                        <img src={props.photoURL} />
                        <div>
                            <h2>{props.displayname}</h2>
                            <p>@{props.username}</p>
                        </div>
                    </div>
                    <div>
                        <button>SEGUIR</button>
                    </div>
                </div>
                <div className="dump-profile-followers">
                    <p>0 posts</p>
                    <p>0 seguidores</p>
                    <p>0 seguindo</p>
                </div>
            </div>
            <div className="dump-profile-photos">
            </div>
        </div>
    )
}