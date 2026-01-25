import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  Legend,
  ErrorBar
} from "recharts";
import { TrendingUp, Users, Shield, Activity } from "lucide-react";

interface ResultsDashboardProps {
  data: {
    subgroups: Array<{
      name: string;
      ate: number;
      ci: [number, number];
      n: number;
    }>;
    overall: {
      ate: number;
      ci: [number, number];
      n_treated: number;
      n_control: number;
      confidence: number;
    };
    timeline: Array<{
      month: number;
      treatment: number;
      control: number;
    }>;
  };
}

export const ResultsDashboard = ({ data }: ResultsDashboardProps) => {
  const chartData = data.subgroups.map(sg => ({
    ...sg,
    errorLow: sg.ate - sg.ci[0],
    errorHigh: sg.ci[1] - sg.ate,
  }));

  return (
    <motion.div
      className="w-full max-w-6xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Metrics row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { 
            label: "Treatment Effect", 
            value: `${(data.overall.ate * 100).toFixed(1)}%`,
            icon: TrendingUp,
            delay: 0 
          },
          { 
            label: "Confidence", 
            value: `${(data.overall.confidence * 100).toFixed(1)}%`,
            icon: Shield,
            delay: 0.1 
          },
          { 
            label: "Treated Cohort", 
            value: data.overall.n_treated.toLocaleString(),
            icon: Users,
            delay: 0.2 
          },
          { 
            label: "Control Cohort", 
            value: data.overall.n_control.toLocaleString(),
            icon: Activity,
            delay: 0.3 
          },
        ].map((metric) => (
          <motion.div
            key={metric.label}
            className="glass-panel p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: metric.delay, duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <metric.icon className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <p className="text-xl font-display font-medium text-foreground">
                  {metric.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Subgroup Analysis */}
        <motion.div
          className="glass-panel p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h3 className="font-display text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Subgroup Treatment Effects
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 60, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number" 
                tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, "ATE"]}
              />
              <Bar 
                dataKey="ate" 
                fill="hsl(var(--foreground))"
                radius={[0, 4, 4, 0]}
              >
                <ErrorBar 
                  dataKey="errorHigh" 
                  direction="x" 
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={1.5}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Survival Curve */}
        <motion.div
          className="glass-panel p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h3 className="font-display text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Outcome Timeline
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.timeline} margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                tickFormatter={(v) => `${v}mo`}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                domain={[0.6, 1]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [`${(value * 100).toFixed(1)}%`]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="treatment" 
                stroke="hsl(var(--foreground))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--foreground))", strokeWidth: 0, r: 4 }}
                name="Treatment"
              />
              <Line 
                type="monotone" 
                dataKey="control" 
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "hsl(var(--muted-foreground))", strokeWidth: 0, r: 4 }}
                name="Control"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
};
