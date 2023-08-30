import HeaderFeed from "../components/pages/feed/HeaderApp";
import { auth, provider, signInWithPopup, app, db, database } from '../lib/firebase';
import {addDoc, collection, doc, getFirebase, setDoc} from 'firebase/firestore';
import Posts from "../components/pages/feed/Posts";
import Suggestions from "../components/pages/feed/Suggestions";
import CreatePost from "../components/pages/feed/CreatePost";
import { useCollection } from 'react-firebase-hooks/firestore';
import { Loading, HideLoading } from "../components/Loading";

export default function Feed() {
    //document.querySelector('.loading').style.display = 'none'
   const [postRealtime, error] = useCollection(
    database.collection("posts").orderBy("timestamp", "desc")
   )
   
    return(
        <div className="App-Feed feedposts">
            <HeaderFeed />
            
            <div className="dump-feed-posts">
                {!error &&
                    postRealtime.docs.map((p) => {
                        return(
                            <Posts 
                            displayName={p.data().name}
                            photoURL={p.data().imageprofile}
                            username={(p.data().name).toLowerCase()}
                            fotopostada={p.data().filePost}
                            time={p.data().timestamp}
                        />
                        )
                    })
                }
            </div>
            <Suggestions />
            <CreatePost />
        </div>
    )
}
