import React from "react";
import classNames from "classnames";
import Image from "next/image";

type AnimeEntryModel = {
    id: number;
    title: string;
    coverImageUrl: string;
    selected: boolean;
    onSelect: (id: number) => void;
};

const AnimeCard: React.FC<AnimeEntryModel> = ({
                                                  id,
                                                  title,
                                                  coverImageUrl,
                                                  selected,
                                                  onSelect,
                                              }) => {
    return (
        <div
            className={classNames(
                "relative p-4 rounded-xl shadow-md cursor-pointer transition-all backdrop-blur-md",
                selected
                    ? "bg-blue-600/40 ring-2 ring-blue-500"
                    : "bg-gray-800/40 opacity-50 hover:opacity-75"
            )}
            onClick={() => onSelect(id)}
            style={{ maxWidth: "300px"}} // Limit the card's size
        >
            {/* Selection Indicator */}
            <div className="absolute top-2 left-2">
                <div
                    className={classNames(
                        "w-5 h-5 rounded-full border-2",
                        selected
                            ? "bg-blue-500 border-blue-500"
                            : "bg-gray-700 border-gray-500"
                    )}
                ></div>
            </div>
            {/* Cover Image */}
            <Image
                src={coverImageUrl}
                alt={title}
                width={460}
                height={658}
                className="w-full object-cover rounded-lg mb-4"
            />
            {/* Title */}
            <h3 className="text-center text-lg font-semibold text-gray-200">
                {title}
            </h3>
        </div>
    );
};

export default AnimeCard;
