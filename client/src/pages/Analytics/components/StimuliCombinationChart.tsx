import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

interface StimuliCombinationChartProps {
  hasData: boolean;
}

const stimuliCombinationData = [
  { name: 'All Three', value: 40, color: '#2563eb' },
  { name: 'Visual + Audio', value: 31, color: '#3b82f6' },
  { name: 'Visual + Vibration', value: 19, color: '#60a5fa' },
  { name: 'Vibration + Audio', value: 10, color: '#93c5fd' },
];

export function StimuliCombinationChart({ hasData }: StimuliCombinationChartProps) {
  if (!hasData) {
    return (
      <div className="h-[280px] flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart 
        data={stimuliCombinationData} 
        layout="vertical"
        margin={{ top: 5, right: 50, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
        <XAxis 
          type="number" 
          domain={[0, 100]}
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          hide
        />
        <YAxis 
          type="category" 
          dataKey="name"
          tick={{ fontSize: 14, fill: '#1f2937' }}
          axisLine={false}
          tickLine={false}
          width={140}
          label={{ 
            value: 'Stimuli combinations', 
            angle: -90, 
            position: 'insideLeft',
            style: { fontSize: 12, fill: '#6b7280' }
          }}
        />
        <Bar 
          dataKey="value" 
          radius={[0, 4, 4, 0]}
          barSize={20}
          label={{
            position: 'right',
            fill: '#1f2937',
            fontSize: 14,
            fontWeight: 500,
            content: (props: any) => {
              const { x, y, width, value } = props;
              return (
                <text
                  x={x + width + 10}
                  y={y}
                  dy={5}
                  fill="#1f2937"
                  fontSize={14}
                  fontWeight={500}
                >
                  {value}%
                </text>
              );
            }
          }}
        >
          {stimuliCombinationData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
