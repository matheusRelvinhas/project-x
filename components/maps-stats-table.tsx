import Icon from '@/components/icon';
import { useMemo, ReactNode } from "react";
import TeamImage from '@/components/team-image';
import Pagination from '@/components/pagination';
import { type GameScore } from "@/app/games/page";
import { mapsName } from '@/utils/utils';
import { useAppContext } from '@/context/context';

interface MapsStatsTableProps {
    mapsStats: GameScore[];
    children?: ReactNode|null;
    currentPage: number;
    onPageChange: (n:number) => void;   
    slug?: string|string[]; 
    itemsPerPage?: number;
}

export default function MapsStatsTable({
    mapsStats,
    children,
    currentPage,
    onPageChange,
    slug='',
    itemsPerPage = 8
}: MapsStatsTableProps) {

    const { isMobile, theme } = useAppContext();

    const totalPages = Math.ceil(mapsStats.length / itemsPerPage);
    const currentMaps = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return mapsStats.slice(start, end);
    }, [mapsStats, currentPage, itemsPerPage]);

    const formatTimestamp = (timestamp: number) => {
        const data = new Date(timestamp * 1000);
        const pad = (n: number) => n.toString().padStart(2, '0');
        const dia = pad(data.getDate());
        const mes = pad(data.getMonth() + 1);
        return `${dia}/${mes}`;
    };

    const teamLetterLen = isMobile ? 14 : 30; 

    const gameMapsScore = (gamesScore: GameScore[]) => {
        return <div className='flex fadeIn bg-default-50 overflow-y-hidden rounded w-full'>
            <div className='min-w-max w-full flex flex-col'>{gamesScore.length ? gamesScore.map((g, i) =>
                <div key={i + g.map_name} className={`relative flex gap-2 overflow-x-auto overflow-y-hidden w-full h-[60px] min-h-[60px] max-h-[60px] transition hover:bg-glass-primary p-2 ${i ? 'short-top-border' : ''}`}>
                    <div className='absolute top-[3px] left-[8px] z-10 flex gap-2 flex-nowrap'>
                        <span className='bg-primary-600 text-default-100 font-semibold text-[11px] rounded-sm px-2 h-[16px] flex text-center items-center justify-center'>
                            {mapsName.find(m => m.value === g.map_name)?.title}
                        </span>
                    </div>
                    <div 
                        className={`absolute bottom-[-44px] left-[-32px] h-[32px] w-[32px] rotate-45 transform translate-x-1/2 -translate-y-1/2 ${slug ? (g.winner_team==slug ? 'bg-success' : 'bg-danger') : ''}`} >
                    </div>
                    
                    <div className='flex flex-col pt-3 w-[36px] min-w-[36px] max-w-[36px] gap-1 font-semibold items-center text-center justify-center'>
                        <span className='text-default-800 text-[11px]'>{formatTimestamp(g.start_timestamp)}</span>
                    </div>

                    <div
                        className={`
                            absolute inset-0 bg-cover bg-center blur-[1px] fade-out-right
                            ${theme=='light' ? 'opacity-30' : 'opacity-10 brightness-105'}
                        `}
                        style={{ backgroundImage: `url(/img/maps/${g.map_name}.webp)` }}
                    />

                    <div className={`flex gap-2 z-10 pt-1 items-center justify-center w-full hover:text-primary-600 cursor-pointer max-w-[40%] min-w-[260px]`}
                        >
                        <div className='flex w-full min-w-[130px] items-center justify-end gap-2'>
                            <span className={`font-semibold whitespace-nowrap ${isMobile ? 'text-[11px]' : 'text-xs'}`}>
                                { g.team1_name && g.team1_name.length > teamLetterLen
                                    ? g.team1_name.slice(0, teamLetterLen) + "..."
                                    : g.team1_name ? g.team1_name : (
                                        <span className='italic'>{'unknown team'}</span>
                                    )
                                }
                            </span>
                            <TeamImage slug={g.team1_slug} img_url={g.team1_img_url} className='h-[16px] w-[16px] w-[16px] min-w-[16px] max-w-[16px]' />
                            <span className={`rounded transition flex items-center justify-center bg-default-200 p-1 h-[23x] w-[25px] w-[25px] min-w-[25px] max-w-[25px] text-xs font-semibold ${g.winner_team==g.team1_slug ? 'text-success' : 'text-danger'}`}>{g.winner_team==g.team1_slug ? g.winner_score : g.loser_score}</span>
                        </div>
                        <div className='flex w-full min-w-[130px] items-center gap-2'>
                            <span className={`rounded transition flex items-center justify-center bg-default-200 p-1 h-[23x] w-[25px] min-w-[25px] max-w-[25px] text-xs font-semibold ${g.winner_team==g.team2_slug ? 'text-success' : 'text-danger'}`}>{g.winner_team==g.team2_slug ? g.winner_score : g.loser_score}</span>
                            <TeamImage slug={g.team2_slug} img_url={g.team2_img_url} className='h-[16px] w-[16px] min-w-[16px] max-w-[16px]' />
                            <span className={`font-semibold whitespace-nowrap ${isMobile ? 'text-[11px]' : 'text-xs'}`}>
                                { g.team2_name && g.team2_name.length > teamLetterLen
                                    ? g.team2_name.slice(0, teamLetterLen) + "..."
                                    : g.team2_name ? g.team2_name : (
                                        <span className='italic'>{'unknown team'}</span>
                                    )
                                }
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='flex px-2 fadeIn items-center justify-center text-default-800 pb-5 h-[70px] gap-3'>
                    <Icon name='cuida:alert-outline' className='text-2xl' />
                    <span className='text-sm'>Nenhum mapa encontrado</span>
                </div>
            )}</div>
        </div>
    };

    return (
        <div className='fadeIn transition flex flex-col p-2 gap-2 bg-default-200 rounded w-full h-full'>
            <div className='flex items-center justify-between'>
                <span className='text-default-800 font-semibold text-sm'>{'Mapas'}</span>
                {slug && (
                    <div className='flex justify-start items-center px-1 gap-1'>
                        {mapsStats.slice(0, 10).map((m, i) => (
                            <div 
                                key={i+m.map_name}
                                className={`h-[12px] w-[12px] fadeIn rounded-full ${(m.winner_team === slug ? 'bg-success' : 'bg-danger')} shadow-md transition duration-150 ease-in-out`}
                            >
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {children}
            {gameMapsScore(currentMaps)}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
}
