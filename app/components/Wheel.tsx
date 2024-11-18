import React from "react";
import {wrapText} from "@/app/utils/stringUtils";

type WheelProps = {
    entries: string[];
    size: number;
    wheelRef: React.RefObject<SVGSVGElement>;
    stringWrapLength: number;
}

export const Wheel: React.FC<WheelProps> = ({
     entries,
     size,
     wheelRef,
     stringWrapLength
 }) => {

    const radius = size / 2;
    const segmentAngle = 360 / entries.length;

    return (
        <div className="relative">
            <div className="relative">
                <svg
                    ref={wheelRef}
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    className="transform rounded-full"
                >
                    {/* Wheel Segments */}
                    {entries.map((entry, index) => {
                        const startAngle = index * segmentAngle;
                        const endAngle = startAngle + segmentAngle;
                        const largeArcFlag = segmentAngle > 180 ? 1 : 0;

                        const x1 = radius + radius * Math.cos((Math.PI * startAngle) / 180);
                        const y1 = radius + radius * Math.sin((Math.PI * startAngle) / 180);
                        const x2 = radius + radius * Math.cos((Math.PI * endAngle) / 180);
                        const y2 = radius + radius * Math.sin((Math.PI * endAngle) / 180);

                        const pathData = `
                M ${radius} ${radius}
                L ${x1} ${y1}
                A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
                Z
              `;
                        const fillColor = `hsl(${(index * 360) / entries.length}, 70%, 60%)`;

                        // Text position
                        const midAngle = startAngle + segmentAngle / 2;
                        const midAngleRad = (Math.PI * midAngle) / 180;
                        const textRadius = radius * 0.5;
                        const textX = radius + textRadius * Math.cos(midAngleRad);
                        const textY = radius + textRadius * Math.sin(midAngleRad);

                        return (
                            <g key={entry}>
                                <path d={pathData} fill={fillColor} stroke="#ffffff" strokeWidth="1"/>
                                {/* Anime Title with Word Wrapping */}
                                <text
                                    x={textX}
                                    y={textY}
                                    fill="#000000"
                                    fontSize={size * 0.03}
                                    fontWeight="bold"
                                    alignmentBaseline="middle"
                                    textAnchor="middle"
                                    transform={`rotate(${midAngle} ${textX} ${textY})`}
                                >
                                    {wrapText(entry, stringWrapLength).map((line, i) => (
                                        <tspan
                                            key={i}
                                            x={textX}
                                            dy={i === 0 ? 0 : size * 0.03}
                                            transform={`rotate(${-midAngle} ${textX} ${textY})`}
                                        >
                                            {line}
                                        </tspan>
                                    ))}
                                </text>
                            </g>
                        );
                    })}

                    {/* Pins */}
                    {entries.map((_, index) => {
                        const angle = index * segmentAngle;
                        const pinLength = size * 0.04;
                        const pinRadius = size * 0.01;
                        const x = radius + (radius - pinLength) * Math.cos((Math.PI * angle) / 180);
                        const y = radius + (radius - pinLength) * Math.sin((Math.PI * angle) / 180);
                        return (
                            <circle
                                key={`pin-${index}`}
                                cx={x}
                                cy={y}
                                r={pinRadius}
                                fill="#555555"
                                stroke="#ffffff"
                                strokeWidth="1"
                            />
                        );
                    })}
                </svg>

                {/* Fixed Indicator Arrow */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                    <svg width={size * 0.1} height={size * 0.1} viewBox="0 0 100 100">
                        <polygon points="50,0 90,80 10,80" fill="#ff0000" stroke="#ffffff" strokeWidth="2"/>
                    </svg>
                </div>
            </div>
        </div>
    )
}