import { motion } from "framer-motion";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Database } from "lucide-react";
import type { DataRecord } from "@/data/drugs-mock-data";

interface RecordsTableProps {
  records: DataRecord[];
}

const ageGroupColors: Record<string, string> = {
  pediatric: "bg-chart-1/10 text-chart-1",
  adult: "bg-chart-2/10 text-chart-2",
  geriatric: "bg-chart-3/10 text-chart-3"
};

export const RecordsTable = ({ records }: RecordsTableProps) => {
  if (records.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Database className="w-10 h-10 mx-auto mb-3 opacity-50" />
        <p>No data records found</p>
      </div>
    );
  }

  return (
    <div className="glass-panel overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Age Group</TableHead>
            <TableHead>Data Type</TableHead>
            <TableHead>Region</TableHead>
            <TableHead className="text-right">Record Count</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record, index) => (
            <motion.tr
              key={record.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.03 }}
              className="hover:bg-muted/30"
            >
              <TableCell>
                <Badge className={ageGroupColors[record.ageGroup]}>
                  {record.ageGroup}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">{record.dataType}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{record.region}</TableCell>
              <TableCell className="text-right font-medium">
                {record.recordCount.toLocaleString()}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(record.lastUpdated).toLocaleDateString()}
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
