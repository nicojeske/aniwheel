import Script from "next/script";
import React from "react";

export default function KofiButto() {
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
                {`
                    .floatingchat-container-wrap { left: unset; right: 50px; width: 50%; }
                    .floatingchat-container-wrap-mobi { left: unset; right: 50px; width: 50%;}
                    .floating-chat-kofi-popup-iframe { left: unset; right: 50px; }
                    .floating-chat-kofi-popup-iframe-mobi { left: unset; right: 50px; }
                    .floating-chat-kofi-popup-iframe-closer-mobi { left: unset; right: 50px; }
                `}
            </style>
        </>
    )
}