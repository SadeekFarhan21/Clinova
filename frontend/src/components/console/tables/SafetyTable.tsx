import { motion } from "framer-motion";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield } from "lucide-react";
import type { SafetyEvent } from "@/data/drugs-mock-data";

interface SafetyTableProps {
  events: SafetyEvent[];
}

const severityColors: Record<string, string> = {
  mild: "bg-emerald-500/10 text-emerald-600",
  moderate: "bg-amber-500/10 text-amber-600",
  severe: "bg-destructive/10 text-destructive"
};

const statusColors: Record<string, string> = {
  investigating: "bg-amber-500/10 text-amber-600",
  resolved: "bg-emerald-500/10 text-emerald-600",
  monitoring: "bg-primary/10 text-primary"
};

export const SafetyTable = ({ events }: SafetyTableProps) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Shield className="w-10 h-10 mx-auto mb-3 opacity-50" />
        <p>No safety events reported</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <AlertTriangle className="w-4 h-4" />
        <span>{events.length} safety events on record</span>
      </div>
      
      <div className="glass-panel overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reported</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event, index) => (
              <motion.tr
                key={event.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-muted/30"
              >
                <TableCell className="font-medium">{event.eventType}</TableCell>
                <TableCell>
                  <Badge className={severityColors[event.severity]}>
                    {event.severity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[event.status]}>
                    {event.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(event.reportedDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                  {event.description}
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
