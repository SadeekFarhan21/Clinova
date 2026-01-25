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

interface HazardRatioChartProps {
  drugName: string;
  data: Array<{
    subgroup: string;
    hr: number;
    ciLow: number;
    ciHigh: number;
    pValue: number;
    n: number;
  }>;
}

export const generateHazardRatioData = (seed: number): HazardRatioChartProps['data'] => {
  const random = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };
  
  const subgroups = [
    { name: "Overall", n: 847 },
    { name: "Age < 65", n: 423 },
    { name: "Age ≥ 65", n: 424 },
    { name: "Male", n: 512 },
    { name: "Female", n: 335 },
    { name: "No Comorbidities", n: 298 },
    { name: "With Comorbidities", n: 549 },
    { name: "Prior Treatment", n: 187 },
    { name: "Treatment Naive", n: 660 },
  ];
  
  return subgroups.map((sg, idx) => {
    const hr = 0.5 + random(seed + idx * 17) * 0.8;
    const ciWidth = 0.15 + random(seed + idx * 23) * 0.25;
    return {
      subgroup: sg.name,
      hr,
      ciLow: Math.max(0.2, hr - ciWidth),
      ciHigh: Math.min(1.8, hr + ciWidth),
      pValue: random(seed + idx * 31) < 0.3 ? random(seed + idx * 37) * 0.04 : 0.05 + random(seed + idx * 41) * 0.5,
      n: sg.n,
    };
  });
};

export const HazardRatioChart = ({ drugName, data }: HazardRatioChartProps) => {
  const chartData = data.map((d, idx) => ({
    ...d,
    idx: data.length - idx,
    errorLow: d.hr - d.ciLow,
    errorHigh: d.ciHigh - d.hr,
  }));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart 
          data={chartData} 
          layout="vertical"
          margin={{ left: 100, right: 80, top: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            type="number"
            domain={[0.2, 1.8]}
            scale="log"
            tick={{ fontSize: 10 }}
            stroke="hsl(var(--muted-foreground))"
            tickFormatter={(v) => v.toFixed(1)}
            label={{ value: 'Hazard Ratio (log scale)', position: 'bottom', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            type="category"
            dataKey="subgroup"
            tick={{ fontSize: 10 }}
            stroke="hsl(var(--muted-foreground))"
            width={95}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: 11,
            }}
            formatter={(value: number, name: string) => {
              if (name === 'hr') return [value.toFixed(2), 'Hazard Ratio'];
              return [value, name];
            }}
          />
          <ReferenceLine x={1} stroke="hsl(var(--muted-foreground))" strokeWidth={2} />
          
          {/* Error bars (CI) */}
          <Scatter 
            dataKey="hr" 
            fill="hsl(var(--chart-2))" 
            shape="diamond"
          >
            <ErrorBar 
              dataKey="errorHigh" 
              direction="x" 
              stroke="hsl(var(--chart-2))"
              strokeWidth={1.5}
            />
          </Scatter>
        </ComposedChart>
      </ResponsiveContainer>
      
      {/* Stats column */}
      <div className="flex justify-between text-xs text-muted-foreground px-4 mt-2">
        <span>← Favors {drugName}</span>
        <span>Favors Control →</span>
      </div>
      
      {/* Legend table */}
      <div className="mt-3 text-xs border-t border-border pt-2">
        <div className="grid grid-cols-4 gap-2 text-muted-foreground font-medium mb-1">
          <span>Subgroup</span>
          <span className="text-center">HR (95% CI)</span>
          <span className="text-center">p-value</span>
          <span className="text-center">N</span>
        </div>
        {data.slice(0, 5).map((d, idx) => (
          <div key={idx} className="grid grid-cols-4 gap-2 text-[10px] py-0.5">
            <span className="truncate">{d.subgroup}</span>
            <span className="text-center font-mono">
              {d.hr.toFixed(2)} ({d.ciLow.toFixed(2)}-{d.ciHigh.toFixed(2)})
            </span>
            <span className={`text-center ${d.pValue < 0.05 ? 'text-emerald-500 font-medium' : ''}`}>
              {d.pValue < 0.001 ? '<0.001' : d.pValue.toFixed(3)}
            </span>
            <span className="text-center">{d.n}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
