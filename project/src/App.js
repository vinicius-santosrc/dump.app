import React, { useEffect, useState } from 'react';
import 'firebase/auth'
import { auth, provider, signInWithPopup, app, db } from './lib/firebase'
import {addDoc, collection, doc, getFirebase, setDoc} from 'firebase/firestore'

import './style/index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

//PAGES
import IndexPage from './pages/IndexPage';
import Cadastrar from './pages/SignUp';
import Login from './pages/Login';
import Feed from './pages/Feed';

function App() {
  const [i_ison, setUserOn] = useState('')
  const SignWithGoogle = async ()=> {
    signInWithPopup(auth, provider).then((i) => {

      window.location.href = window.location.origin
    })
  };

  useEffect(() => {

    auth.onAuthStateChanged(function (u) {
      setUserOn(u) 
    })
  })
  if(i_ison) {
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Feed />} />
            <Route path='/accounts/signup' element={<Cadastrar />} />
            <Route path='/accounts/login' element={<Login />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<IndexPage />} />
          <Route path='/accounts/signup' element={<Cadastrar />} />
          <Route path='/accounts/login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
