import { useEffect, useState } from "react"

import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../lib/firebase"
import {databases} from "../lib/appwrite"
import HeaderFeed from "../components/pages/feed/HeaderApp"

import axios from 'axios';
import Suggestions from "../components/pages/feed/Suggestions"
import { Query } from "appwrite"
import { Link } from "react-router-dom"

export default function SearchPage() {
    const [ID_ACCOUNT_I, SetAccount] = useState(null)
    const [SearchPeople, setSearchPeople] = useState("")
    const [SugesstPub, setPublicoes] = useState('')

    let ID_ACCOUNT = ''
    if (auth.currentUser) {
        ID_ACCOUNT = auth.currentUser.uid
    }

    const getUserAtual = async () => {
        await databases.getDocument(
            "64f9329a26b6d59ade09",
            "64f93be88eee8bb83ec3",
            ID_ACCOUNT
        )
            .then((response) => {
                SetAccount(response)

            })
            .catch((e) => {
                console.log(e)
            })

    }

    useEffect(() => {
        getUserAtual()
    })


    useEffect(() => {
        searchpeople()
    }, [])


    const [i_ison, setUserOn] = useState('')
    const SignWithGoogle = () => {
        signInWithPopup(auth, provider).then((i) => {
        })
    }



    useEffect(() => {
        auth.onAuthStateChanged(function (u) {
            setUserOn(u)
        })
    }, [])

    async function searchpeople() {

        const inputsearch = document.querySelector(".search-input")
        const DB_ID = '64f9329a26b6d59ade09'
        const COLLECTION_ID = '64f93be88eee8bb83ec3'


        if (inputsearch.value == '') {
            document.querySelector("title").innerText = `Dump`
        }
        else {
            document.querySelector("title").innerText = `${inputsearch.value} - Pesquisa | Dump`
        }

        procurarPosts()

        await databases.listDocuments(
            DB_ID,
            COLLECTION_ID,
            [
                Query.limit(300),
                Query.orderDesc("$createdAt")
            ]
        )
            .then((e) => {
                setSearchPeople(e.documents.filter(e => e.username.includes((inputsearch.value).toLowerCase())).slice(0, 6).map((i) => {
                    return (
                        <div className="dump-user-search">
                            <Link to={window.location.origin + '/user/' + i.uid}>
                                <img src={i.photoURL} />
                                <div className="rightside-dump-user-search">
                                    <h2>{i.displayName} {i.isthisverifiqued == 'true' ? <><i alt="CONTA VERIFICADA" title='Verificado' className="fa-solid fa-circle-check fa-fade verifyaccount" ></i></> : <></>}</h2>
                                    <p>@{i.username}</p>
                                </div>
                            </Link>
                        </div>
                    )
                }

                )
                )
                if (inputsearch.value == '') {
                    document.querySelector("title").innerText = `Dump`
                }
                else {
                    document.querySelector("title").innerText = `${inputsearch.value} - Pesquisa | Dump`
                }
            })

        async function procurarPosts() {
            const inputsearch = document.querySelector(".search-input")
            const DB_ID = '64f9329a26b6d59ade09'
            const POSTS_ID = '64f93c1c40d294e4f379'


            if (inputsearch.value == '') {
                document.querySelector("title").innerText = `Dump`
            }
            else {
                document.querySelector("title").innerText = `${inputsearch.value} - Pesquisa | Dump`
            }


            await databases.listDocuments(
                DB_ID,
                POSTS_ID,
                [
                    Query.limit(300),
                    Query.orderDesc("$createdAt")
                ]
            )
                .then((r) => {
                    setPublicoes(r.documents.filter(r => r.legenda.includes((inputsearch.value).toLowerCase())).slice(0, 6).map((i) => {
                        return (
                            <div className="dump-user-posts-search">
                                <Link to={window.location.origin + "/posts/" + i.$id}>
                                    <img src={i.filePost} />
                                </Link>
                            </div>
                        )
                    }

                    )
                    )
                })
        }


    }


    return (
        <>
 
            <Suggestions />
            <div className="dump-search-page">
                <div className="dump-input-top">
                    <input type="text"
                        onChange={searchpeople}
                        className="search-input"
                        placeholder="Buscar"
                    />
                    <button onClick={searchpeople}>Procurar</button>
                </div>
                <div className="filters-search">
                    <h2>Publicações</h2>
                </div>
                <div className="suggest-publicacoes">
                    {SugesstPub}
                </div>
                <div className="filters-search">
                    <h2>Usuários</h2>
                </div>
                <div className="dump-flexbox-show-people">
                    {SearchPeople}
                </div>

            </div>

        </>

    )
}