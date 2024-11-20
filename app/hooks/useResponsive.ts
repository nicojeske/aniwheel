import {useWindowSize} from "usehooks-ts";
import {useEffect, useState} from "react";

export const useResponsive = () => {
    const windowSize = useWindowSize();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const isDesktop = isClient && windowSize.width >= 1024;

    return {
        isDesktop,
        windowSize,
        isClient
    };
};
