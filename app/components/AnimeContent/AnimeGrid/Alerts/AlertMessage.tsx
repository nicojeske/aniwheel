import React from "react";
import AlertIcon from "@/app/components/AnimeContent/AnimeGrid/Alerts/AlertIcon";

const AlertMessage: React.FC<{
    icon: "info" | "close";
    message: string;
}> = ({ icon, message }) => (
    <div className="mt-4 p-3 bg-yellow-600/20 border border-yellow-600/40 rounded-md text-yellow-200">
        <div className="flex items-center gap-2">
            <AlertIcon type={icon} />
            {message}
        </div>
    </div>
);

export default AlertMessage;