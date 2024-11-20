// components/filters/RangeSlider.tsx
import React, { useRef, useEffect, useState } from 'react';

interface RangeSliderProps {
    min: number;
    max: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
    label: string;
}

export function RangeSlider({ min, max, value, onChange, label }: RangeSliderProps) {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);

    const getPercentage = (value: number) => {
        return ((value - min) / (max - min)) * 100;
    };

    const handleMouseDown = (event: React.MouseEvent, handle: 'min' | 'max') => {
        setIsDragging(handle);
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (!isDragging || !sliderRef.current) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const percentage = Math.min(Math.max(0, (event.clientX - rect.left) / rect.width), 1);
        const newValue = Math.round(min + (max - min) * percentage);

        if (isDragging === 'min') {
            onChange([Math.min(newValue, value[1]), value[1]]);
        } else {
            onChange([value[0], Math.max(value[0], newValue)]);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(null);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging]);

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">{label}</label>
            <div className="flex items-center gap-4">
                <input
                    type="number"
                    value={value[0]}
                    onChange={(e) => onChange([Math.min(Number(e.target.value), value[1]), value[1]])}
                    min={min}
                    max={value[1]}
                    className="w-20 p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
                />
                <div className="flex-1 flex items-center">
                    <div
                        ref={sliderRef}
                        className="w-full h-1 bg-gray-700 rounded-full relative my-4"
                    >
                        <div
                            className="absolute h-1 bg-blue-600 rounded-full"
                            style={{
                                left: `${getPercentage(value[0])}%`,
                                right: `${100 - getPercentage(value[1])}%`
                            }}
                        />
                        <div
                            className="absolute w-4 h-4 bg-gray-800 border-2 border-blue-600 rounded-full cursor-pointer -mt-1.5 hover:bg-gray-700"
                            style={{
                                left: `calc(${getPercentage(value[0])}% - 8px)`
                            }}
                            onMouseDown={(e) => handleMouseDown(e, 'min')}
                        />
                        <div
                            className="absolute w-4 h-4 bg-gray-800 border-2 border-blue-600 rounded-full cursor-pointer -mt-1.5 hover:bg-gray-700"
                            style={{
                                left: `calc(${getPercentage(value[1])}% - 8px)`
                            }}
                            onMouseDown={(e) => handleMouseDown(e, 'max')}
                        />
                    </div>
                </div>
                <input
                    type="number"
                    value={value[1]}
                    onChange={(e) => onChange([value[0], Math.max(Number(e.target.value), value[0])])}
                    min={value[0]}
                    max={max}
                    className="w-20 p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
                />
            </div>
        </div>
    );
}
