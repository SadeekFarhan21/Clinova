import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Atom, RefreshCw, Activity, TrendingUp, AlertCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MainLayout } from "@/layouts/MainLayout";
import { KPICards } from "@/components/console/KPICards";
import { GlobalFilters } from "@/components/console/GlobalFilters";
import { DrugTable } from "@/components/console/DrugTable";
import { DrugDetailDrawer } from "@/components/console/DrugDetailDrawer";
import { mockApi, type Drug } from "@/data/drugs-mock-data";

interface Filters {
  status: string;
  ageGroup: string;
  region: string;
  search: string;
  dateRange: string;
}

const DrugConsole = () => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [kpis, setKpis] = useState<any>(null);
  const [isLoadingDrugs, setIsLoadingDrugs] = useState(true);
  const [isLoadingKpis, setIsLoadingKpis] = useState(true);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [kpiFilter, setKpiFilter] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    status: "all",
    ageGroup: "all",
    region: "all",
    search: "",
    dateRange: "all"
  });
  const { toast } = useToast();

  const loadData = async () => {
    setIsLoadingDrugs(true);
    setIsLoadingKpis(true);

    const [drugsData, kpisData] = await Promise.all([
      mockApi.getDrugs(filters),
      mockApi.getKPIs()
    ]);

    setDrugs(drugsData);
    setKpis(kpisData);
    setIsLoadingDrugs(false);
    setIsLoadingKpis(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Listen for nav-reset event to clear selections
  useEffect(() => {
    const handleNavReset = (e: CustomEvent) => {
      if (e.detail.path === '/console') {
        setSelectedDrug(null);
        setIsDrawerOpen(false);
        setKpiFilter(null);
        handleClearFilters();
      }
    };

    window.addEventListener('nav-reset', handleNavReset as EventListener);
    return () => window.removeEventListener('nav-reset', handleNavReset as EventListener);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoadingDrugs(true);
      mockApi.getDrugs(filters).then(data => {
        setDrugs(data);
        setIsLoadingDrugs(false);
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: "all",
      ageGroup: "all",
      region: "all",
      search: "",
      dateRange: "all"
    });
    setKpiFilter(null);
  };

  const activeFilterCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === "search") return value !== "";
      return value !== "all";
    }).length;
  }, [filters]);

  const handleDrugClick = (drug: Drug) => {
    setSelectedDrug(drug);
    setIsDrawerOpen(true);
  };

  const handleKpiClick = (filter: string) => {
    if (kpiFilter === filter) {
      setKpiFilter(null);
    } else {
      setKpiFilter(filter);
      toast({
        title: `Filtering by ${filter}`,
        description: "Table updated to show relevant data",
      });
    }
  };

  const handleRefresh = () => {
    toast({
      title: "Refreshing Data",
      description: "Fetching latest drug intelligence...",
    });
    loadData();
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        {/* Hero Section */}
        <div className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-chart-2/5" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-chart-3/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="max-w-7xl mx-auto px-6 py-10 relative">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-5">
                <motion.div 
                  className="relative p-5 rounded-2xl bg-gradient-to-br from-chart-2/30 via-primary/20 to-chart-3/30 border border-white/20 shadow-2xl"
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {/* Animated glow rings */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-chart-2/40 to-chart-3/40 blur-xl"
                    animate={{ 
                      opacity: [0.5, 0.8, 0.5],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {/* Inner glow */}
                  <motion.div
                    className="absolute inset-1 rounded-xl bg-gradient-to-br from-white/10 to-transparent"
                  />
                  {/* DNA/Molecule inspired pattern */}
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-12 h-12 rounded-full border border-dashed border-white/20" />
                    </motion.div>
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-8 h-8 rounded-full border border-dotted border-chart-2/40" />
                    </motion.div>
                    <Atom className="relative w-10 h-10 text-foreground drop-shadow-lg" />
                  </div>
                </motion.div>
                <div>
                  <h1 className="text-4xl font-serif font-semibold text-foreground tracking-tight">
                    Drug Intelligence Console
                  </h1>
                  <p className="text-muted-foreground mt-1 text-lg">
                    Real-time analytics and experiment management
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Activity className="w-4 h-4 text-chart-2" />
                      <span>50 Active Compounds</span>
                    </div>
                    <div className="w-px h-4 bg-border" />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="w-4 h-4 text-chart-3" />
                      <span>Live Monitoring</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button onClick={handleRefresh} variant="outline" className="gap-2 bg-background/50 backdrop-blur-sm">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
                <Button className="gap-2 bg-primary/90 hover:bg-primary">
                  <AlertCircle className="w-4 h-4" />
                  View Alerts
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* KPI Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Key Metrics
              </h2>
              <span className="text-xs text-muted-foreground/60">
                Updated just now
              </span>
            </div>
            <KPICards 
              data={kpis} 
              isLoading={isLoadingKpis}
              onCardClick={handleKpiClick}
              activeFilter={kpiFilter}
            />
          </motion.div>

          {/* Global Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <GlobalFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              activeCount={activeFilterCount}
            />
          </motion.div>

          {/* Drug Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Compound Database
              </h2>
              {!isLoadingDrugs && (
                <span className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{drugs.length}</span> of 50 drugs
                </span>
              )}
            </div>
            <DrugTable 
              drugs={drugs}
              isLoading={isLoadingDrugs}
              onDrugClick={handleDrugClick}
              selectedDrugId={selectedDrug?.id || null}
            />
          </motion.div>
        </div>

        {/* Detail Drawer */}
        <DrugDetailDrawer 
          drug={selectedDrug}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      </div>
    </MainLayout>
  );
};

export default DrugConsole;
