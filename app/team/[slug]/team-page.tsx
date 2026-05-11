'use client';

// @ts-expect-error not-error
import Flag from 'react-world-flags';
import { useParams, useRouter } from 'next/navigation';
import Icon from '@/components/icon';
import Button from "@/components/button";
import { useEffect, useState, useRef } from 'react';
import { useAppContext } from "@/context/context";
import { axiosGet } from '@/utils/axios';
import { toast } from "react-toastify";
import { type TeamStats } from "@/app/teams/teams-page"; 
import TeamImage from '@/components/team-image';
import PlayerStatsTable from '@/components/player-stats-table';
import { type GameStats, type GameScore } from "@/app/games/games-page";
import { type PlayerStats, type NumericStatKeys } from "@/app/players/players-page"; 
import Select from '@/components/select';
import GamesStatsTable from '@/components/games-stats-table';
import LeaguesStatsTable from '@/components/leagues-stats-table';
import { type LeagueStats } from "@/app/leagues/leagues-page";
import MapsStatsTable from '@/components/maps-stats-table';
import { mapsName, periodText } from '@/utils/utils';
import { Typewriter } from '@/components/typewiter';

type Period = "12_months" | "6_months" | "3_months" | "last_month";
type PeriodPlayerStats = {
    slug: string;
} & {
    [key in Period]: PlayerStats;
};

