export default function HeaderAccount() {
    return (
        <>
            <div className="dump-post-show-pc">
                <div className="dump-post-options-background"></div>
                <div className="dump-post-show">
                    <div className="dump-post-show">
                        <div className="dump-post-header-show">
                            <a href='javascript:history.back()'><i className="fa-solid fa-chevron-left"></i></a>
                            <img src={window.location.origin + '/static/media/dumplogo.f3r818ht813gh78t13t.webp'} />
                            <label ><i className="fa-solid fa-ellipsis"></i></label>
                        </div>
                        <div className="dump-post-options">
                            <div className="select-post-options">
                                <a >Compartilhar</a>
                            </div>
                            <div className="select-post-options">
                                <a id="copylink" >Copiar link</a>
                            </div>
                            <div className="select-post-options">
                                <a id="cancel">Fechar</a>
                            </div>
                        </div>
                        <div className="compartilhar-options">
                            <div className="dump-post-options-compartilhar">
                                <h4>Compartilhar:</h4>
                                <div className="select-post-options">
                                    <button id="whatsapp-btn" ><i className="fa-brands fa-whatsapp"></i> WhatsApp</button>
                                </div>
                                <div className="select-post-options">
                                    <a id="cancel">Cancelar</a>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
            <div className="dump-post-show-mobile">
                <div  className="dump-post-options-background"></div>
                <div className="dump-post-show">
                    <div className="dump-post-header-show">
                        <a href='javascript:history.back()'><i className="fa-solid fa-chevron-left"></i></a>
                        <img src={window.location.origin + '/static/media/dumplogo.f3r818ht813gh78t13t.webp'} />
                        <label ><i className="fa-solid fa-ellipsis"></i></label>
                    </div>
                    <div className="dump-post-options">
                        <div className="select-post-options">
                            <a >Compartilhar</a>
                        </div>
                        <div className="select-post-options">
                            <a id="copylink" >Copiar link</a>
                        </div>
                        <div className="select-post-options">
                            <a  id="cancel">Fechar</a>
                        </div>
                    </div>
                    <div className="compartilhar-options">
                        <div className="dump-post-options-compartilhar">
                            <h4>Compartilhar:</h4>
                            <div className="select-post-options">
                                <button id="whatsapp-btn" ><i className="fa-brands fa-whatsapp"></i> WhatsApp</button>
                            </div>
                            <div className="select-post-options">
                                <a  id="cancel">Cancelar</a>
                            </div>
                        </div>
                    </div>
                    

                </div>
            </div>
        </>
    )
}