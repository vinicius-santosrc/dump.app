/* REACT IMPORTS*/
import React, { useEffect, useState } from 'react';
import '../../../style/authpage.css'


/* FIREBASE IMPORTS*/
import { auth, auth2, provider, signInWithPopup, app, database } from '../../../lib/firebase';
import firebase from "firebase/compat/app"
import {databases} from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';

function AuthPageComponentRegistro() {
    const [name, setName] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)

    const [userdb, Setuserdb] = useState('')
    const [i_ison, setUserOn] = useState('')


    function SignWithEmail(email, password) {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(`Usuário criado: `, userCredential.user)
            })
            .catch((e) => {
                document.querySelector(".handle-message-error").style.display = 'block'
                document.querySelector(".handle-message-error span").innerHTML = e.message
                setInterval(() => {
                    document.querySelector(".handle-message-error").style.display = 'none'
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

            //window.location.href = window.location.origin
            /*database.collection("users")
            .doc(i.user.uid)
            .set({
                name: i.user.displayName,
                username: username,
                email: i.user.email,
                emailverif: i.user.emailVerified,
                phonenumber: i.user.phoneNumber,
                photoURL: i.user.photoURL,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                uid: i.user.uid
            })
          )*/

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
                        <div className='handle-message-error'>
                            <h2>Ops...</h2>
                            <p>Ocorreu um erro inesperado que afetou na criação de sua conta.</p>
                            <label>Erro: <span></span></label>
                        </div>
                        <div className='handle-message-preencha-error'>
                            <h2>Erro!</h2>
                            <p>Preencha todos os dados.</p>
                        </div>
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
                                    <button type="button" onClick={SignWithEmail} id="signup">Indisponível</button>
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