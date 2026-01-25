import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Available pre-trained models for drug analysis
const AVAILABLE_MODELS = {
  'warfarin-dosing': {
    name: 'Warfarin Dosing Optimizer',
    description: 'Predicts optimal warfarin dosage based on genetic and clinical factors',
    drugClass: 'Anticoagulants',
    version: '2.1.0',
  },
  'metformin-response': {
    name: 'Metformin Response Predictor',
    description: 'Predicts glycemic response to metformin therapy',
    drugClass: 'Antidiabetics',
    version: '1.8.0',
  },
  'statin-risk': {
    name: 'Statin Myopathy Risk Model',
    description: 'Assesses risk of statin-induced myopathy',
    drugClass: 'Lipid-lowering agents',
    version: '3.0.1',
  },
  'ace-inhibitor': {
    name: 'ACE Inhibitor Efficacy Model',
    description: 'Predicts blood pressure response to ACE inhibitors',
    drugClass: 'Antihypertensives',
    version: '2.4.0',
  },
  'opioid-risk': {
    name: 'Opioid Adverse Event Predictor',
    description: 'Risk stratification for opioid-related adverse events',
    drugClass: 'Analgesics',
    version: '1.5.2',
  },
  'immunotherapy-response': {
    name: 'Immunotherapy Response Model',
    description: 'Predicts response to checkpoint inhibitor therapy',
    drugClass: 'Oncology',
    version: '2.0.0',
  },
};

// Simulate model inference with realistic outputs
function runModelInference(modelId: string, ehrData: any, drugs: string[]) {
  const model = AVAILABLE_MODELS[modelId as keyof typeof AVAILABLE_MODELS];
  if (!model) {
    throw new Error(`Unknown model: ${modelId}`);
  }

  // Extract relevant patient features
  const conditions = ehrData.conditions?.map((c: any) => c.code?.text || 'Unknown') || [];
  const medications = ehrData.medications?.map((m: any) => m.medicationCodeableConcept?.text || 'Unknown') || [];
  const allergies = ehrData.allergies?.map((a: any) => a.code?.text || 'Unknown') || [];
  const labs = ehrData.labResults || [];

  // Simulate model predictions based on patient data
  const predictions: any = {
    modelId,
    modelName: model.name,
    modelVersion: model.version,
    analysisTimestamp: new Date().toISOString(),
    patientSummary: {
      activeConditions: conditions,
      currentMedications: medications,
      knownAllergies: allergies,
    },
    drugAnalysis: drugs.map(drug => {
      // Generate drug-specific analysis
      const hasInteraction = medications.some((med: string) => 
        med.toLowerCase().includes('lisinopril') && drug.toLowerCase().includes('potassium')
      );
      const hasAllergyRisk = allergies.some((allergy: string) => 
        drug.toLowerCase().includes(allergy.toLowerCase().split(' ')[0])
      );
      
      const riskScore = Math.random() * 0.4 + (hasInteraction ? 0.3 : 0) + (hasAllergyRisk ? 0.3 : 0);
      const efficacyScore = Math.random() * 0.3 + 0.6;

      return {
        drug,
        riskScore: Math.min(riskScore, 1).toFixed(3),
        efficacyPrediction: efficacyScore.toFixed(3),
        confidence: (0.85 + Math.random() * 0.1).toFixed(3),
        interactions: hasInteraction ? [
          {
            severity: 'moderate',
            interactingDrug: medications.find((m: string) => m.toLowerCase().includes('lisinopril')) || 'Current medication',
            mechanism: 'Potential pharmacodynamic interaction',
            recommendation: 'Monitor closely and consider dose adjustment',
          }
        ] : [],
        contraindications: hasAllergyRisk ? [
          {
            type: 'allergy',
            allergen: allergies[0],
            severity: 'high',
            recommendation: 'Avoid use due to documented allergy',
          }
        ] : [],
        recommendations: [
          'Review patient history before initiating therapy',
          efficacyScore > 0.7 ? 'Good predicted response based on patient profile' : 'Consider alternative agents',
          riskScore > 0.5 ? 'Enhanced monitoring recommended' : 'Standard monitoring protocol',
        ],
      };
    }),
    overallAssessment: {
      safetyScore: (1 - Math.random() * 0.3).toFixed(3),
      recommendedAction: drugs.length > 0 ? 'Proceed with caution and monitoring' : 'No drugs to analyze',
      clinicalNotes: 'This is a simulated model output for demonstration purposes.',
    },
  };

  return predictions;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, modelId, ehrData, drugs, analysisId } = await req.json();
    console.log(`Drug model action: ${action}, modelId: ${modelId}`);

    if (action === 'listModels') {
      return new Response(JSON.stringify({ models: AVAILABLE_MODELS }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'runAnalysis') {
      if (!modelId || !ehrData || !drugs?.length) {
        return new Response(JSON.stringify({ error: 'Missing required parameters: modelId, ehrData, drugs' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Simulate processing time for realism
      await new Promise(resolve => setTimeout(resolve, 1500));

      const result = runModelInference(modelId, ehrData, drugs);
      console.log(`Analysis complete for model: ${modelId}`);

      // Update analysis record in database if analysisId provided
      if (analysisId) {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        await supabase
          .from('patient_analyses')
          .update({
            analysis_result: result,
            status: 'completed',
          })
          .eq('id', analysisId);
      }

      return new Response(JSON.stringify({ result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Drug model error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
