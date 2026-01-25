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
  AreaChart
} from "recharts";

interface KaplanMeierChartProps {
  drugName: string;
  data: Array<{
    time: number;
    treatment: number;
    control: number;
    treatmentCI: [number, number];
    controlCI: [number, number];
    atRiskTreatment: number;
    atRiskControl: number;
  }>;
}

export const generateKaplanMeierData = (seed: number) => {
  const data = [];
  let treatmentSurvival = 1;
  let controlSurvival = 1;
  const random = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };
  
  for (let month = 0; month <= 24; month += 2) {
    const treatmentDrop = month === 0 ? 0 : 0.01 + random(seed + month) * 0.03;
    const controlDrop = month === 0 ? 0 : 0.015 + random(seed + month + 100) * 0.035;
    
    treatmentSurvival = Math.max(0.5, treatmentSurvival - treatmentDrop);
    controlSurvival = Math.max(0.45, controlSurvival - controlDrop);
    
    data.push({
      time: month,
      treatment: treatmentSurvival,
      control: controlSurvival,
      treatmentCI: [treatmentSurvival * 0.92, Math.min(1, treatmentSurvival * 1.05)] as [number, number],
      controlCI: [controlSurvival * 0.9, Math.min(1, controlSurvival * 1.06)] as [number, number],
      atRiskTreatment: Math.floor(412 * treatmentSurvival),
      atRiskControl: Math.floor(435 * controlSurvival),
    });
  }
  return data;
};

export const KaplanMeierChart = ({ drugName, data }: KaplanMeierChartProps) => {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ left: 10, right: 10, top: 10, bottom: 20 }}>
          <defs>
            <linearGradient id="kmTreatmentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.02}/>
            </linearGradient>
            <linearGradient id="kmControlGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.02}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 10 }}
            stroke="hsl(var(--muted-foreground))"
            label={{ value: 'Time (months)', position: 'bottom', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            stroke="hsl(var(--muted-foreground))"
            domain={[0.4, 1]}
            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            label={{ value: 'Survival Probability', angle: -90, position: 'insideLeft', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: 11,
            }}
            formatter={(value: number, name: string) => [
              `${(value * 100).toFixed(1)}%`,
              name === 'treatment' ? drugName : 'Control'
            ]}
            labelFormatter={(label) => `Month ${label}`}
          />
          <Legend 
            wrapperStyle={{ fontSize: 10 }}
            formatter={(value) => value === 'treatment' ? drugName : 'Control'}
          />
          
          {/* Confidence intervals */}
          <Area 
            type="stepAfter" 
            dataKey="treatmentCI[1]" 
            stroke="none"
            fill="url(#kmTreatmentGradient)"
          />
          <Area 
            type="stepAfter" 
            dataKey="controlCI[1]" 
            stroke="none"
            fill="url(#kmControlGradient)"
          />
          
          {/* Main survival curves */}
          <Line 
            type="stepAfter" 
            dataKey="treatment" 
            stroke="hsl(var(--chart-1))" 
            strokeWidth={2}
            dot={{ fill: "hsl(var(--chart-1))", r: 2 }}
          />
          <Line 
            type="stepAfter" 
            dataKey="control" 
            stroke="hsl(var(--chart-3))" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: "hsl(var(--chart-3))", r: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      {/* At-risk table */}
      <div className="mt-2 text-xs">
        <div className="grid grid-cols-7 gap-1 text-center text-muted-foreground">
          <span className="text-left font-medium">At Risk</span>
          {[0, 4, 8, 12, 16, 20, 24].map(t => (
            <span key={t} className="text-[10px]">{t}mo</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
          <span className="text-left text-chart-1">{drugName}</span>
          {data.filter((_, i) => i % 2 === 0).slice(0, 7).map((d, i) => (
            <span key={i}>{d.atRiskTreatment}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
          <span className="text-left text-chart-3">Control</span>
          {data.filter((_, i) => i % 2 === 0).slice(0, 7).map((d, i) => (
            <span key={i}>{d.atRiskControl}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
