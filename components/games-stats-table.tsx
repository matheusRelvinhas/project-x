import Icon from '@/components/icon';
import { useMemo, ReactNode } from "react";
import { useAppContext } from "@/context/context";
import TeamImage from '@/components/team-image';
import Pagination from '@/components/pagination';
import { type GameScore, type GameStats } from "@/app/games/page";

interface GamesStatsTableProps {
    gamesStats: GameStats[];
    children?: ReactNode|null;
    currentPage: number;
    onPageChange: (n:number) => void;
    title?: string|null;
    slug?: string|string[];
    gameMap?: boolean;
    itemsPerPage?: number;
}

export default function GamesStatsTable({
    gamesStats,
    currentPage,
    onPageChange,
    children=null,
    title=null,
    slug='',
    gameMap=true,
    itemsPerPage = 8
}: GamesStatsTableProps) {

    const { isMobile } = useAppContext();

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

    const gameMapsScore = (gamesScore: GameScore[], game: GameStats) => {
        const sortedGames = [...gamesScore].sort((a, b) => a.order - b.order);
        return <div className='flex w-full h-full gap-3 items-center justify-end'>
            {sortedGames.map((g, i) =>
                <div className='flex flex-col gap-1' key={game.id + i + g.map_name}>
                    <div className='flex items-center justify-between px-1 gap-1'>
                        {g.winner_team == game.team1_slug && <TeamImage slug={game.team1_slug} extension={game.team1_img_extension} className='h-[17px] w-[17px]' />}
                        {g.winner_team == game.team2_slug && <TeamImage slug={game.team2_slug} extension={game.team2_img_extension} className='h-[17px] w-[17px]' />}
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

    return (
        <div className='fadeIn transition flex flex-col p-2 gap-2 bg-default-200 rounded-lg w-full h-full'>
            {title && (
                <div className='flex items-center justify-between'>
                    {title == 'Ao vivo' && <span className="relative flex h-[10px] w-[10px]">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-[10px] w-[10px] bg-danger"></span>
                    </span>}
                    <span className='text-default-800 font-semibold text-sm'>{title}</span>
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
            {currentGames.length ? <div className='flex w-full h-full flex-col gap-1'>
                {currentGames.map((game, i) => (
                    <div key={game.slug + i} className={`relative flex gap-2 overflow-x-auto overflow-y-hidden w-full h-[82px] min-h-[82px] max-h-[82px] transition border-1 border-default-400 hover:bg-glass-primary rounded-lg px-3 pt-[16px] pb-2 bg-default-50`}>
                        <div className='absolute top-[3px] left-[8px] z-10 flex gap-2 flex-nowrap'>
                            <span className='bg-primary-600 text-default-100 font-semibold text-[11px] rounded-sm px-2 h-[16px] flex text-center items-center justify-center'>{game.stage_round && game.stage_round.round}</span>
                            <span className='bg-primary-600 text-default-100 font-semibold text-[11px] rounded-sm px-2 h-[16px] flex text-center items-center justify-center'>{game.bo_type && `Bo${game.bo_type}`}</span>
                        </div>
                        <div 
                            className={`absolute bottom-[-38px] left-[-32px] h-[32px] w-[32px] rotate-45 transform translate-x-1/2 -translate-y-1/2 ${slug ? (game.winner_team_slug==slug ? 'bg-success' : 'bg-danger') : ''}`} >
                        </div>
                        <div className='flex flex-col w-[36px] gap-1 items-center text-center justify-center'>
                            <span className='text-default-800 text-xs'>{formatTimestamp(game.start_timestamp, 'date')}</span>
                            <span className='text-default-800 text-xs'>{formatTimestamp(game.start_timestamp, 'hour')}</span>
                        </div>
                        <div className='flex gap-2'>
                            <span className='flex items-center text-center text-default-800 text-[10px] w-[72px] border-x-1 py-1 px-2 border-default-400'>
                                { game.league_name && game.league_name.length > 20
                                    ? game.league_name.slice(0, 20) + "..."
                                    : game.league_name
                                }
                            </span>
                            <div className='flex flex-col gap-2 justify-center min-w-[136px] max-w-[136px]'>
                                <div className='flex items-center gap-2'>
                                    <TeamImage slug={game.team1_slug} extension={game.team1_img_extension} className='h-[16px] w-[16px]' />
                                    <span className='text-default-900 text-xs whitespace-nowrap'>
                                        { game.team1_name && game.team1_name.length > 17
                                            ? game.team1_name.slice(0, 17) + "..."
                                            : game.team1_name ? game.team1_name : (
                                                <span className='italic'>{'unknown team'}</span>
                                            )
                                        }
                                    </span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <TeamImage slug={game.team2_slug} extension={game.team2_img_extension} className='h-[16px] w-[16px]' />
                                    <span className='text-default-900 text-xs whitespace-nowrap'>
                                        { game.team2_name && game.team2_name.length > 17 
                                            ? game.team2_name.slice(0, 17) + "..."
                                            : game.team2_name ? game.team2_name : (
                                                <span className='italic'>{'unknown team'}</span>
                                            )
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className='flex align-center justify-center flex-col gap-2'>
                                <span className={`rounded-lg transition flex items-center justify-center bg-default-200 p-1 h-[23x] w-[25px] text-xs font-semibold ${!game.winner_team_slug ? 'text-default-950' : game.team1_slug == game.winner_team_slug ? 'text-success' : 'text-danger'}`}>{game.team1_score ? game.team1_score : '0'}</span>
                                <span className={`rounded-lg transition flex items-center justify-center bg-default-200 p-1 h-[23x] w-[25px] text-xs font-semibold ${!game.winner_team_slug ? 'text-default-950' : game.team2_slug == game.winner_team_slug ? 'text-success' : 'text-danger'}`}>{game.team2_score ? game.team2_score : '0'}</span>
                            </div>
                        </div>
                        {gameMap && (
                            <div className={`flex justify-end ${isMobile ? '' : 'w-full'}`}>
                                {(game.status == 'finished' && game.games_score) ? gameMapsScore(game.games_score, game) : null}
                            </div>
                        )}
                    </div>
                ))}
            </div>
                :
                <div className='flex px-2 fadeIn items-center justify-center text-default-800 pb-5 h-[70px] gap-3'>
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
