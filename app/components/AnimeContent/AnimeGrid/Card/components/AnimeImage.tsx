import Image from "next/image";
import classNames from "classnames";
import React from "react";

export default function AnimeImage(props: { src: string, alt: string }) {
    return <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
        <Image
            src={props.src}
            alt={props.alt}
            fill
            sizes="(max-width: 300px) 100vw, 300px"
            className={classNames(
                "object-cover transition-transform duration-300",
                "group-hover:scale-105"
            )}
            priority={false}
        />
        {/* Gradient Overlay */}
        <div className={classNames(
            "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        )}/>
    </div>;
}