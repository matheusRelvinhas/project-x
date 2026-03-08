'use client';

import { useParams, useRouter } from 'next/navigation';
import Icon from '@/components/icon';
import Button from "@/components/button";
import { useEffect, useState } from 'react';
import { useAppContext } from "@/context/context";
import { axiosGet } from '@/utils/axios';
import { toast } from "react-toastify";
import { type LeagueStats } from "@/app/leagues/leagues-page";
import { type GameStats } from "@/app/games/games-page";
import LeagueImage from '@/components/league-image';
import GamesStatsTable from '@/components/games-stats-table';
import Select from '@/components/select';
import TeamImage from '@/components/team-image';

export default function League() {
    const { isMobile, setLoading } = useAppContext();
    const router = useRouter();
    const handleNavigation = (href: string) => {
        router.push(href);
    };
    const params = useParams();

    const handleBack = () => {
        router.back();
    };

    const { slug } = params;

    const [leagueInfo, setLeagueInfo] = useState<LeagueStats|null>(null);
    const [gamesUpcoming, setGamesUpcoming] = useState<GameStats[]>([]);
    const [gamesFinished, setGamesFinished] = useState<GameStats[]>([]);
    const [isCurrentGame, setIsCurrentGames] = useState<boolean>(false);
    const [status, setStatus] = useState<'finished'|'upcoming'>('finished');
    const [stageSelected, setStageSelected] = useState<string>('');

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const getLeague = async (slug:string|string[]) => {
            setLoading(true);
            await axiosGet(
                `/leagues_stats/league?slug=${slug}`,
                (data) => {
                    setLeagueInfo(data);
                },
                () => toast.error('Erro inesperado, tente novamente. #6'), true
            );
            setLoading(false);
        };
        const getGames = async (slug:string|string[], status:'finished'|'upcoming') => {
            setLoading(true);
            await axiosGet(
                `/leagues_stats/${status}?slug=${slug}`,
                (data) => {
                    const sortedGames = status == 'finished'
                        ? [...data.games].sort((a, b) => b.start_timestamp - a.start_timestamp)
                        : [...data.games].sort((a, b) => a.start_timestamp - b.start_timestamp)
                    if(status=='upcoming') setGamesUpcoming(sortedGames);
                    if(status=='finished') setGamesFinished(sortedGames);
                },
                () => toast.error('Erro inesperado, tente novamente. #7'), true
            );
            setLoading(false);
        };
        if (slug) {
            getLeague(slug);
            getGames(slug, 'finished');
            getGames(slug, 'upcoming');
        };
    }, [slug]);

    useEffect(() => {
        const getIsCurrentGame = async (slug:string|string[]) => {
            setLoading(true);
            await axiosGet(
                `/leagues_stats/current?slug=${slug}`,
                (data) => {
                    setIsCurrentGames(data.current);
                },
                () => toast.error('Erro inesperado, tente novamente. #8'), true
            );
            setLoading(false);
        };
        if (slug) {
            getIsCurrentGame(slug);
            const interval = setInterval(() => {
                getIsCurrentGame(slug);
            }, 180000);
            return () => clearInterval(interval);
        };
    }, [slug]);

    const buttonGroup = (statusValue:'upcoming'|'finished') => {
        return (
            <Button
                onClick={() => setStatus(statusValue)}
                padding='px-[6px] py-0'
                typeButton={status == statusValue ? 'primary' : 'default'}
            >
                <div className='flex gap-2 items-center'>
                    <span className='text-sm'>{statusValue=='upcoming' ? 'Próximos' : statusValue=='finished' && 'Finalizados'}</span>
                </div>
            </Button>
        );
    };

    useEffect(() => {

    }, [stageSelected]);

    const formatTimestampToStr = (timestamp: number): string => {
        const date = new Date(timestamp * 1000);
        const day = date.getDate();
        const month = date.toLocaleString('pt-BR', { month: 'long' });
        const year = date.getFullYear();
        return `${day} de ${month} - ${year}`;
    };

    const stageOptions = (games:GameStats[]) => {
        const mapOptions = [...new Set(games.map(g => g.stage_round?.round).filter(r => r !== null && r !== undefined))]
        return mapOptions.map(g => {
            return {
                title: g,
                value: g
            }
        })
    };

    useEffect(() => {
        if (gamesUpcoming.length || leagueInfo?.status=='upcoming') {
            setStatus('upcoming');
        }
    }, [gamesUpcoming, leagueInfo]);

    const parsePlace = (place?: string | null): number => {
        if (!place) return 999;
        const num = parseInt(place);
        return isNaN(num) ? 999 : num;
    };

    const mergedStages = [
        { title: 'Todos', value: '' },
        ...stageOptions(gamesUpcoming),
        ...stageOptions(gamesFinished)
    ];

    const uniqueStages = Array.from(
        new Map(mergedStages.map(item => [item.value, item]))
    ).map(([_, item]) => item);

    return (
        <div className="flex flex-col w-full h-full fadeIn gap-2">
            <div className='flex items-center gap-2 transition border-default-400 pb-2 h-[38px]'>
                {leagueInfo && (
                    <>  
                        <div className='flex items-center w-full gap-2'>
                            <LeagueImage
                                slug={leagueInfo.slug}
                                img_url={leagueInfo.img_url}  
                                className='w-[36px] min-w-[36px] max-w-[36px] h-[36px]' 
                            />
                            <span className={`flex items-center text-sm font-semibold ${isMobile && 'max-w-[calc(100%-94px)]'}`}>{leagueInfo.name}</span>
                        </div>
                    </>
                )}
            </div>

            <div className='flex w-full items-start gap-2 justify-between max-w-5xl'>
                <Button onClick={handleBack} typeButton="default" padding="p-0">
                    <Icon name="material-symbols:arrow-back-rounded" className="text-2xl" />
                </Button>
                <div className='flex items-center justify-end flex-wrap gap-1'>
                    {isCurrentGame && (
                        <div className='flex items-center fadeIn cursor-pointer bg-default-300 h-[30px] rounded px-2 py-1 gap-2 text-default-900 hover:text-primary-600'
                            onClick={()=>handleNavigation(`/games`)}>
                            <div className="relative flex flex-start h-[10px] w-[10px]">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-[10px] w-[10px] bg-danger"></span>
                            </div>
                            <span className='font-semibold text-xs'>Ao vivo</span>
                        </div>
                    )}
                    {leagueInfo && (
                        <>  
                            <div className='flex items-center h-[30px]'>
                                <div className='flex items-center h-[24px] bg-default-50 rounded pl-2 py-1 w-fit'>
                                    <span className='italic font-semibold text-xs'>tier</span>
                                    <Icon className='text-3xl text-primary-600' name={`mdi:letter-${leagueInfo.tier}`}/>
                                </div>
                            </div>
                            <div className='flex items-center h-[30px]'>
                                <div className='flex items-center bg-default-50 rounded px-2 py-1 w-fit'>
                                    <span className='font-semibold text-xs'>{formatTimestampToStr(leagueInfo.start_timestamp)}</span>
                                </div>
                            </div>
                            {leagueInfo.prize ? (
                                <div className='flex items-center h-[30px]'>
                                    <div className='flex items-center bg-default-50 font-semibold rounded px-2 py-1 gap-2 text-xs w-fit'>
                                        <span className='text-default-900'>{'Premiação'}</span>
                                        <div className='flex'>
                                            <Icon className='text-success text-sm' name={`mdi:dollar`}/>
                                            <span className="text-xs">{leagueInfo.prize.toLocaleString('fr-FR')}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </>
                    )}
                </div>
            </div>

            <div className="w-full flex min-h-[40px] gap-2 flex-wrap max-w-5xl">
                <div className="flex w-max py-1 px-2 rounded gap-2 bg-default-200 text-default-700">
                    {leagueInfo?.status=='upcoming' ? null : buttonGroup('finished')}
                    {gamesUpcoming.length || leagueInfo?.status=='upcoming' ? buttonGroup('upcoming') : null} 
                </div>
                {(gamesUpcoming.length || gamesFinished.length) ? (
                    <div className='flex min-w-[100px] max-w-[40%] fadeIn text-sm'>
                        <Select value={stageSelected} setValue={(val) => setStageSelected(val as string)} placeholder='Selecione um stage'
                            options={uniqueStages}
                        />
                    </div>
                ) : null}
            </div>

            <div className='flex w-full items-start gap-2 flex-wrap max-w-5xl'>
                <div className='flex items-center w-full max-w-4xl'>
                    <GamesStatsTable
                        gamesStats={status=='finished' ? (
                            stageSelected ? gamesFinished.filter(g=>g.stage_round?.round==stageSelected) : gamesFinished
                            ) : stageSelected ? gamesUpcoming.filter(g=>g.stage_round?.round==stageSelected) : gamesUpcoming
                        } 
                        title={'Jogos'}  
                        currentPage={currentPage} rounterLeague={false}
                        onPageChange={setCurrentPage}
                        itemsPerPage={ 8 + (isMobile ? 0 : 4)} />
                </div>
                
                {(leagueInfo?.teams?.length || leagueInfo?.tournament_prizes?.length) ? (
                    <div className='flex flex-col w-full max-w-md gap-2 bg-default-200 p-2 rounded'>
                        <div className='flex items-center gap-2'>
                            <span className='text-default-800 font-semibold text-sm'>{'Times'}</span>
                        </div>
                        <div className='grid grid-cols-2 gap-1 w-full justify-center'>
                            {leagueInfo.tournament_prizes ? (
                                leagueInfo.tournament_prizes
                                    .slice()                             // evita mutação
                                    .sort((a, b) => parsePlace(a.place) - parsePlace(b.place))
                                    .map((t,i)=> (
                                    <div key={`${t.teams.slug}${i}`} className='flex w-full items-center justify-between gap-2 cursor-pointer rounded bg-default-50 px-2 py-1 hover:text-primary-600'
                                        onClick={()=>handleNavigation(`/team/${t.teams.slug}`)}>
                                        <div className='flex items-center gap-2'>
                                            <TeamImage slug={t.teams.slug} img_url={t.teams.img_url} className='h-[20px] w-[20px]' />
                                            <span className='text-xs'>{t.teams.name}</span>
                                        </div>
                                        <div className='flex gap-1 items-center'>
                                            <span className='text-xs'>{t.place}</span>
                                            {t.place=='1st' && (
                                                <Icon className="text-md" name="mdi:crown" />
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : leagueInfo.teams ? (
                                leagueInfo.teams.map((t,i)=> (
                                    <div key={`${t.slug}${i}`} className='flex w-full items-center gap-2 cursor-pointer rounded bg-default-50 px-2 py-1 hover:text-primary-600'
                                        onClick={()=>handleNavigation(`/team/${t.slug}`)}>
                                        <TeamImage slug={t.slug} img_url={t.img_url} className='h-[20px] w-[20px]' />
                                        <span className='text-xs font-semibold'>{t.name}</span>
                                    </div>
                                ))
                            ) : null}
                        </div>
                    </div>
                ) : null}
            </div>
            
        </div>
    );
}