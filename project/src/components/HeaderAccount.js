import { Link } from "react-router-dom";

export default function HeaderAccount() {

    return (
        <>
            <div className="dump-post-show-pc">
                <div className="dump-post-options-background"></div>
                <div className="dump-post-show">
                    <div className="dump-post-show">
                        <div className="dump-post-header-show">
                            <Link to='javascript:history.back()'><i className="fa-solid fa-chevron-left"></i></Link>
                            <img src={window.location.origin + '/static/media/dumplogo.f3r818ht813gh78t13t.webp'} />
                            <label ><i className="fa-solid fa-ellipsis"></i></label>
                        </div>
                        <div className="dump-post-options">
                            <div className="select-post-options">
                                <Link>Compartilhar</Link>
                            </div>
                            <div className="select-post-options">
                                <Link id="copylink" >Copiar link</Link>
                            </div>
                            <div className="select-post-options">
                                <Link id="cancel">Fechar</Link>
                            </div>
                        </div>
                        <div className="compartilhar-options">
                            <div className="dump-post-options-compartilhar">
                                <h4>Compartilhar:</h4>
                                <div className="select-post-options">
                                    <button id="whatsapp-btn" ><i className="fa-brands fa-whatsapp"></i> WhatsApp</button>
                                </div>
                                <div className="select-post-options">
                                    <Link id="cancel">Cancelar</Link>
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
                        <Link to='javascript:history.back()'><i className="fa-solid fa-chevron-left"></i></Link>
                        <img src={window.location.origin + '/static/media/dumplogo.f3r818ht813gh78t13t.webp'} />
                        <label ><i className="fa-solid fa-ellipsis"></i></label>
                    </div>
                    <div className="dump-post-options">
                        <div className="select-post-options">
                            <Link>Compartilhar</Link>
                        </div>
                        <div className="select-post-options">
                            <Link id="copylink" >Copiar link</Link>
                        </div>
                        <div className="select-post-options">
                            <Link id="cancel">Fechar</Link>
                        </div>
                    </div>
                    <div className="compartilhar-options">
                        <div className="dump-post-options-compartilhar">
                            <h4>Compartilhar:</h4>
                            <div className="select-post-options">
                                <button id="whatsapp-btn" ><i className="fa-brands fa-whatsapp"></i> WhatsApp</button>
                            </div>
                            <div className="select-post-options">
                                <Link id="cancel">Cancelar</Link>
                            </div>
                        </div>
                    </div>
                    

                </div>
            </div>
        </>
    )
}