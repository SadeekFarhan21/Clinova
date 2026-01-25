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

interface PrimaryOutcomeChartProps {
  drugName: string;
}

export const PrimaryOutcomeChart = ({ drugName }: PrimaryOutcomeChartProps) => {
  const treatmentRate = 4 + Math.random() * 4;
  const controlRate = 4 + Math.random() * 4;
  const riskDiff = (treatmentRate - controlRate).toFixed(2);
  const ciLow = (parseFloat(riskDiff) - 1.5 - Math.random()).toFixed(2);
  const ciHigh = (parseFloat(riskDiff) + 1.5 + Math.random()).toFixed(2);
  const pValue = (0.2 + Math.random() * 0.7).toFixed(3);

  const data = [
    { 
      name: drugName, 
      rate: treatmentRate,
      error: 1 + Math.random(),
    },
    { 
      name: "Control", 
      rate: controlRate,
      error: 1 + Math.random(),
    },
  ];

  return (
    <div className="w-full h-full">
      <div className="text-center mb-2">
        <span className="text-xs text-muted-foreground">
          NS, p = {pValue}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={80}>
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
          RD: {riskDiff}% (95% CI: [{ciLow}%, {ciHigh}%])
        </span>
      </div>
    </div>
  );
};
