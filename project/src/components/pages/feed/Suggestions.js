import React, { useEffect, useState } from 'react';
import 'firebase/auth'
import { auth, provider, signInWithPopup, app, db, database } from '../../../lib/firebase'
import {addDoc, collection, doc, getFirebase, setDoc} from 'firebase/firestore'
import Suggestions_User from './Suggestions_User';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function Suggestions() {
    const [usersCreated, err] = useCollection(
        database.collection("users").orderBy("timestamp", "desc")
    )

    return(
        <div className='card-suggestios-block'>
            <div className="Card-Suggestions">
                <h1>Versão beta</h1>
                <p>Essa aplicação está na versão beta e está propicia a mudanças no sistema, design e nas informações.</p>
            </div>
            <div className="Card-Suggestions">
            <h1>Novos no Dump</h1>
                <div className="Card-Suggestions-Users">
                {!err &&   
                   usersCreated.docs.map((user) => {
                        return(
                            <div className="card-user-sg">
                                <Suggestions_User 
                                    photo={user.data().photoURL}
                                    displayname={user.data().name}
                                    username= {user.data().username}
                                />
                            </div>
                        )
                    })
                }
                </div>
            </div>
        </div>
    )
}