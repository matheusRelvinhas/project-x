'use client';

import { useState, useEffect } from "react";
import ChartAiPerfomance from "@/components/chart-ai-performance";
import { type GameStats, type GameScore } from "@/app/games/games-page";
import { useAppContext } from "@/context/context";
import { axiosGet } from "@/utils/axios";
import { toast } from "react-toastify";
import GamesStatsTable from "@/components/games-stats-table";
import Button from "@/components/button";

export default function Home() {

    const { setLoading, isMobile } = useAppContext();

    const [gamesStats, setGamesStats] = useState<GameStats[]>([]);
    const [currentGamesStats, setCurrentGamesStats] = useState<GameStats[]>([]);
    const [status, setStatus] = useState<'finished' | 'upcoming' | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [periodCurrentPage, setPeriodCurrentPage] = useState(1);

    useEffect(() => {
        const saved = localStorage.getItem('games_status');
        if (saved === 'finished' || saved === 'upcoming') {
            setStatus(saved);
        } else {
            setStatus('upcoming');
        };
    }, []);

    const getGames = async (status:'finished'|'upcoming') => {
        setLoading(true);
        await axiosGet(
            `/games_stats${status=='finished' ? `?period=last_15` : '/upcoming'}`,
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

    useEffect(() => {
        if (status) {
            getGames(status);
            localStorage.setItem('games_status', status);
        }
    }, [status]);

    useEffect(() => {
        getCurrentGames();
        const interval = setInterval(() => {
            getCurrentGames();
        }, 180000);
        return () => clearInterval(interval);
    }, []);

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

    return (
        <div className="flex flex-col w-full h-full fadeIn gap-2">
            <span className="font-black text-xl text-primary-600 truncate">{'REDONDO STATS'}</span>
            <span className='font-bold text-default-950 pb-1'>{'Gráfico de previsões '}</span>
            <ChartAiPerfomance />
            <div className="flex flex-col gap-2 pt-1 w-full max-w-5xl">
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
                    gamesStats={gamesStats} 
                    title={status=='finished' ? 'Jogos finalizados' : 'Próximos jogos'}  
                    currentPage={periodCurrentPage}
                    onPageChange={setPeriodCurrentPage}
                    itemsPerPage={ 8 + (isMobile ? 0 : 4)} />}

            </div>
        </div>
    );
};
