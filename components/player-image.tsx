import { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

type PlayerImageProps = {
	slug: string | null;
	className?: string;
	img_url?: string | null;
};

const PlayerImage = ({
	slug = "Player",
	className = "",
	img_url = null,
}: PlayerImageProps) => {
	const [hasError, setHasError] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);

	if (!img_url || hasError) {
		return (
			<div
				className={`rounded-4xl flex w-full items-center justify-center ${className}`}
			>
				<Icon icon="carbon:user-avatar-filled" className={`${className} text-default-400 text-4xl`} />
			</div>
		);
	}

	const imageUrl = `/img/imgs/players/${img_url}`;

	return (
		<div
			className={`relative bg-default-200 rounded-4xl shadow-sm overflow-hidden flex items-center p-[3px] w-full h-full`}
		>
			<Image
				src={imageUrl}
				alt={slug || "player_image"}
				width={100}
  				height={100}
				loading="lazy"
				quality={75}
				className={`${className} absolute scale-225 bottom-1 right-[-1px] top-[25px] fadeIn ${
					isLoaded ? "opacity-100" : "opacity-0"
				}`}
				onLoad={() => setIsLoaded(true)}
				onError={() => setHasError(true)}
			/>
		</div>
	);
};

export default PlayerImage;
