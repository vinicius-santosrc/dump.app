import { useEffect, useState } from "react";
import { HideLoading } from "../components/Loading";
import HeaderFeed from "../components/pages/feed/HeaderApp";
import Suggestions from "../components/pages/feed/Suggestions";
import databases from "../lib/appwrite";
import { auth } from "../lib/firebase";

export default function Inbox() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [CURRENTUSER, setYourUser] = useState(null)

    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [chatManager, setChatManager] = useState(null);
    const [activeRoom, setActiveRoom] = useState(null);

    const DB_ID = '64f9329a26b6d59ade09'
    const USERS_ID = '64f93be88eee8bb83ec3'

    useEffect(() => {
        const getYourUser = async () => {
            try {
                const response = await databases.listDocuments(
                    DB_ID,
                    USERS_ID,
                )
                if (auth.currentUser) {
                    response.documents.filter(e => e.uid == auth.currentUser.uid).map((res) => {
                        setYourUser(res);
                    })
                }


            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        getYourUser();
    }, [databases]);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await databases.listDocuments(
                    DB_ID,
                    USERS_ID,
                )
                setUsers(response.documents);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        getUsers();
    }, [databases]);

    useEffect(() => {
        HideLoading()
    })

    const handleUserSelect = (user) => {
        setSelectedUser(user);
    };

    const RealtimeChat = ({ user }) => {
        // Lógica de chat em tempo real aqui
        return (
            <div>
                { }
            </div>
        );
    };

    const MessageList = ({ messages }) => {
        return (
            <ul>
                {messages.map((message) => (
                    <li key={message.id}>
                        <strong>{message.sender.name}: </strong>
                        {message.text}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <>


            <div className="inbox-dump-page">

                <div className="inbox-content-contacts">
                    <p>{CURRENTUSER ? "@" + CURRENTUSER.username : ""}</p>
                    <h1>Seja bem vindo ao Inbox</h1>
                    <p>Escreva, converse com seus amigos e muito mais.</p>
                    <button>Escrever uma mensagem</button>
                    <div className="users-show-select">
                        <ul>
                            {users.map((user) => (
                                <li className="dump-user-show-id" key={user.$id} id={user.$id} onClick={() => handleUserSelect(user)}>
                                    <div className="dump-user-" id={user.$id} key={user.$id}>
                                        <img src={user.photoURL} />
                                        <div className="">
                                            <h2>{user.displayName} {user.isthisverifiqued == 'true' ? <><i alt="CONTA VERIFICADA" title='Verificado' className="fa-solid fa-circle-check fa-fade verifyaccount" ></i></> : <></>}</h2>
                                            <p>@{user.username}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="inbox-content-chat">
                    {selectedUser ?
                        <>
                            <div className="header-chat-content-inbox-dump">
                                <div className="left-side-chat-top-header">
                                    <button onClick={() => { setSelectedUser(null) }}><i className="fa-solid fa-chevron-left"></i></button>
                                    <div className="info-chat-inbox-header">
                                        <img src={selectedUser.photoURL} />
                                        <div className="info-content-chat-inbox-header">
                                            <h3>{selectedUser.displayName} {selectedUser.isthisverifiqued == 'true' ? <><i alt="CONTA VERIFICADA" title='Verificado' className="fa-solid fa-circle-check fa-fade verifyaccount" ></i></> : <></>}</h3>
                                            <p>@{selectedUser.username}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="right-chat-inbox-header">
                                    <button><i className="fa-solid fa-circle-info"></i></button>
                                </div>
                            </div>
                            <div className="chat-content-inbox-dump">
                                <RealtimeChat />

                            </div>
                        </>
                        :
                        <div className="unselected-dump-chat">
                            <img src={'/static/media/undraw_add_friends_re_3xte.svg'} />
                            <h2>Selecione uma conversa</h2>
                            <p>Comece a utilizar nosso Messages adicionando uma conversa</p>
                        </div>
                    }

                </div>
            </div>
        </>
    )
}