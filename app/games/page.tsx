'use client';

import Icon from '@/components/icon';
import { useState, useEffect } from "react";
import Input from "@/components/input";
import Button from "@/components/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { axiosGet } from "@/utils/axios";
import { useAppContext } from "@/context/context";
import Modal from '@/components/modal';
import SearchSelect from '@/components/searchSelect';
import Select from '@/components/select';
import { FilterTag } from '@/components/filter-tag';
import Fuse from "fuse.js";
import TeamImage from '@/components/team-image';

type GameScore = {
    map_name: string;
    order: number;
    rounds_count: number;
    winner_score: number;
    loser_score: number;
    winner_team: string;
}

interface GameStats {
    id: number;
    slug: string;
    name: string;
    league_name: string|null;
    league_slug: string|null;
    slug_img_extension: string|null;
    team1_name: string|null;
    team2_name: string|null;
    team1_slug: string|null;
    team2_slug: string|null;
    team1_score: number|null;
    team2_score: number|null;
    team1_img_extension: string|null;
    team2_img_extension: string|null;
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

    const { setLoading } = useAppContext();

    const [gamesStats, setGamesStats] = useState<GameStats[]>([]);
    const [currentGamesStats, setCurrentGamesStats] = useState<GameStats[]>([]);
    const [filterGamesStats, setFilterGamesStats] = useState<GameStats[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const [status, setStatus] = useState<'finished'|'current'>('current');
    const [filterStatus, setFilterStatus] = useState<'period'|'leagues'>('period');
    const [period, setPeriod] = useState<string>('last_7');
    const [periods, setPeriods] = useState<string[]>([]);
    const [league, setLeague] = useState<string[]>([]);
    const [leagues, setLeagues] = useState<Leagues[]>([]);
    const [team, setTeam] = useState<string[]>([]);
    const [teams, setTeams] = useState<Teams[]>([]);
    const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);
    
    const formatDate = (data: string) => {
        if (data=='last_7') return 'Últimos 7 dias'
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
        { title: formatDate('last_7'), value: 'last_7' },
        ...periods.map(p => ({ title: formatDate(p), value: p }))
    ];

