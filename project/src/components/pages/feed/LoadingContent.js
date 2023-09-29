import { Momentum, Ring } from '@uiball/loaders'


export default function LoadingContent() {
    return (
        <div className="loading-posts-dump-in-bottom loading-wrapper-bottom">
            <Ring
                size={40}
                lineWeight={5}
                speed={2}
                color="black"
            />
        </div>


    )
}

