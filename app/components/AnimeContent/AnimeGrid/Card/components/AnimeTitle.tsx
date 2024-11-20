import classNames from "classnames";
import React from "react";

export default function AnimeTitle(props: { selected: boolean, title: string }) {
    return <h3 className={classNames(
        "mt-4 text-center font-medium transition-colors duration-300",
        "line-clamp-2 text-sm leading-tight",
        props.selected ? "text-white" : "text-gray-200"
    )}>
        {props.title}
    </h3>;
}