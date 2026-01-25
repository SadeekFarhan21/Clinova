import { Search, Filter, Calendar, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface Filters {
  status: string;
  ageGroup: string;
  region: string;
  search: string;
  dateRange: string;
}

interface GlobalFiltersProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
  onClearFilters: () => void;
  activeCount: number;
}

export const GlobalFilters = ({ filters, onFilterChange, onClearFilters, activeCount }: GlobalFiltersProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel p-4"
    >
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search drugs, classes, or generic names..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="pl-10 bg-background/50"
          />
        </div>

        {/* Status Filter */}
        <Select value={filters.status} onValueChange={(v) => onFilterChange("status", v)}>
          <SelectTrigger className="w-[140px] bg-background/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="phase-3">Phase 3</SelectItem>
            <SelectItem value="phase-2">Phase 2</SelectItem>
            <SelectItem value="phase-1">Phase 1</SelectItem>
            <SelectItem value="discontinued">Discontinued</SelectItem>
          </SelectContent>
        </Select>

        {/* Age Group Filter */}
        <Select value={filters.ageGroup} onValueChange={(v) => onFilterChange("ageGroup", v)}>
          <SelectTrigger className="w-[140px] bg-background/50">
            <SelectValue placeholder="Age Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ages</SelectItem>
            <SelectItem value="pediatric">Pediatric</SelectItem>
            <SelectItem value="adult">Adult</SelectItem>
            <SelectItem value="geriatric">Geriatric</SelectItem>
          </SelectContent>
        </Select>

        {/* Region Filter */}
        <Select value={filters.region} onValueChange={(v) => onFilterChange("region", v)}>
          <SelectTrigger className="w-[160px] bg-background/50">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="North America">North America</SelectItem>
            <SelectItem value="Europe">Europe</SelectItem>
            <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
            <SelectItem value="Latin America">Latin America</SelectItem>
            <SelectItem value="Middle East">Middle East</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range */}
        <Select value={filters.dateRange} onValueChange={(v) => onFilterChange("dateRange", v)}>
          <SelectTrigger className="w-[140px] bg-background/50">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
            <SelectItem value="1y">Last Year</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        <AnimatePresence>
          {activeCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear
                <Badge variant="secondary" className="ml-1">{activeCount}</Badge>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
