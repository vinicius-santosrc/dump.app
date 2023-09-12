import { useEffect, useState } from "react";
import Header from "../components/Header";
import { HideLoading } from "../components/Loading";
import databases from "../lib/appwrite";
import { useParams } from "react-router-dom";
import HeaderFeed from "../components/pages/feed/HeaderApp";

export default function PostDetails() {
    const { idPost } = useParams();
    const [publicacao, setPublicacao] = useState(null);

    useEffect(() => {
        HideLoading()
        databases.getDocument(
            "64f9329a26b6d59ade09",
            '64f93c1c40d294e4f379',
            idPost
        )
            .then((response) => {
                console.log('sucesso')
                setPublicacao(response)
            })
            .catch((e) => {
                console.log(e)
            })
    }, [idPost])

    if (!publicacao) {
        return (
            <>
                <HeaderFeed />
                <div>Carregando...</div>
            </>
        );
    }

    return (
        <>
        <div className="dump-post-show-pc">
            <div className="dump-post-show">
                <img src={publicacao.filePost} />
            </div>
        </div>
        <div className="dump-post-show-mobile">
            <div className="dump-post-show">
                <div className="dump-post-header-show">
                    <a href='../'><i className="fa-solid fa-chevron-left"></i></a>
                    <img src='../static/media/dumplogo.f3r818ht813gh78t13t.webp' />
                    <label><i className="fa-solid fa-ellipsis"></i></label>
                </div>
                <div className="dump-post-img-inner">
                    <div className="dump-post-topimage">
                        <img src={publicacao.filePost} />
                    </div>
                    <div className="dump-post-middle-bottom-img">
                        <div className="flex-dump-info-image">
                            <div className="info-user-dump-post">
                                <h1>{publicacao.displayName}</h1>
                            </div>
                        </div>
                        <div className="bottom-desc">
                                <p>{publicacao.legenda}</p>
                            </div>
                    </div>
                </div>

            </div>
        </div>
        </>
    );
}