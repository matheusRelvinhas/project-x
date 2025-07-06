'use client';

import Icon from '@/components/icon';
import { useState, useEffect, useMemo } from "react";
import Select from "@/components/select";
import Input from "@/components/input";
import Button from "@/components/button";
import Checkbox from "@/components/checkbox";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { axiosGet } from "@/utils/axios";
import Ripple from 'react-ripplejs';
import PlayerImage from '@/components/player-image';
import { useAppContext } from '@/context/context';
import Pagination from '@/components/pagination';
// @ts-ignore
import Flag from 'react-world-flags';
import Modal from '@/components/modal';
import Fuse from "fuse.js";
import SearchSelect from '@/components/searchSelect';
import { FilterTag } from '@/components/filter-tag';

interface PlayerStats {
    id: number;
    slug: string | null;
    nickname: string;
    first_name: string;
    last_name: string;
    team_slug: string|null;
    team_name: string|null;
    team_points: number|null;
    country_code: string;
    country: string;
    total_prize: number | null;
    img_extension: string | null;
    games_count: number | null;
    rounds_count: number | null;
    rounds_win: number | null;
    avg_player_rating_value: number | null;
    avg_player_rating: number | null;
    kills_sum: number | null;
    avg_kills: number | null;
    death_sum: number | null;
    avg_death: number | null;
    assists_sum: number | null;
    avg_assists: number | null;
    damage_sum: number | null;
    avg_damage: number | null;
    kd_diff_sum: number | null;
    avg_kd_rate: number | null;
    avg_first_kills: number | null;
    avg_first_death: number | null;
    avg_trade_kills: number | null;
    avg_trade_death: number | null;
    avg_multikills: number | null;
    avg_shots: number | null;
    avg_shots_accuracy: number | null;
    avg_headshots: number | null;
    avg_headshots_accuracy: number | null;
    avg_headshot_kills_accuracy: number | null;
    avg_flash_assists: number | null;
    avg_flash_hits: number | null;
    avg_flash_duration: number | null;
    avg_he_damage: number | null;
    avg_molotov_damage: number | null;
    avg_kill_cost: number | null;
    avg_hundred_damage_cost: number | null;
    avg_saved: number | null;
    avg_multikills_vs_2: number | null;
    avg_multikills_vs_3: number | null;
    avg_multikills_vs_4: number | null;
    avg_multikills_vs_5: number | null;
    multikills_vs_2: number | null;
    multikills_vs_3: number | null;
    multikills_vs_4: number | null;
    multikills_vs_5: number | null;
    avg_clutches_vs_1: number | null;
    avg_clutches_vs_2: number | null;
    avg_clutches_vs_3: number | null;
    avg_clutches_vs_4: number | null;
    avg_clutches_vs_5: number | null;
    clutches_vs_1: number | null;
    clutches_vs_2: number | null;
    clutches_vs_3: number | null;
    clutches_vs_4: number | null;
    clutches_vs_5: number | null;
    avg_ak47_kills: number | null;
    avg_ak47_damage: number | null;
    ak47_shots_accuracy: number | null;
    ak47_headshots_accuracy: number | null;
    avg_m4a4_kills: number | null;
    avg_m4a4_damage: number | null;
    m4a4_shots_accuracy: number | null;
    m4a4_headshots_accuracy: number | null;
    avg_m4a1_kills: number | null;
    avg_m4a1_damage: number | null;
    m4a1_shots_accuracy: number | null;
    m4a1_headshots_accuracy: number | null;
    avg_awp_kills: number | null;
    avg_awp_damage: number | null;
    awp_shots_accuracy: number | null;
    awp_headshots_accuracy: number | null;
    avg_galil_kills: number | null;
    avg_galil_damage: number | null;
    galil_shots_accuracy: number | null;
    galil_headshots_accuracy: number | null;
    avg_aug_kills: number | null;
    avg_aug_damage: number | null;
    aug_shots_accuracy: number | null;
    aug_headshots_accuracy: number | null;
    avg_desert_eagle_kills: number | null;
    avg_desert_eagle_damage: number | null;
    desert_eagle_shots_accuracy: number | null;
    desert_eagle_headshots_accuracy: number | null;
    avg_usp_s_kills: number | null;
    avg_usp_s_damage: number | null;
    usp_s_shots_accuracy: number | null;
    usp_s_headshots_accuracy: number | null;
    avg_glock_kills: number | null;
    avg_glock_damage: number | null;
    glock_shots_accuracy: number | null;
    glock_headshots_accuracy: number | null;
    created_at: number | null;
    updated_at: number | null;
};

type NumericStatKeys = {
    [K in keyof PlayerStats]: PlayerStats[K] extends number | null ? K : never;
}[keyof PlayerStats];

