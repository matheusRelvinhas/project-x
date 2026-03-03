'use client';

// @ts-expect-error not-error
import Flag from 'react-world-flags';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Icon from '@/components/icon';
import Button from "@/components/button";
import { useEffect, useMemo, useState } from 'react';
import { useAppContext } from "@/context/context";
import { axiosGet } from '@/utils/axios';
import { toast } from "react-toastify";
import TeamImage from '@/components/team-image';
import { type GameStats } from "@/app/games/page";
import { type PlayerStats } from "@/app/players/page";
import{ type GameSideInfo } from '@/components/game-side';
import { mapsName } from '@/utils/utils';
import GameMapsScore from '@/components/game-maps-score';
import PlayerImage from '@/components/player-image';
import Ripple from 'react-ripplejs';
import { FilterTag } from '@/components/filter-tag';
import GameSide from '@/components/game-side';

export type GamePlayerStats = {
    additional_value: number;
    adr: number;
    assists: number;
    clutches: number;
    country_code: string;
    damage: number;
    death: number;
    enemy_team_name: string;
    first_death: number;
    first_kills: number;
    got_damage: number;
    headshots: number;
    hits: number;
    kast: number;
    kills: number;
    money_save: number;
    money_spent: number;
    multikills: Record<number, number>;
    name: string;
    pistols_value: number;
    player_rating: number;
    player_rating_value: number;
    shots: number;
    slug: string;
    team_name: string;
    team_slug: string;
    total_equipment_value: number;
    trade_death: number;
    trade_kills: number;
    utility_value: number;
    weapons_value: number;
};

export type GameMapsPlayerStats = {
    map_name: string;
    players_stats: GamePlayerStats[];
};


