import classNames from "classnames";
import React from "react";

export default function AnimeInfo(props: { seasonYear: number, episodeCount: number, averageScore: number }) {
    return <div className={classNames(
        "mt-2 flex justify-center gap-2 text-xs text-gray-400",
        "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    )}>
        <span>{props.seasonYear}</span>
        <span>•</span>
        <span>{props.episodeCount} ep</span>
        <span>•</span>
        <span>{props.averageScore}%</span>
    </div>;
}