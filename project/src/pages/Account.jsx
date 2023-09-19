import { useEffect, useState } from "react";
import Header from "../components/Header";
import { HideLoading } from "../components/Loading";
import { useParams } from "react-router-dom";
import databases from "../lib/appwrite";
import { Query } from "appwrite";
import HeaderAccount from "../components/HeaderAccount";
import { auth, provider, signInWithPopup } from "../lib/firebase";
import { Ring } from '@uiball/loaders'
import Swal from 'sweetalert2'


export default function Account() {
    const { ID_ACCOUNT } = useParams();
    const [nofposts, setNumberofPosts] = useState()
    const [ID_ACCOUNT_I, SetAccount] = useState(null)
    const [USERS_POSTS, setPostsofUser] = useState('')
    const userUID = auth.currentUser
    const [isFollowing, setIsFollow] = useState(null)
    const [listofFollowers, setListOfFollowers] = useState("")


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

    useEffect(() => {
        checkIfFollowsUser()
    })

    useEffect(() => {

        const getPostsofUser = async () => {
            await databases.listDocuments(
                "64f9329a26b6d59ade09",
                '64f93c1c40d294e4f379',
                [Query.limit(100),
                Query.orderDesc("$createdAt")])

                .catch((e) => {
                    console.log(e)
                }
                )

                .then((res) => {
                    if (!res.documents) {
                        return <>NADA ENCONTADO</>
                    }
                    const nofpots = res.documents.filter(r => r.email == ID_ACCOUNT_I.email).length
                    setNumberofPosts(nofpots)

                    setPostsofUser(res.documents.filter(r => r.email == ID_ACCOUNT_I.email).map((u) => {
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
    }, [])

    function ButtonActionProfile() {
        checkIfFollowsUser()
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

    if (!ID_ACCOUNT_I) {
        return (
            <>
            <Header />
                <div className="loading-inner">
                    <Ring
                        size={40}
                        lineWeight={5}
                        speed={2}
                        color="black"
                    />
                </div>
            </>
        );
    }

    function changeInfoPage() {
        document.querySelector("title").innerText = `${ID_ACCOUNT_I.displayName} (@${ID_ACCOUNT_I.username}) | Dump`
    }
    changeInfoPage()

    function backtoprofile() {
        let url = (window.location.href).replace('/mentions', '')
        window.location.href = url
    }

    let targetUserId

    if (auth.currentUser) {
        targetUserId = auth.currentUser.uid;
    }




    const userId = ID_ACCOUNT_I.uid;

    const userDocument = databases.getDocument('64f9329a26b6d59ade09', '64f93be88eee8bb83ec3', userId);

    const followers = userDocument.followers || [];

    const DB_UID = '64f9329a26b6d59ade09'
    const COL_UID = '64f93be88eee8bb83ec3'

    async function checkIfFollowsUser() {

        try {
            // Obtenha o documento do usuário
            const user = await databases.getDocument(
                DB_UID,
                COL_UID,
                userId);

            setListOfFollowers(user.followers)

            if (!user) {
                document.querySelector(".loading-btn").style.display = 'block'
            }

            const followers = user.followers || [];

            if (followers.includes(targetUserId)) {

                setIsFollow(true)
                return true;
            } else {

                setIsFollow(false)
                return false;
            }
        } catch (error) {
            setIsFollow(false)
            console.log(error)
            return false;
        }
    }



    // Função para verificar se um usuário segue outro
    async function followUser() {
        function esconderbotoes() {
            document.querySelector(".btns-links button").style.display = 'none'
            document.querySelector(".loading-btn").style.display = 'block'
        }
        function voltarbotoes() {
            document.querySelector(".btns-links button").style.display = 'block'
            document.querySelector(".loading-btn").style.display = 'none'
        }

        esconderbotoes()

        try {
            const userDocument = await databases.getDocument('64f9329a26b6d59ade09', '64f93be88eee8bb83ec3', userId);

            const followers = userDocument.followers || [];

            if (followers.includes(targetUserId)) {
                alert('você já está seguindo')
                voltarbotoes()
                return;
            }

            followers.push(targetUserId);

            await databases.updateDocument('64f9329a26b6d59ade09',
                '64f93be88eee8bb83ec3',
                userId, {
                followers: followers,
            });

            ButtonActionProfile()

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Você começou a seguir.',
                showConfirmButton: false,
                timer: 1500
            })
            voltarbotoes()
        } catch (error) {
            console.error('Erro ao seguir o usuário:', error);
        }
    } // Substitua pelo ID do usuário autenticado

    // Função para parar de seguir um usuário
    async function unfollowUser() {
        function esconderbotoes() {
            document.querySelector(".btns-links button").style.display = 'none'
            document.querySelector(".loading-btn").style.display = 'block'
        }
        function voltarbotoes() {
            document.querySelector(".btns-links button").style.display = 'block'
            document.querySelector(".loading-btn").style.display = 'none'
        }

        esconderbotoes()
        try {
            const userDocument = await databases.getDocument('64f9329a26b6d59ade09', '64f93be88eee8bb83ec3', userId);

            const followers = userDocument.followers || [];

            if (!followers.includes(targetUserId)) {
                console.log('Você não está seguindo este usuário.');
                voltarbotoes()
                return;
            }

            const updatedFollowers = followers.filter((id) => id !== targetUserId);

            await databases.updateDocument('64f9329a26b6d59ade09', '64f93be88eee8bb83ec3', userId, {
                followers: updatedFollowers,
            });

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Você parou de seguir.',
                showConfirmButton: false,
                timer: 1500
            })
            voltarbotoes()
            ButtonActionProfile()
        } catch (error) {
            console.error('Erro ao parar de seguir o usuário:', error);
        }
    }


    function editmyprofile_btn() {
        window.location.href = `${window.location.origin}/accounts/edit/`
    }

    function openseguidorescard() {

    }

    function closeimageprofile() {
        document.querySelector(".photosizePLUS").style.display = 'none'
        document.querySelector(".BACKGROUND-CLOSE").style.display = 'none'
    }

    function openphotoprofile() {
        document.querySelector(".photosizePLUS").style.display = 'block'
        document.querySelector(".BACKGROUND-CLOSE").style.display = 'block'
    }

    const followersofUser = '' //(ID_ACCOUNT_I.followers).length
    const followingOfUser = '' //(ID_ACCOUNT_I.following).length


    return (
        <>
            <HeaderAccount />
            <div className="photosizePLUS">
                <img alt={`Foto de perfil de @${ID_ACCOUNT_I.username}`} src={ID_ACCOUNT_I.photoURL} />
            </div>
            <div className="BACKGROUND-CLOSE" onClick={closeimageprofile}>
                <div className="button-close-profile-image">
                    <button onClick={closeimageprofile}><i className="fa-solid fa-chevron-left"></i></button>
                </div>
            </div>
            <div className="dump-account-page">


                <div className="dump-account-background">

                </div>
                <div className="dump-account-infos">

                    <div className="top-account">

                        <div className="leftside-account">
                            <img onClick={openphotoprofile} src={ID_ACCOUNT_I.photoURL} />
                            <div className="account-details">
                                <h1>{ID_ACCOUNT_I.displayName} {ID_ACCOUNT_I.isthisverifiqued == 'true' ? <><i alt="CONTA VERIFICADA" className="fa-solid fa-circle-check fa-fade verifyaccount" ></i></> : <></>}</h1>
                                <p>@{ID_ACCOUNT_I.username}</p>
                            </div>
                        </div>
                        <div className="rightside-account">
                            <div className="btns-links">
                                {userUID && userUID.uid == ID_ACCOUNT_I.uid ?
                                    <button onClick={editmyprofile_btn}>EDITAR PERFIL</button>
                                    :
                                    <>
                                        {isFollowing ?
                                            <button onClick={unfollowUser} id="following-user">Seguindo <i className="fa-solid fa-user-check"></i></button>
                                            :
                                            <button onClick={followUser}>Seguir</button>
                                        }

                                    </>
                                }
                                <button className="loading-btn">
                                    <Ring
                                        size={40}
                                        lineWeight={5}
                                        speed={2}
                                        color="black"
                                    />
                                </button>
                                <button><i className="fa-solid fa-inbox"></i></button>

                            </div>
                            <div className="followers-card">
                                <p onClick={openseguidorescard}>{followersofUser} seguidores</p>
                                <p>{followingOfUser} seguindo</p>
                                <p>{nofposts} dumps</p>
                            </div>
                            <div className="followers-card-show-users">
                                <header className="header-seguidores">
                                    <div className="text-header-dump">
                                        <h2>Seguidores de @{ID_ACCOUNT_I.username}</h2>
                                    </div>
                                </header>
                                <div className="list-of-followers">
                                    {/*

                                        (listofFollowers).map((item => {
                                            databases.getDocument(
                                                "64f9329a26b6d59ade09",
                                                '64f93be88eee8bb83ec3',
                                                item
                                            ).then((e) => {
                                                return (
                                                    <div className="follower-dump-user">
                                                        <img src={e.photoURL} />
                                                        <h2>{e.displayName}</h2>
                                                        <p>@{e.username}</p>
                                                    </div>
                                                )
                                            })
                                        }))
                                    */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="middle-account-top">
                        <p>{ID_ACCOUNT_I.bio}</p>
                        <a className="link_above" href={ID_ACCOUNT_I.link_above} target="_blank">{ID_ACCOUNT_I.link_above}</a>
                    </div>
                </div>
                <div className="dumps-of-user">
                    <div className="selecttypeofpublic">
                        {window.location.pathname == `/user/${ID_ACCOUNT_I.uid}/mentions` ?

                            <>
                                <label onClick={backtoprofile}><i className="fa-regular fa-image"></i> Dumps</label>
                                <label id="selected"><i className="fa-solid fa-quote-left"></i> Menções</label>
                            </>
                            :
                            <>
                                <label id="selected"><i className="fa-regular fa-image"></i> Dumps</label>
                                <label onClick={gotomentions}><i className="fa-solid fa-quote-left"></i> Menções</label>
                            </>
                        }
                    </div>
                    {ID_ACCOUNT_I.private == true ?
                        <>{ID_ACCOUNT_I.private == true && auth.currentUser && auth.currentUser.uid == ID_ACCOUNT_I.uid ?
                            <>
                                <label id="youraccountislocked">Sua conta está privada.</label>
                            </>
                            :
                            <></>
                        }</>
                        :
                        <></>
                    }
                    <div className="dumps-account-user-show">


                        {ID_ACCOUNT_I.private == true ?
                            <>{ID_ACCOUNT_I.private == true && auth.currentUser && auth.currentUser.uid == ID_ACCOUNT_I.uid || ID_ACCOUNT_I.followers.includes(targetUserId) ?
                                <>
                                    {USERS_POSTS}
                                </>
                                :
                                <div className="private-account">
                                    <i className="fa-solid fa-lock"></i>
                                    <p>
                                        Conta privada
                                    </p>
                                    <p>Para acessar seus dumps, siga esse usuário.</p>
                                </div>

                            }</>
                            :
                            <>{USERS_POSTS}</>
                        }



                    </div>
                </div>
            </div>
            <nav className='nav-bar-mobile'>
                <a onClick={gotoHomePage}><i className="fa-solid fa-house"></i></a>
                <a href={window.location.origin + '/search'}><i className="fa-solid fa-magnifying-glass"></i></a>
                {i_ison ? <a href={window.location.origin + '/saves'}><i className="fa-solid fa-bookmark"></i></a> : ''}
                {i_ison ? <a onClick={gotomyprofile}><img src={auth.currentUser.photoURL} /></a> : <><a href="./accounts/signup"><i className="fa-solid fa-circle-user"></i></a></>}
            </nav>
        </>
    )
}