    const getGames = async (period:string, league:string[], status:'finished'|'current', filterStatus:'period'|'leagues') => {
        setLoading(true);
        await axiosGet(
            `/games_stats${status=='finished' ? `${filterStatus=='period' ? `?period=${period}` : `?league=${league.length?`${league[0]}`:'not_league'}` }` : '/upcoming'}`,
            (data) => {
                const sortedGames = status == 'finished'
                    ? [...data.games].sort((a, b) => b.start_timestamp - a.start_timestamp) // decrescente
                    : [...data.games].sort((a, b) => a.start_timestamp - b.start_timestamp) // crescente
                setGamesStats(sortedGames);
            },
            () => toast.error('Erro inesperado, tente novamente.'), true
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
            () => toast.error('Erro inesperado, tente novamente.'), true
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
            () => toast.error('Erro inesperado, tente novamente.'), true
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
            () => toast.error('Erro inesperado, tente novamente.'), true
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
            () => toast.error('Erro inesperado, tente novamente.'), true
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
        getGames(period, league, status, filterStatus);
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

    const formatTimestamp = (timestamp: number, tipo: 'date'|'hour') => {
        const data = new Date(timestamp * 1000);
        const pad = (n: number) => n.toString().padStart(2, '0');
        if (tipo === 'date') {
            const dia = pad(data.getDate());
            const mes = pad(data.getMonth() + 1);
            return `${dia}/${mes}`;
        } else if (tipo === 'hour') {
            const horas = pad(data.getHours());
            const minutos = pad(data.getMinutes());
            return `${horas}:${minutos}`;
        } else {
            throw new Error("Tipo inválido. Use 'date' ou 'hour'.");
        };
    };

    const buttonGroup = (statusValue:'current'|'finished') => {
        return (
            <Button
                onClick={() => setStatus(statusValue)}
                padding='px-[6px] py-0'
                typeButton={status == statusValue ? 'primary' : 'default'}
            >
                <div className='flex gap-2 items-center'>
                    <span className='text-sm'>{statusValue=='current' ? 'Atual' : statusValue=='finished' && 'Finalizado'}</span>
                </div>
            </Button>
        );
    };

    const gameMapsScore = (gamesScore: GameScore[], game:GameStats) => {
        const sortedGames = [...gamesScore].sort((a, b) => a.order - b.order);
        return <div className='flex w-full h-full gap-3 items-center justify-end'>
            {sortedGames.map(g => 
                <div className='flex flex-col gap-1' key={game.id+g.map_name}>
                    <div className='flex items-center justify-between px-1 gap-1'>
                        {g.winner_team == game.team1_slug && <TeamImage slug={game.team1_slug} extension={game.team1_img_extension} className='h-[17px] w-[17px]'/>}
                        {g.winner_team == game.team2_slug && <TeamImage slug={game.team2_slug} extension={game.team2_img_extension} className='h-[17px] w-[17px]'/>}
                        <div className='flex bg-default-200 px-1 rounded-lg items-center gap-1 text-sm'>
                            <span className='text-success font-semibold'>{g.winner_score}</span>
                            <span className='text-default-800'>-</span>
                            <span className='text-danger'>{g.loser_score}</span>
                        </div>
                    </div>
                    <img className="h-[40px] min-w-[80px] border-1 border-default-400 rounded-lg" src={`/img/maps/${g.map_name}.jpg`} />
                </div>
            )}
        </div>
    };

    const gameMap = (gameStats:GameStats[], title:string) => {
        return <div className='fadeIn transition flex flex-col p-2 gap-2 bg-default-200 rounded-lg w-full h-full'>
            <div className='flex gap-2 items-center'>
                {title=='Ao vivo' && <span className="relative flex h-[10px] w-[10px]">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-[10px] w-[10px] bg-danger"></span>
                </span>}
                <span className='text-default-800 font-semibold text-sm'>{title}</span>
            </div>
            {gameStats.length ? <div className='flex w-full h-full flex-col gap-1'>
                {gameStats.map((game,i) => (
                    <div key={game.slug+i} className='flex gap-2 overflow-x-auto w-full h-full transition border-1 border-default-400 bg-default-50 hover:bg-glass-primary rounded-lg px-3 py-2'>
                        <div className='flex flex-col w-[44px] gap-1 items-center text-center justify-center'>
                            <span className='text-default-800 text-sm'>{formatTimestamp(game.start_timestamp, 'date')}</span>
                            <span className='text-default-800 text-sm'>{formatTimestamp(game.start_timestamp, 'hour')}</span>
                        </div>
                        <div className='flex gap-2'>
                            <span className='flex items-center text-center text-default-800 text-[10px] w-[88px] border-x-1 px-2 border-default-400'>{game.league_name}</span>
                            <div className='flex w-full'>
                                <div className='flex flex-col gap-2 justify-center w-full min-w-[150px] max-w-[220px]'>
                                    <div className='flex items-center gap-2'>
                                        <TeamImage slug={game.team1_slug} extension={game.team1_img_extension} className='h-[27px] w-[27px]'/>
                                        <span className='text-default-900 text-sm'>{game.team1_name}</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <TeamImage slug={game.team2_slug} extension={game.team2_img_extension} className='h-[27px] w-[27px]'/>
                                        <span className='text-default-900 text-sm'>{game.team2_name}</span>
                                    </div>
                                </div>
                                <div className='flex justify-center flex-col gap-2'>
                                    <span className={`rounded-4xl transition flex items-center justify-center bg-default-200 p-1 h-[30x] w-[30px] text-sm font-semibold ${!game.winner_team_slug ? 'text-default-950' : game.team1_slug==game.winner_team_slug ? 'text-success' : 'text-danger'}`}>{game.team1_score ? game.team1_score : '0'}</span>
                                    <span className={`rounded-4xl transition flex items-center justify-center bg-default-200 p-1 h-[30x] w-[30px] text-sm font-semibold ${!game.winner_team_slug ? 'text-default-950' : game.team2_slug==game.winner_team_slug ? 'text-success' : 'text-danger'}`}>{game.team2_score ? game.team2_score : '0'}</span>
                                </div>
                            </div>
                        </div>
                        <div className='pl-2 flex w-full gap-2 justify-between'>
                            <div className='flex flex-col gap-1'>
                                <span className='text-default-800 text-xs min-w-[64px]'>{game.stage_round && game.stage_round.round}</span>
                                <span className='text-default-800 text-xs min-w-[64px]'>{game.bo_type && `Bo${game.bo_type}`}</span>
                            </div>
                            {(game.status == 'finished' && game.games_score) ? gameMapsScore(game.games_score, game) : null}
                        </div>
                    </div>
                ))}
            </div>
            :         
            <div className='flex px-2 fadeIn items-center justify-center text-default-800 pb-5 h-[70px] gap-3'>
                <Icon name='cuida:alert-outline' className='text-3xl'/>
                <span>Nenhum jogo encontrado</span>
            </div>}
        </div> 
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
             <div className='flex transition border-default-400 border-b-1'>
                <span className='text-lg font-bold text-default-950'>Jogos</span>
            </div>

            <div className='flex flex-wrap gap-2 w-full items-center text-sm'>
                <Input placeholder='Busca avançada' value={searchInput} onValueChange={setSearchInput}
                    startContent={<Icon name='mingcute:search-ai-line' className='text-lg'/>}
                />
                <Button onClick={() => status=='current' ? null :  setIsModalFilterOpen(true)} isDisabled={status=='current'}>
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
                    {status=='current' && <FilterTag items={'Atual'} />}
                </div>

                <div className="w-full overflow-x-auto overflow-y-hidden rounded-lg min-h-[40px]">
                    <div className="flex w-max py-1 px-2 rounded-lg gap-2 bg-default-200 text-default-700">
                        {buttonGroup('finished')}
                        {buttonGroup('current')} 
                    </div>
                </div>

                {currentGamesStats.length ? gameMap(currentGamesStats, 'Ao vivo') : null}
                {gameMap(filterGamesStats, status=='finished' ? 'Finalizados' : 'Futuros')}
            </div>

            <Modal isOpen={isModalFilterOpen} setIsOpen={setIsModalFilterOpen} title='Filtros' icon='mdi:filter-cog-outline'>
                <div className='flex flex-col gap-2'>
                    <div className='flex flex-col gap-2'>
                        <div className="w-full overflow-x-auto overflow-y-hidden rounded-lg min-h-[40px]">
                            <div className="flex w-max py-1 px-2 rounded-lg gap-2 bg-default-200 text-default-700">
                                {buttonFilter('period')}
                                {buttonFilter('leagues')} 
                            </div>
                        </div>
                        <div className='flex text-sm max-h-[38px]'>
                            {filterStatus=='period' &&
                                <div className='fadeIn'>
                                    <Select value={period} setValue={setPeriod} placeholder='Selecione um periodo' options={periodsGroup}/>
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
