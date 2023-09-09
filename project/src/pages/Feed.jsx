import HeaderFeed from "../components/pages/feed/HeaderApp";
import { auth, provider, signInWithPopup, app, db, database } from '../lib/firebase';
import {addDoc, collection, doc, getFirebase, setDoc} from 'firebase/firestore';
import Posts from "../components/pages/feed/Posts";
import Suggestions from "../components/pages/feed/Suggestions";
import CreatePost from "../components/pages/feed/CreatePost";
import { useCollection } from 'react-firebase-hooks/firestore';
import { Loading, HideLoading } from "../components/Loading";
import Messages from "../components/pages/feed/Messages";
import UserPerfil from "../components/pages/feed/UserPerfil";
import databases from "../lib/appwrite";
import { useEffect, useState } from "react";
import { Query } from "appwrite";
import PostingPhoto from "../components/pages/feed/PostingPhoto";

export default function Feed() {

    const [postsRealtime, setPosts] = useState([])

    useEffect(() => {
        getPosts();
    })

    const getPosts = async () => {
        const response = await databases.listDocuments("64f9329a26b6d59ade09",
         '64f93c1c40d294e4f379',
          [Query.orderDesc("$createdAt")]);
        setPosts(response.documents)
    }

    //document.querySelector('.loading').style.display = 'none'   
    return(
        <div className="App-Feed feedposts">
            <UserPerfil />
            <Messages />
            <HeaderFeed />
            <div className="dump-feed-posts">
                <PostingPhoto 
                    
                />
                {
                    postsRealtime.map(p => {

                        return(
                            <Posts
                                id={p.$id}
                                displayName={p.displayName}
                                photoURL={p.photoURL}
                                username={(p.displayName).toLowerCase()}
                                fotopostada={p.filePost}
                                descricao={p.legenda}
                                timestamp = {p.timestamp}
                            />
                        )
                    })
                    
                }
                    
            
                
            </div>
            <Suggestions />
            <CreatePost />
        </div>
    )
}
