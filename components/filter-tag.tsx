import React, { JSX } from "react";

type FilterTagProps = {
	items: string | JSX.Element | (string | JSX.Element)[];
};

export const FilterTag: React.FC<FilterTagProps> = ({ items }) => {
	const isArray = Array.isArray(items);
	const itemArray: (string | JSX.Element)[] = isArray
		? (items as (string | JSX.Element)[])
		: [items];

    const hasValidContent = itemArray.length > 0 && itemArray.some((item) =>
        typeof item === "string" ? item.trim().length > 0 : true
    );

    if (!hasValidContent) return null;

	return (
		<div className="flex fadeIn items-center gap-1 border-1 border-primary-600 bg-default-200 px-3 py-1 rounded-3xl">
            {itemArray.slice(0, 2).map((item, index) => (
                <div key={index} className="flex items-center text-[12px] gap-1 text-center">
                    {typeof item === "string" ? (
                        <span className="text-default-900">{item}</span>
                    ) : (
                        item
                    )}
                    {itemArray.length > 1 && index < 1 && (
                        <span className="text-default-900">,</span>
                    )}
                </div>
            ))}
			{itemArray.length > 2 && (
				<span className="text-[10px] text-default-900">
					+{itemArray.length - 2}
				</span>
			)}
		</div>
	);
};
