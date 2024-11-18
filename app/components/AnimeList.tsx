'use client';

import {QueryResult, useLazyQuery} from '@apollo/client';
import {AnimeForUserQuery, Exact, MediaListStatus} from '@/app/gql/graphql';
import convertAnilistEntry from '@/app/mapper/AnimeEntryMapper';
import AnimeGrid from '@/app/components/AnimeGrid';
import {useEffect, useState} from 'react';
import SpinningWheel from "@/app/components/SpinningWheel";
import classNames from "classnames";
import Confetti from "react-confetti-boom";
import AnimeEntryModel from "@/app/models/AnimeEntry";
import useSize from "@/app/hooks/useSize";
import {animesForUser} from "@/app/queries/anilistQueries";

export default function AnimeList() {
    const [usernames, setUsernames] = useState<string[]>(['']); // Start with one input
    const [animes, setAnimes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showWheel, setShowWheel] = useState(false);
    const [selectedWatchState, setSelectedWatchState] = useState<MediaListStatus>(MediaListStatus.Current);
    const [fetchAnime] = useLazyQuery(animesForUser);
    const [drawnAnime, setDrawnAnime] = useState<AnimeEntryModel | null>(null);
    const windowSize = useSize();

    const [selectedAnimeIds, setSelectedAnimeIds] = useState<number[]>([]);

    useEffect(() => {
        // Load stored data from localStorage on component mount
        const storedUsernames = JSON.parse(localStorage.getItem('usernames') || '[]');
        const storedSelectedAnimes = JSON.parse(localStorage.getItem('selectedAnimeIds') || '[]');
        if (storedUsernames.length > 0) setUsernames(storedUsernames);
        if (storedSelectedAnimes.length > 0) setSelectedAnimeIds(storedSelectedAnimes);
    }, []);

    const handleSelect = (id: number) => {
        setSelectedAnimeIds((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((animeId) => animeId !== id) // Deselect
                : [...prevSelected, id] // Select
        );
    };

    const handleAddUsername = () => setUsernames([...usernames, '']);
    const handleRemoveUsername = (index: number) =>
        setUsernames(usernames.filter((_, i) => i !== index));

    const handleInputChange = (index: number, value: string) => {
        const updatedUsernames = [...usernames];
        updatedUsernames[index] = value;
        setUsernames(updatedUsernames);
    };

    const fetchAnimesForUsers = async () => {
        setLoading(true);
        try {
            const userAnimeLists: Set<number>[] = [];
            const animeDetailsMap = new Map<number, any>(); // Map to store anime details by ID

            for (const username of usernames) {
                if (username.trim()) {
                    const {data}: QueryResult<AnimeForUserQuery, Exact<{
                        userName?: string | null
                    }>> = await fetchAnime({
                        variables: {userName: username.trim(), status: selectedWatchState},
                    });

                    if (data?.MediaListCollection?.lists?.[0]?.entries) {
                        const animeIds = new Set(
                            data.MediaListCollection.lists[0].entries.map((entry) => {
                                const animeId = entry?.media?.id;
                                if (animeId) {
                                    animeDetailsMap.set(animeId, convertAnilistEntry(entry?.media)); // Store details
                                }
                                return animeId;
                            })
                        );
                        userAnimeLists.push(animeIds);
                    }
                }
            }

            // Find the intersection of anime IDs
            const commonAnimeIds = userAnimeLists.reduce((acc, set) =>
                acc ? new Set([...acc].filter((id) => set.has(id))) : set
            );

            // Extract anime details for the common IDs
            const commonAnimes = [...commonAnimeIds].map((id) => animeDetailsMap.get(id));

            setAnimes(commonAnimes);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const selectedAnimes = animes.filter(anime => selectedAnimeIds.includes(anime.id)); // Filter anime based on selected IDs

    useEffect(() => {
        // Save usernames and selected anime ids to localStorage
        localStorage.setItem('usernames', JSON.stringify(usernames));
        localStorage.setItem('selectedAnimeIds', JSON.stringify(selectedAnimeIds));
    }, [usernames, selectedAnimeIds]);

    // const spinWheelSize = 0.5 * windowSize.width;
    const spinWheelSize = Math.min(0.5 * windowSize.width, 0.7 * windowSize.height);

    return (
        <div className="flex flex-col gap-6">

            {/* Usernames Input Section */}
            <div className="flex flex-col gap-4">
                {usernames.map((username, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            className="p-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="Enter username"
                        />
                        {usernames.length > 1 && (
                            <button
                                onClick={() => handleRemoveUsername(index)}
                                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}
                <button
                    onClick={handleAddUsername}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                >
                    Add Username
                </button>
            </div>

            {/* MediaListStatus Dropdown */}
            <div className="flex flex-col gap-4">
                <label htmlFor="mediaListStatus" className="text-white">Select Watch State:</label>
                <select
                    id="mediaListStatus"
                    value={selectedWatchState}
                    onChange={(e) => setSelectedWatchState(e.target.value as MediaListStatus)}
                    className="p-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                >
                    {Object.values(MediaListStatus).map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>

            {/* Fetch Button */}
            <button
                onClick={fetchAnimesForUsers}
                className={
                    classNames(
                        "p-2 bg-green-600 text-white rounded-lg hover:bg-green-500",
                        {'cursor-not-allowed opacity-50': loading || !usernames.some((u) => u.trim())}
                    )
                }
                disabled={loading || !usernames.some((u) => u.trim())}
            >
                {loading ? 'Loading...' : 'Fetch Common Anime'}
            </button>

            {/* Button to show the spinning wheel */}
            {animes.length > 0 && (
                <button
                    onClick={() => setShowWheel(true)}
                    className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500"
                >
                    Drehe am heiligen Rad
                </button>
            )}

            {/* Anime Grid */}
            <div className="mt-8">
                {loading ? (
                    <div>Loading...</div>
                ) : animes.length > 0 ? (
                    <>
                        <h2 className="text-2xl font-semibold">Common Anime ({animes.length})
                            Selected: {selectedAnimes.length}</h2>
                        <AnimeGrid animes={animes} selectedAnimeIds={selectedAnimeIds} onSelect={handleSelect}/>
                    </>
                ) : (
                    <div>No common anime found.</div>
                )}
            </div>

            {/* Spinning Wheel Modal */}
            {showWheel && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-10 flex items-center justify-center z-50">
                    <div className="z-50 h-full">
                        {drawnAnime && (
                            <Confetti
                                mode="fall"
                                particleCount={500}
                                shapeSize={20}
                            />)}
                    </div>
                    <div className="bg-gray-900 p-4 rounded-lg">
                        <SpinningWheel animes={selectedAnimes} onClose={() => setShowWheel(false)}
                                       onSelection={(x) => setDrawnAnime(x)} size={spinWheelSize}/>
                    </div>
                </div>
            )}
        </div>
    );
}
