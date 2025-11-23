'use client';

import { useState, useEffect, useMemo } from "react";
import Icon from '@/components/icon';
import Ripple from 'react-ripplejs';
import PlayerImage from '@/components/player-image';
import { useAppContext } from '@/context/context';
import Pagination from '@/components/pagination';
// @ts-ignore
import Flag from 'react-world-flags';
import Button from "@/components/button";
import { type PlayerStats, type NumericStatKeys } from "@/app/players/page"; 


interface PlayerStatsTableProps {
    filterPlayers: PlayerStats[];
    sortedBy: NumericStatKeys;
    setSortedBy: (s: NumericStatKeys) => void;
    desc: boolean;
    setDesc: (b: boolean) => void;
    currentPage: number;
    onPageChange: (page: number) => void;
    title?: string|null;
}

export default function PlayerStatsTable({
    filterPlayers,
    sortedBy,
    setSortedBy,
    desc,
    setDesc,
    currentPage,
    onPageChange,
    title=null
}: PlayerStatsTableProps) {
    
    const ITEMS_PER_PAGE = 12;
    const { isMobile } = useAppContext();
    const [playerHover, setPlayerHover] = useState<string|null>('');
    const [filteredPlayers, setFilteredPlayers] = useState<PlayerStats[]>([]);

    const totalPages = Math.ceil(filteredPlayers.length / ITEMS_PER_PAGE);
    const currentPlayers = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return filteredPlayers.slice(start, end);
    }, [filteredPlayers, currentPage]);

    const [showStats, setShowStats] = useState<string[]>([]);
    const statsGroup = [
        { title: 'Geral', stats: ['avg_kills', 'avg_death', 'avg_damage', 'games_count']},
        { title: 'Desempenho', stats: ['avg_first_kills', 'avg_first_death', 'avg_trade_kills', 'avg_assists']},
        { title: 'Objetivo', stats: ['avg_headshots', 'avg_headshot_kills_accuracy', 'avg_shots', 'avg_shots_accuracy']},
        { title: 'Granadas', stats: ['avg_flash_assists', 'avg_flash_hits', 'avg_flash_duration', 'avg_he_damage', 'avg_molotov_damage']},
        { title: 'Rifles', stats: ['avg_ak47_kills', 'avg_ak47_damage', 'avg_awp_kills', 'avg_awp_damage', 'avg_m4a1_kills', 'avg_m4a1_damage']},
        { title: 'Pistols', stats: ['avg_desert_eagle_kills', 'avg_desert_eagle_damage', 'avg_glock_kills', 'avg_glock_damage', 'avg_usp_s_kills', 'avg_usp_s_damage']},
        { title: 'Economia', stats: ['avg_kill_cost', 'avg_hundred_damage_cost', 'avg_saved']},
        { title: 'Multikills', stats: ['multikills_vs_5', 'multikills_vs_4', 'multikills_vs_3', 'multikills_vs_2']},
        { title: 'Clutches', stats: ['clutches_vs_5', 'clutches_vs_4', 'clutches_vs_3', 'clutches_vs_2', 'clutches_vs_1']},
    ];
    if (!showStats.length) setShowStats(statsGroup[0].stats);

    const selectStat = (stat:string) => {
        if (sortedBy == stat) setDesc(!desc);
        else {
            setSortedBy(stat as NumericStatKeys);
            setDesc(true);
        }
    };

    const statText = (statKey:string) => {
        if (statKey=='avg_kills') return 'Kills';
        else if (statKey=='avg_death') return 'Morte';
        else if (statKey=='avg_damage') return 'Danos';
        else if (statKey=='games_count') return 'Jogos';
        else if (statKey=='avg_first_kills') return 'Primeira kill';
        else if (statKey=='avg_first_death') return 'Primeira morte';
        else if (statKey=='avg_trade_kills') return 'Trade kills';
        else if (statKey=='avg_assists') return 'Assistências';
        else if (statKey=='avg_headshots') return 'Tiros da cabeça';
        else if (statKey=='avg_headshot_kills_accuracy') return 'Tiros da cabeça %';
        else if (statKey=='avg_shots') return 'Tiros';
        else if (statKey=='avg_shots_accuracy') return 'Precisão';
        else if (statKey=='avg_flash_assists') return 'Flash assitência';
        else if (statKey=='avg_flash_hits') return 'Cego flash';
        else if (statKey=='avg_flash_duration') return 'Flash duração';
        else if (statKey=='avg_he_damage') return 'HE danos';
        else if (statKey=='avg_molotov_damage') return 'Molotov danos';
        else if (statKey=='avg_ak47_kills') return 'AK47 kills';
        else if (statKey=='avg_ak47_damage') return 'AK47 danos';
        else if (statKey=='avg_awp_kills') return 'AWP kills';
        else if (statKey=='avg_awp_damage') return 'AWP danos';
        else if (statKey=='avg_m4a1_kills') return 'M4A1 kills';
        else if (statKey=='avg_m4a1_damage') return 'M4A1 danos';
        else if (statKey=='avg_desert_eagle_kills') return 'D.Eagle kills';
        else if (statKey=='avg_desert_eagle_damage') return 'D.Eagle danos';
        else if (statKey=='avg_glock_kills') return 'Glock kills';
        else if (statKey=='avg_glock_damage') return 'Glock danos';
        else if (statKey=='avg_usp_s_kills') return 'USP kills';
        else if (statKey=='avg_usp_s_damage') return 'USP danos';
        else if (statKey=='avg_kill_cost') return 'Custo kills';
        else if (statKey=='avg_hundred_damage_cost') return 'Danos/100 custos';
        else if (statKey=='avg_saved') return 'Salvo';
        else if (statKey=='multikills_vs_5') return '5 Kills';
        else if (statKey=='multikills_vs_4') return '4 Kills';
        else if (statKey=='multikills_vs_3') return '3 Kills';
        else if (statKey=='multikills_vs_2') return '2 Kills';
        else if (statKey=='clutches_vs_5') return 'Clutches vs 5';
        else if (statKey=='clutches_vs_4') return 'Clutches vs 4';
        else if (statKey=='clutches_vs_3') return 'Clutches vs 3';
        else if (statKey=='clutches_vs_2') return 'Clutches vs 2';
        else if (statKey=='clutches_vs_1') return 'Clutches vs 1';
        else return statKey;
    };

    const formatStat = (statKey:string, statValue:number) => {
        if (['games_count', 'multikills_vs_5', 'multikills_vs_4', 'multikills_vs_3', 'multikills_vs_2', 'clutches_vs_5', 'clutches_vs_4', 'clutches_vs_3', 'clutches_vs_2', 'clutches_vs_1'].includes(statKey)) return statValue.toFixed(0);
        else if (['avg_first_kills', 'avg_first_death', 'avg_trade_kills', 'avg_assists', 'avg_flash_assists', 'avg_ak47_kills', 'avg_awp_kills', 'avg_m4a1_kills', 'avg_desert_eagle_kills', 'avg_glock_kills', 'avg_usp_s_kills'].includes(statKey)) return statValue.toFixed(3);
        else if (['avg_headshot_kills_accuracy', 'avg_shots_accuracy'].includes(statKey)) return `${(statValue*100).toFixed(1)}%`;
        else if (['avg_flash_duration'].includes(statKey)) return (statValue/1000000000).toFixed(2);
        else if (['avg_kill_cost', 'avg_hundred_damage_cost', 'avg_saved'].includes(statKey)) return `${(statValue/1000).toFixed(2)}K`;
        else return statValue.toFixed(2);
    };

    useEffect(() => {
        setSortedBy(showStats[0] as NumericStatKeys);
        setDesc(true);
    }, [showStats]);

    useEffect(() => {
        const sortedFilter = [...filterPlayers].sort((a, b) => desc ? (b[sortedBy] ?? 0) - (a[sortedBy] ?? 0) : (a[sortedBy] ?? 0) - (b[sortedBy] ?? 0));
        setFilteredPlayers(sortedFilter);
    }, [filterPlayers, sortedBy, desc]);

    return (
        <div className='flex flex-col gap-2 w-full max-w-5xl'>
            <div className="w-full overflow-x-auto overflow-y-hidden rounded-lg min-h-[40px]">
                <div className="flex w-max py-1 px-2 rounded-lg gap-2 bg-default-200 text-default-700">
                    {statsGroup.map(g => (
                        <Button
                            key={g.title}
                            onClick={() => setShowStats(g.stats)}
                            padding='px-[6px] py-0'
                            typeButton={g.stats.includes(showStats[0]) ? 'primary' : 'default'}
                        >
                            <div className='flex gap-2 items-center'>
                                <span className='text-sm'>{g.title}</span>
                            </div>
                        </Button>
                    ))}
                </div>
            </div>

            {currentPlayers.length ? (
                <div className='flex flex-col gap-2 p-2 bg-default-200 rounded-lg'>
                    {title && (
                        <div className='flex gap-2 items-center'>
                            <span className='text-default-800 font-semibold text-sm'>{title}</span>
                        </div>
                    )}
                    <div className='overflow-x-auto fadeIn bg-default-50 border-1 border-default-400 rounded-lg w-full'>
                        <div className='min-w-max'>
                            <div className='flex text-xs font-bold bg-default-100 text-default-800 items-center select-none rounded-t-lg'>
                                <span className={`flex w-full pl-3 py-2 min-w-[200px] ${isMobile ? 'max-w-[200px]' : 'max-w-[30%]'}`}>Jogador</span>
                                {showStats.map(s => (
                                    <Ripple key={s} onClick={() => selectStat(s)} className={`flex min-h-[48px] fadeIn py-2 w-full text-center items-center justify-center min-w-[88px] cursor-pointer ${sortedBy === s && 'text-default-1000'}`}>
                                        <span className='flex'>{statText(s)}</span>
                                        <Icon name="material-symbols:keyboard-arrow-down-rounded" className={`text-[14px] transition ${(!desc && sortedBy === s) && 'rotate-180'}`} />
                                    </Ripple>
                                ))}
                            </div>
                            
                            {currentPlayers.map((player, i) => (
                                <div 
                                    onClick={() => setPlayerHover(player.slug)} 
                                    className={`text-sm flex justify-between w-full text-default-950 hover:bg-glass-primary border-default-400 border-t-1 transition ${player.slug === playerHover && 'bg-glass-primary'}`} 
                                    key={player.slug}
                                >
                                    <div className={`flex items-center gap-3 py-[6px] w-full pl-3 min-w-[200px] ${isMobile ? 'max-w-[200px]' : 'max-w-[30%]'}`}>
                                        <div className='relative'>
                                            <div className='flex h-[35px] w-[35px] items-center'>
                                                <PlayerImage slug={player.slug} extension={player.img_extension} className='h-[35px] min-w-[30px]' />
                                            </div>
                                            <Flag code={player.country_code}
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
                                        <div className='flex h-full w-full flex-col'>
                                            <div className='flex gap-2 items-center'>
                                                <span className='flex font-bold whitespace-nowrap'>{player.nickname}</span>
                                                <span className='flex w-full text-[10px] text-default-800 whitespace-nowrap overflow-hidden'>{player.team_name && player.team_name}</span>
                                            </div>
                                            <span className='flex whitespace-nowrap text-[10px] text-default-800'>{`${player.first_name} ${player.last_name}`}</span>
                                        </div>
                                    </div>
                                    {showStats.map((s) => (
                                        <span key={i + s} className="flex fadeIn font-semibold text-[12px] w-full items-center justify-center min-w-[88px]">
                                            {(player[s as keyof PlayerStats] !== undefined && player[s as keyof PlayerStats] !== null)
                                                ? formatStat(s, (player[s as keyof PlayerStats] as number)) : '-'
                                            }
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                        />
                    )}
                </div>
            ) : (
                <div className='flex fadeIn items-center justify-center fadeIn text-default-800 bg-default-200 rounded-lg h-[100px] gap-3'>
                    <Icon name='cuida:alert-outline' className='text-2xl' />
                    <span className='text-sm'>Nenhum jogador encontrado</span>
                </div>
            )}
        </div>
    );
}