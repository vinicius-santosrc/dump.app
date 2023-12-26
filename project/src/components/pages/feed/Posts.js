import React, { useEffect, useState } from 'react';
import 'firebase/auth'
import { auth, provider, signInWithPopup, app, db, database } from '../../../lib/firebase'
import { addDoc, collection, doc, getDocs, getFirebase, onSnapshot, setDoc } from 'firebase/firestore'
import UserPerfil from './UserPerfil';
import databases from '../../../lib/appwrite';
import { ID, Query } from 'appwrite';
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom';
import { Ring } from '@uiball/loaders';
import { tailChase } from 'ldrs'

tailChase.register()



export default function Posts(props) {

    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [currentpostuser, setUserPostProfile] = useState('')
    const [LikesCurrent, setLikesCurrent] = useState([])
    const [likesBox, setlikesBox] = useState(false)


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
    const [NumberOfSaves, setNumberOfSaves] = useState(null)

    const [useratual, setuseratual] = useState(null)

    let ID_ACCOUNT
    if (auth.currentUser) {
        ID_ACCOUNT = auth.currentUser.uid
    }

    useEffect(() => {
        if (ID_ACCOUNT) {
            // Adicione event listeners apenas uma vez
            checkDumpLikes()
            checkDumpSaves()
        }
        // Certifique-se de remover os event listeners quando o componente for desmontado
        return () => {
            checkDumpLikes()
            checkDumpSaves()
        };

    }, [ID_ACCOUNT]);


    async function checkDumpLikes() {

        while (!targetUserId) {
            await new Promise(resolve => setTimeout(resolve, 100)); // Aguarde 100ms
        }

        try {
            // Obtenha o documento do usuário
            const user = await databases.getDocument(
                DB_UID,
                COL_UID,
                publicacaoId);

            setListOfLikes(user.likes)
            setNumberOfLikes(user.likes.length)
            setNumberOfSaves(user.saves.length)


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

        while (!targetUserId) {
            await new Promise(resolve => setTimeout(resolve, 100)); // Aguarde 100ms
        }

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

    function showLikesOfThatPublic(p) {
        console.log(p.likes);
        const likes = p.likes;
        setlikesBox(true);

        const fetchLikesData = async () => {
            const likesData = await Promise.all(
                likes.map((e) =>
                    databases.getDocument("64f9329a26b6d59ade09", "64f93be88eee8bb83ec3", e)
                )
            );

            setLikesCurrent(
                likesData.map((r) => (
                    <div className="card-user-sg" id={r.$id} key={r.someUniqueKey}>
                        <Link to={window.location.origin + "/user/" + r.$id}>
                            <div className='leftside-perfil'>
                                <img src={r.photoURL} />
                                <div className='card-user-sg-rightside'>
                                    <h1>{r.displayName}</h1>
                                    <p>@{r.username}</p>
                                </div>
                            </div>
                        </Link>

                    </div>
                ))
            );
        };

        fetchLikesData();
    }


    return (
        <>
            {likesBox ?
                <div className='Dump-Likes-Post-ShowBox'>
                <div onClick={() => setlikesBox(false)} className='backgroundCurtidas'></div>
                    <div className='Dump-Likes-Header-Box'>
                        <div className='HeaderLeft'>
                            <h2>Curtidas</h2>
                        </div>
                        <div className='ButtonCloseLikes'>
                            <button onClick={() => { setlikesBox(false) }}><span><i className="fa-solid fa-xmark"></i></span></button>
                        </div>
                    </div>
                    {LikesCurrent != '' ?
                        <>
                        
                            <div className='Card-Suggestions-Users'>
                                {LikesCurrent}
                            </div>
                        </>
                        :
                        <div className='LoaderContent'>


                            <l-tail-chase
                                size="40"
                                speed="1.75"
                                color="gray"
                            ></l-tail-chase>
                        </div>

                    }
                </div>
                :
                null
            }
            <article className="dump-post dumpfile" tabIndex='0' data-testid="dump" role='article'>
                <Link to={window.location.origin + "/user/" + props.uid_user}>
                    <div className="dump-post-header">
                        <img src={props.photoURL} />
                        <div className="dump-post-header-rightside">
                            <div className='information-user-dump-post'>
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
                </Link>
                <aside className="dump-post-photo">
                    <Link to={window.location.origin + '/posts/' + props.id} >
                        <img id={`D-IG-${props.id}-filePost`} draggable="true" onClick={gotoPost} alt={props.descricao} controls autoPlay src={props.fotopostada} />
                    </Link>
                </aside>
                <div className='Dump-Button-Likes-Show-Wrapper'>
                    <button onClick={() => { showLikesOfThatPublic(props) }} className='Dump-Btn-Likes-Show'>Ver curtidas</button>
                </div>
                <div className="dump-post-bottom">

                    <div className="Dump-Buttons-Wrapper-Post btns-dump-comments">

                        {auth.currentUser ?
                            <>
                                {isLiked ?
                                    <>

                                        <div className='dump-like-action-button'>
                                            <button alt="Descurtir" onClick={unlikethisphoto}><i className="fa-solid fa-heart"></i><p>{NumberOfLikes}</p> </button>

                                        </div>

                                    </>
                                    :
                                    <>
                                        <div className='dump-like-action-button'>
                                            <button alt="Curtir" onClick={likethepost}><i className="fa-regular fa-heart"></i><p>{NumberOfLikes}</p> </button>

                                        </div>

                                    </>
                                }
                                {isSaved ?
                                    <div className='dump-like-action-button'>
                                        <button onClick={unsavedump}><i className="fa-solid fa-bookmark"></i><p>{NumberOfSaves}</p></button>

                                    </div>

                                    :
                                    <div className='dump-like-action-button'>
                                        <button onClick={savedump}><i className="fa-regular fa-bookmark"></i><p>{NumberOfSaves}</p></button>

                                    </div>
                                }

                                <button onClick={() => window.location.href = window.location.origin + '/posts/' + props.id}><i className="fa-regular fa-comment"></i></button>

                            </>
                            :
                            <>
                                <div className='dump-like-action-button'>
                                    <button onClick={errorsemuser} alt="Curtir"><i className="fa-regular fa-heart"></i> </button>
                                    <p>{NumberOfLikes}</p>
                                </div>
                                <button onClick={errorsemuser}><i className="fa-regular fa-bookmark"></i></button>
                                <Link to={window.location.origin + '/posts/' + props.id} className="dump-comments-post">
                                    <div>
                                        <button><i className="fa-regular fa-comment"></i></button>
                                    </div>
                                </Link>

                            </>}




                    </div>

                </div>

            </article >
        </>
    )

}