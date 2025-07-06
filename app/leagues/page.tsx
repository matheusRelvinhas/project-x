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
import { useAppContext } from "@/context/context";
import Modal from '@/components/modal';
import SearchSelect from '@/components/searchSelect';
import Select from '@/components/select';
import { FilterTag } from '@/components/filter-tag';
import Fuse from "fuse.js";
import LeagueImage from '@/components/league-image';
import TeamImage from '@/components/team-image';

type TournamentPrize = {
    place: string|null;
    teams: {
        slug: string|null;
        name: string|null;
        img_extension: string|null;
    };
};

type TournamentTeams = {
    slug: string|null;
    name: string|null;
    img_extension: string|null; 
};

interface LeagueStats {
    id: number;
    slug: string;
    name: string;
    img_extension: string|null; 
    status: string|null;
    prize: number|null;
    start_date: string|null;
    start_timestamp: number|null;
    tier: string|null;
    teams: TournamentTeams[]|null;
    tournament_prizes: TournamentPrize[]|null;
    stage_rounds: []|null;
    created_at: number | null;
    updated_at: number | null;
};

export default function LeaguesPage() {

    const { isMobile, setLoading } = useAppContext();

    const [leaguesStats, setLeaguesStats] = useState<LeagueStats[]>([]);
    const [upcomingLeagues, setUpcomingLeagues] = useState<LeagueStats[]>([]);
    const [filterLeagues, setFilterLeagues] = useState<LeagueStats[]>([]);
    const [filterUpcomingLeagues, setFilterUpcomingLeagues] = useState<LeagueStats[]>([]);
    const [status, setStatus] = useState<'finished'|'current'>('current');
    const [tier, setTier] = useState<'s'|'a'|'s-a'>('s-a');
    const [years, setYears] = useState<string[]>([String(new Date().getFullYear())]);
    const [searchInput, setSearchInput] = useState('');
    const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);
    const [leagueHover, setLeagueHover] = useState<string|null>(null);
    
    const tierGroup = [
        {title: 'Tier S e A', value: 's-a'},
        {title: 'Tier S', value: 's'},
        {title: 'Tier A', value: 'a'},
    ];

    const yearGroup = ['2025', '2024', '2023', '2022', '2021', '2020'].map(y => ({ value: y, name: y, title: y }));

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

    const getTeams = async (status:string, years:string[]) => {
        if (!years.length) {setUpcomingLeagues([]);setLeaguesStats([]); return;}
        if (status=='finished') {setUpcomingLeagues([])}
        const yearsParam = encodeURIComponent(JSON.stringify(years));
        setLoading(true);
        await axiosGet(
            `/leagues_stats?status=${status}&years=${yearsParam}`,
            (data) => {
                if (status=='upcoming') {setUpcomingLeagues(data.leagues);return};
                setLeaguesStats(data.leagues);
            },
            () => toast.error('Erro inesperado, tente novamente.'), true
        );
        setLoading(false);
    };

    useEffect(() => {
        setLeaguesStats([]);
        setUpcomingLeagues([]);
        if (status=='current') getTeams('upcoming', years);
        getTeams(status, years);
    }, [status, years]);

    const setFilter = (leagues:LeagueStats[]) => {
        const fuse = new Fuse(leagues, {
            keys: ['name', 'slug', 'start_date'],
            threshold: 0.4,
        });
        const searchFilter = searchInput ? fuse.search(searchInput).map(result => result.item) : leagues;
        const tierFilter = tier=='s-a' ?  searchFilter : searchFilter.filter(l => tier.includes(l.tier?l.tier:''));
        const sortedFilter = tierFilter.sort((a, b) => (status === 'finished' ? -1 : 1) * ((a.start_timestamp ?? 0) - (b.start_timestamp ?? 0)));
        return sortedFilter;
    };

    useEffect(() => {
        setFilterLeagues(setFilter(leaguesStats));
    }, [leaguesStats, searchInput, tier]);

    useEffect(() => {
        setFilterUpcomingLeagues(setFilter(upcomingLeagues));
    }, [upcomingLeagues, searchInput, tier]);

    useEffect(() => {
        if (status === 'current') setYears([String(new Date().getFullYear())]);
    }, [status]);

    const leaguesTable = (leagues:LeagueStats[], title:string) => {
        if (!Array.isArray(leagues)) return null;
        return <div className='flex flex-col p-2 bg-default-200 gap-1 rounded-lg'>
            <span className='text-default-800 font-semibold text-sm'>{title}</span>
            <div className={`overflow-x-auto fadeIn  rounded-lg w-full ${leagues.length && 'bg-default-50 border-1 border-default-400'}`}>
                <div className='min-w-max flex flex-col'>{(leagues.length ? leagues.map((l,i)=>
                    <div key={l.slug+l.id} onClick={()=>setLeagueHover(l.slug)} className={`flex fadeIn border-default-400 px-2 py-2 gap-2 items-center transition hover:bg-glass-primary ${l.slug == leagueHover && 'bg-glass-primary'} ${i && 'border-t-1'}`}>
                        <div className='flex w-full gap-2'>
                            <LeagueImage slug={l.slug} extension={l.img_extension} className='min-w-[40px] w-[40px] mr-2' />
                            <div className={`flex flex-col gap-1 w-full ${isMobile && 'min-w-[200px] max-w-[200px]'}`}>
                                <span className='text-xs text-default-800'>{l.start_timestamp && formatTimestampToStr(l.start_timestamp)}</span>
                                <span className='font-semibold text-sm'>{l.name}</span>
                                <div className='flex h-[12px]'>
                                    {l.prize ? (
                                        <>
                                            <Icon className='text-success text-sm' name={`mdi:dollar`}/>
                                            <span className="text-xs">{l.prize.toLocaleString('fr-FR')}</span>
                                        </>
                                    ):''}
                                </div>
                            </div>
                            <div className='flex items-center'>
                                <span className='italic text-sm text-default-800'>tier</span>
                                <Icon className='text-3xl text-primary-600' name={`mdi:letter-${l.tier}`}/>
                            </div>
                        </div>
                        
                        <div className='flex w-full gap-1 items-center justify-center'>
                            {(status=='finished' && l.tournament_prizes && l.tournament_prizes.length) ?
                                <FilterTag className='' showNum={isMobile ? 3 : 6} items={l.tournament_prizes.filter(t => /^1(?!\d)/.test(t.place ?? '')).map((t, idx) => (
                                    <div key={idx} className="flex flex-col items-center justify-center gap-1">
                                        <Icon className="text-md text-default-900" name="mdi:crown" />
                                        <TeamImage slug={t.teams?.slug} extension={t.teams?.img_extension} className='w-[20px] h-[20px]' />
                                        <span className='text-default-800 text-[10px]'>{t.teams?.name}</span>
                                    </div>
                                ))}/>
                            : (status=='current' && l.teams && l.teams.length) ? 
                                <FilterTag className='' showNum={isMobile ? 3 : 6} items={l.teams.map((t,i)=> 
                                    <div key={l.slug+i} className='flex flex-col w-full items-center justify-center gap-1'>
                                        <TeamImage slug={t.slug} extension={t.img_extension} className='w-[20px] h-[20px]' />
                                        <span className='text-default-800 text-[10px]'>{t.name}</span>
                                    </div>)}
                                />
                            : (
                                <>
                                    <Icon name='cuida:alert-outline' className='text-lg text-default-800'/>
                                    <span className='text-xs text-default-800'>Aguardando resultados</span>
                                </>
                            )}
                        </div>
                    </div>
                    ) : (
                    <div className='flex px-2 fadeIn items-center justify-center text-default-800 pb-5 h-[70px] gap-3'>
                        <Icon name='cuida:alert-outline' className='text-3xl'/>
                        <span>Nenhum campeonato encontrado</span>
                    </div>))}
                </div>
            </div>
        </div>
    };

    const formatTimestampToStr = (timestamp: number): string => {
        const date = new Date(timestamp * 1000);
        const day = date.getDate();
        const month = date.toLocaleString('pt-BR', { month: 'long' });
        const year = date.getFullYear();
        return `${day} de ${month} - ${year}`;
    };

    return (
        <div className="flex flex-col w-full h-full fadeIn gap-2">
            <div className='flex transition border-default-400 border-b-1'>
                <span className='text-lg font-bold text-default-950'>Campeonatos</span>
            </div>
            <div className='flex flex-wrap gap-2 w-full items-center text-sm'>
                <Input placeholder='Busca avançada' value={searchInput} onValueChange={setSearchInput}
                    startContent={<Icon name='mingcute:search-ai-line' className='text-lg'/>}
                />
                <Button onClick={() => setIsModalFilterOpen(true)}>
                    <div className='flex gap-2'>
                        <Icon name='mdi:filter-cog-outline' className='text-lg'/>
                        <span>Filtros</span>
                    </div>
                </Button>
            </div>

            <div className='flex flex-col gap-2 w-full max-w-5xl'>
                <div className='flex justify-end flex-wrap w-full gap-[6px] whitespace-nowrap'>
                    <FilterTag items={tierGroup.find(t => t.value === tier)?.title ?? ''} />
                    <FilterTag items={years} />   
                </div>
                <div className="w-full overflow-x-auto overflow-y-hidden rounded-lg min-h-[40px]">
                    <div className="flex w-max py-1 px-2 rounded-lg gap-2 bg-default-200 text-default-700">
                        {buttonGroup('finished')}
                        {buttonGroup('current')} 
                    </div>
                </div>
                {status=='finished' && leaguesTable(filterLeagues, 'Campeonatos finalizados')}
                {status=='current' && leaguesTable(filterLeagues, 'Campeonatos em andamento')}
                {(status=='current' && filterUpcomingLeagues.length) ? leaguesTable(filterUpcomingLeagues, 'Campeonatos futuros'): null}
            </div>

            <Modal isOpen={isModalFilterOpen} setIsOpen={setIsModalFilterOpen} title='Filtros' icon='mdi:filter-cog-outline'>
                <div className='flex flex-col gap-2'>
                    <div className='flex text-sm gap-1 flex-col'>
                        <span className=''>Tier</span>
                        <Select value={tier} setValue={setTier} placeholder='Selecione um tier'
                            options={tierGroup}
                        />
                    </div>
                    {status=='finished' ? 
                        <div className='flex text-sm gap-1 flex-col'>
                            <span className=''>Período:</span>
                            <SearchSelect
                                value={years}
                                setValue={setYears}
                                options={yearGroup}
                                placeholder="Selecione nacionalidades"
                                maxSelect={20}
                            />
                        </div>
                    : null}
                </div>
            </Modal>
        </div>
    );
}
