import React, { useEffect, useRef, useState } from 'react';
import 'firebase/auth'
import { auth, provider, signInWithPopup, app, db, storage, database } from '../../../lib/firebase'
import {addDoc, collection, doc, getFirebase, setDoc} from 'firebase/firestore'
import { reauthenticateWithRedirect } from 'firebase/auth';
import firebase from "firebase/compat/app"

export default function CreatePost() {

    const user = auth.currentUser
    
        const [desc, setDesc] = useState("");
        const fileRef = useRef("")
        const [filePost, setFilePost] = useState("")

        const HandlePost = async (e) => {
            e.preventDefault();

            if(!desc) return;

            await database
            .collection("posts")
            .add({
                desc: desc,
                name: user.displayName,
                email: user.email,
                imageprofile: user.photoURL,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then((doc) => {
                if(filePost) {
                    const upload = storage
                    .ref(`posts/${doc.id}`)
                    .putString(filePost, 'data_url')

                    removeFile();

                    upload.on(
                        "state_change",
                        null,
                        (err) => console.log(err),
                        () => {
                            storage
                            .ref("posts")
                            .child(doc.id)
                            .getDownloadURL()
                            .then((url) => {
                                database.collection("posts").doc(doc.id).set(
                                    {
                                        filePost: url,
                                    },
                                    { merge: true }
                                )
                            })
                        }
                    )
                }
            })

            setDesc("");
        };

        const handleImage = (e) => {
            const reader = new FileReader();
    
            if(e.target.files[0]) {
                reader.readAsDataURL(e.target.files[0]);
            }
    
            reader.onload = (readerEvent) => {
                setFilePost(readerEvent.target.result);
            }
        }
        const removeFile = () => setFilePost(null);


    function closepoppups() {
        document.querySelector('.createneewpost-card').style.display = 'none';
        document.querySelector('.background-posts').style.display = 'none';
    }
    return (
        <>
            <div className="background-posts" onClick={closepoppups}></div>
            <div className="createneewpost-card">
                <h1 className="header-createnewpost">Criar nova publicação</h1>
                <div className="createnewpost-middle">
                <img src="../../../static/media/posting_photo_re_plk8.svg" />
                    <p>Selecione uma foto/vídeo</p>
                    <input type="file" onChange={handleImage}>
                    </input>
                    <input type='text' value={desc} onChange={((e) => setDesc(e.target.value))}></input>
                    <button onClick={HandlePost}>PUBLICAR</button>
                    {filePost && (
                        <img src={filePost} />
                    )}
                </div>
            </div>
        </>
    )
}