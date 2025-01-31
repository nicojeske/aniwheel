import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const ButtonColors = {
    primary: {
        default: 'bg-blue-600',
        hover: 'hover:bg-blue-500',
        focus: 'focus:ring-blue-400',
    },
    secondary: {
        default: 'bg-green-600',
        hover: 'hover:bg-green-500',
        focus: 'focus:ring-green-400',
    },
    tertiary: {
        default: 'bg-yellow-600',
        hover: 'hover:bg-yellow-500',
        focus: 'focus:ring-yellow-400',
    }
} as const;

interface CustomButtonProps {
    onClick: () => void;
    text: string;
    disabled?: boolean;
    loading?: boolean;
    disabledText?: string;
    color?: keyof typeof ButtonColors;
}

const CustomButton: React.FC<CustomButtonProps> = ({
                                                       onClick,
                                                       text,
                                                       disabled = false,
                                                       disabledText = text,
                                                       color = 'primary',
                                                       loading = false
                                                   }) => {

    const buttonText = useMemo(() => {
        if (loading) return 'Loading...';
        if (disabled) return disabledText;
        return text;
    }, [loading, disabled, disabledText, text]);

    const buttonClasses = useMemo(() => {
        return `
      ${ButtonColors[color].default}
      ${ButtonColors[color].hover}
      ${ButtonColors[color].focus}
      text-white rounded-lg px-4 py-2 font-medium
      transition-all duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
      ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
    `;
    }, [color, disabled, loading]);

    return (
        <motion.button
            onClick={onClick}
            className={buttonClasses}
            disabled={disabled || loading}
            whileHover={{ scale: disabled || loading ? 1 : 1.01 }}
            whileTap={{ scale: disabled || loading ? 1 : 0.99 }}
        >
            <div className="flex items-center justify-center">
                {loading && (
                    <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                )}
                {buttonText}
            </div>
        </motion.button>
    );
};

export default React.memo(CustomButton);
