import Icon from '@/components/icon';
import { useMemo, ReactNode } from "react";
import TeamImage from '@/components/team-image';
import Pagination from '@/components/pagination';
import { type GameScore } from "@/app/games/page";
import { mapsName } from '@/utils/utils';

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

    const gameMapsScore = (gamesScore: GameScore[]) => {
        return <div className='flex flex-col w-full h-full gap-1'>
            {gamesScore.length ? gamesScore.map((g, i) =>
                <div className='flex relative overflow-x-auto overflow-y-hidden justify-between bg-default-50 rounded-lg px-2 py-1 h-[64px] transition border-1 border-default-400 hover:bg-glass-primary gap-1' key={i + g.map_name}>
                    <div className='absolute top-[3px] left-[8px] z-10 flex gap-2 flex-nowrap'>
                        <span className='bg-primary-600 text-default-100 font-semibold text-[11px] rounded-sm px-2 h-[16px] flex text-center items-center justify-center'>
                            {mapsName.find(m => m.value === g.map_name)?.title}
                        </span>
                    </div>
                    <div 
                        className={`absolute bottom-[-40px] left-[-32px] h-[32px] w-[32px] rotate-45 transform translate-x-1/2 -translate-y-1/2 ${slug ? (g.winner_team==slug ? 'bg-success' : 'bg-danger') : ''}`} >
                    </div>
                    <div className='flex gap-2'>
                        <div className='flex flex-col pt-2 w-[40px] gap-1 items-center text-center justify-center pe-2 border-e-1 border-default-400'>
                            <span className='text-default-800 text-xs'>{formatTimestamp(g.start_timestamp)}</span>
                        </div>
                        <div className='flex items-center pt-1 pe-2 border-e-1 border-default-400'>
                            <img className="h-[30px] min-w-[60px] border-1 border-default-400 rounded-lg" src={`/img/maps/${g.map_name}.jpg`} />
                        </div>
                    </div>

                    <div className='flex flex-col w-full px-1 justify-center gap-1'>
                        <div className='flex gap-2 items-center'>
                            <TeamImage slug={g.team1_slug} extension={g.team1_img_extension} className='flex w-full h-[16px] max-w-[16px]' />
                            <span className='text-default-900 text-xs w-full max-w-[130px]'>{g.team1_name}</span>
                            <span className={`rounded-lg transition flex items-center justify-center bg-default-200 py-1 px-2 h-[23x] w-[25px] text-xs font-semibold ${g.winner_team==g.team1_slug ? 'text-success' : 'text-danger'}`}>
                                {g.winner_team==g.team1_slug ? g.winner_score : g.loser_score}
                            </span>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <TeamImage slug={g.team2_slug} extension={g.team2_img_extension} className='flex w-full h-[16px] max-w-[16px]' />
                            <span className='text-default-900 text-xs w-full max-w-[130px]'>{g.team2_name}</span>
                            <span className={`rounded-lg transition flex items-center justify-center bg-default-200 py-1 px-2 h-[23x] w-[25px] text-xs font-semibold ${g.winner_team==g.team2_slug ? 'text-success' : 'text-danger'}`}>
                                {g.winner_team==g.team2_slug ? g.winner_score : g.loser_score}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='flex px-2 fadeIn items-center justify-center text-default-800 pb-5 h-[70px] gap-3'>
                    <Icon name='cuida:alert-outline' className='text-2xl' />
                    <span className='text-sm'>Nenhum mapa encontrado</span>
                </div>
            )}
        </div>
    };

    return (
        <div className='fadeIn transition flex flex-col p-2 gap-2 bg-default-200 rounded-lg w-full h-full'>
            <div className='flex items-center'>
                <span className='text-default-800 font-semibold text-sm'>{'Mapas'}</span>
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
