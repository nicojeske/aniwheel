'use client'

import React, {useEffect, useState} from 'react';
import {useLazyQuery} from '@apollo/client';
import {MediaListStatus} from '@/app/gql/graphql';
import AnimeGrid from '@/app/components/AnimeGrid';
import UsernameInputs from '@/app/components/UsernameInputs';
import {animesForUser} from '@/app/queries/anilistQueries';
import {useTranslations} from 'next-intl';
import configuration from '@/configuration';
import {getCommonAnimesForUsers} from "@/app/services/commonAnimeFinder";
import SpinningWheelModal from "@/app/components/SpinningWheelModal";
import {useLocalStorage, useWindowSize} from "usehooks-ts";
import MediaListStatusSelector from "@/app/components/MediaListStatusSelector";
import AnimeEntryModel from "@/app/models/AnimeEntry";
import CustomButton from "@/app/components/CustomButton";
import {useQuery} from "@tanstack/react-query";
import {getOpeningThemeForAnime} from "@/app/services/animethemesApi";
import Script from "next/script";

export default function AnimeList() {
    const t = useTranslations('Selections');

    const windowSize = useWindowSize();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const [usernames, setUsernames] = useLocalStorage<string[]>('usernames', [''], {initializeWithValue: true});
    const [selectedAnimeIds, setSelectedAnimeIds] = useLocalStorage<number[]>('selectedAnimeIds', [], {initializeWithValue: true});

    const [animes, setAnimes] = useState<AnimeEntryModel[]>([]);
    const [selectedWatchState, setSelectedWatchState] = useState<MediaListStatus>(MediaListStatus.Current);
    const [loading, setLoading] = useState(false);
    const [showWheel, setShowWheel] = useState(false);
    const [drawnAnime, setDrawnAnime] = useState<AnimeEntryModel | null>(null);

    const [fetchAnime] = useLazyQuery(animesForUser);
    const {data} = useQuery({
            queryKey: ['openingTheme', drawnAnime?.id],
            queryFn: async () => getOpeningThemeForAnime(drawnAnime?.id as number),
            enabled: !!drawnAnime && configuration.enableOpenings
        }
    )

    const fetchAnimesForUsers = async () => {
        setLoading(true);
        try {
            const commonAnimes = await getCommonAnimesForUsers(usernames, selectedWatchState, fetchAnime);
            setAnimes(commonAnimes);
        } catch (error) {
            console.error('Error fetching animes', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAnime = (id: number) => {
        setSelectedAnimeIds((prev: number[]) =>
            prev.includes(id) ? prev.filter(animeId => animeId !== id) : [...prev, id]
        );
    };

    const spinWheelSize = Math.min(0.5 * windowSize.width, 0.7 * windowSize.height);
    const selectedAnimes = animes.filter(anime => selectedAnimeIds.includes(anime.id));

    return (
        <div className="flex flex-col gap-6 w-full">
            <Script src={'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js'} onReady={() => {
                // @ts-expect-error - Ko-fiWidgetOverlay is not defined
                kofiWidgetOverlay.draw('nicojeske', {
                    'type': 'floating-chat',
                    'floating-chat.donateButton.text': 'Support me',
                    'floating-chat.donateButton.background-color': '#00b9fe',
                    'floating-chat.donateButton.text-color': '#fff'
                });
            }}/>
            <style>
                {`
                    .floatingchat-container-wrap { left: unset; right: 50px; width: 50%; }
                    .floatingchat-container-wrap-mobi { left: unset; right: 50px; width: 50%;}
                    .floating-chat-kofi-popup-iframe { left: unset; right: 50px; }
                    .floating-chat-kofi-popup-iframe-mobi { left: unset; right: 50px; }
                    .floating-chat-kofi-popup-iframe-closer-mobi { left: unset; right: 50px; }
                `}
            </style>
            {/* Username Inputs */}
            <UsernameInputs
                usernames={usernames}
                setUsernames={setUsernames}
            />

            {/* MediaListStatus Selector */}
            <MediaListStatusSelector
                selectedWatchState={selectedWatchState}
                setSelectedWatchState={setSelectedWatchState}
            />

            {/* Fetch Button */}
            <CustomButton
                disabled={loading || (isClient && !usernames.some(u => u.trim()))}
                onClick={fetchAnimesForUsers}
                color={'secondary'}
                text={t('fetch_button')}
                disabledText={t('fetch_button_disabled')}
                loading={loading}
            />

            {/* Show Wheel Button */}
            {animes.length > 0 && (
                <CustomButton
                    onClick={() => setShowWheel(true)}
                    text={t('show_wheel_button')}
                    color={'tertiary'}
                    disabled={selectedAnimeIds.length < 2}/>
            )}

            {/* Anime Grid */
            }
            <div className="mt-8">
                {loading ? (
                    <div>{t('loading')}</div>
                ) : animes.length > 0 ? (
                    <>
                        <h2 className="text-2xl font-semibold">
                            {t('list_title', {sameCount: animes.length, selectedCount: selectedAnimeIds.length})}
                        </h2>
                        <AnimeGrid models={animes} selectedIds={selectedAnimeIds} onSelect={handleSelectAnime}/>
                    </>
                ) : (
                    <div>{t('no_common')}</div>
                )}
            </div>

            {/* Spinning Wheel Modal */}
            {
                showWheel && selectedAnimes.length >= 2 && (
                    <SpinningWheelModal
                        selectedAnimes={selectedAnimes}
                        onClose={() => setShowWheel(false)}
                        onSelection={(anime) => setDrawnAnime(anime)}
                        spinWheelSize={spinWheelSize}
                        showConfetti={!!drawnAnime && configuration.enableConfetti}
                        openingTheme={data}
                    />
                )
            }
        </div>
    );
}
