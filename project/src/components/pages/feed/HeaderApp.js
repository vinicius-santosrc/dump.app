import React, { useEffect, useState } from 'react';
import '../../../style/feed.css'
import 'firebase/auth'
import { auth, provider, signInWithPopup, app, db, database } from '../../../lib/firebase'
import { addDoc, collection, doc, getFirebase, setDoc } from 'firebase/firestore'
import { signOutUser } from "../../../lib/firebase"
import Suggestions_User from './Suggestions_User';
import { useCollection } from 'react-firebase-hooks/firestore';
import firebase from "firebase/compat/app"
import databases from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { Link } from 'react-router-dom';

function gotoHome() {
    window.location.href = window.location.origin
}

function createnewpost() {
    document.querySelector('.createneewpost-card').style.display = 'block';
    document.querySelector('.background-posts').style.display = 'block';
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
            window.location.to=window.location.origin + '#/?user=' + yourprofile.data().username
        })
    })*/
}


function CurtidasList() {
    const CurrentUserId = auth.currentUser.uid

    const [notfy, setNot] = useState('')
    const [sender, setSENDER] = useState(null)

    async function getUserAtual2() {
        await databases.listDocuments(
            "64f9329a26b6d59ade09",
            "64fd4c66a7628f81bde8",
            [Query.orderDesc("$createdAt")]
        ).then((response) => {
            const DB_UID = '64f9329a26b6d59ade09'
            const USER_COL = '64f93be88eee8bb83ec3'

            response.documents.filter(e => e.TO_UID == CurrentUserId).map(async (notification) => {
                await databases.getDocument(
                    DB_UID,
                    USER_COL,
                    notification.SENDER_UID
                )
                    .then((sender) => {
                        getNoty(sender)
                    })

            })
        })
    }

    let prevScrollPos = window.pageYOffset;

    window.onscroll = function () {
        let currentScrollPos = window.pageYOffset;

        if (window.pageYOffset < 25) {
            return document.querySelector(".dump-mobile-header").style.top = "0";
        }

        if (prevScrollPos > currentScrollPos) {
            // O usuário está rolando para cima, mostramos o cabeçalho.
            document.querySelector(".dump-mobile-header").style.top = "0";
        } else {
            // O usuário está rolando para baixo, escondemos o cabeçalho.
            document.querySelector(".dump-mobile-header").style.top = "-100px"; // Pode ajustar a altura que desejar
        }

        prevScrollPos = currentScrollPos;
    }

    const getNoty = async (sender) => {
        await databases.listDocuments(
            "64f9329a26b6d59ade09",
            "64fd4c66a7628f81bde8",
            [
                Query.orderDesc("$createdAt")
            ]
        )
            .then(res => {
                if (res.documents.filter(e => e.TO_UID == CurrentUserId).length <= 0) {
                    setNot(
                        <div className='curtidas-null-dump'>
                            <img src="../static/media/undraw_void_-3-ggu.svg" />
                            <h2>Nada por aqui.</h2>
                            <p>Aqui aparecerão suas notificações.</p>
                        </div>
                    )
                }
                else {
                    setNot(res.documents.filter(e => e.TO_UID == CurrentUserId).map((not) => {
                        const datanotcriada = new Date(not.$createdAt)

                        const datanotcriadacomparar = Date(not.$createdAt)
                        const datahoje = new Date()

                        const mesdoPost = datanotcriada.getMonth()
                        const diadoPost = datanotcriada.getDate()

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

                        return (

                            <>
                                {not.ACTION == 'like'
                                    ?
                                    <div className='curtida-user-dump'>
                                        <Link  to={window.location.origin + '/posts/' + not.PHOTO_REL}>

                                            <div className='leftsidecontent-alert'>
                                                <img src={sender.photoURL} />
                                                <div className='content-name-curtida'>
                                                    <h2>{sender.username} {sender.isthisverifiqued == 'true' ? <><i alt="CONTA VERIFICADA" title='Verificado' className="fa-solid fa-circle-check fa-fade verifyaccount" ></i></> : <></>}</h2>
                                                </div>

                                            </div>
                                            <div className='contentalert'>
                                                <p>curtiu sua publicação'</p>
                                                <label>{datahoje == datanotcriadacomparar ?
                                                    'Hoje' :
                                                    `${diadoPost} de ${MesesDoAno[mesdoPost]} `
                                                }</label>
                                            </div>
                                            <div className='post_rel_content'>
                                                <img src={null} />
                                            </div>
                                        </Link>
                                    </div>
                                    :
                                    <>
                                        {not.ACTION == 'comment' ?
                                            <div className='curtida-user-dump'>
                                                <Link  to={window.location.origin + '/posts/' + not.PHOTO_REL}>

                                                    <div className='leftsidecontent-alert'>
                                                        <img src={sender.photoURL} />
                                                        <div className='content-name-curtida'>
                                                            <h2>{sender.username} {sender.isthisverifiqued == 'true' ? <><i alt="CONTA VERIFICADA" title='Verificado' className="fa-solid fa-circle-check fa-fade verifyaccount" ></i></> : <></>}</h2>

                                                        </div>

                                                    </div>
                                                    <div className='contentalert'>
                                                        <p>comentou em seu dump: {not.desc}</p>
                                                        <label>{datahoje == datanotcriadacomparar ?
                                                            'Hoje' :
                                                            `${diadoPost} de ${MesesDoAno[mesdoPost]} `
                                                        }</label>
                                                    </div>
                                                </Link>
                                            </div>
                                            :
                                            <>
                                                {not.ACTION == 'follow' ?
                                                    <div className='curtida-user-dump'>
                                                        <Link  to={window.location.origin + '/posts/' + not.PHOTO_REL}>
                                                            <div className='leftsidecontent-alert'>
                                                                <img src={sender.photoURL} />
                                                                <div className='content-name-curtida'>
                                                                    <h2>{sender.username} {sender.isthisverifiqued == 'true' ? <><i alt="CONTA VERIFICADA" title='Verificado' className="fa-solid fa-circle-check fa-fade verifyaccount" ></i></> : <></>}</h2>

                                                                </div>

                                                            </div>
                                                            <div className='contentalert'>
                                                                <p>começou a seguir você.</p>
                                                                <label>{datahoje == datanotcriadacomparar ?
                                                                    'Hoje' :
                                                                    `${diadoPost} de ${MesesDoAno[mesdoPost]} `
                                                                }</label>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                    :
                                                    ""
                                                }
                                            </>
                                        }
                                    </>}</>

                        )




                    }))
                }

            })
    }

    useEffect(() => {
        getUserAtual2()
    }, [])


    return notfy
}

