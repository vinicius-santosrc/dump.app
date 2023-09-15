import React, { useEffect, useState } from 'react';
import 'firebase/auth'
import { auth, provider, signInWithPopup, app, db } from './lib/firebase'
import { addDoc, collection, doc, getFirebase, setDoc } from 'firebase/firestore'

import './style/index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

//PAGES
import IndexPage from './pages/IndexPage';
import Cadastrar from './pages/SignUp';
import Login from './pages/Login';
import Feed from './pages/Feed';
import PostDetails from './pages/PostDetails';
import { Loading, HideLoading } from './components/Loading';
import Inbox from './pages/Inbox';
import Account from './pages/Account';
import AccountMentions from './pages/AccountMentions';
import EditMyProfile from './pages/EditMyProfile';
import SearchPage from './pages/SearchPage';

function App() {
  const [i_ison, setUserOn] = useState('')


  useEffect(() => {

    auth.onAuthStateChanged(function (u) {
      setUserOn(u)
    })
  })
  return (

    <div className="App">
      <Loading />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Feed />} />
          <Route path='/accounts/signup' element={<Cadastrar />} />
          <Route path='/accounts/login' element={<Login />} />
          <Route path='/posts/:idPost' element={<PostDetails />} />
          <Route path='/messages/inbox' element={<Inbox />} />
          <Route path='/user/:ID_ACCOUNT' element={<Account />} />
          <Route path='/user/:ID_ACCOUNT/mentions' element={<AccountMentions />} />
          <Route path='/search' element={<SearchPage />} />
        </Routes>

      </BrowserRouter>
    </div>
  );

}

export default App;
