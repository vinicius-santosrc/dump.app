import React, { useEffect, useState } from 'react';
import 'firebase/auth'
import { auth, provider, signInWithPopup, app, db, database } from '../../../lib/firebase'
import {addDoc, collection, doc, getFirebase, onSnapshot, setDoc} from 'firebase/firestore'
import CommentsPost from './CommentsPost';
import UserPerfil from './UserPerfil';


export default function Posts(props) {
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    function gotouser() {
        database
        .collection("users")
        .where("username", "==", props.username)
        .get()
        .then(s => {
            s.docs.map(res => {
                window.location.href = "#?user=" + res.data().username
                document.querySelector(".dump-profile-app").style.display = 'block'
                document.querySelector(".dump-profile-cap").innerHTML = `<img src='` + res.data().photoURL + `'</img>`
                document.querySelector(".leftside-profile").innerHTML = `
                <img src='${props.photoURL}' />
                        <div>
                            <h2>${props.displayName}</h2>
                            <p>@${props.username}</p>
                        </div>
                `
                
            })
           
            
        }

        )

    }
    const likesofpub = () => {database.collection("posts")
    .doc(props.id)
    .get()
    .then(s => {
        return s.data().likes
})}

    function likethisphoto() {
        database.collection("posts")
        .doc(props.id)
        .update({
            likes: [auth.currentUser.uid]
        })
        .then(s => {
            alert('Sucesso')
        })
                    
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
                        <button onClick={likethisphoto}><i className="fa-regular fa-heart"></i> {likesofpub.length} </button>
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