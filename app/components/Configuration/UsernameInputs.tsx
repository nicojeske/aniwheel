import React, {useCallback, useMemo} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {PlusCircleIcon, TrashIcon} from '@heroicons/react/24/outline';

interface UsernamesInputProps {
    usernames: string[];
    setUsernames: (usernames: string[]) => void;
    maxUsernames?: number;
}

const UsernamesInput: React.FC<UsernamesInputProps> = ({
                                                           usernames,
                                                           setUsernames,
                                                           maxUsernames = 5,
                                                       }) => {

    const handleAddUsername = useCallback(() => {
        if (usernames.length >= maxUsernames) return;
        setUsernames([...usernames, '']);
    }, [usernames, maxUsernames, setUsernames]);

    const handleRemoveUsername = useCallback(
        (index: number) => {
            setUsernames(usernames.filter((_, i) => i !== index));
        },
        [setUsernames, usernames]
    );

    const handleInputChange = useCallback(
        (index: number, value: string) => {
            const updatedUsernames = [...usernames];
            updatedUsernames[index] = value;
            setUsernames(updatedUsernames);
        },
        [setUsernames, usernames]
    );

    const canAddMore = useMemo(
        () => usernames.length < maxUsernames,
        [usernames.length, maxUsernames]
    );

    return (
        <div className="space-y-4">
            <AnimatePresence initial={false}>
                {usernames.map((username, index) => (
                    <motion.div
                        key={index}
                        initial={{opacity: 0, y: -20}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -20}}
                        transition={{duration: 0.2}}
                        className="flex items-center gap-2 w-full"
                    >
                        {usernames.length > 1 && (
                            <motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                onClick={() => handleRemoveUsername(index)}
                                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200"
                                aria-label={"Remove"}
                            >
                                <TrashIcon className="w-5 h-5"/>
                            </motion.button>
                        )}
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            className="p-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition-all duration-200 placeholder-gray-400"
                            placeholder="Anilist username..."
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
            {canAddMore && (
                <motion.button
                    whileHover={{scale: 1.01}}
                    whileTap={{scale: 0.99}}
                    onClick={handleAddUsername}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200 flex items-center justify-center w-full"
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2"/>
                    Add user
                </motion.button>
            )}
        </div>
    );
};

export default React.memo(UsernamesInput);
