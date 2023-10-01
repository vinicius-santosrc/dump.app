import { useEffect, useState } from "react";
import HeaderAccount from "../components/HeaderAccount";
import { HideLoading } from "../components/Loading";
import { auth } from "../lib/firebase";
import { updateProfile } from "firebase/auth";
import databases from "../lib/appwrite";
import { Ring } from '@uiball/loaders'
import HeaderFeed from "../components/pages/feed/HeaderApp";
import Suggestions from "../components/pages/feed/Suggestions";




export default function EditMyProfile() {
    const [ID_ACCOUNT_I, SetAccount] = useState(null)
    let ID_ACCOUNT = ''
    if (auth.currentUser) {
        ID_ACCOUNT = auth.currentUser.uid

    }


    useEffect(() => {
        HideLoading()
    }, [])
    function changeInfoPage() {
        document.querySelector("title").innerText = `Editar perfil | Dump`

    }
    changeInfoPage()

    const displaynamecont = document.querySelector("#displayname-update")
    const usernameupdate = document.querySelector("#username-update")
    const inputbio = document.querySelector(".inputbio")
    const inputlink = document.querySelector(".inputlink")
    let privatebtn
    if (document.querySelector("#inputprivateaccount")) {
        privatebtn = document.querySelector("#inputprivateaccount").checked
    }


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
    async function updateAccount() {
        document.querySelector(".loading-wrapper").style.display = 'block'
        document.querySelector(".btn-bottom-profile").style.display = 'none'

        updateProfile(auth.currentUser, {
            displayName: displaynamecont.value
        })
            .then(async () => {
                await databases.updateDocument(
                    "64f9329a26b6d59ade09",
                    "64f93be88eee8bb83ec3",
                    ID_ACCOUNT,
                    {
                        displayName: displaynamecont.value,
                        username: usernameupdate.value,
                        bio: inputbio.value,
                        link_above: inputlink.value,
                        private: privatebtn

                    }
                )
                    .then(() => {
                        document.querySelector(".sucess-message-top").style.display = 'block'
                        setInterval(() => {
                            document.querySelector(".sucess-message-top").style.display = 'none'
                        }, 5000);
                        document.querySelector(".loading-wrapper").style.display = 'none'
                        document.querySelector(".btn-bottom-profile").style.display = 'block'
                    })
            })
            .catch((r) => {
                document.querySelector(".error-message-top").style.display = 'block'
                setInterval(() => {
                    document.querySelector(".error-message-top").style.display = 'none'
                }, 5000);
                document.querySelector(".loading-wrapper").style.display = 'none'
                document.querySelector(".btn-bottom-profile").style.display = 'block'
            })

    }

    function changeInfo() {
        if (displaynamecont && ID_ACCOUNT_I && displaynamecont.value == '') {
            displaynamecont.value = auth.currentUser && ID_ACCOUNT_I && ID_ACCOUNT_I.displayName ? ID_ACCOUNT_I.displayName : ''
            usernameupdate.value = auth.currentUser && ID_ACCOUNT_I && ID_ACCOUNT_I.username ? ID_ACCOUNT_I.username : ''
            inputbio.value = auth.currentUser && ID_ACCOUNT_I && ID_ACCOUNT_I.bio ? ID_ACCOUNT_I.bio : ''
            inputlink.value = auth.currentUser && ID_ACCOUNT_I && ID_ACCOUNT_I.link_above ? ID_ACCOUNT_I.link_above : ''

            if (ID_ACCOUNT_I.private) {
                document.querySelector("#inputprivateaccount").setAttribute('checked', '')
            }
            else {
                document.querySelector("#inputprivateaccount").removeAttribute('checked')
            }
            document.querySelector(".loading-inner").style.display = 'none'
        }
    }

    useEffect(() => {

        changeInfo()

    })


    if (document.getElementById('imagemInput')) {
        document.getElementById('imagemInput').addEventListener('change', () => {
            const imagemInput = document.getElementById('imagemInput');
            const reduzirButton = document.getElementById('reduzirButton');


            const file = imagemInput.files[0];

            // Função para redimensionar a imagem
            async function reduzirQualidade(blob, qualidadeAlvo, tamanhoMaxKB) {
                const img = new Image();
                img.src = URL.createObjectURL(blob);

                img.onload = async () => {
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    const largura = img.width;
                    const altura = img.height;

                    canvas.width = largura;
                    canvas.height = altura;

                    context.drawImage(img, 0, 0, largura, altura);

                    // Converter para uma nova imagem com qualidade reduzida
                    const novaQualidade = qualidadeAlvo / 100;
                    const novaImagem = canvas.toDataURL('image/jpeg', novaQualidade);

                    // Verificar o tamanho da nova imagem
                    const novaTamanhoKB = Math.round(novaImagem.length / 1024);


                    if (novaTamanhoKB <= tamanhoMaxKB) {
                        // Exibir a nova imagem
                        const novaImagemElemento = new Image();
                        novaImagemElemento.src = novaImagem;

                        console.log(`Tamanho da nova imagem: ${novaTamanhoKB} KB`);

                        document.getElementById('imagemReduzida').setAttribute('src', novaImagemElemento.src)
                    } else {
                        alert(`A imagem reduzida excede o tamanho máximo de ${tamanhoMaxKB} KB.`);
                    }
                };
            }

            async function convertImage() {
                const qualidadeAlvo = 30; // Qualidade desejada (95%)
                const tamanhoMaxKB = 10000; // Tamanho máximo em KB

                await reduzirQualidade(file, qualidadeAlvo, tamanhoMaxKB);
            }
            convertImage()
        })

    }

    return (
        <>
            {auth.currentUser ?
                <>
                    <HeaderFeed />

                    <div className="loading-inner">


                        <Ring
                            size={40}
                            lineWeight={5}
                            speed={2}
                            color="black"
                        />
                    </div>

                    <div className="dump-edit-my-profile">
                        <div className="sucess-message-top">
                            <h1>Sucesso</h1>
                            <p>Você salvou as informações</p>
                        </div>
                        <div className="error-message-top">
                            <h1>Erro</h1>
                            <p>As informações não foram salvas</p>
                        </div>
                        <div className="card-edit-profile">
                            <div className="flex-card-image">
                                <img src={auth.currentUser && ID_ACCOUNT_I ? ID_ACCOUNT_I.photoURL : ''} />
                                {/*<input type="file" name="" id="imagemInput" />

                                <img id="imagemReduzida"></img>*/}
                            </div>
                            <div className="InputFileTopCard">
                                <h3>Nome</h3>
                                <input id="displayname-update" placeholder="Nome"
                                />
                            </div>
                            <div className="InputFileTopCard">
                                <h3>Username</h3>
                                <input id="username-update" placeholder="Usuário"
                                />
                            </div>
                        </div>
                        <div className="spacer-title">
                            <h2>Biografia</h2>

                        </div>
                        <div className="card-edit-profile">

                            <input className="inputbio" placeholder="Bio" max={150} maxLength={150} type="text"
                            ></input>
                            <p>150 caracteres</p>
                        </div>
                        <div className="spacer-title">
                            <h2>Link</h2>
                            <p>Caso queira adicionar algum link ao seu perfil (opcional)</p>
                        </div>
                        <div className="card-edit-profile">
                            <input className="inputlink" placeholder="Link"
                                type="url"></input>
                        </div>
                        <div className="spacer-title">
                            <h2>Privacidade da conta</h2>
                            <p>Caso queira deixar seu perfil privado</p>
                        </div>
                        <div className="card-edit-profile">
                            <input type="checkbox" name="" id="inputprivateaccount" />

                        </div>

                        <div className="btn-bottom-profile">
                            <button id="removeaccount" disabled>REMOVER CONTA</button>
                            <button id="desativeaccount" disabled>DESATIVAR CONTA</button>
                            <button id="saveaccount" onClick={updateAccount}>SALVAR INFORMAÇÕES</button>
                        </div>
                        <div className="loading-wrapper">
                            <Ring
                                size={40}
                                lineWeight={5}
                                speed={2}
                                color="black"
                            />
                        </div>
                    </div>
                </>
                :
                <><Ring
                    size={40}
                    lineWeight={5}
                    speed={2}
                    color="black"
                /></>}

        </>
    )
}