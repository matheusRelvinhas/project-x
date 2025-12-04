'use client';

// @ts-expect-error not-error
import Flag from 'react-world-flags';
import { useParams, useRouter } from 'next/navigation';
import Icon from '@/components/icon';
import Button from "@/components/button";
import { useEffect, useState } from 'react';
import { useAppContext } from "@/context/context";
import { axiosGet } from '@/utils/axios';
import { toast } from "react-toastify";
import { type PlayerStats } from "@/app/players/page"; 
import PlayerImage from '@/components/player-image';

export interface PeriodPlayerStats {
    slug: string;
    periods: {
        "last_month"?: PlayerStats;
        "3_months"?: PlayerStats;
        "6_months"?: PlayerStats;
        "12_months"?: PlayerStats;
    };
}

export default function TeamPage() {
    const { isMobile, setLoading } = useAppContext();
    const router = useRouter();
    const params = useParams();
    const { slug } = params;

    const [playerInfo, setPlayerInfo] = useState<PeriodPlayerStats|null>(null);

    useEffect(() => {
        const getPlayer = async (slug:string|string[]) => {
            setLoading(true);
            await axiosGet(
                `/player_stats/player?slug=${slug}`,
                (data) => {
                    console.log(data);
                    setPlayerInfo(data)
                },
                () => toast.error('Erro inesperado, tente novamente.'), true
            );
            setLoading(false);
        };
        if (slug) {
            getPlayer(slug);
        };
    }, [slug]);

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="flex flex-col w-full h-full fadeIn gap-2">
            <div className='flex items-center gap-2 transition border-default-400 border-b-1 pb-2 h-[38px]'>
                {playerInfo && (
                    <>  
                        <div className='relative'>
                            <div className='flex h-[35px] w-[35px] items-center'>
                                <PlayerImage slug={playerInfo.slug} extension={playerInfo.periods["12_months"]?.img_extension} className='h-[35px] min-w-[30px]' />
                            </div>
                            <Flag code={playerInfo.periods["12_months"]?.country_code}
                                style={{
                                    width: '14px',
                                    position: 'absolute',
                                    bottom: '-2px',
                                    right: '-4px',
                                    borderRadius: '2px',
                                    filter: 'drop-shadow(var(--default-700) 1px 0px 0px) drop-shadow(var(--default-700) 0px 1px 0px) drop-shadow(var(--default-700) -1px 0px 0px) drop-shadow(var(--default-700) 0px -1px 0px)',
                                }}
                            />
                        </div>
                        <div className='flex h-full w-full items-center gap-2'>
                            <span className='flex font-bold whitespace-nowrap'>{playerInfo.periods["12_months"]?.nickname}</span>
                            <span className='flex whitespace-nowrap text-[10px] text-default-800'>{`${playerInfo.periods["12_months"]?.first_name} ${playerInfo.periods["12_months"]?.last_name}`}</span>
                            <span className='flex text-[10px] text-default-800'>{playerInfo.periods["12_months"]?.team_name && playerInfo.periods["12_months"]?.team_name}</span>
                        </div>
                    </>
                )}
            </div>
            <div className='flex w-full items-center justify-between'>
                <Button onClick={handleBack} typeButton="default" padding="p-0">
                    <Icon name="material-symbols:arrow-back-rounded" className="text-2xl" />
                </Button>
            </div>
        </div>
    );
}