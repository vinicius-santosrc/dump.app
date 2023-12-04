import React, { useEffect, useState } from 'react';
import 'firebase/auth'
import { auth, provider, signInWithPopup, app, db, database } from '../../../lib/firebase'
import { addDoc, collection, doc, getFirebase, setDoc } from 'firebase/firestore'
import Suggestions_User from './Suggestions_User';
import { useCollection } from 'react-firebase-hooks/firestore';
import databases from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { Link } from 'react-router-dom';

export default function Suggestions() {
    const [DumpsMaisAvaliados, setDumpsMaisAvaliados] = useState(null)
    const [Users, setUsers] = useState([])

    const loadUsers = async () => {
        await databases.listDocuments(
            '64f9329a26b6d59ade09',
            "64f93be88eee8bb83ec3",
            [Query.orderDesc("$createdAt"), Query.limit(5)]).catch((e) => {

            })
            .then((res) => {
                setUsers(res.documents)
            })
            .catch((e) => {
                console.log(e)
            })

    }

    const date = new Date()
    const year = date.getFullYear()

    useEffect(() => {
        window.addEventListener('DOMContentLoaded', loadUsers())
        listPostsByLikes()
    }, [])


    async function listPostsByLikes() {
        const collectionId = '64f93c1c40d294e4f379';
        const projectid = "64f9329a26b6d59ade09"
        try {
            // Listar documentos com a consulta
            const response = await databases.listDocuments(
                projectid,
                collectionId,
                [
                    Query.orderDesc("likes"),
                    Query.limit(4)
                ]);

            // Exibir os documentos na ordem decrescente de "likes"
            const posts = response.documents;
        
            setDumpsMaisAvaliados(posts.map((post) => {
                return (
                    <div className='dump-highest-rated dumprated '>
                        <Link to={window.location.origin + "/posts/" + post.$id} rel='noopener noreferrer nofollow'>
                            <img id={post.$id} title={post.legenda} alt={post.legenda} src={post.filePost} />
                        </Link>
                    </div>
                )

            }))
        } catch (error) {
            console.error('Erro ao listar os posts:', error);
        }
    }


    let FirstUsers = Users

    const version = '0.5.6'

    return (
        <div className='card-suggestios-block'>
            <div className="Card-Suggestions">
                <div className='sugg-card-beta'>
                    <h1>Seja DUMP+</h1>
                    <p>Conclua os requisitos para obter o selo de verificado.</p>
                    <button className='dumpplus_inner_btn dumpplusbtn'>Inscrever-se</button>
                </div>
            </div>

            
            <div className="Card-Suggestions">
                <div className='header-sugg'>
                    <h1>Quem seguir</h1>
                </div>
                <div className="Card-Suggestions-Users">
                    {

                        FirstUsers.map((user) => {
                            const gotouser = () => { window.location.href = window.location.origin + '/user/' + user.$id }
                            return (
                                <div className="card-user-sg" onClick={gotouser}>
                                    <Suggestions_User
                                        photo={user.photoURL}
                                        uid={user.id}
                                        displayname={user.displayName}
                                        username={user.username}
                                        isthisverifiqued={user.isthisverifiqued}
                                    />
                                </div>
                            )
                        })

                    }
                    <div className='bottom-suggest-users'>
                        <button>Mostrar mais</button>
                    </div>
                </div>
            </div>
            <div className="Card-Suggestions">
                <nav aria-label='Rodapé' className='footer-suggestions-content footernav-sug'>
                    <Link to={window.location.origin} dir='ltr' target='_blank' rel='noopener noreferrer nofollow'>
                        <span>Política de Privacidade</span>
                    </Link>
                    
                    <Link to={window.location.origin} dir='ltr' target='_blank' rel='noopener noreferrer nofollow' >
                        <span>Acessibilidade</span>
                    </Link>
                    <Link to={window.location.origin} dir='ltr' target='_blank' rel='noopener noreferrer nofollow' >
                        <span>Desenvolvedores</span>
                    </Link>
                    <Link to={window.location.origin} dir='ltr' target='_blank' rel='noopener noreferrer nofollow'>
                        <span>©{year} Dump</span>
                    </Link>
                </nav>

            </div>
        </div>
    )
}