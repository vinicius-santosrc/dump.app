import React, { useEffect, useState } from 'react';
import 'firebase/auth'
import { auth, provider, signInWithPopup, app, db, database } from '../../../lib/firebase'
import { addDoc, collection, doc, getDocs, getFirebase, onSnapshot, setDoc } from 'firebase/firestore'
import UserPerfil from './UserPerfil';
import databases from '../../../lib/appwrite';
import { Query } from 'appwrite';

export default function Posts(props) {

    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    function gotouser() {
        
        const getUserUrl = async () => {
            await databases.listDocuments(
                "64f9329a26b6d59ade09",
                "64f93be88eee8bb83ec3",
            )
                .then((res) => {
                    res.documents.filter(e => e.email == props.email).map((r) => {
                        window.location.href = `${window.location.origin}/user/${r.$id}`
                    })
                })
        }
        getUserUrl()

        /*database
            .collection("users")
            .where("username", "==", props.username)
            .get()
            .then(s => {
                s.docs.map(res => {
                    window.location.href = window.location.origin + "#?user=" + res.data().username
                })


            }

            )
            */
    }

    let quantoflikes = () => {

        /*database.collection("posts")
            .doc(props.id)
            .collection("likes")
            .get()
            .then(s => {
                return s.size
            })
        */
    }


    const likesofpub = () => {
        database.collection("posts")
            .doc(props.id)
            .get()
            .then(s => {
                return s.data().likes
            })
    }


    function likethisphoto() {



        /*database.collection("posts")
            .doc(props.id)
            .collection('likes')
            .doc(auth.currentUser.uid)
            .set({
                uid: auth.currentUser.uid
            })
            */
    }

    function unlikethisphoto() {
        /*database.collection("posts")
            .doc(props.id)
            .collection('likes')
            .doc(auth.currentUser.uid)
            .delete()
        */
    }

    function ButtonDeletePublic() {
        /*let [buttonremover, setButtonRemove] = useState("")

        useState(()=> {
            const LoadedInfo = async () => {
                const res = 
                    await databases.getDocument(
                    "64f9329a26b6d59ade09",
                    '64f93c1c40d294e4f379',
                    props.id,
                )
                    res.email == auth.currentUser.email ? setButtonRemove(
                        <button onClick={removethisphoto}><i className="fa-solid fa-trash-can"></i></button>
                    ) : <></>                  
                
                    
            }
            LoadedInfo()
        })
        return (buttonremover)*/

    }

    function removethisphoto() {
        /*database.collection("posts")
            .doc(props.id)
            .delete()
        alert("deu bom")*/
    }



    function Comments() {

    }

    const publicacaoId = props.id
    const userId = 'auth.currentUser.uid'
    const textoComentario = document.querySelector("#comments-dump-photo")

    function gotoPost() {
        window.location.href = `${window.location.origin}/posts/${props.id}`
    }

    var datepost = new Date(props.datepost)
    var datefilepost = `${datepost.toLocaleDateString()} as ${datepost.getHours()}:${datepost.getMinutes()}:${datepost.getSeconds()}`

    return (
        <div className="dump-post" >
            <div className="dump-post-header" onClick={gotouser}>
                <img src={props.photoURL} />
                <div className="dump-post-header-rightside">
                    <div>
                        <h3>{props.displayName} {props.isthisverifiqued == 'true' ? <><i alt="CONTA VERIFICADA" className="fa-solid fa-circle-check fa-fade verifyaccount" ></i></> : <></>}</h3>
                        <p>@{props.username}</p>
                    </div>

                </div>
            </div>
            <div className="dump-post-photo">
                <img onDoubleClick={''} onClick={gotoPost} alt={props.descricao} controls autoPlay src={props.fotopostada} />
            </div>
            <div className="dump-post-bottom">
            <label className="time-display-dump">{datefilepost}</label>
                <div className="btns-dump-comments">
                    <button onClick={''}><i className="fa-regular fa-heart"></i> </button>
                    <button><i className="fa-regular fa-paper-plane"></i></button>
                    <div className='likes-card-box'>
                    </div>
                    <button><i className="fa-solid fa-retweet"></i> </button>
                    <button><i className="fa-regular fa-bookmark"></i></button>
                    <ButtonDeletePublic />
                    
                </div>

            </div>
            <div className="dump-post-bottom-desc">
                <p><b>@{props.username}</b>: {props.descricao}</p>
            </div>
            <div>
                <a className="dump-comments-post">
                    <div>

                        <input id='comments-dump-photo' placeholder='Envie seu comentario' />
                        <button onClick={''}>COMENTAR</button>

                    </div>
                    <div className='comments-photo'>
                        <Comments />
                    </div>

                </a>
            </div>
        </div>
    )

}