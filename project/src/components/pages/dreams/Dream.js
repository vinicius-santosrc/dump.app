import { useEffect, useState } from "react";
import { auth } from "../../../lib/firebase";
import { Link } from "react-router-dom";
import { databases } from "../../../lib/appwrite";


const DreamItem = ({ id, dream, targetUserId, createdBy, liked }) => {
    //COMPONENT DREAM

    const [likesCount, setLikesCount] = useState(null);
    const [DreamLiked, setDreamLiked] = useState(false);
    const [author, setAuthour] = useState([])

    function changeMuted(e) {
        if (e.target.paused) {
            e.target.play();
        } else {
            e.target.muted = !e.target.muted;
        }
    }

    async function checkDream() {
        try {
            const likes = dream.likes || [];
            const isLiked = likes.includes(targetUserId);

            setDreamLiked(isLiked);
            setLikesCount(likes.length);

            return isLiked;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    useEffect(() => {
        getAuthor()
        checkDream()
    }, [])

    async function getAuthor() {
        let author = await getAuth(createdBy);
        setAuthour(author)
    }

    async function likeDream() {
        setDreamLiked(true)
        try {

            const likes = dream.likes || [];

            if (likes.includes(targetUserId)) {
                return
            }

            likes.push(targetUserId);

            await databases.updateDocument(
                "64f9329a26b6d59ade09",
                "6598d0374c841ff2ed4e",
                id, {
                likes: likes,
            });

            checkDream()

            const NOT_DOC = '64fd4c66a7628f81bde8'
            const USERS_DOC = '64f93be88eee8bb83ec3'

            await databases.listDocuments(
                "64f9329a26b6d59ade09",
                USERS_DOC,
            )
                .then(response => {
                    /*
                    response.documents.filter(r => r.email == props.email).map((e) => {
                        sendNotification(publicacaoId, e.$id)
                    })
                     */
                }
                )



        } catch (error) {
            console.error('Erro ao seguir o usuário:', error);
            setDreamLiked(false)
        }
    }

    async function unlikeDream() {
        setDreamLiked(false);
        try {
            const likes = dream.likes || [];

            if (!likes.includes(targetUserId)) {
                return;
            }

            const likesUpdated = likes.filter((id) => id !== targetUserId);

            await databases.updateDocument(
                "64f9329a26b6d59ade09",
                "6598d0374c841ff2ed4e",
                id,
                {
                    likes: likesUpdated,
                }
            );



            setLikesCount(likesUpdated.length);



            // Agora, você pode chamar checkDream, se necessário
            // await checkDream();

        } catch (error) {
            console.error('Erro ao descurtir o dream:', error);

            // Reverter o estado se ocorrer um erro
            setDreamLiked(true);
        }
    }


    async function getAuth(id) {
        let auth = await databases.getDocument(
            "64f9329a26b6d59ade09",
            "64f93be88eee8bb83ec3",
            id
        )


        return auth
    }

    const handleLikeClick = async () => {
        if (DreamLiked) {
            return unlikeDream(dream)
        }
        return likeDream(dream)

    };

    if (author) {

        return (
            <div className="Dump-Dream-Page">
                <div className="Dream-Content">
                    <div className="DreamHeaderContent"></div>
                    <div className="DreamVideoContent">

                        <video
                            id="dreamContent"
                            
                            x-webkit-airplay=""
                            aria-hidden="true"
                            muted
                            onClick={(e) => {
                                changeMuted(e);
                            }}
                            onDoubleClick={null}
                            
                            autoPlay
                            playsInline
                            loop
                            preload="auto"
                            src={dream.dreamURL}
                            type="video/mp4" // Adicione o tipo do vídeo
                            
                        />
                    </div>
                    <div className="DreamRightSideCommands">
                        <div className="DreamButtonCommand">
                            {targetUserId ?
                                <div className="DumpButtonDiv">
                                    <button
                                        onClick={handleLikeClick}
                                        title={DreamLiked ? 'Descurtir' : 'Curtir'}
                                        aria-label={DreamLiked ? 'Descurtir o Dream' : 'Curtir o Dream'}
                                        className="DreamButtonWrapper"
                                    >
                                        <span>
                                            <i className={DreamLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                                        </span>
                                        <p>{likesCount}</p>
                                    </button>
                                </div>
                                :
                                null
                            }
                        </div>
                    </div>
                    <div className="DreamBottomVideoContent">
                        <Link to={window.location.origin + "/user/" + author.$id}>
                            <div className="DreamAuthorContents">
                                <img
                                    className="DreamCreatorImage-Wrapper"
                                    src={author.photoURL}
                                />
                                <div className="DreamUserName">
                                    <h2>{author.displayName}</h2>
                                    <p>@{author.username}</p>
                                </div>
                            </div>
                        </Link>
                        <div className="DreamLegenda">
                            <p>{dream.legenda}</p>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
};

export default DreamItem