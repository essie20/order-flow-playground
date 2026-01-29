import { useState, useRef } from 'react';

interface LiveRegionProps {
    message: string;
    priority?: 'polite' | 'assertive';
}

/**
 * A component that announces messages to screen readers using aria-live regions.
 * Messages are ephemeral and automatically cleared after announcement.
 */
export const LiveRegion = ({ message, priority = 'polite' }: LiveRegionProps) => {
    return (
        <div
            role="status"
            aria-live={priority}
            aria-atomic="true"
            className="sr-only"
        >
            {message}
        </div>
    );
};

/**
 * Hook to manage announcements to screen readers
 */
export const useAnnouncer = () => {
    const [announcement, setAnnouncement] = useState('');
    const timeoutRef = useRef<number | undefined>(undefined);

    const announce = (message: string, duration = 3000) => {
        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setAnnouncement(message);

        // Auto-clear after duration
        timeoutRef.current = setTimeout(() => {
            setAnnouncement('');
        }, duration) as unknown as number;
    };

    return { announcement, announce };
};
