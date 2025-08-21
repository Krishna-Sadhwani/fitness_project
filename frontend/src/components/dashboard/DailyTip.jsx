import React from 'react';
import { Lightbulb, Loader2, RefreshCw } from 'lucide-react';

export default function DailyTip({ tip, onGenerate, isLoading }) {
    return (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
            <div className="flex items-start justify-between"> 
                <div className="flex">
                    <div className="py-1">
                        <Lightbulb className="h-6 w-6 text-green-500 mr-3" />
                    </div>
                    <div>
                        <p className="font-bold text-green-800">Today's Focus</p>
                        <p className="text-sm text-green-700 mt-1">{tip}</p>
                    </div>
                </div>
                <button 
                    onClick={onGenerate} 
                    disabled={isLoading}
                    className="ml-4 flex-shrink-0 p-2 bg-white rounded-full text-green-700 hover:bg-green-100 disabled:opacity-50"
                    aria-label="Generate new tip"
                >
                    {isLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <RefreshCw size={16} />
                    )}
                </button>
            </div>
        </div>
    );
}
