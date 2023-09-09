/* REACT IMPORTS*/
import React, { useEffect, useState } from 'react';
import '../../../style/authpage.css'

/* FIREBASE IMPORTS*/
import { auth, provider, signInWithPopup, app, database } from '../../../lib/firebase';
import firebase from "firebase/compat/app"


function AuthPageComponentRegistro() {
    
  const [i_ison, setUserOn] = useState('')
  const SignWithGoogle = async ()=> {
    signInWithPopup(auth, provider).then((i) => {
        const username= (i.user.displayName).toLocaleLowerCase().replace(/ /g, '')
        return(

            database.collection("users")
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
          ).then(() => {
            window.location.href = window.location.origin
          });

      
    })
  }

  useEffect(() => {
    auth.onAuthStateChanged(function (u) {
      setUserOn(u)    
    })
  })

  if(i_ison == null) {
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
                    <div className="btn-apple-providar-authentication xf3 cged vdh4 bda2">
                        <button>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png" />
                            Entrar com Apple
                            </button>
                    </div>
                </div>
                <div className="another">
                    <div className="line"></div>
                    <h2>OU</h2>
                    <div className="line"></div>
                </div>
                <form className="signup-btns-mail">
                    <div>
                        <input id="name" placeholder="Nome" max={12}></input>
                    </div>
                    <div>
                    <input type="email" id="email" placeholder="E-mail" />
                    </div>
                    <div>
                        <input type="password" id="password" min={6} max={15} placeholder="Senha"></input>
                    </div>
                    <div>
                        <div>
                            <button type="submit" id="signup">Criar conta</button>
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
    

}

}
export default AuthPageComponentRegistro