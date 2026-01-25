import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
  Legend,
  ZAxis
} from "recharts";

interface CovariateBalanceChartProps {
  drugName: string;
}

const covariates = [
  "Age", "Female", "Baseline eGFR", "Baseline Creatinine", 
  "Diabetes Duration", "Heart Failure", "Hypertension", 
  "HbA1c", "ACE/ARB Use", "Diuretic Use", "Inpatient Setting", "Calendar Year"
];

export const CovariateBalanceChart = ({ drugName }: CovariateBalanceChartProps) => {
  // Generate covariate balance data
  const data = covariates.map((name, idx) => ({
    name,
    beforeWeighting: 0.05 + Math.random() * 0.15,
    afterWeighting: 0.01 + Math.random() * 0.06,
    idx: idx + 1,
  }));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart margin={{ left: 100, right: 20, top: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            type="number" 
            dataKey="beforeWeighting" 
            name="SMD"
            domain={[0, 0.25]}
            tick={{ fontSize: 10 }}
            stroke="hsl(var(--muted-foreground))"
            label={{ value: 'Absolute Standardized Mean Difference', position: 'bottom', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            type="category"
            dataKey="name"
            tick={{ fontSize: 9 }}
            stroke="hsl(var(--muted-foreground))"
            width={95}
          />
          <ZAxis range={[60, 60]} />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: 11,
            }}
            formatter={(value: number) => value.toFixed(3)}
          />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <ReferenceLine x={0.1} stroke="hsl(var(--chart-2))" strokeDasharray="3 3" label={{ value: 'SMD=0.1', fontSize: 8, fill: 'hsl(var(--muted-foreground))' }} />
          <ReferenceLine x={0.25} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label={{ value: 'SMD=0.25', fontSize: 8, fill: 'hsl(var(--muted-foreground))' }} />
          <Scatter 
            name="Before Weighting" 
            data={data} 
            dataKey="beforeWeighting"
            fill="hsl(var(--chart-1))" 
          />
          <Scatter 
            name="After Weighting" 
            data={data.map(d => ({ ...d, beforeWeighting: d.afterWeighting }))} 
            dataKey="beforeWeighting"
            fill="hsl(var(--chart-4))" 
            shape="square"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
