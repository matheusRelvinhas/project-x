import Icon from '@/components/icon';
import { useMemo, ReactNode } from "react";
import { useAppContext } from "@/context/context";
import TeamImage from '@/components/team-image';
import Pagination from '@/components/pagination';
import { type GameScore, type GameStats } from "@/app/games/page";
import { useRouter } from 'next/navigation';
import { mapsName } from '@/utils/utils';
import GameMapsScore from '@/components/game-maps-score';

interface GamesStatsTableProps {
    gamesStats: GameStats[];
    children?: ReactNode|null;
    currentPage: number;
    onPageChange: (n:number) => void;
    title?: string|null;
    slug?: string|string[];
    gameMap?: boolean;
    itemsPerPage?: number;
    rounterLeague?: boolean;
}

export default function GamesStatsTable({
    gamesStats,
    currentPage,
    onPageChange,
    children=null,
    title=null,
    slug='',
    gameMap=true,
    itemsPerPage=8,
    rounterLeague=true
}: GamesStatsTableProps) {

    const { isMobile, theme } = useAppContext();
    const router = useRouter()
    const handleNavigation = (href: string) => {
        router.push(href);
    };

    const totalPages = Math.ceil(gamesStats.length / itemsPerPage);
    const currentGames = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return gamesStats.slice(start, end);
    }, [gamesStats, currentPage, itemsPerPage]);

    const formatTimestamp = (timestamp: number, typeDate: 'date' | 'hour') => {
        const data = new Date(timestamp * 1000);
        const pad = (n: number) => n.toString().padStart(2, '0');
        if (typeDate === 'date') {
            const dia = pad(data.getDate());
            const mes = pad(data.getMonth() + 1);
            return `${dia}/${mes}`;
        } else if (typeDate === 'hour') {
            const horas = pad(data.getHours());
            const minutos = pad(data.getMinutes());
            return `${horas}:${minutos}`;
        }
    };

    return (
        <div className='fadeIn transition flex flex-col p-2 gap-2 bg-default-200 rounded w-full'>
            {title && (
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        {title == 'Ao vivo' && <div className="relative flex flex-start h-[10px] w-[10px]">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-[10px] w-[10px] bg-danger"></span>
                        </div>}
                        <span className='text-default-800 font-semibold text-sm'>{title}</span>
                    </div>
                    {slug && (
                        <div className='flex justify-start items-center px-1 gap-1'>
                            {gamesStats.slice(0, 5).map((g, i) => (
                                <div 
                                    key={i+g.slug+g.id}
                                    className={`h-[12px] w-[12px] fadeIn rounded-full ${(g.winner_team_slug === slug ? 'bg-success' : 'bg-danger')} shadow-md transition duration-150 ease-in-out`}
                                >
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            {children}
            {currentGames.length ? <div className='flex fadeIn bg-default-50 overflow-y-hidden rounded w-full'>
                <div className='min-w-max w-full flex flex-col'>{currentGames.map((game, i) => (
                    <div key={game.slug + i} className={`relative flex gap-2 overflow-x-auto overflow-y-hidden w-full h-[60px] min-h-[60px] max-h-[60px] transition hover:bg-glass-primary p-2 ${i ? 'short-top-border' : ''}`}>
                        <div className='absolute top-[4px] left-[8px] z-10 flex gap-2 flex-nowrap'>
                            <span className='bg-primary-600 text-default-100 whitespace-nowrap font-semibold text-[11px] rounded-sm px-2 h-[16px] flex text-center items-center justify-center'>
                                {game.stage_round?.round && game.stage_round.round.length > 14
                                    ? game.stage_round?.round.slice(0, 14) + "..."
                                    : game.stage_round?.round
                                }
                            </span>
                            <span className='bg-primary-600 text-default-100 font-semibold text-[11px] rounded-sm px-2 h-[16px] flex text-center items-center justify-center'>{game.bo_type && `Bo${game.bo_type}`}</span>
                            <span className={`text-default-800 text-[11px] whitespace-nowrap h-[16px] flex text-center items-center justify-center ${rounterLeague ? 'hover:text-primary-600 cursor-pointer' : ''}`}
                                onClick={rounterLeague ? ()=>handleNavigation(`/league/${game.league_slug}`) : ()=>{}}>
                                { game.league_name && game.league_name.length > 30
                                    ? game.league_name.slice(0, 30) + "..."
                                    : game.league_name
                                }
                            </span>
                        </div>
                        <div 
                            className={`absolute bottom-[-44px] left-[-32px] h-[32px] w-[32px] rotate-45 transform translate-x-1/2 -translate-y-1/2 ${slug ? (game.winner_team_slug==slug ? 'bg-success' : 'bg-danger') : ''}`} >
                        </div>
                        <div className={`flex flex-col pt-5 font-semibold w-[36px] max-w-[36px] min-w-[36px] gap-1 items-center text-center justify-center ${isMobile ? 'text-[10px]' : 'text-[11px]'}`}>
                            <span className='text-default-800'>{formatTimestamp(game.start_timestamp, 'date')}</span>
                            <span className='text-default-800'>{formatTimestamp(game.start_timestamp, 'hour')}</span>
                        </div>
                        <div className={`flex gap-2 pt-4 items-center justify-center w-full max-w-[40%] min-w-[260px] ${title!='Ao vivo' && 'hover:text-primary-600 cursor-pointer'}`}
                            onClick={()=>title!='Ao vivo' && handleNavigation(`/game/${game.slug}`)}>
                            <div className='flex w-full min-w-[136px] items-center justify-end gap-2'>
                                <span className={`font-semibold whitespace-nowrap overflow-hidden text-end text-ellipsis flex-1 ${isMobile ? 'text-[11px]' : 'text-xs'}`}>
                                    { game.team1_name ? game.team1_name : (
                                        <span className='italic'>{'unknown team'}</span>
                                    )}
                                </span>
                                <TeamImage slug={game.team1_slug} img_url={game.team1_img_url} className='h-[16px] w-[16px] w-[16px] min-w-[16px] max-w-[16px]' />
                                <span className={`rounded transition flex items-center justify-center bg-default-200 p-1 h-[23x] w-[25px] w-[25px] min-w-[25px] max-w-[25px] text-xs font-semibold ${!game.winner_team_slug ? 'text-default-950' : game.team1_slug == game.winner_team_slug ? 'text-success' : 'text-danger'}`}>{game.team1_score ? game.team1_score : '0'}</span>
                            </div>

                            <div className='flex w-full min-w-[136px] items-center gap-2'>
                                <span className={`rounded transition flex items-center justify-center bg-default-200 p-1 h-[23x] w-[25px] min-w-[25px] max-w-[25px] text-xs font-semibold ${!game.winner_team_slug ? 'text-default-950' : game.team2_slug == game.winner_team_slug ? 'text-success' : 'text-danger'}`}>{game.team2_score ? game.team2_score : '0'}</span>
                                <TeamImage slug={game.team2_slug} img_url={game.team2_img_url} className='h-[16px] w-[16px] min-w-[16px] max-w-[16px]' />
                                <span className={`font-semibold whitespace-nowrap overflow-hidden text-ellipsis flex-1 ${isMobile ? 'text-[11px]' : 'text-xs'}`}>
                                    { game.team2_name ? game.team2_name : (
                                        <span className='italic'>{'unknown team'}</span>
                                    )}
                                </span>
                            </div>
                        </div>
                        {gameMap && (
                            <div className={`pl-4 flex flex-1 max-w-[100%] w-full flex-nowrap md:w-auto`}>
                                {(game.status == 'finished' && game.games_score) ? <GameMapsScore gamesScore={game.games_score} game={game} navigateToMap={true} /> : null}
                            </div>
                        )}
                    </div>
                ))}</div>
            </div>
                :
                <div className='flex px-2 fadeIn items-center justify-center text-default-800 h-[70px] gap-3'>
                    <Icon name='cuida:alert-outline' className='text-2xl' />
                    <span className='text-sm'>Nenhum jogo encontrado</span>
                </div>}
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
