import React, { useEffect, useState } from 'react';
//COMPONENTS
import Header from '../components/Header'
import ComponentIndex from '../components/pages/index/Component-Index'
import SectionText from '../components/pages/index/Centermsg'

/* FIREBASE IMPORTS*/
import { auth, provider, signInWithPopup, app } from '../lib/firebase';

function IndexPage() {
    const [i_ison, setUserOn] = useState('')
  const SignWithGoogle =()=> {
    signInWithPopup(auth, provider).then((i) => {
      app.firestore()
      .collection('users')
      .doc(i.user.uid)
      .set({
        username: i.user.displayName,
        name: i.user.displayName,
        email: i.user.email,
        phone: i.user.phoneNumber,
        photoURL: i.user.photoURL,
        uid: i.user.uid,
      })
      .then(
        window.location.reload()
      )
    })
  };


  useEffect(() => {
    auth.onAuthStateChanged(function (u) {
      setUserOn(u)      
    })
  })

  if(i_ison == null) {
    return (
      <>
          {i_ison ? '<FeedContent />' : 
          <>
            <Header />
            <ComponentIndex i="./static/media/pc-landing-index-banner.f12yr81h2t8121.webp" im="./static/media/mobile/cellphone-banner-index.fe1u4r8yh1838th.webp"/>
            <SectionText/>
            <ComponentIndex i="./static/media/pc-landing-index-banner-2.f12yr81h2t8121.webp" im="./static/media/mobile/cellphone-banner-index-2.fe1u4r8yh1838th.webp"/>
          </>
        }
      </>
    )

  }
  else {
    return (
        <>
            {i_ison ? '<FeedContent />' : 
            <>
              <Header />
              <ComponentIndex i="./static/media/pc-landing-index-banner.f12yr81h2t8121.webp" im="./static/media/mobile/cellphone-banner-index.fe1u4r8yh1838th.webp"/>
              <SectionText/>
              <ComponentIndex i="./static/media/pc-landing-index-banner-2.f12yr81h2t8121.webp" im="./static/media/mobile/cellphone-banner-index-2.fe1u4r8yh1838th.webp"/>
            </>
          }
        </>
      )
  }
}

export default IndexPage