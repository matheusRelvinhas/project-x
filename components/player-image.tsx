import { useState } from 'react';
import { Icon } from '@iconify/react';

type PlayerImageProps = {
    slug: string | null;
    period?: string | null;
    className?: string;
};

const PlayerImage = ({ slug = 'Player', period, className = '' }: PlayerImageProps) => {
    const [hasError, setHasError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const imageUrl = `http://localhost:3001/api/player_stats/player_image?slug=${slug}${period ? `&period=${period}` : ''}`;

    if (!imageUrl || hasError) {
        return (
            <div
                className={`rounded-4xl p-[3px] ${className}`}
                style={{
                    filter:
                        'drop-shadow(var(--default-700) 1px 0px 0px) drop-shadow(var(--default-700) 0px 1px 0px) drop-shadow(var(--default-700) -1px 0px 0px) drop-shadow(var(--default-700) 0px -1px 0px)',
                }}
            >
                <Icon icon="heroicons:user-solid" className={className} />
            </div>
        );
    }

    return (
        <div
            className={`flex items-center p-[3px] ${className}`}
            style={{
                filter:
                    'drop-shadow(var(--default-700) 1px 0px 0px) drop-shadow(var(--default-700) 0px 1px 0px) drop-shadow(var(--default-700) -1px 0px 0px) drop-shadow(var(--default-700) 0px -1px 0px)',
            }}
        >
            {!isLoaded ? null : (
                <img
                    src={imageUrl}
                    alt={slug || 'player_image'}
                    className={`${className} fadeIn`}
                    onError={() => setHasError(true)}
                    onLoad={() => setIsLoaded(true)}
                    loading="lazy"
                />
            )}
            <img
                src={imageUrl}
                alt=""
                className="hidden"
                onError={() => setHasError(true)}
                onLoad={() => setIsLoaded(true)}
            />
        </div>
    );
};

export default PlayerImage;