export default function TeamPage() {
    const { isMobile, setLoading, theme } = useAppContext();
    const router = useRouter();
    const params = useParams();
    const { slug } = params;

    const [teamInfo, setTeamInfo] = useState<TeamStats|null>(null);
    const [playersStats, setPlayersStats] = useState<PeriodPlayerStats[]>([]);
    const [playerCurrentPage, setPlayerCurrentPage] = useState(1);
    const [filteredPlayersStats, setFilteredPlayersStats] = useState<PlayerStats[]>([]);
    const [leaguesStats, setLeaguesStats] = useState<LeagueStats[]>([]);
    const [leagueCurrentPage, setLeagueCurrentPage] = useState(1);
    const [filteredLeaguesStats, setFilteredLeaguesStats] = useState<LeagueStats[]>([]);
    const [gamesStats, setGamesStats] = useState<GameStats[]>([]);
    const [gamesCurrentPage, setGamesCurrentPage] = useState(1);
    const [filteredGamesStats, setFilteredGamesStats] = useState<GameStats[]>([]);
    const [aiAnalytics, setAiAnalytics] = useState<string|null>(null);
    const [timestampAiAnalytics, setTimestampAiAnalytics] = useState<number|null>(null);
    const [loadingAi, setLoadingAi] = useState<boolean>(false);

    const [mapsStats, setMapsStats] = useState<GameScore[]>([]);
    const [mapsCurrentPage, setMapsCurrentPage] = useState(1);
    const [filteredMapsStats, setFilteredMapsStats] = useState<GameScore[]>([]);
    
    const [sortedBy, setSortedBy] = useState<NumericStatKeys>('avg_kills');
    const [desc, setDesc] = useState<boolean>(true);
    const [period, setPeriod] = useState<Period>('6_months');
    const [mapSelected, setMapSelected] = useState<string>('');
    const [bestOfSelected, setBestOfSelected] = useState<string>('');

    const isActiveRef = useRef(true);
    useEffect(() => {
        return () => {
            isActiveRef.current = false; // cancela quando sair da página
        };
    }, []);
    
    const aiAnalyticsTeam = async (not_ai_return: boolean = false) => {
        isActiveRef.current = true;
        setLoading(true);
        setLoadingAi(true);
        let isFinished = false;
        while (!isFinished && isActiveRef.current) {
            await axiosGet(
                `/ai_analytics/team?slug=${slug}${not_ai_return ? '&not_ai_return=ok' : ''}`,
                (data) => {
                    if (!isActiveRef.current) return;
                    if (data.not_ai_return) {
                        isFinished = true;
                        return;
                    }
                    setAiAnalytics(data.ai_analytics_team ?? null);
                    setTimestampAiAnalytics(data.timestamp ?? null);
                    if (data.status === 'success') {
                        isFinished = true;
                    }
                },
                () => {
                    if (!isActiveRef.current) return;
                    isFinished = true;
                    toast.error('Erro inesperado, tente novamente. #19');
                },
                true
            );
            if (!isFinished && isActiveRef.current) {
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
        }
        if (isActiveRef.current) {
            setLoading(false);
            setLoadingAi(false);
        }
    };

    useEffect(() => {
        const getTeam = async (slug:string|string[]) => {
            setLoading(true);
            await axiosGet(
                `/teams_stats/team?slug=${slug}`,
                (data) => {
                    setTeamInfo(data.team);
                    setGamesStats(data.games);
                    setMapsStats(data.maps);
                    setPlayersStats(data.players);
                    setLeaguesStats(data.leagues);
                },
                () => toast.error('Erro inesperado, tente novamente. #12'), true
            );
            setLoading(false);
        };
        if (slug) {
            getTeam(slug);
            aiAnalyticsTeam(true);
        };
    }, [slug]);

    const handleBack = () => {
        router.back();
    };

    const now = Math.floor(Date.now() / 1000);
    const periodToSeconds: Record<Period, number> = {
        "12_months": 365 * 24 * 60 * 60,
        "6_months": 182 * 24 * 60 * 60,
        "3_months": 91 * 24 * 60 * 60,
        "last_month": 30 * 24 * 60 * 60,
    };

    const performanceGrid = (total:number, win:number, lose:number, performance:number) => {
        return (
            <div className='grid grid-cols-2 gap-1 w-full justify-center'>
                <div className='flex gap-1 bg-default-100 w-full items-center justify-between pl-2 pe-3 rounded py-[2px]'>
                    <span className='text-xs text-default-800'>{'Total'}</span>
                    <span className='text-xs text-default-800 font-semibold'>{total}</span>
                </div>
                <div className='flex gap-1 bg-default-100 w-full items-center justify-between pl-2 pe-3 rounded py-[2px]'>
                    <span className='text-xs text-default-800'>{'Vitórias'}</span>
                    <span className='text-xs text-success font-semibold'>{win}</span>
                </div>
                <div className='flex gap-1 bg-default-100 w-full items-center justify-between pl-2 pe-3 rounded py-[2px]'>
                    <span className='text-xs text-default-800'>{'Desempenho'}</span>
                    <span className={`text-xs font-semibold ${performance < 35 ? 'text-danger' : performance < 70 ? 'text-tr' : performance >= 70 ? 'text-success' : ''}`}>{`${performance}%`}</span>
                </div>
                <div className='flex gap-1 bg-default-100 w-full items-center justify-between pl-2 pe-3 rounded py-[2px]'>
                    <span className='text-xs text-default-800'>{'Derrotas'}</span>
                    <span className='text-xs text-danger font-semibold'>{lose}</span>
                </div>
            </div>
        );
    };

    useEffect(() => {
        if (!gamesStats || gamesStats.length === 0) return;
        const minTimestamp = now - periodToSeconds[period];
        let filteredGames = gamesStats
            .filter(game => game.start_timestamp >= minTimestamp)
            .sort((a, b) => b.start_timestamp - a.start_timestamp);
        if (bestOfSelected) {
            filteredGames = filteredGames.filter(game => game.bo_type == Number(bestOfSelected))
        }
        setFilteredGamesStats(filteredGames);
        setGamesCurrentPage(1);
    }, [period, gamesStats, bestOfSelected, isMobile]);

    useEffect(() => {
        if (!mapsStats || mapsStats.length === 0) return;
        const minTimestamp = now - periodToSeconds[period];
        let filteredMaps = mapsStats
            .filter(map => map.start_timestamp >= minTimestamp)
            .sort((a, b) => b.start_timestamp - a.start_timestamp);
        if (mapSelected) {
            filteredMaps = filteredMaps.filter(map => map.map_name == mapSelected)
        };
        setFilteredMapsStats(filteredMaps);
        setMapsCurrentPage(1);
    }, [period, mapSelected, mapsStats, isMobile]);

    useEffect(() => {
        if (!leaguesStats || leaguesStats.length === 0) return;
        const minTimestamp = now - periodToSeconds[period];
        const filteredLeagues = leaguesStats
            .filter(league => league.start_timestamp >= minTimestamp)
            .sort((a, b) => b.start_timestamp - a.start_timestamp);
        setFilteredLeaguesStats(filteredLeagues);
        setLeagueCurrentPage(1);
    }, [period, leaguesStats, isMobile]);

    useEffect(() => {
        if (!playersStats || playersStats.length === 0) return;
        const filtered = playersStats
            .filter(player => player[period] !== null && player[period] !== undefined)
            .map(player => {
            return player[period];
        });
        setFilteredPlayersStats(filtered);
        setPlayerCurrentPage(1);
    }, [period, playersStats, isMobile]);

    return (
        <div className="flex flex-col w-full h-full fadeIn gap-2">
            <div className='flex items-center gap-3 transition border-default-400 pb-2 h-[38px]'>
                {teamInfo && (
                    <>
                        <TeamImage slug={teamInfo?.slug} img_url={teamInfo?.img_url} className='h-[30px] min-w-[30px] text-default-950' />
                        <span className='text-lg font-bold text-default-950'>{teamInfo?.team_name}</span>
                        <div className='flex gap-2'>
                            <Flag code={teamInfo?.country_code}
                                style={{
                                    width: '16px',
                                    borderRadius: '2px',
                                    filter: 'drop-shadow(var(--default-700) 1px 0px 0px) drop-shadow(var(--default-700) 0px 1px 0px) drop-shadow(var(--default-700) -1px 0px 0px) drop-shadow(var(--default-700) 0px -1px 0px)',
                                }}     
                            />
                            <span className='flex text-default-800 text-sm'>{teamInfo?.region_code}</span>
                        </div>
                    </>
                )}
            </div>
            
            <div className='flex w-full items-center justify-between max-w-[1170px]'>
                <Button onClick={handleBack} typeButton="default" padding="p-0">
                    <Icon name="material-symbols:arrow-back-rounded" className="text-2xl" />
                </Button>
                {(teamInfo && teamInfo?.rank && teamInfo?.points) && (
                    <div className='flex flex-col w-[78px] h-[32px] px-2 py-[1px] bg-default-50 rounded-sm'>
                        <span style={{fontSize: 'x-small'}}>valve rank</span>
                        <div className='flex w-full items-center justify-between'>
                            <span className='text-xs font-bold'>{`${teamInfo.rank}º`}</span>
                            <span style={{fontSize: 'x-small'}}>{`${teamInfo.points}pts`}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className='flex text-sm max-w-[1170px]'>
                <Select value={period} setValue={(val) => setPeriod(val as Period)} placeholder='Selecione um período'
                    options={[
                        {title: periodText('last_month'), value: 'last_month'},
                        {title: periodText('3_months'), value: '3_months'},
                        {title: periodText('6_months'), value: '6_months'},
                        {title: periodText('12_months'), value: '12_months'}
                    ]}
                />
            </div>

            <div className={`flex items-start flex-wrap gap-2 w-full max-w-[1170px]`}>
                <div className={`flex max-w-sm ${isMobile ? 'w-[100%]' : 'w-[50%]'}`}>
                    <GamesStatsTable gamesStats={filteredGamesStats} currentPage={gamesCurrentPage} title={'Jogos'} slug={slug}
                        onPageChange={setGamesCurrentPage} gameMap={false} itemsPerPage={ 4 + (isMobile ? 0 : 1)} >
                        {performanceGrid(
                                filteredGamesStats.length, 
                                filteredGamesStats.filter(m=>m.winner_team_slug==slug).length, 
                                filteredGamesStats.filter(m=>m.winner_team_slug!=slug).length, 
                                filteredGamesStats.length ? Math.round(filteredGamesStats.filter(m => m.winner_team_slug == slug).length * 100 / filteredGamesStats.length) : 0
                            )
                        }
                        <div className='flex text-sm max-w-[50%]'>
                            <Select value={bestOfSelected} setValue={(val) => setBestOfSelected(val as string)} placeholder='Selecione'
                                options={[
                                    {title: 'Todos', value: ''}, {title: 'Bo1', value: '1'}, 
                                    {title: 'Bo3', value: '3'}, {title: 'Bo5', value: '5'}
                                ]}
                            />
                        </div>
                    </GamesStatsTable>
                </div>
                <div className={`flex max-w-sm ${isMobile ? 'w-full' : 'w-1/2'}`}>
                    <MapsStatsTable mapsStats={filteredMapsStats} currentPage={mapsCurrentPage} onPageChange={setMapsCurrentPage}
                        itemsPerPage={ 4 + (isMobile ? 0 : 1)} slug={slug}>
                        {performanceGrid(
                            filteredMapsStats.length, 
                            filteredMapsStats.filter(m=>m.winner_team==slug).length, 
                            filteredMapsStats.filter(m=>m.winner_team!=slug).length, 
                            filteredMapsStats.length ? Math.round(filteredMapsStats.filter(m => m.winner_team == slug).length * 100 / filteredMapsStats.length) : 0
                        )}
                        <div className='flex items-center justify-between w-full gap-1'>
                            <div className='flex text-sm max-w-[calc(50%-2px)]'>
                                <Select value={mapSelected} setValue={(val) => setMapSelected(val as string)} placeholder='Selecione um mapa'
                                    options={[{title: 'Todos', value: ''}, ...mapsName]}
                                />
                            </div>
                        </div>
                    </MapsStatsTable>
                </div>
                <div className={`flex max-w-sm ${isMobile ? 'w-[100%]' : 'w-[50%]'}`}>
                    <LeaguesStatsTable leaguesStats={filteredLeaguesStats} title='Campeonatos' showTeam={slug} 
                        currentPage={leagueCurrentPage} onPageChange={setLeagueCurrentPage} 
                        itemsPerPage={ 3 + (isMobile ? 0 : 1)} >
                        <div className='grid grid-cols-2 gap-1 w-full justify-center'>
                            {filteredLeaguesStats?.filter((league) => league.tournament_prizes?.some((prize) => 
                                prize.place === "1st" && prize.teams.slug === slug
                            )).map((l, i) => (
                                <div key={`${i}${l.slug}`} className='flex fadeIn gap-1 bg-default-100 w-full items-center justify-between px-2 rounded py-[2px]'>
                                    <span className='text-[11px] flex w-full text-default-800'>
                                        {l.name.length > 36 ? `${l.name.slice(0, 36)}...` : l.name}
                                    </span>
                                    <Icon className="text-sm text-default-900" name="mdi:crown" />
                                </div>
                            ))}
                        </div>
                    </LeaguesStatsTable>
                </div>
            </div>
            
            {playersStats.length ? (
                <div className='flex w-full items-center max-w-[1170px]'>
                    <PlayerStatsTable filterPlayers={filteredPlayersStats} sortedBy={sortedBy}
                        setSortedBy={setSortedBy} desc={desc} setDesc={setDesc} title={'Jogadores'}
                        currentPage={playerCurrentPage} onPageChange={setPlayerCurrentPage}
                    />
                </div>
            ) : null}

            {gamesStats.length ? (
                <div className='flex justify-end justify-center w-full mt-2 w-full max-w-[1170px]'>
                    {aiAnalytics ? (
                        <Typewriter text={aiAnalytics} timestamp={timestampAiAnalytics} />
                    ) : (
                        <Button isDisabled={loadingAi} onClick={()=>aiAnalyticsTeam(false)} className='flex items-center hover:text-primary-600 hover:border-primary-600' padding="px-3 py-2">
                            <img className={`h-[28px] min-w-[28px] animate-float ${loadingAi ? "animate-spin" : ""}`} src={`/img/logo-${theme}.png`} />
                            {loadingAi 
                                ? <span className='text-left pl-2 text-xs fadeIn'>{'Pensando...'}</span>
                                : <span className='text-left pl-2 text-xs fadeIn'>{'Análise IA'}</span>
                            }
                        </Button>
                    )}
                </div>
            ):null}
        </div>
    );
};
