import React, { useEffect, useState } from "react";
import UserGet from "../../../lib/user";
import databases from "../../../lib/appwrite";
import { auth } from "../../../lib/firebase";
import { Link } from "react-router-dom";

export default function Stories() {

    const [USER_ATUAL, setUSER_ATUAL] = useState(null);

    const account = UserGet();

    useEffect(() => {
        if (account) {
            setUSER_ATUAL(account)
        }

    }, [account]);


    const [anotherStories, setAnotherStories] = useState([]);

    useEffect(() => {
        const getStoryComponents = async () => {
            try {
                const response = await databases.listDocuments(
                    "64f9329a26b6d59ade09", // DATABASE ID
                    "656e15735dbeae5aef50" // STORIES ID
                );

                const stories = await Promise.all(
                    response.documents.map(async (story) => {
                        if (story.created_by == auth.currentUser.uid) {
                            return
                        }
                        const userResponse = await databases.getDocument(
                            "64f9329a26b6d59ade09",
                            "64f93be88eee8bb83ec3",
                            story.created_by
                        );

                        if(!USER_ATUAL.following.includes(story.created_by)) {
                            return <></>
                        }

                        return (
                            <div className="Dump-Story-Content" key={story.documentId}>
                                <Link to={window.location.origin + `/stories/${story.$id}`}>
                                    <div className="Dump-Image-Profile">
                                        <img src={userResponse.photoURL} alt="Profile" />
                                    </div>
                                    <div className="Dump-Username-Content">
                                        <p>@{userResponse.username.length > 13 ? (userResponse.username).slice(0, 15) + "..." : userResponse.username}</p>
                                    </div>
                                </Link>
                            </div>
                        );
                    })
                );

                setAnotherStories(stories);
            } catch (error) {
                console.error("Error fetching stories:", error);
            }
        };

        getStoryComponents();
    }, [account]); // Empty dependency array to run once on mount


    return (
        
        <section className="Dumps-Stories-Box-Showcase" >
            <h2>Storys</h2>
            <div className="Dump-Stories-Flexbox">
                <div className="Dump-Story-Content">
                    <div className="Dump-Image-Profile">

                        <img src={USER_ATUAL ? USER_ATUAL.photoURL : ""} alt="Profile" />
                    </div>
                    <div className="Dump-Username-Content">
                        <p>Adicionar Story</p>
                    </div>
                </div>
                {anotherStories}
            </div>

        </section>
    );
}
