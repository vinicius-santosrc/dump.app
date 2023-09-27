import { useEffect, useState } from "react";

import { HideLoading } from "../components/Loading";
import databases from "../lib/appwrite";
import { useParams } from "react-router-dom";
import { auth } from "../lib/firebase";
import Swal from 'sweetalert2'
import { ID, Query } from "appwrite";
import HeaderFeed from "../components/pages/feed/HeaderApp";
import Suggestions from "../components/pages/feed/Suggestions";


export default function PostDetails() {
    const { idPost } = useParams();
    const [publicacao, setPublicacao] = useState(null);
    const [publicacaoId, setPublicaoId] = useState(null)
    const [userPub, setUserPub] = useState(null)
    const [USER_DOC, setUserAt] = useState(null)
    const [user_comment_set, setuser_comment_set] = useState(null)
    const [comments_length, setcomments_length] = useState(null)

    const [Comments_Dump, SetComments_Dump] = useState([]);

    const USERSIDDATABASE = '64f93be88eee8bb83ec3'



    const DB_ID = '64f9329a26b6d59ade09'
    const COMMENTS_UID = "65136577656a75010795"
    const USERS_UID = "64f93be88eee8bb83ec3"

    useEffect(() => {
        HideLoading()
        databases.getDocument(
            "64f9329a26b6d59ade09",
            '64f93c1c40d294e4f379',
            idPost
        )
            .then((response) => {
                setPublicacao(response)
                setPublicaoId(response.$id)
            })
            .catch((e) => {
                console.log(e)
            })
    }, [idPost])

    const DB_UID = '64f9329a26b6d59ade09'
    const COL_UID = '64f93c1c40d294e4f379'
    let targetUserId

    if (auth.currentUser) {
        targetUserId = auth.currentUser.uid;
    }

    useEffect(() => {
        comments_of_dump()
            .then((commentsData) => {
                SetComments_Dump(commentsData);
            })
            .catch((error) => {
                // Handle error appropriately
            });
    }, []);




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
        }, 4000);

        setTimeout(() => {
            checkDumpLikes()
            checkDumpSaves()
        }, 6000);

        setTimeout(() => {
            checkDumpLikes()
            checkDumpSaves()
        }, 8000);
        setTimeout(() => {
            checkDumpLikes()
            checkDumpSaves()
        }, 10000);
    }, [])

    async function sendNotification(PHOTO_REL, type, desc) {
        try {
            const NOTIFICATION_UID = '64fd4c66a7628f81bde8'
            await databases.createDocument(
                DB_ID,
                NOTIFICATION_UID,
                ID.unique(),
                {
                    TO_UID: userPub,
                    SENDER_UID: auth.currentUser.uid,
                    SENDER_PIC: "https://a.com.br",
                    SENDER_USERNAME: "",
                    SENDER_NAME: "",
                    ACTION: type,
                    PHOTO_REL: PHOTO_REL,
                    desc: desc 

                }
            )
          

        }
        catch {
            
        }
    }


    async function checkDumpLikes() {

        try {
            // Obtenha o documento do usuário
            const user = await databases.getDocument(
                DB_UID,
                COL_UID,
                publicacaoId
            );

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
    useEffect(() => {
        if (publicacao && publicacao.email) {
            PostUserGet();
            setTimeout(() => {
                comments_of_dump();
            }, 2000);
            setTimeout(() => {
                comments_of_dump();
            }, 5000);
            setTimeout(() => {
                comments_of_dump();
            }, 8000);
            setTimeout(() => {
                comments_of_dump();
            }, 10000);
        }
    }, [publicacao]);

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

    const [toUid_Send, setTOUID] = useState(null)
    const [UserAtual, SetUserAtual] = useState(null)

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
                alert('você já curtiu a publicação')
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
            await databases.listDocuments(
                DB_UID,
                USERS_DOC,
                [Query.equal('email', publicacao.email.email)])
                .then(response => {
                    response.documents.map((e) => {
                        setTOUID(e.uid)
                    })
                })
            await databases.listDocuments(
                DB_UID,
                USERS_DOC,
                [Query.equal('email', auth.currentUser.email)])
                .then((response) => {
                    SetUserAtual(response.documents)
                })


            const uuid = require('uuid');
            await databases.createDocument(
                DB_UID,
                NOT_DOC,
                uuid.v4(),
                {
                    TO_UID: toUid_Send,
                    SENDER_UID: SENDERUID,
                    SENDER_PIC: 'https://a.com.br',
                    SENDER_USERNAME: '',
                    SENDER_NAME: '',
                    PHOTO_REL: publicacao.$id,
                    ACTION: 'like'
                }
            )


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
                console.log('Você não curtiu essa publicacao ainda.');
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
                alert('você já salvou a publicação')
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
                console.log('Você ainda não salvou esse dump.');
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



    const usergoto = async () => {
        await databases.listDocuments(
            '64f9329a26b6d59ade09',
            '64f93be88eee8bb83ec3',
        ).then((response) => {
            response.documents.filter(r => r.email == publicacao.email).map((e) => {
                setUserPub(e.$id)
            })
        }).catch((e) => {
            console.log(e)
        })
    }
    usergoto()

    function gotoUserPage() {

        window.location.href = `${window.location.origin}/user/${userPub}`


    }

    if (!publicacao) {
        return (
            <>

                <div>Carregando...</div>
            </>
        );
    }

    var datepost = new Date(publicacao.$createdAt)
    var datefilepost = `${datepost.getHours()}:${datepost.getMinutes()}:${datepost.getSeconds()} * ${datepost.toLocaleDateString()}`

    function open_options_post() {
        document.querySelector(".dump-post-options-background").style.display = 'block'
        document.querySelector(".dump-post-options").style.display = 'block'

        document.querySelector(".dump-post-show-mobile .dump-post-options-background").style.display = 'block'
        document.querySelector(".dump-post-show-mobile .dump-post-options").style.display = 'block'
    }

    function close_options_post() {
        document.querySelector(".dump-post-options ").style.display = 'none'
        document.querySelector(".dump-post-show-mobile .dump-post-options ").style.display = 'none'
    }

    function copiarlink() {
        navigator.clipboard.writeText(window.location.href);
        document.querySelector("#copylink").innerHTML = `Copiado!`
        document.querySelector(".dump-post-show-mobile #copylink").innerHTML = `Copiado!`
        setTimeout(() => {
            document.querySelector("#copylink").innerHTML = `Copiar link`
            document.querySelector(".dump-post-show-mobile #copylink").innerHTML = `Copiar link`
        }, 2000);
    }
    function compartilhar() {
        close_options_post()
        document.querySelector(".dump-post-options-compartilhar").style.display = 'block'
        document.querySelector(".compartilhar-options").style.display = 'block'

        document.querySelector(".dump-post-show-mobile .dump-post-options-compartilhar").style.display = 'block'
        document.querySelector(".dump-post-show-mobile .compartilhar-options").style.display = 'block'
    }


    function fecharcompartilhar() {
        document.querySelector(".dump-post-options-compartilhar").style.display = 'none'
        document.querySelector(".compartilhar-options").style.display = 'none'

        document.querySelector(".dump-post-show-mobile .dump-post-options-compartilhar").style.display = 'none'
        document.querySelector(".dump-post-show-mobile .compartilhar-options").style.display = 'none'
    }

    function compartilhar_whatsapp() {
        close_options_post()
        window.open(`https://api.whatsapp.com/send?phone=&text=${window.location.href}`)
    }

    function fecharbackground() {
        document.querySelector(".dump-post-options-background").style.display = 'none'
        document.querySelector(".dump-post-show-mobile .dump-post-options-background").style.display = 'none'
    }

    function closepopups() {
        fecharbackground()
        close_options_post()
        fecharcompartilhar()
    }

    function changeInfoPage() {
        document.querySelector("title").innerText = `${publicacao.displayName} | Dump`
    }
    changeInfoPage()

    async function deletepublic() {
        Swal.fire({
            title: 'Você tem certeza?',
            text: "Essa ação não poderá ser revertida.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonTextButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Sucesso!',
                    'Seu dump foi deletado com sucesso.',
                    'success'
                )
                databases.deleteDocument(
                    "64f9329a26b6d59ade09",
                    "64f93c1c40d294e4f379",
                    idPost
                ).then((e) => {
                    if (auth.currentUser) {
                        window.location.href = window.location.origin + '/user/' + auth.currentUser.uid
                    }
                })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        })
    }




    async function PostUserGet() {

        if (!publicacao || !publicacao.email) {
            console.log('Publicacao não está definida ou não tem uma propriedade "email"');
            return;
        }

        await databases.listDocuments(
            '64f9329a26b6d59ade09',
            USERSIDDATABASE
        )
            .then((res) => {
                res.documents.filter(r => r.email == publicacao.email).map((response) => {
                    setUserAt(response)
                })
            })
        await getuseratual()
    }

    async function getuseratual() {
        try {
            // Verifique se o usuário está autenticado antes de acessar sua propriedade 'email'
            const user = auth.currentUser;
            if (user) {
                // Obtenha informações do usuário
                const response = await databases.listDocuments(
                    DB_UID,
                    USERSIDDATABASE
                );
                response.documents.filter((r) => r.email === user.email).map((res) => {
                    SetUserAtual(res);
                });
            } else {
                console.log('Usuário não autenticado');
            }
        } catch (error) {
            console.error('Erro ao obter informações do usuário:', error);
        }
    }

    async function publish_comment() {
        let inputComment = document.querySelector("#comment-input")
        let inputCommentMobile = document.querySelector(".mobiletopcurrent #comment-input")


        if (inputComment.value == '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Escreva um comentário.',
            })
        }
        else {
            await databases.createDocument(
                DB_ID,
                COMMENTS_UID,
                ID.unique(),
                {
                    public_ref: idPost,
                    comment: inputComment.value,
                    DUMPID_USER: auth.currentUser.uid
                }
            )
                .then(() => {
                    Swal.fire(
                        'Sucesso!',
                        'Você comentou.',
                        'success'
                    )
                    sendNotification(idPost, 'comment' ,inputComment.value)
                    inputComment.value = ''

                })
                .catch((error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Algo deu errado!',
                    })
                })

        }



    }

    async function publish_comment_mobile() {
        let inputComment = document.querySelector("#comment-input")
        let inputCommentMobile = document.querySelector(".mobiletopcurrent #comment-input")


        if (inputCommentMobile.value == '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Escreva um comentário.',
            })
        }
        else {
            await databases.createDocument(
                DB_ID,
                COMMENTS_UID,
                ID.unique(),
                {
                    public_ref: idPost,
                    comment: inputCommentMobile.value,
                    DUMPID_USER: auth.currentUser.uid
                }
            )
                .then(() => {
                    Swal.fire(
                        'Sucesso!',
                        'Você comentou.',
                        'success'
                    )
                    sendNotification(idPost, 'comment', inputCommentMobile.value)
                    inputComment.value = ''

                })
                .catch((error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Algo deu errado!',
                    })
                })
        }

    }


    async function DeleteComment(commentToDelete) {
        await databases.deleteDocument(
            DB_ID,
            COMMENTS_UID,
            commentToDelete.$id
        )
            .then(() => {
                Swal.fire(
                    'Sucesso!',
                    'Você excluiu seu comentário.',
                    'success'
                )

            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo deu errado!',
                })
            })
        comments_of_dump()
    }

    async function comments_of_dump() {
        try {
            const res = await databases.listDocuments(
                DB_ID,
                COMMENTS_UID,
                [
                    Query.orderDesc("$createdAt")
                ]
            );


            const comments = res.documents.filter((r) => r.public_ref === idPost);

            const commentsData = [];

            for (const response of comments) {
                const user = await databases.getDocument(DB_ID, USERS_UID, response.DUMPID_USER);
                commentsData.push({ response, user });
            }

            setcomments_length(commentsData.length)

            return commentsData;
        } catch (error) {
            console.error('Erro ao buscar comentários:', error);
            return [];
        }

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



    function CommentComponent({ commentData }) {
        const { response, user } = commentData;

        const handleDeleteClick = () => {
            DeleteComment(response); // Passa o objeto de comentário para a função de exclusão
        };

        if (user) {
            let date = new Date(response.$createdAt)
            return (
                <div className="comment-dump-user">
                    <div className="left-side-content-user">
                        <img alt="Avatar Usuário" src={user.photoURL} />
                    </div>
                    <div className="right-side-comment-content">
                        <div className="top-right-side-user">
                            <h2>{user.displayName} {user.isthisverifiqued == 'true' ? <><i alt="CONTA VERIFICADA" title='Verificado' className="fa-solid fa-circle-check fa-fade verifyaccount" ></i></> : <></>}</h2>
                        </div>
                        <div className="middle-right-side-comment">
                            <p>{response.comment}</p>
                        </div>
                        <div className="bottom-right-side-comment">
                            <label>{date.getDate() + " de " + MesesDoAno[date.getMonth()]}</label>
                            {auth.currentUser ?
                                <>
                                    {user.uid == auth.currentUser.uid ?
                                        <label onClick={handleDeleteClick}>Excluir</label>
                                        :
                                        ""}
                                </>
                                :
                                ""
                            }
                        </div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
    function errorsemuser() {
        alert('Entre para curtir e salvar fotos.')
    }



    return (

        <>
            <>
                <div className="dump-post-show-pc">
                    <div className="dump-post-options-background"></div>
                    <div className="dump-post-show">
                        <div className="dump-post-show">
                            <HeaderFeed />
                            <div className="dump-post-options">
                                <div className="select-post-options">
                                    <a onClick={compartilhar}>Compartilhar</a>
                                </div>
                                <div className="select-post-options">
                                    <a id="copylink" onClick={copiarlink}>Copiar link</a>
                                </div>
                                <div className="select-post-options">
                                    <a onClick={closepopups} id="cancel">Fechar</a>
                                </div>
                            </div>
                            <div className="compartilhar-options">
                                <div className="dump-post-options-compartilhar">
                                    <h4>Compartilhar:</h4>
                                    <div className="select-post-options">
                                        <button id="whatsapp-btn" onClick={compartilhar_whatsapp}><i className="fa-brands fa-whatsapp"></i> WhatsApp</button>
                                    </div>
                                    <div className="select-post-options">
                                        <a onClick={closepopups} id="cancel">Cancelar</a>
                                    </div>
                                </div>
                            </div>

                            <div className="dump-post-img-inner">
                                <div className="flex-dump-info-image">
                                    <div className="info-user-dump-post">
                                        {USER_DOC && USER_DOC.displayName ? <>
                                            <a className="flexbox-dump-btn" href={window.location.origin + '/user/' + USER_DOC.$id}>
                                                <div className="dump-top-info-user">

                                                    <div className="dump-leftside-info-user">
                                                        <img src={USER_DOC.photoURL} />
                                                        <div className="rightside_user_information">
                                                            <h1>{USER_DOC.displayName} {USER_DOC.isthisverifiqued == 'true' ? <><i alt="CONTA VERIFICADA" title='Verificado' className="fa-solid fa-circle-check fa-fade verifyaccount" ></i></> : <></>}</h1>
                                                            <p>@{USER_DOC.username}</p>
                                                        </div>
                                                    </div>
                                                    <div className="button-right-side">
                                                        <button onClick={open_options_post}><i className="fa-solid fa-ellipsis"></i></button>
                                                    </div>

                                                </div>
                                            </a>
                                        </> : <></>}


                                        <div className="bottom-desc">
                                            {USER_DOC && USER_DOC.displayName ? <p>{publicacao.legenda}</p> : ''}
                                        </div>
                                    </div>
                                </div>
                                <div className="dump-post-topimage">
                                    <img src={publicacao.filePost} />
                                </div>
                                <label className="time-display-dump">{datefilepost}</label>
                                <div className="dump-post-middle-bottom-img">

                                    {UserAtual ?
                                        <div className="btns-inner">
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
                                        </div>
                                        :
                                        <div className="btns-inner">
                                            <div className='dump-like-action-button'>
                                                <button alt="Curtir" onClick={errorsemuser}><i className="fa-regular fa-heart"></i> </button>
                                                <p>{NumberOfLikes}</p>
                                            </div>
                                            <button onClick={errorsemuser}><i className="fa-regular fa-bookmark"></i></button>
                                        </div>
                                    }

                                    <div className="button-remove">
                                        {auth.currentUser ?
                                            publicacao.email == auth.currentUser.email ?
                                                <button onClick={deletepublic}>EXCLUIR</button>
                                                :
                                                ''
                                            :
                                            ''}
                                    </div>

                                    <section className="comments-section">
                                        <h2>{comments_length <= 0 ?
                                            "Nenhum comentário"
                                            :
                                            `Comentários(${comments_length})`
                                        }</h2>
                                        <div className="top-dump-user-current">
                                            {UserAtual ?
                                                <>
                                                    <div className="left-side-dump-current">
                                                        <img src={UserAtual.photoURL} />
                                                        <input id="comment-input" placeholder="Escreva seu comentário"></input>
                                                    </div>
                                                    <div className="right-side-dump-current">

                                                        <button onClick={publish_comment}>COMENTAR</button>
                                                    </div>
                                                </>
                                                : ''}

                                        </div>

                                        <div className="comments-of-dump">
                                            {Comments_Dump.map((commentData, index) => (
                                                <CommentComponent
                                                    key={index}
                                                    commentData={commentData}
                                                />
                                            ))}
                                        </div>
                                    </section>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
                <div className="dump-post-show-mobile">
                    <div onClick={closepopups} className="dump-post-options-background"></div>
                    <div className="dump-post-show">
                        <HeaderFeed />
                        <div className="dump-post-options">
                            <div className="select-post-options">
                                <a onClick={compartilhar}>Compartilhar</a>
                            </div>
                            <div className="select-post-options">
                                <a id="copylink" onClick={copiarlink}>Copiar link</a>
                            </div>
                            <div className="select-post-options">
                                <a onClick={closepopups} id="cancel">Fechar</a>
                            </div>
                        </div>
                        <div className="compartilhar-options">
                            <div className="dump-post-options-compartilhar">
                                <h4>Compartilhar:</h4>
                                <div className="select-post-options">
                                    <button id="whatsapp-btn" onClick={compartilhar_whatsapp}><i className="fa-brands fa-whatsapp"></i> WhatsApp</button>
                                </div>
                                <div className="select-post-options">
                                    <a onClick={closepopups} id="cancel">Cancelar</a>
                                </div>
                            </div>
                        </div>
                        <div className="dump-post-img-inner">
                            <div className="dump-post-topimage">
                                <img src={publicacao.filePost} />
                            </div>
                            <div className="dump-post-middle-bottom-img">
                                <div className="flex-dump-info-image">
                                    <div className="info-user-dump-post">
                                        {USER_DOC && USER_DOC.displayName ? <>
                                            <div className="dump-top-info-user">
                                                <a href={window.location.origin + '/user/' + USER_DOC.$id}>
                                                    <img src={USER_DOC.photoURL} />
                                                    <div className="rightside_user_information">
                                                        <h1>{USER_DOC.displayName} {USER_DOC.isthisverifiqued == 'true' ? <><i alt="CONTA VERIFICADA" title='Verificado' className="fa-solid fa-circle-check fa-fade verifyaccount" ></i></> : <></>}</h1>
                                                        <p>@{USER_DOC.username}</p>
                                                    </div>
                                                </a>
                                            </div>
                                        </> : <></>}
                                        <label className="time-display-dump">{datefilepost}</label>
                                    </div>
                                </div>
                                <div className="bottom-desc">
                                    <p>{publicacao.legenda}</p>
                                </div>
                                <div className="btns-inner">
                                    {auth.currentUser ?
                                        <>
                                            {isLiked ?
                                                <>
                                                    <button></button>
                                                    <div className='dump-like-action-button'>
                                                        <button className="dump-post-liked" alt="Descurtir" onClick={unlikethisphoto}><i className="fa-solid fa-heart"></i> {NumberOfLikes}</button>

                                                    </div>

                                                </>
                                                :
                                                <>
                                                    <div className='dump-like-action-button'>
                                                        <button alt="Curtir" onClick={likethepost}><i className="fa-regular fa-heart"></i> {NumberOfLikes}</button>

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
                                                <button alt="Curtir" onClick={errorsemuser}><i className="fa-regular fa-heart"></i> {NumberOfLikes}</button>
                                                <p>{NumberOfLikes}</p>
                                            </div>
                                            <button onClick={errorsemuser}><i className="fa-regular fa-bookmark"></i></button>
                                        </>
                                    }

                                </div>
                                <div className="button-remove">
                                    {auth.currentUser ?
                                        publicacao.email == auth.currentUser.email ?
                                            <button onClick={deletepublic}>EXCLUIR</button>
                                            :
                                            ''
                                        :
                                        ''}
                                </div>
                                <section className="comments-section">
                                    <h2>{comments_length <= 0 ?
                                        "Nenhum comentário"
                                        :
                                        `Comentários(${comments_length})`
                                    }</h2>
                                    <div className="top-dump-user-current mobiletopcurrent">
                                        {UserAtual ?
                                            <>
                                                <div className="left-side-dump-current">
                                                    <img src={UserAtual.photoURL} />
                                                    <input id="comment-input" placeholder="Escreva seu comentário"></input>
                                                </div>
                                                <div className="right-side-dump-current">

                                                    <button onClick={publish_comment_mobile}>COMENTAR</button>
                                                </div>
                                            </>
                                            : ''}

                                    </div>

                                    <div className="comments-of-dump">
                                        {Comments_Dump.map((commentData, index) => (
                                            <CommentComponent
                                                key={index}
                                                commentData={commentData}
                                            />
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>

                    </div>
                </div>
                <Suggestions />
            </>
        </>
    );
}