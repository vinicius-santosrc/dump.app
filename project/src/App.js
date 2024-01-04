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

import Inbox from './pages/Inbox';
import Account from './pages/Account';
import AccountMentions from './pages/AccountMentions';
import EditMyProfile from './pages/EditMyProfile';
import SearchPage from './pages/SearchPage';
import SaveDumpsPage from './pages/SaveDumpsPage';
import IndexPageFollowing from './pages/IndexPageFollowing';
import Notifications from './pages/Notifications';
import Story from './pages/Story';
import HeaderFeed from './components/pages/feed/HeaderApp';
import CreatePost from './components/pages/feed/CreatePost';
import Loader from './components/Loader';
import RequestsPage from './pages/RequestsPage';


function App() {
  const [i_ison, setUserOn] = useState('');
  const [HeaderShow, setHeaderShow] = useState(null);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.querySelector("html").classList.add('dark-mode');
    } else {
      document.querySelector("html").classList.remove('dark-mode');
    }
  })

  useEffect(() => {
    auth.onAuthStateChanged(function (u) {
      setUserOn(u);
    });

  }, []);

  

  return (
    <div className="App">
      <Loader />
      <BrowserRouter>
        <HeaderFeed />
        <Routes>
          <Route path='/' element={<><Feed /></>} />
          <Route path='/following' element={<IndexPageFollowing />} />
          <Route path='/accounts/signup' element={<Cadastrar />} />
          <Route path='/accounts/login' element={<Login />} />
          <Route path='/posts/:idPost' element={<PostDetails />} />
          <Route path='/messages/inbox' element={<Inbox />} />
          <Route path='/user/:ID_ACCOUNT' element={<Account />} />
          <Route path='/user/:ID_ACCOUNT/mentions' element={<AccountMentions />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/accounts/edit' element={<EditMyProfile />} />
          <Route path='/saves' element={<SaveDumpsPage />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/notifications/requests" element={<RequestsPage />} />
          <Route path="/stories/:STORY_ID" element={<Story />} />
          <Route path="/posts/create" element={<CreatePost />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
