import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Atom, FlaskConical, BarChart3, Brain, Code2, Microscope, Target, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const sections = [
  { id: "overview", label: "Overview" },
  { id: "canvas", label: "Canvas" },
  { id: "drug-intelligence", label: "Drug Intelligence" },
  { id: "workflows", label: "Workflows" },
  { id: "vision", label: "Vision" },
];

export const DocumentationModal = ({ isOpen, onClose }: DocumentationModalProps) => {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-4 md:inset-10 lg:inset-20 bg-background border border-border 
                       rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted/60">
                  <Atom className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold text-foreground">Clinova Documentation</h2>
                  <p className="text-sm text-muted-foreground">Platform Guide & Reference</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted/60 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar Navigation */}
              <div className="hidden md:flex flex-col w-56 border-r border-border p-4 gap-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`px-3 py-2 rounded-lg text-left text-sm font-medium transition-colors
                               ${activeSection === section.id 
                                 ? "bg-muted text-foreground" 
                                 : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>

              {/* Mobile Navigation */}
              <div className="md:hidden flex gap-1 p-3 border-b border-border overflow-x-auto">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors
                               ${activeSection === section.id 
                                 ? "bg-foreground text-background" 
                                 : "bg-muted/60 text-muted-foreground"}`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>

              {/* Main Content */}
              <ScrollArea className="flex-1">
                <div className="p-6 md:p-8 max-w-3xl">
                  {activeSection === "overview" && <OverviewSection />}
                  {activeSection === "canvas" && <CanvasSection />}
                  {activeSection === "drug-intelligence" && <DrugIntelligenceSection />}
                  {activeSection === "workflows" && <WorkflowsSection />}
                  {activeSection === "vision" && <VisionSection />}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const OverviewSection = () => (
  <div className="space-y-8">
    <div>
      <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
        Welcome to Clinova
      </h3>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Clinova is a next-generation virtual biotechnology platform designed to accelerate 
        pharmaceutical research through AI-powered virtual clinical trials. Our infrastructure 
        enables researchers, pharmacologists, and biotech companies to simulate, analyze, and 
        validate drug efficacy with unprecedented precision.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        By leveraging advanced causal inference models, real-world evidence synthesis, and 
        automated protocol generation, Clinova reduces the time and cost of bringing new 
        therapeutics to market while maintaining the highest standards of scientific rigor.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FeatureCard
        icon={<FlaskConical className="w-5 h-5" />}
        title="Virtual Trials"
        description="Simulate clinical trials using real-world patient data and causal models."
      />
      <FeatureCard
        icon={<Brain className="w-5 h-5" />}
        title="AI-Powered Analysis"
        description="Automated protocol design and statistical analysis by intelligent agents."
      />
      <FeatureCard
        icon={<BarChart3 className="w-5 h-5" />}
        title="Real-Time Insights"
        description="Interactive dashboards with Kaplan-Meier curves, forest plots, and more."
      />
      <FeatureCard
        icon={<Target className="w-5 h-5" />}
        title="Medical-Grade Accuracy"
        description="Validated methodologies meeting regulatory and publication standards."
      />
    </div>

    <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
      <h4 className="font-medium text-foreground mb-2">Quick Start</h4>
      <ol className="text-sm text-muted-foreground space-y-2">
        <li><span className="text-foreground font-medium">1.</span> Navigate to the <span className="text-foreground">Canvas</span> to begin a new research workflow.</li>
        <li><span className="text-foreground font-medium">2.</span> Enter your clinical question and select target drugs.</li>
        <li><span className="text-foreground font-medium">3.</span> Let the AI agent design and execute your virtual trial.</li>
        <li><span className="text-foreground font-medium">4.</span> Review results in the <span className="text-foreground">Drug Intelligence Console</span>.</li>
      </ol>
    </div>
  </div>
);

const CanvasSection = () => (
  <div className="space-y-6">
    <div>
      <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
        Canvas Workspace
      </h3>
      <p className="text-muted-foreground leading-relaxed mb-4">
        The Canvas is Clinova's primary research interface—a flexible workspace where you can 
        initiate new studies, query patient databases, and orchestrate AI-driven analyses. 
        It serves as the command center for all virtual experimentation.
      </p>
    </div>

    <div className="space-y-4">
      <h4 className="font-medium text-foreground">Key Features</h4>
      
      <div className="space-y-3">
        <DocItem
          title="Research Workflow"
          description="Start by posing a clinical research question. The system generates candidate 
          hypotheses, designs appropriate study protocols, and identifies relevant patient cohorts 
          from connected data sources."
        />
        <DocItem
          title="Patient Analysis"
          description="Query encrypted patient records via secure EHR integrations. Search by 
          encrypted patient identifiers to retrieve anonymized health records for inclusion in 
          virtual trials."
        />
        <DocItem
          title="Drug Model Selection"
          description="Choose from existing validated drug models or create new ones. Each model 
          captures pharmacokinetic properties, known interactions, and therapeutic targets."
        />
        <DocItem
          title="Prompt Interface"
          description="Natural language interface for defining research parameters. Describe your 
          study objectives in plain English, and the AI translates them into executable protocols."
        />
      </div>
    </div>

    <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
      <div className="flex items-start gap-3">
        <Microscope className="w-5 h-5 text-muted-foreground mt-0.5" />
        <div>
          <h4 className="font-medium text-foreground mb-1">Pro Tip</h4>
          <p className="text-sm text-muted-foreground">
            Use specific, measurable outcomes in your research questions. For example, instead of 
            "Is Drug X effective?", ask "Does Drug X reduce 30-day mortality in patients with 
            Type 2 diabetes compared to standard care?"
          </p>
        </div>
      </div>
    </div>
  </div>
);

const DrugIntelligenceSection = () => (
  <div className="space-y-6">
    <div>
      <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
        Drug Intelligence Console
      </h3>
      <p className="text-muted-foreground leading-relaxed mb-4">
        The Drug Intelligence Console provides a comprehensive view of all compounds in your 
        research portfolio. Monitor experiment status, analyze safety signals, and drill into 
        detailed trial analytics—all from a single unified dashboard.
      </p>
    </div>

    <div className="space-y-4">
      <h4 className="font-medium text-foreground">Dashboard Components</h4>
      
      <div className="space-y-3">
        <DocItem
          title="KPI Cards"
          description="At-a-glance metrics showing active experiments, total patient records, 
          pending analyses, and safety alerts. Click any card to filter the main table."
        />
        <DocItem
          title="Compound Database"
          description="Searchable, sortable table of all drugs with status indicators, record 
          counts, variant information, and last-updated timestamps."
        />
        <DocItem
          title="Detail Drawer"
          description="Click any drug to open a side panel with tabs for Summary, Analysis, 
          Requests, Records, Variants, and Safety data."
        />
        <DocItem
          title="Trial Analysis Dashboard"
          description="Full statistical analysis suite including cohort flow diagrams, propensity 
          score distributions, covariate balance plots, Kaplan-Meier survival curves, forest 
          plots, cumulative incidence charts, and hazard ratio visualizations."
        />
      </div>
    </div>

    <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
      <h4 className="font-medium text-foreground mb-2">Available Filters</h4>
      <ul className="text-sm text-muted-foreground space-y-1">
        <li>• <span className="text-foreground">Status:</span> Active, Phase 1-3, Discontinued</li>
        <li>• <span className="text-foreground">Age Group:</span> Pediatric, Adult, Geriatric</li>
        <li>• <span className="text-foreground">Region:</span> North America, Europe, Asia-Pacific, Global</li>
        <li>• <span className="text-foreground">Date Range:</span> Last 7 days, 30 days, 90 days, Year, All time</li>
      </ul>
    </div>
  </div>
);

const WorkflowsSection = () => (
  <div className="space-y-6">
    <div>
      <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
        Experimentation Workflows
      </h3>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Clinova's AI agents guide you through a structured four-step workflow, from initial 
        question formulation to final analysis. Each step is automated yet transparent, 
        allowing full oversight of the research process.
      </p>
    </div>

    <div className="space-y-6">
      <WorkflowStep
        step="01"
        title="Clinical Question"
        description="Define your research hypothesis in natural language. The system parses your 
        question to identify the intervention, comparator, population, and outcome of interest."
        details={[
          "Supports PICO format (Population, Intervention, Comparison, Outcome)",
          "Auto-suggests related research questions from literature",
          "Validates feasibility based on available data"
        ]}
      />
      
      <WorkflowStep
        step="02"
        title="Agent Designs"
        description="The AI agent generates a rigorous virtual trial protocol, including inclusion/exclusion 
        criteria, propensity score matching strategy, and statistical analysis plan."
        details={[
          "Causal inference methodology selection",
          "Confounder identification and adjustment",
          "Power analysis and sample size estimation"
        ]}
      />
      
      <WorkflowStep
        step="03"
        title="Agent Codes"
        description="Automatically generates executable Python code implementing the designed protocol. 
        Code is version-controlled and fully auditable."
        details={[
          "Uses validated statistical libraries (statsmodels, lifelines, causalml)",
          "Reproducible analysis pipelines",
          "Exportable for external validation"
        ]}
      />
      
      <WorkflowStep
        step="04"
        title="Agent Analyzes"
        description="Executes the analysis and presents results in interactive, publication-ready 
        visualizations. Includes sensitivity analyses and robustness checks."
        details={[
          "Automated result interpretation",
          "Confidence intervals and p-values",
          "PDF export for regulatory submissions"
        ]}
      />
    </div>
  </div>
);

const VisionSection = () => (
  <div className="space-y-6">
    <div>
      <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
        Our Vision
      </h3>
      <p className="text-muted-foreground leading-relaxed mb-4">
        We believe the future of pharmaceutical development lies in the convergence of real-world 
        evidence, artificial intelligence, and rigorous causal methodology. Clinova is building 
        the infrastructure to make virtual biotechnology a reality.
      </p>
    </div>

    <div className="p-6 rounded-xl bg-gradient-to-br from-muted/60 to-muted/30 border border-border/60">
      <Sparkles className="w-8 h-8 text-foreground mb-4" />
      <blockquote className="font-serif text-xl text-foreground italic mb-4">
        "Accelerating drug discovery through virtual experimentation—bringing life-saving 
        therapeutics to patients faster, safer, and more affordably."
      </blockquote>
      <p className="text-sm text-muted-foreground">— The Clinova Mission</p>
    </div>

    <div className="space-y-4">
      <h4 className="font-medium text-foreground">What We're Building</h4>
      
      <div className="space-y-3">
        <DocItem
          title="Decentralized Trial Networks"
          description="Federated learning across healthcare systems, enabling analyses on distributed 
          patient data without centralized data collection."
        />
        <DocItem
          title="Regulatory-Grade Validation"
          description="Working with regulatory bodies to establish standards for virtual trial 
          evidence in drug approval processes."
        />
        <DocItem
          title="Open Science Integration"
          description="Seamless connection to publication databases, clinical trial registries, 
          and open-source research tools."
        />
        <DocItem
          title="Continuous Learning Models"
          description="AI models that improve over time as more studies are conducted, building 
          institutional knowledge into the platform."
        />
      </div>
    </div>

    <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
      <h4 className="font-medium text-foreground mb-2">Join Our Mission</h4>
      <p className="text-sm text-muted-foreground">
        Clinova is actively partnering with pharmaceutical companies, academic medical centers, 
        and healthcare organizations to expand the frontiers of virtual biotechnology. 
        Contact us to learn more about collaboration opportunities.
      </p>
    </div>
  </div>
);

// Helper Components
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
    <div className="p-2 rounded-lg bg-background/60 w-fit mb-3">
      {icon}
    </div>
    <h4 className="font-medium text-foreground mb-1">{title}</h4>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

const DocItem = ({ title, description }: { title: string; description: string }) => (
  <div className="pl-4 border-l-2 border-border">
    <h5 className="font-medium text-foreground mb-1">{title}</h5>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

const WorkflowStep = ({ step, title, description, details }: { step: string; title: string; description: string; details: string[] }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted/60 border border-border/60 
                    flex items-center justify-center text-sm font-medium text-muted-foreground">
      {step}
    </div>
    <div className="flex-1">
      <h4 className="font-medium text-foreground mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <ul className="text-sm text-muted-foreground space-y-1">
        {details.map((detail, i) => (
          <li key={i}>• {detail}</li>
        ))}
      </ul>
    </div>
  </div>
);

export default DocumentationModal;
