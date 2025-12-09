import { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

type LeagueImageProps = {
	slug: string | null;
	className?: string;
	img_url?: string | null;
};

const LeagueImage = ({
	slug = "League",
	className = "",
	img_url = null,
}: LeagueImageProps) => {
	const [hasError, setHasError] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);

	if (!img_url || hasError) {
		return (
			<div className={`rounded-4xl p-[3px] ${className}`}>
				<Icon icon="solar:shield-minus-bold" className={className} />
			</div>
		);
	}

	const imageUrl = `/img/imgs/leagues/${img_url}`;

	return (
		<div
			className={`flex items-center p-[3px] ${className}`}
			style={{
				filter:
					"drop-shadow(var(--logo-border) 1px 0px 0px) drop-shadow(var(--logo-border) 0px 1px 0px) drop-shadow(var(--logo-border) -1px 0px 0px) drop-shadow(var(--logo-border) 0px -1px 0px)",
			}}
		>
			<Image
				src={imageUrl}
				alt={slug || "league_image"}
				width={100}
				height={100}
				className={`${className} fadeIn ${isLoaded ? "opacity-100" : "opacity-0"}`}
				onLoad={() => setIsLoaded(true)}
				onError={() => setHasError(true)}
			/>
		</div>
	);
};

export default LeagueImage;
