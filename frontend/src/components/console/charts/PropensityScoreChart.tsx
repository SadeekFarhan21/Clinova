import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";

interface PropensityScoreChartProps {
  drugName: string;
}

export const PropensityScoreChart = ({ drugName }: PropensityScoreChartProps) => {
  // Generate propensity score distribution data
  const generateDistribution = () => {
    const data = [];
    for (let i = 0; i <= 20; i++) {
      const score = i * 0.05;
      // Treatment group (bimodal-ish with peak around 0.5-0.6)
      const treatmentDensity = 
        Math.exp(-Math.pow((score - 0.55) * 4, 2)) * 3.5 +
        Math.exp(-Math.pow((score - 0.3) * 5, 2)) * 1.5 +
        Math.random() * 0.3;
      // Control group (peak around 0.4-0.5)
      const controlDensity = 
        Math.exp(-Math.pow((score - 0.45) * 4, 2)) * 4 +
        Math.exp(-Math.pow((score - 0.25) * 5, 2)) * 1.2 +
        Math.random() * 0.3;
      
      data.push({
        score: score.toFixed(2),
        treatment: Math.max(0, treatmentDensity),
        control: Math.max(0, controlDensity),
      });
    }
    return data;
  };

  const data = generateDistribution();
  const overlapCoef = (0.7 + Math.random() * 0.15).toFixed(3);
  const essRatio = (0.6 + Math.random() * 0.2).toFixed(2);

  return (
    <div className="w-full h-full">
      <div className="flex justify-end gap-4 mb-2 text-xs">
        <span className="px-2 py-1 rounded bg-muted/50">
          Overlap Coef. = {overlapCoef}
        </span>
        <span className="px-2 py-1 rounded bg-muted/50">
          ESS Ratio = {essRatio}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barGap={0}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="score" 
            tick={{ fontSize: 10 }}
            stroke="hsl(var(--muted-foreground))"
            label={{ value: 'Propensity Score', position: 'bottom', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            stroke="hsl(var(--muted-foreground))"
            label={{ value: 'Density', angle: -90, position: 'insideLeft', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <ReferenceLine x="0.10" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" />
          <ReferenceLine x="0.90" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" />
          <Bar 
            dataKey="treatment" 
            name={drugName}
            fill="hsl(var(--chart-1))" 
            opacity={0.7}
          />
          <Bar 
            dataKey="control" 
            name="Control"
            fill="hsl(var(--chart-3))" 
            opacity={0.7}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
