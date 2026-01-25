import { motion } from "framer-motion";
import { 
  CheckCircle, AlertTriangle, XCircle, ArrowLeft, 
  Download, RotateCcw, Shield, TrendingUp, Activity
} from "lucide-react";

interface AnalysisResultsProps {
  result: any;
  patient: { name: string; mrn: string };
  onNewAnalysis: () => void;
  onBackToSearch: () => void;
}

const getRiskColor = (score: number) => {
  if (score < 0.3) return 'text-green-500';
  if (score < 0.6) return 'text-yellow-500';
  return 'text-red-500';
};

const getRiskLabel = (score: number) => {
  if (score < 0.3) return 'Low Risk';
  if (score < 0.6) return 'Moderate Risk';
  return 'High Risk';
};

export const AnalysisResults = ({ result, patient, onNewAnalysis, onBackToSearch }: AnalysisResultsProps) => {
  const downloadReport = () => {
    const reportData = JSON.stringify(result, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-${patient.mrn}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-5xl mx-auto"
    >
      <div className="glass-panel p-6 rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBackToSearch}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            New Patient
          </button>
          <div className="flex gap-3">
            <motion.button
              onClick={onNewAnalysis}
              className="glass-button-secondary flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RotateCcw className="w-4 h-4" />
              New Analysis
            </motion.button>
            <motion.button
              onClick={downloadReport}
              className="glass-button flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-4 h-4" />
              Download Report
            </motion.button>
          </div>
        </div>

        {/* Model Info */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-display font-medium">{result.modelName}</h2>
              <p className="text-sm text-muted-foreground">
                Version {result.modelVersion} • Patient: {patient.name} (MRN: {patient.mrn})
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Analysis completed</p>
              <p className="text-sm">{new Date(result.analysisTimestamp).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Overall Assessment */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-background/30 border border-border/30 text-center">
            <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-display font-bold">{result.overallAssessment.safetyScore}</p>
            <p className="text-sm text-muted-foreground">Safety Score</p>
          </div>
          <div className="p-4 rounded-xl bg-background/30 border border-border/30 text-center">
            <Activity className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-lg font-medium">{result.drugAnalysis.length}</p>
            <p className="text-sm text-muted-foreground">Drugs Analyzed</p>
          </div>
          <div className="p-4 rounded-xl bg-background/30 border border-border/30 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">{result.overallAssessment.recommendedAction}</p>
            <p className="text-xs text-muted-foreground mt-1">Recommendation</p>
          </div>
        </div>

        {/* Drug Analysis */}
        <h3 className="font-display text-lg font-medium mb-4">Drug-by-Drug Analysis</h3>
        <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
          {result.drugAnalysis.map((drug: any, index: number) => (
            <motion.div
              key={drug.drug}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-background/30 border border-border/30"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-lg">{drug.drug}</h4>
                  <p className="text-sm text-muted-foreground">Confidence: {(drug.confidence * 100).toFixed(0)}%</p>
                </div>
                <div className="text-right">
                  <p className={`font-display text-xl font-bold ${getRiskColor(parseFloat(drug.riskScore))}`}>
                    {(parseFloat(drug.riskScore) * 100).toFixed(0)}%
                  </p>
                  <p className={`text-sm ${getRiskColor(parseFloat(drug.riskScore))}`}>
                    {getRiskLabel(parseFloat(drug.riskScore))}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Efficacy */}
                <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Predicted Efficacy</span>
                  </div>
                  <p className="text-lg font-display">{(parseFloat(drug.efficacyPrediction) * 100).toFixed(0)}%</p>
                </div>

                {/* Interactions */}
                <div className={`p-3 rounded-lg ${
                  drug.interactions.length > 0 
                    ? 'bg-yellow-500/5 border border-yellow-500/20' 
                    : 'bg-background/30 border border-border/20'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className={`w-4 h-4 ${drug.interactions.length > 0 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-medium">Interactions</span>
                  </div>
                  {drug.interactions.length > 0 ? (
                    drug.interactions.map((int: any, i: number) => (
                      <div key={i} className="text-sm">
                        <p className="text-yellow-600">{int.severity}: {int.interactingDrug}</p>
                        <p className="text-xs text-muted-foreground">{int.recommendation}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No significant interactions detected</p>
                  )}
                </div>
              </div>

              {/* Contraindications */}
              {drug.contraindications.length > 0 && (
                <div className="mt-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-red-600">Contraindications</span>
                  </div>
                  {drug.contraindications.map((contra: any, i: number) => (
                    <div key={i} className="text-sm">
                      <p className="text-red-600">{contra.type}: {contra.allergen}</p>
                      <p className="text-xs text-muted-foreground">{contra.recommendation}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Recommendations */}
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-1">Recommendations:</p>
                <ul className="text-sm space-y-1">
                  {drug.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-3 rounded-lg bg-muted/50 text-center">
          <p className="text-xs text-muted-foreground">
            ⚠️ This is a simulated analysis for demonstration purposes. 
            Always consult with healthcare professionals for clinical decisions.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
