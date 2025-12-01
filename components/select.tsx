import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/context/context";
import Icon from "@/components/icon";

interface Option {
	title: string;
	value: string;
}

interface SelectProps {
	border?: boolean;
	rounded?: boolean;
	size?: "md" | "lg" | "sm";
	value: any;
	setValue: (value: any) => void;
	options: Option[];
	disabledDefault?: boolean;
	placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
	border = true,
	rounded = true,
	size = "md",
	value,
	setValue,
	options = [],
	disabledDefault = true,
	placeholder = "Selecione",
}) => {
	const { isMobile } = useAppContext();
	const [isOpen, setIsOpen] = useState(false);
	const [openUpward, setOpenUpward] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLDivElement>(null);

	const borderClass = border ? "border" : "";
	const roundedClass = rounded ? "rounded-lg" : "";
	const sizeClass =
		size === "md"
			? `w-[240px] ${isMobile}`
			: size === "sm"
			? "w-[72px]"
			: size === "lg"
			? "w-full"
			: "";

	const toggleDropdown = () => setIsOpen((prev) => !prev);

	const handleClickOutside = (e: MouseEvent) => {
		if (
			containerRef.current &&
			!containerRef.current.contains(e.target as Node)
		) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		if (!buttonRef.current || !isOpen) return;
		const rect = buttonRef.current.getBoundingClientRect();
		const spaceBelow = window.innerHeight - rect.bottom;
		const spaceAbove = rect.top;
		setOpenUpward(spaceBelow < 200 && spaceAbove > spaceBelow);
	}, [isOpen]);

	const selectedOption = options.find((o) => o.value === value);

	return (
		<div ref={containerRef} className={`relative ${sizeClass}`}>
			<div
				ref={buttonRef}
				onClick={toggleDropdown}
				className={`p-2 min-h-[38x] flex items-center justify-between cursor-pointer transition ${borderClass} ${roundedClass} ${
					value ? "text-default-950" : "text-default-500"
				} bg-default-100 hover:bg-default-200 border-default-400 hover:border-primary-600 ${
					isOpen ? "border-primary-600" : ""
				}`}
			>
				<span>
					{selectedOption?.title ||
						(!disabledDefault ? placeholder : "")}
				</span>
				<Icon
					name="solar:alt-arrow-up-linear"
					className={`text-lg transition ${
						isOpen ? "rotate-select-180" : ""
					} text-default-600`}
				/>
			</div>

			{isOpen && (
				<ul
					className={`absolute z-50 bg-default-100 shadow-md border border-default-300 mt-1 max-h-60 overflow-auto ${
						rounded ? "rounded-lg" : ""
					} ${
						openUpward ? "bottom-full mb-2" : "top-full mt-2"
					} w-full`}
				>
					{!disabledDefault && (
						<li
							onClick={() => {
								setValue("");
								setIsOpen(false);
							}}
							className="px-3 py-2 text-default-600 hover:bg-default-200 cursor-pointer"
						>
							{placeholder}
						</li>
					)}
					{options.map((option) => (
						<li
							key={option.value}
							onClick={() => {
								setValue(option.value);
								setIsOpen(false);
							}}
							className={`px-3 py-2 hover:bg-default-200 cursor-pointer ${
								value === option.value
									? "bg-default-200 text-primary-700"
									: ""
							}`}
						>
							{option.title}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Select;
