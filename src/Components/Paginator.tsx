import React from 'react';

interface PaginatorProps {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    numberOfPages: number;
}

const Paginator: React.FC<PaginatorProps> = ({ page, setPage, numberOfPages }) => {
    
    const totalPages = Math.max(1, numberOfPages || 1);

    const handlePrevious = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNext = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const handlePageClick = (p: number) => {
        setPage(p);
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const siblings = 1; 

        // Always add first page
        pages.push(1);

        if (page > siblings + 2) {
            pages.push('start-ellipsis');
        }

        let start = Math.max(2, page - siblings);
        let end = Math.min(totalPages - 1, page + siblings);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (page < totalPages - siblings - 1) {
            pages.push('end-ellipsis');
        }

        // Always add last page if there is more than one page
        if (totalPages > 1) {
            pages.push(totalPages);
        }
        
        return pages;
    };

    // If total pages are small, just show all of them
    const renderPages = () => {
        if (totalPages <= 7) {
            const pages = [];
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
            return pages.map((p) => renderPageButton(p));
        }
        return getPageNumbers().map((p, index) => renderPageButton(p, index));
    };

    const renderPageButton = (p: number | string, index?: number) => {
        if (p === 'start-ellipsis' || p === 'end-ellipsis') {
            return (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-400 select-none">
                    …
                </span>
            );
        }

        const isCurrent = p === page;
        
        return (
            <button
                key={p}
                onClick={() => handlePageClick(p as number)}
                className={`
                    flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors
                    ${isCurrent 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-gray-700 hover:bg-black/5 dark:hover:bg-white/10'
                    }
                `}
            >
                {p}
            </button>
        );
    };

    return (
        <div className="flex items-center justify-center mt-6 space-x-1">
            <button
                onClick={handlePrevious}
                disabled={page === 1}
                className={`p-2 rounded-full text-gray-500 hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed`}
            >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {renderPages()}

            <button
                onClick={handleNext}
                disabled={page === totalPages}
                className={`p-2 rounded-full text-gray-500 hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed`}
            >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
};

export default Paginator;
