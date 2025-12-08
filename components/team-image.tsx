import { useState } from "react";
import { Icon } from "@iconify/react";

type TeamImageProps = {
	slug: string | null;
	className?: string;
	img_url?: string | null;
};

const TeamImage = ({
	slug = "Team",
	className = "",
    img_url = null
}: TeamImageProps) => {
	const [hasError, setHasError] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);

	if (!img_url || hasError) {
		return (
			<div className={`rounded-4xl ${className}`}>
				<Icon icon="solar:shield-minus-bold" className={className} />
			</div>
		);
	}

	const imageUrl = `/img/imgs/teams/${img_url}`;

	return (
		<div
			className={`flex items-center ${className}`}
			style={{
				filter: "drop-shadow(var(--logo-border) 1px 0px 0px) drop-shadow(var(--logo-border) 0px 1px 0px) drop-shadow(var(--logo-border) -1px 0px 0px) drop-shadow(var(--logo-border) 0px -1px 0px)",
			}}
		>
			{isLoaded && (
				<img
					src={imageUrl}
					alt={slug || "team_image"}
					className={`${className} fadeIn`}
					onError={() => setHasError(true)}
					onLoad={() => setIsLoaded(true)}
					loading="lazy"
				/>
			)}
			{/* Preload invisível */}
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

export default TeamImage;
