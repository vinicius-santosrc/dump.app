import HeaderFeed from "../components/pages/feed/HeaderApp";
import { auth, provider, signInWithPopup, app, db, database } from '../lib/firebase';
import {addDoc, collection, doc, getFirebase, setDoc} from 'firebase/firestore';
import Posts from "../components/pages/feed/Posts";
import Suggestions from "../components/pages/feed/Suggestions";
import CreatePost from "../components/pages/feed/CreatePost";
import { useCollection } from 'react-firebase-hooks/firestore';
import { Loading, HideLoading } from "../components/Loading";

function User(props) {
    return(
        <div className='current-user-page user'>
            <img src={props.photoURL} />
            <h1>{props.displayname}</h1>
            <p>@{props.username}</p>
        </div>
    )
}
function UserNotFound() {
    return(
        <div>Não foi encontrado</div>
    )
}

export {User, UserNotFound}