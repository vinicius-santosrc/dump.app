import React, { useEffect, useState } from 'react';
import 'firebase/auth'
import { auth, provider, signInWithPopup, app, db } from '../../../lib/firebase'
import {addDoc, collection, doc, getFirebase, setDoc} from 'firebase/firestore'

export default function Posts(props) {

        return(
            <div className="dump-post">
                <div className="dump-post-header">
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
                    <img src={props.fotopostada} />
                </div>
                <div className="dump-post-bottom">
                    <div className="btns-dump-comments">
                        <button><i className="fa-regular fa-heart"></i> </button>
                        <button><i className="fa-solid fa-retweet"></i> </button>
                    </div>
                    <div>
                        <a className="dump-comments-post">
                            <img src={auth.currentUser.photoURL}/>
                            <h2>Escrever um comentário</h2>
                            
                        </a>
                    </div>
                </div>
            </div>
        )
    
}