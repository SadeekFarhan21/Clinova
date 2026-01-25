import { motion } from "framer-motion";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import type { ExperimentRequest } from "@/data/drugs-mock-data";

interface RequestsTableProps {
  requests: ExperimentRequest[];
  onRequestClick: (request: ExperimentRequest) => void;
}

const statusConfig: Record<string, { icon: any; color: string }> = {
  pending: { icon: Clock, color: "bg-amber-500/10 text-amber-600" },
  approved: { icon: CheckCircle, color: "bg-emerald-500/10 text-emerald-600" },
  completed: { icon: CheckCircle, color: "bg-primary/10 text-primary" },
  rejected: { icon: XCircle, color: "bg-destructive/10 text-destructive" }
};

export const RequestsTable = ({ requests, onRequestClick }: RequestsTableProps) => {
  if (requests.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
        <p>No experiment requests found</p>
      </div>
    );
  }

  return (
    <div className="glass-panel overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Doctor</TableHead>
            <TableHead>Institution</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead className="text-center">Patients</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request, index) => {
            const StatusIcon = statusConfig[request.status].icon;
            return (
              <motion.tr
                key={request.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onRequestClick(request)}
                className="cursor-pointer hover:bg-muted/30"
              >
                <TableCell className="font-medium">{request.doctorName}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{request.institution}</TableCell>
                <TableCell className="text-sm max-w-[200px] truncate">{request.purpose}</TableCell>
                <TableCell className="text-center">{request.patientCount}</TableCell>
                <TableCell>
                  <Badge className={`${statusConfig[request.status].color} gap-1`}>
                    <StatusIcon className="w-3 h-3" />
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(request.requestDate).toLocaleDateString()}
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
