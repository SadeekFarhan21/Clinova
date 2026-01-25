import { motion } from "framer-motion";
import { 
  Pill, AlertTriangle, Activity, FlaskConical, 
  Heart, User, ArrowLeft, ChevronDown, ChevronUp 
} from "lucide-react";
import { useState } from "react";

interface EHRDisplayProps {
  patient: { name: string; dob: string; mrn: string; gender: string };
  ehrData: any;
  onBack: () => void;
  onProceed: () => void;
}

const Section = ({ 
  title, 
  icon: Icon, 
  children, 
  count,
  defaultOpen = true 
}: { 
  title: string; 
  icon: any; 
  children: React.ReactNode;
  count?: number;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-border/30 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between bg-background/30 hover:bg-background/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-primary" />
          <span className="font-medium">{title}</span>
          {count !== undefined && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="p-4 space-y-2"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

export const EHRDisplay = ({ patient, ehrData, onBack, onProceed }: EHRDisplayProps) => {
  const { medications = [], allergies = [], conditions = [], labResults = [], vitals = [] } = ehrData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="glass-panel p-6 rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to search
          </button>
          <motion.button
            onClick={onProceed}
            className="glass-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Select Drugs & Model →
          </motion.button>
        </div>

        {/* Patient Banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-display font-medium">{patient.name}</h2>
            <p className="text-sm text-muted-foreground">
              DOB: {patient.dob} • MRN: {patient.mrn} • {patient.gender}
            </p>
          </div>
        </div>

        {/* EHR Sections */}
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
          <Section title="Active Medications" icon={Pill} count={medications.length}>
            {medications.map((med: any, i: number) => (
              <div key={i} className="p-3 bg-background/30 rounded-lg">
                <p className="font-medium text-sm">{med.medicationCodeableConcept?.text}</p>
                <p className="text-xs text-muted-foreground">{med.dosage?.[0]?.text}</p>
              </div>
            ))}
          </Section>

          <Section title="Allergies" icon={AlertTriangle} count={allergies.length}>
            {allergies.map((allergy: any, i: number) => (
              <div key={i} className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                <p className="font-medium text-sm text-destructive">{allergy.code?.text}</p>
                <p className="text-xs text-muted-foreground">
                  {allergy.reaction?.[0]?.manifestation?.[0]?.text} 
                  {allergy.reaction?.[0]?.severity && ` (${allergy.reaction[0].severity})`}
                </p>
              </div>
            ))}
          </Section>

          <Section title="Active Conditions" icon={Activity} count={conditions.length}>
            {conditions.map((cond: any, i: number) => (
              <div key={i} className="p-3 bg-background/30 rounded-lg">
                <p className="font-medium text-sm">{cond.code?.text}</p>
                <p className="text-xs text-muted-foreground">Since {cond.onsetDateTime}</p>
              </div>
            ))}
          </Section>

          <Section title="Lab Results" icon={FlaskConical} count={labResults.length} defaultOpen={false}>
            <div className="grid grid-cols-2 gap-2">
              {labResults.map((lab: any, i: number) => (
                <div key={i} className="p-3 bg-background/30 rounded-lg">
                  <p className="font-medium text-sm">{lab.code?.text}</p>
                  <p className="text-lg font-display">
                    {lab.valueQuantity?.value} <span className="text-xs text-muted-foreground">{lab.valueQuantity?.unit}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{lab.effectiveDateTime}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Vitals" icon={Heart} count={vitals.length} defaultOpen={false}>
            {vitals.map((vital: any, i: number) => (
              <div key={i} className="p-3 bg-background/30 rounded-lg">
                <p className="font-medium text-sm">{vital.code?.text}</p>
                {vital.component ? (
                  <div className="flex gap-4">
                    {vital.component.map((comp: any, j: number) => (
                      <p key={j} className="text-lg font-display">
                        {comp.valueQuantity?.value} <span className="text-xs text-muted-foreground">{comp.valueQuantity?.unit}</span>
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-lg font-display">
                    {vital.valueQuantity?.value} <span className="text-xs text-muted-foreground">{vital.valueQuantity?.unit}</span>
                  </p>
                )}
              </div>
            ))}
          </Section>
        </div>
      </div>
    </motion.div>
  );
};
