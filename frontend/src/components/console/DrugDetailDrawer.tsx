import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, AlertTriangle, CheckCircle, Clock, XCircle, FlaskConical } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { Drug, ExperimentRequest, DrugVariant } from "@/data/drugs-mock-data";
import { mockApi } from "@/data/drugs-mock-data";
import { RequestsChart } from "./charts/RequestsChart";
import { AgeDistributionChart } from "./charts/AgeDistributionChart";
import { RequestsTable } from "./tables/RequestsTable";
import { RecordsTable } from "./tables/RecordsTable";
import { VariantsGrid } from "./VariantsGrid";
import { SafetyTable } from "./tables/SafetyTable";
import { RequestDetailModal } from "./modals/RequestDetailModal";
import { VariantDetailModal } from "./modals/VariantDetailModal";
import { TrialAnalysisDashboard } from "./charts/TrialAnalysisDashboard";

interface DrugDetailDrawerProps {
  drug: Drug | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600",
  "phase-3": "bg-amber-500/10 text-amber-600",
  "phase-2": "bg-orange-500/10 text-orange-600",
  "phase-1": "bg-rose-500/10 text-rose-600",
  discontinued: "bg-muted text-muted-foreground"
};

export const DrugDetailDrawer = ({ drug, isOpen, onClose }: DrugDetailDrawerProps) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [requestsOverTime, setRequestsOverTime] = useState<{ month: string; requests: number }[]>([]);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ExperimentRequest | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<DrugVariant | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (drug && isOpen) {
      setIsLoadingChart(true);
      mockApi.getRequestsOverTime(drug.id).then(data => {
        setRequestsOverTime(data);
        setIsLoadingChart(false);
      });
    }
  }, [drug, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setActiveTab("summary");
    }
  }, [isOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: `Exporting ${drug?.name} data to CSV...`,
    });
  };

  if (!drug) return null;

  const ageData = [
    { name: "Pediatric", value: drug.ageBreakdown.pediatric, fill: "hsl(var(--chart-1))" },
    { name: "Adult", value: drug.ageBreakdown.adult, fill: "hsl(var(--chart-2))" },
    { name: "Geriatric", value: drug.ageBreakdown.geriatric, fill: "hsl(var(--chart-3))" }
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - covers full screen with blur on left side */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 top-16 z-40"
            >
              {/* Left side blur overlay */}
              <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-background/60 backdrop-blur-md" />
              {/* Right side subtle overlay */}
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-background/20" />
            </motion.div>

            {/* Drawer - takes exactly half the screen */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-16 bottom-0 w-1/2 bg-background border-l 
                         border-border shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-border">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-display font-semibold">{drug.name}</h2>
                    <Badge className={statusColors[drug.status]}>{drug.status}</Badge>
                  </div>
                  <p className="text-muted-foreground">{drug.genericName} • {drug.drugClass}</p>
                  <p className="text-sm text-muted-foreground mt-1">{drug.description}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <div className="border-b border-border px-6">
                  <TabsList className="h-12 w-full justify-start bg-transparent p-0 overflow-x-auto">
                    <TabsTrigger 
                      value="summary" 
                      className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    >
                      Summary
                    </TabsTrigger>
                    <TabsTrigger 
                      value="analysis"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none gap-1.5"
                    >
                      <FlaskConical className="w-3.5 h-3.5" />
                      Analysis
                    </TabsTrigger>
                    <TabsTrigger 
                      value="requests"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    >
                      Requests ({drug.experimentRequests})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="records"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    >
                      Records ({drug.totalRecords.toLocaleString()})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="variants"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    >
                      Variants ({drug.variantCount})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="safety"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    >
                      Safety
                    </TabsTrigger>
                  </TabsList>
                </div>

                <ScrollArea className="flex-1 [&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-12rem)]">
                  <TabsContent value="summary" className="p-6 m-0 space-y-6" forceMount={activeTab === "summary" ? true : undefined}>
                    {/* Stats row */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="glass-panel p-4 text-center">
                        <p className="text-2xl font-display font-semibold">{drug.experimentRequests}</p>
                        <p className="text-xs text-muted-foreground">Requests</p>
                      </div>
                      <div className="glass-panel p-4 text-center">
                        <p className="text-2xl font-display font-semibold">{(drug.totalRecords / 1000).toFixed(1)}k</p>
                        <p className="text-xs text-muted-foreground">Records</p>
                      </div>
                      <div className="glass-panel p-4 text-center">
                        <p className="text-2xl font-display font-semibold">{drug.variantCount}</p>
                        <p className="text-xs text-muted-foreground">Variants</p>
                      </div>
                      <div className="glass-panel p-4 text-center">
                        <p className="text-2xl font-display font-semibold">{drug.safetyEvents.length}</p>
                        <p className="text-xs text-muted-foreground">Safety Events</p>
                      </div>
                    </div>

                    {/* Charts row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="glass-panel p-4">
                        <h4 className="font-medium mb-4">Requests Over Time</h4>
                        {isLoadingChart ? (
                          <Skeleton className="h-48 w-full" />
                        ) : (
                          <RequestsChart data={requestsOverTime} />
                        )}
                      </div>
                      <div className="glass-panel p-4">
                        <h4 className="font-medium mb-4">Age Distribution</h4>
                        <AgeDistributionChart data={ageData} />
                      </div>
                    </div>

                    {/* Region & Last Updated */}
                    <div className="glass-panel p-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Primary Region</p>
                          <p className="font-medium">{drug.region}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Last Updated</p>
                          <p className="font-medium">{new Date(drug.lastUpdated).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleExport} className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Export Drug Data
                    </Button>
                  </TabsContent>

                  <TabsContent value="analysis" className="p-6 m-0" forceMount={activeTab === "analysis" ? true : undefined}>
                    <div className="h-full">
                      <TrialAnalysisDashboard 
                        drugId={drug.id}
                        drugName={drug.name}
                        totalRecords={drug.totalRecords}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="requests" className="p-6 m-0">
                    <RequestsTable 
                      requests={drug.requests} 
                      onRequestClick={setSelectedRequest}
                    />
                  </TabsContent>

                  <TabsContent value="records" className="p-6 m-0">
                    <RecordsTable records={drug.records} />
                  </TabsContent>

                  <TabsContent value="variants" className="p-6 m-0">
                    <VariantsGrid 
                      variants={drug.variants} 
                      onVariantClick={setSelectedVariant}
                    />
                  </TabsContent>

                  <TabsContent value="safety" className="p-6 m-0">
                    <SafetyTable events={drug.safetyEvents} />
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modals */}
      <RequestDetailModal 
        request={selectedRequest}
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
      <VariantDetailModal
        variant={selectedVariant}
        isOpen={!!selectedVariant}
        onClose={() => setSelectedVariant(null)}
      />
    </>
  );
};
