import { useEffect, useState } from "react";
import HeaderFeed from "../components/pages/feed/HeaderApp";
import { HideLoading } from "../components/Loading";
import { auth, database } from "../lib/firebase";
import databases from "../lib/appwrite";
import { Query } from "appwrite";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import UserGet from "../lib/user";

export default function Notifications() {

    const UserAtual = UserGet()

    const DB_UID = '64f9329a26b6d59ade09';
    const COL_UID = '64f93c1c40d294e4f379';
    const USERSIDDATABASE = '64f93be88eee8bb83ec3';
    const [i_ison, setUserOn] = useState('');
    const [listLikes, setlistLikes] = useState([]);
    const [LoadingNotifications, setLoadingNotifications] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged(function (u) {
            setUserOn(u)
        })

    })




    useEffect(() => {
        setLoadingNotifications(true)
        HideLoading()
        async function getNotifications() {
            try {
                const res = await databases.listDocuments(DB_UID, "64fd4c66a7628f81bde8", [Query.limit(100), Query.equal("TO_UID", i_ison.uid), Query.orderDesc("$createdAt")]);


                const notifications = res.documents.map(async (notification) => {
                    const r = await databases.getDocument("64f9329a26b6d59ade09", "64f93be88eee8bb83ec3", notification.SENDER_UID);

                    const photosBD = await databases.listDocuments(DB_UID, "64f93c1c40d294e4f379", [Query.limit(200)])

                    const photoREL = await databases.getDocument(DB_UID, "64f93c1c40d294e4f379", notification.PHOTO_REL);


                    async function seenChange() {
                        try {
                            await databases.updateDocument('64f9329a26b6d59ade09', "64fd4c66a7628f81bde8", notification.$id,
                                r.id,
                                {
                                    SEEN: "true"
                                }
                            )
                        }
                        catch {

                        }
                    }

                    const MesesDoAno = [
                        "Janeiro",
                        "Fevereiro",
                        "Março",
                        "Abril",
                        "Maio",
                        "Junho",
                        "Julho",
                        "Agosto",
                        "Setembro",
                        "Outubro",
                        "Novembro",
                        "Dezembro"
                    ]
                    const date = new Date(notification.$createdAt)
                    const Day = date.getDate()
                    const Mounth = date.getMonth()
                    const Year = date.getFullYear()
                    return (



                        <Link className="DumpNotificationRedirect" to={window.location.origin + "/posts/" + photoREL.$id}>
                            <div className="DumpNotification´-Wrapper--item" key={notification.id} id={notification.SEEN ? "SEEN" : "toSEE"}>

                                <div className="DumpNotification--InfoContent">
                                    <img src={r.photoURL} alt="" />
                                    <div className="DumpNotInfo">
                                        <p><b>@{r.username}</b> {notification.ACTION == "like" ? "curtiu seu dump" : <span>comentou em seu dump: {notification.desc}</span>}</p>
                                        <p>{Day} de {MesesDoAno[Mounth]} de {Year}</p>

                                    </div>
                                </div>
                                <div className="DumpNotificationPHOTOREL">
                                    <img src={photoREL.filePost} />
                                </div>

                            </div>
                        </Link>
                    );


                });

                const resolvedNotifications = await Promise.all(notifications);
                setLoadingNotifications(false)
                setlistLikes(resolvedNotifications);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        }

        getNotifications();


    }, [i_ison])

    function LoadingNot() {
        return (
            <Link className="DumpNotificationRedirect">
                <div className="DumpNotification´-Wrapper--item">

                    <div className="DumpNotification--InfoContent">
                        <div className="dump-leftside-info-user">
                            <svg width="304" height="304" viewBox="0 0 304 304" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="304" height="304" fill="#D4D4D4" />
                                <path d="M266.816 304C266.816 278.274 270.14 253.602 248.556 235.411C226.973 217.22 182.25 207 151.726 207C121.203 207 74.2665 217.22 52.683 235.411C31.0996 253.602 36.6367 278.274 36.6367 304L151.726 304H266.816Z" fill="white" />
                                <circle cx="151.5" cy="128.5" r="78.5" fill="white" />
                            </svg>


                            <div className="NullContentLoading-flex">
                                <div className="NullContentLoading">

                                </div>
                                <div className="NullContentLoading"></div>
                            </div>
                        </div>
                    </div>
                    <div className="DumpNotificationPHOTOREL">
                        <div className="nullQuad"></div>
                    </div>

                </div>
            </Link>
        )
    }



    return (
        <>

            <div className="NotificationsContent-Page--content">
                <section className="Notifications">
                    <div className="NotificationsHeader">
                        <h1>Mais recentes</h1>
                    </div>
                    <ul className="ListNotifications">
                        {LoadingNotifications ?
                            <>
                                <LoadingNot></LoadingNot>
                                <LoadingNot></LoadingNot>
                                <LoadingNot></LoadingNot>
                            </>

                            :
                            <>{listLikes}</>}

                    </ul>
                </section>

            </div>
        </>
    )
}