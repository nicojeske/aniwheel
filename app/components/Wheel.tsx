import React from "react";
import {wrapText} from "@/app/utils/stringUtils";
import {motion} from "framer-motion";

type WheelProps = {
    entries: string[];
    size: number;
    wheelRef: React.RefObject<SVGSVGElement>;
    stringWrapLength: number;
}

// Wheel.tsx
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
            <motion.div
                className="relative drop-shadow-2xl"
                initial={{scale: 0.9}}
                animate={{scale: 1}}
                transition={{duration: 0.5}}
            >
                {/* Outer Glow Effect */}
                <div
                    className="absolute inset-0 rounded-full blur-xl bg-gradient-to-r from-blue-500/30 to-purple-500/30"/>

                <svg
                    ref={wheelRef}
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    className="transform rounded-full filter drop-shadow-lg"
                >
                    {/* Outer Ring */}
                    {/* Background Circle */}
                    <circle
                        cx={radius}
                        cy={radius}
                        r={radius - 2}
                        fill="url(#wheelGradient)"
                        className="transition-all duration-300"
                    />

                    {/* Enhanced Gradients and Filters */}
                    <defs>
                        <linearGradient id="segmentGradient" gradientTransform="rotate(90)">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.1)"/>
                            <stop offset="100%" stopColor="rgba(0,0,0,0.1)"/>
                        </linearGradient>
                        <radialGradient id="wheelGradient">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.1)"/>
                            <stop offset="100%" stopColor="rgba(0,0,0,0.2)"/>
                        </radialGradient>
                        <filter id="modernGlow">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                            <feComposite operator="out" in="SourceGraphic" in2="coloredBlur" result="outerglow"/>
                            <feComposite operator="over" in="SourceGraphic" in2="outerglow"/>
                        </filter>
                    </defs>

                    {/* Wheel Segments */}

                    {/* Segments */}
                    {entries.map((entry, index) => {
                        const startAngle = index * segmentAngle;
                        const endAngle = startAngle + segmentAngle;
                        const midAngle = startAngle + segmentAngle / 2;

                        // Enhanced color generation
                        const hue = (index * 360) / entries.length;
                        const fillColor = `hsla(${hue}, 85%, 65%, 1)`;
                        const strokeColor = `hsla(${hue}, 85%, 55%, 1)`;

                        return (
                            <g key={entry} className="segment-group">
                                {/* Segment Path */}
                                <WheelSegment
                                    radius={radius}
                                    startAngle={startAngle}
                                    endAngle={endAngle}
                                    fillColor={fillColor}
                                    strokeColor={strokeColor}
                                />

                                {/* Segment Text */}
                                <WheelText
                                    text={entry}
                                    radius={radius}
                                    angle={midAngle}
                                    size={size}
                                    stringWrapLength={stringWrapLength}
                                />
                            </g>
                        );
                    })}

                    {/* Modern Pins */}
                    {entries.map((_, index) => {
                        const angle = index * segmentAngle;
                        const pinLength = size * 0.03;
                        const x = radius + (radius - pinLength / 2) * Math.cos((Math.PI * angle) / 180);
                        const y = radius + (radius - pinLength / 2) * Math.sin((Math.PI * angle) / 180);
                        return (
                            <circle
                                key={`pin-${index}`}
                                cx={x}
                                cy={y}
                                r={size * 0.008}
                                fill="#ffffff"
                                className="filter drop-shadow-md"
                                style={{
                                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                }}
                            />
                        );
                    })}
                </svg>

                {/*Modern Indicator Arrow*/}
                <WheelIndicator size={size}/>
            </motion.div>
        </div>
    );
};

const WheelSegment = ({radius, startAngle, endAngle, fillColor, strokeColor}: {
    radius: number;
    startAngle: number;
    endAngle: number;
    fillColor: string;
    strokeColor: string;
}) => {
    const pathData = createSegmentPath(radius, startAngle, endAngle);

    return (
        <motion.path
            d={pathData}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="2"
            className="transition-all duration-300"
            filter="url(#modernGlow)"
        />
    );
};

const WheelText = ({text, radius, angle, size, stringWrapLength}: {
    text: string;
    radius: number;
    angle: number;
    size: number;
    stringWrapLength: number;
}) => {
    const textPosition = calculateTextPosition(radius, angle);

    return (
        <text
            x={textPosition.x}
            y={textPosition.y}
            fill="#111"
            fontSize={size * 0.028}
            fontWeight="600"
            alignmentBaseline="middle"
            textAnchor="middle"
            transform={textPosition.transform}
            className="text-shadow-sm pointer-events-none select-none"
            style={{
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                fontFamily: 'system-ui'
            }}
        >
            {wrapText(text, stringWrapLength).map((line, i) => (
                <tspan
                    key={i}
                    x={textPosition.x}
                    dy={i === 0 ? 0 : size * 0.035}
                >
                    {line}
                </tspan>
            ))}
        </text>
    );
};

const WheelIndicator = ({size}: {size: number}) => (
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[calc(100%-2px)] z-10">
        <motion.div
            initial={{y: 0}}
            animate={{y: 5}}
            transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 2
            }}
        >
            <svg
                width={size * 0.12}
                height={size * 0.15}
                viewBox="0 0 24 24"  // Changed to square viewBox
                className="filter drop-shadow-lg rotate-180"
            >
                <path
                    d="M12 0L24 24H0L12 0Z"  // Modified path to point upward
                    fill="url(#arrowGradient)"
                    stroke="#131313"
                    strokeWidth="1"
                    className="filter drop-shadow-lg"
                />
                <defs>
                    <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444"/>
                        <stop offset="100%" stopColor="#dc2626"/>
                    </linearGradient>
                </defs>
            </svg>
        </motion.div>
    </div>
);


// Helper functions
const createSegmentPath = (radius: number, startAngle: number, endAngle: number) => {
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = radius + radius * Math.cos(startRad);
    const y1 = radius + radius * Math.sin(startRad);
    const x2 = radius + radius * Math.cos(endRad);
    const y2 = radius + radius * Math.sin(endRad);

    return `
        M ${radius} ${radius}
        L ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
        Z
    `;
};

const calculateTextPosition = (radius: number, angle: number) => {
    const textRadius = radius * 0.5;
    const angleRad = (angle * Math.PI) / 180;
    const textX = radius + textRadius * Math.cos(angleRad);
    const textY = radius + textRadius * Math.sin(angleRad);
    return {
        x: textX,
        y: textY,
        transform: `rotate(${angle} ${textX} ${textY})`,
        alignmentBaseline: "middle",
        textAnchor: "middle",
        fill: "#ffffff"
    };
};