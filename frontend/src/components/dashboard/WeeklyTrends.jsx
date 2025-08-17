import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Footprints, Droplets, BedDouble } from 'lucide-react';

const TrendChart = ({ data, dataKey, color, icon, title }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex-1">
        <div className="flex items-center gap-2 mb-2">
            {icon}
            <p className="font-semibold text-gray-700 capitalize">{title}</p>
        </div>
        <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                <defs>
                    <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={color} stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                    }}
                />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#color${dataKey})`} />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

export default function WeeklyTrends({ data }) {
    return (
        <>
            {/* <h2 className="text-xl font-bold text-gray-800">Weekly Trends</h2> */}
            {/* --- CHANGE: The main container is now a grid --- */}
             <div className="space-y-6">
            <TrendChart 
                data={data} 
                dataKey="steps" 
                title="Steps"
                color="#3B82F6" 
                icon={<Footprints size={16} className="text-blue-500" />} 
            />
            <TrendChart 
                data={data} 
                dataKey="water" 
                title="Water (glasses)"
                color="#0EA5E9" 
                icon={<Droplets size={16} className="text-sky-500" />} 
            />
            <TrendChart 
                data={data} 
                dataKey="sleep" 
                title="Sleep (hours)"
                color="#8B5CF6" 
                icon={<BedDouble size={16} className="text-indigo-500" />} 
            />
        </div>
        </>
    );
}
