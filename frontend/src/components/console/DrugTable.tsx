import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ChevronUp, ChevronDown, ArrowUpDown, 
  Users, FileText, Layers, Calendar 
} from "lucide-react";
import type { Drug } from "@/data/drugs-mock-data";

type SortKey = "name" | "experimentRequests" | "totalRecords" | "variantCount" | "lastUpdated";
type SortDirection = "asc" | "desc";

interface DrugTableProps {
  drugs: Drug[];
  isLoading: boolean;
  onDrugClick: (drug: Drug) => void;
  selectedDrugId: string | null;
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "phase-3": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "phase-2": "bg-orange-500/10 text-orange-600 border-orange-500/20",
  "phase-1": "bg-rose-500/10 text-rose-600 border-rose-500/20",
  discontinued: "bg-muted text-muted-foreground border-muted"
};

export const DrugTable = ({ drugs, isLoading, onDrugClick, selectedDrugId }: DrugTableProps) => {
  const [sortKey, setSortKey] = useState<SortKey>("experimentRequests");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sortedDrugs = [...drugs].sort((a, b) => {
    let comparison = 0;
    switch (sortKey) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "experimentRequests":
        comparison = a.experimentRequests - b.experimentRequests;
        break;
      case "totalRecords":
        comparison = a.totalRecords - b.totalRecords;
        break;
      case "variantCount":
        comparison = a.variantCount - b.variantCount;
        break;
      case "lastUpdated":
        comparison = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
        break;
    }
    return sortDir === "asc" ? comparison : -comparison;
  });

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown className="w-4 h-4 ml-1 opacity-40" />;
    return sortDir === "asc" 
      ? <ChevronUp className="w-4 h-4 ml-1" /> 
      : <ChevronDown className="w-4 h-4 ml-1" />;
  };

  if (isLoading) {
    return (
      <div className="glass-panel overflow-hidden">
        <div className="p-4 space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (drugs.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel p-12 text-center"
      >
        <div className="text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No drugs found</p>
          <p className="text-sm mt-1">Try adjusting your filters or search query</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel overflow-hidden"
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border/50">
            <TableHead 
              className="cursor-pointer select-none"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center font-semibold">
                Drug Name <SortIcon column="name" />
              </div>
            </TableHead>
            <TableHead>Class / Status</TableHead>
            <TableHead 
              className="cursor-pointer select-none text-right"
              onClick={() => handleSort("experimentRequests")}
            >
              <div className="flex items-center justify-end font-semibold">
                <Users className="w-4 h-4 mr-2" />
                Requests <SortIcon column="experimentRequests" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer select-none text-right"
              onClick={() => handleSort("totalRecords")}
            >
              <div className="flex items-center justify-end font-semibold">
                <FileText className="w-4 h-4 mr-2" />
                Records <SortIcon column="totalRecords" />
              </div>
            </TableHead>
            <TableHead className="text-center">Age Breakdown</TableHead>
            <TableHead 
              className="cursor-pointer select-none text-right"
              onClick={() => handleSort("variantCount")}
            >
              <div className="flex items-center justify-end font-semibold">
                <Layers className="w-4 h-4 mr-2" />
                Variants <SortIcon column="variantCount" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer select-none text-right"
              onClick={() => handleSort("lastUpdated")}
            >
              <div className="flex items-center justify-end font-semibold">
                <Calendar className="w-4 h-4 mr-2" />
                Updated <SortIcon column="lastUpdated" />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {sortedDrugs.map((drug, index) => (
              <motion.tr
                key={drug.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                onClick={() => onDrugClick(drug)}
                className={`cursor-pointer transition-colors group
                  ${selectedDrugId === drug.id 
                    ? 'bg-primary/10 border-l-2 border-l-primary' 
                    : 'hover:bg-muted/30'}`}
              >
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {drug.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{drug.genericName}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{drug.drugClass}</p>
                    <Badge variant="outline" className={statusColors[drug.status]}>
                      {drug.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {drug.experimentRequests.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {drug.totalRecords.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-1">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-muted-foreground">Ped</span>
                      <span className="text-xs font-medium">{(drug.ageBreakdown.pediatric / 1000).toFixed(1)}k</span>
                    </div>
                    <div className="w-px h-8 bg-border/50" />
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-muted-foreground">Adult</span>
                      <span className="text-xs font-medium">{(drug.ageBreakdown.adult / 1000).toFixed(1)}k</span>
                    </div>
                    <div className="w-px h-8 bg-border/50" />
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-muted-foreground">Ger</span>
                      <span className="text-xs font-medium">{(drug.ageBreakdown.geriatric / 1000).toFixed(1)}k</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {drug.variantCount}
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {new Date(drug.lastUpdated).toLocaleDateString()}
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </motion.div>
  );
};
