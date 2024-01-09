import HeaderFeed from "../components/pages/feed/HeaderApp";
import Posts from "../components/pages/feed/Posts";
import Suggestions from "../components/pages/feed/Suggestions";
import CreatePost from "../components/pages/feed/CreatePost";

import Messages from "../components/pages/feed/Messages";
import UserPerfil from "../components/pages/feed/UserPerfil";
import { databases } from "../lib/appwrite";
import { useEffect, useState } from "react";
import { Query } from "appwrite";
import PostingPhoto from "../components/pages/feed/PostingPhoto";
import LoadingContent from "../components/pages/feed/LoadingContent";
import EndOfPage from "../components/pages/feed/EndOfPage";
import { useNavigate } from 'react-router-dom';

import { Client, Databases } from 'appwrite'
import { auth } from "../lib/firebase";
import CardFeedStart from "../components/pages/feed/CardFeedStart";
import Stories from "../components/pages/feed/Stories";
import UserGet from "../lib/user";
import { useAppContext } from "../context/AppContext";
import { ring } from 'ldrs'

ring.register()

let limit = 200;
let limitposts = 5
// Defina uma variável para controlar se os posts adicionais já foram carregados
let postsCarregados = false;



export default function Feed() {


    const [postsRealtime, setPosts] = useState([])
    const [postsJSON, setPostsJSON] = useState([])
    const [currentUser, setcurrentUser] = useState(null)
    const getPosts = async () => {
        try {
            await databases.listDocuments(
                "64f9329a26b6d59ade09",
                '64f93c1c40d294e4f379',
                [
                    Query.limit(limit),
                    Query.orderDesc("$createdAt"),
                ],
            )
                .then((res) => {
                    setPosts(res.documents)
                    setPostsJSON(res.documents.slice(0, 5))
                })
        } catch (error) {
            console.log('error: ', error)
        }
    }
    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            limitposts += 5
            setPostsJSON(postsRealtime.slice(0, limitposts))
        }
    });
    // Verifique se o usuário chegou no final da página e se os posts ainda não foram carregados
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !postsCarregados) {
        // Aumente o limite de posts e atualize a lista
        limitposts += 5;
        setPostsJSON(postsRealtime.slice(0, limitposts));
        // Marque os posts como carregados
        postsCarregados = true;
    }
    else {
        // Defina uma variável para controlar se os posts adicionais já foram carregados
        postsCarregados = false;
    }
    const [users, Setusersdb] = useState()
    const [verifiqued, SetVerif] = useState()
    useEffect(() => {
        getPosts()
        document.title = "Dump"
    }, [])
    const user = async () => {
        await databases.listDocuments(
            '64f9329a26b6d59ade09',
            "64f93be88eee8bb83ec3",
        )
            .then((r) => {
                Setusersdb(r)
            })
    }
    useEffect(() => {
        user()
    })
    let Nav = useNavigate();
    function gotoSearch() {
        Nav("/search")
    }
    const curerntUser = UserGet()
    //document.querySelector('.loading').style.display = 'none'   
    if (!navigator.onLine) {
        return (
            <section aria-label="Timeline da página inicial" tabindex="0" role="main" className="App-Feed feedposts dark-mode">
                <UserPerfil />
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
                    <EndOfPage />
                </main>
                <Suggestions />
            </section>
        )
    }
    return (
        <section aria-label="Timeline da página inicial" tabindex="0" role="main" className="App-Feed feedposts dark-mode">
            <UserPerfil />
            <Messages />
            <main className="dump-feed-posts">
                <Stories />
                <PostingPhoto />
                <CardFeedStart />
                {curerntUser && curerntUser.following.length <= 0 ?
                    <div className="NoFeedShow-Wrapper">
                        <div className="ImageContent">
                            <img src={window.location.origin + "/static/media/undraw_buddies_2ae5.svg"} />
                        </div>
                        <h2>Que triste!</h2>
                        <p>Você ainda não segue ninguém. Que tal conhecer alguns amigos?</p>
                        <button className="ButtonToSearch" onClick={gotoSearch}><span>Procurar amigos</span></button>
                    </div>
                    :
                    <>
                        {postsJSON && postsJSON.length > 0 && users ? (
                            postsJSON.map((p) => {
                                const userDocument = users.documents.find((e) => e.email === p.email);
                                const displayName = userDocument ? userDocument.displayName : '';
                                const photoURL = userDocument ? userDocument.photoURL : '';
                                const username = userDocument ? userDocument.username : '';
                                const uid = userDocument ? userDocument.uid : "";
                                const isVerified = userDocument ? userDocument.isthisverifiqued : false;
                                if (curerntUser && !curerntUser.following.includes(p.uid)) {
                                    return null
                                }

                                if (!auth.currentUser && userDocument.private) {
                                    limitposts = 200
                                    return
                                }


                                return (
                                    <Posts
                                        id={p.$id}
                                        datepost={p.$createdAt}
                                        email={p.email}
                                        displayName={displayName}
                                        photoURL={photoURL}
                                        username={username}
                                        fotopostada={p.filePost}
                                        descricao={p.legenda}
                                        timestamp={p.timestamp}
                                        isthisverifiqued={isVerified}
                                        userisfollowing={p.following}
                                        likes={p.likes}
                                        uid_user={uid}
                                    />
                                );

                            })
                        ) : null}
                    </>}
                {/* <LoadingContent /> */}
                <EndOfPage />
            </main>
            <Suggestions />
        </section>
    )
}