'use client';

import Icon from '@/components/icon';
import { useState, useEffect } from "react";
import Input from "@/components/input";
import Button from "@/components/button";
import { toast } from "react-toastify";
import { axiosGet } from "@/utils/axios";
import { useAppContext } from "@/context/context";
import Modal from '@/components/modal';
import SearchSelect from '@/components/searchSelect';
import Select from '@/components/select';
import { FilterTag } from '@/components/filter-tag';
import Fuse from "fuse.js";
import GamesStatsTable from '@/components/games-stats-table';

export type GameScore = {
    game_slug: string;
    map_name: string;
    order: number;
    rounds_count: number;
    winner_score: number;
    loser_score: number;
    winner_team: string;
    start_timestamp: number;
    team1_name: string|null;
    team2_name: string|null;
    team1_slug: string|null;
    team2_slug: string|null;
    team1_score: string|null;
    team2_score: string|null;
    team1_img_url: string|null;
    team2_img_url: string|null;
    game_side: {
        loser_clan_name: string|null;
        loser_clan_slug: string|null;
        loser_clan_score: number|null;
        loser_clan_side: 'CT' | 'T' | string | null;
        order: number;
        overtime: boolean;
        winner_clan_name: string|null;
        winner_clan_slug: string|null;
        winner_clan_score: number|null;
        winner_clan_side: 'CT' | 'T' | string | null;
    }[];
};

export interface GameStats {
    id: number;
    slug: string;
    name: string;
    league_name: string|null;
    league_slug: string|null;
    team1_name: string|null;
    team2_name: string|null;
    team1_slug: string|null;
    team2_slug: string|null;
    team1_score: number|null;
    team2_score: number|null;
    team1_img_url: string|null;
    team2_img_url: string|null;
    stage_round: {
        stage: string
        round: string;
    }|null;
    winner_team_slug: string|null;
    status: string|null;
    parsed_status: string|null;
    bo_type: number|null;
    tier: string|null;
    start_date: string;
    start_timestamp: number;
    games_score: GameScore[];
};

interface Leagues {
    slug: string;
    name: string;
    start_timestamp: number;
};

interface Teams {
    slug: string;
    name: string;
};

