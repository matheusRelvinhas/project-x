import { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

type TeamImageProps = {
	slug: string | null;
	className?: string;
	img_url?: string | null;
};

const TeamImage = ({
	slug = "team",
	className = "",
	img_url = null,
}: TeamImageProps) => {
	const [hasError, setHasError] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);

	if (!img_url || hasError) {
		return (
			<div className={`flex items-center justify-center ${className}`}>
				<Icon icon="solar:shield-minus-bold" className={className} />
			</div>
		);
	}

	const imageUrl = `/img/imgs/teams/${img_url}`;

	return (
		<div
			className={`relative flex items-center justify-center ${className}`}
			style={{
				filter:
					"drop-shadow(var(--logo-border) 1px 0px 0px) drop-shadow(var(--logo-border) 0px 1px 0px) drop-shadow(var(--logo-border) -1px 0px 0px) drop-shadow(var(--logo-border) 0px -1px 0px)",
			}}
		>
			<Image
				src={imageUrl}
				alt={slug ?? ''}
				fill
				sizes="(max-width: 100px) 100px, 50vw"
				className={`object-contain transition-opacity duration-300 ${
					isLoaded ? "opacity-100" : "opacity-0"
				}`}
				onLoad={() => setIsLoaded(true)}
				onError={() => setHasError(true)}
			/>
		</div>
	);
};

export default TeamImage;
