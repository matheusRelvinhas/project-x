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
				className={`rounded-4xl p-[3px] ${className}`}
				style={{
					filter:
						"drop-shadow(var(--default-700) 1px 0px 0px) drop-shadow(var(--default-700) 0px 1px 0px) drop-shadow(var(--default-700) -1px 0px 0px) drop-shadow(var(--default-700) 0px -1px 0px)",
				}}
			>
				<Icon icon="heroicons:user-solid" className={className} />
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
