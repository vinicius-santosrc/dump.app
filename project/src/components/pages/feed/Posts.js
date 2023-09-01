import React, { useEffect, useState } from 'react';
import 'firebase/auth'
import { auth, provider, signInWithPopup, app, db, database } from '../../../lib/firebase'
import {addDoc, collection, doc, getDocs, getFirebase, onSnapshot, setDoc} from 'firebase/firestore'
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
                window.location.href = window.location.origin +  "#?user=" + res.data().username
                
                
            })
           
            
        }

        )

    }

    let quantoflikes = () => {
        database.collection("posts")
        .doc(props.id)
        .collection("likes")
        .get()
        .then(s => {
            return s.size
        })

    }
    

    const likesofpub = () => {database.collection("posts")
    .doc(props.id)
    .get()
    .then(s => {
        return s.data().likes
    })}

    function setlike () {
        database.collection("posts")
        .doc(props.id)
        .collection('likes')
        .doc(auth.currentUser.uid)
        .get()
        .then(s => {
            if(s.exists) {
               //console.log("voce curtiu essas aq o "+ props.id)
            }
        })
        
    }
    

    setlike()

    function likethisphoto() {
        database.collection("posts")
        .doc(props.id)
        .collection('likes')
        .doc(auth.currentUser.uid)
        .set({
            uid: auth.currentUser.uid
         })
        .then(s => {
            alert('Sucesso')
        })
                    
    }

    function unlikethisphoto() {
        database.collection("posts")
        .doc(props.id)
        .collection('likes')
        .doc(auth.currentUser.uid)
        .delete()
        .then(s => {
            alert('Sucesso')
        })
                    
    }

    
    const ButtonLike = () => {
        const [btn, setButton] = useState('')
        
        database.collection("posts")
        .doc(props.id)
        .collection("likes")
        .get()
        .then(s => {
            setButton(<button onClick={likethisphoto}><i className="fa-regular fa-heart"></i> </button>)
            s.docs.map(res => {
                {res.data().uid == auth.currentUser.uid ? 
                    setButton(<button onClick={unlikethisphoto}><i className="fa-solid fa-heart"> </i></button>) 
                    :
                    setButton(<button onClick={likethisphoto}><i className="fa-regular fa-heart"></i> </button>)}
                })
            
            })
            
        return (btn)
        
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
                        <ButtonLike />
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