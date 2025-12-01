'use client';

import Icon from '@/components/icon';
import { useState, useEffect } from "react";
import Input from "@/components/input";
import Button from "@/components/button";
import { toast } from "react-toastify";
import { axiosGet } from "@/utils/axios";
import { useAppContext } from "@/context/context";
import Modal from '@/components/modal';
import SearchSelect from '@/components/searchSelect';
import Select from '@/components/select';
import { FilterTag } from '@/components/filter-tag';
import Fuse from "fuse.js";
import LeaguesStatsTable from '@/components/leagues-stats-table';

export type TournamentPrize = {
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

export interface LeagueStats {
    id: number;
    slug: string;
    name: string;
    img_extension: string|null; 
    status: string|null;
    prize: number|null;
    start_date: string|null;
    start_timestamp: number;
    tier: string|null;
    teams: TournamentTeams[]|null;
    tournament_prizes: TournamentPrize[]|null;
    stage_rounds: []|null;
    created_at: number | null;
    updated_at: number | null;
};

export default function LeaguesPage() {

    const { setLoading } = useAppContext();

    const [leaguesStats, setLeaguesStats] = useState<LeagueStats[]>([]);
    const [upcomingLeagues, setUpcomingLeagues] = useState<LeagueStats[]>([]);
    const [filterLeagues, setFilterLeagues] = useState<LeagueStats[]>([]);
    const [filterUpcomingLeagues, setFilterUpcomingLeagues] = useState<LeagueStats[]>([]);
    const [status, setStatus] = useState<'finished'|'current'>('current');
    const [tier, setTier] = useState<'s'|'a'|'s-a'>('s-a');
    const [years, setYears] = useState<string[]>([String(new Date().getFullYear())]);
    const [searchInput, setSearchInput] = useState('');
    const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [currentUpcomingPage, setCurrentUpcomingPage] = useState(1);
    
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
        setCurrentPage(1);
        setCurrentUpcomingPage(1);
    }, [status]);

    return (
        <div className="flex flex-col w-full h-full fadeIn gap-2">
            <div className='flex transition border-default-400 border-b-1'>
                <span className='text-lg font-bold text-default-950'>Campeonatos</span>
            </div>
            <div className='flex flex-wrap gap-2 w-full items-center text-sm'>
                <Input placeholder='Busca avançada' value={searchInput} onValueChange={(val) => setSearchInput(val as string)}
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
                {status=='finished' && <LeaguesStatsTable leaguesStats={filterLeagues} title='Campeonatos finalizados' currentPage={currentPage} onPageChange={setCurrentPage} />}
                {status=='current' && <LeaguesStatsTable leaguesStats={filterLeagues} title='Campeonatos em andamento' currentPage={currentPage} onPageChange={setCurrentPage} />}
                {(status=='current' && filterUpcomingLeagues.length) ? <LeaguesStatsTable leaguesStats={filterUpcomingLeagues} title='Campeonatos futuros' currentPage={currentUpcomingPage} onPageChange={setCurrentUpcomingPage} /> : null}
            </div>

            <Modal isOpen={isModalFilterOpen} setIsOpen={setIsModalFilterOpen} title='Filtros' icon='mdi:filter-cog-outline'>
                <div className='flex flex-col gap-2'>
                    <div className='flex text-sm gap-1 flex-col'>
                        <span>Tier</span>
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
