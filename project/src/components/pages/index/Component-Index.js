import React from "react"

function ComponentIndex(p) {
    return( 
        <>
            <div className='page-content' >
                <div className='banner-index-application bannerindex'>
                    <img className='banner-index-application-banner-image banner-image' src={p.i} alt="Banner Dump" />
                </div>
            </div>
            <div className='page-content-mobile' >
                <div className='banner-index-application bannerindex'>
                    <img className='banner-index-application-banner-image banner-image' src={p.im} alt="Banner Dump" />
                </div>
            </div>
        </>
    )
}

export default ComponentIndex