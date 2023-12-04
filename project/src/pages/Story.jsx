import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HideLoading } from "../components/Loading";
import databases from "../lib/appwrite";
import UserGet from "../lib/user";

export default function Story() {
    const { STORY_ID } = useParams();
    const [story, setStory] = useState({});
    const account = UserGet();
    const [dataUser, setDataUser] = useState(null);

    async function getStory() {
        try {
            const response = await databases.getDocument(
                "64f9329a26b6d59ade09",
                "656e15735dbeae5aef50",
                STORY_ID
            );
            setStory(response);
        } catch (error) {
            console.error("Error fetching story:", error);
        }
    }

    useEffect(() => {
        HideLoading();
        getStory();
    }, [account]);

    // Function to render different content based on the type
    const renderContent = () => {
        if (story.content_story) {
            return (
                <div className="story-content">
                    <img src={story.content_story} alt="Story" />
                </div>
            );
        }
        return null;
    };

    async function getPoster() {
        try {
            if (story.created_by) {
                const res = await databases.getDocument(
                    "64f9329a26b6d59ade09",
                    "64f93be88eee8bb83ec3",
                    story.created_by
                );
                setDataUser(res);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    }

    useEffect(() => {
        getPoster();
    }, [story.created_by]); // Run when created_by changes



    return (
        <>
            <div className="Dump-Page-Story-Dump-Bg"></div>
            <div className="Dump-Page-Story-Dump">
                <div className="Dump-Story-Actual">
                    <div className="Dump-Story-Top">
                        <div className="Dump-Button-wrapper">
                            <Link to={window.location.origin} className="Dump-Button-Close"><span><i className="fa-solid fa-xmark"></i></span></Link>
                        </div>
                    </div>
                    <div className="Dump-Story-Content-FullScreen">{renderContent()}</div>
                    <div className="Dump-Story-Bottom">
                        <div className="Dump-User-LeftSide">
                            {dataUser ?
                                <Link to={window.location.origin + "/user/" + dataUser.$id}>
                                    <img src={dataUser.photoURL} />
                                    <div className="Dump-User-Content">
                                        <h2>{dataUser.displayName}</h2>
                                        <p>@{dataUser.username}</p>
                                    </div>
                                </Link>
                                :
                                null
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
