import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Epic Sandbox FHIR R4 endpoint
const EPIC_SANDBOX_BASE = 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4';

// Mock patient data for sandbox mode (Epic sandbox requires OAuth which we simulate)
const MOCK_PATIENTS: Record<string, any> = {
  'Tbt3KuCY0B5PSrJvCu2j-PlK.aiทdRqs0vBWZXlFnc': {
    id: 'Tbt3KuCY0B5PSrJvCu2j-PlK.aiทdRqs0vBWZXlFnc',
    name: 'Jason Argonaut',
    dob: '1985-08-01',
    gender: 'male',
    mrn: 'E1234567',
  },
  'erXuFYUfucBZaryVksYEcMg3': {
    id: 'erXuFYUfucBZaryVksYEcMg3',
    name: 'Camila Lopez',
    dob: '1987-09-12',
    gender: 'female',
    mrn: 'E7654321',
  },
  'eq081-VQEgP8drUUqCWzHfw3': {
    id: 'eq081-VQEgP8drUUqCWzHfw3',
    name: 'Derrick Lin',
    dob: '1973-06-03',
    gender: 'male',
    mrn: 'E9876543',
  },
};

// Generate realistic EHR data for sandbox
function generateMockEHR(patientId: string) {
  const patient = MOCK_PATIENTS[patientId];
  if (!patient) return null;

  return {
    patient: {
      resourceType: 'Patient',
      id: patient.id,
      name: [{ given: [patient.name.split(' ')[0]], family: patient.name.split(' ')[1] }],
      birthDate: patient.dob,
      gender: patient.gender,
      identifier: [{ system: 'urn:oid:1.2.840.114350.1.13.0.1.7.5.737384.14', value: patient.mrn }],
    },
    medications: [
      {
        resourceType: 'MedicationStatement',
        id: 'med-001',
        status: 'active',
        medicationCodeableConcept: {
          coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: '197361', display: 'Lisinopril 10 MG Oral Tablet' }],
          text: 'Lisinopril 10mg daily',
        },
        dosage: [{ text: '10mg once daily' }],
      },
      {
        resourceType: 'MedicationStatement',
        id: 'med-002',
        status: 'active',
        medicationCodeableConcept: {
          coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: '316672', display: 'Metformin 500 MG Oral Tablet' }],
          text: 'Metformin 500mg twice daily',
        },
        dosage: [{ text: '500mg twice daily with meals' }],
      },
    ],
    allergies: [
      {
        resourceType: 'AllergyIntolerance',
        id: 'allergy-001',
        clinicalStatus: { coding: [{ code: 'active' }] },
        code: {
          coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: '723', display: 'Amoxicillin' }],
          text: 'Amoxicillin',
        },
        reaction: [{ manifestation: [{ text: 'Hives, difficulty breathing' }], severity: 'severe' }],
      },
      {
        resourceType: 'AllergyIntolerance',
        id: 'allergy-002',
        clinicalStatus: { coding: [{ code: 'active' }] },
        code: { text: 'Sulfa drugs' },
        reaction: [{ manifestation: [{ text: 'Skin rash' }], severity: 'moderate' }],
      },
    ],
    conditions: [
      {
        resourceType: 'Condition',
        id: 'cond-001',
        clinicalStatus: { coding: [{ code: 'active' }] },
        code: {
          coding: [{ system: 'http://snomed.info/sct', code: '38341003', display: 'Hypertensive disorder' }],
          text: 'Essential Hypertension',
        },
        onsetDateTime: '2018-03-15',
      },
      {
        resourceType: 'Condition',
        id: 'cond-002',
        clinicalStatus: { coding: [{ code: 'active' }] },
        code: {
          coding: [{ system: 'http://snomed.info/sct', code: '44054006', display: 'Type 2 diabetes mellitus' }],
          text: 'Type 2 Diabetes Mellitus',
        },
        onsetDateTime: '2019-07-22',
      },
    ],
    labResults: [
      {
        resourceType: 'Observation',
        id: 'lab-001',
        status: 'final',
        code: { coding: [{ system: 'http://loinc.org', code: '4548-4', display: 'Hemoglobin A1c' }], text: 'HbA1c' },
        valueQuantity: { value: 7.2, unit: '%' },
        effectiveDateTime: '2024-01-10',
      },
      {
        resourceType: 'Observation',
        id: 'lab-002',
        status: 'final',
        code: { coding: [{ system: 'http://loinc.org', code: '2160-0', display: 'Creatinine' }], text: 'Serum Creatinine' },
        valueQuantity: { value: 1.1, unit: 'mg/dL' },
        effectiveDateTime: '2024-01-10',
      },
      {
        resourceType: 'Observation',
        id: 'lab-003',
        status: 'final',
        code: { coding: [{ system: 'http://loinc.org', code: '2085-9', display: 'HDL Cholesterol' }], text: 'HDL Cholesterol' },
        valueQuantity: { value: 45, unit: 'mg/dL' },
        effectiveDateTime: '2024-01-10',
      },
      {
        resourceType: 'Observation',
        id: 'lab-004',
        status: 'final',
        code: { coding: [{ system: 'http://loinc.org', code: '2089-1', display: 'LDL Cholesterol' }], text: 'LDL Cholesterol' },
        valueQuantity: { value: 142, unit: 'mg/dL' },
        effectiveDateTime: '2024-01-10',
      },
    ],
    vitals: [
      {
        resourceType: 'Observation',
        id: 'vital-001',
        status: 'final',
        code: { coding: [{ system: 'http://loinc.org', code: '85354-9', display: 'Blood pressure panel' }], text: 'Blood Pressure' },
        component: [
          { code: { text: 'Systolic' }, valueQuantity: { value: 138, unit: 'mmHg' } },
          { code: { text: 'Diastolic' }, valueQuantity: { value: 88, unit: 'mmHg' } },
        ],
        effectiveDateTime: '2024-01-15',
      },
      {
        resourceType: 'Observation',
        id: 'vital-002',
        status: 'final',
        code: { coding: [{ system: 'http://loinc.org', code: '29463-7', display: 'Body weight' }], text: 'Weight' },
        valueQuantity: { value: 185, unit: 'lbs' },
        effectiveDateTime: '2024-01-15',
      },
    ],
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, patientId, searchQuery } = await req.json();
    console.log(`Epic EHR action: ${action}, patientId: ${patientId}, searchQuery: ${searchQuery}`);

    if (action === 'search') {
      // Search for patients by MRN only (sandbox mode)
      const query = (searchQuery || '').toLowerCase();
      const results = Object.values(MOCK_PATIENTS)
        .filter((p: any) => 
          p.mrn.toLowerCase().includes(query)
        )
        .map((p: any) => ({
          id: p.id,
          name: p.name,
          dob: p.dob,
          gender: p.gender,
          mrn: p.mrn,
        }));
      
      console.log(`Search results: ${results.length} patients found`);
      return new Response(JSON.stringify({ patients: results }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'getEHR') {
      if (!patientId) {
        return new Response(JSON.stringify({ error: 'Patient ID required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const ehrData = generateMockEHR(patientId);
      if (!ehrData) {
        return new Response(JSON.stringify({ error: 'Patient not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log(`EHR data retrieved for patient: ${patientId}`);
      return new Response(JSON.stringify({ ehr: ehrData }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Epic EHR error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
