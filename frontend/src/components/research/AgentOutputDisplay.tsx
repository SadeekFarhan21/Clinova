import { motion } from "framer-motion";
import { CheckCircle, FileText, Shield, Database, Code } from "lucide-react";

interface AgentOutputDisplayProps {
  currentStep: number; // 0-4 for agents 1-5
  stepData: {
    causalQuestion?: any;
    designSpec?: any;
    validation?: any;
    omopMapping?: any;
    code?: string;
  };
}

export const AgentOutputDisplay = ({ currentStep, stepData }: AgentOutputDisplayProps) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-5 px-6">
      {/* Step 1: Question Agent */}
      {currentStep >= 0 && stepData.causalQuestion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background/70 backdrop-blur-md border border-border/60 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold text-base">Question Agent Output</h3>
                {currentStep > 0 && <CheckCircle className="w-5 h-5 text-green-500" />}
              </div>
              <div className="text-sm text-muted-foreground space-y-3">
                <p className="font-medium text-foreground">Causal Question:</p>
                <p className="text-xs leading-relaxed">{stepData.causalQuestion.question}</p>
                {stepData.causalQuestion.pico && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-xs">
                      <span className="font-semibold">Population:</span> {stepData.causalQuestion.pico.population}
                    </div>
                    <div className="text-xs">
                      <span className="font-semibold">Intervention:</span> {stepData.causalQuestion.pico.intervention}
                    </div>
                    <div className="text-xs">
                      <span className="font-semibold">Comparator:</span> {stepData.causalQuestion.pico.comparator}
                    </div>
                    <div className="text-xs">
                      <span className="font-semibold">Outcome:</span> {stepData.causalQuestion.pico.outcome}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 2: Design Agent */}
      {currentStep >= 1 && stepData.designSpec && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background/70 backdrop-blur-md border border-border/60 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold text-base">Design Agent Output</h3>
                {currentStep > 1 && <CheckCircle className="w-5 h-5 text-green-500" />}
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-center gap-4 text-xs">
                  <span><span className="font-semibold">Pattern:</span> {stepData.designSpec.design_pattern}</span>
                  <span><span className="font-semibold">Version:</span> {stepData.designSpec.version}</span>
                </div>
                <div className="text-xs">
                  <span className="font-semibold">Eligibility Criteria:</span> {stepData.designSpec.eligibility_criteria?.length || 0} criteria defined
                </div>
                <div className="text-xs">
                  <span className="font-semibold">Outcome:</span> {stepData.designSpec.outcome_definition?.primary || 'Defined'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 3: Validator Agent */}
      {currentStep >= 2 && stepData.validation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background/70 backdrop-blur-md border border-border/60 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold text-base">Validator Agent Output</h3>
                {currentStep > 2 && <CheckCircle className="w-5 h-5 text-green-500" />}
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-center gap-4 text-xs">
                  <span className={`font-semibold ${stepData.validation.final_status === 'VALID' ? 'text-green-500' : 'text-yellow-500'}`}>
                    Status: {stepData.validation.final_status}
                  </span>
                  <span>Iterations: {stepData.validation.iterations}</span>
                </div>
                {stepData.validation.passed_gates && (
                  <div className="text-xs">
                    <span className="font-semibold">Passed Gates:</span> {stepData.validation.passed_gates.join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 4: OMOP Agent */}
      {currentStep >= 3 && stepData.omopMapping && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background/70 backdrop-blur-md border border-border/60 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Database className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold text-base">OMOP Agent Output</h3>
                {currentStep > 3 && <CheckCircle className="w-5 h-5 text-green-500" />}
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-center gap-4 text-xs">
                  <span><span className="font-semibold">Terms Mapped:</span> {stepData.omopMapping.terms_mapped}</span>
                  <span><span className="font-semibold">Vocabulary:</span> {stepData.omopMapping.vocabulary_version}</span>
                </div>
                {stepData.omopMapping.key_concepts && (
                  <div className="text-xs">
                    <span className="font-semibold">Key Concepts:</span> {Object.keys(stepData.omopMapping.key_concepts).length} concept groups
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 5: Code Agent */}
      {currentStep >= 4 && stepData.code && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background/70 backdrop-blur-md border border-border/60 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Code className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold text-base">Code Agent Output</h3>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-center gap-4 text-xs">
                  <span><span className="font-semibold">Language:</span> {stepData.code.language || 'Python'}</span>
                  <span><span className="font-semibold">Lines:</span> {stepData.code.lines_of_code || 'Generated'}</span>
                </div>
                <div className="text-xs">
                  <span className="font-semibold">Components:</span> Cohort construction, PS estimation, AIPW, Diagnostics
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
