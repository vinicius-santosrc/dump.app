import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HideLoading } from "../components/Loading";
import databases from "../lib/appwrite";
import UserGet from "../lib/user";
import { Query } from "appwrite";
import LoadingContent from "../components/pages/feed/LoadingContent";
import LoadingContentWhite from "../components/pages/feed/LoadingContentWhite";
import { auth } from "../lib/firebase";
import Swal from "sweetalert2";


let jsonStories = [];
let indexStory = 0

export default function Story() {
    const { STORY_ID } = useParams();
    const [story, setStory] = useState({});
    const account = UserGet();
    const [dataUser, setDataUser] = useState(null);
    const [storysAnother, setstorysAnother] = useState([]);
    const [anotherStories, setanotherStories] = useState([]);

    const [timerContent, settimerContent] = useState(10);

    const [Loading, setLoading] = useState(false);
    const [ShowOptions, setShowOptions] = useState(false)



    async function getStory() {
        setLoading(true);
        try {
            const response = await databases.getDocument(
                "64f9329a26b6d59ade09",
                "656e15735dbeae5aef50",
                STORY_ID
            );
            setStory(response);
            setLoading(false);
        } catch (error) {
            setLoading(false)
            console.error("Error fetching daily:", error);
        }
    }



    async function getAnotherStorys() {
        setLoading(true)
        try {
            await databases.listDocuments(
                "64f9329a26b6d59ade09",
                "656e15735dbeae5aef50",
                [Query.orderDesc("$createdAt"), Query.equal("created_by", story.created_by)]
            )
                .then((res) => {

                    setstorysAnother(res.documents.map((r) => {
                        const datastory = new Date(r.$createdAt)
                        const dataatual = new Date()
                        if (datastory.getDate() != dataatual.getDate() || datastory.getMonth() != dataatual.getMonth() || datastory.getFullYear() != dataatual.getFullYear()) {
                            return r.$id// Se o dia for diferente do daily, pula este daily
                        }
                        else {
                            jsonStories.push(r.$id)
                            return r.$id;
                        }
                    }))
                    setanotherStories(res.documents.map((str) => {
                        const datastory = new Date(str.$createdAt)
                        const dataatual = new Date()
                        if (datastory.getDate() == dataatual.getDate() && datastory.getMonth() == dataatual.getMonth() && datastory.getFullYear() == dataatual.getFullYear()) {
                            return (
                                <div className="Story-Length-Content" id={str.$id == story.$id ? "daily-selected " + timerContent + "%" : null} key={story.$id}>

                                </div>
                            )
                        }
                    }))
                    setLoading(false)
                })
        }
        catch (err) {
            console.log("Erro ao pegar outros dailys: ", err)
            setLoading(false)
        }
    }

    function timerStory() {
        let segundos = 10;
        settimerContent(segundos)

        // Atualizar o contador a cada segundo
        const intervalId = setInterval(function () {
            segundos--;
            settimerContent(segundos)
            console.log(segundos)
            // Verificar se o contador chegou a zero
            if (segundos === 0) {
                // Limpar o intervalo e realizar a ação desejada quando o contador atingir zero
                clearInterval(intervalId);

                settimerContent(segundos)
                if (indexStory + 1 < storysAnother.length) {
                    window.location.href = window.location.origin + `/stories/${jsonStories[indexStory + 1]}`;
                } else {
                    // Se não houver mais dailys, redirecione para alguma outra página sem atualizar a atual


                }
            }
        }, 1000);
    }

    useEffect(() => {

        HideLoading();
        getStory();
        getAnotherStorys();
        timerStory();
    }, [account]);


    // Function to render different content based on the type
    const renderContent = () => {
        if (story.content_story) {
            return (
                <div className="story-content">
                    <img src={story.content_story} alt="Daily" />
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

    async function DeleteDaily() {
        try {
            Swal.fire({
                title: "Você deseja excluir seu Daily?",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: "Excluir",
                denyButtonText: `Cancelar`
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    databases.deleteDocument(
                        "64f9329a26b6d59ade09",
                        "64f93be88eee8bb83ec3",
                        story.id
                    )
                        .then((res) => {
                            Swal.fire("Daily excluído!", "Daily excluído com sucesso.", "success");
                        })

                } else if (result.isDenied) {

                }
            });
        }
        catch (error) {

        }
    }


    useEffect(() => {
        getPoster();
    }, [story.created_by]); // Run when created_by changes

    let isTrueStory = true


    const dataatual = new Date()
    const storydate = new Date(story.$createdAt);

    if (storydate.getFullYear() === dataatual.getFullYear()
        &&
        storydate.getMonth() === dataatual.getMonth()
        &&
        storydate.getDate() === dataatual.getDate()
    ) {
        isTrueStory = true
    }
    else {
        isTrueStory = false
    }

    if (isTrueStory) {
        return (
            <>
                <div className="Dump-Page-Story-Dump-Bg"></div>
                <div className="Dump-Page-Story-Dump">
                    <div className="Top-Dump-Story">
                        {anotherStories}
                    </div>
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
                                            <h2>{dataUser.id == auth.currentUser.uid ? "Seu daily" : dataUser.displayName}</h2>
                                            <p>@{dataUser.username}</p>
                                        </div>
                                    </Link>
                                    :
                                    null
                                }

                            </div>
                            {dataUser ? <>
                                {dataUser.$id === auth.currentUser.uid ?
                                    <>
                                        <div className="Dump-User-RightSide">
                                            <button onClick={() => setShowOptions(!ShowOptions)}><span><i className="fa-solid fa-ellipsis"></i></span></button>
                                        </div>
                                        <>
                                            {ShowOptions ?
                                                <div className="ShowOptionsStory" onClick={() => setShowOptions(!ShowOptions)}>
                                                    <div className="ItensOptions">
                                                        <div className="HeaderOptions">
                                                            <span></span>
                                                            <h2>Daily</h2>
                                                            <button></button>
                                                        </div>
                                                        <ul>
                                                            <li><button onClick={DeleteDaily}>Excluir daily</button></li>
                                                        </ul>
                                                    </div>
                                                </div> :
                                                null}
                                        </></>

                                    :
                                    null
                                }
                            </>
                                : null
                            }
                        </div>
                    </div>
                </div>
            </>
        );
    }
    else {
        return (

            <>
                <div className="Dump-Page-Story-Dump-Bg"></div>
                <div className="Dump-Page-Story-Dump">
                    <div className="Top-Dump-Story">
                        {anotherStories}
                    </div>
                    <div className="Dump-Story-Actual">
                        <div className="Dump-Story-Top">
                            <div className="Dump-Button-wrapper">
                                <Link to={window.location.origin} className="Dump-Button-Close"><span><i className="fa-solid fa-xmark"></i></span></Link>
                            </div>
                            <div className="Dump-Story-Disabled">
                                {Loading ? <h2><LoadingContentWhite /></h2> : <h2>Esse daily está indisponível</h2>}
                            </div>

                            <div className="Dump-Story-Bottom">
                                <div className="Dump-User-LeftSide">
                                    {dataUser ?
                                        <>
                                            <Link to={window.location.origin + "/user/" + dataUser.$id}>
                                                <img src={dataUser.photoURL} />
                                                <div className="Dump-User-Content">
                                                    <h2>{dataUser.displayName}</h2>
                                                    <p>@{dataUser.username}</p>
                                                </div>
                                            </Link>

                                        </>
                                        :
                                        null
                                    }
                                </div>

                            </div>


                        </div>
                    </div>
                </div>
            </>
        )
    }

}
