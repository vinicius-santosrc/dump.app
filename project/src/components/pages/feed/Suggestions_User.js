import React, { useEffect, useState } from 'react';
import 'firebase/auth'
import { auth, provider, signInWithPopup, app, db } from '../../../lib/firebase'
import {addDoc, collection, doc, getFirebase, setDoc} from 'firebase/firestore'

export default function Suggestions_User(props) {
    return(
        <>
            <div className='leftside-perfil'>
                <img src={props.photo} />
                    <div className="card-user-sg-rightside">
                    <h1>{props.displayname}</h1>
                    <p>@{props.username}</p>
                </div>
            </div>
        </>
    )
}