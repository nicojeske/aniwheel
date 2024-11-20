import classNames from "classnames";
import React from "react";

export default function AnilistButton(props: { id: number, onClick: (e: React.MouseEvent<HTMLElement>) => void }) {
    return <a
        href={`https://anilist.co/anime/${props.id}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={props.onClick}
        className={classNames(
            "absolute top-2 right-2 z-10 p-2 rounded-full",
            "bg-black/50 backdrop-blur-sm transition-all duration-300",
            "hover:bg-blue-500/80 group-hover:opacity-100",
            "opacity-0 hover:scale-110"
        )}
    >
        <svg
            className="w-4 h-4 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
        >
            <path
                d="M6.361 2.943L0 21.056h4.942l1.077-3.133H11.4l1.052 3.133H22.9c.71 0 1.1-.392 1.1-1.101V17.53c0-.71-.39-1.101-1.1-1.101h-6.483V4.045c0-.71-.392-1.102-1.101-1.102h-2.422L6.361 2.943zm2.325 6.708l1.738 5.205H6.898l1.788-5.205z"/>
        </svg>
    </a>;
}