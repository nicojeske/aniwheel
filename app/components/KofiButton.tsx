import Script from "next/script";
import React from "react";

type KofiButtonProps = {
    isShowing: boolean;
}

export default function KofiButton({isShowing}: KofiButtonProps) {
    return (
        <>
            <Script src={'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js'} onReady={() => {
                // @ts-expect-error - Ko-fiWidgetOverlay is not defined
                kofiWidgetOverlay.draw('nicojeske', {
                    'type': 'floating-chat',
                    'floating-chat.donateButton.text': 'Support me',
                    'floating-chat.donateButton.background-color': '#00b9fe',
                    'floating-chat.donateButton.text-color': '#fff'
                });
            }}/>
            <style>
                {isShowing ? `
                    .floatingchat-container-wrap { left: 50px; right: unsetpx; width: 50%; }
                    .floatingchat-container-wrap-mobi { left: 50px; right: unsetpx; width: 50%;}
                    .floating-chat-kofi-popup-iframe { left: 50px; right: unsetpx; }
                    .floating-chat-kofi-popup-iframe-mobi { left: 50px; right: unsetpx; }
                    .floating-chat-kofi-popup-iframe-closer-mobi { left: unset; right: unsetpx; }
                ` : `
                    .floatingchat-container-wrap { display: none; }
                    .floatingchat-container-wrap-mobi { display: none; }
                    .floating-chat-kofi-popup-iframe { display: none; }
                    .floating-chat-kofi-popup-iframe-mobi { display: none; }
                    .floating-chat-kofi-popup-iframe-closer-mobi { display: none; }
                `}
            </style>
        </>
    )
}