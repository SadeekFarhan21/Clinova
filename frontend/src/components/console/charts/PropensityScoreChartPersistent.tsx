import { useMemo } from "react";
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

interface PropensityScoreChartPersistentProps {
  drugName: string;
  overlapCoef: string;
  essRatio: string;
}

export const PropensityScoreChartPersistent = ({ 
  drugName, 
  overlapCoef, 
  essRatio 
}: PropensityScoreChartPersistentProps) => {
  // Generate deterministic distribution data based on drug name
  const data = useMemo(() => {
    const result = [];
    const seed = drugName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    for (let i = 0; i <= 20; i++) {
      const score = i * 0.05;
      const seedOffset = seed + i;
      const random = Math.sin(seedOffset) * 10000;
      const r = random - Math.floor(random);
      
      const treatmentDensity = 
        Math.exp(-Math.pow((score - 0.55) * 4, 2)) * 3.5 +
        Math.exp(-Math.pow((score - 0.3) * 5, 2)) * 1.5 +
        r * 0.3;
      const controlDensity = 
        Math.exp(-Math.pow((score - 0.45) * 4, 2)) * 4 +
        Math.exp(-Math.pow((score - 0.25) * 5, 2)) * 1.2 +
        r * 0.3;
      
      result.push({
        score: score.toFixed(2),
        treatment: Math.max(0, treatmentDensity),
        control: Math.max(0, controlDensity),
      });
    }
    return result;
  }, [drugName]);

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
