import React from "react";

function gotoHome() {
    window.location.href= window.location.origin
}

function Header() {
    return (
        <header className="header-application dumpheader">
            <img onClick={gotoHome} src= {window.location.origin  + "/static/media/dumplogo.f3r818ht813gh78t13t.webp"} alt="Logo Dump" />
        </header>
    )
}

export default Header