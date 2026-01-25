import { motion } from "framer-motion";
import { Pill, FlaskConical, Database, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface KPI {
  totalDrugs: number;
  activeExperiments: number;
  totalRecords: number;
  pendingRequests: number;
}

interface KPICardsProps {
  data: KPI | null;
  isLoading: boolean;
  onCardClick: (filter: string) => void;
  activeFilter: string | null;
}

export const KPICards = ({ data, isLoading, onCardClick, activeFilter }: KPICardsProps) => {
  const cards = [
    { 
      key: "drugs",
      label: "Total Drugs", 
      value: data?.totalDrugs || 0, 
      icon: Pill, 
      color: "from-primary/20 to-primary/5",
      iconColor: "text-primary"
    },
    { 
      key: "experiments",
      label: "Active Experiments", 
      value: data?.activeExperiments || 0, 
      icon: FlaskConical, 
      color: "from-chart-2/20 to-chart-2/5",
      iconColor: "text-chart-2"
    },
    { 
      key: "records",
      label: "Total Records", 
      value: data?.totalRecords?.toLocaleString() || 0, 
      icon: Database, 
      color: "from-chart-3/20 to-chart-3/5",
      iconColor: "text-chart-3"
    },
    { 
      key: "pending",
      label: "Pending Requests", 
      value: data?.pendingRequests || 0, 
      icon: Clock, 
      color: "from-chart-4/20 to-chart-4/5",
      iconColor: "text-chart-4"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-panel p-6">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.key;
        
        return (
          <motion.button
            key={card.key}
            onClick={() => onCardClick(card.key)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`glass-panel p-6 text-left transition-all duration-300 cursor-pointer group
              ${isActive ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}`}
          >
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${card.color} opacity-0 
              group-hover:opacity-100 transition-opacity duration-300`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground font-medium">{card.label}</span>
                <div className={`p-2 rounded-lg bg-background/50 ${card.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-display font-semibold text-foreground">
                {card.value}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};
