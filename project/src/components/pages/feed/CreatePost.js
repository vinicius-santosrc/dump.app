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

            if(!desc) return document.querySelector(".alert").style.display = 'block';

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
            closepoppups();
            Swal.fire(
                'Good job!',
                'You clicked the button!',
                'success'
              )
              
        };

        const handleImage = (e) => {
            const reader = new FileReader();
            
            if(e.target.files[0]) {
                reader.readAsDataURL(e.target.files[0]);
                document.querySelector(".svg-logo-create").style.display = "none"
                document.querySelector(".imagechanger").style.display = 'none'
                document.querySelector(".descriptionphoto").style.display = 'block'
                document.querySelector(".step1postcreate").style.display = 'none'
                document.querySelector(".previewdesc").style.display = 'block'
                document.querySelector(".bottom-card-post").style.display = 'block'
            }
    
            reader.onload = (readerEvent) => {
                setFilePost(readerEvent.target.result);
            }
        }
        const removeFile = () => setFilePost(null);
        


    function closepoppups() {
        document.querySelector('.createneewpost-card').style.display = 'none';
        document.querySelector('.background-posts').style.display = 'none';
        removeFile()
        document.querySelector('.imagechanger').value = ''
        document.querySelector(".svg-logo-create").style.display = "block"
        document.querySelector(".imagechanger").style.display = 'block'
        document.querySelector(".descriptionphoto").style.display = 'none'
        document.querySelector(".step1postcreate").style.display ='block'
        document.querySelector(".previewdesc").style.display = 'none'
        document.querySelector(".bottom-card-post").style.display = 'none'
        
    }
    return (
        <>
            <div className="background-posts" onClick={closepoppups}></div>
            <div className="createneewpost-card">
                <h1 className="header-createnewpost"><i onClick={closepoppups} className="fa-solid fa-chevron-left"></i> Criar nova publicação</h1>
                <div className="createnewpost-middle">
                    <div className='left-side-preview'>
                    <img src="../../../static/media/posting_photo_re_plk8.svg" className='svg-logo-create' />
                        {filePost && (
                                <img className='previewimage' src={filePost} />
                            )}
                    </div>
                        <div className='right-side-previewimage'>
                            <p className='step1postcreate'>Selecione uma foto/vídeo</p>
                            <input className='imagechanger' type="file" onChange={handleImage}>
                            </input>
                            <div className='previewdesc'>
                                <div className='previewdesc-top'>
                                    <img src={auth.currentUser.photoURL} />
                                    <p>{auth.currentUser.displayName}</p>
                                </div>
                                <div>
                                    <input type='text' placeholder='Escreva um comentário' max={2000} className='descriptionphoto' value={desc} onChange={((e) => setDesc(e.target.value))}></input>
                                </div>
                            <div className='alert'>
                                <p>Insira uma descrição para sua publicação.</p>
                            </div>
                        </div>

                        
                    </div>
                </div>
                <div className='bottom-card-post'>
                            <button onClick={HandlePost}>Publicar</button>
                        </div>
            </div>
        </>
    )
}