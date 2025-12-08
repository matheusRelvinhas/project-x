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
import { type PlayerStats, type NumericStatKeys } from "@/app/players/page"; 
import PlayerImage from '@/components/player-image';
import PlayerStatsTable from '@/components/player-stats-table';
import TeamImage from '@/components/team-image';

interface PlayerInfo {
    slug: string | null;
    nickname: string;
    first_name: string;
    last_name: string;
    team_slug: string|null;
    team_name: string|null;
    country_code: string;
    img_extension: string|null;
    team_img_extension: string|null;
    team_points: number|null;
    team_rank: number|null;
    stats: PlayerStats[]|[];
};

export default function Player() {
    const { isMobile, setLoading } = useAppContext();
    const router = useRouter();
    const handleNavigation = (href: string) => {
        router.push(href);
    };
    const params = useParams();
    const { slug } = params;

    const [playerInfo, setPlayerInfo] = useState<PlayerInfo|null>(null);

    const [sortedBy, setSortedBy] = useState<NumericStatKeys>('period');
    const [desc, setDesc] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const getPlayer = async (slug:string|string[]) => {
            setLoading(true);
            await axiosGet(
                `/player_stats/player?slug=${slug}`,
                (data) => {
                    setPlayerInfo(data)
                },
                () => toast.error('Erro inesperado, tente novamente. #10'), true
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
                                <PlayerImage slug={playerInfo.slug||''} extension={playerInfo.img_extension} className='h-[35px] min-w-[30px]' />
                            </div>
                            <Flag code={playerInfo.country_code}
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
                            <span className='flex font-bold whitespace-nowrap'>{playerInfo.nickname}</span>
                            <span className='flex whitespace-nowrap text-[10px] text-default-800'>{`${playerInfo.first_name} ${playerInfo.last_name}`}</span>
                            <span className='flex text-[10px] cursor-pointer text-default-800 hover:text-primary-600'
                                onClick={()=>handleNavigation(`/team/${playerInfo.team_slug}`)}>
                                {playerInfo.team_name && playerInfo.team_name}
                            </span>
                        </div>
                    </>
                )}
            </div>

            <div className='flex w-full items-center justify-between'>
                <Button onClick={handleBack} typeButton="default" padding="p-0">
                    <Icon name="material-symbols:arrow-back-rounded" className="text-2xl" />
                </Button>
                {playerInfo && (
                    <div className='flex gap-2 cursor-pointer px-2 items-center bg-default-200 rounded-sm hover:text-primary-600'
                        onClick={()=>handleNavigation(`/team/${playerInfo.team_slug}`)}>
                        <TeamImage slug={playerInfo.team_slug} extension={playerInfo.team_img_extension} className='h-[20px] min-w-[20px] text-default-950' />
                        <div className='flex flex-col min-w-[78px] h-[32px]'>
                            <span className='text-default-900' style={{fontSize: 'x-small'}}>valve rank</span>
                            <div className='flex w-full items-center justify-between'>
                                <span className='text-xs font-bold'>{`${playerInfo.team_rank}º`}</span>
                                <span style={{fontSize: 'x-small'}}>{`${playerInfo.team_points}pts`}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <PlayerStatsTable filterPlayers={playerInfo ? playerInfo.stats : []} sortedBy={sortedBy}
                setSortedBy={setSortedBy} desc={desc} setDesc={setDesc} periods={true}
                currentPage={currentPage} onPageChange={setCurrentPage}
            />
        </div>
    );
}