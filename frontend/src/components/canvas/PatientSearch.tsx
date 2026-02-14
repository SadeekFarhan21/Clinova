import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, Calendar, Hash, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Patient {
  id: string;
  name: string;
  dob: string;
  gender: string;
  mrn: string;
}

interface PatientSearchProps {
  onPatientSelect: (patient: Patient) => void;
}

export const PatientSearch = ({ onPatientSelect }: PatientSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchPatients = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      console.warn('Patient search not configured');
      setResults([]);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchPatients();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="glass-panel p-6 rounded-2xl">
      <h3 className="font-display text-xl font-medium text-foreground mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-primary" />
        Patient Lookup (Epic Sandbox)
      </h3>
      
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter encrypted patient number..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 bg-background/50 border-border/50"
          />
        </div>
          <motion.button
            onClick={searchPatients}
            disabled={isSearching || !query.trim()}
            className="glass-button px-6"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 text-muted-foreground"
            >
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              Searching Epic sandbox...
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {results.map((patient, index) => (
                <motion.button
                  key={patient.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onPatientSelect(patient)}
                  className="w-full p-4 rounded-xl bg-background/30 border border-border/30 
                             hover:bg-primary/5 hover:border-primary/30 transition-all text-left
                             flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center
                                  group-hover:bg-primary/20 transition-colors">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{patient.name}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {patient.dob}
                      </span>
                      <span className="flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        MRN: {patient.mrn}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">{patient.gender}</span>
                </motion.button>
              ))}
            </motion.div>
          ) : hasSearched ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 text-muted-foreground"
            >
            No patients found. Try encrypted IDs: E1234567, E7654321, or E9876543.
            </motion.div>
          ) : (
            <motion.div
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 text-muted-foreground text-sm"
            >
              Enter encrypted ID: E1234567, E7654321, or E9876543
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
