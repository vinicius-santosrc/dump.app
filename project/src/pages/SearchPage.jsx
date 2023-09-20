import { useEffect, useState } from "react"
import { HideLoading } from "../components/Loading"
import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../lib/firebase"
import databases from "../lib/appwrite"
import HeaderFeed from "../components/pages/feed/HeaderApp"
import { Query } from "appwrite"

export default function SearchPage() {
    const [ID_ACCOUNT_I, SetAccount] = useState(null)
    const [SearchPeople, setSearchPeople] = useState("")

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
        HideLoading()
    }, [])

    function gotoHomePage() {
        window.location.href = window.location.origin
    }
    const [i_ison, setUserOn] = useState('')
    const SignWithGoogle = () => {
        signInWithPopup(auth, provider).then((i) => {
        })
    }

    const gotomyprofile = () => {

        const getprofile = async () => {

            await databases.listDocuments(
                "64f9329a26b6d59ade09",
                "64f93be88eee8bb83ec3"
            ).then((res) => {
                res.documents.filter(a => a.uid == auth.currentUser.uid).map((r) => {
                    window.location.href = `${window.location.origin}/user/${r.$id}`
                })
            })
        }
        getprofile()

        /*database
        .collection('users')
        .where('uid' , '==', auth.currentUser.uid)
        .get()
        .then(s => {
            s.docs.map(yourprofile => {
                window.location.href=window.location.origin + '#/?user=' + yourprofile.data().username
            })
        })*/
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

        await databases.listDocuments(
            DB_ID,
            COLLECTION_ID


        )
            .then((e) => {
                setSearchPeople(e.documents.filter(e => e.username.includes(inputsearch.value.trim())).map((i) => {
                    return (
                        <div className="dump-user-search">
                            <a href={window.location.origin + '/user/' + i.uid}>
                            <img src={i.photoURL} />
                            <h2>{i.displayName} {i.isthisverifiqued == 'true' ? <><i alt="CONTA VERIFICADA" title='Verificado' className="fa-solid fa-circle-check fa-fade verifyaccount" ></i></> : <></>}</h2>
                            <p>@{i.username}</p>
                            </a>
                        </div>
                    )
                }
                )
                )

            })



    }

    return (
        <>
            <HeaderFeed />
            <div className="dump-search-page">
                <div className="dump-input-top">
                    <input type="text" className="search-input" placeholder="Pesquisar (username)" />
                    <button onClick={searchpeople}>Procurar</button>
                </div>
                <div className="filters-search">
                    <label>Pessoas</label>
                </div>
                <div className="dump-flexbox-show-people">
                    {SearchPeople}
                </div>
                
            </div>
            <nav className='nav-bar-mobile'>
                <a onClick={gotoHomePage}><i className="fa-solid fa-house"></i></a>
                <a href={window.location.origin + '/search'}><i className="fa-solid fa-magnifying-glass"></i></a>
                {i_ison ? <a href={window.location.origin + '/saves'}><i className="fa-solid fa-bookmark"></i></a> : ''}
                {i_ison && ID_ACCOUNT_I && ID_ACCOUNT_I.photoURL ? <a href={window.location.origin + '/user/' + ID_ACCOUNT_I.uid}><img src={ID_ACCOUNT_I.photoURL} /></a> : <><a href="./accounts/signup"><i className="fa-solid fa-circle-user"></i></a></>}
            </nav>
        </>

    )
}