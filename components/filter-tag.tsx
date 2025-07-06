import React, { JSX } from "react";

type FilterTagProps = {
	items: string | JSX.Element | (string | JSX.Element)[];
    showNum?: number;
    className?: string;
};

export const FilterTag: React.FC<FilterTagProps> = ({ items, showNum=2, className='border-1 border-primary-600 bg-default-100' }) => {
	const isArray = Array.isArray(items);
	const itemArray: (string | JSX.Element)[] = isArray
		? (items as (string | JSX.Element)[])
		: [items];

    const hasValidContent = itemArray.length > 0 && itemArray.some((item) =>
        typeof item === "string" ? item.trim().length > 0 : true
    );

    if (!hasValidContent) return null;

	return (
		<div className={`flex fadeIn items-center gap-1 px-3 py-1 rounded-3xl ${className}`}>
            {itemArray.slice(0, showNum).map((item, index) => (
                <div key={index} className="flex items-center text-[12px] gap-1 text-center">
                    {typeof item === "string" ? (
                        <span className="text-default-900">{item}</span>
                    ) : (
                        item
                    )}
                    {(index+1 < itemArray.length) && index < (showNum-1) && (
                        <span className="text-default-900">,</span>

                    )}
                </div>
            ))}
			{itemArray.length > showNum && (
				<span className="text-[10px] text-default-900">
					+{itemArray.length - showNum}
				</span>
			)}
		</div>
	);
};
