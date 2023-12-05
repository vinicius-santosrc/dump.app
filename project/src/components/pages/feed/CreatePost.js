import React, { useEffect, useRef, useState } from 'react';
import 'firebase/auth'
import { auth, provider, signInWithPopup, app, db, storage, database } from '../../../lib/firebase'
import { addDoc, collection, doc, getFirebase, setDoc } from 'firebase/firestore'
import { reauthenticateWithRedirect } from 'firebase/auth';
import firebase from "firebase/compat/app"
import databases from '../../../lib/appwrite';
import { Query, ID } from 'appwrite';
import UserGet from '../../../lib/user';

export default function CreatePost() {

    const [DumpOption, setDumpOption] = useState("POST");


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
            
            const upload = storage

                .ref(`posts/${idpost}`)
                .putString(filePost, 'data_url')

            removeFile();

            upload.on(
                "state_change",
                null,
                (err) => {
                    console.log("Erro ao publicar o dump", err)
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
            if (DumpOption == 'POST') {
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
                        alert("SUCESS DUMP")

                    })
                    .catch(() => {
       
                        console.log("Erro ao publicar o dump: ", error)
                    })
            }
            if (DumpOption == 'STORY') {
                databases.createDocument(
                    "64f9329a26b6d59ade09",
                    "656e15735dbeae5aef50",
                    ID.unique(),
                    {
                        content_story: url,
                        created_by: auth.currentUser.uid
                    }
                )
                    .then((sucess) => {
                        alert("SUCESS STORY")
                    })
                    .catch(error => {
           
                        console.log("Erro ao publicar o story dump: ", error)
                    })
            }

        }

        setDesc("");

    };

    const handleImage = (e) => {
        const reader = new FileReader();

        if (e.target.files[0]) {
            const file = e.target.files[0];
            reader.readAsDataURL(file);

            document.querySelector(".imagechanger").style.display = 'none';
            document.querySelector(".descriptionphoto").style.display = 'block';

            document.querySelector(".previewdesc").style.display = 'block';
            document.querySelector(".bottom-card-post").style.display = 'block';
        }

        reader.onload = (readerEvent) => {
            const originalImageDataUrl = readerEvent.target.result;

            // Reduzir a qualidade para 40% e tamanho em KB
            const qualidadeAlvo = 40; // Qualidade desejada (40%)
            const tamanhoMaxKB = 10000; // Tamanho máximo em KB

            const img = new Image();
            img.src = originalImageDataUrl;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                const largura = img.width;
                const altura = img.height;

                canvas.width = largura;
                canvas.height = altura;

                context.drawImage(img, 0, 0, largura, altura);

                // Converter para uma nova imagem com qualidade reduzida
                const novaQualidade = qualidadeAlvo / 100;
                const novaImagem = canvas.toDataURL('image/jpeg', novaQualidade);

                // Verificar o tamanho da nova imagem
                const novaTamanhoKB = Math.round(novaImagem.length / 1024);

                if (novaTamanhoKB <= tamanhoMaxKB) {
                    // Salvar a imagem reduzida no state ou fazer o que for necessário
                    setFilePost(novaImagem);
                } else {
                    alert(`A imagem reduzida excede o tamanho máximo de ${tamanhoMaxKB} KB.`);
                }
            };
        };
    }
    const removeFile = () => setFilePost(null);



    function closepoppups() {
        removeFile()
        document.querySelector('.imagechanger').value = ''
        document.querySelector(".svg-logo-create").style.display = "block"
        document.querySelector(".imagechanger").style.display = 'block'
        document.querySelector(".descriptionphoto").style.display = 'none'

        document.querySelector(".previewdesc").style.display = 'none'
        document.querySelector(".bottom-card-post").style.display = 'none'

    }

    const userATUAL = UserGet()

    return (
        <>
            <div className='loading-wrap'>
                <div className='card-posting-photo'>

                </div>
            </div>
            <div className="createneewpost-card">
                <div className="header-createnewpost">
                    <h2><i className="fa-solid fa-square-plus"></i> Criar um Dump</h2>
                </div>
                <div className='Buttons-Change-Option'>
                    <button className='Button-Change' onClick={() => { setDumpOption('POST') }} id={DumpOption == 'POST' ? 'selected' : ''}><span>PUBLICAÇÃO</span></button>
                    <button className='Button-Change' onClick={() => { setDumpOption('STORY') }} id={DumpOption == 'STORY' ? 'selected' : ''}><span>STORY</span></button>
                </div>
                <div className="createnewpost-middle">
                    <h2><i className="fa-solid fa-image"></i> Adicione sua imagem</h2>
                    <div className='left-side-preview'>
                        <label id='labelpostINPUT' htmlFor='postINPUT'>Clique aqui para enviar sua foto</label>
                        {filePost && (
                            <img className='previewimage' src={filePost} />
                        )}
                    </div>
                    <div className='right-side-previewimage'>
                        <input id='postINPUT' name="postINPUT" className='imagechanger' type="file" onChange={handleImage}>
                        </input>
                        <div className='previewdesc'>
                            <div className='previewdesc-top'>
                                <img src={userATUAL ? userATUAL.photoURL : ""} />
                                <p>{userATUAL ? userATUAL.displayName : ""}</p>
                            </div>
                            <div>
                                <input type='text' placeholder='Escreva um comentário' max={2000} className='descriptionphoto' value={desc} onChange={((e) => setDesc(e.target.value))}></input>
                            </div>
                            <div className='alert'>
                                <p>Insira uma descrição para sua publicação.</p>
                            </div>
                            <div className='bottom-card-post'>
                                <button onClick={HandlePost}><span>Publicar</span></button>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </>
    )
}