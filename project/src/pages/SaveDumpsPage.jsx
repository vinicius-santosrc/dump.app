import { useEffect, useState } from "react"
import { HideLoading } from "../components/Loading"
import databases from "../lib/appwrite"
import { auth } from "../lib/firebase"
import { Query } from "appwrite"
import HeaderSaves from "../components/HeaderSaves"

export default function SaveDumpsPage() {
    const [Saves, setSaves] = useState(null)
    const [USER_LOG, setUSERATUAL] = useState(null)
    const [COLLECTIONfiltered, setCOLLECTIONfiltered] = useState(null)


    async function getPostsSaved() {
        const DB_UID = '64f9329a26b6d59ade09'
        const COL_POSTS_UID = '64f93c1c40d294e4f379'
        let USER_UID

        await databases.listDocuments(
            DB_UID,
            COL_POSTS_UID,
            [Query.limit(100)]
        )
            .then((response) => {
                if (auth.currentUser) {
                    USER_UID = auth.currentUser.uid
                }

                setSaves(response.documents.filter(e => e.saves.includes(USER_UID)).map((r) => {
                    return (
                        <div className="dump-posts-saved" id={r.$id}>
                            <a href={window.location.origin + '/posts/' + r.$id}>
                                <img src={r.filePost} />
                                <p>{r.legenda != '' ? r.legenda : 'Sem legenda'}</p>
                            </a>
                        </div>
                    )
                }))
                if (response.documents.filter(e => e.saves.includes(USER_UID)) == '') {
                    setSaves(
                        <>
                            <div className="dump-posts-saved-empty">
                                <img src='../static/media/undraw_walking_in_rain_jw4i.svg' />
                                <div className="dump-posts-saved-empty-bottom">
                                    <h2>Salve dumps para depois</h2>
                                    <p>Salve dumps para serem encontrados facilmente no futuro.</p>
                                </div>
                            </div>

                        </>
                    )
                }

            })
    }

    useEffect(() => {
        HideLoading()
    }, [])

    useEffect(() => {

        getPostsSaved()
        setInterval(() => {
            getPostsSaved()
        }, 2000);
        setInterval(() => {
            getPostsSaved()
        }, 4000);
        setInterval(() => {
            getPostsSaved()
        }, 6000);
    }, [])

    function changeInfoPage() {
        document.querySelector("title").innerText = `Saves | Dump`
    }
    changeInfoPage()

    return (
        <>
            <HeaderSaves />
            <div className="dump-posts-saved-flex">
                {Saves}
            </div>
        </>

    )
}