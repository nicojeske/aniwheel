interface CounterBadgeProps {
    label: string;
    count: number;
    variant?: 'default' | 'success' | 'primary';
    onClick?: () => void;
}

const CounterBadge = ({ label, count, variant = 'default', onClick }: CounterBadgeProps) => {
    const baseStyles = "px-3 py-1 rounded-full";
    const variantStyles = {
        default: "bg-gray-700 text-gray-400",
        success: "bg-green-900/50 text-green-200",
        primary: "bg-blue-900/50 text-blue-200"
    };

    return (
        <div
            className={`flex items-center gap-2 ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <div className={`${baseStyles} ${variantStyles[variant]}`}>
                <span className="text-sm">{label}</span>
                <span className="ml-2 text-white font-semibold">{count}</span>
            </div>
        </div>
    );
};

export default CounterBadge;