import { useState } from "react";
import { Icon } from "@iconify/react";

type TeamImageProps = {
	slug: string | null;
	className?: string;
	extension?: string | null;
};

const TeamImage = ({
	slug = "Team",
	className = "",
	extension = null,
}: TeamImageProps) => {
	const [hasError, setHasError] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);

	if (!slug || !extension || hasError) {
		return (
			<div className={`rounded-4xl ${className}`}>
				<Icon icon="solar:shield-minus-bold" className={className} />
			</div>
		);
	}

	const imageUrl = `/img/imgs/teams/${slug}.${extension}`;

	return (
		<div
			className={`flex items-center ${className}`}
			style={{
				filter: "drop-shadow(var(--default-700) 1px 0px 0px) drop-shadow(var(--default-700) 0px 1px 0px) drop-shadow(var(--default-700) -1px 0px 0px) drop-shadow(var(--default-700) 0px -1px 0px)",
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
