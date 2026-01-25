import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip,
  Legend,
  Area,
  AreaChart,
  ReferenceArea
} from "recharts";

interface CumulativeIncidenceChartProps {
  drugName: string;
}

export const CumulativeIncidenceChart = ({ drugName }: CumulativeIncidenceChartProps) => {
  // Generate cumulative incidence curves
  const generateCurve = (baseRate: number, variance: number) => {
    let cumulative = 0;
    const points = [];
    for (let hour = 0; hour <= 72; hour += 4) {
      const increment = (baseRate / 18) * (1 + Math.random() * variance * 0.3);
      cumulative = Math.min(10, cumulative + increment);
      points.push(cumulative);
    }
    return points;
  };

  const treatmentCurve = generateCurve(6, 0.3);
  const controlCurve = generateCurve(6.5, 0.3);
  
  const data = treatmentCurve.map((val, idx) => ({
    hour: idx * 4,
    treatment: val,
    control: controlCurve[idx],
    treatmentUpper: Math.min(10, val * 1.15),
    treatmentLower: val * 0.85,
    controlUpper: Math.min(10, controlCurve[idx] * 1.15),
    controlLower: controlCurve[idx] * 0.85,
  }));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
          <defs>
            <linearGradient id="treatmentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="controlGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <ReferenceArea x1={48} x2={72} fill="hsl(var(--muted))" fillOpacity={0.3} />
          <XAxis 
            dataKey="hour" 
            tick={{ fontSize: 10 }}
            stroke="hsl(var(--muted-foreground))"
            label={{ value: 'Hours After Administration', position: 'bottom', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            stroke="hsl(var(--muted-foreground))"
            domain={[0, 10]}
            label={{ value: 'Cumulative Incidence (%)', angle: -90, position: 'insideLeft', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: 11,
            }}
            formatter={(value: number) => [`${value.toFixed(2)}%`]}
          />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          
          {/* Confidence intervals as areas */}
          <Area 
            type="monotone" 
            dataKey="treatmentUpper" 
            stroke="none"
            fill="url(#treatmentGradient)"
            fillOpacity={0.3}
          />
          <Area 
            type="monotone" 
            dataKey="controlUpper" 
            stroke="none"
            fill="url(#controlGradient)"
            fillOpacity={0.3}
          />
          
          {/* Main lines */}
          <Line 
            type="monotone" 
            dataKey="treatment" 
            name={drugName}
            stroke="hsl(var(--chart-1))" 
            strokeWidth={2}
            dot={{ fill: "hsl(var(--chart-1))", r: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="control" 
            name="Control"
            stroke="hsl(var(--chart-3))" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: "hsl(var(--chart-3))", r: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="text-center text-xs text-muted-foreground mt-1">
        <span className="px-2 py-1 rounded bg-muted/30">Primary Window (48-72h)</span>
      </div>
    </div>
  );
};
