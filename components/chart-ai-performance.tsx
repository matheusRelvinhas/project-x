import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/context';
import { axiosGet } from '@/utils/axios';
import { toast } from "react-toastify";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Tooltip as ChartTooltip,
    Legend,
    Filler,
    ChartOptions,
    TooltipItem,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import Icon from '@/components/icon';
import Tooltip  from '@/components/tooltip';

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, ChartTooltip, Legend, Filler);

export interface AiPerfomance {
    id: number;
    ai_predictions: string;
    bo_type: number;
    exact_result: boolean;
    league_id: number;
    league_slug: string;
    slug: string;
    start_timestamp: number;
    team1_id: number;
    team1_score: number | null;
    team1_slug: string;
    team1_name: string;
    team2_id: number;
    team2_score: number | null;
    team2_slug: string;
    team2_name: string;
    win_result: boolean;
}

interface ChartPoint {
    x: number;
    y: number;
    game: AiPerfomance;
}

interface CssVars {
    primary500: string;
    successColor: string;
    default100: string;
    default200: string;
    default300: string;
    default600: string;
    default700: string;
    default900: string;
}

const DEFAULT_VARS: CssVars = {
    primary500:   '#ff7a45',
    successColor: '#389e0d',
    default100:   '#1a1a1a',
    default200:   '#262626',
    default300:   '#333333',
    default600:   '#6b6b6b',
    default700:   '#878787',
    default900:   '#d1d1d1',
};

