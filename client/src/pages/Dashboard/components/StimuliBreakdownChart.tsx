import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface StimuliBreakdownChartProps {
  hasData: boolean;
}

const stimuliData = [
  { name: 'Visual', value: 50, color: '#3b82f6' },
  { name: 'Audio', value: 30, color: '#eab308' },
  { name: 'Vibration', value: 20, color: '#22c55e' },
];

const emptyData = [
  { name: 'Visual', value: 100, color: '#e5e7eb' },
];

const renderLegend = (_props: any, hasData: boolean) => {
  const items = hasData ? stimuliData : [
    { name: 'Visual', color: '#3b82f6' },
    { name: 'Audio', color: '#eab308' },
    { name: 'Vibration', color: '#22c55e' },
  ];

  return (
    <div className="flex flex-col gap-3">
      {items.map((item: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm text-muted-foreground">
            {item.name} - {hasData ? stimuliData[index].value + '%' : '--'}
          </span>
        </div>
      ))}
    </div>
  );
};

export function StimuliBreakdownChart({ hasData }: StimuliBreakdownChartProps) {
  const chartData = hasData ? stimuliData : emptyData;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={chartData}
          cx="40%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={hasData ? 2 : 0}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Legend 
          verticalAlign="middle" 
          align="right"
          layout="vertical"
          content={(props) => renderLegend(props, hasData)}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
