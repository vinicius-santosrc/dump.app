import React, { useEffect, useState } from 'react';
//COMPONENTS
import Header from '../components/Header'
import ComponentIndex from '../components/pages/index/Component-Index'
import SectionText from '../components/pages/index/Centermsg'
import Feed from './Feed';

/* FIREBASE IMPORTS*/
import { auth, provider, signInWithPopup, app, db } from '../lib/firebase';
import {addDoc, collection, doc, getFirebase, setDoc} from 'firebase/firestore'
import { Loading, HideLoading } from '../components/Loading';


function IndexPage() {
    return (
      <>
          <Header />
          <ComponentIndex i="./static/media/pc-landing-index-banner.f12yr81h2t8121.webp" im="./static/media/mobile/cellphone-banner-index.fe1u4r8yh1838th.webp"/>
          <SectionText/>
          <ComponentIndex i="./static/media/pc-landing-index-banner-2.f12yr81h2t8121.webp" im="./static/media/mobile/cellphone-banner-index-2.fe1u4r8yh1838th.webp"/>
  
        </>
    )
  }
  

export default IndexPage