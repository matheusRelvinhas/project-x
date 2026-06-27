import React, { useMemo } from 'react';
import { useAppContext } from '@/context/context';
import { type GameStats } from "@/app/games/games-page";
import TeamImage from './team-image';
import Icon from './icon';

export interface GameSideStats {
    order: number;
    overtime: boolean;
    loser_clan_name: string;
    loser_clan_side: 'CT' | 'T';
    loser_clan_slug: string;
    loser_clan_score: number;
    winner_clan_name: string;
    winner_clan_side: 'CT'|'T';
    winner_clan_slug: string;
    winner_clan_score: number;
};

export interface GameRoundStats {
    end_reason: string;
    round_number: number;
    loser_clan_name: string;
    loser_clan_side: 'CT' | 'T';
    loser_clan_slug: string;
    loser_clan_score: number;
    winner_clan_name: string;
    winner_clan_side: 'CT' | 'T';
    winner_clan_slug: string;
    winner_clan_score: number;
};

export interface GameSideInfo {
    order: number;
    status: 'finished'|'upcoming';
    map_name: string;
    game_side: GameSideStats[];
    loser_slug: string;
    loser_score: number;
    winner_slug: string;
    winner_score: number;
    rounds_count: number;
    game_rounds: GameRoundStats[];
};

interface GameSideProps {
    gamesSide: GameSideInfo[];
    filterMap: string|null;
    gameInfo: GameStats|null;
};

export const GameSide: React.FC<GameSideProps> = ({ gamesSide, filterMap, gameInfo }) => {
    const { isMobile } = useAppContext();

    const filteredGamesSide = useMemo(() => {
        return filterMap ? gamesSide?.filter(g => g.map_name === filterMap) : gamesSide;
    }, [gamesSide, filterMap]);

    const iconRound = (endReason: string) => {
        if ('CTWin'===endReason) return 'raphael:skull';
        if ('TerroristsWin'===endReason) return 'raphael:skull';
        if ('TargetBombed'===endReason) return 'game-icons:mine-explosion';
        if ('BombDefused'===endReason) return 'mdi:pliers';
        if ('TargetSaved'===endReason) return 'boxicons:clock-8';
        return endReason;
    };

    return (
        <div className={`flex w-full max-w-5xl`}>
            {filteredGamesSide?.map((gameSide, i) => {
                let roundPointer = 0;
                return (
                    <div key={`game-side-${i}-${gameSide.map_name}`} className="flex w-full flex-wrap gap-2 fadeIn">
                        {gameSide.game_side.map((side, sideIndex) => {
                            const totalRounds = side.winner_clan_score + side.loser_clan_score;
                            const rounds = gameSide.game_rounds.slice(roundPointer, roundPointer + totalRounds);
                            roundPointer += totalRounds;
                            const ctTeam = side.winner_clan_side === "CT" ? side.winner_clan_slug : side.loser_clan_slug;
                            const tTeam = side.winner_clan_side === "T" ? side.winner_clan_slug : side.loser_clan_slug;
                                return (gameInfo && (
                                    <div key={`side-${sideIndex}`} className='flex relative w-fit bg-default-50 rounded-md items-center overflow-x-auto'>
                                       
                                        <span className={`absolute text-center flex w-full px-2 text-[8px] font-black text-primary-600`}>
                                            {side.overtime ? 'OT' : ''}
                                        </span>
                                       
                                        <div className='flex flex-col gap-2 py-2 border-1 border-default-50'>
                                            {(gameInfo.team1_slug && gameInfo.team2_slug) && (
                                                <>
                                                    <div className='flex gap-2 items-center justify-center px-2'>
                                                        <TeamImage slug={gameInfo.team1_slug} img_url={gameInfo.team1_img_url} className='h-[18px] w-[18px] w-[18px] min-w-[18px] max-w-[18px]' />
                                                        <span className={`text-[8px] text-default-100 font-bold flex items-center justify-center rounded h-[14px] w-[14px] ${gameInfo.team1_slug == ctTeam ? 'bg-ct' : gameInfo.team1_slug == tTeam ? 'bg-tr' : ''}`}>
                                                            {gameInfo.team1_slug == ctTeam ? 'CT' : gameInfo.team1_slug == tTeam ? 'TR' : ''}
                                                        </span>
                                                    </div>
                                                    <div className='border-b-2 border-default-100'/>
                                                    <div className='flex gap-2 items-center justify-center px-2'>
                                                    <TeamImage slug={gameInfo.team2_slug} img_url={gameInfo.team2_img_url} className='h-[18px] w-[18px] w-[18px] min-w-[18px] max-w-[18px]' />
                                                        <span className={`text-[8px] text-default-100 font-bold flex items-center justify-center rounded h-[14px] w-[14px] ${gameInfo.team2_slug == ctTeam ? 'bg-ct' : gameInfo.team2_slug == tTeam ? 'bg-tr' : ''}`}>
                                                            {gameInfo.team2_slug == ctTeam ? 'CT' : gameInfo.team2_slug == tTeam ? 'TR' : ''}
                                                        </span>
                                                    </div>     
                                                </>
                                            )}
                                        </div>
                                        {rounds.map(round => {
                                            const isTeam1Winner = round.winner_clan_slug === gameInfo?.team1_slug;
                                            return (
                                                <div key={`round-${round.round_number}-${sideIndex}`} className={`flex flex-col fadeIn w-full rounded transition flex-nowrap h-full border-1 border-default-50 hover:border-primary-600 ${isMobile ? 'min-w-[20px]' : 'min-w-[30px]'}`}>   
                                                    <div className='flex h-[100%] items-center justify-center'>
                                                        {isTeam1Winner ? <Icon className={`fadeIn ${gameInfo.team1_slug == ctTeam ? 'text-ct' : gameInfo.team1_slug == tTeam ? 'text-tr' : ''}`} name={iconRound(round.end_reason)} /> : ''}
                                                    </div>
                                                    <div className='flex w-full items-center justify-center h-[10px]'>
                                                        <div className='border-b-2 border-default-100 w-full'/>
                                                        <span className='px-1 text-primary-600 font-black text-[8px]'>{round.round_number}</span>
                                                        <div className='border-b-2 border-default-100 w-full'/>
                                                    </div>
                                                    <div className='flex h-[100%] items-center justify-center'>
                                                        {!isTeam1Winner ? (<Icon className={`fadeIn ${gameInfo.team2_slug == ctTeam ? 'text-ct' : gameInfo.team2_slug == tTeam ? 'text-tr' : ''}`} name={iconRound(round.end_reason)} />) : ''}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        <div className='flex flex-col gap-2 py-2 border-1 border-default-50 w-[36px]'>
                                            <div className='text-center text-xs px-[2px]'>
                                                {gameInfo.team1_slug == side.winner_clan_slug ? 
                                                    <span className='text-success'>{side.winner_clan_score}</span> : 
                                                gameInfo.team1_slug == side.loser_clan_slug ? 
                                                    <span className='text-danger'>{side.loser_clan_score}</span> : ''}
                                            </div>
                                            <div className='border-b-2 border-default-100'/>
                                            <div className='text-center text-xs px-[2px]'>
                                                {gameInfo.team2_slug == side.winner_clan_slug ? 
                                                    <span className='text-success px-2'>{side.winner_clan_score}</span> : 
                                                gameInfo.team2_slug == side.loser_clan_slug ? 
                                                    <span className='text-danger px-2'>{side.loser_clan_score}</span> : ''}
                                            </div>
                                        </div>
                                    </div>
                                )
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default GameSide;
