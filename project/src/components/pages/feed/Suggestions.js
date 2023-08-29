import React, { useEffect, useState } from 'react';
import 'firebase/auth'
import { auth, provider, signInWithPopup, app, db } from '../../../lib/firebase'
import {addDoc, collection, doc, getFirebase, setDoc} from 'firebase/firestore'
import Suggestions_User from './Suggestions_User';

export default function Suggestions() {
    return(
        <div className='card-suggestios-block'>
            <div className="Card-Suggestions">
                <h1>Versão beta</h1>
                <p>Essa aplicação está na versão beta e está propicia a mudanças no sistema, design e nas informações.</p>
            </div>
            <div className="Card-Suggestions">
            <h1>Talvez você conheça</h1>
                <div className="Card-Suggestions-Users">
                    <div className="card-user-sg">
                        <Suggestions_User photo={auth.currentUser.photoURL} displayname={auth.currentUser.displayName} username= {'@'+(auth.currentUser.displayName).toLocaleLowerCase()}  />
                    </div>
                    <div className="card-user-sg">
                        <Suggestions_User photo={auth.currentUser.photoURL} displayname={auth.currentUser.displayName} username= {'@'+(auth.currentUser.displayName).toLocaleLowerCase()}  />
                    </div>
                    <div className="card-user-sg">
                        <Suggestions_User photo={auth.currentUser.photoURL} displayname={auth.currentUser.displayName} username= {'@'+(auth.currentUser.displayName).toLocaleLowerCase()}  />
                    </div>
                    <div className="card-user-sg">
                        <Suggestions_User photo={auth.currentUser.photoURL} displayname={auth.currentUser.displayName} username= {'@'+(auth.currentUser.displayName).toLocaleLowerCase()}  />
                    </div>
                    <div className="card-user-sg">
                        <Suggestions_User photo={auth.currentUser.photoURL} displayname={auth.currentUser.displayName} username= {'@'+(auth.currentUser.displayName).toLocaleLowerCase()}  />
                    </div>
                </div>
            </div>
        </div>
    )
}