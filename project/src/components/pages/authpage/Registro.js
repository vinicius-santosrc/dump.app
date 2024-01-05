/* REACT IMPORTS*/
import React, { useEffect, useState } from 'react';
import '../../../style/authpage.css'


/* FIREBASE IMPORTS*/
import { auth, auth2, provider, signInWithPopup, app, database } from '../../../lib/firebase';
import firebase from "firebase/compat/app"
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';


function createUserName(name) {

    // Garante que o nome esteja em minúsculas e remove espaços em branco
    const formattedName = name.toLowerCase().replace(/\s/g, '');

    // Gera um número aleatório entre 100000 e 999999
    const randomSuffix = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

    // Combina o nome formatado com o sufixo aleatório
    const userName = formattedName + randomSuffix;

    // Limita o comprimento do nome de usuário a 20 caracteres
    return userName.substring(0, 20);
}

function AuthPageComponentRegistro() {
    const [MessageError, setMessageError] = useState(false)
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [emailUsed, setEmailUsed] = useState(false)

    const [userdb, Setuserdb] = useState('')
    const [i_ison, setUserOn] = useState('')

    let noPHOTO = "https://cloud.appwrite.io/v1/storage/buckets/65160b9641ad26b1b899/files/6597505b316f7b557366/view?project=64f930eab00dac51283b&mode=admin"
    function SignUpWithEmail(email, password) {
        databases.listDocuments(
            "64f9329a26b6d59ade09",
            "64f93be88eee8bb83ec3",
            [
                Query.equal("email", email)
            ]
        ).then(res => {
            if (res.documents.length > 0) {
                setEmailUsed(true)
            }
            else {

            }
        })


        if (emailUsed) {
            setMessageError(true)
            return
        }
        if(!email || !password || !name) {
            setMessageError(true)
            return
        }
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {

                const username = createUserName(name);

                databases.createDocument(
                    '64f9329a26b6d59ade09',
                    "64f93be88eee8bb83ec3",
                    userCredential.user.uid,
                    {
                        displayName: name,
                        username: username,
                        email: email.toLocaleLowerCase(),
                        phonenumber: null,
                        photoURL: noPHOTO,
                        uid: userCredential.user.uid,
                        isthisverifiqued: 'false'
                        // Outros campos do documento do usuário
                    }
                )
                    .then(() => {
                        window.location.href = window.location.origin
                    })
            })
            .catch((e) => {
                setMessageError(true)
                setInterval(() => {
                    setMessageError(false)
                }, 8000);
            })


    }

    const SignWithGoogle = async (e) => {
        signInWithPopup(auth, provider).then((i) => {
            const username = (i.user.displayName).toLocaleLowerCase().replace(/ /g, '')


            const userId = i.user.uid; // Substitua pelo ID do usuário atual
            const collectionId = '64f93be88eee8bb83ec3'; // Substitua com o ID da coleção onde deseja armazenar os documentos do usuário

            try {

                const documents = async () => {
                    await databases.listDocuments(
                        '64f9329a26b6d59ade09',
                        '64f93be88eee8bb83ec3',
                    )
                        .then((e) => {
                            e.documents.filter(e => e.uid == i.user.uid).map((res) => {
                                Setuserdb(res)
                            })
                        })
                }
                documents()

                if (userdb.length === 0) {
                    // O documento do usuário ainda não existe, então criamos um novo
                    const document = databases.createDocument(
                        '64f9329a26b6d59ade09',
                        collectionId,
                        i.user.uid,
                        {
                            displayName: i.user.displayName,
                            username: username,
                            email: i.user.email,
                            phonenumber: i.user.phoneNumber,
                            photoURL: i.user.photoURL,
                            uid: i.user.uid,
                            isthisverifiqued: 'false'
                            // Outros campos do documento do usuário
                        }
                    )
                        .then(() => {
                            window.location.href = window.location.origin
                        })


                } else {
                    window.location.href = window.location.origin
                }
            } catch (error) {
                console.error('Erro ao verificar/criar documento do usuário:', error);
                window.location.href = window.location.origin
            }

        })
    }

    useEffect(() => {
        auth.onAuthStateChanged(function (u) {
            setUserOn(u)
        })

    })

    if (i_ison == null) {
        return (
            <>

                <div className="auth-content">
                    <img src={window.location.origin + '/static/media/authpage-pic.fe13r5135r13.webp'} alt="Mulher tirando selfie Dump" />
                    <div className="right-side-auth-content">
                        <header>
                            <h1><i>Cadastrar no Dump</i></h1>
                        </header>
                        <div className="btns-signup">
                            <div className="btn-google-providar-authentication xf3 cged vdh4 bda2">
                                <button onClick={SignWithGoogle}>
                                    <img src="https://static-00.iconduck.com/assets.00/google-icon-2048x2048-czn3g8x8.png" />
                                    Entrar com o Google</button>
                            </div>

                        </div>
                        <div className="another">
                            <div className="line"></div>
                            <h2>OU</h2>
                            <div className="line"></div>
                        </div>
                        {MessageError ?
                            <div className='handle-message-error'>
                                <h2>Ops...</h2>
                                <p>Ocorreu um erro inesperado que afetou na criação de sua conta.</p>
                                <label>Erro: <span></span></label>
                            </div>
                            :
                            null
                        }
                        

                        <form className="signup-btns-mail">
                            <div>
                                <input
                                    id="name"
                                    placeholder="Nome"
                                    onChange={e => setName(e.target.value)}
                                    max={20} />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    id="email"
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="E-mail"
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    id="password"
                                    onChange={e => setPassword(e.target.value)}
                                    min={6}
                                    max={15}
                                    placeholder="Senha" />

                            </div>
                            <div>
                                <div>
                                    <button type="button" onClick={() => { SignUpWithEmail(email, password) }} id="signup">Criar conta</button>
                                </div>
                            </div>
                            <div className="forgetpass">
                                <p>Já tem uma conta? <a href="./login">Entrar na sua conta</a></p>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        )
    }
    else {
        return (

            <div className='dump-already-login'>
                <img src='../static/media/undraw_young_and_happy_hfpe.svg' />
                <h1>Você já está logado</h1>
                <p>Agora, aproveite o máximo da nossa aplicação.</p>
                <a href={window.location.origin}>
                    <div className='button-back'>
                        <label>Voltar</label>
                    </div>
                </a>
            </div>
        )

    }

}
export default AuthPageComponentRegistro