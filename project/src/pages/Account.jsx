import { useEffect, useState } from "react";
import Header from "../components/Header";
import { HideLoading } from "../components/Loading";
import { useParams } from "react-router-dom";
import databases from "../lib/appwrite";
import { Query } from "appwrite";
import HeaderAccount from "../components/HeaderAccount";
import { auth, provider, signInWithPopup } from "../lib/firebase";

export default function Account() {
    const { ID_ACCOUNT } = useParams();

    const [ID_ACCOUNT_I, SetAccount] = useState(null)
    const [USERS_POSTS, setPostsofUser] = useState('')

    useEffect(() => {
        HideLoading()
        databases.getDocument(
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


    }, [ID_ACCOUNT])
    const [nofposts, setNumberofPosts] = useState()
    useEffect(() => {
        const getPostsofUser = async () => {
            await databases.listDocuments(
                "64f9329a26b6d59ade09",
                '64f93c1c40d294e4f379',
                [Query.orderDesc("$createdAt")]).catch((e) => {
                    console.log(e)
                }
            )
    
                .then((res) => {
                    if(!res.documents) {
                        return <>NADA ENCONTADO</>
                    }
                    setPostsofUser(res.documents.filter(r => r.email == ID_ACCOUNT_I.email).map((u) => {
                        setNumberofPosts(u.length)

                        function gotoPostSelect() {
                            window.location.href = `${window.location.origin}/posts/${u.$id}`
                        }
                    
                        return (
                            <>
                                <div className="dump-user-account" onClick={gotoPostSelect}>
                                    <img className="dump-image-show" alt={u.legenda} src={u.filePost} />
                                </div>
                            </>
                        )
                    }))
                })
                .catch((e) => {
                    console.log(e)
                })
        }
        getPostsofUser()
    })

    function gotomentions() {
        window.location.href = window.location.origin + '/user/' + ID_ACCOUNT + '/mentions'
    }

    function gotoHomePage() {
        window.location.href = window.location.origin
    }

    const [i_ison, setUserOn] = useState('')
    const SignWithGoogle = () => {
        signInWithPopup(auth, provider).then((i) => {
        })
    }

    useEffect(() => {
        auth.onAuthStateChanged(function (u) {
            setUserOn(u)
        })
    })

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

    if (!ID_ACCOUNT_I) {
        return (
            <>

                <div>Carregando...</div>
            </>
        );
    }

    return (
        <>
            <HeaderAccount />
            <div className="dump-account-page">

                <div className="dump-account-background">

                </div>
                <div className="dump-account-infos">
                    <div className="top-account">
                        <div className="leftside-account">
                            <img src={ID_ACCOUNT_I.photoURL} />
                            <div className="account-details">
                                <h1>{ID_ACCOUNT_I.displayName} {ID_ACCOUNT_I.isthisverifiqued == 'true' ? <><i alt="CONTA VERIFICADA" className="fa-solid fa-circle-check fa-fade verifyaccount" ></i></> : <></>}</h1>
                                <p>@{ID_ACCOUNT_I.username}</p>
                            </div>
                        </div>
                        <div className="rightside-account">
                            <div className="btns-links">
                                <button>SEGUIR</button>
                                <button><i className="fa-solid fa-inbox"></i></button>
                            </div>
                            <div className="followers-card">
                                <p>{0} seguidores</p>
                                <p>{0} seguindo</p>
                                <p>{nofposts} dumps</p>
                            </div>
                        </div>
                    </div>
                    <div className="middle-account-top">
                        <p>Sem descrição</p>

                    </div>
                </div>
                <div className="dumps-of-user">
                    <div className="selecttypeofpublic">
                        <label id="selected"><i className="fa-regular fa-image"></i> Dumps</label>
                        <label onClick={gotomentions}><i className="fa-solid fa-quote-left"></i> Menções</label>
                    </div>
                    <div className="dumps-account-user-show">
                        {USERS_POSTS}
                    </div>
                </div>
            </div>
            <nav className='nav-bar-mobile'>
                <a onClick={gotoHomePage}><i className="fa-solid fa-house"></i></a>
                <a><i className="fa-solid fa-magnifying-glass"></i></a>
                
                {i_ison ? <a onClick={gotomyprofile}><img src={auth.currentUser.photoURL} /></a> : <><a href="./accounts/signup"><i className="fa-solid fa-circle-user"></i></a></>}
            </nav>
        </>
    )
}