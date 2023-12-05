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

import { Client, Databases } from 'appwrite'
import { auth } from "../lib/firebase";
import CardFeedStart from "../components/pages/feed/CardFeedStart";
import Stories from "../components/pages/feed/Stories";

let limit = 200;
let limitposts = 5
// Defina uma variável para controlar se os posts adicionais já foram carregados
let postsCarregados = false;

export default function Feed() {



    const [postsRealtime, setPosts] = useState([])
    const [postsJSON, setPostsJSON] = useState([])
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
                .catch((e) => {
                    console.log(e)
                })
        } catch (error) {
            console.log('error: ', error)
        }
    }
    useEffect(() => {
        HideLoading();
    })

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

    let PostsFollowing = postsRealtime

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
    //document.querySelector('.loading').style.display = 'none'   
    return (

        <section aria-label="Timeline da página inicial" tabindex="0" role="main" className="App-Feed feedposts dark-mode">

            <UserPerfil />
            <Messages />
            <main className="dump-feed-posts">
                <Stories />
                <PostingPhoto />
                <CardFeedStart />
                {postsJSON && postsJSON.length > 0 && users ? (
                    postsJSON.map((p) => {
                        const userDocument = users.documents.find((e) => e.email === p.email);
                        const displayName = userDocument ? userDocument.displayName : '';
                        const photoURL = userDocument ? userDocument.photoURL : '';
                        const username = userDocument ? userDocument.username : '';
                        const uid = userDocument ? userDocument.uid : "";
                        const isVerified = userDocument ? userDocument.isthisverifiqued : false;

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
                <LoadingContent />
                <EndOfPage />
            </main>
            <Suggestions />
            
        </section>
    )
}

