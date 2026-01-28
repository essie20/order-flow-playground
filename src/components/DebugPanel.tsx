import { useState } from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

export const DebugPanel = () => {
    const { delayMs, failureRate, updateSettings, resetSettings } = useSimulation();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gray-900 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-gray-800 transition md:w-auto md:h-auto md:px-4 md:py-2 md:rounded-lg"
            >
                <span className="md:hidden">🐞</span>
                <span className="hidden md:inline font-medium">Debug Panel</span>
            </button>

            {/* Panel Content - Only conditionally rendered when open */}
            {isOpen && (
                <Card className="mt-2 w-80 p-4 shadow-xl border-gray-200 animate-in slide-in-from-bottom-2 fade-in bg-white/95 backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h3 className="font-bold text-sm uppercase tracking-wide text-gray-500">Chaos Engineering</h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">×</button>
                    </div>

                    <div className="space-y-4">
                        {/* Network Delay Slider */}
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <label className="font-medium">Network Delay</label>
                                <span className={cn("text-xs font-mono", delayMs > 1000 ? "text-orange-600" : "text-gray-500")}>
                                    {delayMs}ms
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="5000"
                                step="100" // Snap to 100ms
                                value={delayMs}
                                onChange={(e) => updateSettings({ delayMs: parseInt(e.target.value) })}
                                className="w-full accent-brand-primary cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-gray-400">
                                <span>Instant</span>
                                <span>5s</span>
                            </div>
                        </div>

                        {/* Failure Rate Slider */}
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <label className="font-medium">Failure Rate</label>
                                <span className={cn("text-xs font-mono", failureRate > 0 ? "text-red-600 font-bold" : "text-gray-500")}>
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
                                className="w-full accent-red-500 cursor-pointer"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Chance that the next request fails with 500 Error.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <Button
                            variant="secondary"
                            className="w-full h-8 text-xs bg-gray-100 hover:bg-gray-200 text-gray-900"
                            onClick={resetSettings}
                        >
                            Reset to Normal
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
};
