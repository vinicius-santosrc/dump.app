import React, { useEffect, useState } from "react";
import UserGet from "../../../lib/user";
import databases from "../../../lib/appwrite";
import { auth } from "../../../lib/firebase";
import { Link } from "react-router-dom";
import { Query } from "appwrite";

export default function Stories() {

    const [USER_ATUAL, setUSER_ATUAL] = useState(null);
    const [Loading, setLoading] = useState(false)
    const account = UserGet();

    useEffect(() => {
        if (account) {
            setUSER_ATUAL(account)
        }

    }, [account]);


    const [anotherStories, setAnotherStories] = useState([]);
    const [yourDaily, setYourDaily] = useState(null)


    useEffect(() => {
        if (!account) {
            return; // Adicione uma verificação de autenticação
        }

        setLoading(true)

        const getStoryComponents = async () => {

            try {
                const response = await databases.listDocuments(
                    "64f9329a26b6d59ade09", // DATABASE ID
                    "656e15735dbeae5aef50", // STORIES ID
                    [Query.orderDesc("$createdAt")]
                );

                const processedUsers = new Set(); // Conjunto para rastrear usuários processados
                const stories = [];
                let userResponse; // Declare a variável fora do loo

                for (const story of response.documents) {

                    const userResponse = await databases.getDocument(
                        "64f9329a26b6d59ade09",
                        "64f93be88eee8bb83ec3",
                        story.created_by
                    );

                    const datastory = new Date(story.$createdAt)
                    const dataatual = new Date()
                    if (datastory.getDate() != dataatual.getDate() || datastory.getMonth() != dataatual.getMonth() || datastory.getFullYear() != dataatual.getFullYear()) {
                        continue // Se o dia for diferente do daily, pula este daily
                    }
                    const StoryYours = () => {
                        return story.created_by === auth.currentUser.uid
                    }

                    if(StoryYours() ) {
                        setYourDaily(
                            <div className="Dump-Story-Content" key={story.documentId}>
                                <Link to={window.location.origin + `/stories/${story.$id}`}>
                                    <div className="Dump-Image-Profile">
                                        <img src={userResponse.photoURL} alt="Profile" />
                                    </div>
                                    <div className="Dump-Username-Content">
                                        <p>Seu daily</p>
                                    </div>
                                </Link>
                            </div>
                        );

                        continue;
                    } // Se o daily for do usuário, adiciona como seu Daily e pula.

                    if (!USER_ATUAL || !USER_ATUAL.following.includes(story.created_by)) {                        
                        continue;

                    } // Se o usuário não segue o criador do story, pula.

                    if (processedUsers.has(story.created_by)) {
                        continue; // Se o usuário já foi processado, pula este daily
                    }

                    
                    

                    if (!USER_ATUAL.following.includes(story.created_by)) {
                        continue; // Se o usuário não está sendo seguido, pula este story
                    }

                    processedUsers.add(story.created_by); // Adiciona o usuário ao conjunto de usuários processados

                   

                    stories.push(
                        <div className="Dump-Story-Content" key={story.documentId}>
                            <Link to={window.location.origin + `/stories/${story.$id}`}>
                                <div className="Dump-Image-Profile">
                                    <img src={userResponse.photoURL} alt="Profile" />
                                </div>
                                <div className="Dump-Username-Content">
                                    <p>
                                        @{userResponse.username.length > 13
                                            ? userResponse.username.slice(0, 15) + "..."
                                            : userResponse.username}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    );
                }
                setLoading(false);
                setAnotherStories(stories);
            } catch (error) {
                setLoading(false);
                console.error("Error fetching stories:", error);
            }
        };

        getStoryComponents();
    }, [account, USER_ATUAL]); // Empty dependency array to run once on mount

    function LoadingStorys() {
        return (
            <div className="Dump-Story-Content dump-loading-content">
                <Link>
                    <div className="left-side-inner-profile-dump">
                        <svg width="304" height="304" viewBox="0 0 304 304" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="304" height="304" fill="#D4D4D4" />
                            <path d="M266.816 304C266.816 278.274 270.14 253.602 248.556 235.411C226.973 217.22 182.25 207 151.726 207C121.203 207 74.2665 217.22 52.683 235.411C31.0996 253.602 36.6367 278.274 36.6367 304L151.726 304H266.816Z" fill="white" />
                            <circle cx="151.5" cy="128.5" r="78.5" fill="white" />
                        </svg>


                        <div className="NullContentLoading-flex">
                            <div className="NullContentLoading">

                            </div>

                        </div>
                    </div>
                    <div className="rightside_user_information">


                    </div>
                </Link>
            </div>
        )
    }

    if (!account) {
        return
    }
    return (

        <section className="Dumps-Stories-Box-Showcase" >


            {Loading ?
                <>
                    <h2>Dailys</h2>
                    <div className="Dump-Stories-Flexbox">
                        <>
                            <LoadingStorys />
                            <LoadingStorys />
                            <LoadingStorys />
                            <LoadingStorys />
                        </>

                    </div>
                </>
                :
                <>
                    <h2>Dailys</h2>
                    <div className="Dump-Stories-Flexbox">

                        {yourDaily ? (
                            <>{yourDaily}</>
                        ) : (
                            <div className="Dump-Story-Content">
                                <Link to={window.location.origin + `/posts/create`}>
                                    <div className="Dump-Image-Profile">
                                        <img src={USER_ATUAL ? USER_ATUAL.photoURL : null} alt="Profile" />
                                    </div>
                                    <div className="Dump-Username-Content">
                                        <p><b>Adicionar Daily</b></p>
                                    </div>
                                </Link>
                            </div>
                        )}
                        {anotherStories}
                    </div>
                </>
            }



        </section>
    );
}
