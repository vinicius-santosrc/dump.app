function Loading() {
    const date = new Date();
    const year = date.getFullYear()
    return(
        <section className='loading-page load loading'>
            <img src="./static/media/dumplogo.f3r818ht813gh78t13t.webp" />
            <div className="bottom-loading">
                <p>Todos direitos reservados ©{year}</p>
            </div>
        </section>
    )
}

function HideLoading() {
    document.querySelector('.loading').style.display = 'none'
}


export {Loading, HideLoading}