'use client';

import Icon from '@/components/icon';
import { useState, useEffect, useMemo, JSX } from "react";
import Input from "@/components/input";
import Button from "@/components/button";
import { toast } from "react-toastify";
import { axiosGet } from "@/utils/axios";
import { useAppContext } from "@/context/context";
import Modal from '@/components/modal';
import Fuse from "fuse.js";
import SearchSelect from '@/components/searchSelect';
// @ts-expect-error not error
import Flag from 'react-world-flags';
import { FilterTag } from '@/components/filter-tag';
import Ripple from 'react-ripplejs';
import Pagination from '@/components/pagination';
import TeamImage from '@/components/team-image';
import { useRouter } from 'next/navigation';

export interface TeamStats {
    id: number;
    slug: string;
    team_name: string;
    img_extension: string | null;
    country_code: string;
    country_name: string;
    region_code: string;
    points: number | null;
    rank: number | null;
    created_at: number | null;
    updated_at: number | null;
};

type NumericKeys<T> = {
    [K in keyof T]: T[K] extends number | null ? K : never
  }[keyof T];

export default function TeamsPage() {
    
    const { isMobile, setLoading } = useAppContext();
    const router = useRouter();
    
    const [teamsStats, setTeamsStats] = useState<TeamStats[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const [countrySelect, setCountrySelect] = useState<string[]>([]);
    const [regionCode, setRegionCode] = useState<string>('all');
    const [countries, setCountries] = useState<{ value: string; name: string, title: string | JSX.Element }[]>([]);
    const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterTeams, setFilterTeams] = useState<TeamStats[]>([]);
    
    const [sortedBy, setSortedBy] = useState<NumericKeys<TeamStats>>('points');
    const [desc, setDesc] = useState<boolean>(true);
    const [teamHover, setTeamHover] = useState<string|null>('');

    const selectStat = (stat: NumericKeys<TeamStats>) => {
        if (sortedBy == stat) setDesc(!desc);
        else {
            setSortedBy(stat);
            setDesc(true);
        }
    };

    const regionGroup = [
        { title: 'Mundial', region_code: 'all'},
        { title: 'América', region_code: 'AM'},
        { title: 'Europa', region_code: 'EU'},
        { title: 'Ásia', region_code: 'AS'},
    ];

    const ITEMS_PER_PAGE = 12;

    const totalPages = Math.ceil(filterTeams.length / ITEMS_PER_PAGE);
    const currentTeams = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return filterTeams.slice(start, end);
    }, [filterTeams, currentPage]);

    const getOptionStyles = (option: TeamStats) => {
        return (
            <div className='flex gap-3'>
                <Flag code={option.country_code} style={{width: '14px'}} />
                <span>{option.country_name}</span>
            </div>
        )
    };

    const getUniqueCountries = (teams: TeamStats[]) => {
        return Array.from(
            new Map(
                teams.map(t => [`${t.country_code}_${t.country_name}`, { value: t.country_code ?? '', name: t.country_name ?? '', title: getOptionStyles(t) }])
            ).values()
        );
    };
    
    useEffect(() => {
        const getTeams = async () => {
            setLoading(true);
            await axiosGet(
                `/teams_stats?region_code=${regionCode}`,
                (data) => {
                    setTeamsStats(data.teams);
                },
                () => toast.error('Erro inesperado, tente novamente. #13'), true
            );
            setLoading(false);
        };
        getTeams();
        setCountrySelect([]);
        setCurrentPage(1);
        setDesc(true);
    }, [regionCode]);

    useEffect(() => {
        const sortedCountries = getUniqueCountries(teamsStats).sort((a, b) => {
            const nameA = a.name ?? '';
            const nameB = b.name ?? '';
            return nameA.localeCompare(nameB);
        });
        setCountries(sortedCountries);
    }, [teamsStats]);

    useEffect(() => {
        const fuse = new Fuse(teamsStats, {
            keys: ['team_name', 'slug', 'country_name'],
            threshold: 0.4,
        });
        const searchFilter = searchInput ? fuse.search(searchInput).map(result => result.item) : teamsStats;
        const countryFilter = countrySelect.length ? searchFilter.filter(t => countrySelect.includes(t.country_code)) : searchFilter;
        const sortedFilter = [...countryFilter].sort((a, b) => desc ? (b[sortedBy] ?? 0) - (a[sortedBy] ?? 0) : (a[sortedBy] ?? 0) - (b[sortedBy] ?? 0));
        setFilterTeams(sortedFilter);
        setCurrentPage(1);
    }, [teamsStats, searchInput, countrySelect, desc, sortedBy]);

    const getRegionRank = (slug: string, region_code: string): number | null => {
        const regionalTeams = teamsStats.filter(team => team.region_code === region_code && team.points !== null);
        regionalTeams.sort((a, b) => (b.points! - a.points!));
        const rankedSlugs = regionalTeams.map(team => team.slug);
        const rank = rankedSlugs.indexOf(slug);
        return rank !== -1 ? rank + 1 : null;
    };

    const handleNavigation = (href: string) => {
        router.push(href);
    };

    return (
        <div className="flex flex-col w-full h-full fadeIn gap-2">
            <div className='flex transition border-default-400 border-b-1'>
                <span className='text-lg font-bold text-default-950'>Times</span>
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
                    <FilterTag items={regionGroup.find(r => r.region_code === regionCode)?.title ?? ''} />
                    <FilterTag
                        items={countrySelect.map((c) => (
                            <>
                                <Flag code={c} className="h-[14px] w-[28px]" />
                                <span className="text-default-900 text-[10px]">{c}</span>
                            </>
                        ))}
                    />
                </div>

                <div className="w-full overflow-x-auto overflow-y-hidden rounded min-h-[40px]">
                    <div className="flex w-max py-1 px-2 rounded gap-2 bg-default-200 text-default-700">
                        {regionGroup.map(g => (
                            <Button
                                key={g.title}
                                onClick={() => setRegionCode(g.region_code)}
                                padding='px-[6px] py-0'
                                typeButton={g.region_code == regionCode ? 'primary' : 'default'}
                            >
                                <div className='flex gap-2 items-center'>
                                <span className='text-sm'>{g.title}</span>
                                </div>
                            </Button>
                        ))}
                    </div>
                </div>

                {currentTeams.length ? <div className='flex flex-col gap-2 p-2 bg-default-200 rounded'>
                    <div className='overflow-x-auto fadeIn bg-default-50 rounded w-full'>
                        <div className='min-w-max'>
                            <div className='flex text-xs font-bold bg-default-100 text-default-800 items-center border-b border-default-200 select-none'>
                                <span className={`flex w-full pl-3 py-2 min-w-[200px] ${isMobile ? 'max-w-[200px]' : 'max-w-[30%]'}`}>Time</span>
                                <Ripple onClick={()=>selectStat('points')} className={`flex min-h-[48px] fadeIn py-2 w-full text-center items-center justify-center min-w-[88px] cursor-pointer ${sortedBy=='points' && 'text-default-1000'}`}>
                                    <span className='flex'>Pontuação</span>
                                    <Icon name="material-symbols:keyboard-arrow-down-rounded" className={`text-[14px] transition ${(!desc && sortedBy=='points') && 'rotate-180'}`}/>
                                </Ripple>
                                <span className={`flex min-h-[48px] fadeIn py-2 w-full text-center items-center justify-center min-w-[88px]`}>Valve rank</span>
                                {regionCode != 'all' && <span className={`flex min-h-[48px] fadeIn py-2 w-full text-center items-center justify-center min-w-[88px]`}>{regionCode} rank</span>}
                            </div>
                            {currentTeams.map((team, i) => (
                                <div key={`${i}${team.slug}`} onClick={()=>setTeamHover(team.slug)} className={`text-sm flex justify-between w-full text-default-950 hover:bg-glass-primary transition ${team.slug==teamHover && 'bg-glass-primary'} ${i ? 'short-top-border' : ''}`}>
                                    <div className={`flex cursor-pointer items-center gap-3 py-[6px] transition w-full pl-3 hover:text-primary-600 min-w-[200px] ${isMobile ? 'max-w-[200px]' : 'max-w-[30%]'}`}
                                        onClick={()=>handleNavigation(`/team/${team.slug}`)}
                                    >
                                        <div className='relative'>
                                            <div className='flex h-[35px] w-[35px] items-center'>
                                                <TeamImage slug={team.slug} extension={team.img_extension} className='h-[27px] min-w-[27px] text-default-950' />
                                            </div>
                                            <Flag code={team.country_code}
                                                style={{
                                                    width: '14px',
                                                    position: 'absolute',
                                                    bottom: '-2px',
                                                    right: '-4px',
                                                    borderRadius: '2px',
                                                    filter: 'drop-shadow(var(--default-700) 1px 0px 0px) drop-shadow(var(--default-700) 0px 1px 0px) drop-shadow(var(--default-700) -1px 0px 0px) drop-shadow(var(--default-700) 0px -1px 0px)',
                                                }} 
                                            />
                                        </div>
                                        <div className='flex items-center h-full w-full gap-2'>
                                            <span className='flex font-bold whitespace-nowrap'>{team.team_name}</span>  
                                            <span className='flex text-[10px] text-default-800 whitespace-nowrap'>{team.region_code}</span>                             
                                        </div>
                                    </div>
                                    <span className="flex fadeIn font-semibold text-[12px] w-full items-center justify-center min-w-[88px]">{team.points}</span>
                                    <span className="flex fadeIn font-semibold text-[12px] w-full items-center justify-center min-w-[88px]">{team.rank}</span>
                                    {regionCode != 'all' && <span className="flex fadeIn font-semibold text-[12px] w-full items-center justify-center min-w-[88px]">{getRegionRank(team.slug, team.region_code)}</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page:number) => setCurrentPage(page)}
                    />
                </div> : 
                <div className='flex fadeIn items-center justify-center fadeIn text-default-800 bg-default-200 rounded h-[100px] gap-3'>
                    <Icon name='cuida:alert-outline' className='text-3xl'/>
                    <span>Nenhum time encontrado</span>
                </div>}    
            </div>
            <span className='flex transition text-default-800 text-sm'>Tabela de times classificados pelo rank da Valve.</span>
            <Modal isOpen={isModalFilterOpen} setIsOpen={setIsModalFilterOpen} title='Filtros' icon='mdi:filter-cog-outline'>
                <div className='flex flex-col gap-2'>
                    <div className='flex text-sm gap-1 flex-col'>
                        <span className=''>Países</span>
                        <SearchSelect
                            value={countrySelect}
                            setValue={setCountrySelect}
                            options={countries}
                            placeholder="Selecione países"
                            maxSelect={20}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}
