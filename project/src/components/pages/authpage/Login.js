/* REACT IMPORTS*/
import React, { useEffect, useState } from 'react';
import '../../../style/authpage.css'

/* FIREBASE IMPORTS*/
import { auth, provider, signInWithPopup, app } from '../../../lib/firebase';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';

function ComponentLogin() {

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [i_ison, setUserOn] = useState('');

    const [MessageError, setMessageError] = useState(false)

    const signInAccount = (e) => {
        e.preventDefault()
        signInWithEmailAndPassword(auth, email, password)
            .then((res) => {
                window.location.href = window.location.origin
            })
            .catch((error) => {
                setMessageError(true)
                console.log(error)
            })
    }


    useEffect(() => {
        auth.onAuthStateChanged(function (u) {
            setUserOn(u)
        })
    })
    if (i_ison) {

    }
    else {
        return (
            <>

                <div className="auth-content">
                    <img src={window.location.origin + '/static/media/authpage-image.fe13t183t1.webp'} alt="Mulher tirando selfie Dump" />
                    <div className="right-side-auth-content">
                        {MessageError ?
                            <div className='handle-message-error'>
                                <h2>Ops...</h2>
                                <p>Ocorreu um erro inesperado que afetou na criação de sua conta.</p>
                                <label>Erro: <span></span></label>
                            </div> : null
                        }
                        <header>
                            <h1><i>Entrar no Dump</i></h1>
                        </header>

                        <form className="signup-btns-mail">
                            <div>
                                <input value={email} onChange={(e) => { setEmail(e.target.value) }} type="email" id="email" placeholder="E-mail" />
                            </div>
                            <div>
                                <input value={password} onChange={(e) => { setPassword(e.target.value) }} type="password" id="password" min={6} max={15} placeholder="Senha" />
                            </div>
                            <div>
                                <div>
                                    <button onClick={signInAccount} id="signup">Entrar</button>
                                </div>
                            </div>
                            <div className="forgetpass">
                                <p>Não tem uma conta? <Link to="../accounts/signup">Inscreva-se</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        )
    }
}

export default ComponentLogin