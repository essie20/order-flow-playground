import { useState, useEffect, useRef, useCallback } from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { worker } from '@/services/mocks/browser'; // Import MSW worker

interface RequestLog {
    id: string;
    method: string;
    url: string;
    status: number;
    timestamp: number;
    duration?: number;
}

export const DebugPanel = () => {
    const { delayMs, failureRate, updateSettings, resetSettings } = useSimulation();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'controls' | 'logs'>('controls');
    const [logs, setLogs] = useState<RequestLog[]>([]);

    const panelRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const togglePanel = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    // Listen to MSW events for logging
    useEffect(() => {
        if (!worker) return;

        const handleResponse = ({ response, request }: any) => {
            const url = new URL(request.url).pathname;
            // Ignore assets/hot-reload
            if (!url.startsWith('/api')) return;

            const newLog: RequestLog = {
                id: Math.random().toString(36).substr(2, 9),
                method: request.method,
                url: url,
                status: response.status,
                timestamp: Date.now(),
            };

            setLogs(prev => [newLog, ...prev].slice(0, 20)); // Keep last 20
        };

        // msw v2 event listener might vary, assuming .events.on pattern works or fallback to global hook
        // For simplicity/safety in this env, we try standard event listener if available
        // If specific MSW types are needed, we skip exact typing for 'any'

        // Note: MSW 2.x uses 'response:mocked'
        try {
            // @ts-ignore - accessing internal events system
            worker.events.on('response:mocked', handleResponse);
        } catch (e) {
            console.warn("Could not attach to MSW events", e);
        }

        return () => {
            try {
                // @ts-ignore
                worker.events.removeListener('response:mocked', handleResponse);
            } catch (e) { }
        };
    }, []);

    // Global keyboard shortcuts (D)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

            if (e.key === 'd' || e.key === 'D') {
                e.preventDefault();
                togglePanel();
            }
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
                triggerRef.current?.focus();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, togglePanel]);

    // Focus management
    useEffect(() => {
        if (isOpen && panelRef.current && activeTab === 'controls') {
            const firstElement = panelRef.current.querySelector<HTMLElement>('button, input');
            firstElement?.focus();
        }
    }, [isOpen, activeTab]);

    const applyPreset = (preset: 'happy' | 'flaky' | 'down') => {
        if (preset === 'happy') {
            resetSettings();
        } else if (preset === 'flaky') {
            updateSettings({ delayMs: 1500, failureRate: 0.3 });
        } else if (preset === 'down') {
            updateSettings({ delayMs: 500, failureRate: 1.0 });
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
            {isOpen && (
                <Card
                    ref={panelRef}
                    variant="elevated"
                    role="dialog"
                    aria-label="Chaos Engineering Controls"
                    className="w-96 animate-slide-up glass border border-neutral-200 overflow-hidden flex flex-col max-h-[600px]"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-3 border-b border-neutral-100 bg-neutral-50/50">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🐞</span>
                            <div>
                                <h3 className="font-bold text-neutral-900 text-sm leading-tight">Chaos Control</h3>
                                <p className="text-[10px] text-neutral-500 font-mono">MSW Interceptor Active</p>
                            </div>
                        </div>
                        <div className="flex bg-neutral-100 p-0.5 rounded-lg">
                            <button
                                onClick={() => setActiveTab('controls')}
                                className={cn(
                                    "px-3 py-1 text-xs font-medium rounded-md transition-all",
                                    activeTab === 'controls' ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
                                )}
                            >
                                Controls
                            </button>
                            <button
                                onClick={() => setActiveTab('logs')}
                                className={cn(
                                    "px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1",
                                    activeTab === 'logs' ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
                                )}
                            >
                                Logs
                                {logs.length > 0 && (
                                    <span className="bg-brand-primary text-white text-[8px] px-1 rounded-full">{logs.length}</span>
                                )}
                            </button>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-neutral-200 rounded text-neutral-400"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 overflow-y-auto custom-scrollbar">
                        {activeTab === 'controls' ? (
                            <div className="space-y-6">
                                {/* Presets */}
                                <div className="grid grid-cols-3 gap-2">
                                    <button onClick={() => applyPreset('happy')} className="p-2 rounded border border-green-200 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold transition-colors">
                                        Happy Path
                                    </button>
                                    <button onClick={() => applyPreset('flaky')} className="p-2 rounded border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold transition-colors">
                                        Flaky Network
                                    </button>
                                    <button onClick={() => applyPreset('down')} className="p-2 rounded border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors">
                                        System Down
                                    </button>
                                </div>

                                {/* Sliders */}
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-xs font-bold text-neutral-700">Latency Injection</label>
                                            <span className="font-mono text-xs bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600">
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
                                            <span>0ms</span>
                                            <span>5000ms</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-xs font-bold text-neutral-700">Failure Probability</label>
                                            <span className={cn(
                                                "font-mono text-xs px-1.5 py-0.5 rounded",
                                                failureRate > 0 ? "bg-red-100 text-red-700" : "bg-neutral-100 text-neutral-600"
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
                                        <p className="text-[10px] text-neutral-500 mt-1">
                                            Probability of 500 Internal Server Error
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {logs.length === 0 ? (
                                    <div className="text-center py-8 text-neutral-400 text-sm">
                                        No API requests captured yet.
                                    </div>
                                ) : (
                                    logs.map((log) => (
                                        <div key={log.id} className="flex items-center justify-between p-2 rounded bg-neutral-50 border border-neutral-100 text-xs font-mono">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "font-bold px-1 rounded",
                                                    log.method === 'GET' ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                                                )}>{log.method}</span>
                                                <span className="text-neutral-600 truncate max-w-[120px]" title={log.url}>{log.url}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "font-bold",
                                                    log.status >= 500 ? "text-red-600" : log.status >= 400 ? "text-amber-600" : "text-green-600"
                                                )}>
                                                    {log.status}
                                                </span>
                                                <span className="text-neutral-400">{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </Card>
            )}

            <button
                ref={triggerRef}
                onClick={togglePanel}
                className={cn(
                    "group flex items-center gap-2 rounded-full shadow-lg transition-all duration-200",
                    "bg-neutral-900 text-white hover:bg-neutral-800",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
                    isOpen ? "w-12 h-12 justify-center" : "h-12 px-4 md:pr-5"
                )}
                aria-label={isOpen ? "Close debug panel" : "Open debug panel"}
            >
                <span className="text-xl">{isOpen ? '✕' : '🐞'}</span>
                {!isOpen && (
                    <>
                        <span className="hidden md:inline text-sm font-bold">Chaos</span>
                        <kbd className="hidden md:inline kbd ml-1 text-[10px] bg-neutral-800 border-neutral-700 text-neutral-400">D</kbd>
                    </>
                )}
            </button>
        </div>
    );
};
