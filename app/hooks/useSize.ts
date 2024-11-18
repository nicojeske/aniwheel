import {useEffect, useState} from "react";

const useSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const windowResizeHandler = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", windowResizeHandler);

        return () => {
            window.removeEventListener("resize", windowResizeHandler);
        };
    }, []);

    return windowSize;
}

export default useSize;