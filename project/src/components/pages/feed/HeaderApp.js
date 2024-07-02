import React, { useEffect, useState } from 'react';
import '../../../style/feed.css'
import 'firebase/auth'
import { auth, provider, signInWithPopup, app, db, database } from '../../../lib/firebase'
import { addDoc, collection, doc, getFirebase, setDoc } from 'firebase/firestore'
import { signOutUser } from "../../../lib/firebase"
import Suggestions_User from './Suggestions_User';
import { useCollection } from 'react-firebase-hooks/firestore';
import firebase from "firebase/compat/app"
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { Link, useLocation } from 'react-router-dom';
import UserGet from '../../../lib/user';
import CreatePost from './CreatePost';

function gotoHome() {
    window.location.href = window.location.origin
}

export default function HeaderFeed(props) {

    const [openSettingsAccount, setopenSettingsAccount] = useState(false)

    const [AccountOptions, setAccountsOptions] = useState(false)
    const [notificationsNotSeen, setNotificationsNotSeen] = useState(false)

    const [i_ison, setUserOn] = useState('');


    useEffect(() => {
        auth.onAuthStateChanged(function (u) {
            setUserOn(u)
        })
    }, [])


    let ID_ACCOUNT = ''
    if (auth.currentUser) {
        ID_ACCOUNT = auth.currentUser.uid
    }

    const ID_ACCOUNT_I = UserGet()


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

    async function notificationUpShow() {
        if (!ID_ACCOUNT_I) {
            return
        }
        const res = await databases.listDocuments("64f9329a26b6d59ade09", "64fd4c66a7628f81bde8", [Query.limit(100), Query.equal("TO_UID", ID_ACCOUNT_I.$id), Query.orderDesc("$createdAt")]);

        if (res.documents.length > 0) {
            setNotificationsNotSeen(true)
        }
    }



    useEffect(() => {
        notificationUpShow()
    })

    if (window.location.href.includes("/accounts/login") || window.location.href.includes("/accounts/signup")) {
        return
    }

    return (

        <>
            <div onClick={closeaccountoptions} className='background-button'></div>
            <header aria-live="polite" role='navigation' className="App-Header-Feed FeedHeader">
                <div className="App-Header-Feed-LeftSide leftsideheader">
                    <Link to={window.location.origin}> <img src={window.location.origin + "/static/media/dumplogo.f3r818ht813gh78t13t.svg"} alt="Logo Dump" /></Link>
                    <div>
                        <div className="LeftSidePageHeader leftsidepagefeed">
                            <div className="LeftsideRedirect">
                                <Link className="Redirect" to={window.location.origin} title='Página Inicial' id={window.location.pathname === '/' ? 'selected' : ''}><i className="fa-solid fa-house"></i><span>Página Inicial</span></Link>
                            </div>
                            <div className="LeftsideRedirect" >
                                <Link to={window.location.origin + '/search'} className="Redirect" title='Explorar' id={window.location.pathname === '/search' ? 'selected' : ''}><i className="fa-solid fa-magnifying-glass"></i><span>Explorar</span></Link>
                            </div>
                            <div className="LeftsideRedirect" >
                                <Link to={window.location.origin + '/dreams'} className="Redirect" title='Explorar' id={window.location.href.includes('/dreams') ? 'selected' : ''}><i className="fa-solid fa-tv"></i><span>Dreams</span></Link>
                            </div>
                            <div className="LeftsideRedirect">
                                {ID_ACCOUNT_I ? <Link to={window.location.origin + "/notifications"} className="Redirect" title='Notificações'><i className="fa-solid fa-bell"></i><span>Notificações</span></Link> : ''}
                            </div>

                            <div className="LeftsideRedirect">
                                {ID_ACCOUNT_I ? <Link to={window.location.origin + '/saves'} className="Redirect" title='Salvos'><i className="fa-solid fa-bookmark"></i><span>Dumps Salvos</span></Link> : <></>}
                            </div>
                            <div className="LeftsideRedirect">
                                {ID_ACCOUNT_I ? <Link className="Redirect" title='Perfil' to={window.location.origin + '/user/' + ID_ACCOUNT_I.uid}><i className="fa-regular fa-user"></i><span>Perfil</span></Link> : <></>}
                            </div>
                            <div className="LeftsideRedirect">
                                {ID_ACCOUNT_I ? <Link to={window.location.origin + "/posts/create"} className="PublicarButton" title='Criar publicação'><span>Publicar</span></Link> : <></>}
                            </div>
                            <div className="LeftsideRedirect" >
                                {ID_ACCOUNT_I ? <Link to={window.location.origin + "/posts/create"} className="PublicarButtoniPad" title='Criar publicação'><span><i className="fa-solid fa-feather"></i></span></Link> : <></>}
                            </div>

                            <div className="account-div">
                                {ID_ACCOUNT_I ?
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
                                {ID_ACCOUNT_I ?
                                    <>


                                        {AccountOptions ?
                                            <div className='Account-Options-Box' onClick={() => { setAccountsOptions(false) }}>
                                                <div className='Account-Option'>
                                                    <Link to={window.location.origin + '/user/' + ID_ACCOUNT_I.uid}>
                                                        <p>Visualizar meu perfil</p>
                                                    </Link>
                                                </div>
                                                <div className='Account-Option'>
                                                    <Link onClick={signOutUser}>
                                                        <p id='endsession'>Finalizar sessão</p>
                                                    </Link>
                                                </div>
                                            </div>
                                            : null}

                                        <Link title='Sua conta' onClick={() => { AccountOptions ? setAccountsOptions(false) : setAccountsOptions(true) }} ><div className="account-div-flexbox">
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
                                    </>
                                    :
                                    <a href={window.location.origin + "/accounts/signup"}>
                                        <div className="account-off-div-flexbox" title='Fazer login'>
                                            <i className="fa-solid fa-right-to-bracket"></i>
                                            <div className='right-side-enter-account'>
                                                <h3 className="currentuser-displayname">
                                                    Faça seu login
                                                </h3>
                                                <p className="currentuser-id">
                                                    Entre agora para o dump
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                }

                            </div>

                        </div>
                    </div>
                </div>


                <div className="App-Header-Feed-RightSide rightsideheader">
                    <Link to={window.location.origin + "/notifications"}>
                        <i className="fa-regular fa-heart"></i>
                        {notificationsNotSeen ? <label className='notification-show'></label> : null}

                    </Link>
                    <Link to={window.location.origin + "/messages/inbox"}>
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_40_18)">
                                <path d="M31.7515 6.64362L6.36196 8.16759C5.36099 8.22951 4.40347 8.59863 3.61996 9.22464C2.83645 9.85064 2.26507 10.7031 1.98372 11.6657C1.70238 12.6283 1.72476 13.6542 2.04782 14.6037C2.37088 15.5531 2.97889 16.3798 3.78896 16.971L11.5296 22.5782C11.7117 22.7166 11.8644 22.89 11.9788 23.0881C12.0932 23.2863 12.167 23.5052 12.1958 23.7322L13.1815 33.2393C13.2664 34.0472 13.552 34.8211 14.0121 35.4906C14.4722 36.1601 15.0924 36.704 15.8162 37.0728C16.5399 37.4417 17.3444 37.6238 18.1565 37.6027C18.9686 37.5816 19.7626 37.3578 20.4662 36.9518C21.1213 36.5648 21.6816 36.0362 22.106 35.4046L36.1206 14.1786C36.6165 13.4235 36.8928 12.5456 36.9188 11.6426C36.9448 10.7397 36.7194 9.84724 36.2677 9.06494C35.816 8.28264 35.1559 7.64121 34.3609 7.21223C33.566 6.78325 32.6674 6.58358 31.7656 6.6355L31.7515 6.64362ZM33.3997 12.3908L19.3851 33.6168C19.1981 33.8904 18.9319 34.1003 18.6223 34.2183C18.3126 34.3363 17.9743 34.3569 17.6526 34.2772C17.331 34.1974 17.0414 34.0213 16.8227 33.7723C16.604 33.5233 16.4666 33.2135 16.429 32.8842L15.4293 23.3852C15.4146 23.2591 15.3925 23.1341 15.3631 23.0106L25.0594 17.4125C25.4326 17.197 25.705 16.842 25.8165 16.4257C25.928 16.0095 25.8697 15.5659 25.6542 15.1927C25.4387 14.8194 25.0837 14.5471 24.6675 14.4355C24.2512 14.324 23.8076 14.3824 23.4344 14.5979L13.7381 20.196C13.6459 20.1088 13.5486 20.0272 13.4468 19.9514L5.72025 14.3361C5.45391 14.1389 5.25422 13.865 5.14796 13.5511C5.0417 13.2373 5.03394 12.8984 5.12573 12.58C5.21753 12.2615 5.40448 11.9788 5.66152 11.7696C5.91857 11.5605 6.23341 11.4349 6.56385 11.4098L31.9534 9.8858C32.2521 9.87081 32.5492 9.93854 32.8118 10.0815C33.0745 10.2245 33.2926 10.4373 33.4422 10.6963C33.5917 10.9553 33.6669 11.2505 33.6594 11.5495C33.6519 11.8485 33.562 12.1396 33.3997 12.3908Z" fill="black" />
                            </g>
                            <defs>
                                <clipPath id="clip0_40_18">
                                    <rect width="39" height="39" fill="white" transform="translate(0.137451 0.137451)" />
                                </clipPath>
                            </defs>
                        </svg>
                    </Link>
                </div>
            </header>


            <header aria-live="polite" role='navigation' className='dump-mobile-header'>

                <div className='top-header-mobile'>
                    <img onClick={gotoHome} src={window.location.origin + "/static/media/dumplogo.f3r818ht813gh78t13t.svg"} alt="Logo Dump" />
                    <div className="top-header-mobile-icons-rightside rightsideheadermobile">
                        {/*ID_ACCOUNT_I ?
                            <Link id={window.location.pathname.includes('/posts/create') ? 'selected' : ''} to={window.location.origin + "/posts/create"}><i className="fa-solid fa-square-plus"></i></Link>
                            :
                            null
                        */}
                        {ID_ACCOUNT_I ?
                            <Link to={window.location.origin + "/notifications"}>
                                <i className="fa-regular fa-heart"></i>
                                {notificationsNotSeen ? <label className='notification-show'></label> : null}
                            </Link>
                            :
                            null
                        }


                        {/*i_ison && ID_ACCOUNT_I && ID_ACCOUNT_I.photoURL ? <img alt='Foto de perfil' src={ID_ACCOUNT_I.photoURL} /> : <></>*/}
                        {/* ID_ACCOUNT_I ? <img onClick={() => { setopenSettingsAccount(openSettingsAccount == false) }} src={ID_ACCOUNT_I.photoURL} /> : <></> */}
                        {ID_ACCOUNT_I && <Link to={window.location.origin + "/messages/inbox"}>
                            <svg width="35" height="26" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_40_18)">
                                    <path d="M31.7515 6.64362L6.36196 8.16759C5.36099 8.22951 4.40347 8.59863 3.61996 9.22464C2.83645 9.85064 2.26507 10.7031 1.98372 11.6657C1.70238 12.6283 1.72476 13.6542 2.04782 14.6037C2.37088 15.5531 2.97889 16.3798 3.78896 16.971L11.5296 22.5782C11.7117 22.7166 11.8644 22.89 11.9788 23.0881C12.0932 23.2863 12.167 23.5052 12.1958 23.7322L13.1815 33.2393C13.2664 34.0472 13.552 34.8211 14.0121 35.4906C14.4722 36.1601 15.0924 36.704 15.8162 37.0728C16.5399 37.4417 17.3444 37.6238 18.1565 37.6027C18.9686 37.5816 19.7626 37.3578 20.4662 36.9518C21.1213 36.5648 21.6816 36.0362 22.106 35.4046L36.1206 14.1786C36.6165 13.4235 36.8928 12.5456 36.9188 11.6426C36.9448 10.7397 36.7194 9.84724 36.2677 9.06494C35.816 8.28264 35.1559 7.64121 34.3609 7.21223C33.566 6.78325 32.6674 6.58358 31.7656 6.6355L31.7515 6.64362ZM33.3997 12.3908L19.3851 33.6168C19.1981 33.8904 18.9319 34.1003 18.6223 34.2183C18.3126 34.3363 17.9743 34.3569 17.6526 34.2772C17.331 34.1974 17.0414 34.0213 16.8227 33.7723C16.604 33.5233 16.4666 33.2135 16.429 32.8842L15.4293 23.3852C15.4146 23.2591 15.3925 23.1341 15.3631 23.0106L25.0594 17.4125C25.4326 17.197 25.705 16.842 25.8165 16.4257C25.928 16.0095 25.8697 15.5659 25.6542 15.1927C25.4387 14.8194 25.0837 14.5471 24.6675 14.4355C24.2512 14.324 23.8076 14.3824 23.4344 14.5979L13.7381 20.196C13.6459 20.1088 13.5486 20.0272 13.4468 19.9514L5.72025 14.3361C5.45391 14.1389 5.25422 13.865 5.14796 13.5511C5.0417 13.2373 5.03394 12.8984 5.12573 12.58C5.21753 12.2615 5.40448 11.9788 5.66152 11.7696C5.91857 11.5605 6.23341 11.4349 6.56385 11.4098L31.9534 9.8858C32.2521 9.87081 32.5492 9.93854 32.8118 10.0815C33.0745 10.2245 33.2926 10.4373 33.4422 10.6963C33.5917 10.9553 33.6669 11.2505 33.6594 11.5495C33.6519 11.8485 33.562 12.1396 33.3997 12.3908Z" fill="black" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_40_18">
                                        <rect width="25" height="25" fill="white" transform="translate(0.137451 0.137451)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </Link>}
                    </div>
                </div>
                {openSettingsAccount ?
                    <div className='Account-Options-Box' onClick={() => { setopenSettingsAccount(openSettingsAccount == false) }}>
                        <div className='Account-Option'>
                            <Link to={window.location.origin + '/user/' + ID_ACCOUNT_I.uid}>
                                <p>Visualizar meu perfil</p>
                            </Link>
                        </div>
                        <div className='Account-Option'>
                            <Link onClick={signOutUser}>
                                <p id='endsession'>Finalizar sessão</p>
                            </Link>
                        </div>
                    </div>
                    :
                    null
                }


            </header >
            <nav aria-live="polite" role='navigation' className='nav-bar-mobile'>
                <div>
                    <Link to={window.location.origin} id={window.location.pathname == '/' || window.location.pathname == '/following' ? 'selected' : ''}>
                        <svg width="35" height="35" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.1665 37.625V16.125L21.4998 5.375L35.8332 16.125V37.625H25.0832V25.0833H17.9165V37.625H7.1665Z" fill="black" />
                        </svg>
                    </Link>
                </div>

                <Link to={window.location.origin + '/search'} id={window.location.pathname == '/search' ? 'selected' : ''}>
                    <svg width="35" height="35" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.375 27.625L16.575 16.575L27.625 11.375L22.425 22.425L11.375 27.625ZM19.5 18.0375C19.1121 18.0375 18.7401 18.1916 18.4659 18.4659C18.1916 18.7401 18.0375 19.1121 18.0375 19.5C18.0375 19.8879 18.1916 20.2599 18.4659 20.5341C18.7401 20.8084 19.1121 20.9625 19.5 20.9625C19.8879 20.9625 20.2599 20.8084 20.5341 20.5341C20.8084 20.2599 20.9625 19.8879 20.9625 19.5C20.9625 19.1121 20.8084 18.7401 20.5341 18.4659C20.2599 18.1916 19.8879 18.0375 19.5 18.0375ZM19.5 3.25C21.634 3.25 23.7471 3.67032 25.7186 4.48696C27.6901 5.3036 29.4815 6.50056 30.9905 8.00951C32.4994 9.51847 33.6964 11.3099 34.513 13.2814C35.3297 15.2529 35.75 17.366 35.75 19.5C35.75 23.8098 34.038 27.943 30.9905 30.9905C27.943 34.038 23.8098 35.75 19.5 35.75C17.366 35.75 15.2529 35.3297 13.2814 34.513C11.3099 33.6964 9.51847 32.4994 8.00951 30.9905C4.96205 27.943 3.25 23.8098 3.25 19.5C3.25 15.1902 4.96205 11.057 8.00951 8.00951C11.057 4.96205 15.1902 3.25 19.5 3.25ZM19.5 6.5C16.0522 6.5 12.7456 7.86964 10.3076 10.3076C7.86964 12.7456 6.5 16.0522 6.5 19.5C6.5 22.9478 7.86964 26.2544 10.3076 28.6924C12.7456 31.1304 16.0522 32.5 19.5 32.5C22.9478 32.5 26.2544 31.1304 28.6924 28.6924C31.1304 26.2544 32.5 22.9478 32.5 19.5C32.5 16.0522 31.1304 12.7456 28.6924 10.3076C26.2544 7.86964 22.9478 6.5 19.5 6.5Z" fill="black" />
                    </svg>
                </Link>

                <span></span>
                <Link id="createNewPost" to={window.location.origin + "/posts/create"}>
                    <svg width="65" height="65" viewBox="0 0 69 69" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="34.5" cy="34.5" r="34.5" fill="#7CC0FF" />
                        <path d="M49.3333 35.3333H36.3333V48.3333H32V35.3333H19V31H32V18H36.3333V31H49.3333V35.3333Z" fill="white" />
                    </svg>

                </Link>
                <Link to={window.location.origin + "/dreams"}>
                    <svg width="35" height="35" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.32666 13.1217H34.6733M26.345 13.1217V4.79504M13.655 13.1217V4.79504M16.9 19.88V28.0834C16.9 28.2517 16.9533 28.4167 17.0517 28.56C17.1517 28.7017 17.2933 28.8167 17.4617 28.8917C17.6314 28.9655 17.817 28.9955 18.0013 28.9789C18.1856 28.9623 18.3628 28.8996 18.5167 28.7967L24.8467 24.38C24.9698 24.2948 25.0705 24.181 25.14 24.0484C25.2065 23.9207 25.2384 23.7778 25.2325 23.6339C25.2267 23.4901 25.1833 23.3503 25.1067 23.2284C25.0262 23.1011 24.9165 22.9948 24.7867 22.9184L18.4567 19.1317C18.3018 19.0417 18.1274 18.9909 17.9485 18.9836C17.7696 18.9764 17.5916 19.0129 17.43 19.09C17.274 19.1636 17.1405 19.2775 17.0433 19.42C16.9513 19.5559 16.9014 19.7159 16.9 19.88Z" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M25.4168 4.58337H14.5835C9.06065 4.58337 4.5835 9.06053 4.5835 14.5834V25.4167C4.5835 30.9396 9.06065 35.4167 14.5835 35.4167H25.4168C30.9397 35.4167 35.4168 30.9396 35.4168 25.4167V14.5834C35.4168 9.06053 30.9397 4.58337 25.4168 4.58337Z" stroke="black" stroke-width="3" />
                    </svg>
                </Link>
                {ID_ACCOUNT_I ?
                    <Link id={window.location.pathname.includes('/user') ? 'selected' : ''} to={window.location.origin + '/user/' + ID_ACCOUNT_I.uid}>
                        <img src={ID_ACCOUNT_I.photoURL} />
                    </Link>
                    :

                    <a id={window.location.pathname.includes('/user') ? 'selected' : ''} href={window.location.origin + "/accounts/signup"}>
                        <i className="fa-solid fa-right-to-bracket"></i>
                    </a>

                }
            </nav>





        </>
    )
}