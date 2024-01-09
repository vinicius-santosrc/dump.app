import React, { useEffect, useRef, useState } from 'react';
import 'firebase/auth'
import { auth, provider, signInWithPopup, app, db, storage, database } from '../../../lib/firebase'
import { addDoc, collection, doc, getFirebase, setDoc } from 'firebase/firestore'
import { reauthenticateWithRedirect } from 'firebase/auth';
import firebase from "firebase/compat/app"
import { databases, storageWrite } from '../../../lib/appwrite';
import { Query, ID } from 'appwrite';
import UserGet from '../../../lib/user';
import Swal from 'sweetalert2';

export default function CreatePost() {

    const [DumpOption, setDumpOption] = useState("POST");


    const user = auth.currentUser

    const [desc, setDesc] = useState("");
    const fileRef = useRef("")
    const [filePost, setFilePost] = useState("")
    const [DreamPost, setDreamPost] = useState("")
    const [previewVideo, setpreviewVideo] = useState(null)
    const [ALLUSERS, setALLUSERS] = useState([])
    const [openMention, setOpenMention] = useState(false)
    const [listMentions, setListMentions] = useState([])
    const [searchMentions, setSearchMentions] = useState(null)
    const userATUAL = UserGet()
    if (!user) {
        return user
    }


    async function addtoList(user) {
        const lengthList = listMentions.filter((item) => item.$id == user.$id);
        if (!lengthList.length > 0) {
            let list = listMentions
            list.push(user)


            setListMentions(list);
            await getAllUsers();
            setOpenMention(!openMentions)
        }
    }

    async function unlistUser(user) {
        const list = listMentions.filter((item) => item.$id != user.$id);

        setListMentions(list);
        await getAllUsers();
        setOpenMention(!openMentions)

    }


    const getAllUsers = async () => {
        await databases.listDocuments(
            "64f9329a26b6d59ade09",
            "64f93be88eee8bb83ec3",
            [
                Query.orderDesc("$createdAt")
            ]
        )
            .then((users) => {
                if (searchMentions) {
                    setALLUSERS(users.documents.map((user) => {
                        if (user.$id === userATUAL.$id) {
                            return
                        }
                        if (listMentions.includes(user.$id)) {
                            return
                        }
                        if (((user.displayName).includes(searchMentions))) {
                            return (
                                <div className='leftside-perfil'
                                    id={user.$id}
                                    key={user.$id}
                                    onClick={async () => await addtoList(user)}
                                >
                                    <div className='selectOption'>
                                        <input type='checkbox' disabled />
                                    </div>
                                    <img src={user.photoURL} />
                                    <div className="card-user-sg-rightside">
                                        <h1>{user.displayName} {user.isthisverifiqued == 'true' ? <><i alt="CONTA VERIFICADA" className="fa-solid fa-circle-check fa-fade verifyaccount" ></i></> : <></>}</h1>
                                        <p>@{user.username}</p>
                                    </div>
                                </div>
                            )
                        }
                    }))
                }
                else {
                    setALLUSERS(users.documents.map((user) => {
                        if (user.$id === userATUAL.$id) {
                            return
                        }
                        if (listMentions.includes(user.$id)) {
                            return
                        }
                        else {
                            return (
                                <div className='leftside-perfil'
                                    id={user.$id}
                                    key={user.$id}
                                    onClick={async () => await addtoList(user)}
                                >
                                    <div className='selectOption'>
                                        <input type='checkbox' disabled />
                                    </div>
                                    <img src={user.photoURL} />
                                    <div className="card-user-sg-rightside">
                                        <h1>{user.displayName} {user.isthisverifiqued == 'true' ? <><i alt="CONTA VERIFICADA" className="fa-solid fa-circle-check fa-fade verifyaccount" ></i></> : <></>}</h1>
                                        <p>@{user.username}</p>
                                    </div>
                                </div>
                            )
                        }

                    }))
                }
            })
    }

    const HandlePost = async (e) => {
        e.preventDefault();
        let idpost = auth.currentUser.uid + '_' + Math.random(2, 100)
        if (!desc) {
            setDesc('Sem legenda')
        };

        if (DumpOption == "DREAM") {
            if (DreamPost) {
                setFilePost(null);
                removeFile();

                storageWrite.createFile(
                    "6598d2258fab991c729e",
                    ID.unique(),
                    DreamPost
                )
                    .then((res) => {
                        const URL = `https://cloud.appwrite.io/v1/storage/buckets/6598d2258fab991c729e/files/${res.$id}/view?project=64f930eab00dac51283b&mode=admin`;
                        setFilePost(null);
                        setDreamPost(null);
                        postthis(URL);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }

        }

        else {
            if (filePost) {
                setDreamPost(null)

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
        }

        const postthis = (url) => {

            let Mentions = []

            if (listMentions) {
                listMentions.map((mention) => {
                    Mentions.push(mention.$id)
                })
            }

            if (DumpOption == 'POST') {
                databases.createDocument("64f9329a26b6d59ade09", '64f93c1c40d294e4f379', ID.unique(), {
                    filePost: url,
                    legenda: desc,
                    displayName: null,
                    username: null,
                    email: user.email,
                    photoURL: null,
                    uid: auth.currentUser.uid,
                    mentions: Mentions
                })
                    .then(() => {
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Seu Dump foi publicado com sucesso!",
                            showConfirmButton: false,
                            timer: 1500
                        });

                    })
                    .catch((err) => {

                        console.log("Erro ao publicar o dump: ", err)
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
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Seu Daily foi publicado com sucesso!",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    })
                    .catch(error => {

                        console.log("Erro ao publicar o story dump: ", error)
                    })
            }
            if (DumpOption == 'DREAM') {
                databases.createDocument(
                    "64f9329a26b6d59ade09",
                    "6598d0374c841ff2ed4e",
                    ID.unique(),
                    {
                        dreamURL: url,
                        createdBy: auth.currentUser.uid,
                        legenda: desc,
                        mentions: Mentions

                    }
                )
                    .then((sucess) => {
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Seu Dream foi publicado com sucesso!",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    })
                    .catch(error => {

                        console.log("Erro ao publicar o story dump: ", error)
                    })
            }

        }

        setDesc("");

    };

    function handleDream(e) {
        console.log(DreamPost)
        console.log(filePost)
        setFilePost(null)
        if (e.target.files[0]) {
            const file = e.target.files[0];



            setDreamPost(file);
        }
        // Outras ações, se necessário
    }




    const handleImage = (e) => {
        const reader = new FileReader();
        setDreamPost(null)
        if (e.target.files[0]) {
            const file = e.target.files[0];
            reader.readAsDataURL(file);


            setDreamPost(file)
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



    function changeDumpOption(option) {
        if (option != "DREAM") {
            setDreamPost("")
        }
        else {
            setFilePost("")
        }
        setDumpOption(option)
    }

    async function openMentions() {
        await getAllUsers()
        setOpenMention(!openMention)
    }

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
                    <button className='Button-Change' onClick={() => { changeDumpOption('POST') }} id={DumpOption == 'POST' ? 'selected' : ''}><span>PUBLICAÇÃO</span></button>
                    <button className='Button-Change' onClick={() => { changeDumpOption("STORY") }} id={DumpOption == 'STORY' ? 'selected' : ''}><span>STORY</span></button>
                    <button className='Button-Change' onClick={() => { changeDumpOption("DREAM") }} id={DumpOption == 'DREAM' ? 'selected' : ''}><span>DREAM</span></button>
                </div>
                <div className="createnewpost-middle">
                    <h2><i className="fa-solid fa-image"></i> Adicione {DumpOption != "DREAM" ? "sua imagem" : "seu vídeo"}</h2>
                    <div className='left-side-preview'>
                        {DumpOption != "DREAM" ?
                        <label id='labelpostINPUT' htmlFor='postINPUT'>Clique aqui para enviar sua foto</label>
                        :
                        <label id='labelpostINPUT' htmlFor='postINPUT'>Clique aqui para enviar seu vídeo</label> 
                        }
                        
                        {DumpOption != "DREAM" && filePost != "" ?
                            <>
                                <img className='previewimage' src={filePost} />

                            </>

                            :
                            null}

                        {DumpOption == "DREAM" && DreamPost != "" ?
                            <>
                                <video controls muted autoPlay className='previewimage' src={URL.createObjectURL(DreamPost)} />
                            </>

                            :
                            null}
                    </div>
                    <div className='right-side-previewimage'>
                        {DumpOption == "POST" || DumpOption == "STORY" ?
                            <input id='postINPUT' name="postINPUT" className='imagechanger' accept="image/*" type="file" onChange={handleImage} />
                            :
                            <input id='postINPUT' name="postINPUT" className='imagechanger' accept="video/*" type="file" onChange={handleDream} />
                        }

                        {filePost || DreamPost ?

                            <div className='previewdesc'>
                                <div className='dumpOptions'>
                                    {DumpOption != "STORY" && <button onClick={openMentions} className='btnOptions'><i className="fa-solid fa-user"></i> <p>MARCAR PESSOAS</p></button>}

                                </div>
                                {DumpOption != 'STORY' &&
                                    <>
                                        {listMentions ?
                                            <div className='ListMentionsDump'>
                                                {listMentions != "" &&
                                                    <div className='TitleMentions'>
                                                        <h2>Menções</h2>
                                                    </div>
                                                }

                                                {listMentions.map((user) => {
                                                    return (
                                                        <div className='leftside-perfil'
                                                            id={user.$id}
                                                            key={user.$id}
                                                            onClick={async () => await unlistUser(user)}

                                                        >
                                                            <div className='selectOption'>
                                                                <input type='checkbox' checked disabled />
                                                            </div>
                                                            <img src={user.photoURL} />
                                                            <div className="card-user-sg-rightside">
                                                                <h1>{user.displayName} {user.isthisverifiqued == 'true' ? <><i alt="CONTA VERIFICADA" className="fa-solid fa-circle-check fa-fade verifyaccount" ></i></> : <></>}</h1>
                                                                <p>@{user.username}</p>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            :
                                            null}
                                        {openMention ?
                                            <div className='mentionCard'>
                                                <div className='MentionCard-Users'>
                                                    <div className='inputSearch'>
                                                        <input
                                                            className='SearchMentions'
                                                            value={searchMentions}
                                                            onChange={async (e) => { setSearchMentions(e.target.value); await getAllUsers(); }}

                                                            type='text'
                                                            placeholder='Procurar pessoas' />
                                                    </div>
                                                    {ALLUSERS}
                                                </div>
                                            </div>
                                            :
                                            null
                                        }

                                    </>
                                }
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
                            :
                            null
                        }


                    </div>
                </div>
            </div>
        </>
    )
}