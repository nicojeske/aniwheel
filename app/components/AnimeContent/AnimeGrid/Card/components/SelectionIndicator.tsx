import classNames from "classnames";
import React from "react";

export default function SelectionIndicator(props: { selected: boolean, onChange: () => void }) {
    return <div
        className={classNames(
            "absolute top-2 left-2 z-10 transition-all duration-300",
            "opacity-0 group-hover:opacity-100",
            props.selected && "opacity-100"
        )}
    >
        <div className="relative">
            <input
                type="checkbox"
                checked={props.selected}
                onChange={props.onChange}
                className={classNames(
                    "appearance-none w-5 h-5 rounded-md transition-all duration-300",
                    "border-2 cursor-pointer",
                    props.selected
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-400 bg-black/50 backdrop-blur-sm"
                )}
            />
            <svg
                className={classNames(
                    "absolute inset-0 w-5 h-5 pointer-events-none text-white p-1",
                    "transition-opacity duration-300",
                    props.selected ? "opacity-100" : "opacity-0"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                />
            </svg>
        </div>
    </div>;
}