import { useState, useEffect, useRef, useCallback } from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

export const DebugPanel = () => {
    const { delayMs, failureRate, updateSettings, resetSettings } = useSimulation();
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const togglePanel = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    // Global keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger if user is typing in an input
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                return;
            }

            // D key to toggle debug panel
            if (e.key === 'd' || e.key === 'D') {
                e.preventDefault();
                togglePanel();
            }

            // ESC to close
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
                triggerRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, togglePanel]);

    // Focus management: focus first interactive element when opened
    useEffect(() => {
        if (isOpen && panelRef.current) {
            const firstInput = panelRef.current.querySelector<HTMLInputElement>('input[type="range"]');
            firstInput?.focus();
        }
    }, [isOpen]);

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
            {/* Panel Content */}
            {isOpen && (
                <Card
                    ref={panelRef}
                    variant="elevated"
                    role="dialog"
                    aria-label="Chaos Engineering Controls"
                    className="w-80 animate-slide-up glass border border-neutral-200"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-neutral-100">
                        <div>
                            <h3 className="font-semibold text-neutral-900 text-sm">Chaos Engineering</h3>
                            <p className="text-xs text-neutral-400">Simulate network issues</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition-colors"
                            aria-label="Close debug panel"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-4 space-y-5">
                        {/* Network Delay Slider */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-neutral-700">Network Delay</label>
                                <span className={cn(
                                    "text-xs font-mono px-2 py-0.5 rounded-md",
                                    delayMs > 1000
                                        ? "bg-amber-100 text-amber-700"
                                        : "bg-neutral-100 text-neutral-600"
                                )}>
                                    {delayMs}ms
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="5000"
                                step="100"
                                value={delayMs}
                                onChange={(e) => updateSettings({ delayMs: parseInt(e.target.value) })}
                                className="w-full h-2 bg-neutral-200 rounded-full appearance-none cursor-pointer accent-brand-primary"
                            />
                            <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                                <span>Instant</span>
                                <span>5 seconds</span>
                            </div>
                        </div>

                        {/* Failure Rate Slider */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-neutral-700">Failure Rate</label>
                                <span className={cn(
                                    "text-xs font-mono px-2 py-0.5 rounded-md",
                                    failureRate > 0
                                        ? "bg-red-100 text-red-700 font-bold"
                                        : "bg-neutral-100 text-neutral-600"
                                )}>
                                    {(failureRate * 100).toFixed(0)}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={failureRate}
                                onChange={(e) => updateSettings({ failureRate: parseFloat(e.target.value) })}
                                className="w-full h-2 bg-neutral-200 rounded-full appearance-none cursor-pointer accent-red-500"
                            />
                            <p className="text-xs text-neutral-500 mt-2">
                                Chance that requests fail with 500 Error
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 pt-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full"
                            onClick={resetSettings}
                        >
                            Reset to Normal
                        </Button>
                    </div>
                </Card>
            )}

            {/* Toggle Button */}
            <button
                ref={triggerRef}
                onClick={togglePanel}
                className={cn(
                    "group flex items-center gap-2 rounded-full shadow-lg transition-all duration-200",
                    "bg-neutral-900 text-white hover:bg-neutral-800",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
                    isOpen
                        ? "w-12 h-12 justify-center"
                        : "h-12 px-4 md:pr-5"
                )}
                aria-label={isOpen ? "Close debug panel" : "Open debug panel"}
                aria-expanded={isOpen}
            >
                <span className="text-lg">{isOpen ? '✕' : '🐞'}</span>
                {!isOpen && (
                    <>
                        <span className="hidden md:inline text-sm font-medium">Debug</span>
                        <kbd className="hidden md:inline kbd text-[10px]">D</kbd>
                    </>
                )}
            </button>
        </div>
    );
};
