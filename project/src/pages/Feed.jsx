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

const limit = 250;

export default function Feed() {



    const [postsRealtime, setPosts] = useState([])
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
            getPosts();
        }
    });

    let PostsFollowing = postsRealtime

    const [users, Setusersdb] = useState()
    const [verifiqued, SetVerif] = useState()

    useEffect(() => {
        getPosts()
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
            <HeaderFeed />

            <main className="dump-feed-posts">
                <PostingPhoto />
                {postsRealtime && postsRealtime.length > 0 && users ? (
                    postsRealtime.map((p) => {
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
                                uid_user={uid}
                            />
                        );
                    })
                ) : null}
                <LoadingContent />
                <EndOfPage />
            </main>
            <Suggestions />
            <CreatePost />
        </section>
    )
}

