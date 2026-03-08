'use client';

import Icon from '@/components/icon';
import { useState, useEffect, JSX } from "react";
import Select from "@/components/select";
import Input from "@/components/input";
import Button from "@/components/button";
import { toast } from "react-toastify";
import { axiosGet } from "@/utils/axios";
import { useAppContext } from '@/context/context';
// @ts-expect-error not-error
import Flag from 'react-world-flags';
import Modal from '@/components/modal';
import Fuse from "fuse.js";
import SearchSelect from '@/components/searchSelect';
import { FilterTag } from '@/components/filter-tag';
import PlayerStatsTable from '@/components/player-stats-table';
import { periodText } from '@/utils/utils';

export interface PlayerStats {
    id: number;
    slug: string | null;
    nickname: string;
    period: number;
    first_name: string;
    last_name: string;
    team_slug: string|null;
    team_name: string|null;
    team_points: number|null;
    country_code: string;
    country: string;
    total_prize: number | null;
    img_url: string | null;
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

export type NumericStatKeys = {
    [K in keyof PlayerStats]: PlayerStats[K] extends number | null ? K : never;
}[keyof PlayerStats];

export default function PlayersPage() {

    const { setLoading } = useAppContext();

    const [period, setPeriod] = useState<string>('6_months');
    const [gameCount, setGameCount] = useState<string>('25');
    const [countrySelect, setCountrySelect] = useState<string[]>([]);
    const [teamSelect, setTeamSelect] = useState<string[]>([]);
    const [playersStats, setPlayersStats] = useState<PlayerStats[]>([]);
    const [filterPlayers, setFilterPlayers] = useState<PlayerStats[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [countries, setCountries] = useState<{ value: string; name: string, title: string | JSX.Element }[]>([]);
    const [teams, setTeams] = useState<{ value: string; name: string,  title: string | JSX.Element }[]>([]);
    
    const [sortedBy, setSortedBy] = useState<NumericStatKeys>('avg_kills');
    const [desc, setDesc] = useState<boolean>(true);

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
                () => toast.error('Erro inesperado, tente novamente. #11'), true
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
        setFilterPlayers(teamFilter);
        setCurrentPage(1);
    }, [playersStats, searchInput, countrySelect, teamSelect]);

    return (
        <div className="flex flex-col w-full h-full fadeIn gap-2">
            <div className='flex transition border-default-400 pb-1 '>
                <span className='text-lg font-bold text-default-950'>{'Jogadores'}</span>
            </div>
            <div className='flex flex-wrap gap-2 w-full items-center text-sm'>
                <Input placeholder='Busca avançada' value={searchInput} onValueChange={(val) => setSearchInput(val as string)}
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

                <PlayerStatsTable filterPlayers={filterPlayers} sortedBy={sortedBy}
                    setSortedBy={setSortedBy} desc={desc} setDesc={setDesc}
                    currentPage={currentPage} onPageChange={setCurrentPage}
                />
            </div>
            <Modal isOpen={isModalFilterOpen} setIsOpen={setIsModalFilterOpen} title='Filtros' icon='mdi:filter-cog-outline'>
                <div className='flex flex-col gap-2'>
                    <div className='flex text-sm gap-1 flex-col'>
                        <span className=''>Período:</span>
                        <Select value={period} setValue={(val) => setPeriod(val as string)} placeholder='Selecione um período'
                            options={[
                                {title: periodText('last_month'), value: 'last_month'},
                                {title: periodText('3_months'), value: '3_months'},
                                {title: periodText('6_months'), value: '6_months'},
                                {title: periodText('12_months'), value: '12_months'}
                            ]}
                        />
                    </div>
                    <div className='flex text-sm gap-1 flex-col'>
                        <span className=''>Quantidade mínima de mapas:</span>
                        <Select value={gameCount} setValue={(val) => setGameCount(val as string)} placeholder='Selecione quantidade de mapas'
                            options={[
                                {title:'5 mapas', value: '5'},
                                {title:'10 mapas', value: '10'},
                                {title:'25 mapas', value: '25'},
                                {title:'50 mapas', value: '50'},
                                {title:'100 mapas', value: '100'},
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
};