function gotoHomePage() {
    {
        window.location.pathname == '/' ?
            window.scrollTo({
                top: 0,
                behavior: "smooth" // Comportamento de rolagem suave
            })
            :
            window.location.href = window.location.origin
    }


}

function openCurtidas() {
    document.querySelector(".curtidaspage-dump").classList.toggle('showcurtidas')
}

function fecharCurtidas() {
    document.querySelector(".curtidaspage-dump").classList.toggle('showcurtidas')



}



export default function HeaderFeed(props) {
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

    const [db_userison, Set_USER_IS_ON_VERIF] = useState('')

    function gotoLoginPage() {
        window.location.href = window.location.origin + '/accounts/signup'
    }

    let ID_ACCOUNT = ''
    if (auth.currentUser) {
        ID_ACCOUNT = auth.currentUser.uid
    }

    const [ID_ACCOUNT_I, SetAccount] = useState(null)

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

            })

    }

    useEffect(() => {
        getUserAtual()
    })

    function gotoSearch() {
        window.location.href = window.location.origin + '/search'
    }

    function gotoSaves() {
        window.location.href = window.location.origin + '/saves'
    }

    function gotomyprofilenav() {
        window.location.href = window.location.origin + '/user/' + ID_ACCOUNT_I.uid
    }

    function accountoptions() {
        document.querySelector(".account-div-options").style.display = 'block'
        document.querySelector(".background-button").style.display = 'block'
    }

    function closeaccountoptions() {
        document.querySelector(".account-div-options").style.display = 'none'
        document.querySelector(".background-button").style.display = 'none'
    }








    return (

        <>
            <div onClick={closeaccountoptions} className='background-button'></div>
            <header aria-live="polite" role='navigation' className="App-Header-Feed FeedHeader">
                <div className="App-Header-Feed-LeftSide leftsideheader">
                    <img onClick={gotoHome} src={window.location.origin + "/static/media/dumplogo.f3r818ht813gh78t13t.svg"} alt="Logo Dump" />
                    <div>
                        <div className="LeftSidePageHeader leftsidepagefeed">
                            <div className="LeftsideRedirect">
                                <Link  className="Redirect" to={window.location.origin} title='Página Inicial' id={window.location.pathname == '/' ? 'selected' : ''}><i className="fa-solid fa-house"></i><span>Página Inicial</span></Link>
                            </div>
                            <div className="LeftsideRedirect" >
                                <Link  to={window.location.origin + '/search'} className="Redirect" title='Pesquisar' id={window.location.pathname == '/search' ? 'selected' : ''}><i className="fa-solid fa-magnifying-glass"></i><span>Pesquisar</span></Link>
                            </div>
                            <div className="LeftsideRedirect" onClick={openCurtidas}>
                                {i_ison && ID_ACCOUNT_I ? <Link  className="Redirect" title='Notificações'><i className="fa-solid fa-bell"></i><span>Notificações</span></Link> : ''}
                            </div>
                            <div className="LeftsideRedirect">
                                {i_ison && ID_ACCOUNT_I ? <Link  to={window.location.origin + '/messages/inbox'} id={window.location.pathname == '/messages/inbox' ? 'selected' : ''} className="Redirect" title='Mensagens'><i className="fa-regular fa-comment-dots"></i><span>Mensagens</span></Link> : ''}
                            </div>
                            <div className="LeftsideRedirect">
                                {i_ison && ID_ACCOUNT_I ? <Link  to={window.location.origin + '/saves'} className="Redirect" title='Salvos'><i className="fa-solid fa-bookmark"></i><span>Dumps Salvos</span></Link> : <></>}
                            </div>
                            <div className="LeftsideRedirect">
                                {i_ison && ID_ACCOUNT_I ? <Link  className="Redirect" title='Perfil' to={window.location.origin + '/user/' + ID_ACCOUNT_I.uid}><i className="fa-regular fa-user"></i><span>Perfil</span></Link> : <></>}
                            </div>
                            <div className="LeftsideRedirect" onClick={createnewpost}>
                                {i_ison && ID_ACCOUNT_I && window.location.pathname == '/' || window.location.pathname == '/following' ? <Link  className="PublicarButton" title='Criar publicação'><span>Publicar</span></Link> : <></>}
                            </div>
                            <div className="LeftsideRedirect" onClick={createnewpost}>
                                {i_ison && ID_ACCOUNT_I && window.location.pathname == '/' || window.location.pathname == '/following' ? <Link  className="PublicarButtoniPad" title='Criar publicação'><span><i className="fa-solid fa-feather"></i></span></Link> : <></>}
                            </div>

                            <div className="account-div">
                                {i_ison && ID_ACCOUNT_I && auth.currentUser && auth.currentUser.uid ?
                                    <div className='account-div-options'>
                                        <div className='button-action-account'>
                                            <button onClick={gotomyprofilenav}>Ver sua conta</button>
                                        </div>
                                        <div className='button-action-account'>
                                            <button onClick={signOutUser}>Sair da sua conta</button>
                                        </div>

                                    </div>
                                    :
                                    <></>
                                }
                                {i_ison && ID_ACCOUNT_I && auth.currentUser && auth.currentUser.uid ?
                                    <Link  title='Sua conta' to={window.location.origin + '/user/' + ID_ACCOUNT_I.uid}><div className="account-div-flexbox">
                                        {ID_ACCOUNT_I.photoURL ? <img src={ID_ACCOUNT_I.photoURL} /> : <img></img>}
                                        <div className='leftside-account-dump-index'>
                                            {ID_ACCOUNT_I.displayName ?
                                                <div className='top-show-account'>
                                                    <h3 className="currentuser-displayname">{ID_ACCOUNT_I.displayName}</h3>
                                                    {ID_ACCOUNT_I.isthisverifiqued == 'true' ? <><i alt="CONTA VERIFICADA" title='Verificado' className="fa-solid fa-circle-check fa-fade verifyaccount" ></i></>
                                                        :
                                                        <></>
                                                    }
                                                </div>
                                                :
                                                <h3></h3>
                                            }
                                            {ID_ACCOUNT_I.username ? <p className="currentuser-id">@{ID_ACCOUNT_I.username}</p> : <p></p>}
                                        </div>
                                    </div></Link>
                                    :
                                    <div className="account-off-div-flexbox" title='Fazer login'>
                                        <i className="fa-solid fa-right-to-bracket"></i>
                                        <div className='right-side-enter-account' onClick={gotoLoginPage}>
                                            <h3 className="currentuser-displayname">
                                                Faça seu login
                                            </h3>
                                            <p className="currentuser-id">
                                                Entre agora para o dump
                                            </p>
                                        </div>
                                    </div>
                                }

                            </div>

                        </div>
                    </div>
                </div>
                {(window.location.href).includes("inbox") ?
                    <div aria-live="polite" role='navigation' className='dump-header-flexible-messagens'>
                        <div className='header-posts-msg'>
                            <Link  to={window.location.origin}><i className="fa-solid fa-arrow-left"></i></Link>
                            <h1>Mensagens</h1>
                        </div>

                    </div>
                    : <></>}
                <div aria-live="polite" role='navigation' className='dump-header-flexible'>
                    {window.location.pathname == '/' || window.location.pathname == '/following' ?
                        <>
                            <h1>Página Inicial</h1>
                            <div className='buttons-change-view'>
                                <div className='option-view' >
                                    <Link  to={window.location.pathname == '/' ? '#' : window.location.origin + '/'} id={window.location.pathname == '/' ? 'selectedview' : ''}>
                                        Para você
                                    </Link>
                                </div>
                                <div className='option-view'>
                                    <Link  to={window.location.pathname == '/following' ? '#' : window.location.origin + '/following'} id={window.location.pathname == '/following' ? 'selectedview' : ''}>
                                        Seguindo
                                    </Link>
                                </div>

                            </div>
                        </>
                        : <></>}
                    {window.location.pathname == '/search' ?
                        <>
                            <h1>Pesquisar</h1>
                            <div className='buttons-change-view'>
                                <div className='option-view' >
                                    <Link  id='selectedview'>
                                        Tudo
                                    </Link>
                                </div>
                                <div className='option-view'>
                                    <Link >
                                        Pessoas
                                    </Link>
                                </div>
                                <div className='option-view'>
                                    <Link >
                                        Posts
                                    </Link>
                                </div>

                            </div>
                        </>
                        : <></>}
                    {(window.location.href).includes("posts") ?
                        <>
                            <div className='header-posts'>
                                <Link  to={window.location.origin}><i className="fa-solid fa-arrow-left"></i></Link>
                                <h1>Post</h1>
                            </div>

                        </>
                        : <></>}

                    {(window.location.href).includes("user") ?
                        <>
                            <div className='header-posts'>
                                <Link  to={window.location.origin}><i className="fa-solid fa-arrow-left"></i></Link>
                                <div className='right-side-header-posts accountheader'>
                                    <h1>{props.username}</h1>
                                    <p>{props.dumps} dumps</p>
                                </div>
                            </div>

                        </>
                        : <></>}
                    {(window.location.href).includes("saves") ?
                        <>
                            <div className='header-posts'>

                                <div className='right-side-header-posts accountheader'>
                                    <h1>Dumps Salvos</h1>
                                    <p>{props.savesuername}</p>
                                </div>
                            </div>

                        </>
                        : <></>}
                    {(window.location.href).includes("accounts/edit") ?
                        <>
                            <div className='header-posts'>
                                <Link  to={auth.currentUser ? window.location.origin + "/user/" + auth.currentUser.uid : ""}><i className="fa-solid fa-arrow-left"></i></Link>
                                <div className='right-side-header-posts accountheader'>
                                    <h1>Editar perfil</h1>
                                </div>
                            </div>

                        </>
                        : <></>}
                </div>
                <div className="App-Header-Feed-RightSide rightsideheader">
                    <Link  onClick={openCurtidas}>
                        <i className="fa-regular fa-heart"></i>
                    </Link>
                    <Link  to="">
                        <i className="fa-regular fa-comment-dots"></i>
                    </Link>
                </div>
            </header>
            <header aria-live="polite" role='navigation' className='dump-mobile-header'>
                {(window.location.href).includes("user") || (window.location.href).includes("saves") || (window.location.href).includes("edit") || (window.location.href).includes("posts") ? <></> :
                    <div className='top-header-mobile'>
                        <img onClick={gotoHome} src={window.location.origin + "/static/media/dumplogo.f3r818ht813gh78t13t.svg"} alt="Logo Dump" />
                        <div className="top-header-mobile-icons-rightside rightsideheadermobile">
                            <Link  onClick={openCurtidas}>
                                <i className="fa-regular fa-heart"></i>
                            </Link>
                            <Link  to={window.location.origin + '/messages/inbox'}>
                                <i className="fa-regular fa-comment-dots"></i>
                            </Link>
                            {/*i_ison && ID_ACCOUNT_I && ID_ACCOUNT_I.photoURL ? <img alt='Foto de perfil' src={ID_ACCOUNT_I.photoURL} /> : <></>*/}
                            {i_ison && ID_ACCOUNT_I && ID_ACCOUNT_I.photoURL ? <img src={ID_ACCOUNT_I.photoURL} /> : <></>}
                        </div>
                    </div>}
                {window.location.pathname == '/' ?
                    <div className='bottom-header-mobile'>
                        <div className='option-feed-show'>
                            <Link  id='selected'>Para você</Link>
                        </div>
                        <div className='option-feed-show'>
                            <Link  to={window.location.origin + "/following"}>Seguindo</Link>
                        </div>

                    </div> : ''}
                {window.location.pathname == '/search' ?
                    <div className='bottom-header-mobile'>
                        <div className='option-feed-show'>
                            <Link  id='selected'>Tudo</Link>
                        </div>
                        <div className='option-feed-show'>
                            <Link >Pessoas</Link>
                        </div>
                        <div className='option-feed-show'>
                            <Link >Publicações</Link>
                        </div>

                    </div> : ''
                }
                {window.location.pathname == '/following' ?
                    <div className='bottom-header-mobile'>
                        <div className='option-feed-show'>
                            <Link  to={window.location.origin}>Para você</Link>
                        </div>
                        <div className='option-feed-show'>
                            <Link  id='selected'>Seguindo</Link>
                        </div>

                    </div> : ''
                }
                {(window.location.href).includes("user") ?
                    (
                        <>
                            <div className='header-posts'>
                                <Link  to={window.location.origin}><i className="fa-solid fa-arrow-left"></i></Link>
                                <div className='right-side-header-posts accountheader'>
                                    <h1>{props.username}</h1>
                                    <p>{props.dumps} dumps</p>
                                </div>
                            </div>
                        </>)
                    :

                    <></>}
                {(window.location.href).includes("saves") ?
                    (
                        <>
                            <div className='header-posts'>
                                <Link  to={window.location.origin}><i className="fa-solid fa-arrow-left"></i></Link>
                                <div className='right-side-header-posts accountheader'>
                                    <h1>Dumps Salvos</h1>
                                    <p>{props.savesuername}</p>
                                </div>
                            </div>
                        </>)
                    :

                    <></>}
                {(window.location.href).includes("posts") ?
                    (
                        <>
                            <div className='header-posts'>
                                <Link  to={window.location.origin}><i className="fa-solid fa-arrow-left"></i></Link>
                                <div className='right-side-header-posts accountheader'>
                                    <h1>Post</h1>

                                </div>
                            </div>
                        </>)
                    :

                    <></>}
                {(window.location.href).includes("accounts/edit") ?
                    (
                        <>
                            <div className='header-posts'>
                                <Link  to={window.location.origin + "/user/" + auth.currentUser.uid}><i className="fa-solid fa-arrow-left"></i></Link>
                                <div className='right-side-header-posts accountheader'>
                                    <h1>Editar perfil</h1>

                                </div>
                            </div>
                        </>)
                    :

                    <></>}


            </header >
            <nav aria-live="polite" role='navigation' className='nav-bar-mobile'>
                <div>
                    <Link  onClick={gotoHomePage} id={window.location.pathname == '/' || window.location.pathname == '/following' ? 'selected' : ''}><i className="fa-solid fa-house"></i></Link>
                </div>

                <Link  to={window.location.origin + '/search'} id={window.location.pathname == '/search' ? 'selected' : ''}><i className="fa-solid fa-magnifying-glass"></i></Link>
                {i_ison && ID_ACCOUNT_I ? <Link  onClick={createnewpost}><i className="fa-solid fa-square-plus"></i></Link> : <></>}
                {i_ison && ID_ACCOUNT_I ? <Link  to={window.location.origin + '/saves'}><i className="fa-solid fa-bookmark"></i></Link> : ''}
                {i_ison && ID_ACCOUNT_I && ID_ACCOUNT_I.photoURL ? <Link  to={window.location.origin + '/user/' + ID_ACCOUNT_I.uid}><img src={ID_ACCOUNT_I.photoURL} /></Link> : <><Link  to="./accounts/signup"><i className="fa-solid fa-circle-user"></i></Link></>}
            </nav>
            <div className='curtidaspage-dump'>
                <div className='curtidasheader'>

                    <button onClick={fecharCurtidas}>
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <h2>Notificações</h2>

                    {i_ison && ID_ACCOUNT_I && ID_ACCOUNT_I.photoURL ? <img src={ID_ACCOUNT_I.photoURL} /> : <></>}



                </div>
                {i_ison ? <CurtidasList /> : <>
                    <div className='curtidas-null-dump'>
                        <img src="../static/media/undraw_void_-3-ggu.svg" />
                        <h2>Nada por aqui.</h2>
                        <p>Aqui aparecerão suas notificações.</p>
                    </div>
                </>}
            </div>
        </>
    )
}