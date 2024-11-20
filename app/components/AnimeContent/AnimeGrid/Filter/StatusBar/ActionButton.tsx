interface ActionButtonProps {
    onClick: () => void;
    disabled?: boolean;
    variant?: 'default' | 'primary' | 'danger';
    children: React.ReactNode;
}

const ActionButton = ({ onClick, disabled, variant = 'default', children }: ActionButtonProps) => {
    const variantStyles = {
        default: "bg-gray-700 hover:bg-gray-600",
        primary: "bg-blue-600 hover:bg-blue-700",
        danger: "bg-red-600 hover:bg-red-700"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                px-4 py-1.5 rounded-md transition-colors
                ${variantStyles[variant]}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                text-white flex items-center gap-2
            `}
        >
            {children}
        </button>
    );
};

export default ActionButton;