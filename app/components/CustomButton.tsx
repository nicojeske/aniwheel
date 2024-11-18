import classNames from "classnames";
import React from "react";
import {useTranslations} from "next-intl";

export const ButtonColors = {
    primary: {
        default: 'bg-blue-600',
        hover: 'bg-blue-500'
    },
    secondary: {
        default: 'bg-green-600',
        hover: 'bg-green-500'
    },
    tertiary: {
        default: 'bg-purple-600',
        hover: 'bg-purple-500'
    }
}

interface CustomButtonProps {
    onClick: () => void;
    text: string;
    disabled?: boolean;
    loading?: boolean;
    disabledText?: string;
    color?: keyof typeof ButtonColors;
}

const CustomButton: React.FC<CustomButtonProps> = (
    {
        onClick,
        text,
        disabled = false,
        disabledText = text,
        color = 'primary',
        loading = false
    }
) => {

    const t = useTranslations('Selections');

    let buttonText = text;

    if (loading) {
        buttonText = t('loading');
    } else if (disabled) {
        buttonText = disabledText;
    }

    return (
        <button
            onClick={onClick}
            className={
                classNames(
                    "p-2 text-white rounded-lg",
                    `hover:${ButtonColors[color].hover}`,
                    ButtonColors[color].default,
                    {'cursor-not-allowed opacity-50': disabled}
                )
            }
            disabled={disabled || loading}
        >
            {buttonText}
        </button>
    )
}

export default CustomButton;