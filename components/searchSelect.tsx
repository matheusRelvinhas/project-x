import React, { useState, useEffect, JSX, useRef } from "react";
import { useAppContext } from "@/context/context";
import Icon from "@/components/icon";
import Fuse from "fuse.js";
import Input from "./input";
import Ripple from 'react-ripplejs';

interface Option {
	title: string | JSX.Element;
	name: string | JSX.Element;
	value: string;
}

interface SearchSelectProps {
	value: string[];
	setValue: (value: string[]) => void;
	options: Option[];
	placeholder?: string;
	size?: "md" | "lg" | "sm";
	border?: boolean;
	rounded?: boolean;
	maxSelect?: number;
}

const SearchSelect: React.FC<SearchSelectProps> = ({
	value,
	setValue,
	options,
	placeholder = "Selecione",
	size = "md",
	border = true,
	rounded = true,
	maxSelect = 1,
}) => {
	const { isMobile } = useAppContext();
	const [query, setQuery] = useState("");
	const [open, setOpen] = useState(false);
	const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
	const [openUpward, setOpenUpward] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const validValues = value.filter((val) => options.some((opt) => opt.value === val));
        if (validValues.length !== value.length) {
            setValue(validValues);
        };
    }, [options]);

	useEffect(() => {
		if (query.trim() === "") {
			setFilteredOptions(options);
			return;
		}
		const fuse = new Fuse(options, {
			keys: ["name"],
			threshold: 0.4,
			includeScore: false,
		});
		const results = fuse.search(query).map((res) => res.item);
		setFilteredOptions(results);
	}, [query, options]);

	const toggleSelect = (val: string) => {
		if (value.includes(val)) {
			setValue(value.filter((v) => v !== val));
		} else {
			if (value.length < maxSelect) {
				setValue([...value, val]);
			}
		}
	};

	const handleClickOutside = (e: MouseEvent) => {
		if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
			setOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		if (!buttonRef.current || !open) return;
		const rect = buttonRef.current.getBoundingClientRect();
		const spaceBelow = window.innerHeight - rect.bottom;
		const spaceAbove = rect.top;
		setOpenUpward(spaceBelow < 200 && spaceAbove > spaceBelow);
	}, [open]);

	const sizeClass =
		size === "md" ? `w-[240px] ${isMobile}` :
		size === "sm" ? "w-[72px]" :
		size === "lg" ? "w-full" : "";

	const borderClass = border ? "border-1" : "";
	const roundedClass = rounded ? "rounded-lg" : "";
	const defaultClass =
		"relative min-h-[38px] flex items-center justify-between transition bg-default-100 border border-default-400 hover:bg-default-200 hover:border-primary-600";

    const inputSS = (
        <div className="p-2 border-b border-default-300">
            <Input size="lg" value={query} onValueChange={setQuery} placeholder="Buscar" />
        </div>
    );

	return (
		<div ref={containerRef} className="relative flex items-center gap-2">
            <div
                ref={buttonRef}
                className={`${defaultClass} ${borderClass} ${roundedClass} ${sizeClass} px-2 py-1 cursor-pointer ${open ? "border-primary-600" : ""}`}
                onClick={() => setOpen((prev) => !prev)}
            >
                <span className={`truncate transition text-sm ${value.length ? 'text-default-950' : 'text-default-600'}`}>
                    {value.length
                        ? options
                                .filter((opt) => value.includes(opt.value))
                                .map((opt) => opt.name)
                                .join(", ")
                        : placeholder}
                </span>
                <Icon
                    name="solar:alt-arrow-up-linear"
                    className={`text-lg text-default-600 transition ${open ? "rotate-select-180" : ""}`}
                />
            </div>
            
            {value.length ? <Ripple onClick={() => setValue([])} className="border-1 cursor-pointer fadeIn flex items-center justify-center border-default-400 rounded-4xl p-[3px] transition text-danger hover:text-default-50 hover:bg-danger hover:border-danger">
                <Icon name='material-symbols:close-rounded' />
            </Ripple> : null}

            {open && (
                <div
                    className={`absolute z-10 w-full bg-default-100 border border-default-300 ${roundedClass} shadow-md ${
                    openUpward ? "bottom-full mb-2" : "top-full mt-2"
                    }`}
                >
                    {!openUpward && inputSS}
                    <ul className="max-h-60 overflow-y-auto">
						{filteredOptions.map((option) => ( option.value &&
							<li
								key={option.value}
								className={`px-3 py-2 text-sm cursor-pointer ${
									value.includes(option.value)
										? "text-primary-800 bg-default-200"
										: "hover:bg-default-200 text-default-950"
								}`}
								onMouseDown={() => toggleSelect(option.value)}
							>
								{option.title}
							</li>
						))}
					</ul>
                    {openUpward && inputSS}
				</div>
			)}
		</div>
	);
};

export default SearchSelect;
