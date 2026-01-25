import { 
  ComposedChart,
  Scatter,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
  Line,
  ErrorBar
} from "recharts";

interface ForestPlotChartProps {
  drugName: string;
}

const subgroups = [
  { name: "Overall", n: 1847 },
  { name: "eGFR 30-44", n: 687 },
  { name: "eGFR 45-59", n: 1160 },
  { name: "Inpatient/ED", n: 892 },
  { name: "Outpatient", n: 955 },
  { name: "Heart Failure", n: 423 },
  { name: "Age >= 75", n: 534 },
];

export const ForestPlotChart = ({ drugName }: ForestPlotChartProps) => {
  const data = subgroups.map((sg, idx) => {
    const estimate = -2 + Math.random() * 4;
    const ciWidth = 2 + Math.random() * 4;
    return {
      name: sg.name,
      estimate,
      ciLow: estimate - ciWidth,
      ciHigh: estimate + ciWidth,
      n: sg.n,
      errorNeg: ciWidth,
      errorPos: ciWidth,
      idx: subgroups.length - idx,
    };
  });

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart 
          data={data} 
          layout="vertical"
          margin={{ left: 80, right: 60, top: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            type="number"
            domain={[-10, 15]}
            tick={{ fontSize: 10 }}
            stroke="hsl(var(--muted-foreground))"
            label={{ value: 'Risk Difference (%) [95% CI]', position: 'bottom', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            type="category"
            dataKey="name"
            tick={{ fontSize: 10 }}
            stroke="hsl(var(--muted-foreground))"
            width={75}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: 11,
            }}
            formatter={(value: number, name: string) => {
              if (name === 'estimate') return [`${value.toFixed(2)}%`, 'Risk Diff'];
              return [value, name];
            }}
          />
          <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} />
          
          {/* Error bars as lines */}
          {data.map((entry, idx) => (
            <Line
              key={entry.name}
              data={[
                { name: entry.name, estimate: entry.ciLow },
                { name: entry.name, estimate: entry.ciHigh }
              ]}
              dataKey="estimate"
              stroke="hsl(var(--chart-2))"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          ))}
          
          <Scatter 
            dataKey="estimate" 
            fill="hsl(var(--chart-2))" 
            shape="diamond"
          >
            <ErrorBar 
              dataKey="errorPos" 
              direction="x" 
              stroke="hsl(var(--chart-2))"
              strokeWidth={1.5}
            />
          </Scatter>
        </ComposedChart>
      </ResponsiveContainer>
      <div className="flex justify-between text-xs text-muted-foreground px-20 mt-1">
        <span>← Favors {drugName}</span>
        <span>Favors Control →</span>
      </div>
    </div>
  );
};
