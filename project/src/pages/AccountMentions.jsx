import { useEffect, useState } from "react";
import Header from "../components/Header";
import { HideLoading } from "../components/Loading";
import { useParams } from "react-router-dom";
import databases from "../lib/appwrite";
import { Query } from "appwrite";
import Account from "./Account";


export default function AccountMentions() {
    const { ID_ACCOUNT } = useParams();

    const [ID_ACCOUNT_I, SetAccount] = useState(null)


    useEffect(() => {
        HideLoading()
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

                <div>Carregando...</div>
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