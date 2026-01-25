import { motion, AnimatePresence } from "framer-motion";
import { X, Pill, Package, Factory, Calendar, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { DrugVariant } from "@/data/drugs-mock-data";

interface VariantDetailModalProps {
  variant: DrugVariant | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  active: { icon: CheckCircle, color: "bg-emerald-500/10 text-emerald-600", label: "Active" },
  discontinued: { icon: AlertCircle, color: "bg-muted text-muted-foreground", label: "Discontinued" },
  pending: { icon: Clock, color: "bg-amber-500/10 text-amber-600", label: "Pending Approval" }
};

export const VariantDetailModal = ({ variant, isOpen, onClose }: VariantDetailModalProps) => {
  const { toast } = useToast();

  const handleViewStudies = () => {
    toast({
      title: "Loading Studies",
      description: `Fetching clinical studies for ${variant?.name}...`,
    });
  };

  if (!variant) return null;

  const StatusIcon = statusConfig[variant.status].icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                       w-full max-w-md bg-background border border-border rounded-2xl 
                       shadow-2xl z-[60] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Pill className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-semibold">{variant.name}</h3>
                  <p className="text-sm text-muted-foreground">{variant.formulation}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={`${statusConfig[variant.status].color} gap-1`}>
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig[variant.status].label}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Package className="w-4 h-4" />
                    <span className="text-xs">Dosage</span>
                  </div>
                  <p className="font-medium text-lg">{variant.dosage}</p>
                </div>
                <div className="glass-panel p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">Approval Date</span>
                  </div>
                  <p className="font-medium">{new Date(variant.approvalDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="glass-panel p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Factory className="w-4 h-4" />
                  <span className="text-xs">Manufacturer</span>
                </div>
                <p className="font-medium">{variant.manufacturer}</p>
              </div>

              <div className="glass-panel p-4">
                <p className="text-xs text-muted-foreground mb-2">Variant ID</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">{variant.id}</code>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 pt-0">
              <Button onClick={handleViewStudies} className="w-full">
                View Clinical Studies
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