export default function GamesPage() {
    const { setLoading, isMobile } = useAppContext();

    const [gamesStats, setGamesStats] = useState<GameStats[]>([]);
    const [currentGamesStats, setCurrentGamesStats] = useState<GameStats[]>([]);
    const [filterGamesStats, setFilterGamesStats] = useState<GameStats[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const [status, setStatus] = useState<'finished' | 'upcoming' | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('games_status');
        if (saved === 'finished' || saved === 'upcoming') {
            setStatus(saved);
        } else {
            setStatus('finished');
        }
    }, []);

    const [filterStatus, setFilterStatus] = useState<'period'|'leagues'>('period');
    const [period, setPeriod] = useState<string>('last_15');
    const [periods, setPeriods] = useState<string[]>([]);
    const [league, setLeague] = useState<string[]>([]);
    const [leagues, setLeagues] = useState<Leagues[]>([]);
    const [team, setTeam] = useState<string[]>([]);
    const [teams, setTeams] = useState<Teams[]>([]);
    const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [periodCurrentPage, setPeriodCurrentPage] = useState(1);
    
    const formatDate = (data: string) => {
        if (data=='last_15') return 'Últimos 15 dias'
        const [ano, mes] = data.split('-');
        const nomesMeses = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        const indiceMes = parseInt(mes, 10) - 1;
        if (indiceMes < 0 || indiceMes > 11) {
            throw new Error('Mês inválido na string fornecida.');
        };
        return `${nomesMeses[indiceMes]} ${ano}`;
    };

    const periodsGroup = [
        { title: formatDate('last_15'), value: 'last_15' },
        ...periods.map(p => ({ title: formatDate(p), value: p }))
    ];

    const getGames = async (period:string, league:string[], status:'finished'|'upcoming', filterStatus:'period'|'leagues') => {
        setLoading(true);
        await axiosGet(
            `/games_stats${status=='finished' ? `${filterStatus=='period' ? `?period=${period}` : `?league=${league.length?`${league[0]}`:'not_league'}` }` : '/upcoming'}`,
            (data) => {
                const sortedGames = status == 'finished'
                    ? [...data.games].sort((a, b) => b.start_timestamp - a.start_timestamp)
                    : [...data.games].sort((a, b) => a.start_timestamp - b.start_timestamp)
                setGamesStats(sortedGames);
            },
            () => toast.error('Erro inesperado, tente novamente. #1'), true
        );
        setLoading(false);
    };

    const getCurrentGames = async () => {
        setLoading(true);
        await axiosGet(
            `/games_stats/current`,
            (data) => {
                setCurrentGamesStats(data.games);
            },
            () => toast.error('Erro inesperado, tente novamente. #2'), true
        );
        setLoading(false);
    };

    const getPeriods = async () => {
        setLoading(true);
        await axiosGet(
            `/games_stats/periods`,
            (data) => {
                setPeriods(data);
            },
            () => toast.error('Erro inesperado, tente novamente. #3'), true
        );
        setLoading(false);
    };

    const getLeagues = async () => {
        setLoading(true);
        await axiosGet(
            `/games_stats/leagues`,
            (data) => {
                const sortedData = data.sort((a:Leagues, b:Leagues) => b.start_timestamp - a.start_timestamp);
                setLeagues(sortedData);
            },
            () => toast.error('Erro inesperado, tente novamente. #4'), true
        );
        setLoading(false);
    };

    const getTeams = async () => {
        setLoading(true);
        await axiosGet(
            `/games_stats/teams`,
            (data) => {
                const sortedData = data.sort((a: Teams, b: Teams) => a.slug.localeCompare(b.slug));
                setTeams(sortedData);
            },
            () => toast.error('Erro inesperado, tente novamente. #5'), true
        );
        setLoading(false);
    };

    useEffect(() => {
        if (!periods.length) getPeriods();
    }, [periods]);
    
    useEffect(() => {
        if (!leagues.length) getLeagues();
    }, [leagues]);
    
    useEffect(() => {
        if (!teams.length) getTeams();
    }, [teams]);

    useEffect(() => {
        if (status) {
            getGames(period, league, status, filterStatus);
            localStorage.setItem('games_status', status);
        }
    }, [period, league, status, filterStatus]);

    useEffect(() => {
        getCurrentGames();
        const interval = setInterval(() => {
            getCurrentGames();
        }, 180000);
        return () => clearInterval(interval);
    }, []);

    const setFilter = (games:GameStats[]) => {
        const fuse = new Fuse(games, {
            keys: ['slug', 'league_name', 'league_slug', 'team1_name', 'team2_name', 'team1_slug', 'team2_slug'],
            threshold: 0.4,
        });
        const searchFilter = searchInput ? fuse.search(searchInput).map(result => result.item) : games;
        const teamFilter = team.length ? searchFilter.filter(t => (t.team1_slug && team.includes(t.team1_slug)) || (t.team2_slug && team.includes(t.team2_slug))) : searchFilter;
        return teamFilter;
    };

    useEffect(() => {
        setFilterGamesStats(setFilter(gamesStats));
    }, [gamesStats, searchInput, team]);

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

    const buttonFilter = (statusValue:'period'|'leagues') => {
        return (
            <Button
                onClick={() => setFilterStatus(statusValue)}
                padding='px-[6px] py-0'
                typeButton={filterStatus == statusValue ? 'primary' : 'default'}
            >
                <div className='flex gap-2 items-center'>
                    <span className='text-sm'>{statusValue=='period' ? 'Período' : statusValue=='leagues' && 'Ligas'}</span>
                </div>
            </Button>
        );
    };

    return (
        <div className="flex flex-col w-full h-full fadeIn gap-2">
             <div className='flex transition border-default-400 pb-1'>
                <span className='text-lg font-bold text-default-950'>Jogos</span>
            </div>

            <div className='flex flex-wrap gap-2 w-full items-center text-sm'>
                <Input placeholder='Busca avançada' value={searchInput} onValueChange={(val) => setSearchInput(val as string)}
                    startContent={<Icon name='mingcute:search-ai-line' className='text-lg'/>}
                />
                <Button onClick={() => status=='upcoming' ? null :  setIsModalFilterOpen(true)} isDisabled={status=='upcoming'}>
                    <div className='flex gap-2'>
                        <Icon name='mdi:filter-cog-outline' className='text-lg'/>
                        <span>Filtros</span>
                    </div>
                </Button>
            </div>

            <div className='flex flex-col gap-2 w-full max-w-5xl'>
                <div className='flex justify-end flex-wrap w-full gap-[6px] whitespace-nowrap'>
                    {status=='finished' && <FilterTag items={filterStatus=='period' ? formatDate(period) : leagues.find(l => league.includes(l.slug))?.name ?? 'Ligas'} />}
                    {(status=='finished' && team.length) ? <FilterTag items={teams.find(t => team.includes(t.slug))?.name ?? ''} /> : null}
                    {status=='upcoming' && <FilterTag items={'Próximos jogos'} />}
                </div>

                <div className="w-full overflow-x-auto overflow-y-hidden rounded min-h-[40px]">
                    <div className="flex w-max py-1 px-2 rounded gap-2 bg-default-200 text-default-700">
                        {buttonGroup('finished')}
                        {buttonGroup('upcoming')} 
                    </div>
                </div>

                {currentGamesStats.length ? <GamesStatsTable 
                    gamesStats={currentGamesStats} 
                    title='Ao vivo' 
                    currentPage={currentPage}
                    onPageChange={setCurrentPage} 
                    itemsPerPage={ 8 + (isMobile ? 0 : 4)}/> : null}
                {status && <GamesStatsTable
                    gamesStats={filterGamesStats} 
                    title={status=='finished' ? 'Jogos finalizados' : 'Próximos jogos'}  
                    currentPage={periodCurrentPage} 
                    onPageChange={setPeriodCurrentPage}
                    itemsPerPage={ 8 + (isMobile ? 0 : 4)} />}
            </div>

            <Modal isOpen={isModalFilterOpen} setIsOpen={setIsModalFilterOpen} title='Filtros' icon='mdi:filter-cog-outline'>
                <div className='flex flex-col gap-2'>
                    <div className='flex flex-col gap-2'>
                        <div className="w-full overflow-x-auto overflow-y-hidden rounded min-h-[40px]">
                            <div className="flex w-max py-1 px-2 rounded gap-2 bg-default-200 text-default-700">
                                {buttonFilter('period')}
                                {buttonFilter('leagues')} 
                            </div>
                        </div>
                        <div className='flex text-sm max-h-[38px]'>
                            {filterStatus=='period' &&
                                <div className='fadeIn'>
                                    <Select value={period} setValue={(val) => setPeriod(val as string)} placeholder='Selecione um periodo' options={periodsGroup}/>
                                </div>
                            }
                            {filterStatus=='leagues' && 
                                <div className='fadeIn'>
                                    <SearchSelect
                                        value={league} 
                                        setValue={setLeague} 
                                        placeholder='Selecione uma liga'
                                        options={leagues.map(l=>{return {title: l.name, name: l.name, value: l.slug}})}
                                        maxSelect={1}
                                    />
                                </div>
                            }
                        </div>
                    </div>
                    <div className='flex text-sm gap-1 flex-col'>
                        <span className=''>Times:</span>
                        <SearchSelect
                            value={team} 
                            setValue={setTeam} 
                            placeholder='Selecione um time'
                            options={teams.map(t=>{return {title: t.name, name: t.name, value: t.slug}})}
                            maxSelect={1}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}
