import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserGet from "../lib/user";
import { databases } from "../lib/appwrite";
import { Query } from "appwrite";
import { auth, database } from "../lib/firebase";
import Swal from "sweetalert2";

export default function RequestsPage() {
    const [AllRequests, setRequests] = useState([]);
    const currentUser = UserGet();

    async function handleAcceptRequest(req) {
        try {
            const USER_REQUEST = await databases.getDocument("64f9329a26b6d59ade09", "64f93be88eee8bb83ec3", req.sender_request);
            const followers = currentUser.followers || [];
            const followingSenderRequest = USER_REQUEST.following || [];





            followers.push(req.sender_request)
            followingSenderRequest.push(req.to_uid)

            await databases.updateDocument(
                "64f9329a26b6d59ade09",
                "64f93be88eee8bb83ec3",
                req.to_uid, {
                followers: followers,
            }
            )
                .then(() => {
                    databases.deleteDocument(
                        "64f9329a26b6d59ade09",
                        "6596b4a3d1273755e5b7",
                        req.$id
                    )
                        .then(async () => {
                            await databases.updateDocument(
                                "64f9329a26b6d59ade09",
                                "64f93be88eee8bb83ec3",
                                req.sender_request, {
                                following: followingSenderRequest
                            }

                            )
                            RequestsUser()
                        })
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `Você aceitou a solicitação.`,
                        showConfirmButton: false,
                        timer: 1500
                    })

                })
        }
        catch (error) {
            console.log(error)
        }
    }

    async function handleDenyRequest(req) {
        try {
            await databases.deleteDocument(
                "64f9329a26b6d59ade09",
                "6596b4a3d1273755e5b7",
                req.$id
            )
                .then((res) => {
                    RequestsUser()
                })
        }
        catch (error) {
            console.log(error)
        }
    }

    async function getUserbyUid(UID) {
        try {
            const response = await databases.getDocument(
                "64f9329a26b6d59ade09",
                "64f93be88eee8bb83ec3",
                UID
            );
            return response;
        } catch (error) {
            console.log("Error ao pegar usuário pelo UID: " + error);
            return null;
        }
    }

    const RequestsUser = async () => {
        if (!currentUser) {
            console.log("Current user is null");
            return;
        }

        try {
            const res = await databases.listDocuments(
                "64f9329a26b6d59ade09",
                "6596b4a3d1273755e5b7",
                [
                    Query.equal("to_uid", currentUser.$id),
                    Query.limit(20),
                    Query.orderDesc("$createdAt")
                ]
            );

            setRequests(
                await Promise.all(
                    res.documents.map(async (req) => {
                        const reqUser = await getUserbyUid(req.sender_request);

                        return (
                            <div className="DumpNotification´-Wrapper--item" key={req.id}>

                                <div className="DumpNotification--InfoContent">
                                    {reqUser && (
                                        <>
                                            <Link to={window.location.origin + "/user/" + req.sender_request}>
                                                <img src={reqUser.photoURL} alt="" />
                                            </Link>
                                            <div className="DumpNotInfo">
                                                <p><b>@{reqUser.username}</b> deseja começar a seguir seu perfil.</p>
                                                <div className="ButtonActions">
                                                    <div><button className="acceptButton" onClick={() => handleAcceptRequest(req)}><span>Aceitar</span></button></div>
                                                    <div><button className="denyButton" onClick={() => handleDenyRequest(req)}><span>Remover</span></button></div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                            </div>
                        );
                    })
                )
            );
        } catch (error) {
            console.log("Error ao buscar solicitações: " + error);
        }
    };

    useEffect(() => {
        if (currentUser) {
            RequestsUser();
        }
    }, [currentUser]);

    if (!currentUser) {
        // Render a loading state or a message indicating that the user is not available
        return (
            <div className="NotificationsContent-Page--content">
                <div className="RequestsPage">
                    <div className="HeaderRequests">
                        <div className="BtnBackNotifications">
                            <Link to={window.location.origin + "/notifications"}>
                                <span>
                                    <i className="fa-solid fa-chevron-left"></i>
                                </span>
                            </Link>
                        </div>
                        <div className="HeaderContent">
                            <h2>Solicitações para seguir</h2>
                        </div>
                    </div>
                    <div className="AllRequests">
                        <div className="NotificationsContent-Page--content">
                            <div>Loading...</div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    return (
        <div className="NotificationsContent-Page--content">
            <div className="RequestsPage">
                <div className="HeaderRequests">
                    <div className="BtnBackNotifications">
                        <Link to={window.location.origin + "/notifications"}>
                            <span>
                                <i className="fa-solid fa-chevron-left"></i>
                            </span>
                        </Link>
                    </div>
                    <div className="HeaderContent">
                        <h2>Solicitações para seguir</h2>
                    </div>
                </div>
                <div className="AllRequests">
                    <>{AllRequests}</>
                </div>
            </div>
        </div>
    );
}