function resolveCssVar(varName: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

function buildCumulativePoints(games: AiPerfomance[], key: 'win_result' | 'exact_result'): ChartPoint[] {
    const sorted = [...games].sort((a, b) => a.start_timestamp - b.start_timestamp);
    let acc = 0;
    return sorted.map((game) => {
        if (game[key]) acc += 1;
        return { x: game.start_timestamp * 1000, y: acc, game };
    });
}

export const ChartAiPerfomance: React.FC = () => {
    const { isMobile } = useAppContext();
    const [aiPerfomance, setAiPerfomance]   = useState<AiPerfomance[]>([]);
    const [loading, setLoading]             = useState(true);
    const [cssVars, setCssVars]             = useState<CssVars>(DEFAULT_VARS);

    useEffect(() => {
        setCssVars({
            primary500:   resolveCssVar('--primary-500'),
            successColor: resolveCssVar('--success'),
            default100:   resolveCssVar('--default-100'),
            default200:   resolveCssVar('--default-200'),
            default300:   resolveCssVar('--default-300'),
            default600:   resolveCssVar('--default-600'),
            default700:   resolveCssVar('--default-700'),
            default900:   resolveCssVar('--default-900'),
        });
    }, []);

    useEffect(() => {
        axiosGet(
            `/ai_performance`,
            (data) => {
                setAiPerfomance(data?.games ?? data ?? []);
                setLoading(false);
            },
            () => {
                toast.error('Erro inesperado, tente novamente. #21');
                setLoading(false);
            },
            true
        );
    }, []);

    const { primary500, successColor, default100, default200, default600, default700, default900 } = cssVars;

    const winPoints   = buildCumulativePoints(aiPerfomance, 'win_result');
    const exactPoints = buildCumulativePoints(aiPerfomance, 'exact_result');

    const total      = aiPerfomance.length;
    const totalWin   = aiPerfomance.filter(g => g.win_result).length;
    const totalExact = aiPerfomance.filter(g => g.exact_result).length;
    const winPct     = total > 0 ? ((totalWin / total) * 100).toFixed(1) : '0';
    const exactPct   = total > 0 ? ((totalExact / total) * 100).toFixed(1) : '0';

    const chartData = {
        datasets: [
            {
                label: 'Vencedor certo',
                data: winPoints,
                borderColor: primary500,
                backgroundColor: `${primary500}18`,
                borderWidth: 1,
                pointRadius: 0,
                pointHoverRadius: 4,
                pointBackgroundColor: primary500,
                tension: 0.35,
                fill: true,
            },
            {
                label: 'Placar exato',
                data: exactPoints,
                borderColor: successColor,
                backgroundColor: `${successColor}18`,
                borderWidth: 1,
                pointRadius: 0,
                pointHoverRadius: 4,
                pointBackgroundColor: successColor,
                tension: 0.35,
                fill: true,
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
            x: {
                type: 'time',
                time: { unit: 'month', tooltipFormat: 'dd/MM/yyyy' },
                grid: { color: default200 },
                border: { display: false },
                ticks: { color: default600, font: { size: isMobile ? 10 : 12 } },
            },
            y: {
                beginAtZero: true,
                max: total,
                grid: { color: default200 },
                border: { display: false },
                ticks: { color: default600, font: { size: isMobile ? 10 : 12 }},
                title: {
                    display: !isMobile,
                    text: 'Acertos acumulados',
                    color: default600,
                    font: { size: 12 },
                },
            },
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: default100,
                borderColor: default200,
                borderWidth: 1,
                titleColor: default900,
                bodyColor: default700,
                padding: 12,
                callbacks: {
                    title: (items: TooltipItem<'line'>[]) => {
                        const raw = items[0]?.raw as ChartPoint;
                        const g = raw?.game;
                        if (!g) return '';
                        return `${g.team1_name ? g.team1_name : g.team1_slug} ${g.team1_score ?? '?'} - ${g.team2_score ?? '?'} ${g.team2_name ? g.team2_name : g.team2_slug}`;
                    },
                    label: (item: TooltipItem<'line'>) => {
                        const raw = item.raw as ChartPoint;
                        const g = raw?.game;
                        const label = item.dataset.label ?? '';
                        const pred  = g?.ai_predictions ?? '-';
                        return `${label}: ${item.parsed.y} acumulados  |  Previsão: ${pred}`;
                    },
                },
            },
        },
    };

    return (
        <div className="fadeIn flex flex-col w-full max-w-5xl gap-4">
            <div className="flex gap-3 flex-wrap">
                <Tooltip message={'Acertos da IA: vencedor da partida e desempenho em (%).'} delayDuration={300}>
                    <StatPill color={primary500}   label="Vencedor certo" value={`${totalWin}/${total}`}   pct={winPct} />
                </Tooltip>
                <Tooltip message={'Acertos da IA: placar exato da partida e desempenho em (%).'} delayDuration={300}>
                    <StatPill color={successColor} label="Placar exato"   value={`${totalExact}/${total}`} pct={exactPct} />
                </Tooltip>
            </div>

            <div
                className="relative w-full rounded-lg bg-default-100 border border-default-400 p-4"
                style={{ height: isMobile ? 260 : 360 }}
            >
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="loader" />
                    </div>
                ) : total === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-default-800">
                        <Icon name="cuida:alert-outline" className="text-2xl" />
                        <span className="text-sm">Nenhum jogo encontrado</span>
                    </div>
                ) : (
                    <Line data={chartData} options={options} />
                )}
            </div>

            <div className="flex gap-5 px-1">
                <LegendItem color={primary500}   label="Vencedor certo" />
                <LegendItem color={successColor} label="Placar exato" />
            </div>
        </div>
    );
};

const StatPill: React.FC<{ color: string; label: string; value: string; pct: string }> = ({
    color, label, value, pct,
}) => (
    <div className="flex items-center gap-2 bg-default-100 border border-default-400 rounded-lg px-3 py-1.5">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <span className="text-default-800 text-xs">{label}</span>
        <span className="text-default-900 font-semibold text-xs ml-0.5">{value}</span>
        <span className="text-default-700 text-xs">({pct}%)</span>
    </div>
);

const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
    <div className="flex items-center gap-2">
        <span className="block w-5 h-0.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-default-700 text-xs">{label}</span>
    </div>
);

export default ChartAiPerfomance;