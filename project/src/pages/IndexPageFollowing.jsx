import HeaderFeed from "../components/pages/feed/HeaderApp";
import Posts from "../components/pages/feed/Posts";
import Suggestions from "../components/pages/feed/Suggestions";
import CreatePost from "../components/pages/feed/CreatePost";
import { HideLoading } from "../components/Loading";
import Messages from "../components/pages/feed/Messages";
import UserPerfil from "../components/pages/feed/UserPerfil";
import databases from "../lib/appwrite";
import { useEffect, useState } from "react";
import { Query } from "appwrite";
import PostingPhoto from "../components/pages/feed/PostingPhoto";
import LoadingContent from "../components/pages/feed/LoadingContent";
import EndOfPage from "../components/pages/feed/EndOfPage";
import Dailys from "../components/pages/feed/Dailys";
import { Client, Databases } from 'appwrite'
import { auth } from "../lib/firebase";

let currentUserID
if (auth.currentUser) {
    currentUserID = auth.currentUser.uid; // Replace with the current user's ID
}



export default function IndexPageFollowing() {
    const [length, setlength] = useState(null)
    const [users, Setusersdb] = useState()
    const [verifiqued, SetVerif] = useState()

    useEffect(() => {
        HideLoading();
    })

    const [postsRealtime, setPosts] = useState([]);
    const [userPostUID, setuserPostUID] = useState(null)

    const getPosts = async () => {

        try {
            if (auth.currentUser) {
                const currentUserID = auth.currentUser.uid;

                // Obtenha a lista de usuários que o usuário atual está seguindo
                const following = await databases.getDocument(
                    "64f9329a26b6d59ade09",
                    "64f93be88eee8bb83ec3",
                    currentUserID,
                );
                const followingUsers = following.following || [];

                const response = await databases.listDocuments(
                    '64f9329a26b6d59ade09',
                    "64f93c1c40d294e4f379",
                    [
                        Query.orderDesc("$createdAt"),
                        Query.limit(150)
                    ]
                );

                const posts = response.documents;


                const filteredPosts = await Promise.all(posts.map(async (post) => {
                    const users = await databases.listDocuments(
                        "64f9329a26b6d59ade09",
                        "64f93be88eee8bb83ec3"
                    );
                    const userPostUID = users.documents.find((user) => user.email === post.email)?.uid;

                    return followingUsers.includes(userPostUID) ? post : null;
                }));

                // Filtrar posts nulos (posts que não estão sendo seguidos pelo usuário)
                const filteredAndCleanedPosts = filteredPosts.filter((post) => post !== null);

                setPosts(filteredAndCleanedPosts);
                setlength(filteredAndCleanedPosts.length)
            }
        } catch (error) {
            console.log('error: ', error);
        }
    };

    let PostsFollowing = postsRealtime

    useEffect(() => {
        getPosts()
        setTimeout(() => {
            getPosts()
        }, 3000);
        setTimeout(() => {
            getPosts()
        }, 5000);
        setTimeout(() => {
            getPosts()
        }, 7000);
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

    function gotosearch() {
        window.location.href = window.location.origin + "/search"
    }
    //document.querySelector('.loading').style.display = 'none'   
    return (

        <div className="App-Feed feedposts">

            <UserPerfil />
            <Messages />
            <HeaderFeed />

            <div className="dump-feed-posts">

                {auth.currentUser && PostsFollowing && length > 0 ?
                    <>
                        <PostingPhoto

                        />
                        {
                            PostsFollowing.map((p) => {
                                return (
                                    <Posts
                                        id={p.$id}
                                        datepost={p.$createdAt}
                                        email={p.email}
                                        displayName={users.documents.filter(e => e.email == p.email).map((u) => {
                                            return u.displayName
                                        })}
                                        photoURL={users.documents.filter(e => e.email == p.email).map((u) => {
                                            return u.photoURL
                                        })}
                                        username={users.documents.filter(e => e.email == p.email).map((u) => {
                                            return u.username
                                        })}
                                        fotopostada={p.filePost}
                                        descricao={p.legenda}
                                        timestamp={p.timestamp}
                                        isthisverifiqued={
                                            users.documents.filter(e => e.email == p.email).map((u) => {
                                                return u.isthisverifiqued
                                            })

                                        }
                                        userisfollowing={p.following}
                                    />
                                )
                            }, [])

                        }
                        <LoadingContent />
                        <EndOfPage />
                    </>
                    :
                    <div className="dump-dont-account-following">
                        <LoadingContent />
                        <img src="./static/media/undraw_fireworks_re_2xi7.svg"/>
                        <h1>Seja bem vindo(a) ao Dump</h1>
                        <p>Siga pessoas para acessar essa aba</p>
                        <button onClick={gotosearch}>Começar</button>
                    </div>
                    }


            </div>
            <Suggestions />
            <CreatePost />
        </div>
    )
}

