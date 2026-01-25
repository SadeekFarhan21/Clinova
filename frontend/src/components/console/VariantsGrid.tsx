import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Pill, Package, Factory, Calendar } from "lucide-react";
import type { DrugVariant } from "@/data/drugs-mock-data";

interface VariantsGridProps {
  variants: DrugVariant[];
  onVariantClick: (variant: DrugVariant) => void;
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  discontinued: "bg-muted text-muted-foreground border-muted",
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20"
};

export const VariantsGrid = ({ variants, onVariantClick }: VariantsGridProps) => {
  if (variants.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Package className="w-10 h-10 mx-auto mb-3 opacity-50" />
        <p>No variants available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {variants.map((variant, index) => (
        <motion.button
          key={variant.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onVariantClick(variant)}
          className="glass-panel p-4 text-left hover:shadow-md transition-shadow group"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm group-hover:text-primary transition-colors">
                {variant.name}
              </span>
            </div>
            <Badge variant="outline" className={statusColors[variant.status]}>
              {variant.status}
            </Badge>
          </div>
          
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Package className="w-3 h-3" />
              <span>{variant.formulation}</span>
            </div>
            <div className="flex items-center gap-2">
              <Factory className="w-3 h-3" />
              <span>{variant.manufacturer}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              <span>{new Date(variant.approvalDate).toLocaleDateString()}</span>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};
