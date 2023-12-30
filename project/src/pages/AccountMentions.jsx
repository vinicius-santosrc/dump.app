import { useEffect, useState } from "react";
import Header from "../components/Header";

import { useParams } from "react-router-dom";
import databases from "../lib/appwrite";
import { Query } from "appwrite";
import Account from "./Account";
import { Ring } from "@uiball/loaders";


export default function AccountMentions() {
    const { ID_ACCOUNT } = useParams();

    const [ID_ACCOUNT_I, SetAccount] = useState(null)


    useEffect(() => {
        
        databases.getDocument(
            "64f9329a26b6d59ade09",
            "64f93be88eee8bb83ec3",
            ID_ACCOUNT
        )
            .then((response) => {
                SetAccount(response)
            })
            .catch((e) => {
                console.log(e)
            })


    }, [ID_ACCOUNT])
    const [nofposts, setNumberofPosts] = useState()


    if (!ID_ACCOUNT_I) {
        return (
            <>
                
                <div><Ring
                    size={40}
                    lineWeight={5}
                    speed={2}
                    color="black"
                /></div>
            </>
        );
    }

    return (
        <>
            <Account />
            <div className="dumps-account-user-show">

            </div>

        </>
    )
}