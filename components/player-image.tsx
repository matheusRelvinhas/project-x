import { useState } from "react";
import { Icon } from "@iconify/react";

type PlayerImageProps = {
	slug: string | null;
	className?: string;
	extension?: string | null;
};

const PlayerImage = ({
	slug = "Player",
	className = "",
	extension = null,
}: PlayerImageProps) => {
	const [hasError, setHasError] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);

	if (!slug || !extension || hasError) {
		return (
			<div
				className={`rounded-4xl p-[3px] ${className}`}
				style={{
					filter: "drop-shadow(var(--default-700) 1px 0px 0px) drop-shadow(var(--default-700) 0px 1px 0px) drop-shadow(var(--default-700) -1px 0px 0px) drop-shadow(var(--default-700) 0px -1px 0px)",
				}}
			>
				<Icon icon="heroicons:user-solid" className={className} />
			</div>
		);
	}

	const imageUrl = `/img/imgs/players/${slug}.${extension}`;

	return (
		<div
			className={`flex items-center p-[3px] ${className}`}
			style={{
				filter: "drop-shadow(var(--default-700) 1px 0px 0px) drop-shadow(var(--default-700) 0px 1px 0px) drop-shadow(var(--default-700) -1px 0px 0px) drop-shadow(var(--default-700) 0px -1px 0px)",
			}}
		>
			{isLoaded && (
				<img
					src={imageUrl}
					alt={slug || "player_image"}
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
