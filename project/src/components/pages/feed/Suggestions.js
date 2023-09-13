import React, { useEffect, useState } from 'react';
import 'firebase/auth'
import { auth, provider, signInWithPopup, app, db, database } from '../../../lib/firebase'
import {addDoc, collection, doc, getFirebase, setDoc} from 'firebase/firestore'
import Suggestions_User from './Suggestions_User';
import { useCollection } from 'react-firebase-hooks/firestore';
import databases from '../../../lib/appwrite';
import { Query } from 'appwrite';

export default function Suggestions() {

    const [Users, setUsers] = useState([])

    const loadUsers = async () => {
        const userslogged = await databases.listDocuments(
        '64f9329a26b6d59ade09',
        "64f93be88eee8bb83ec3",
        [Query.orderDesc("$createdAt")]).catch((e) => {
        })
        setUsers(userslogged.documents)

    }

    let FirstUsers = Users.slice(0, 6)

    document.addEventListener('load', loadUsers())

    return(
        <div className='card-suggestios-block'>
            <div className="Card-Suggestions">
                <div className='sugg-card-beta'>
                    <h1>Versão beta</h1>
                    <p>Essa aplicação está na versão beta e está propicia a mudanças no sistema, design e nas informações.</p>
                </div>
            </div>
            <div className="Card-Suggestions">
                <div className='sugg-card-beta'>
                    <h1>Principais #HashTags</h1>
                </div>
            </div>
            <div className="Card-Suggestions">
                <div className='header-sugg'>
                    <h1>Quem seguir</h1>
                </div>
                <div className="Card-Suggestions-Users">
                    {
                    
                    FirstUsers.map((user) => {
                        const gotouser = () => { window.location.href=window.location.origin + '/user/' + user.$id}
                            return(
                                <div className="card-user-sg" onClick={gotouser}>
                                    <Suggestions_User
                                        photo={user.photoURL}
                                        displayname={user.displayName}
                                        username= {user.username}
                                        isthisverifiqued = {user.isthisverifiqued}
                                    />
                                    <div className='button-follow'>
                                        <button>Seguir</button>
                                    </div>
                                </div>
                            )
                        })
                    
                    }
                <div className='bottom-suggest-users'>
                    <button>Ver mais</button>
                </div>
                </div>
            </div>
        </div>
    )
}