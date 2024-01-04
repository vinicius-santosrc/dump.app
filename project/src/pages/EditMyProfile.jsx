import { useEffect, useState } from "react";
import HeaderAccount from "../components/HeaderAccount";

import { auth, storage } from "../lib/firebase";
import { updateProfile } from "firebase/auth";
import { databases, storageWrite } from "../lib/appwrite";
import { Ring } from '@uiball/loaders'
import HeaderFeed from "../components/pages/feed/HeaderApp";
import Suggestions from "../components/pages/feed/Suggestions";
import UserGet from "../lib/user";
import { ID, Query } from "appwrite";




export default function EditMyProfile() {
    const [ID_ACCOUNT_I, SetAccount] = useState(null)
    let ID_ACCOUNT = ''
    if (auth.currentUser) {
        ID_ACCOUNT = auth.currentUser.uid

    }

    let currentUser = UserGet()

    useEffect(() => {
        changeInfo()
    }, [currentUser])

    function changeInfoPage() {
        document.querySelector("title").innerText = `Editar perfil | Dump`

    }
    changeInfoPage()

    const displaynamecont = document.querySelector("#displayname-update")
    const usernameupdate = document.querySelector("#username-update")
    const inputbio = document.querySelector(".inputbio")
    const inputlink = document.querySelector(".inputlink")

    const [Error, setError] = useState(false);
    const [Sucess, setSucess] = useState(false);
    const [LoadingUpdate, setLoadingUpdate] = useState(false);
    const [ButtonBottom, setButtonBottom] = useState(true)

    const [displayName, setDisplayName] = useState("");
    const [username, setusername] = useState("");
    const [bio, setbio] = useState("");
    const [url, setUrl] = useState(null);
    const [fileProfile, setFileProfile] = useState(null)

    const [checkedUser, setCheckedUser] = useState(true)
    const [isPrivate, setPrivate] = useState(false)

    const [Loading, setLoading] = useState(true);




    useEffect(() => {

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

    })

    const handleBeforeUnload = (event) => {
        const message = "Tem certeza de que deseja sair da página? As alterações não salvas serão perdidas.";

        // Adiciona a mensagem personalizada ao evento
        event.returnValue = message;

        // Retorna a mensagem para navegadores mais antigos
        return message;
    };

    function ShowError() {
        setError(true)
        setButtonBottom(true)
    }

    function checkUsername(u) {

        if (u == currentUser.username) {
            return setCheckedUser(true)
        }

        if (u.length < 5) {
            return setCheckedUser(false)
        }

        databases.listDocuments(
            "64f9329a26b6d59ade09",
            "64f93be88eee8bb83ec3",
            [
                Query.equal("username", u),
                Query.limit(200)
            ]
        )
            .then((res) => {
                if (res.documents.length > 0) {
                    setCheckedUser(false)
                }
                else {
                    setCheckedUser(true)
                }
            })
    }

    async function updateAccount() {
        if (username != currentUser.username) {
            setCheckedUser(true)
        }
        window.addEventListener('beforeunload', handleBeforeUnload);
        setLoadingUpdate(true)
        setButtonBottom(false)

        updateProfile(auth.currentUser, {
            displayName: displayName
        })
            .then(async () => {

                if (!displayName || !username) {
                    window.removeEventListener('beforeunload', handleBeforeUnload);
                    return ShowError()
                }

                if (!checkedUser) {
                    window.removeEventListener('beforeunload', handleBeforeUnload);
                    return ShowError()
                }

                await databases.updateDocument(
                    "64f9329a26b6d59ade09",
                    "64f93be88eee8bb83ec3",
                    ID_ACCOUNT,
                    {
                        displayName: displayName,
                        username: username,
                        bio: bio,
                        link_above: url ? url : null,
                        private: isPrivate

                    }
                )
                    .then(() => {
                        window.removeEventListener('beforeunload', handleBeforeUnload);
                        setSucess(true)
                        setLoadingUpdate(false)
                        setButtonBottom(true)
                    })
            })
            .catch((r) => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
                ShowError()
                setLoadingUpdate(false)
            })


    }

    async function updatePhotoURL(newFileProfile) {
        if(newFileProfile) {
            window.addEventListener('beforeunload', handleBeforeUnload);
            storageWrite.createFile(
                "65160b9641ad26b1b899",
                ID.unique(),
                newFileProfile,
                
            )
            .then((res) => {
                const URL = `https://cloud.appwrite.io/v1/storage/buckets/65160b9641ad26b1b899/files/${res.$id}/view?project=64f930eab00dac51283b&mode=admin`;
                databases.updateDocument(
                    "64f9329a26b6d59ade09",
                    "64f93be88eee8bb83ec3",
                    currentUser.$id,
                    {
                        photoURL: URL
                    }
                    
                )
                .then((sucess) => {
                    setFileProfile(null)
                    window.removeEventListener('beforeunload', handleBeforeUnload);
                })
                .catch((error) => {
                    window.removeEventListener('beforeunload', handleBeforeUnload);
                })
                
            })
            .catch((error) => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
            })
        }
        
    }


    function changeInfo() {


        if (currentUser) {
            setDisplayName(currentUser.displayName)
            setusername(currentUser.username)
            setbio(currentUser.bio)
            setUrl(currentUser.link_above)

            setPrivate(currentUser.private)


            //TERMINAR DE CARREGAR
            setLoading(false)
        }


    }

    const handleFileChange = (e) => {
        updatePhotoURL(e.target.files[0])
        
    };

    return (
        <>
            {auth.currentUser ?
                <>

                    {Loading ?
                        <>
                            <div className="loading-inner">
                                <Ring
                                    size={40}
                                    lineWeight={5}
                                    speed={2}
                                    color="black"
                                />
                            </div>

                        </>
                        :
                        <div className="dump-edit-my-profile">
                            {Sucess ?
                                <div className="sucess-message-top">
                                    <h1>Sucesso!</h1>
                                    <p>Você salvou as informações.</p>
                                </div>
                                :
                                null
                            }
                            {Error ?
                                <div className="error-message-top">
                                    <h1>Erro!</h1>
                                    <p>As informações não foram salvas.</p>
                                </div>
                                :
                                null
                            }
                            <div className="card-edit-profile">
                                <div className="flex-card-image">
                                    <img
                                        src={auth.currentUser && ID_ACCOUNT_I ? ID_ACCOUNT_I.photoURL : ''}
                                    />
                                    <input type="file" accept="image/*" onChange={(e) => {handleFileChange(e)}}/>

                                </div>
                                <div className="InputFileTopCard">
                                    <h3>Nome</h3>
                                    <input
                                        id="displayname-update"
                                        placeholder="Nome"
                                        onChange={(e) => { setDisplayName(e.target.value) }}
                                        value={displayName}
                                    />
                                </div>
                                <div className="InputFileTopCard">
                                    <h3>Usuário</h3>

                                    <>{currentUser.username != username ?
                                        <>{checkedUser ? <p id="user_disponivel">Usuário disponível</p> : <p id="user_indisponivel">Usuário indisponível</p>}</> : null}</>

                                    <input
                                        id="username-update"
                                        placeholder="Usuário"
                                        onChange={(e) => { setusername(e.target.value) }}
                                        value={username}
                                        onBlur={(e) => { checkUsername(e.target.value) }}

                                    />
                                </div>
                            </div>
                            <div className="spacer-title">
                                <h2>Biografia</h2>

                            </div>
                            <div className="card-edit-profile">

                                <input
                                    className="inputbio"
                                    placeholder="Bio"
                                    max={150}
                                    maxLength={150}
                                    type="text"
                                    onChange={(e) => { setbio(e.target.value) }}
                                    value={bio}
                                ></input>
                                <p>150 caracteres</p>
                            </div>
                            <div className="spacer-title">
                                <h2>Link</h2>
                                <p>Caso queira adicionar algum link ao seu perfil (opcional)</p>
                            </div>
                            <div className="card-edit-profile">
                                <input

                                    className="inputlink"
                                    onChange={(e) => { setUrl(e.target.value) }}
                                    value={url}
                                    placeholder="Link"
                                    type="url"

                                >
                                </input>
                            </div>
                            <div className="spacer-title">
                                <h2>Privacidade da conta</h2>
                                <p>Caso queira deixar seu perfil privado</p>
                            </div>
                            <div className="card-edit-profile">
                                <input
                                    type="checkbox"
                                    name=""
                                    id="inputprivateaccount"
                                    onChange={(e) => { setPrivate(e.target.checked) }}
                                    checked={isPrivate}
                                />

                            </div>

                            <div className="btn-bottom-profile">
                                {ButtonBottom ?
                                    <button
                                        id="saveaccount"
                                        onClick={updateAccount}>
                                        SALVAR
                                    </button>
                                    :
                                    <button
                                        id="saveaccount"
                                        disabled>
                                        <Ring
                                            size={20}
                                            lineWeight={5}
                                            speed={2}
                                            color="white"
                                        />
                                    </button>
                                }

                            </div>
                            {LoadingUpdate
                                ?
                                <div className="loading-wrapper">
                                    <Ring
                                        size={40}
                                        lineWeight={5}
                                        speed={2}
                                        color="black"
                                    />
                                </div>
                                :
                                null
                            }

                        </div>

                    }
                </>
                :
                <><Ring
                    size={40}
                    lineWeight={5}
                    speed={2}
                    color="black"
                />
                </>

            }

        </>
    )
}