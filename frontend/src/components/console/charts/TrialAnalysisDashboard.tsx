import { useRef } from "react";
import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CohortFlowChart } from "./CohortFlowChart";
import { PropensityScoreChartPersistent } from "./PropensityScoreChartPersistent";
import { CovariateBalanceChart } from "./CovariateBalanceChart";
import { PrimaryOutcomeChartPersistent } from "./PrimaryOutcomeChartPersistent";
import { ForestPlotChart } from "./ForestPlotChart";
import { CumulativeIncidenceChart } from "./CumulativeIncidenceChart";
import { ValidationSummaryPersistent } from "./ValidationSummaryPersistent";
import { ConclusionPanelPersistent } from "./ConclusionPanelPersistent";
import { KaplanMeierChart } from "./KaplanMeierChart";
import { HazardRatioChart } from "./HazardRatioChart";
import { getTrialData } from "@/lib/trial-data-store";

interface TrialAnalysisDashboardProps {
  drugId: string;
  drugName: string;
  totalRecords: number;
}

export const TrialAnalysisDashboard = ({ drugId, drugName, totalRecords }: TrialAnalysisDashboardProps) => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Get persistent trial data for this drug
  const trialData = getTrialData(drugId, drugName, totalRecords);

  const handleExportPDF = async () => {
    toast({
      title: "Generating PDF Report",
      description: "Preparing trial analysis report...",
    });
    
    try {
      // Dynamic import of html2canvas and jspdf
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      if (!dashboardRef.current) return;
      
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add title
      pdf.setFontSize(16);
      pdf.text(`${drugName} - Trial Emulation Analysis Report`, 10, 15);
      pdf.setFontSize(10);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 10, 22);
      
      // Add image (may span multiple pages)
      let yPosition = 30;
      let remainingHeight = imgHeight;
      let sourceY = 0;
      
      while (remainingHeight > 0) {
        const availableHeight = pageHeight - yPosition - 10;
        const sliceHeight = Math.min(remainingHeight, availableHeight);
        const sourceSliceHeight = (sliceHeight / imgHeight) * canvas.height;
        
        // Create a slice of the canvas
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sourceSliceHeight;
        const sliceCtx = sliceCanvas.getContext('2d');
        if (sliceCtx) {
          sliceCtx.drawImage(canvas, 0, sourceY, canvas.width, sourceSliceHeight, 0, 0, canvas.width, sourceSliceHeight);
          const sliceData = sliceCanvas.toDataURL('image/png');
          pdf.addImage(sliceData, 'PNG', 10, yPosition, imgWidth, sliceHeight);
        }
        
        remainingHeight -= sliceHeight;
        sourceY += sourceSliceHeight;
        
        if (remainingHeight > 0) {
          pdf.addPage();
          yPosition = 10;
        }
      }
      
      pdf.save(`${drugName.replace(/\s+/g, '_')}_Trial_Analysis.pdf`);
      
      toast({
        title: "PDF Generated",
        description: "Report has been downloaded successfully.",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Export Failed",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with export button */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between pb-4 border-b border-border"
      >
        <div className="text-center flex-1">
          <h3 className="font-display text-lg font-semibold">
            Target Trial Emulation Results
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {drugName} vs. Standard of Care Analysis
          </p>
        </div>
        <Button onClick={handleExportPDF} variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Export PDF
        </Button>
      </motion.div>

      <div ref={dashboardRef} className="space-y-6 bg-background p-1">
        {/* Row 1: Cohort Flow & Propensity Score */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-4"
          >
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">
              A. Cohort Selection Flow
            </h4>
            <CohortFlowChart 
              drugName={drugName}
              initialN={trialData.cohort.initialN}
              eligibleN={trialData.cohort.eligibleN}
              treatmentN={trialData.cohort.treatmentN}
              controlN={trialData.cohort.controlN}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-panel p-4"
          >
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">
              B. Propensity Score Distribution
            </h4>
            <PropensityScoreChartPersistent 
              drugName={drugName}
              overlapCoef={trialData.propensityScore.overlapCoef}
              essRatio={trialData.propensityScore.essRatio}
            />
          </motion.div>
        </div>

        {/* Row 2: Covariate Balance & Primary Outcome */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-4"
          >
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">
              C. Covariate Balance (Love Plot)
            </h4>
            <CovariateBalanceChart drugName={drugName} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-panel p-4"
          >
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">
              D. Primary Outcome
            </h4>
            <PrimaryOutcomeChartPersistent 
              drugName={drugName}
              data={trialData.primaryOutcome}
            />
          </motion.div>
        </div>

        {/* Row 3: Forest Plot & Cumulative Incidence */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-4"
          >
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">
              E. Subgroup Analysis (Forest Plot)
            </h4>
            <ForestPlotChart drugName={drugName} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-panel p-4"
          >
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">
              F. Cumulative Incidence
            </h4>
            <CumulativeIncidenceChart drugName={drugName} />
          </motion.div>
        </div>

        {/* Row 4: Kaplan-Meier & Hazard Ratio - NEW CHARTS */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel p-4"
          >
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">
              G. Kaplan-Meier Survival Curve
            </h4>
            <KaplanMeierChart 
              drugName={drugName}
              data={trialData.kaplanMeier}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
            className="glass-panel p-4"
          >
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">
              H. Hazard Ratio by Subgroup
            </h4>
            <HazardRatioChart 
              drugName={drugName}
              data={trialData.hazardRatio}
            />
          </motion.div>
        </div>

        {/* Row 5: Validation & Conclusion */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-panel p-4"
          >
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">
              I. Design Validation Summary
            </h4>
            <ValidationSummaryPersistent 
              drugName={drugName}
              iterations={trialData.validation.iterations}
              gatesPassed={trialData.validation.gatesPassed}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
            className="glass-panel p-4"
          >
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">
              J. Conclusion
            </h4>
            <ConclusionPanelPersistent 
              drugName={drugName}
              data={trialData.conclusion}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
