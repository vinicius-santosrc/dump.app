import { useEffect, useState } from "react"
import { HideLoading } from "../components/Loading"
import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../lib/firebase"
import databases from "../lib/appwrite"

export default function SearchPage() {
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

    return (
        <>
            <div className="dump-search-page">
                <div className="dump-input-top">
                    <input type="text" placeholder="Pesquisar" />
                </div>
            </div>
            <nav className='nav-bar-mobile'>
                <a onClick={gotoHomePage}><i className="fa-solid fa-house"></i></a>
                <a href={window.location.origin + '/search'}><i className="fa-solid fa-magnifying-glass"></i></a>

                {i_ison ? <a onClick={gotomyprofile}><img src={auth.currentUser.photoURL} /></a> : <><a href="./accounts/signup"><i className="fa-solid fa-circle-user"></i></a></>}
            </nav>
        </>
        
    )
}