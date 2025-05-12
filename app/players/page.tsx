'use client';

import Icon from '@/components/icon';
import { useState, useEffect } from "react";
import Input from "@/components/input";
import Button from "@/components/button";
import Checkbox from "@/components/checkbox";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { axiosGet } from "@/utils/axios";

interface PlayerStats {
    player_id: number;
    nickname: string;
    first_name: string;
    last_name: string;
    country_code: string;
    avg_kills: number|null;
    avg_death: number|null;
    avg_kd_rate: number|null;
}

export default function PlayersPage() {

    const [period, setPeriod] = useState<string>('6_months');
    const [gameCount, setGameCount] = useState<number|null>(5);
    const [playersStats, setPlayersStats] = useState<PlayerStats[]>([]);
    
    useEffect(() => {
        const getPlayers = () => {
            axiosGet(`/player_stats?period=${period}&game_count=${gameCount}`, (data) => {
                console.log(data);
                setPlayersStats(data.players);
            }, (error) => {
                console.log(error);
            }, true);
        };
        getPlayers();
    }, [period, gameCount]);

    return (
        <div className="flex flex-col w-full h-full fadeIn gap-1">
            <div className='flex transition border-default-400 border-b-1'>
                <span className='text-lg font-bold text-default-950'>Players</span>
            </div>
            <span className='flex transition text-default-800 text-sm'>Utilizando nossas estatísticas é possível analisar o desempenho dos jogadores e chegar a conclusões através de diversas métricas.</span>
            <div>
                {playersStats.map(player => (
                    <div className='flex gap-2' key={player.player_id}>
                        <span>{player.nickname}</span>
                        <span>{player.country_code}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
