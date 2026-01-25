import { motion, AnimatePresence } from "framer-motion";
import { X, User, Building, Calendar, Users, FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { ExperimentRequest } from "@/data/drugs-mock-data";

interface RequestDetailModalProps {
  request: ExperimentRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusConfig: Record<string, { icon: any; color: string }> = {
  pending: { icon: Clock, color: "bg-amber-500/10 text-amber-600" },
  approved: { icon: CheckCircle, color: "bg-emerald-500/10 text-emerald-600" },
  completed: { icon: CheckCircle, color: "bg-primary/10 text-primary" },
  rejected: { icon: XCircle, color: "bg-destructive/10 text-destructive" }
};

export const RequestDetailModal = ({ request, isOpen, onClose }: RequestDetailModalProps) => {
  const { toast } = useToast();

  const handleApprove = () => {
    toast({
      title: "Request Approved",
      description: `${request?.doctorName}'s request has been approved.`,
    });
    onClose();
  };

  const handleReject = () => {
    toast({
      title: "Request Rejected",
      description: `${request?.doctorName}'s request has been rejected.`,
      variant: "destructive"
    });
    onClose();
  };

  if (!request) return null;

  const StatusIcon = statusConfig[request.status].icon;

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
                       w-full max-w-lg bg-background border border-border rounded-2xl 
                       shadow-2xl z-[60] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 className="text-lg font-display font-semibold">Experiment Request</h3>
                <p className="text-sm text-muted-foreground">Request ID: {request.id.slice(0, 8)}...</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={`${statusConfig[request.status].color} gap-1`}>
                  <StatusIcon className="w-3 h-3" />
                  {request.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date(request.requestDate).toLocaleDateString()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <User className="w-4 h-4" />
                    <span className="text-xs">Requesting Physician</span>
                  </div>
                  <p className="font-medium">{request.doctorName}</p>
                </div>
                <div className="glass-panel p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Building className="w-4 h-4" />
                    <span className="text-xs">Institution</span>
                  </div>
                  <p className="font-medium text-sm">{request.institution}</p>
                </div>
              </div>

              <div className="glass-panel p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-xs">Patient Count</span>
                </div>
                <p className="text-2xl font-display font-semibold">{request.patientCount}</p>
              </div>

              <div className="glass-panel p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs">Purpose</span>
                </div>
                <p className="text-sm">{request.purpose}</p>
              </div>
            </div>

            {/* Actions */}
            {request.status === "pending" && (
              <div className="p-6 pt-0 flex gap-3">
                <Button onClick={handleApprove} className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button onClick={handleReject} variant="destructive" className="flex-1">
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
