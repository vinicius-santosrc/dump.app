import React from "react";

function gotoLogin() {
    window.location.href="./accounts/signup"
}

function SectionText() {
    return (
        <section className="section-text-banner">
            <img className="section-text-banner-image-1" src="./static/media/phone-landing-page-index (1).webp" alt="" />
            <div className="section-text-content-titles">
                <h2>COMPARTILHE SUAS FOTOS PREDILETAS</h2>
                <p>Comece agora utilizando dump.</p>
                <button onClick={gotoLogin}>FAZER MEU CADASTRO</button>
            </div>
            <img className="section-text-banner-image-2" src="./static/media/phone-landing-page-index (2).webp" alt="" />
        </section>
    )
}

export default SectionText

