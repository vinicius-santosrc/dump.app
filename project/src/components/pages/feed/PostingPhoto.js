import { MrMiyagi } from '@uiball/loaders'
import { auth } from '../../../lib/firebase'

export default function PostingPhoto(props) {
    return(
        <>
        <div className="seending-pic-dump">
            <div className="seending-pic-dump-left-side imagepicsending">
                <img src={props.image} />
            </div>
            <div className="seending-pic-dump-right-side contentsideseending">
                <div className='seendingcontent-sb'>
                    <h2>Publicando...</h2>
                    <p>Sua publicação está sendo enviada.</p>
                </div>
                <div className="loading-wrapper">
                    <MrMiyagi 
                    size={35}
                    lineWeight={3.5}
                    speed={1} 
                    color="black" 
                    />
                </div>
            </div>
        </div>
        <div className='sucess-upload-photo'>
            <div className="seending-pic-dump-left-side imagepicsending">
                    <img src={props.image} />
                </div>
                <div className="seending-pic-dump-right-side contentsideseending">
                    <div className='seendingcontent-sb'>
                        <h2>Sucesso!</h2>
                        <p>Seu dump foi publicado com sucesso.</p>
                    </div>
                    
                </div>
            </div>
        </>
    )
}