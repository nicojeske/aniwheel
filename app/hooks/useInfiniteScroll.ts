import {useEffect, useState} from "react";
import {useInView} from "react-intersection-observer";

export default function useInfiniteScroll<T>(collection: T[], initialLoad = 5, loadNew = 5) {
    const [ref, inView] = useInView({
        rootMargin: '300px',
    });
    const [currentlyLoaded, setCurrentlyLoaded] = useState(initialLoad);

    useEffect(() => {
        if (inView) {
            setCurrentlyLoaded(Math.min(currentlyLoaded + loadNew, collection.length));
        }
    }, [inView]);

    return {
        ref,
        data: collection.slice(0, currentlyLoaded),
        hasMore: currentlyLoaded < collection.length
    }
}