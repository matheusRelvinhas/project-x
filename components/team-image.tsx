import { useState } from 'react';
import { Icon } from '@iconify/react';

type TeamImageProps = {
    slug: string | null;
    className?: string;
};

const TeamImage = ({ slug = 'Team', className = '' }: TeamImageProps) => {
    const [step, setStep] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    const urls = [
        `/img/imgs/teams/${slug}.webp`,
        `/img/imgs/teams/${slug}.png`
    ];

    if (!slug || step >= urls.length) {
        return (
            <div className={`rounded-4xl ${className}`}>
                <Icon icon="solar:shield-minus-bold" className={className} />
            </div>
        );
    }

    const imageUrl = urls[step];

    return (
        <div
            className={`flex items-center ${className}`}
            style={{
                filter:
                    'drop-shadow(var(--default-700) 1px 0px 0px) drop-shadow(var(--default-700) 0px 1px 0px) drop-shadow(var(--default-700) -1px 0px 0px) drop-shadow(var(--default-700) 0px -1px 0px)',
            }}
        >
            {!isLoaded ? null : (
                <img
                    src={imageUrl}
                    alt={slug || 'team_image'}
                    className={`${className} fadeIn`}
                    onError={() => setStep(prev => prev + 1)}
                    onLoad={() => setIsLoaded(true)}
                    loading="lazy"
                />
            )}
            {/* preload invisível */}
            <img
                src={imageUrl}
                alt=""
                className="hidden"
                onError={() => setStep(prev => prev + 1)}
                onLoad={() => setIsLoaded(true)}
            />
        </div>
    );
};

export default TeamImage;
