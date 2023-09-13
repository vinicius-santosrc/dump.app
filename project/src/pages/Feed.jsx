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

let numberofload = 3
window.addEventListener("scroll", verificarFimDaPagina);

function verificarFimDaPagina() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        numberofload += 3

    }
}

export default function Feed() {

    const [postsRealtime, setPosts] = useState([])

    const getPosts = async () => {
        const response =
            await databases.listDocuments(
                "64f9329a26b6d59ade09",
                '64f93c1c40d294e4f379',
                [Query.orderDesc("$createdAt")]).catch((e) => {
                    console.log(e)
                })

        setPosts(response.documents)
    }

    useEffect(() => {
        HideLoading();
    })
    let LastPosts = postsRealtime.slice(0, numberofload)
    getPosts()

    const [users, Setusersdb] = useState()
    const [verifiqued, SetVerif] = useState()

    const user = async () => {
        await databases.listDocuments(
            '64f9329a26b6d59ade09',
            "64f93be88eee8bb83ec3",
        )
            .then((r) => {
                Setusersdb(r)
            })
    }

    user()
    //document.querySelector('.loading').style.display = 'none'   
    return (

        <div className="App-Feed feedposts">

            <UserPerfil />
            <Messages />
            <HeaderFeed />
            <div className="dump-feed-posts">
                <PostingPhoto

                />
                {

                    LastPosts.map((p) => {

                        return (
                            <Posts
                                id={p.$id}
                                datepost={p.$createdAt}
                                email={p.email}
                                displayName={p.displayName}
                                photoURL={p.photoURL}
                                username={(p.displayName).toLowerCase()}
                                fotopostada={p.filePost}
                                descricao={p.legenda}
                                timestamp={p.timestamp}
                                isthisverifiqued={

                                        users.documents.filter(e => e.email == p.email).map((u) => {
                                            return u.isthisverifiqued
                                        })
                                    
  }
                            />
                        )

                    })

                }
                <LoadingContent />
                <EndOfPage />


            </div>
            <Suggestions />
            <CreatePost />
        </div>
    )
}

