import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Toaster, toast } from 'sonner';
import { Download, Calendar, BarChart2, PieChart, LineChart as LineChartIcon } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  PieChart as RechartsPieChart,
  Line,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

// --- Reusable Chart Card Component ---
const ChartCard = ({ title, icon, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
            {icon}
            {title}
        </h3>
        <div className="h-64">
            {children}
        </div>
    </div>
);
    
   

// --- Main Analysis Page Component ---
export default function Analysis() {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('monthly'); // 'monthly' or 'weekly'

    const fetchReport = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/analysis/report/?period=${period}`);
            setReport(response.data);
        } catch (error) {
            toast.error('Failed to load analysis report.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [period]);

    const handleDownloadCsv = async () => {
        try {
            const response = await apiClient.get('/analysis/export-csv/', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const filename = `fittrack_report_${new Date().toISOString().split('T')[0]}.csv`;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error('Failed to download report.');
        }
    };

    // Data for the pie chart
    const macroData = report ? [
        // Calculate total calories from each macro
        { name: 'Protein', value: Math.round(report.chart_data.reduce((sum, day) => sum + day.protein_g, 0) * 4) },
        { name: 'Carbs', value: Math.round(report.chart_data.reduce((sum, day) => sum + day.carbs_g, 0) * 4) },
        { name: 'Fats', value: Math.round(report.chart_data.reduce((sum, day) => sum + day.fats_g, 0) * 9) }
    ].filter(d => d.value > 0) : [];
    
    
    const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];
     const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
    }

    return (
        <>
            <Toaster position="top-center" richColors />
            <div className="max-w-6xl mx-auto p-4 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Your Progress Report</h1>
                        <p className="text-gray-500 capitalize">{period} Analysis</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-gray-200 rounded-lg p-1">
                            <button onClick={() => setPeriod('weekly')} className={`px-4 py-1 text-sm font-semibold rounded-md ${period === 'weekly' ? 'bg-white shadow' : 'text-gray-600'}`}>Weekly</button>
                            <button onClick={() => setPeriod('monthly')} className={`px-4 py-1 text-sm font-semibold rounded-md ${period === 'monthly' ? 'bg-white shadow' : 'text-gray-600'}`}>Monthly</button>
                        </div>
                        <button onClick={handleDownloadCsv} className="flex items-center gap-2 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                            <Download size={16} />
                            <span>Export CSV</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500 py-16">Generating your report...</p>
                ) : !report ? (
                    <p className="text-center text-red-500 py-16">Could not load the report.</p>
                ) : (
                    <div className="space-y-8">
                        {/* Summary Stats Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
                                <p className="text-sm text-gray-500">Weight Change</p>
                                <p className={`text-2xl font-bold ${report.summary_stats.weight_change_kg < 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {report.summary_stats.weight_change_kg} kg
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
                                <p className="text-sm text-gray-500">Avg. Calories Eaten</p>
                                <p className="text-2xl font-bold text-blue-600">{report.summary_stats.avg_daily_calories_consumed} kcal</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
                                <p className="text-sm text-gray-500">Avg. Calories Burned</p>
                                <p className="text-2xl font-bold text-orange-600">{report.summary_stats.avg_daily_calories_burned} kcal</p>
                            </div>
                             <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
                                <p className="text-sm text-gray-500">Total Workouts</p>
                                <p className="text-2xl font-bold text-indigo-600">{report.summary_stats.total_workouts}</p>
                            </div>
                        </div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <ChartCard title="Weight Trend" icon={<LineChartIcon size={20} className="text-green-600" />}>
                                <ResponsiveContainer>
                                    <LineChart data={report.chart_data.filter(d => d.weight_kg > 0)}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" fontSize={12} />
                                        <YAxis fontSize={12} domain={['dataMin - 1', 'dataMax + 1']} />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="weight_kg" name="Weight (kg)" stroke="#10B981" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartCard>
                             <ChartCard title="Macro Distribution" icon={<PieChart size={20} className="text-blue-600" />}>
                                <ResponsiveContainer>
                                      <RechartsPieChart>
                                        <Pie data={macroData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label={renderCustomizedLabel}>
                                            {macroData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            </ChartCard>
                            <div className="lg:col-span-2">
                                <ChartCard title="Calories Consumed vs. Burned" icon={<BarChart2 size={20} className="text-orange-600" />}>
                                    <ResponsiveContainer>
                                        <BarChart data={report.chart_data}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" fontSize={12} />
                                            <YAxis fontSize={12} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="calories_consumed" name="Consumed" fill="#10B981" />
                                            <Bar dataKey="total_calories_burned" name="Burned" fill="#F97316" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartCard>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
