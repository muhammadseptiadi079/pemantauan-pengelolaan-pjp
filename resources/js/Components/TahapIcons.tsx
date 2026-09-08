import { ReactElement } from 'react';

export const tahapIconPaths: Record<string, ReactElement> = {
    home: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12 11.204 3.045a1.125 1.125 0 0 1 1.591 0L21.75 12M4.5 9.75v9.75a.75.75 0 0 0 .75.75H9v-4.5a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5V20.25h3.75a.75.75 0 0 0 .75-.75V9.75"
        />
    ),
    persyaratan: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M9 4.5h6a1.5 1.5 0 0 1 1.5 1.5v13.5l-4.5-2.25L7.5 19.5V6A1.5 1.5 0 0 1 9 4.5Z"
        />
    ),
    tanggungjawab: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 8.25h16.5M3.75 8.25v10.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V8.25M3.75 8.25 5.4 4.9a1.5 1.5 0 0 1 1.34-.9h10.52a1.5 1.5 0 0 1 1.34.9l1.65 3.35M9 12h6"
        />
    ),
    evaluasi: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 19.5h16.5M6.75 19.5v-6M11.25 19.5V9M15.75 19.5v-9M20.25 19.5V5.25"
        />
    ),
    legalitas: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3.25 5.25 6v6.25c0 4.4 2.9 7.4 6.75 8.5 3.85-1.1 6.75-4.1 6.75-8.5V6L12 3.25Z"
        />
    ),
};

export function TahapIcon({
    name,
    className = 'h-5 w-5',
}: {
    name: string;
    className?: string;
}) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.75}
            stroke="currentColor"
            className={className}
        >
            {tahapIconPaths[name]}
        </svg>
    );
}
