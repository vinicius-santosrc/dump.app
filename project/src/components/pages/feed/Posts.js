import React, { useEffect, useState } from 'react';
import 'firebase/auth'
import { auth, provider, signInWithPopup, app, db, database } from '../../../lib/firebase'
import {addDoc, collection, doc, getFirebase, setDoc} from 'firebase/firestore'
import CommentsPost from './CommentsPost';


export default function Posts(props) {
    function gotouser() {
        database
        .collection("users")
        .where("username", "==", props.username)
        .get()
        .then(s => {
            s.docs.map(res => {
                window.location.href = window.location.origin + "?user=" + res.data().username
            })
        }

        )

    }
        return(
            <div className="dump-post">
                <div className="dump-post-header" onClick={gotouser}>
                    <img src={props.photoURL} />
                    <div className="dump-post-header-rightside">
                        <div>
                            <h3>{props.displayName}</h3>
                            <p>@{props.username}</p>
                        </div>
                        <div>
                            <p>{new Date(props.time?.toDate()).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="dump-post-photo">
                    <img controls autoPlay src={props.fotopostada}/>

                </div>
                <div className="dump-post-bottom">
                    <div className="btns-dump-comments">
                        <button><i className="fa-regular fa-heart"></i> </button>
                        <button><i className="fa-solid fa-retweet"></i> </button>
                    </div>
                    <div>
                        <a className="dump-comments-post">
                            <div>
                                <CommentsPost />
                            </div>
                            
                        </a>
                    </div>
                </div>
                <div className="dump-post-bottom-desc">
                    <p><b>@{props.username}</b>: {props.descricao}</p>
                </div>
            </div>
        )
    
}