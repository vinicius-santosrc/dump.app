import { Momentum } from '@uiball/loaders'


export default function LoadingContent() {
    return(
        <div className="loading-posts-dump-in-bottom loading-wrapper-bottom">
            <Momentum 
            size={40}
            speed={1.1} 
            color="black" 
            />
        </div>
    )
}

