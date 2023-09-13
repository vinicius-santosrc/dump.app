import React, { useEffect, useRef, useState } from 'react';
import 'firebase/auth'
import { auth, provider, signInWithPopup, app, db, storage, database } from '../../../lib/firebase'
import { addDoc, collection, doc, getFirebase, setDoc } from 'firebase/firestore'
import { reauthenticateWithRedirect } from 'firebase/auth';
import firebase from "firebase/compat/app"
import databases from '../../../lib/appwrite';
import { Query, ID } from 'appwrite';

export default function CreatePost() {
    function ErroPostDump() {
        document.querySelector(".seending-pic-dump").style.display = 'none';
        document.querySelector(".error-upload-photo").style.display = 'flex';
        document.querySelector(".seending-pic-dump-left-side").innerHTML = `<img src=${filePost}></img>`
    }
    const user = auth.currentUser

    const [desc, setDesc] = useState("");
    const fileRef = useRef("")
    const [filePost, setFilePost] = useState("")
    if (!user) {
        return user
    }
    const HandlePost = async (e) => {
        e.preventDefault();
        let idpost = auth.currentUser.uid + '_' + Math.random(2, 100)
        if (!desc) {
            setDesc('Sem legenda')
        };

        if (filePost) {
            document.querySelector(".seending-pic-dump").style.display = 'flex'

            document.querySelector(".seending-pic-dump img").setAttribute("src", filePost)
            document.querySelector(".sucess-upload-photo img").setAttribute("src", filePost)
            const upload = storage

                .ref(`posts/${idpost}`)
                .putString(filePost, 'data_url')

            removeFile();

            upload.on(
                "state_change",
                null,
                (err) => {
                    ErroPostDump()
                },
                () => {
                    storage
                        .ref("posts")
                        .child(idpost)
                        .getDownloadURL()
                        .then((url) => {
                            postthis(url)
                        })
                }
            )
        }

        const postthis = (url) => {
            databases.createDocument("64f9329a26b6d59ade09", '64f93c1c40d294e4f379', ID.unique(), {
                filePost: url,
                legenda: desc,
                displayName: user.displayName,
                username: (user.displayName).toLocaleLowerCase(),
                email: user.email,
                photoURL: user.photoURL,
                uid: auth.currentUser.uid
            })
                .then(() => {
                    document.querySelector(".seending-pic-dump").style.display = 'none'
                    document.querySelector(".sucess-upload-photo").style.display = 'flex'
                    setInterval(() => {
                        document.querySelector(".sucess-upload-photo").style.display = 'none'
                    }, 10000)

                })
                .catch(() => {
                    ErroPostDump()
                })
        }

        setDesc("");
        closepoppups();
    };

    const handleImage = (e) => {
        const reader = new FileReader();

        if (e.target.files[0]) {
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
        document.querySelector(".step1postcreate").style.display = 'block'
        document.querySelector(".previewdesc").style.display = 'none'
        document.querySelector(".bottom-card-post").style.display = 'none'

    }
    return (
        <>
            <div className='loading-wrap'>
                <div className='card-posting-photo'>

                </div>
            </div>
            <div className="background-posts" onClick={closepoppups}></div>
            <div className="createneewpost-card">
                <div className="header-createnewpost">
                    <i onClick={closepoppups} className="fa-solid fa-chevron-left"></i>
                    <h2>Nova publicação</h2>
                    <div className='bottom-card-post'>
                        <button onClick={HandlePost}>Publicar</button>
                    </div>
                </div>
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
            </div>
        </>
    )
}