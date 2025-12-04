import Icon from '@/components/icon';
import { useMemo, ReactNode } from "react";
import { useAppContext } from "@/context/context";
import { FilterTag } from '@/components/filter-tag';
import LeagueImage from '@/components/league-image';
import TeamImage from '@/components/team-image';
import { type LeagueStats, type TournamentPrize } from "@/app/leagues/page";
import Pagination from './pagination';

interface LeaguesStatsTableProps {
    leaguesStats: LeagueStats[];
    children?: ReactNode|null;
    currentPage: number;
    onPageChange: (n:number) => void;
    title?: string|null;
    showTeam?: string|null|string[];
    itemsPerPage?: number;
};

export default function LeaguesStatsTable({
    leaguesStats,
    children,
    currentPage,
    onPageChange,
    title = null,
    showTeam = null,
    itemsPerPage = 8
}: LeaguesStatsTableProps) {

    const { isMobile } = useAppContext();

    const formatTimestampToStr = (timestamp: number): string => {
        const date = new Date(timestamp * 1000);
        const day = date.getDate();
        const month = date.toLocaleString('pt-BR', { month: 'long' });
        const year = date.getFullYear();
        return `${day} de ${month} - ${year}`;
    };

    const findPositionTeam = (data: TournamentPrize[] | null, slug: string | null | string[]) => {
        if (typeof slug !== 'string') return null;
        return data?.find((item) => item.teams?.slug === slug);
    };

    const totalPages = Math.ceil(leaguesStats.length / itemsPerPage);
        const currentLeagues = useMemo(() => {
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            return leaguesStats.slice(start, end);
    }, [leaguesStats, currentPage, itemsPerPage]);

    return (
        Array.isArray(leaguesStats) ? <div className='flex w-full flex-col p-2 bg-default-200 gap-2 rounded-lg'>
            {title && (
                <span className='text-default-800 font-semibold text-sm'>{title}</span>
            )}
            {children}
            <div className={`fadeIn overflow-y-hidden rounded-lg w-full ${leaguesStats.length && 'bg-default-50 border-1 border-default-400'} ${showTeam ? 'overflow-x-hidden' : 'overflow-x-auto'}`}>
                <div className='min-w-max flex flex-col'>{(leaguesStats.length ? currentLeagues.map((l,i)=>
                    <div key={l.slug+l.id} className={`flex h-[84px] fadeIn border-default-400 px-2 py-[6px] gap-2 items-center transition hover:bg-glass-primary ${i && 'border-t-1'}`}>
                        <LeagueImage slug={l.slug} extension={l.img_extension} className='min-w-[36px] w-[36px] max-h-[36px] mr-2' />
                        <div className={`flex flex-col gap-1 w-full ${isMobile && 'min-w-[180px] max-w-[180px]'}`}>
                            <span className='text-xs text-default-800'>{l.start_timestamp && formatTimestampToStr(l.start_timestamp)}</span>
                            <span className='font-semibold text-xs'>{l.name}</span>
                            <div className='flex items-center gap-1 h-[20px]'>
                                <div className='flex items-center bg-default-200 pl-2 h-[20px] rounded'>
                                    <span className='italic text-sm text-default-800'>tier</span>
                                    <Icon className='text-3xl text-primary-600' name={`mdi:letter-${l.tier}`}/>
                                </div>
                                {l.prize ? (
                                    <div className='flex'>
                                        <Icon className='text-success text-sm' name={`mdi:dollar`}/>
                                        <span className="text-xs">{l.prize.toLocaleString('fr-FR')}</span>
                                    </div>
                                ):null}
                            </div>
                        </div>
                        {!showTeam ? (
                            <div className='flex w-full gap-1 items-center justify-center'>
                                {(l.status=='finished' && l.tournament_prizes && l.tournament_prizes.length) ?
                                    <FilterTag className='' showNum={isMobile ? 3 : 6} items={l.tournament_prizes.filter(t => /^1(?!\d)/.test(t.place ?? '')).map((t, idx) => (
                                        <div key={idx} className="flex flex-col items-center justify-center gap-1">
                                            <Icon className="text-md text-default-900" name="mdi:crown" />
                                            <TeamImage slug={t.teams?.slug} extension={t.teams?.img_extension} className='w-[20px] h-[20px]' />
                                            <span className='text-default-800 text-[10px]'>{t.teams?.name}</span>
                                        </div>
                                    ))}/>
                                : (l.status=='current' && l.teams && l.teams.length) ? 
                                    <FilterTag className='' showNum={isMobile ? 3 : 6} items={l.teams.map((t,i)=> 
                                        <div key={l.slug+i} className='flex flex-col w-full items-center justify-center gap-1'>
                                            <TeamImage slug={t.slug} extension={t.img_extension} className='w-[20px] h-[20px]' />
                                            <span className='transition text-[10px]'>{t.name}</span>
                                        </div>)}
                                    />
                                : (
                                    <>
                                        <Icon name='cuida:alert-outline' className='text-lg text-default-800'/>
                                        <span className='text-xs text-default-800'>Aguardando resultados</span>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className='flex flex-col w-full items-center justify-center gap-2'>
                                {findPositionTeam(l.tournament_prizes, showTeam)?.teams?.slug && (
                                    <>
                                        <TeamImage
                                            slug={findPositionTeam(l.tournament_prizes, showTeam)?.teams?.slug ?? null} 
                                            extension={findPositionTeam(l.tournament_prizes, showTeam)?.teams?.img_extension ?? 'png'} 
                                            className='w-[24px] h-[24px]' 
                                        />
                                        <span className='text-sm font-semibold'>{findPositionTeam(l.tournament_prizes, showTeam)?.place}</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    ) : (
                    <div className='flex px-2 fadeIn items-center justify-center text-default-800 pb-5 h-[70px] gap-3'>
                        <Icon name='cuida:alert-outline' className='text-2xl' />
                        <span className='text-sm'>Nenhum campeonato encontrado</span>
                    </div>))}
                </div>
            </div>
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            )}
        </div> : null
    );
}
