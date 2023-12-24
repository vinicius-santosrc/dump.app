/* REACT IMPORTS*/
import React, { useEffect, useState } from 'react';
import '../../../style/authpage.css'

/* FIREBASE IMPORTS*/
import { auth, provider, signInWithPopup, app } from '../../../lib/firebase';
import { Link } from 'react-router-dom';

function ComponentLogin() {
  const [i_ison, setUserOn] = useState('')
  const SignWithGoogle =()=> {
    signInWithPopup(auth, provider).then((i) => {

        window.location.href = window.location.origin
    })
  }


  useEffect(() => {
    auth.onAuthStateChanged(function (u) {
      setUserOn(u)      
    })
  })
  if(i_ison) {
    
  }
  else {
    return(
        <>

                <div className="auth-content">
                    <img src={window.location.origin + '/static/media/authpage-image.fe13t183t1.webp'} alt="Mulher tirando selfie Dump" />
                    <div className="right-side-auth-content">
                        <header>
                            <h1><i>Entrar no Dump</i></h1>
                        </header>
                        <div className="btns-signup">
                            <div className="btn-google-providar-authentication xf3 cged vdh4 bda2">
                                <button >
                                    <img src="https://static-00.iconduck.com/assets.00/google-icon-2048x2048-czn3g8x8.png" /> 
                                    Entrar com o Google</button>
                            </div>
                            
                        </div>
                        <div className="another">
                            <div className="line"></div>
                            <h2>OU</h2>
                            <div className="line"></div>
                        </div>
                        <form className="signup-btns-mail">
                            <div>
                                <input type="email" id="email" placeholder="E-mail" />
                            </div>
                            <div>
                                <input type="password" id="password" min={6} max={15} placeholder="Senha"></input>
                            </div>
                            <div>
                                <div>
                                    <button type="submit" id="signup">Entrar</button>
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