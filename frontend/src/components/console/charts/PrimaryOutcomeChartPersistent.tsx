import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip,
  Cell,
  ErrorBar
} from "recharts";

interface PrimaryOutcomeChartPersistentProps {
  drugName: string;
  data: {
    treatmentRate: number;
    controlRate: number;
    riskDiff: string;
    ciLow: string;
    ciHigh: string;
    pValue: string;
  };
}

export const PrimaryOutcomeChartPersistent = ({ drugName, data: outcomeData }: PrimaryOutcomeChartPersistentProps) => {
  const chartData = [
    { 
      name: drugName, 
      rate: outcomeData.treatmentRate,
      error: 1.2,
    },
    { 
      name: "Control", 
      rate: outcomeData.controlRate,
      error: 1.2,
    },
  ];

  return (
    <div className="w-full h-full">
      <div className="text-center mb-2">
        <span className="text-xs text-muted-foreground">
          NS, p = {outcomeData.pValue}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} barSize={80}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 11 }}
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            stroke="hsl(var(--muted-foreground))"
            domain={[0, 12]}
            label={{ value: 'Event Rate (%)', angle: -90, position: 'insideLeft', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: 12,
            }}
            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Event Rate']}
          />
          <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
            <Cell fill="hsl(var(--chart-1))" opacity={0.8} />
            <Cell fill="hsl(var(--chart-3))" opacity={0.8} />
            <ErrorBar 
              dataKey="error" 
              stroke="hsl(var(--foreground))"
              strokeWidth={1.5}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="text-center mt-2 text-xs text-muted-foreground">
        <span className="px-2 py-1 rounded bg-muted/50">
          RD: {outcomeData.riskDiff}% (95% CI: [{outcomeData.ciLow}%, {outcomeData.ciHigh}%])
        </span>
      </div>
    </div>
  );
};
