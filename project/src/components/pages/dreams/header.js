import { Query } from "appwrite";
import UserGet from "../../../lib/user";
import { useEffect, useState } from "react";
import { auth } from "../../../lib/firebase";
import { databases } from "../../../lib/appwrite";
import { Link } from "react-router-dom";

export function DreamsHeader() {
    const [openSettingsAccount, setopenSettingsAccount] = useState(false)

    const [AccountOptions, setAccountsOptions] = useState(false)
    const [notificationsNotSeen, setNotificationsNotSeen] = useState(false)

    const [i_ison, setUserOn] = useState('');


    useEffect(() => {
        auth.onAuthStateChanged(function (u) {
            setUserOn(u)
        })
    }, [])


    let ID_ACCOUNT = ''
    if (auth.currentUser) {
        ID_ACCOUNT = auth.currentUser.uid
    }

    const ID_ACCOUNT_I = UserGet()

    return (
        <>
            <header className="DreamHeader">
                <div className="DreamHeader-LeftSide">
                    <div className="BackButtonDreams">
                        <Link to={window.location.origin}>
                            <i className="fa-solid fa-chevron-left"></i>
                        </Link>
                    </div>
                    <div className="DreamHeaderLogo--wrapper">
                        <img className="LogoDreams" id="Logo" aria-label="Logo do Dreams - Dump" src={window.location.origin + '/static/media/DumpDreams-Header.svg'} />
                    </div>
                </div>
            </header>
            
        </>
    )
}