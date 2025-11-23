'use client';

// @ts-ignore
import Flag from 'react-world-flags';
import { useParams, useRouter } from 'next/navigation';
import Icon from '@/components/icon';
import Button from "@/components/button";
import { useEffect, useState } from 'react';
import { useAppContext } from "@/context/context";
import { axiosGet } from '@/utils/axios';
import { toast } from "react-toastify";
import { type TeamStats } from "@/app/teams/page"; 
import TeamImage from '@/components/team-image';
import PlayerStatsTable from '@/components/player-stats-table';
import { type GameStats } from "@/app/games/page";
import { type PlayerStats, type NumericStatKeys, periodText } from "@/app/players/page"; 
import Select from '@/components/select';
import GamesStatsTable from '@/components/games-stats-table';
import LeaguesStatsTable from '@/components/leagues-stats-table';
import { type LeagueStats } from "@/app/leagues/page";

type Period = "12_months" | "6_months" | "3_months" | "last_month";
type PeriodPlayerStats = {
  slug: string;
} & {
  [key in Period]: PlayerStats;
};

export default function TeamPage() {
    const { isMobile, setLoading } = useAppContext();
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

    const [sortedBy, setSortedBy] = useState<NumericStatKeys>('avg_kills');
    const [desc, setDesc] = useState<boolean>(true);
    const [period, setPeriod] = useState<Period>('6_months');

    useEffect(() => {
        const getTeam = async (slug:string|string[]) => {
            setLoading(true);
            await axiosGet(
                `/teams_stats/team?slug=${slug}`,
                (data) => {
                    setTeamInfo(data.team);
                    setGamesStats(data.games);
                    setPlayersStats(data.players);
                    setLeaguesStats(data.leagues);
                },
                () => toast.error('Erro inesperado, tente novamente.'), true
            );
            setLoading(false);
        };
        if (slug) {
            getTeam(slug);
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

    useEffect(() => {
        if (!gamesStats || gamesStats.length === 0) return;
        const minTimestamp = now - periodToSeconds[period];
        const filteredGames = gamesStats
            .filter(game => game.start_timestamp >= minTimestamp)
            .sort((a, b) => b.start_timestamp - a.start_timestamp);
        setFilteredGamesStats(filteredGames);
        setGamesCurrentPage(1);
    }, [period, gamesStats, isMobile]);

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
            <div className='flex items-center gap-3 transition border-default-400 border-b-1 pb-2 h-[38px]'>
                {teamInfo && (
                    <>
                        <TeamImage slug={teamInfo?.slug} extension={teamInfo?.img_extension} className='h-[30px] min-w-[30px] text-default-950' />
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
            
            <div className='flex w-full align-center justify-between'>
                <Button onClick={handleBack} typeButton="default" padding="p-0">
                    <Icon name="material-symbols:arrow-back-rounded" className="text-2xl" />
                </Button>
                {teamInfo && (
                    <div className='flex flex-col w-[78px] h-[32px] px-2 py-[1px] bg-default-200 rounded-sm'>
                        <span className='text-default-900' style={{fontSize: 'x-small'}}>valve rank</span>
                        <div className='flex w-full align-center justify-between'>
                            <span className='text-xs font-bold'>{`${teamInfo.rank}º`}</span>
                            <span style={{fontSize: 'x-small'}}>{`${teamInfo.points}pts`}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className='flex text-sm'>
                <Select value={period} setValue={setPeriod} placeholder='Selecione um período'
                    options={[
                        {title: periodText('last_month'), value: 'last_month'},
                        {title: periodText('3_months'), value: '3_months'},
                        {title: periodText('6_months'), value: '6_months'},
                        {title: periodText('12_months'), value: '12_months'}
                    ]}
                />
            </div>

            <div className={`flex flex-wrap gap-2 w-full max-w-5xl`}>
                <div className={`flex max-w-sm mb-1 ${isMobile ? 'w-[100%]' : 'w-[50%]'}`}>
                    <GamesStatsTable gamesStats={filteredGamesStats} currentPage={gamesCurrentPage} title={'Jogos'}
                        onPageChange={setGamesCurrentPage} itemsPerPage={ 3 + (isMobile ? 0 : 1)} />
                </div>
                <div className={`flex max-w-sm mb-1 ${isMobile ? 'w-full' : 'w-[50%]'}`}>
                    <LeaguesStatsTable leaguesStats={filteredLeaguesStats} title='Campeonatos' showTeam={slug} 
                        currentPage={leagueCurrentPage} onPageChange={setLeagueCurrentPage} 
                        itemsPerPage={ 3 + (isMobile ? 0 : 1)} />
                </div>
            </div>
            
            {playersStats.length ? (
                <PlayerStatsTable filterPlayers={filteredPlayersStats} sortedBy={sortedBy}
                    setSortedBy={setSortedBy} desc={desc} setDesc={setDesc} title={'Jogadores'}
                    currentPage={playerCurrentPage} onPageChange={setPlayerCurrentPage}
                />
            ) : null}
        </div>
    );
}