export default function Game() {
    const { isMobile, setLoading } = useAppContext();
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const { slug } = params;

    const [gameInfo, setGameInfo] = useState<GameStats|null>(null);

    const [gamePlayerStats, setGamePlayerStats] = useState<GamePlayerStats[]|null>(null);
    const [gameShortPlayerStats, setGameShortPlayerStats] = useState<GamePlayerStats[]|null>(null);
    const [mapPlayerStats, setMapPlayerStats] = useState<GameMapsPlayerStats[]|null>(null);
    const [mapShortPlayerStats, setMapShortPlayerStats] = useState<GameMapsPlayerStats[]|null>(null);
    const [playerStatsInfo, setPlayerStatsInfo] = useState<PlayerStats[]|null>(null);
    const [gameSideStats, setGameSideStats] = useState<GameSideInfo[]>([]);

    const [selectedMap, setSelectedMap] = useState<string|null>(null);
    const [filterPlayerStats, setFilterPlayerStats] = useState<GamePlayerStats[]|null>(null);
    const [selectedStat, setSelectedStat] = useState<string>('name');
    const [sortAsc, setSortAsc] = useState<boolean>(true);
    const [mobileSelectedTab, setMobileSelectedTab] = useState<'overall'|'performance'>('overall');

    const statsTable = useMemo(() => {
        const base = [{ title: 'Jogador', key: 'name', tooltip: 'Jogador' }];
        const overallStats = [
            { title: 'Kills', key: 'kills', tooltip: 'Kills' },
            { title: 'Mortes', key: 'death', tooltip: 'Mortes' },
            { title: 'Assist.', key: 'assists', tooltip: 'Assistências' }
        ];
        const performanceStats = [
            { title: 'ADR', key: 'adr', tooltip: 'Média de Dano por Round' },
            { title: 'Duelos', key: 'trade_kills', tooltip: 'Duelos Kills/Mortes' },
            { title: 'Multikills', key: 'multikills', tooltip: 'Multikills' },
            { title: 'Clutches', key: 'clutches', tooltip: 'Clutches' }
        ];
        if (!isMobile) {
            return [
                ...base,
                ...overallStats,
                ...performanceStats
            ];
        };
        if (mobileSelectedTab === 'overall') {
            return [
                ...base,
                ...overallStats
            ];
        };
        return [
            ...base,
            ...performanceStats
        ];
    }, [mobileSelectedTab, isMobile]);

    const selectStatAndOrder = (statKey: string) => {
        if (selectedStat === statKey) {
            setSortAsc(!sortAsc);
        } else {
            setSelectedStat(statKey);
            setSortAsc(true);
        };
    };

    useEffect(() => {
        const mapParam = searchParams.get("map");
        if (mapParam) {
            setSelectedMap(mapParam);
        };
    }, [searchParams]);

    const handleBack = () => {
        router.back();
    };

    useEffect(() => {
        const getGame = async (slug:string|string[]) => {
            setLoading(true);
            await axiosGet(
                `/games_stats/game?slug=${slug}`,
                (data) => {
                    setGameInfo(data);
                },
                () => toast.error('Erro inesperado, tente novamente. #14'), true
            );
            setLoading(false);
        };
        if (slug) {
            getGame(slug);
        };
    }, [slug]);

    useEffect(() => {
        const getStats = async (
            slug:string|string[], 
            type_stats: string, 
            type_short_stats: string, 
            setStat: any,
            setShortStat: any,
        ) => {
            setLoading(true);
            await axiosGet(
                `/games_stats/game_info?slug=${slug}&game_stat=${type_stats}`,
                (data) => {
                    setStat(data[type_stats] ? data[type_stats] : []);
                    if (!data[type_stats] || !data[type_stats].length) {
                        axiosGet(
                            `/games_stats/game_info?slug=${slug}&game_stat=${type_short_stats}`,
                            (data) => {
                                console.log(data)
                                setShortStat(data[type_short_stats] ? data[type_short_stats] : []);
                            },
                            () => toast.error('Erro inesperado, tente novamente. #16'), true
                        );
                    }
                },
                () => toast.error('Erro inesperado, tente novamente. #15'), true
            );
            setLoading(false);
        };
        if (slug && gameInfo?.status == 'finished') {
            getStats(slug, 'players_stats', 'short_players_stats', setGamePlayerStats, setGameShortPlayerStats);
            getStats(slug, 'maps_players_stats', 'short_maps_players_stats', setMapPlayerStats, setMapShortPlayerStats);
            axiosGet(
                `/games_stats/game_info?slug=${slug}&game_stat=game_side_stats`,
                (data) => {
                    console.log(data.game_side_stats);
                    setGameSideStats(data.game_side_stats);

                },
                () => toast.error('Erro inesperado, tente novamente. #17'), true
            );
        };
    }, [slug, gameInfo?.status]);

    useEffect(() => {
        if (!gamePlayerStats?.length) return;
        const fetchPlayers = async () => {
            const playersInfo = await Promise.all(
                gamePlayerStats.map(p =>
                    new Promise<PlayerStats>((resolve, reject) => {
                        axiosGet(
                            `/player_stats/player?slug=${p.slug}&period=6`,
                            (data) => resolve(data),
                            (error) => reject(error),
                            true
                        );
                    })
                )
            );
            setPlayerStatsInfo(playersInfo);
        };
        fetchPlayers();
    }, [gamePlayerStats]);

    const getStatValue = (
        player: GamePlayerStats,
        sortKey: string
    ): number | string => {
        if (sortKey === 'multikills') {
            return player.multikills
                ? Object.values(player.multikills).reduce(
                    (total, value) => total + value, 0
                ) : 0;
        } else if (sortKey === 'trade_kills') {
            return player.trade_kills - player.trade_death;
        } else if ( sortKey === 'kills' || sortKey === 'death' || 
            sortKey === 'assists' || sortKey === 'adr' || sortKey === 'clutches'
        ) {
            return Number(player[sortKey as keyof GamePlayerStats]);
        } else if (sortKey == 'name') { 
            return player.kills - player.death;
        } else {
            return player[sortKey as keyof GamePlayerStats] as any;
        };
    };

    const setSortedStats = (
        stats: GamePlayerStats[]|null,
        sortKey: string,
        sortAsc: boolean
    ) => {
        if (!stats) return [];
        return [...stats].sort((a, b) => {
            const aValue = getStatValue(a, sortKey);
            const bValue = getStatValue(b, sortKey);
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return !sortAsc
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
            const numA = Number(aValue);
            const numB = Number(bValue);
            return !sortAsc
                ? numA - numB
                : numB - numA;
        });
    };

    useEffect(() => {
        if (!selectedMap) setFilterPlayerStats(setSortedStats(gamePlayerStats, selectedStat, sortAsc));
        else {
            setFilterPlayerStats(setSortedStats(mapPlayerStats?.find(m => m.map_name === selectedMap)?.players_stats || null, selectedStat, sortAsc));
        };
    }, [gamePlayerStats, mapPlayerStats, selectedMap, selectedStat, sortAsc]);

    const handleNavigation = (href: string) => {
        router.push(href);
    };

    const formatTimestampToStr = (timestamp: number): string => {
        const date = new Date(timestamp * 1000);
        const day = date.getDate();
        const month = date.toLocaleString('pt-BR', { month: 'long' });
        const year = date.getFullYear();
        return `${day} de ${month} - ${year}`;
    };

    const buttonGroup = (typeButton: 'overall' | 'performance') => {
        return (
            <Button
                    onClick={() => setMobileSelectedTab(typeButton)}
                    padding='px-[6px] py-0'
                    typeButton={mobileSelectedTab == typeButton ? 'primary' : 'default'}
                >
                    <div className='flex gap-2 items-center'>
                        <span className='text-sm'>{typeButton === 'overall' ? 'Geral' : 'Desempenho'}</span>
                    </div>
            </Button> 
        );
    };

    const scoreboardDiv = (gameInfo:GameStats, teamNum: '1' | '2') => {
        return playerStatsInfo && playerStatsInfo.length && (
            <div key={`${gameInfo.slug}-${teamNum}`} className='flex w-full flex-col gap-2 max-w-5xl p-2 bg-default-200 rounded fadeIn'>
                <div className='flex items-center gap-2'>
                    <span className='text-default-800 font-semibold text-sm'>{`Placar ${gameInfo[`team${teamNum}_name`]}`}</span>
                    <TeamImage slug={gameInfo[`team${teamNum}_slug`]} img_url={gameInfo[`team${teamNum}_img_url`]} className='h-[16px] w-[16px] w-[16px] min-w-[16px] max-w-[16px]' />
                </div>
                <div className='flex flex-col w-full overflow-x-auto gap-[1px] rounded'>
                    <div className={`flex w-full border-b border-default-200  `}>
                        {statsTable.map(s => {
                            const isNameColumn = ['name'].includes(s.key);
                            return (['name', 'kills', 'death', 'assists', 'adr', 'trade_kills', 'multikills', 'clutches'].includes(s.key) ? ( 
                                    <Ripple key={`h-${s.key}-${teamNum}`} onClick={() => selectStatAndOrder(s.key)} className={`flex select-none py-1 px-2 cursor-pointer transition items-center w-full min-w-[70px] ${selectedStat === s.key ? 'text-default-950 bg-glass-effect' : 'text-default-800 bg-default-50'} ${isNameColumn ? `w-full justify-between ${isMobile ? 'min-w-[100px] max-w-[100px]' : 'min-w-[200px] max-w-[200px]'}` : 'w-full justify-center'}`}>
                                        <span className={`font-semibold truncate ${isMobile ? 'text-[9px]' : 'text-xs'}`}>{s.title}</span>
                                        <Icon name="material-symbols:keyboard-arrow-up-rounded" className={`text-[14px] transition ${sortAsc && selectedStat === s.key ? 'rotate-180' : ''}`} />
                                    </Ripple>
                                )
                                : null
                            )
                        })}
                    </div>
                    <div className='flex w-full min-w-max items-center bg-default-50 flex-col'>
                        {filterPlayerStats && filterPlayerStats.length ? (
                            <>
                                {filterPlayerStats.map((player, i) => {
                                    if (player.team_slug !== gameInfo[`team${teamNum}_slug`]) return null;
                                    return (
                                        <div key={`${player.slug}-${i}`} className={`flex border-default-200 text-default-800 w-full pt-1 pb-[6px] items-center fadeIn hover:bg-glass-primary hover:text-default-950 transition ${i > 0 ? 'border-t' : ''}`}>
                                            {statsTable.map(s => {
                                                return (['name'].includes(s.key) ? (
                                                        <div onClick={()=>handleNavigation(`/player/${player.slug}`)} 
                                                            className={`flex px-2 w-full relative items-center gap-3 w-full hover:text-primary-600 cursor-pointer transition ${isMobile ? 'min-w-[100px] max-w-[100px]' : 'min-w-[200px] max-w-[200px]'}`} key={`stat-${s.key}-${player.slug}`}>
                                                            <div className='relative'>
                                                                <div className='flex h-[32px] w-[32px] items-center justify-center'>
                                                                    <PlayerImage slug={player.slug} img_url={playerStatsInfo?.find(p => p.slug === player.slug)?.img_url || ''} className='h-[35px] w-[32px]' />
                                                                </div>
                                                                <Flag code={player.country_code}
                                                                    style={{
                                                                        width: '14px',
                                                                        position: 'absolute',
                                                                        bottom: '-2px',
                                                                        right: '-12px',
                                                                        borderRadius: '2px',
                                                                        filter: 'drop-shadow(var(--default-700) 1px 0px 0px) drop-shadow(var(--default-700) 0px 1px 0px) drop-shadow(var(--default-700) -1px 0px 0px) drop-shadow(var(--default-700) 0px -1px 0px)',
                                                                    }}
                                                                />
                                                            </div>
                                                            <span className={`absolute top-[-3px] right-0 h-[14px] w-[18px] rounded flex items-center justify-center text-[9px] font-bold bg-default-200 ${Number(getStatValue(player, s.key)) > 0 ? 'text-success' : 'text-danger'}`}>{`${Number(getStatValue(player, s.key)) > 0 ? '+' : ''}${Number(getStatValue(player, s.key)).toFixed(0)}`}</span>
                                                            <span className={`font-semibold pt-[2px] truncate ${isMobile ? 'text-[11px]' : 'text-xs'}`}>{player.name}</span>
                                                        </div>
                                                    ) :
                                                    <div key={`stat-${s.key}-${player.slug}`} className='flex px-2 w-full min-w-[70px] items-center justify-center'>
                                                        <span className={`font-semibold ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                                                            {['trade_kills'].includes(s.key) ? (
                                                                <span className={`${Number(getStatValue(player, s.key)) == 0 ? '' : Number(getStatValue(player, s.key)) > 0 ?  'text-success' : 'text-danger'}`}>
                                                                    {`${player.trade_kills} / ${player.trade_death}`}
                                                                </span>
                                                            ) : Number(getStatValue(player, s.key)).toFixed(0)}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                })}
                            </>
                        ) : (
                            <>
                                {'Short'}
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col w-full h-full fadeIn gap-2">
            <div className='flex items-center gap-3 transition border-default-400 border-b-1 pb-2 h-[38px]'>
                {gameInfo && (
                    <div className='fadeIn flex flex-col'>
                        <div className='flex items-center gap-2'>
                            <TeamImage slug={gameInfo.team1_slug} img_url={gameInfo.team1_img_url} className='h-[16px] w-[16px] w-[16px] min-w-[16px] max-w-[16px]' />
                            <span className='flex text-sm font-semibold'>{gameInfo.team1_name}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <TeamImage slug={gameInfo.team2_slug} img_url={gameInfo.team2_img_url} className='h-[16px] w-[16px] w-[16px] min-w-[16px] max-w-[16px]' />
                            <span className='flex text-sm font-semibold'>{gameInfo.team2_name}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className='flex w-full items-start justify-between gap-2'>
                <Button onClick={handleBack} typeButton="default" padding="p-0">
                    <Icon name="material-symbols:arrow-back-rounded" className="text-2xl" />
                </Button>
                {gameInfo && (
                    <div className='fadeIn flex items-center justify-end flex-wrap gap-1'>
                        <div onClick={()=>handleNavigation(`/league/${gameInfo.league_slug}`)} 
                            className='flex items-center bg-default-50 rounded px-2 py-1 w-fit cursor-pointer hover:text-primary-600'>
                            <span className={`font-semibold ${isMobile ? 'text-[11px]' : 'text-xs'}`}>{gameInfo.league_name}</span>
                        </div>
                        <div className='flex items-center bg-default-50 rounded px-2 py-1 w-fit'>
                            <span className={`font-semibold ${isMobile ? 'text-[11px]' : 'text-xs'}`}>{`Bo${gameInfo.bo_type ?? gameInfo.bo_type}`}</span>
                        </div>
                        <div className='flex items-center bg-default-50 rounded px-2 py-1 w-fit'>
                            <span className={`font-semibold ${isMobile ? 'text-[11px]' : 'text-xs'}`}>{gameInfo.stage_round?.round ?? gameInfo.stage_round?.round}</span>
                        </div>
                        <div className='flex items-center bg-default-50 rounded px-2 py-1 w-fit'>
                            <span className={`font-semibold ${isMobile ? 'text-[11px]' : 'text-xs'}`}>{formatTimestampToStr(gameInfo.start_timestamp)}</span>
                        </div>
                    </div>
                )}
            </div>

            {gameInfo && gameInfo.games_score && (
                <div className='fadeIn flex flex-col w-full items-center justify-center gap-2 max-w-5xl'>
                    <Button className={`flex overflow-hidden w-full max-w-lg bg-default-100 gap-3 items-center justify-center hover:border-primary-700 hover:bg-default-200 ${!selectedMap ? 'border-primary-600' : ''}`} onClick={()=> setSelectedMap(null)}>
                        <div className='flex w-full items-center justify-end gap-3'>
                            <TeamImage slug={gameInfo.team1_slug} img_url={gameInfo.team1_img_url} className={`${ isMobile ? 'h-[27px] w-[27px] min-w-[27px] max-w-[27px]' : 'h-[42px] w-[42px] min-w-[42px] max-w-[42px]'}`} />
                            <span className='flex items-center justify-end w-full max-w-[125px] text-sm text-end font-semibold'>{gameInfo.team1_name}</span>
                            <span className={`flex items-center justify-center rounded shadow-md bg-default-200 min-w-[27px] ${!gameInfo.winner_team_slug ? 'text-default-950' : gameInfo.team1_slug == gameInfo.winner_team_slug ? 'text-success' : 'text-danger'}`}>
                            {gameInfo.team1_score}
                            </span>
                        </div>
                        <div className='flex w-full items-center gap-3'>
                            <span className={`flex items-center justify-center rounded shadow-md bg-default-200 min-w-[27px] ${!gameInfo.winner_team_slug ? 'text-default-950' : gameInfo.team2_slug == gameInfo.winner_team_slug ? 'text-success' : 'text-danger'}`}>
                                {gameInfo.team2_score}
                            </span>
                            <span className='flex items-center justify-start w-full max-w-[125px] text-sm font-semibold'>{gameInfo.team2_name}</span>
                            <TeamImage slug={gameInfo.team2_slug} img_url={gameInfo.team2_img_url} className={`${ isMobile ? 'h-[27px] w-[27px] min-w-[27px] max-w-[27px]' : 'h-[42px] w-[42px] min-w-[42px] max-w-[42px]'}`} />
                        </div>
                    </Button>
              
                    <div className='flex w-full items-center justify-center'>
                        <GameMapsScore size='lg' gamesScore={gameInfo.games_score} game={gameInfo} selectedMap={selectedMap} setSelectMap={setSelectedMap} />
                    </div>
                </div>
             
            )}

            {selectedMap && gameInfo && gameInfo.status == "finished" && gameInfo.parsed_status == "done" &&
                <GameSide gamesSide={gameSideStats} filterMap={selectedMap} gameInfo={gameInfo} />
            }
            
            {gameInfo && gameInfo.status == "finished" && gameInfo.parsed_status == "done" && (
                <div className='flex flex-wrap justify-between gap-2 items-center max-w-5xl'>
                    {isMobile ? (
                        <div className="flex w-max py-1 px-2 rounded gap-2 bg-default-200 text-default-700 fadeIn">
                            {buttonGroup('overall')}
                            {buttonGroup('performance')}
                        </div>
                    ) : <div></div>}
                    <div className='flex justify-end'>
                        <FilterTag items={selectedMap ? mapsName.find(map => map.value === selectedMap)?.title || '' : 'Todos os mapas'} />
                    </div>
                </div>
            )}
            {gameInfo && gameInfo.status == "finished" && gameInfo.parsed_status == "done" ? (
                <div key={`${gameInfo.slug}-finished`} className='flex flex-col gap-2 fadeIn'>
                    {scoreboardDiv(gameInfo, '1')}
                    {scoreboardDiv(gameInfo, '2')}
                </div>
            ) : (
                <div className='fadeIn flex w-full items-center justify-center max-w-5xl gap-3 p-4'>
                    <Icon name="streamline-sharp:share-time-solid" className='text-2xl text-default-700' />
                    <span className='text-sm text-default-700'>{'Nenhum resultado disponível'}</span>
                </div>
            )} 
           
        </div>
    );
}