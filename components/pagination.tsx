import React from 'react';
import Ripple from 'react-ripplejs';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {

    const generatePageNumbers = () => {
        const pages: (number | string)[] = [];
        pages.push(1);
        const start = Math.max(currentPage - 1, 2);
        const end = Math.min(currentPage + 1, totalPages - 1);
        if (start > 2) pages.push('start-ellipsis');
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        if (end < totalPages - 1) pages.push('end-ellipsis');
        if (totalPages > 1) pages.push(totalPages);
        return pages;
    };

    const pageNumbers = generatePageNumbers();

    return (
        <div className="flex fadeIn justify-center gap-1 flex-wrap select-none">
            {pageNumbers.map((page) => {
                if (typeof page === 'string') {
                    return (
                        <span key={page} className="px-2 py-1 text-default-900">...</span>
                    );
                }

                return (
                    <Ripple
                        key={`page-${page}`}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1 rounded-4xl cursor-pointer ${page === currentPage
                            ? 'bg-primary-600 text-white font-semibold'
                            : 'bg-default-100 text-default-900 hover:bg-default-300 hover:text-default-950'
                            }`}
                    >
                        {page}
                    </Ripple>
                );
            })}
        </div>
    );
};

export default Pagination;