export default function PlayersPage() {

    const { isMobile, setLoading } = useAppContext();

    const [period, setPeriod] = useState<string>('6_months');
    const [gameCount, setGameCount] = useState<string>('25');
    const [countrySelect, setCountrySelect] = useState<string[]>([]);
    const [teamSelect, setTeamSelect] = useState<string[]>([]);
    const [playersStats, setPlayersStats] = useState<PlayerStats[]>([]);
    const [filterPlayers, setFilterPlayers] = useState<PlayerStats[]>([]);

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

    const ITEMS_PER_PAGE = 12;

    const [currentPage, setCurrentPage] = useState(1);
    const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [countries, setCountries] = useState<{ value: string; name: string, title: any }[]>([]);
    const [teams, setTeams] = useState<{ value: string; name: string, title: any }[]>([]);
    const totalPages = Math.ceil(filterPlayers.length / ITEMS_PER_PAGE);
    const currentPlayers = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return filterPlayers.slice(start, end);
    }, [filterPlayers, currentPage]);
    
    const [sortedBy, setSortedBy] = useState<NumericStatKeys>('avg_kills');
    const [desc, setDesc] = useState<boolean>(true);
    const [playerHover, setPlayerHover] = useState<string|null>('');

    const selectStat = (stat:string) => {
        if (sortedBy == stat) setDesc(!desc);
        else {
            setSortedBy(stat as NumericStatKeys);
            setDesc(true);
        }
    };

    const getOptionStyles = (option: PlayerStats) => {
        return (
            <div className='flex gap-3'>
                <Flag code={option.country_code} style={{width: '14px'}} />
                <span>{option.country}</span>
            </div>
        )
    };

    const getUniqueCountries = (players: PlayerStats[]) => {
        return Array.from(
            new Map(
                players.map(p => [`${p.country_code}_${p.country}`, { value: p.country_code, name: p.country, title: getOptionStyles(p) }])
            ).values()
        );
    };

    const getUniqueTeams = (players: PlayerStats[]) => {
        return Array.from(
            new Map(
                players
                    .filter(p => p.team_name !== null && p.team_slug !== null)
                    .map(p => [
                        `${p.team_name}_${p.team_slug}`,
                        {
                            value: p.team_slug!,
                            name: p.team_name!,
                            title: p.team_name!
                        }
                    ])
            ).values()
        );
    };
      
    useEffect(() => {
        const getPlayers = async () => {
            setLoading(true);
            await axiosGet(
                `/player_stats?period=${period}&game_count=${gameCount}`,
                (data) => {
                    setPlayersStats(data.players);
                },
                () => toast.error('Erro inesperado, tente novamente.'), true
            );
            setLoading(false);
        };
        getPlayers();
        setCurrentPage(1);
    }, [period, gameCount]);
    
    useEffect(() => {
        const sortedCountries = getUniqueCountries(playersStats).sort((a, b) => {
            const nameA = a.name ?? '';
            const nameB = b.name ?? '';
            return nameA.localeCompare(nameB);
        });
        const sortedTeams = getUniqueTeams(playersStats).sort((a, b) => {
            const nameA = a.name ?? '';
            const nameB = b.name ?? '';
            return nameA.localeCompare(nameB);
        });
        setCountries(sortedCountries);
        setTeams(sortedTeams);
    }, [playersStats]);
    
    useEffect(() => {
        const fuse = new Fuse(playersStats, {
            keys: ['nickname', 'first_name', 'last_name', 'slug', 'team_name', 'team_slug', 'country', 'country_code'],
            threshold: 0.4,
        });
        const searchFilter = searchInput ? fuse.search(searchInput).map(result => result.item) : playersStats;
        const countryFilter = countrySelect.length ? searchFilter.filter(p => countrySelect.includes(p.country_code)) : searchFilter;
        const teamFilter = teamSelect.length ? countryFilter.filter(p => typeof p.team_slug === 'string' && teamSelect.includes(p.team_slug)) : countryFilter;
        const sortedFilter = [...teamFilter].sort((a, b) => desc ? (b[sortedBy] ?? 0) - (a[sortedBy] ?? 0) : (a[sortedBy] ?? 0) - (b[sortedBy] ?? 0));
        setFilterPlayers(sortedFilter);
        setCurrentPage(1);
    }, [playersStats, searchInput, countrySelect, teamSelect, sortedBy, desc]);

    useEffect(() => {
        setSortedBy(showStats[0] as NumericStatKeys);
        setDesc(true);
    }, [showStats]);

    const periodText = (period:string) => {
        if (period =='last_month') return 'Último mês';
        else if (period =='3_months') return 'Últimos 3 meses';
        else if (period =='6_months') return 'Últimos 6 meses';
        else if (period =='12_months') return 'Últimos 12 meses';
        else return period;
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

    return (
        <div className="flex flex-col w-full h-full fadeIn gap-2">
            <div className='flex transition border-default-400 border-b-1'>
                <span className='text-lg font-bold text-default-950'>Players</span>
            </div>
            <div className='flex flex-wrap gap-2 w-full items-center text-sm'>
                <Input placeholder='Busca avançada' value={searchInput} onValueChange={setSearchInput}
                    startContent={<Icon name='mingcute:search-ai-line' className='text-lg'/>}
                />
                <Button onClick={() => setIsModalFilterOpen(true)}>
                    <div className='flex gap-2'>
                        <Icon name='mdi:filter-cog-outline' className='text-lg'/>
                        <span>Filtros</span>
                    </div>
                </Button>
            </div>

            <div className='flex flex-col gap-2 w-full max-w-5xl'>
                <div className='flex justify-end flex-wrap w-full gap-[6px] whitespace-nowrap'>
                    <FilterTag items={periodText(period)} />
                    <FilterTag items={`No mínimo ${gameCount} jogos`} />
                    <FilterTag
                        items={countrySelect.map((c) => (
                            <>
                                <Flag code={c} className="h-[14px] w-[28px]" />
                                <span className="text-default-900 text-[10px]">{c}</span>
                            </>
                        ))}
                    />
                    <FilterTag items={teams.filter(team => teamSelect.includes(team.value)).map(team => (team.title))}/>
                </div>

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

                {currentPlayers.length ? <div className='flex flex-col gap-2 p-2 bg-default-200 rounded-lg'>
                    <div className='overflow-x-auto fadeIn bg-default-50 border-1 border-default-400 rounded-lg w-full'>
                        <div className='min-w-max'>
                            <div className='flex text-xs font-bold bg-default-100 text-default-800 items-center select-none rounded-t-lg'>
                                <span className={`flex w-full pl-3 py-2 min-w-[200px] ${isMobile ? 'max-w-[200px]' : 'max-w-[30%]'}`}>Jogador</span>
                                {showStats.map(s => (
                                    <Ripple key={s} onClick={()=>selectStat(s)} className={`flex min-h-[48px] fadeIn py-2 w-full text-center items-center justify-center min-w-[88px] cursor-pointer ${sortedBy==s && 'text-default-1000'}`}>
                                        <span className='flex'>{statText(s)}</span>
                                        <Icon name="material-symbols:keyboard-arrow-down-rounded" className={`text-[14px] transition ${(!desc && sortedBy==s) && 'rotate-180'}`}/>
                                    </Ripple>
                                ))}
                            </div>
                            {currentPlayers.map((player, i) => (
                                <div onClick={()=>setPlayerHover(player.slug)} className={`text-sm flex justify-between w-full text-default-950 hover:bg-glass-primary border-default-400 border-t-1 transition ${player.slug==playerHover && 'bg-glass-primary'}`} key={player.slug}>
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
                                        <span key={i+s} className="flex fadeIn font-semibold text-[12px] w-full items-center justify-center min-w-[88px]">
                                            {(player[s as keyof PlayerStats] !== undefined && player[s as keyof PlayerStats] !== null)
                                                ? formatStat(s, (player[s as keyof PlayerStats] as number)) : '-'
                                            }
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page:number) => setCurrentPage(page)}
                    />
                </div> : 
                <div className='flex fadeIn items-center justify-center fadeIn text-default-800 bg-default-200 rounded-lg h-[100px] gap-3'>
                    <Icon name='cuida:alert-outline' className='text-3xl'/>
                    <span>Nenhum jogador encontrado</span>
                </div>}
            </div>
            <span className='flex transition text-default-800 text-sm'>Utilizando nossas estatísticas é possível analisar o desempenho dos jogadores e chegar a conclusões através de diversas métricas. Estatísticas acima é baseado na média de cada jogador por cada partida.</span>
            <Modal isOpen={isModalFilterOpen} setIsOpen={setIsModalFilterOpen} title='Filtros' icon='mdi:filter-cog-outline'>
                <div className='flex flex-col gap-2'>
                    <div className='flex text-sm gap-1 flex-col'>
                        <span className=''>Período:</span>
                        <Select value={period} setValue={setPeriod} placeholder='Selecione um período'
                            options={[
                                {title: periodText('last_month'), value: 'last_month'},
                                {title: periodText('3_months'), value: '3_months'},
                                {title: periodText('6_months'), value: '6_months'},
                                {title: periodText('12_months'), value: '12_months'}
                            ]}
                        />
                    </div>
                    <div className='flex text-sm gap-1 flex-col'>
                        <span className=''>Quantidade mínima de jogos:</span>
                        <Select value={gameCount} setValue={setGameCount} placeholder='Selecione quantidade de jogos'
                            options={[
                                {title:'5 jogos', value: '5'},
                                {title:'10 jogos', value: '10'},
                                {title:'25 jogos', value: '25'},
                                {title:'50 jogos', value: '50'},
                                {title:'100 jogos', value: '100'},
                            ]}
                        />
                    </div>
                    <div className='flex text-sm gap-1 flex-col'>
                        <span className=''>Nacionalidades:</span>
                        <SearchSelect
                            value={countrySelect}
                            setValue={setCountrySelect}
                            options={countries}
                            placeholder="Selecione nacionalidades"
                            maxSelect={20}
                        />
                    </div>
                    <div className='flex text-sm gap-1 flex-col'>
                        <span className=''>Times:</span>
                        <SearchSelect
                            value={teamSelect} 
                            setValue={setTeamSelect} 
                            placeholder='Selecione times'
                            options={teams}
                            maxSelect={20}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}
