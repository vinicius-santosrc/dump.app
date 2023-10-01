import React, { useEffect, useState } from 'react';
import 'firebase/auth'
import { auth, provider, signInWithPopup, app, db, database } from '../../../lib/firebase'
import { addDoc, collection, doc, getDocs, getFirebase, onSnapshot, setDoc } from 'firebase/firestore'
import UserPerfil from './UserPerfil';
import databases from '../../../lib/appwrite';
import { ID, Query } from 'appwrite';
import Swal from 'sweetalert2'

export default function Posts(props) {

    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [currentpostuser, setUserPostProfile] = useState('')
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

    function Comments() {

    }

    const DB_UID = '64f9329a26b6d59ade09'
    const COL_UID = '64f93c1c40d294e4f379'
    let targetUserId
    const publicacaoId = props.id

    if (auth.currentUser) {
        targetUserId = auth.currentUser.uid;
    }

    /** VERIFICAÇÃO DUMP ATUAL */

    const [isLiked, setLike] = useState(null)
    const [isSaved, setSave] = useState(null)
    const [ListOfSaves, setListOfSaves] = useState(null)
    const [ListOfLikes, setListOfLikes] = useState(null)
    const [NumberOfLikes, setNumberOfLikes] = useState(null)


    useEffect(() => {
        window.addEventListener('DOMContentLoaded', checkDumpLikes())
        window.addEventListener('DOMContentLoaded', checkDumpSaves())
        setTimeout(() => {
            checkDumpLikes()
            checkDumpSaves()
        }, 2000);
        setTimeout(() => {
            checkDumpLikes()
            checkDumpSaves()
        }, 5000);
        setTimeout(() => {
            checkDumpLikes()
            checkDumpSaves()
        }, 10000);
        setTimeout(() => {
            checkDumpLikes()
            checkDumpSaves()
        }, 7000);
        window.addEventListener("pageshow", checkDumpLikes())
        window.addEventListener("pageshow", checkDumpSaves())

        window.addEventListener("loadeddata", checkDumpLikes())
        window.addEventListener("loadeddata", checkDumpSaves())

        window.addEventListener("loadedmetadata", checkDumpLikes())
        window.addEventListener("loadedmetadata", checkDumpSaves())

    }, [])


    async function checkDumpLikes() {

        try {
            // Obtenha o documento do usuário
            const user = await databases.getDocument(
                DB_UID,
                COL_UID,
                publicacaoId);

            setListOfLikes(user.likes)
            setNumberOfLikes(user.likes.length)


            const likes = user.likes || [];

            if (likes.includes(targetUserId)) {
                setLike(true)
                return true;
            } else {

                setLike(false)
                return false;
            }
        } catch (error) {
            setLike(false)
            console.log(error)
            return false;
        }
    }

    async function checkDumpSaves() {

        try {
            // Obtenha o documento do usuário
            const user = await databases.getDocument(
                DB_UID,
                COL_UID,
                publicacaoId);

            setListOfSaves(user.saves)

            const saves = user.saves || [];

            if (saves.includes(targetUserId)) {
                setSave(true)
                return true;
            } else {

                setSave(false)
                return false;
            }
        } catch (error) {
            setSave(false)
            console.log(error)
            return false;
        }
    }

    /** CURTIR DUMP ATUAL */

    async function sendNotification(PHOTO_REL, USERPUBLIC) {
        try {
            const NOTIFICATION_UID = '64fd4c66a7628f81bde8'
            await databases.createDocument(
                DB_UID,
                NOTIFICATION_UID,
                ID.unique(),
                {
                    TO_UID: USERPUBLIC,
                    SENDER_UID: auth.currentUser.uid,
                    SENDER_PIC: "https://a.com.br",
                    SENDER_USERNAME: "",
                    SENDER_NAME: "",
                    ACTION: "like",
                    PHOTO_REL: PHOTO_REL,
                    desc: ''

                }
            )


        }
        catch {

        }
    }

    const [toUid_Send, setTOUID] = useState('')
    const [UserAtual, SetUserAtual] = useState('')

    let SENDERUID
    if (auth.currentUser) {
        SENDERUID = auth.currentUser.uid
    }


    async function likethepost() {
        try {
            const userDocument = await databases.getDocument(
                DB_UID,
                COL_UID,
                publicacaoId);

            const likes = userDocument.likes || [];

            if (likes.includes(targetUserId)) {

                checkDumpLikes()
                return;
            }

            likes.push(targetUserId);

            await databases.updateDocument(
                DB_UID,
                COL_UID,
                publicacaoId, {
                likes: likes,
            });

            checkDumpLikes()


            const NOT_DOC = '64fd4c66a7628f81bde8'
            const USERS_DOC = '64f93be88eee8bb83ec3'

            try {

                await databases.listDocuments(
                    DB_UID,
                    USERS_DOC,
                )
                    .then(response => {
                        response.documents.filter(r => r.email == props.email).map((e) => {
                            sendNotification(publicacaoId, e.$id)
                        })
                    })


            } catch (error) {
                console.error('Erro ao buscar o valor de toUid_Send:', error);
            }






        } catch (error) {
            console.error('Erro ao seguir o usuário:', error);
        }
    }

    async function unlikethisphoto() {
        try {
            const userDocument = await databases.getDocument(
                DB_UID,
                COL_UID,
                publicacaoId);

            const likes = userDocument.likes || [];

            if (!likes.includes(targetUserId)) {

                checkDumpLikes()
                return;
            }

            const likesUpdated = likes.filter((id) => id !== targetUserId);

            await databases.updateDocument(
                DB_UID,
                COL_UID,
                publicacaoId, {
                likes: likesUpdated,
            });

            checkDumpLikes()


        } catch (error) {
            console.error('Erro ao parar de seguir o usuário:', error);
        }
    }

    /** SALVAR DUMP ATUAL */

    async function savedump() {
        try {
            const userDocument = await databases.getDocument(
                DB_UID,
                COL_UID,
                publicacaoId);

            const saves = userDocument.saves || [];

            if (saves.includes(targetUserId)) {

                checkDumpSaves()
                return;
            }

            saves.push(targetUserId);

            await databases.updateDocument(
                DB_UID,
                COL_UID,
                publicacaoId, {
                saves: saves,
            });



            checkDumpSaves()

        } catch (error) {
            console.error('Erro ao seguir o usuário:', error);
        }
    }
    async function unsavedump() {
        try {
            const userDocument = await databases.getDocument(
                DB_UID,
                COL_UID,
                publicacaoId);

            const saves = userDocument.saves || [];

            if (!saves.includes(targetUserId)) {

                checkDumpSaves()
                return;
            }

            const savesUpdated = saves.filter((id) => id !== targetUserId);

            await databases.updateDocument(
                DB_UID,
                COL_UID,
                publicacaoId, {
                saves: savesUpdated,
            });


            checkDumpSaves()

        } catch (error) {
            console.error('Erro ao parar de seguir o usuário:', error);
        }
    }

    const userId = 'auth.currentUser.uid'
    const textoComentario = document.querySelector("#comments-dump-photo")

    function gotoPost() {
        window.location.href = `${window.location.origin}/posts/${props.id}`
    }

    function errorsemuser() {
        alert('Entre para curtir e salvar fotos.')
    }

    const MesesDoAno = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ]

    var datepost = new Date(props.datepost)
    var datefilepost = datepost.getDate() + ' de ' + MesesDoAno[datepost.getMonth()]

    return (
        <article className="dump-post dumpfile" tabIndex='0' data-testid="dump" role='article'>
            <a href={window.location.origin + "/user/" + props.uid_user}>
                <div className="dump-post-header">
                    <img src={props.photoURL} />
                    <div className="dump-post-header-rightside">
                        <div>
                            <h3>{props.displayName} {props.isthisverifiqued == 'true' ? <><i alt="CONTA VERIFICADA" title='Verificado' className="fa-solid fa-circle-check fa-fade verifyaccount" ></i></> : <></>}</h3>
                            <p>@{props.username}</p>
                        </div>


                    </div>
                    <div>
                        <label className="time-display-dump">{datefilepost}</label>
                    </div>
                </div>
                <div className='descriptionofdump'>
                    <p>{props.descricao ? props.descricao : ""}</p>
                </div>
            </a>
            <div className="dump-post-photo">
                <a href={window.location.origin + '/posts/' + props.id} >
                    <img onClick={gotoPost} alt={props.descricao} controls autoPlay src={props.fotopostada} />
                </a>
            </div>
            <div className="dump-post-bottom">

                <div className="btns-dump-comments">

                    {auth.currentUser ?
                        <>
                            {isLiked ?
                                <>
                                    <button></button>
                                    <div className='dump-like-action-button'>
                                        <button alt="Descurtir" onClick={unlikethisphoto}><i className="fa-solid fa-heart"></i> </button>
                                        <p>{NumberOfLikes}</p>
                                    </div>

                                </>
                                :
                                <>
                                    <div className='dump-like-action-button'>
                                        <button alt="Curtir" onClick={likethepost}><i className="fa-regular fa-heart"></i> </button>
                                        <p>{NumberOfLikes}</p>
                                    </div>

                                </>
                            }
                            <div className='likes-card-box'>
                            </div>
                            {isSaved ?
                                <button onClick={unsavedump}><i className="fa-solid fa-bookmark"></i></button>
                                :
                                <button onClick={savedump}><i className="fa-regular fa-bookmark"></i></button>}
                        </>
                        :
                        <>
                            <div className='dump-like-action-button'>
                                <button onClick={errorsemuser} alt="Curtir"><i className="fa-regular fa-heart"></i> </button>
                                <p>{NumberOfLikes}</p>
                            </div>
                            <button onClick={errorsemuser}><i className="fa-regular fa-bookmark"></i></button>
                            <a href={window.location.origin + '/posts/' + props.id} className="dump-comments-post">
                                <div>
                                    <button><i className="fa-regular fa-comment"></i></button>
                                </div>
                            </a>

                        </>}




                </div>

            </div>

        </article >
    )

}