import React from 'react';
import { useAppContext } from '@/context/context';
import { mapsName } from '@/utils/utils';
import type { GameScore, GameStats } from '@/app/games/games-page';
import Button from './button';
import { useRouter } from 'next/navigation';

interface GameMapsScoreProps {
    gamesScore: GameScore[];
    game: GameStats;
    size?: 'md' | 'lg';
    selectedMap?: string|null;
    setSelectMap?: (mapName: string | null) => void;
    navigateToMap?: boolean;
};

export const GameMapsScore: React.FC<GameMapsScoreProps> = ({ gamesScore, game, size='md', selectedMap, setSelectMap, navigateToMap=false }) => {
    const { theme, isMobile } = useAppContext();
    const sortedGames = [...gamesScore].sort((a, b) => a.order - b.order);

    const router = useRouter();
    const handleNavigation = (href: string) => {
        router.push(href);
    };

    const handleSelectMap = (mapName: string) => {
        if (setSelectMap) setSelectMap(mapName);
        if (navigateToMap) handleNavigation(`/game/${game.slug}?map=${mapName}`);
    };

    return (
        <div className={`flex h-full items-center justify-center flex-wrap ${size=='md' || isMobile ? 'gap-1' : 'gap-2'}`}>
            {sortedGames.map((g, i) => g.map_name && (
                <Button
                    className={`relative transition flex flex-col pb-2 justify-between gap-1 rounded cursor-pointer overflow-hidden border-1 border-default-200 hover:border-primary-600 w-fit ${selectedMap === g.map_name ? 'border-primary-600' : ''} ${size=='md' || isMobile ? 'h-[48px] min-w-[64px]' : 'h-[60px] min-w-[80px]'}`}
                    key={game.id + i + g.map_name}
                    padding='p-0'
                    onClick={() => handleSelectMap(g.map_name)}
                >
                    <div
                        className={`absolute inset-0 bg-cover bg-center blur-[1px] ${theme=='light' ? 'opacity-60 brightness-80' : 'opacity-40 brightness-120' }`}
                        style={{ backgroundImage: `url(/img/maps/${g.map_name}.webp)` }}
                    />
                    <span className={`bg-primary-600 z-0 text-default-100 font-semibold px-2 flex text-center items-center justify-center ${size=='md' || isMobile ? 'text-[10px] h-[16px]' : 'text-xs h-[18px]'}`}>
                        {mapsName.find(m => m.value === g.map_name)?.title || g.map_name}
                    </span>
                    <div className="z-0 flex gap-[1px] justify-center px-1">
                        <div className='flex w-full justify-center items-center gap-2'>
                            <span className={`flex bg-default-200 rounded font-semibold items-center px-1 py-[2px] justify-center ${size=='md' || isMobile ? 'w-[22px] text-xs' : 'w-[30px] h-[24px] text-sm'} ${g.winner_team == game.team1_slug ? 'text-success' : 'text-danger' }`}>
                                {g.winner_team == game.team1_slug ? g.winner_score : g.loser_score }
                            </span>
                        </div>
                        <div className='flex w-full justify-center items-center gap-2'>
                            <span className={`flex bg-default-200 rounded font-semibold items-center px-1 py-[2px] justify-center ${size=='md' || isMobile ? 'w-[22px] text-xs' : 'w-[30px] h-[24px] text-sm'} ${g.winner_team == game.team2_slug ? 'text-success' : 'text-danger' }`}>
                                {g.winner_team == game.team2_slug ? g.winner_score : g.loser_score }
                            </span>
                        </div>
                    </div>
                </Button>
                
            ))}
        </div>
    );
};

export default GameMapsScore;
