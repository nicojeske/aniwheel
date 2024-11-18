import React from 'react';
import {useTranslations} from "next-intl";

interface UsernamesInputProps {
    usernames: string[];
    setUsernames: React.Dispatch<React.SetStateAction<string[]>>;
    maxUsernames?: number;
}

const UsernamesInput: React.FC<UsernamesInputProps> = ({ usernames, setUsernames, maxUsernames = 5 }) => {
    const t = useTranslations('Selections')

    const handleAddUsername = () => {
        if (usernames.length >= maxUsernames) return;

        setUsernames([...usernames, '']);
    }
    const handleRemoveUsername = (index: number) =>
        setUsernames(usernames.filter((_, i) => i !== index));

    const handleInputChange = (index: number, value: string) => {
        const updatedUsernames = [...usernames];
        updatedUsernames[index] = value;
        setUsernames(updatedUsernames);
    };

    return (
        <div className="flex flex-col gap-4">
            {usernames.map((username, index) => (
                <div key={index} className="flex items-center gap-2 w-full">
                    {usernames.length > 1 && (
                        <button
                            onClick={() => handleRemoveUsername(index)}
                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
                        >
                            {t('remove_username_button')}
                        </button>
                    )}
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        className="p-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring focus:ring-blue-500 w-full"
                        placeholder={t('add_username_placeholder')}
                    />
                </div>
            ))}
            {usernames.length < maxUsernames && (
                <button
                    onClick={handleAddUsername}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                >
                    {t('add_username_button')}
                </button>
            )}
        </div>
    );
};

export default React.memo(UsernamesInput);
