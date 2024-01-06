import { useEffect, useState } from "react";
import Header from "../components/Header";

import { Link, useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { databases } from "../lib/appwrite";
import { ID, Query } from "appwrite";
import HeaderAccount from "../components/HeaderAccount";
import { auth, provider, signInWithPopup } from "../lib/firebase";
import { Ring } from '@uiball/loaders'
import Swal from 'sweetalert2'
import HeaderFeed from "../components/pages/feed/HeaderApp";
import Suggestions from "../components/pages/feed/Suggestions";



export default function Account() {
    const { ID_ACCOUNT } = useParams();
    const [nofposts, setNumberofPosts] = useState()
    const [numberofFollowers, SetNumberOfFollowers] = useState(null)
    const [numberofFollowing, SetNumberOfFollowing] = useState(null)
    const [ID_ACCOUNT_I, SetAccount] = useState(null)
    const [USERS_POSTS, setPostsofUser] = useState('')
    const [USERS_DREAMS, setUSERS_DREAMS] = useState('')
    const userUID = auth.currentUser
    const [isFollowing, setIsFollow] = useState(null)
    const [requestSended, setrequestSended] = useState(false)
    const [listofFollowers, setListOfFollowers] = useState("")
    const [diadecriacao, setdiadecriacao] = useState(null)

    const [followersContent, setfollowersContent] = useState(null)
    const [followersBox, setfollowersBox] = useState(false)

    const [followingContent, setfollowingContent] = useState(null)
    const [followingBox, setfollowingBox] = useState(false)

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


    let Data
    useEffect(() => {

        databases.getDocument(
            "64f9329a26b6d59ade09",
            "64f93be88eee8bb83ec3",
            ID_ACCOUNT
        )
            .then((response) => {
                SetAccount(response)
                Data = new Date(response.$createdAt)
                let Mes = Data.getMonth()
                let Dia = Data.getDate()
                let year = Data.getFullYear()
                setdiadecriacao(`${Dia} de ${MesesDoAno[Mes]} de ${year}`)
            })
            .catch((e) => {
                console.log(e)
            })


    }, [ID_ACCOUNT])

    useEffect(() => {
        checkIfFollowsUser()
    })

    useEffect(() => {
        if (ID_ACCOUNT_I && ID_ACCOUNT_I.following && ID_ACCOUNT_I.followers) {
            SetNumberOfFollowers(ID_ACCOUNT_I.followers.length)
            SetNumberOfFollowing(ID_ACCOUNT_I.following.length)
        }
    })

    useEffect(() => {

        const getPostsofUser = async () => {
            await databases.listDocuments(
                "64f9329a26b6d59ade09",
                '64f93c1c40d294e4f379',
                [Query.limit(150),
                Query.orderDesc("$createdAt")])

                .catch((e) => {
                    console.log(e)
                }
                )

                .then((res) => {
                    if (!res.documents) {
                        return <>NADA ENCONTADO</>
                    }
                    const nofpots = res.documents.filter(r => r.email == ID_ACCOUNT_I.email).length
                    setNumberofPosts(nofpots)

                    setPostsofUser(res.documents.filter(r => r.email == ID_ACCOUNT_I.email).map((u, i) => {

                        return (
                            <>
                                <article title={`${u.legenda}`} className="dump-user-account" id={u.$id} tabIndex={0} role="article">
                                    <Link to={window.location.origin + "/posts/" + u.$id}>
                                        <img className="dump-image-show" alt={u.legenda} id={`D${i}Pid_` + u.$id} src={u.filePost} />
                                    </Link>
                                </article>
                            </>
                        )
                    }))
                })
                .catch((e) => {
                    console.log(e)
                })
            await databases.listDocuments(
                "64f9329a26b6d59ade09",
                "6598d0374c841ff2ed4e",
                [
                    Query.orderDesc("$createdAt"),
                    Query.equal("createdBy", ID_ACCOUNT)
                ]
            )
                .then((res) => {
                    setUSERS_DREAMS(res.documents.map((dream) => {
                        return (
                            <>
                                <article title={`${dream.legenda}`} className="dump-user-account dump-dream-show" id={dream.$id} tabIndex={0} role="article">
                                    <Link to={window.location.origin + "/dream/" + dream.$id}>
                                        <video paused className="dump-image-show" alt={dream.legenda} id={`DPid_` + dream.$id} src={dream.dreamURL} />
                                    </Link>
                                </article>
                            </>
                        )
                    }))
                })
        }
        getPostsofUser()
    }, [ID_ACCOUNT_I])
    let Nav = useNavigate();

    const Gotomentions = () => {

        Nav("/user/" + ID_ACCOUNT + "/mentions");
    };

    const gotoDreams = () => {
        Nav("/user/" + ID_ACCOUNT + '/dreams')
    }



    const [i_ison, setUserOn] = useState('')


    useEffect(() => {
        auth.onAuthStateChanged(function (u) {
            setUserOn(u)
        })
    }, [])

    function ButtonActionProfile() {
        checkIfFollowsUser()
    }


    if (!ID_ACCOUNT_I) {
        return (
            <>


                <Suggestions />
                <div className="loading-inner">
                    <Ring
                        size={40}
                        lineWeight={5}
                        speed={2}
                        color="black"
                    />
                </div>
            </>
        );
    }

    function changeInfoPage() {
        document.querySelector("title").innerText = `${ID_ACCOUNT_I.displayName} (@${ID_ACCOUNT_I.username}) | Dump`
    }
    changeInfoPage()

    function backtoprofile() {
        Nav("/user/" + ID_ACCOUNT);
    }

    let targetUserId

    if (auth.currentUser) {
        targetUserId = auth.currentUser.uid;
    }




    const userId = ID_ACCOUNT_I.uid;

    const userDocument = databases.getDocument('64f9329a26b6d59ade09', '64f93be88eee8bb83ec3', userId);

    const followers = userDocument.followers || [];

    const DB_UID = '64f9329a26b6d59ade09'
    const COL_UID = '64f93be88eee8bb83ec3'

    async function checkIfFollowsUser() {

        try {



            // Obtenha o documento do usuário
            const user = await databases.getDocument(
                DB_UID,
                COL_UID,
                userId);

            setListOfFollowers(user.followers)

            if (user.private) {
                const docReq = await databases.listDocuments(
                    "64f9329a26b6d59ade09",
                    "6596b4a3d1273755e5b7",
                    [
                        Query.equal("sender_request", targetUserId),
                        Query.equal("to_uid", userId)
                    ]
                )

                if (docReq.documents.length > 0) {
                    console.log(docReq.documents)
                    return setrequestSended(true)
                }
            }

            if (!user) {
                document.querySelector(".loading-btn").style.display = 'block'
            }

            const followers = user.followers || [];

            if (followers.includes(targetUserId)) {

                setIsFollow(true)
                return true;
            } else {

                setIsFollow(false)
                return false;
            }
        } catch (error) {
            setIsFollow(false)
            console.log(error)
            return false;
        }
    }

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
                    ACTION: "follow",
                    PHOTO_REL: 'asdasdasds',
                    desc: ''

                }
            )


        }
        catch {

        }
    }

    async function requestFollow(a, b) {
        try {
            await databases.createDocument(
                "64f9329a26b6d59ade09",
                "6596b4a3d1273755e5b7",
                ID.unique(),
                {
                    sender_request: b,
                    to_uid: a
                }
            )
        }
        catch (error) {
            console.log(error)
        }
    }

    // Função para verificar se um usuário segue outro
    async function followUser() {
        function esconderbotoes() {
            document.querySelector(".btns-links button").style.display = 'none'
            document.querySelector(".loading-btn").style.display = 'block'
        }
        function voltarbotoes() {
            document.querySelector(".btns-links button").style.display = 'block'
            document.querySelector(".loading-btn").style.display = 'none'
        }

        esconderbotoes()

        try {



            /** ADICIONAR SEGUIDOR PARA O USUÁRIO */
            const userDocument = await databases.getDocument(
                '64f9329a26b6d59ade09',
                '64f93be88eee8bb83ec3',
                userId);

            const followers = userDocument.followers || [];

            if (followers.includes(targetUserId)) {
                alert('Você já está seguindo')
                voltarbotoes()
                return;
            }

            if (ID_ACCOUNT_I.private) {
                await requestFollow(ID_ACCOUNT_I.$id, targetUserId)
                voltarbotoes()
                return checkIfFollowsUser()
            }

            followers.push(targetUserId);

            await databases.updateDocument(
                '64f9329a26b6d59ade09',
                '64f93be88eee8bb83ec3',
                userId, {
                followers: followers,
            });

            /** ADICIONAR SEGUINDO PARA O ATUAL USUÁRIO */

            const userDocumentATUAL = await databases.getDocument(
                '64f9329a26b6d59ade09',
                '64f93be88eee8bb83ec3',
                targetUserId);

            const following = userDocumentATUAL.following || [];

            if (following.includes(userId)) {
                alert('Você já está seguindo')
                voltarbotoes()
                return;
            }

            following.push(userId);

            await databases.updateDocument('64f9329a26b6d59ade09',
                '64f93be88eee8bb83ec3',
                targetUserId, {
                following: following,
            });

            ButtonActionProfile()
            sendNotification('', ID_ACCOUNT)

            // ENVIAR NOTIFICAÇÃO SEGUINDO PARA USUÁRIO



            checkIfFollowsUser()
            SetNumberOfFollowers(Number(numberofFollowers) + 1);

            voltarbotoes()
        } catch (error) {
            console.error('Erro ao seguir o usuário:', error);
        }
    } // Substitua pelo ID do usuário autenticado

    // Função para parar de seguir um usuário
    async function unfollowUser() {
        function esconderbotoes() {
            document.querySelector(".btns-links button").style.display = 'none'
            document.querySelector(".loading-btn").style.display = 'block'
        }
        function voltarbotoes() {
            document.querySelector(".btns-links button").style.display = 'block'
            document.querySelector(".loading-btn").style.display = 'none'
        }

        esconderbotoes()
        try {
            //REMOVER SEGUIDOR DO USUÁRIO SELECIONADO

            const userDocument = await databases.getDocument('64f9329a26b6d59ade09', '64f93be88eee8bb83ec3', userId);

            const followers = userDocument.followers || [];

            if (!followers.includes(targetUserId)) {
                console.log('Você não está seguindo este usuário.');
                voltarbotoes()
                return;
            }



            const updatedFollowers = followers.filter((id) => id !== targetUserId);

            await databases.updateDocument(
                '64f9329a26b6d59ade09',
                '64f93be88eee8bb83ec3',
                userId, {
                followers: updatedFollowers,
            });

            //REMOVER SEGUINDO DO USUARIO ATUAL

            const userDocumentATUAL = await databases.getDocument('64f9329a26b6d59ade09',
                '64f93be88eee8bb83ec3',
                targetUserId);

            const following = userDocumentATUAL.following || [];

            if (!following.includes(userId)) {
                console.log('Você não está seguindo este usuário.');
                voltarbotoes()
                return;
            }

            const updatedFollowing = following.filter((id) => id !== userId);

            await databases.updateDocument(
                '64f9329a26b6d59ade09',
                '64f93be88eee8bb83ec3',
                targetUserId, {
                following: updatedFollowing,
            });

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Você parou de seguir.',
                showConfirmButton: false,
                timer: 1500
            })


            voltarbotoes()
            SetNumberOfFollowers(numberofFollowers - 1);
            ButtonActionProfile()
        } catch (error) {
            console.error('Erro ao parar de seguir o usuário:', error);
        }
    }


    function editmyprofile_btn() {

        Nav("/accounts/edit");
    }

    async function openseguidorescard() {
        setfollowersContent(null)
        setfollowersBox(true)
        try {
            const fetchLikesData = async () => {
                const followers = await Promise.all(
                    ID_ACCOUNT_I.followers.map((e) =>
                        databases.getDocument("64f9329a26b6d59ade09", "64f93be88eee8bb83ec3", e)
                    )
                );

                setfollowersContent(
                    followers.reverse().map((r) => (
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
        catch (error) {
            console.log(error)
        }
    }

    async function openseguindocard() {
        setfollowingContent(null)
        setfollowingBox(true)
        try {
            const fetchLikesData = async () => {
                const following = await Promise.all(
                    ID_ACCOUNT_I.following.map((e) =>
                        databases.getDocument("64f9329a26b6d59ade09", "64f93be88eee8bb83ec3", e)
                    )
                );

                setfollowingContent(
                    following.reverse().map((r) => (
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
        catch (error) {
            console.log(error)
        }
    }

    function closeimageprofile() {
        document.querySelector(".photosizePLUS").style.display = 'none'
        document.querySelector(".BACKGROUND-CLOSE").style.display = 'none'
    }

    function openphotoprofile() {
        document.querySelector(".photosizePLUS").style.display = 'block'
        document.querySelector(".BACKGROUND-CLOSE").style.display = 'block'
    }


    if (!navigator.onLine) {
        return (
            <section aria-label="Timeline da página inicial" tabindex="0" role="main" className="App-Feed feedposts dark-mode">
                <main className="dump-feed-posts">
                    <div className="NoFeedShow-Wrapper WifiNoConexion">
                        <div className="ImageContent">
                            <svg xmlns="http://www.w3.org/2000/svg" width="51" height="55" viewBox="0 0 51 55" fill="none">
                                <g clip-path="url(#clip0_178_5)">
                                    <path d="M39.2076 54.3006L16.4226 53.6543C16.4226 53.6543 18.1376 43.4112 12.635 40.5687C8.88452 38.6297 5.5559 29.5732 6.50279 23.4106C6.51568 23.3286 6.52856 23.2466 6.54305 23.1663C7.02294 20.4073 8.39497 18.2706 11.0182 17.6902C19.4984 15.8156 25.5501 17.269 25.5501 17.269C25.5501 17.269 26.9512 17.2867 29.0269 17.6757C29.101 17.6886 29.1751 17.7031 29.2491 17.7191C35.1253 18.8687 45.9872 22.9621 46.4574 37.4963C47.1048 57.4647 39.2076 54.2974 39.2076 54.2974V54.3006Z" fill="#3F3D56" />
                                    <path d="M29.027 17.6774C28.9883 18.7192 28.7516 19.7546 28.32 20.7386C27.4247 22.7788 25.7918 24.3367 23.7241 25.1262C17.5306 27.4928 10.3033 25.1455 6.64781 22.6004C6.63331 22.6808 6.34345 24.2065 6.33057 24.2885C7.94898 25.3947 15.8703 26.4606 17.3728 26.4606C19.6547 26.4606 21.8512 26.0828 23.8046 25.3352C25.9286 24.5232 27.605 22.9219 28.5246 20.827C28.9642 19.827 29.2057 18.7771 29.2492 17.7192C29.1751 17.7031 29.1011 17.6886 29.027 17.6758V17.6774Z" fill="#6C63FF" />
                                    <path d="M30.7114 19.0038L27.08 9.88613C27.08 9.88613 31.4392 2.42611 28.014 1.59811C24.5888 0.768502 21.0605 5.22362 21.0605 5.22362C21.0605 5.22362 14.5224 2.94381 12.0328 4.80881C12.0328 4.80881 7.88127 -0.993608 5.39165 0.146297C2.90043 1.2862 6.27735 9.50027 6.27735 9.50027C6.27735 9.50027 1.13708 17.0342 5.08086 21.3849C9.02463 25.7371 23.8641 29.2597 30.713 19.0022L30.7114 19.0038Z" fill="#3F3D56" />
                                    <path d="M-50.839 54.0337H92V53.7122H-50.839C-50.9275 53.7122 -51 53.7845 -51 53.8729C-51 53.9614 -50.9275 54.0337 -50.839 54.0337Z" fill="#3F3D56" />
                                    <path d="M38.5007 48.8439C39.7374 49.3938 41.0289 49.9533 42.3816 49.9002C43.7343 49.8472 45.1563 48.9774 45.3672 47.6429C45.4767 46.9532 45.2609 46.2152 45.525 45.5689C45.8809 44.7007 47.0275 44.3647 47.918 44.6621C48.8102 44.9596 49.464 45.7281 49.9342 46.54C50.8135 48.0609 51.1645 50.0578 50.2225 51.5401C49.406 52.8247 47.8568 53.4068 46.4172 53.9052C44.4976 54.5692 42.3559 55.2267 40.4959 54.4116C38.6263 53.5916 37.6069 51.2234 38.2994 49.3053" fill="#3F3D56" />
                                    <path d="M18.0426 14.9056C18.0426 14.9056 15.8074 14.0133 14.3564 15.1291L16.0328 17.695L18.0442 14.9072L18.0426 14.9056Z" fill="#6C63FF" />
                                    <path d="M6.31104 26.6166L10.4448 48.5915C10.4448 48.5915 4.18858 54.9502 12.2323 54.8377C20.2761 54.7267 17.9298 50.5996 17.9298 50.5996L15.3596 31.5251" fill="#3F3D56" />
                                    <path d="M12.0295 54.9999C9.85073 54.9999 8.53346 54.5015 8.11154 53.516C7.3434 51.7217 9.84429 48.9869 10.2726 48.5367L7.49316 32.1086L7.81041 32.0555L10.6173 48.6445L10.5593 48.7023C10.5303 48.7313 7.6703 51.6687 8.40785 53.389C8.78628 54.2732 10.0697 54.7057 12.2308 54.6752C15.2342 54.6334 17.1698 54.0047 17.8301 52.8584C18.4243 51.8262 17.7963 50.6879 17.7898 50.6767L17.7753 50.6493L17.7705 50.6188L15.983 37.3451L16.3018 37.3017L18.0861 50.5464C18.1924 50.7474 18.748 51.9066 18.1119 53.016C17.3824 54.2861 15.4049 54.9533 12.2357 54.9967C12.1664 54.9967 12.0988 54.9967 12.0312 54.9967L12.0295 54.9999Z" fill="#2F2E41" />
                                    <path d="M16.8125 26.6166L20.9463 48.5915C20.9463 48.5915 14.69 54.9502 22.7338 54.8377C30.7775 54.7267 28.4312 50.5996 28.4312 50.5996L25.8611 31.5251" fill="#3F3D56" />
                                    <path d="M22.5306 55.0001C20.3518 55.0001 19.0345 54.5016 18.6126 53.5161C17.8445 51.725 20.3405 48.9934 20.7721 48.5385L19.1118 39.6958L19.4291 39.6363L21.1199 48.643L21.0604 48.7024C21.0314 48.7314 18.1714 51.6688 18.9089 53.3891C19.2874 54.2733 20.5724 54.7074 22.7319 54.6753C25.7368 54.6335 27.6741 54.0049 28.3327 52.8553C28.927 51.8199 28.2973 50.688 28.2909 50.6768L28.2748 50.6494L25.7014 31.5444L26.0203 31.501L28.5856 50.5466C28.6919 50.7475 29.2474 51.9067 28.6113 53.0161C27.8818 54.2862 25.9043 54.9534 22.7351 54.9968C22.6659 54.9968 22.5983 54.9968 22.5306 54.9968V55.0001Z" fill="#2F2E41" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_178_5">
                                        <rect width="51" height="55" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <h2>Falha na conexão!</h2>
                        <p>Ocorreu um erro relacionado com a sua conexão. Tente novamente mais tarde.</p>
                        <button className="ButtonToSearch" onClick={() => window.location.reload()}><span>Recarregar página</span></button>
                    </div>
                    {/* <LoadingContent /> */}

                </main>
                <Suggestions />

            </section>
        )

    }

    return (
        <>
            <Suggestions />
            {followersBox ?
                <div className='Dump-Likes-Post-ShowBox'>
                    <div onClick={() => setfollowersBox(false)} className='backgroundCurtidas'></div>
                    <div className='Dump-Likes-Header-Box'>
                        <div className='HeaderLeft'>
                            <h2>Seguidores</h2>
                        </div>
                        <div className='ButtonCloseLikes'>
                            <button onClick={() => { setfollowersBox(false) }}><span><i className="fa-solid fa-xmark"></i></span></button>
                        </div>
                    </div>
                    {followersContent != '' ?
                        <>

                            <div className='Card-Suggestions-Users'>
                                {followersContent}
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
            {followingBox ?
                <div className='Dump-Likes-Post-ShowBox'>
                    <div onClick={() => { setfollowingBox(false); }} className='backgroundCurtidas'></div>
                    <div className='Dump-Likes-Header-Box'>
                        <div className='HeaderLeft'>
                            <h2>Seguindo</h2>
                        </div>
                        <div className='ButtonCloseLikes'>
                            <button onClick={() => { setfollowingBox(false); }}><span><i className="fa-solid fa-xmark"></i></span></button>
                        </div>
                    </div>
                    {followingContent != '' ?
                        <>

                            <div className='Card-Suggestions-Users'>
                                {followingContent}
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
            <div className="photosizePLUS">
                {ID_ACCOUNT_I ?
                    <img alt={`Foto de perfil de @${ID_ACCOUNT_I.username}`} src={ID_ACCOUNT_I.photoURL} />
                    :
                    <div className="imageNull">
                        <svg width="304" height="304" viewBox="0 0 304 304" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="304" height="304" fill="#D4D4D4" />
                            <path d="M266.816 304C266.816 278.274 270.14 253.602 248.556 235.411C226.973 217.22 182.25 207 151.726 207C121.203 207 74.2665 217.22 52.683 235.411C31.0996 253.602 36.6367 278.274 36.6367 304L151.726 304H266.816Z" fill="white" />
                            <circle cx="151.5" cy="128.5" r="78.5" fill="white" />
                        </svg>
                    </div>
                }
            </div>
            <div className="BACKGROUND-CLOSE" onClick={closeimageprofile}>
                <div className="button-close-profile-image">
                    <button onClick={closeimageprofile}><i className="fa-solid fa-chevron-left"></i></button>
                </div>
            </div>
            <div className="dump-account-page">


                <div className="dump-account-background">

                </div>
                <header className="dump-account-infos">

                    <div className="top-account">

                        <div className="leftside-account">
                            <img onClick={openphotoprofile} src={ID_ACCOUNT_I.photoURL} />
                            <div className="account-details">
                                <h1>{ID_ACCOUNT_I.displayName} {ID_ACCOUNT_I.isthisverifiqued == 'true' ? <><i alt="CONTA VERIFICADA" title='Verificado' className="fa-solid fa-circle-check fa-fade verifyaccount" ></i></> : <></>}</h1>
                                <p>@{ID_ACCOUNT_I.username}</p>
                            </div>
                        </div>
                        <div className="rightside-account">
                            <div className="btns-links">
                                {auth.currentUser ?
                                    <>
                                        {userUID && userUID.uid == ID_ACCOUNT_I.uid ?
                                            <button onClick={editmyprofile_btn}>EDITAR PERFIL</button>
                                            :
                                            <>
                                                {requestSended ?
                                                    <button title='Seguindo' id="following-user">Solicitação pendente <i className="fa-solid fa-user-check"></i></button>
                                                    :
                                                    <>
                                                        {isFollowing ?
                                                            <>
                                                                <button title='Seguindo' onClick={unfollowUser} id="following-user">Seguindo <i className="fa-solid fa-user-check"></i></button>

                                                            </>
                                                            :
                                                            <>
                                                                <button title='Seguir' onClick={followUser}>Seguir</button>

                                                            </>
                                                        }

                                                    </>
                                                }
                                            </>

                                        }
                                        <button className="loading-btn">
                                            <Ring
                                                size={35}
                                                lineWeight={5}
                                                speed={2}
                                                color="black"
                                            />
                                        </button>



                                    </>
                                    :
                                    <></>}
                            </div>
                            <div className="followers-card">
                                <p onClick={openseguidorescard}>{numberofFollowers} seguidores</p>
                                <p onClick={openseguindocard}>{numberofFollowing} seguindo</p>
                                <p>{nofposts} dumps</p>
                            </div>
                            <div className="followers-card-show-users">
                                <header className="header-seguidores">
                                    <div className="text-header-dump">
                                        <h2>Seguidores de @{ID_ACCOUNT_I.username}</h2>
                                    </div>
                                </header>
                                <div className="list-of-followers">
                                    {/*

                                        (listofFollowers).map((item => {
                                            databases.getDocument(
                                                "64f9329a26b6d59ade09",
                                                '64f93be88eee8bb83ec3',
                                                item
                                            ).then((e) => {
                                                return (
                                                    <div className="follower-dump-user">
                                                        <img src={e.photoURL} />
                                                        <h2>{e.displayName}</h2>
                                                        <p>@{e.username}</p>
                                                    </div>
                                                )
                                            })
                                        }))
                                    */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="middle-account-top">
                        <p>{ID_ACCOUNT_I.bio}</p>
                        <Link className="link_above" to={ID_ACCOUNT_I.link_above} target="_blank">{ID_ACCOUNT_I.link_above}</Link>
                    </div>
                    <div className="middle-bottom-account-top">

                        <p><i className="fa-solid fa-calendar-days"></i> Entrou em {diadecriacao}</p>
                    </div>
                </header>
                <div className="dumps-of-user">
                    <section className="selecttypeofpublic">
                        {window.location.pathname == `/user/${ID_ACCOUNT_I.uid}/mentions` ?

                            <>
                                <label onClick={backtoprofile}><i className="fa-regular fa-image"></i> Dumps</label>
                                <label onClick={gotoDreams}><i className="fa-solid fa-tv"></i> Dreams</label>
                                <label id="selected"><i className="fa-solid fa-quote-left"></i> Menções</label>
                            </>
                            :
                            <>{window.location.pathname == `/user/${ID_ACCOUNT_I.uid}` ?
                                <>
                                    <label id="selected"><i className="fa-regular fa-image"></i> Dumps</label>
                                    <label onClick={gotoDreams}><i className="fa-solid fa-tv"></i> Dreams</label>
                                    <label onClick={Gotomentions}><i className="fa-solid fa-quote-left"></i> Menções</label>
                                </>
                                :
                                <>
                                    <label onClick={backtoprofile}><i className="fa-regular fa-image"></i> Dumps</label>
                                    <label id="selected" onClick={gotoDreams}><i className="fa-solid fa-tv"></i> Dreams</label>
                                    <label onClick={Gotomentions}><i className="fa-solid fa-quote-left"></i> Menções</label>
                                </>
                            }</>
                        }
                    </section>


                    {(window.location.href).includes("/mentions") ?
                        <section className="dumps-account-user-show">
                            {ID_ACCOUNT_I && ID_ACCOUNT_I.private == true ?
                                <>{ID_ACCOUNT_I.private == true && auth.currentUser && auth.currentUser.uid === ID_ACCOUNT_I.uid || (ID_ACCOUNT_I.followers && ID_ACCOUNT_I.followers.includes(targetUserId)) ?
                                    <>
                                        <div className="null-mentions-of-user">
                                            <img alt="Menções" draggable="false" src="/static/media/undraw_mention_re_k5xc.svg" />
                                            <h1>Nada por aqui...</h1>
                                            <p>Aqui apareceram as menções de {ID_ACCOUNT_I.displayName}</p>
                                        </div>
                                    </>
                                    :
                                    <div className="private-account">
                                        <i className="fa-solid fa-lock"></i>
                                        <p>
                                            Conta privada
                                        </p>
                                        <p>Para acessar as menções, siga @{ID_ACCOUNT_I.username}.</p>
                                    </div>

                                }</>
                                :
                                <>
                                    <div className="null-mentions-of-user">
                                        <img alt="Menções" draggable="false" src="/static/media/undraw_mention_re_k5xc.svg" />
                                        <h1>Nada por aqui...</h1>
                                        <p>Aqui apareceram as menções de {ID_ACCOUNT_I.displayName}</p>
                                    </div>
                                </>
                            }

                        </section>
                        :
                        <>
                            {(window.location.href).includes("/dreams") ?
                                <section className="dumps-account-user-show">
                                    {ID_ACCOUNT_I && ID_ACCOUNT_I.private == true ?
                                        <>{ID_ACCOUNT_I.private == true && auth.currentUser && auth.currentUser.uid === ID_ACCOUNT_I.uid || (ID_ACCOUNT_I.followers && ID_ACCOUNT_I.followers.includes(targetUserId)) ?
                                            <>
                                                <label id="youraccountislocked">Sua conta está privada.</label>
                                            </>
                                            :
                                            <div className="private-account">
                                                <i className="fa-solid fa-lock"></i>
                                                <p>
                                                    Conta privada
                                                </p>
                                                <p>Para acessar os dreams, siga @{ID_ACCOUNT_I.username}.</p>
                                            </div>

                                        }</>
                                        :
                                        <>
                                            {ID_ACCOUNT_I && ID_ACCOUNT_I.private == true ?
                                                <>{ID_ACCOUNT_I.private == true && auth.currentUser && auth.currentUser.uid === ID_ACCOUNT_I.uid || (ID_ACCOUNT_I.followers && ID_ACCOUNT_I.followers.includes(targetUserId)) ?
                                                    <>
                                                        {USERS_DREAMS}
                                                    </>
                                                    :
                                                    <div className="private-account">
                                                        <i className="fa-solid fa-lock"></i>
                                                        <p>
                                                            Conta privada
                                                        </p>
                                                        <p>Para acessar seus dumps, siga @{ID_ACCOUNT_I.username}.</p>
                                                    </div>

                                                }</>
                                                :
                                                <>{USERS_DREAMS}</>
                                            }
                                        </>
                                    }
                                </section>
                                :
                                <>
                                    {ID_ACCOUNT_I && ID_ACCOUNT_I.private == true ?
                                        <>{ID_ACCOUNT_I.private == true && auth.currentUser && auth.currentUser.uid === ID_ACCOUNT_I.uid ?
                                            <>
                                                <label id="youraccountislocked">Sua conta está privada.</label>
                                            </>
                                            :
                                            <></>
                                        }</>
                                        :
                                        <></>
                                    }
                                    <section className="dumps-account-user-show">


                                        {ID_ACCOUNT_I && ID_ACCOUNT_I.private == true ?
                                            <>{ID_ACCOUNT_I.private == true && auth.currentUser && auth.currentUser.uid === ID_ACCOUNT_I.uid || (ID_ACCOUNT_I.followers && ID_ACCOUNT_I.followers.includes(targetUserId)) ?
                                                <>
                                                    {USERS_POSTS}
                                                </>
                                                :
                                                <div className="private-account">
                                                    <i className="fa-solid fa-lock"></i>
                                                    <p>
                                                        Conta privada
                                                    </p>
                                                    <p>Para acessar seus dumps, siga @{ID_ACCOUNT_I.username}.</p>
                                                </div>

                                            }</>
                                            :
                                            <>{USERS_POSTS}</>
                                        }
                                    </section>
                                </>
                            }

                        </>
                    }




                </div>
            </div>

        </>
    )
}