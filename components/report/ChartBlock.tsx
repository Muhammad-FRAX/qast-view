
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { ChartBlockData, ChartType } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

const COLORS = ['#2563eb', '#84cc16', '#f97316', '#f59e0b', '#10b981', '#6366f1'];
const LIGHT_THEME_TEXT = '#334155'; // slate-700
const LIGHT_THEME_BORDER = '#e2e8f0'; // slate-200
const LIGHT_THEME_BACKGROUND = '#ffffff'; // white


const ChartBlock: React.FC<ChartBlockData> = ({ label, chartType, data }) => {
  
  const renderChart = () => {
    switch (chartType) {
      case ChartType.BAR:
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_THEME_BORDER}/>
            <XAxis dataKey="name" stroke={LIGHT_THEME_TEXT} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={LIGHT_THEME_TEXT} fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{
                backgroundColor: LIGHT_THEME_BACKGROUND,
                borderColor: LIGHT_THEME_BORDER,
                color: LIGHT_THEME_TEXT
              }}
            />
            <Legend wrapperStyle={{fontSize: "12px"}}/>
            <Bar dataKey="value" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case ChartType.LINE:
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_THEME_BORDER} />
            <XAxis dataKey="name" stroke={LIGHT_THEME_TEXT} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={LIGHT_THEME_TEXT} fontSize={12} tickLine={false} axisLine={false} />
             <Tooltip
              contentStyle={{
                backgroundColor: LIGHT_THEME_BACKGROUND,
                borderColor: LIGHT_THEME_BORDER,
                color: LIGHT_THEME_TEXT
              }}
            />
            <Legend wrapperStyle={{fontSize: "12px"}}/>
            <Line type="monotone" dataKey="value" stroke={COLORS[0]} strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        );
      case ChartType.PIE:
        return (
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={12}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
             <Tooltip
              contentStyle={{
                backgroundColor: LIGHT_THEME_BACKGROUND,
                borderColor: LIGHT_THEME_BORDER,
                color: LIGHT_THEME_TEXT
              }}
            />
            <Legend wrapperStyle={{fontSize: "12px"}}/>
          </PieChart>
        );
      default:
        return <p>Unknown chart type</p>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartBlock;