import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, FileCode, Image as ImageIcon, FileJson, Loader2 } from "lucide-react";
import { getExampleTrials } from "@/lib/api";

interface LogsViewerProps {
  onClose: () => void;
}

export const LogsViewer = ({ onClose }: LogsViewerProps) => {
  const [trials, setTrials] = useState<any[]>([]);
  const [selectedTrial, setSelectedTrial] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"json" | "code" | "images">("json");

  useEffect(() => {
    const loadTrials = async () => {
      try {
        const examples = await getExampleTrials();
        setTrials(examples);
        if (examples.length > 0) {
          setSelectedTrial(examples[0]);
        }
      } catch (error) {
        console.error("Failed to load trials:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTrials();
  }, []);

  const renderJsonData = () => {
    if (!selectedTrial?.data) return null;

    return (
      <div className="space-y-4">
        <div className="bg-background/40 rounded-lg p-4 border border-border/50">
          <h4 className="text-sm font-semibold text-foreground mb-2">Trial Configuration</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">Trial Name:</span>
              <p className="text-foreground font-medium">{selectedTrial.data.trial_config?.trial_name}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Trial ID:</span>
              <p className="text-foreground font-medium">{selectedTrial.data.trial_config?.trial_id}</p>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Population:</span>
              <p className="text-foreground">{selectedTrial.data.trial_config?.population}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Intervention:</span>
              <p className="text-foreground">{selectedTrial.data.trial_config?.intervention}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Comparator:</span>
              <p className="text-foreground">{selectedTrial.data.trial_config?.comparator}</p>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Outcome:</span>
              <p className="text-foreground">{selectedTrial.data.trial_config?.outcome}</p>
            </div>
          </div>
        </div>

        <div className="bg-background/40 rounded-lg p-4 border border-border/50">
          <h4 className="text-sm font-semibold text-foreground mb-2">Metadata</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">Status:</span>
              <p className="text-foreground font-medium capitalize">{selectedTrial.data.meta?.status}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Duration:</span>
              <p className="text-foreground">{selectedTrial.data.meta?.duration_seconds}s</p>
            </div>
          </div>
        </div>

        <div className="bg-background/40 rounded-lg p-4 border border-border/50 max-h-96 overflow-auto">
          <h4 className="text-sm font-semibold text-foreground mb-2">Full JSON Data</h4>
          <pre className="text-xs text-foreground/80 whitespace-pre-wrap font-mono">
            {JSON.stringify(selectedTrial.data, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  const renderCode = () => {
    if (!selectedTrial?.code) {
      return <p className="text-muted-foreground text-sm">No code available for this trial.</p>;
    }

    return (
      <div className="bg-background/40 rounded-lg p-4 border border-border/50 max-h-[600px] overflow-auto">
        <pre className="text-xs text-foreground font-mono whitespace-pre-wrap">
          {selectedTrial.code}
        </pre>
      </div>
    );
  };

  const renderImages = () => {
    if (!selectedTrial?.images || selectedTrial.images.length === 0) {
      return <p className="text-muted-foreground text-sm">No images available for this trial.</p>;
    }

    return (
      <div className="grid grid-cols-2 gap-4">
        {selectedTrial.images.map((imageName: string, idx: number) => (
          <div key={idx} className="bg-background/40 rounded-lg p-3 border border-border/50">
            <p className="text-xs text-muted-foreground mb-2">{imageName}</p>
            <img
              src={`http://localhost:8000/api/examples/${selectedTrial.id}/images/${imageName}`}
              alt={imageName}
              className="w-full rounded border border-border/30"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23333' width='400' height='300'/%3E%3Ctext fill='%23666' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage not found%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-background/95 backdrop-blur-xl rounded-xl border border-border/50 shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <h2 className="text-xl font-semibold text-foreground">Trial Logs & Data</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar - Trial Selection */}
            <div className="w-64 border-r border-border/50 p-4 overflow-y-auto bg-background/40">
              <h3 className="text-sm font-semibold text-foreground mb-3">Available Trials</h3>
              <div className="space-y-2">
                {trials.map((trial) => (
                  <button
                    key={trial.id}
                    onClick={() => setSelectedTrial(trial)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedTrial?.id === trial.id
                        ? "bg-primary/10 border-primary/50 text-foreground"
                        : "bg-background/60 border-border/30 text-muted-foreground hover:bg-background/80"
                    }`}
                  >
                    <p className="text-sm font-medium">{trial.name}</p>
                    <p className="text-xs opacity-70 mt-1">{trial.id}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Tabs */}
              <div className="flex items-center gap-2 p-4 border-b border-border/50 bg-background/40">
                <button
                  onClick={() => setActiveTab("json")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === "json"
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                  }`}
                >
                  <FileJson className="w-4 h-4" />
                  JSON Data
                </button>
                <button
                  onClick={() => setActiveTab("code")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === "code"
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                  }`}
                >
                  <FileCode className="w-4 h-4" />
                  Code
                </button>
                <button
                  onClick={() => setActiveTab("images")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === "images"
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  Images ({selectedTrial?.images?.length || 0})
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === "json" && renderJsonData()}
                {activeTab === "code" && renderCode()}
                {activeTab === "images" && renderImages()}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
