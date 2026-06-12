// Nómina Oficial PIE 2026 — Colegio San Lucas de Lo Espejo.
// Generado desde "Lista Oficial PIE 2026 .xlsm". No editar a mano: regenerar desde el libro oficial.
// Hojas consolidadas: Cupos PIE, Sobrecupos, PENDIENTES- SC e Identificacion Profesionales.
// 313 estudiantes únicos por RUT/nombre, 420 registros de origen y 31 profesionales.

export type PieRosterSourceRecord = {
  sheet: string;
  status: string;
  classification: string;
  courseCode: string;
  course: string;
  auto: string;
  rut: string;
  birthDate: string;
  name: string;
  entryYear: string;
  professional: string;
  diag: string;
  situacion: string;
  tipoNEE: string;
  diagDate: string;
  evaluatorRut: string;
  evaluator: string;
  specialty: string;
  platformStatus: string;
  approvedPreviousYears: string;
  scannerStatus: string;
  loadedDocument: string;
  pendingDocument: string;
  deadline: string;
  appealResult: string;
  finalResult: string;
  siblings: string;
};

export type PieRosterEntry = {
  name: string;
  rut: string;
  course: string;
  birthDate: string;
  entryYear: string;
  diag: string;
  diagnoses: string[];
  situacion: string;
  situaciones: string[];
  tipoNEE: string;
  professional: string;
  professionals: string[];
  diagDate: string;
  evaluator: string;
  evaluators: string[];
  specialty: string;
  specialties: string[];
  cupo: string;
  sourceSheets: string[];
  classifications: string[];
  platformStatus: string;
  scannerStatus: string;
  loadedDocument: string;
  pendingDocument: string;
  deadline: string;
  approvedPreviousYears: string;
  appealResult: string;
  finalResult: string;
  siblings: string;
  records: PieRosterSourceRecord[];
};

export type PieProfessional = {
  name: string;
  cargo: string;
  specialty: string;
  email: string;
};

export const PIE_ROSTER: PieRosterEntry[] = [
  {
    "name": "Aaron Patricio Carrasco Coronado",
    "rut": "26.883.478-8",
    "course": "1° Básico A",
    "birthDate": "20/06/2019",
    "entryYear": "2024",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Villagra",
    "professionals": [
      "Daniela Villagra"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Pendiente",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos",
      "Pendientes"
    ],
    "classifications": [
      "S.CUPO",
      "4"
    ],
    "platformStatus": "OK",
    "scannerStatus": "NO",
    "loadedDocument": "",
    "pendingDocument": "- DUDA EN PLATAFORMA: PROBABLE, PSICOPEDAGOGICO, FONO Y PSICO.",
    "deadline": "(Por definir el mier 3-6)",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "1EBA",
        "course": "1° Básico A",
        "auto": "4",
        "rut": "26.883.478-8",
        "birthDate": "20/06/2019",
        "name": "Aaron Patricio Carrasco Coronado",
        "entryYear": "2024",
        "professional": "Daniela Villagra",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "19-07-2024",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "4",
        "courseCode": "1EBA",
        "course": "1° Básico A",
        "auto": "4",
        "rut": "26.883.478-8",
        "birthDate": "20/06/2019",
        "name": "Aaron Patricio Carrasco Coronado",
        "entryYear": "2024",
        "professional": "Daniela Villagra",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "NO",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "19-07-2024",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      },
      {
        "sheet": "Pendientes",
        "status": "Pendiente",
        "classification": "S.CUPO",
        "courseCode": "1EBA",
        "course": "1° Básico A",
        "auto": "4",
        "rut": "26.883.478-8",
        "birthDate": "20/06/2019",
        "name": "Aaron Patricio Carrasco Coronado",
        "entryYear": "2024",
        "professional": "Daniela Villagra",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "scannerStatus": "NO",
        "pendingDocument": "- DUDA EN PLATAFORMA: PROBABLE, PSICOPEDAGOGICO, FONO Y PSICO.",
        "deadline": "(Por definir el mier 3-6)",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "19-07-2024",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "approvedPreviousYears": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Agustina Helena Velásquez Troncoso",
    "rut": "27.039.657-7",
    "course": "1° Básico A",
    "birthDate": "2019-10-06",
    "entryYear": "2026",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Villagra",
    "professionals": [
      "Daniela Villagra"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "6"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "1EBA",
        "course": "1° Básico A",
        "auto": "6",
        "rut": "27.039.657-7",
        "birthDate": "2019-10-06",
        "name": "Agustina Helena Velásquez Troncoso",
        "entryYear": "2026",
        "professional": "Daniela Villagra",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "2026-05-28",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "6",
        "courseCode": "1EBA",
        "course": "1° Básico A",
        "auto": "6",
        "rut": "27.039.657-7",
        "birthDate": "2019-10-06",
        "name": "Agustina Helena Velásquez Troncoso",
        "entryYear": "2026",
        "professional": "Daniela Villagra",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "2026-05-28",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Agustina Ignacia González Escudero",
    "rut": "26.706.940-9",
    "course": "1° Básico A",
    "birthDate": "13/02/2019",
    "entryYear": "2023",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 4",
    "situaciones": [
      "NEEP - INICIO AÑO 4"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Villagra",
    "professionals": [
      "Daniela Villagra"
    ],
    "diagDate": "13692760-4",
    "evaluator": "Carolina Donoso",
    "evaluators": [
      "Carolina Donoso"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "1EBA",
        "course": "1° Básico A",
        "auto": "",
        "rut": "26.706.940-9",
        "birthDate": "13/02/2019",
        "name": "Agustina Ignacia González Escudero",
        "entryYear": "2023",
        "professional": "Daniela Villagra",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 4",
        "tipoNEE": "Permanente",
        "diagDate": "13692760-4",
        "evaluatorRut": "26-01-2023",
        "evaluator": "Carolina Donoso",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Alessandro Javier Velezmoro Cruz",
    "rut": "26.830.568-8",
    "course": "1° Básico A",
    "birthDate": "13/05/2019",
    "entryYear": "2025",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Daniela Villagra",
    "professionals": [
      "Daniela Villagra"
    ],
    "diagDate": "15.933.973-4",
    "evaluator": "Natalie Sepúlveda",
    "evaluators": [
      "Natalie Sepúlveda"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "1EBA",
        "course": "1° Básico A",
        "auto": "",
        "rut": "26.830.568-8",
        "birthDate": "13/05/2019",
        "name": "Alessandro Javier Velezmoro Cruz",
        "entryYear": "2025",
        "professional": "Daniela Villagra",
        "diag": "TL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "15.933.973-4",
        "evaluatorRut": "28-11-2024",
        "evaluator": "Natalie Sepúlveda",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Benjamín Edward Aguayo Figueroa",
    "rut": "27.173.672-K",
    "course": "1° Básico A",
    "birthDate": "21/01/2020",
    "entryYear": "2024",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
    "situaciones": [
      "NEET - INICIO AÑO 1 (REINGRESO)"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Daniela Villagra",
    "professionals": [
      "Daniela Villagra"
    ],
    "diagDate": "19.562.388-0",
    "evaluator": "Valeria Andrades",
    "evaluators": [
      "Valeria Andrades"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "1EBA",
        "course": "1° Básico A",
        "auto": "",
        "rut": "27.173.672-K",
        "birthDate": "21/01/2020",
        "name": "Benjamín Edward Aguayo Figueroa",
        "entryYear": "2024",
        "professional": "Daniela Villagra",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-0",
        "evaluatorRut": "03-11-2025",
        "evaluator": "Valeria Andrades",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Isabella Elizabeth Curiqueo González",
    "rut": "26.965.615-8",
    "course": "1° Básico A",
    "birthDate": "13/08/2019",
    "entryYear": "2025",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Daniela Villagra",
    "professionals": [
      "Daniela Villagra"
    ],
    "diagDate": "23.366.740-4",
    "evaluator": "Margarita Alvarado",
    "evaluators": [
      "Margarita Alvarado"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "1EBA",
        "course": "1° Básico A",
        "auto": "",
        "rut": "26.965.615-8",
        "birthDate": "13/08/2019",
        "name": "Isabella Elizabeth Curiqueo González",
        "entryYear": "2025",
        "professional": "Daniela Villagra",
        "diag": "TL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "23.366.740-4",
        "evaluatorRut": "10-03-2025",
        "evaluator": "Margarita Alvarado",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Isadora Juliette Faray Cabrera",
    "rut": "26.845.086-6",
    "course": "1° Básico A",
    "birthDate": "24/05/2019",
    "entryYear": "2024",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
    "situaciones": [
      "NEET - INICIO AÑO 1 (REINGRESO)"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Daniela Villagra",
    "professionals": [
      "Daniela Villagra"
    ],
    "diagDate": "19.562.388-0",
    "evaluator": "Valeria Andrades",
    "evaluators": [
      "Valeria Andrades"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "1EBA",
        "course": "1° Básico A",
        "auto": "",
        "rut": "26.845.086-6",
        "birthDate": "24/05/2019",
        "name": "Isadora Juliette Faray Cabrera",
        "entryYear": "2024",
        "professional": "Daniela Villagra",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-0",
        "evaluatorRut": "03-11-2025",
        "evaluator": "Valeria Andrades",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Joaquín Eliel Jacob Contreras Neira",
    "rut": "26.817.593-8",
    "course": "1° Básico A",
    "birthDate": "29/04/2019",
    "entryYear": "2024",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 3",
    "situaciones": [
      "NEEP - INICIO AÑO 3"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Villagra",
    "professionals": [
      "Daniela Villagra"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "1EBA",
        "course": "1° Básico A",
        "auto": "",
        "rut": "26.817.593-8",
        "birthDate": "29/04/2019",
        "name": "Joaquín Eliel Jacob Contreras Neira",
        "entryYear": "2024",
        "professional": "Daniela Villagra",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "14-03-2024",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "José Francisco Vilches Pacheco",
    "rut": "26.960.301-1",
    "course": "1° Básico A",
    "birthDate": "06/08/2019",
    "entryYear": "2024",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Villagra",
    "professionals": [
      "Daniela Villagra"
    ],
    "diagDate": "4597979-2",
    "evaluator": "Emilio Fernández",
    "evaluators": [
      "Emilio Fernández"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "1EBA",
        "course": "1° Básico A",
        "auto": "2025",
        "rut": "26.960.301-1",
        "birthDate": "06/08/2019",
        "name": "José Francisco Vilches Pacheco",
        "entryYear": "2024",
        "professional": "Daniela Villagra",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "4597979-2",
        "evaluatorRut": "29-01-2025",
        "evaluator": "Emilio Fernández",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "1EBA",
        "course": "1° Básico A",
        "auto": "2025",
        "rut": "26.960.301-1",
        "birthDate": "06/08/2019",
        "name": "José Francisco Vilches Pacheco",
        "entryYear": "2024",
        "professional": "Daniela Villagra",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "4597979-2",
        "evaluatorRut": "29-01-2025",
        "evaluator": "Emilio Fernández",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "José Miguel Alberto Riquelme Mellado",
    "rut": "26.945.006-1",
    "course": "1° Básico A",
    "birthDate": "28/07/2019",
    "entryYear": "2026",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Villagra",
    "professionals": [
      "Daniela Villagra"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "5"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "1EBA",
        "course": "1° Básico A",
        "auto": "5",
        "rut": "26.945.006-1",
        "birthDate": "28/07/2019",
        "name": "José Miguel Alberto Riquelme Mellado",
        "entryYear": "2026",
        "professional": "Daniela Villagra",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "19-03-2026",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "5",
        "courseCode": "1EBA",
        "course": "1° Básico A",
        "auto": "5",
        "rut": "26.945.006-1",
        "birthDate": "28/07/2019",
        "name": "José Miguel Alberto Riquelme Mellado",
        "entryYear": "2026",
        "professional": "Daniela Villagra",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "19-03-2026",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Karla Alexia Fernández Rivera",
    "rut": "26.601.376-0",
    "course": "1° Básico A",
    "birthDate": "02/12/2018",
    "entryYear": "2026",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Daniela Villagra",
    "professionals": [
      "Daniela Villagra"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "1EBA",
        "course": "1° Básico A",
        "auto": "",
        "rut": "26.601.376-0",
        "birthDate": "02/12/2018",
        "name": "Karla Alexia Fernández Rivera",
        "entryYear": "2026",
        "professional": "Daniela Villagra",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "13-03-2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Santiago Alonso Bello Acevedo",
    "rut": "26.899.762-8",
    "course": "1° Básico A",
    "birthDate": "01/07/2019",
    "entryYear": "2024",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 3",
    "situaciones": [
      "NEEP - INICIO AÑO 3"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Villagra",
    "professionals": [
      "Daniela Villagra"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Lema Carlos Zambrano",
    "evaluators": [
      "Daniela Granado",
      "Lema Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Neurología",
      "Psiquiatría"
    ],
    "cupo": "Pendiente",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos",
      "Pendientes"
    ],
    "classifications": [
      "S.CUPO",
      "3"
    ],
    "platformStatus": "OK",
    "scannerStatus": "NO",
    "loadedDocument": "",
    "pendingDocument": "- DUDA EN PLATAFORMA: PROBABLE, PSICOPEDAGOGICO, FONO Y PSICO.",
    "deadline": "(Por definir el mier 3-6)",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "1EBA",
        "course": "1° Básico A",
        "auto": "3",
        "rut": "26.899.762-8",
        "birthDate": "01/07/2019",
        "name": "Santiago Alonso Bello Acevedo",
        "entryYear": "2024",
        "professional": "Daniela Villagra",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "diagDate": "24.457.733-4",
        "evaluatorRut": "2025-01-28",
        "evaluator": "Daniela Granado",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "3",
        "courseCode": "1EBA",
        "course": "1° Básico A",
        "auto": "3",
        "rut": "26.899.762-8",
        "birthDate": "01/07/2019",
        "name": "Santiago Alonso Bello Acevedo",
        "entryYear": "2024",
        "professional": "Daniela Villagra",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "NO",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "09-05-2024",
        "evaluator": "Lema Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      },
      {
        "sheet": "Pendientes",
        "status": "Pendiente",
        "classification": "S.CUPO",
        "courseCode": "1EBA",
        "course": "1° Básico A",
        "auto": "3",
        "rut": "26.899.762-8",
        "birthDate": "01/07/2019",
        "name": "Santiago Alonso Bello Acevedo",
        "entryYear": "2024",
        "professional": "Daniela Villagra",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "scannerStatus": "NO",
        "pendingDocument": "- DUDA EN PLATAFORMA: PROBABLE, PSICOPEDAGOGICO, FONO Y PSICO.",
        "deadline": "(Por definir el mier 3-6)",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "09-05-2024",
        "evaluator": "Lema Carlos Zambrano",
        "specialty": "Psiquiatría",
        "approvedPreviousYears": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Agustina Fernanda Muñoz Arancibia",
    "rut": "26.851.678-6",
    "course": "1° Básico B",
    "birthDate": "27/05/2019",
    "entryYear": "2025",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Daniela Villagra",
    "professionals": [
      "Daniela Villagra"
    ],
    "diagDate": "23.366.740-4",
    "evaluator": "Margarita Alvarado",
    "evaluators": [
      "Margarita Alvarado"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "1EBB",
        "course": "1° Básico B",
        "auto": "",
        "rut": "26.851.678-6",
        "birthDate": "27/05/2019",
        "name": "Agustina Fernanda Muñoz Arancibia",
        "entryYear": "2025",
        "professional": "Daniela Villagra",
        "diag": "TL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "23.366.740-4",
        "evaluatorRut": "10-03-2025",
        "evaluator": "Margarita Alvarado",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Amaris Alexandra Miño Cortés",
    "rut": "27.187.775-7",
    "course": "1° Básico B",
    "birthDate": "01/02/2020",
    "entryYear": "2024",
    "diag": "GARC",
    "diagnoses": [
      "GARC"
    ],
    "situacion": "NEEP - INICIO AÑO 3",
    "situaciones": [
      "NEEP - INICIO AÑO 3"
    ],
    "tipoNEE": "Permanente",
    "professional": "Ana Zamora",
    "professionals": [
      "Ana Zamora"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "1EBB",
        "course": "1° Básico B",
        "auto": "2024",
        "rut": "27.187.775-7",
        "birthDate": "01/02/2020",
        "name": "Amaris Alexandra Miño Cortés",
        "entryYear": "2024",
        "professional": "Ana Zamora",
        "diag": "GARC",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "03-05-2024",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "1EBB",
        "course": "1° Básico B",
        "auto": "2024",
        "rut": "27.187.775-7",
        "birthDate": "01/02/2020",
        "name": "Amaris Alexandra Miño Cortés",
        "entryYear": "2024",
        "professional": "Ana Zamora",
        "siblings": "",
        "diag": "GARC",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "03-05-2024",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Amaro Anthuan Ñancupil Oyarzún",
    "rut": "27.205.505-K",
    "course": "1° Básico B",
    "birthDate": "11/02/2020",
    "entryYear": "2024",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Villagra",
    "professionals": [
      "Daniela Villagra"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "7"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "1EBB",
        "course": "1° Básico B",
        "auto": "7",
        "rut": "27.205.505-K",
        "birthDate": "11/02/2020",
        "name": "Amaro Anthuan Ñancupil Oyarzún",
        "entryYear": "2024",
        "professional": "Daniela Villagra",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "10-07-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "7",
        "courseCode": "1EBB",
        "course": "1° Básico B",
        "auto": "7",
        "rut": "27.205.505-K",
        "birthDate": "11/02/2020",
        "name": "Amaro Anthuan Ñancupil Oyarzún",
        "entryYear": "2024",
        "professional": "Daniela Villagra",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "10-07-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Cattleya Isabella Suarez Salinas",
    "rut": "27.089.466-6",
    "course": "1° Básico B",
    "birthDate": "17/11/2019",
    "entryYear": "2025",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Daniela Villagra",
    "professionals": [
      "Daniela Villagra"
    ],
    "diagDate": "23.366.740-4",
    "evaluator": "Margarita Alvarado",
    "evaluators": [
      "Margarita Alvarado"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "1EBB",
        "course": "1° Básico B",
        "auto": "",
        "rut": "27.089.466-6",
        "birthDate": "17/11/2019",
        "name": "Cattleya Isabella Suarez Salinas",
        "entryYear": "2025",
        "professional": "Daniela Villagra",
        "diag": "TL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "23.366.740-4",
        "evaluatorRut": "10-03-2025",
        "evaluator": "Margarita Alvarado",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Dionis Maicol Cuadra Poblete",
    "rut": "26.891.055-7",
    "course": "1° Básico B",
    "birthDate": "2019-06-23",
    "entryYear": "2026",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Ana Zamora",
    "professionals": [
      "Ana Zamora"
    ],
    "diagDate": "20.930.987-5",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "10"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "1EBB",
        "course": "1° Básico B",
        "auto": "10",
        "rut": "26.891.055-7",
        "birthDate": "2019-06-23",
        "name": "Dionis Maicol Cuadra Poblete",
        "entryYear": "2026",
        "professional": "Ana Zamora",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-5",
        "evaluatorRut": "2026-05-13",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "10",
        "courseCode": "1EBB",
        "course": "1° Básico B",
        "auto": "10",
        "rut": "26.891.055-7",
        "birthDate": "2019-06-23",
        "name": "Dionis Maicol Cuadra Poblete",
        "entryYear": "2026",
        "professional": "Ana Zamora",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "20.930.987-5",
        "evaluatorRut": "2026-05-13",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Gaspar Gael Reyes Muñoz",
    "rut": "27.137.961-7",
    "course": "1° Básico B",
    "birthDate": "18/12/2019",
    "entryYear": "2024",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
    "situaciones": [
      "NEET - INICIO AÑO 1 (REINGRESO)"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Daniela Villagra",
    "professionals": [
      "Daniela Villagra"
    ],
    "diagDate": "19.562.388-0",
    "evaluator": "Valeria Andrades",
    "evaluators": [
      "Valeria Andrades"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "1EBB",
        "course": "1° Básico B",
        "auto": "",
        "rut": "27.137.961-7",
        "birthDate": "18/12/2019",
        "name": "Gaspar Gael Reyes Muñoz",
        "entryYear": "2024",
        "professional": "Daniela Villagra",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-0",
        "evaluatorRut": "03-11-2025",
        "evaluator": "Valeria Andrades",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Juan Ignacio Moncada Saavedra",
    "rut": "27.250.879-8",
    "course": "1° Básico B",
    "birthDate": "28/03/2020",
    "entryYear": "2026",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Ana Zamora",
    "professionals": [
      "Ana Zamora"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "9"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "1EBB",
        "course": "1° Básico B",
        "auto": "9",
        "rut": "27.250.879-8",
        "birthDate": "28/03/2020",
        "name": "Juan Ignacio Moncada Saavedra",
        "entryYear": "2026",
        "professional": "Ana Zamora",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "2026-04-30",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "9",
        "courseCode": "1EBB",
        "course": "1° Básico B",
        "auto": "9",
        "rut": "27.250.879-8",
        "birthDate": "28/03/2020",
        "name": "Juan Ignacio Moncada Saavedra",
        "entryYear": "2026",
        "professional": "Ana Zamora",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "2026-04-30",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Juandiego Emmanuel Jara Sepúlveda",
    "rut": "26.800.349-5",
    "course": "1° Básico B",
    "birthDate": "21/04/2019",
    "entryYear": "2025",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Ana Zamora",
    "professionals": [
      "Ana Zamora"
    ],
    "diagDate": "5.579.461-8",
    "evaluator": "Perla David",
    "evaluators": [
      "Perla David"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "1EBB",
        "course": "1° Básico B",
        "auto": "",
        "rut": "26.800.349-5",
        "birthDate": "21/04/2019",
        "name": "Juandiego Emmanuel Jara Sepúlveda",
        "entryYear": "2025",
        "professional": "Ana Zamora",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "5.579.461-8",
        "evaluatorRut": "17-03-2025",
        "evaluator": "Perla David",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Lucia Fernanda Azola López",
    "rut": "27.173.437-9",
    "course": "1° Básico B",
    "birthDate": "25/01/2020",
    "entryYear": "2024",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
    "situaciones": [
      "NEET - INICIO AÑO 1 (REINGRESO)"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Daniela Villagra",
    "professionals": [
      "Daniela Villagra"
    ],
    "diagDate": "19.562.388-0",
    "evaluator": "Valeria Andrades",
    "evaluators": [
      "Valeria Andrades"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "1EBB",
        "course": "1° Básico B",
        "auto": "",
        "rut": "27.173.437-9",
        "birthDate": "25/01/2020",
        "name": "Lucia Fernanda Azola López",
        "entryYear": "2024",
        "professional": "Daniela Villagra",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-0",
        "evaluatorRut": "03-11-2025",
        "evaluator": "Valeria Andrades",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Melody Angela Lizbeth Quintul Ayala",
    "rut": "27.081.465-4",
    "course": "1° Básico B",
    "birthDate": "10/11/2019",
    "entryYear": "2026",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Daniela Villagra",
    "professionals": [
      "Daniela Villagra"
    ],
    "diagDate": "16.953.143-10",
    "evaluator": "Yocelyn Pérez",
    "evaluators": [
      "Yocelyn Pérez"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "1EBB",
        "course": "1° Básico B",
        "auto": "",
        "rut": "27.081.465-4",
        "birthDate": "10/11/2019",
        "name": "Melody Angela Lizbeth Quintul Ayala",
        "entryYear": "2026",
        "professional": "Daniela Villagra",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "16.953.143-10",
        "evaluatorRut": "12-03-2026",
        "evaluator": "Yocelyn Pérez",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Naica Anne Sarah Clervoyant .",
    "rut": "100.792.581-2",
    "course": "1° Básico B",
    "birthDate": "23/01/2018",
    "entryYear": "2026",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Ana Zamora",
    "professionals": [
      "Ana Zamora"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "1EBB",
        "course": "1° Básico B",
        "auto": "",
        "rut": "100.792.581-2",
        "birthDate": "23/01/2018",
        "name": "Naica Anne Sarah Clervoyant .",
        "entryYear": "2026",
        "professional": "Ana Zamora",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "10-03-2026",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Santino León Jara Álvarez",
    "rut": "26.970.278-8",
    "course": "1° Básico B",
    "birthDate": "16/08/2019",
    "entryYear": "2026",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Ana Zamora",
    "professionals": [
      "Ana Zamora"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "8"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "1EBB",
        "course": "1° Básico B",
        "auto": "8",
        "rut": "26.970.278-8",
        "birthDate": "16/08/2019",
        "name": "Santino León Jara Álvarez",
        "entryYear": "2026",
        "professional": "Ana Zamora",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "17-03-2026",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "8",
        "courseCode": "1EBB",
        "course": "1° Básico B",
        "auto": "8",
        "rut": "26.970.278-8",
        "birthDate": "16/08/2019",
        "name": "Santino León Jara Álvarez",
        "entryYear": "2026",
        "professional": "Ana Zamora",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "17-03-2026",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Valentino Andres Sepúlveda Contreras",
    "rut": "26.923.428-8",
    "course": "1° Básico B",
    "birthDate": "18/07/2019",
    "entryYear": "2024",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Ana Zamora",
    "professionals": [
      "Ana Zamora"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "1EBB",
        "course": "1° Básico B",
        "auto": "2025",
        "rut": "26.923.428-8",
        "birthDate": "18/07/2019",
        "name": "Valentino Andres Sepúlveda Contreras",
        "entryYear": "2024",
        "professional": "Ana Zamora",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "13-06-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "1EBB",
        "course": "1° Básico B",
        "auto": "2025",
        "rut": "26.923.428-8",
        "birthDate": "18/07/2019",
        "name": "Valentino Andres Sepúlveda Contreras",
        "entryYear": "2024",
        "professional": "Ana Zamora",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "13-06-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Abigail Antonella Lobos Sandoval",
    "rut": "26.561.153-2",
    "course": "2° Básico A",
    "birthDate": "07/11/2018",
    "entryYear": "2026",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Nicolle Salinas",
    "professionals": [
      "Nicolle Salinas"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "2EBA",
        "course": "2° Básico A",
        "auto": "",
        "rut": "26.561.153-2",
        "birthDate": "07/11/2018",
        "name": "Abigail Antonella Lobos Sandoval",
        "entryYear": "2026",
        "professional": "Nicolle Salinas",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "13-03-2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Denisse Pascal Salinas Cordero",
    "rut": "26.279.854-2",
    "course": "2° Básico A",
    "birthDate": "14/05/2018",
    "entryYear": "2026",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Nicolle Salinas",
    "professionals": [
      "Nicolle Salinas"
    ],
    "diagDate": "5.920.591-9",
    "evaluator": "Francisco Vielma",
    "evaluators": [
      "Francisco Vielma"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "2EBA",
        "course": "2° Básico A",
        "auto": "",
        "rut": "26.279.854-2",
        "birthDate": "14/05/2018",
        "name": "Denisse Pascal Salinas Cordero",
        "entryYear": "2026",
        "professional": "Nicolle Salinas",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "5.920.591-9",
        "evaluatorRut": "11-03-2026",
        "evaluator": "Francisco Vielma",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Enzo Eliazar Jaque Peña",
    "rut": "26.728.514-4",
    "course": "2° Básico A",
    "birthDate": "01/03/2019",
    "entryYear": "2023",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Nicolle Salinas",
    "professionals": [
      "Nicolle Salinas"
    ],
    "diagDate": "15.933.973-4",
    "evaluator": "Natalie Sepúlveda",
    "evaluators": [
      "Natalie Sepúlveda"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "2EBA",
        "course": "2° Básico A",
        "auto": "",
        "rut": "26.728.514-4",
        "birthDate": "01/03/2019",
        "name": "Enzo Eliazar Jaque Peña",
        "entryYear": "2023",
        "professional": "Nicolle Salinas",
        "diag": "TL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "15.933.973-4",
        "evaluatorRut": "06-11-2024",
        "evaluator": "Natalie Sepúlveda",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Facundo Ignacio Jarpa González",
    "rut": "26.382.483-0",
    "course": "2° Básico A",
    "birthDate": "16/07/2018",
    "entryYear": "2023",
    "diag": "GARC",
    "diagnoses": [
      "GARC"
    ],
    "situacion": "NEEP - INICIO AÑO 4",
    "situaciones": [
      "NEEP - INICIO AÑO 4"
    ],
    "tipoNEE": "Permanente",
    "professional": "Nicolle Salinas",
    "professionals": [
      "Nicolle Salinas"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "2EBA",
        "course": "2° Básico A",
        "auto": "",
        "rut": "26.382.483-0",
        "birthDate": "16/07/2018",
        "name": "Facundo Ignacio Jarpa González",
        "entryYear": "2023",
        "professional": "Nicolle Salinas",
        "diag": "GARC",
        "situacion": "NEEP - INICIO AÑO 4",
        "tipoNEE": "Permanente",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "03-04-2023",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Maite Sofía Rivera Villasmil",
    "rut": "26.701.019-6",
    "course": "2° Básico A",
    "birthDate": "08/02/2019",
    "entryYear": "2023",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 4",
    "situaciones": [
      "NEEP - INICIO AÑO 4"
    ],
    "tipoNEE": "Permanente",
    "professional": "Nicolle Salinas",
    "professionals": [
      "Nicolle Salinas"
    ],
    "diagDate": "10.327.749-3",
    "evaluator": "Alejandra Velez",
    "evaluators": [
      "Alejandra Velez"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "2EBA",
        "course": "2° Básico A",
        "auto": "",
        "rut": "26.701.019-6",
        "birthDate": "08/02/2019",
        "name": "Maite Sofía Rivera Villasmil",
        "entryYear": "2023",
        "professional": "Nicolle Salinas",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 4",
        "tipoNEE": "Permanente",
        "diagDate": "10.327.749-3",
        "evaluatorRut": "31-03-2023",
        "evaluator": "Alejandra Velez",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Mateo Alexander Teruel Cartes",
    "rut": "26.499.717-8",
    "course": "2° Básico A",
    "birthDate": "03/10/2018",
    "entryYear": "2025",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Nicolle Salinas",
    "professionals": [
      "Nicolle Salinas"
    ],
    "diagDate": "6324128-8",
    "evaluator": "Eugenio Soto",
    "evaluators": [
      "Eugenio Soto"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "2EBA",
        "course": "2° Básico A",
        "auto": "2025",
        "rut": "26.499.717-8",
        "birthDate": "03/10/2018",
        "name": "Mateo Alexander Teruel Cartes",
        "entryYear": "2025",
        "professional": "Nicolle Salinas",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "6324128-8",
        "evaluatorRut": "28-04-2025",
        "evaluator": "Eugenio Soto",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "2EBA",
        "course": "2° Básico A",
        "auto": "2025",
        "rut": "26.499.717-8",
        "birthDate": "03/10/2018",
        "name": "Mateo Alexander Teruel Cartes",
        "entryYear": "2025",
        "professional": "Nicolle Salinas",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "6324128-8",
        "evaluatorRut": "28-04-2025",
        "evaluator": "Eugenio Soto",
        "specialty": "Neurología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Mateo Gael Bañarez Meneses",
    "rut": "26.418.236-0",
    "course": "2° Básico A",
    "birthDate": "08/08/2018",
    "entryYear": "2023",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Nicolle Salinas",
    "professionals": [
      "Nicolle Salinas"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "2EBA",
        "course": "2° Básico A",
        "auto": "2025",
        "rut": "26.418.236-0",
        "birthDate": "08/08/2018",
        "name": "Mateo Gael Bañarez Meneses",
        "entryYear": "2023",
        "professional": "Nicolle Salinas",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "21-10-2024",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "2EBA",
        "course": "2° Básico A",
        "auto": "2025",
        "rut": "26.418.236-0",
        "birthDate": "08/08/2018",
        "name": "Mateo Gael Bañarez Meneses",
        "entryYear": "2023",
        "professional": "Nicolle Salinas",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "21-10-2024",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Mike Alexander Vilne Josemond",
    "rut": "26.609.696-8",
    "course": "2° Básico A",
    "birthDate": "09/12/2018",
    "entryYear": "2026",
    "diag": "DM",
    "diagnoses": [
      "DM"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Nicolle Salinas",
    "professionals": [
      "Nicolle Salinas"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "12"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "2EBA",
        "course": "2° Básico A",
        "auto": "12",
        "rut": "26.609.696-8",
        "birthDate": "09/12/2018",
        "name": "Mike Alexander Vilne Josemond",
        "entryYear": "2026",
        "professional": "Nicolle Salinas",
        "diag": "DM",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "2026-03-27",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "12",
        "courseCode": "2EBA",
        "course": "2° Básico A",
        "auto": "12",
        "rut": "26.609.696-8",
        "birthDate": "09/12/2018",
        "name": "Mike Alexander Vilne Josemond",
        "entryYear": "2026",
        "professional": "Nicolle Salinas",
        "siblings": "",
        "diag": "DM",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "2026-03-27",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Renato Andrés Aedo Moncada",
    "rut": "26.211.142-3",
    "course": "2° Básico A",
    "birthDate": "08/04/2018",
    "entryYear": "2026",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Nicolle Salinas",
    "professionals": [
      "Nicolle Salinas"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "11"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "2EBA",
        "course": "2° Básico A",
        "auto": "11",
        "rut": "26.211.142-3",
        "birthDate": "08/04/2018",
        "name": "Renato Andrés Aedo Moncada",
        "entryYear": "2026",
        "professional": "Nicolle Salinas",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "18-03-2026",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "11",
        "courseCode": "2EBA",
        "course": "2° Básico A",
        "auto": "11",
        "rut": "26.211.142-3",
        "birthDate": "08/04/2018",
        "name": "Renato Andrés Aedo Moncada",
        "entryYear": "2026",
        "professional": "Nicolle Salinas",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "18-03-2026",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Sebastián Eduardo Lucero Ibarra",
    "rut": "26.020.943-4",
    "course": "2° Básico A",
    "birthDate": "29/11/2017",
    "entryYear": "2025",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Nicolle Salinas",
    "professionals": [
      "Nicolle Salinas"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "2EBA",
        "course": "2° Básico A",
        "auto": "2025",
        "rut": "26.020.943-4",
        "birthDate": "29/11/2017",
        "name": "Sebastián Eduardo Lucero Ibarra",
        "entryYear": "2025",
        "professional": "Nicolle Salinas",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "13-3-2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "2EBA",
        "course": "2° Básico A",
        "auto": "2025",
        "rut": "26.020.943-4",
        "birthDate": "29/11/2017",
        "name": "Sebastián Eduardo Lucero Ibarra",
        "entryYear": "2025",
        "professional": "Nicolle Salinas",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "13-3-2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Valentina Isabella Belmar Dinamarca",
    "rut": "26.543.065-1",
    "course": "2° Básico A",
    "birthDate": "22/10/2018",
    "entryYear": "2025",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Nicolle Salinas",
    "professionals": [
      "Nicolle Salinas"
    ],
    "diagDate": "15.933.973-4",
    "evaluator": "Natalie Sepúlveda",
    "evaluators": [
      "Natalie Sepúlveda"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "2EBA",
        "course": "2° Básico A",
        "auto": "",
        "rut": "26.543.065-1",
        "birthDate": "22/10/2018",
        "name": "Valentina Isabella Belmar Dinamarca",
        "entryYear": "2025",
        "professional": "Nicolle Salinas",
        "diag": "TL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "15.933.973-4",
        "evaluatorRut": "05-11-2024",
        "evaluator": "Natalie Sepúlveda",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Windilove Gilbert Jean",
    "rut": "26.376.953-8",
    "course": "2° Básico A",
    "birthDate": "14/07/2018",
    "entryYear": "2026",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Nicolle Salinas",
    "professionals": [
      "Nicolle Salinas"
    ],
    "diagDate": "16.953.143-9",
    "evaluator": "Yocelyn Pérez",
    "evaluators": [
      "Yocelyn Pérez"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "2EBA",
        "course": "2° Básico A",
        "auto": "",
        "rut": "26.376.953-8",
        "birthDate": "14/07/2018",
        "name": "Windilove Gilbert Jean",
        "entryYear": "2026",
        "professional": "Nicolle Salinas",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "16.953.143-9",
        "evaluatorRut": "12-03-2026",
        "evaluator": "Yocelyn Pérez",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Agustina Javiera González Cortés",
    "rut": "26.685.419-6",
    "course": "2° Básico B",
    "birthDate": "01/02/2019",
    "entryYear": "2024",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Nicolle Salinas",
    "professionals": [
      "Nicolle Salinas"
    ],
    "diagDate": "16.953.143-9",
    "evaluator": "Yocelyn Pérez",
    "evaluators": [
      "Yocelyn Pérez"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "2EBB",
        "course": "2° Básico B",
        "auto": "",
        "rut": "26.685.419-6",
        "birthDate": "01/02/2019",
        "name": "Agustina Javiera González Cortés",
        "entryYear": "2024",
        "professional": "Nicolle Salinas",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "16.953.143-9",
        "evaluatorRut": "03-11-2025",
        "evaluator": "Yocelyn Pérez",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Amaro Ignacio Zenteno Arriagada",
    "rut": "26.713.840-0",
    "course": "2° Básico B",
    "birthDate": "20/02/2019",
    "entryYear": "2024",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
    "situaciones": [
      "NEET - INICIO AÑO 1 (REINGRESO)"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Nicolle Salinas",
    "professionals": [
      "Nicolle Salinas"
    ],
    "diagDate": "16.953.143-9",
    "evaluator": "Yocelyn Pérez",
    "evaluators": [
      "Yocelyn Pérez"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "2EBB",
        "course": "2° Básico B",
        "auto": "",
        "rut": "26.713.840-0",
        "birthDate": "20/02/2019",
        "name": "Amaro Ignacio Zenteno Arriagada",
        "entryYear": "2024",
        "professional": "Nicolle Salinas",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
        "tipoNEE": "Transitoria",
        "diagDate": "16.953.143-9",
        "evaluatorRut": "03-11-2025",
        "evaluator": "Yocelyn Pérez",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Amparo Esmeralda Loayza Ortiz",
    "rut": "26.620.738-7",
    "course": "2° Básico B",
    "birthDate": "16/12/2018",
    "entryYear": "2024",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
    "situaciones": [
      "NEET - INICIO AÑO 1 (REINGRESO)"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Nicolle Salinas",
    "professionals": [
      "Nicolle Salinas"
    ],
    "diagDate": "16.953.143-9",
    "evaluator": "Yocelyn Pérez",
    "evaluators": [
      "Yocelyn Pérez"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "2EBB",
        "course": "2° Básico B",
        "auto": "",
        "rut": "26.620.738-7",
        "birthDate": "16/12/2018",
        "name": "Amparo Esmeralda Loayza Ortiz",
        "entryYear": "2024",
        "professional": "Nicolle Salinas",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
        "tipoNEE": "Transitoria",
        "diagDate": "16.953.143-9",
        "evaluatorRut": "03-11-2025",
        "evaluator": "Yocelyn Pérez",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Andreya Kerlin Sajous Etienne",
    "rut": "26.356.557-6",
    "course": "2° Básico B",
    "birthDate": "04/07/2018",
    "entryYear": "2025",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Nicolle Salinas",
    "professionals": [
      "Nicolle Salinas"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "2EBB",
        "course": "2° Básico B",
        "auto": "",
        "rut": "26.356.557-6",
        "birthDate": "04/07/2018",
        "name": "Andreya Kerlin Sajous Etienne",
        "entryYear": "2025",
        "professional": "Nicolle Salinas",
        "diag": "FIL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "20-11-2024",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Florencia Ignacia González Escudero",
    "rut": "26.706.964-6",
    "course": "2° Básico B",
    "birthDate": "13/02/2019",
    "entryYear": "2023",
    "diag": "GARC",
    "diagnoses": [
      "GARC"
    ],
    "situacion": "NEEP - INICIO AÑO 3",
    "situaciones": [
      "NEEP - INICIO AÑO 3"
    ],
    "tipoNEE": "Permanente",
    "professional": "Nicolle Salinas",
    "professionals": [
      "Nicolle Salinas"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "2EBB",
        "course": "2° Básico B",
        "auto": "",
        "rut": "26.706.964-6",
        "birthDate": "13/02/2019",
        "name": "Florencia Ignacia González Escudero",
        "entryYear": "2023",
        "professional": "Nicolle Salinas",
        "diag": "GARC",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "01-08-2024",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Samuel Francillon Cajuste",
    "rut": "26.489.554-5",
    "course": "2° Básico B",
    "birthDate": "24/09/2018",
    "entryYear": "2023",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Nicolle Salinas",
    "professionals": [
      "Nicolle Salinas"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "2EBB",
        "course": "2° Básico B",
        "auto": "",
        "rut": "26.489.554-5",
        "birthDate": "24/09/2018",
        "name": "Samuel Francillon Cajuste",
        "entryYear": "2023",
        "professional": "Nicolle Salinas",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "23-10-2024",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Saray Verónica Gatica Gatica",
    "rut": "26.372.310-4",
    "course": "2° Básico B",
    "birthDate": "11/07/2018",
    "entryYear": "2026",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Nicolle Salinas",
    "professionals": [
      "Nicolle Salinas"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "2EBB",
        "course": "2° Básico B",
        "auto": "",
        "rut": "26.372.310-4",
        "birthDate": "11/07/2018",
        "name": "Saray Verónica Gatica Gatica",
        "entryYear": "2026",
        "professional": "Nicolle Salinas",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "13-03-2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Sebastián Saintus Jean",
    "rut": "26.629.531-6",
    "course": "2° Básico B",
    "birthDate": "22/12/2018",
    "entryYear": "2025",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Nicolle Salinas",
    "professionals": [
      "Nicolle Salinas"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "2EBB",
        "course": "2° Básico B",
        "auto": "2025",
        "rut": "26.629.531-6",
        "birthDate": "22/12/2018",
        "name": "Sebastián Saintus Jean",
        "entryYear": "2025",
        "professional": "Nicolle Salinas",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "07-07-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "2EBB",
        "course": "2° Básico B",
        "auto": "2025",
        "rut": "26.629.531-6",
        "birthDate": "22/12/2018",
        "name": "Sebastián Saintus Jean",
        "entryYear": "2025",
        "professional": "Nicolle Salinas",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "07-07-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Valentina Lucien Germain",
    "rut": "26.208.592-9",
    "course": "2° Básico B",
    "birthDate": "04/04/2018",
    "entryYear": "2025",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Nicolle Salinas",
    "professionals": [
      "Nicolle Salinas"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "2EBB",
        "course": "2° Básico B",
        "auto": "2025",
        "rut": "26.208.592-9",
        "birthDate": "04/04/2018",
        "name": "Valentina Lucien Germain",
        "entryYear": "2025",
        "professional": "Nicolle Salinas",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "14-3-2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "2EBB",
        "course": "2° Básico B",
        "auto": "2025",
        "rut": "26.208.592-9",
        "birthDate": "04/04/2018",
        "name": "Valentina Lucien Germain",
        "entryYear": "2025",
        "professional": "Nicolle Salinas",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "14-3-2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Dominic Isidora Carriel Zúñiga",
    "rut": "26.132.155-6",
    "course": "3° Básico A",
    "birthDate": "15/02/2018",
    "entryYear": "2025",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Andrea Galvez",
    "professionals": [
      "Andrea Galvez"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "3EBA",
        "course": "3° Básico A",
        "auto": "",
        "rut": "26.132.155-6",
        "birthDate": "15/02/2018",
        "name": "Dominic Isidora Carriel Zúñiga",
        "entryYear": "2025",
        "professional": "Andrea Galvez",
        "diag": "FIL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "24-07-2024",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Eidhan Alonso Fernández Alarcón",
    "rut": "25.669.686-K",
    "course": "3° Básico A",
    "birthDate": "12/02/2017",
    "entryYear": "2026",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Andrea Galvez",
    "professionals": [
      "Andrea Galvez"
    ],
    "diagDate": "24.052.426-0",
    "evaluator": "Nelson Suarez",
    "evaluators": [
      "Nelson Suarez"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "3EBA",
        "course": "3° Básico A",
        "auto": "",
        "rut": "25.669.686-K",
        "birthDate": "12/02/2017",
        "name": "Eidhan Alonso Fernández Alarcón",
        "entryYear": "2026",
        "professional": "Andrea Galvez",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "24.052.426-0",
        "evaluatorRut": "13/08/2025",
        "evaluator": "Nelson Suarez",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Felipe Ignacio Andrade Andrades",
    "rut": "25.627.664-K",
    "course": "3° Básico A",
    "birthDate": "28/12/2016",
    "entryYear": "2021",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Andrea Galvez",
    "professionals": [
      "Andrea Galvez"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "3EBA",
        "course": "3° Básico A",
        "auto": "2025",
        "rut": "25.627.664-K",
        "birthDate": "28/12/2016",
        "name": "Felipe Ignacio Andrade Andrades",
        "entryYear": "2021",
        "professional": "Andrea Galvez",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "04-11-2024",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "3EBA",
        "course": "3° Básico A",
        "auto": "2025",
        "rut": "25.627.664-K",
        "birthDate": "28/12/2016",
        "name": "Felipe Ignacio Andrade Andrades",
        "entryYear": "2021",
        "professional": "Andrea Galvez",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "04-11-2024",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Juan Emilio Santelices Escobar",
    "rut": "25.836.267-5",
    "course": "3° Básico A",
    "birthDate": "13/07/2017",
    "entryYear": "2022",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 3",
    "situaciones": [
      "NEEP - INICIO AÑO 3"
    ],
    "tipoNEE": "Permanente",
    "professional": "Andrea Galvez",
    "professionals": [
      "Andrea Galvez"
    ],
    "diagDate": "4724377-7",
    "evaluator": "Gustavo Guerra",
    "evaluators": [
      "Gustavo Guerra"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "3EBA",
        "course": "3° Básico A",
        "auto": "",
        "rut": "25.836.267-5",
        "birthDate": "13/07/2017",
        "name": "Juan Emilio Santelices Escobar",
        "entryYear": "2022",
        "professional": "Andrea Galvez",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "diagDate": "4724377-7",
        "evaluatorRut": "07-03-2024",
        "evaluator": "Gustavo Guerra",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Lucas Antonio Maldonado Ponce",
    "rut": "25.747.982-K",
    "course": "3° Básico A",
    "birthDate": "28/04/2017",
    "entryYear": "2025",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Andrea Galvez",
    "professionals": [
      "Andrea Galvez"
    ],
    "diagDate": "8927983-6",
    "evaluator": "Marisol Avendaño",
    "evaluators": [
      "Marisol Avendaño"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "3EBA",
        "course": "3° Básico A",
        "auto": "",
        "rut": "25.747.982-K",
        "birthDate": "28/04/2017",
        "name": "Lucas Antonio Maldonado Ponce",
        "entryYear": "2025",
        "professional": "Andrea Galvez",
        "diag": "TDA",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "8927983-6",
        "evaluatorRut": "23-11-2024",
        "evaluator": "Marisol Avendaño",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Maite Jade Fernandez Muñoz",
    "rut": "25.770.590-0",
    "course": "3° Básico A",
    "birthDate": "17/05/2017",
    "entryYear": "2022",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Andrea Galvez",
    "professionals": [
      "Andrea Galvez"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "13"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "3EBA",
        "course": "3° Básico A",
        "auto": "13",
        "rut": "25.770.590-0",
        "birthDate": "17/05/2017",
        "name": "Maite Jade Fernandez Muñoz",
        "entryYear": "2022",
        "professional": "Andrea Galvez",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "09-10-2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "13",
        "courseCode": "3EBA",
        "course": "3° Básico A",
        "auto": "13",
        "rut": "25.770.590-0",
        "birthDate": "17/05/2017",
        "name": "Maite Jade Fernandez Muñoz",
        "entryYear": "2022",
        "professional": "Andrea Galvez",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "09-10-2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Mateo Jacob Contreras Muñoz",
    "rut": "25.990.730-6",
    "course": "3° Básico A",
    "birthDate": "15/11/2017",
    "entryYear": "2022",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
    "situaciones": [
      "NEET - INICIO AÑO 1 (REINGRESO)"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Andrea Galvez",
    "professionals": [
      "Andrea Galvez"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "3EBA",
        "course": "3° Básico A",
        "auto": "",
        "rut": "25.990.730-6",
        "birthDate": "15/11/2017",
        "name": "Mateo Jacob Contreras Muñoz",
        "entryYear": "2022",
        "professional": "Andrea Galvez",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
        "tipoNEE": "Transitoria",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "06/11/2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Miguel Patricio Ramirez Mancilla",
    "rut": "25.372.246-0",
    "course": "3° Básico A",
    "birthDate": "24/04/2016",
    "entryYear": "2025",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Milton Osses",
    "professionals": [
      "Milton Osses"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "3EBA",
        "course": "3° Básico A",
        "auto": "2025",
        "rut": "25.372.246-0",
        "birthDate": "24/04/2016",
        "name": "Miguel Patricio Ramirez Mancilla",
        "entryYear": "2025",
        "professional": "Milton Osses",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "11-03-2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "3EBA",
        "course": "3° Básico A",
        "auto": "2025",
        "rut": "25.372.246-0",
        "birthDate": "24/04/2016",
        "name": "Miguel Patricio Ramirez Mancilla",
        "entryYear": "2025",
        "professional": "Milton Osses",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "11-03-2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Sofía Ignacia Rengifo Mellado",
    "rut": "25.944.054-8",
    "course": "3° Básico A",
    "birthDate": "12/10/2017",
    "entryYear": "2026",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Andrea Galvez",
    "professionals": [
      "Andrea Galvez"
    ],
    "diagDate": "16.953.143-9",
    "evaluator": "Yocelyn Pérez",
    "evaluators": [
      "Yocelyn Pérez"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "3EBA",
        "course": "3° Básico A",
        "auto": "",
        "rut": "25.944.054-8",
        "birthDate": "12/10/2017",
        "name": "Sofía Ignacia Rengifo Mellado",
        "entryYear": "2026",
        "professional": "Andrea Galvez",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "16.953.143-9",
        "evaluatorRut": "12/03/2026",
        "evaluator": "Yocelyn Pérez",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Vicente Antonio Monsalve Escobar",
    "rut": "25.739.995-8",
    "course": "3° Básico A",
    "birthDate": "19/04/2017",
    "entryYear": "2025",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Andrea Galvez",
    "professionals": [
      "Andrea Galvez"
    ],
    "diagDate": "5.579.461-8",
    "evaluator": "Perla David",
    "evaluators": [
      "Perla David"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "3EBA",
        "course": "3° Básico A",
        "auto": "",
        "rut": "25.739.995-8",
        "birthDate": "19/04/2017",
        "name": "Vicente Antonio Monsalve Escobar",
        "entryYear": "2025",
        "professional": "Andrea Galvez",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "5.579.461-8",
        "evaluatorRut": "22/11/2025",
        "evaluator": "Perla David",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Christopher Benjamín Velásquez Delgado",
    "rut": "25.712.582-3",
    "course": "3° Básico B",
    "birthDate": "20/03/2017",
    "entryYear": "2021",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 4",
    "situaciones": [
      "NEEP - INICIO AÑO 4"
    ],
    "tipoNEE": "Permanente",
    "professional": "Milton Osses",
    "professionals": [
      "Milton Osses"
    ],
    "diagDate": "6925195-1",
    "evaluator": "Tamara Schnitzler",
    "evaluators": [
      "Tamara Schnitzler"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "14"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "3EBB",
        "course": "3° Básico B",
        "auto": "14",
        "rut": "25.712.582-3",
        "birthDate": "20/03/2017",
        "name": "Christopher Benjamín Velásquez Delgado",
        "entryYear": "2021",
        "professional": "Milton Osses",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 4",
        "tipoNEE": "Permanente",
        "diagDate": "6925195-1",
        "evaluatorRut": "28-05-2023",
        "evaluator": "Tamara Schnitzler",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "14",
        "courseCode": "3EBB",
        "course": "3° Básico B",
        "auto": "14",
        "rut": "25.712.582-3",
        "birthDate": "20/03/2017",
        "name": "Christopher Velásquez Delgado",
        "entryYear": "2021",
        "professional": "Milton Osses",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 4",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "6925195-1",
        "evaluatorRut": "28-05-2023",
        "evaluator": "Tamara Schnitzler",
        "specialty": "Neurología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Constanza Camila Gutiérrez Fuentes",
    "rut": "25.803.073-7",
    "course": "3° Básico B",
    "birthDate": "14/06/2017",
    "entryYear": "2025",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Andrea Galvez",
    "professionals": [
      "Andrea Galvez"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "3EBB",
        "course": "3° Básico B",
        "auto": "",
        "rut": "25.803.073-7",
        "birthDate": "14/06/2017",
        "name": "Constanza Camila Gutiérrez Fuentes",
        "entryYear": "2025",
        "professional": "Andrea Galvez",
        "diag": "FIL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "27-03-2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Cristian Mateo Lobos Mondaca",
    "rut": "25.803.678-6",
    "course": "3° Básico B",
    "birthDate": "14/06/2017",
    "entryYear": "2026",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Andrea Galvez",
    "professionals": [
      "Andrea Galvez"
    ],
    "diagDate": "16.953.143-9",
    "evaluator": "Yocelyn Pérez",
    "evaluators": [
      "Yocelyn Pérez"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "3EBB",
        "course": "3° Básico B",
        "auto": "",
        "rut": "25.803.678-6",
        "birthDate": "14/06/2017",
        "name": "Cristian Mateo Lobos Mondaca",
        "entryYear": "2026",
        "professional": "Andrea Galvez",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "16.953.143-9",
        "evaluatorRut": "16/03/2026",
        "evaluator": "Yocelyn Pérez",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Eddie Alonso Cárdenas Salazar",
    "rut": "26.191.320-8",
    "course": "3° Básico B",
    "birthDate": "24/03/2018",
    "entryYear": "2022",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Andrea Galvez",
    "professionals": [
      "Andrea Galvez"
    ],
    "diagDate": "16.763.232-7",
    "evaluator": "Carlos Castro Inzunza",
    "evaluators": [
      "Carlos Castro Inzunza"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "3EBB",
        "course": "3° Básico B",
        "auto": "",
        "rut": "26.191.320-8",
        "birthDate": "24/03/2018",
        "name": "Eddie Alonso Cárdenas Salazar",
        "entryYear": "2022",
        "professional": "Andrea Galvez",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "16.763.232-7",
        "evaluatorRut": "17/05/2025",
        "evaluator": "Carlos Castro Inzunza",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Eduardo Emilio Celpa Fuentes",
    "rut": "25.872.373-2",
    "course": "3° Básico B",
    "birthDate": "12/08/2017",
    "entryYear": "2026",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Andrea Galvez",
    "professionals": [
      "Andrea Galvez"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "15"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "3EBB",
        "course": "3° Básico B",
        "auto": "15",
        "rut": "25.872.373-2",
        "birthDate": "12/08/2017",
        "name": "Eduardo Emilio Celpa Fuentes",
        "entryYear": "2026",
        "professional": "Andrea Galvez",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "18-12-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "15",
        "courseCode": "3EBB",
        "course": "3° Básico B",
        "auto": "15",
        "rut": "25.872.373-2",
        "birthDate": "12/08/2017",
        "name": "Eduardo Emilio Celpa Fuentes",
        "entryYear": "2026",
        "professional": "Andrea Galvez",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "18-12-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Esay León Ávila Betancourt",
    "rut": "25.466.103-1",
    "course": "3° Básico B",
    "birthDate": "03/08/2016",
    "entryYear": "2024",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Andrea Galvez",
    "professionals": [
      "Andrea Galvez"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "3EBB",
        "course": "3° Básico B",
        "auto": "2025",
        "rut": "25.466.103-1",
        "birthDate": "03/08/2016",
        "name": "Esay León Ávila Betancourt",
        "entryYear": "2024",
        "professional": "Andrea Galvez",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "03/12/2024",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "3EBB",
        "course": "3° Básico B",
        "auto": "2025",
        "rut": "25.466.103-1",
        "birthDate": "03/08/2016",
        "name": "Esay León Ávila Betancourt",
        "entryYear": "2024",
        "professional": "Andrea Galvez",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "03/12/2024",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Isabella Aylen Tapia Jarpa",
    "rut": "26.167.643-5",
    "course": "3° Básico B",
    "birthDate": "09/03/2018",
    "entryYear": "2025",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Andrea Galvez",
    "professionals": [
      "Andrea Galvez"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "3EBB",
        "course": "3° Básico B",
        "auto": "",
        "rut": "26.167.643-5",
        "birthDate": "09/03/2018",
        "name": "Isabella Aylen Tapia Jarpa",
        "entryYear": "2025",
        "professional": "Andrea Galvez",
        "diag": "FIL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "12-03-2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Martín Omar Villanueva Tapia",
    "rut": "26.067.268-1",
    "course": "3° Básico B",
    "birthDate": "05/01/2018",
    "entryYear": "2026",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Andrea Galvez",
    "professionals": [
      "Andrea Galvez"
    ],
    "diagDate": "6.985.075-8",
    "evaluator": "Juan Carlos Toro",
    "evaluators": [
      "Juan Carlos Toro"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "16"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "3EBB",
        "course": "3° Básico B",
        "auto": "16",
        "rut": "26.067.268-1",
        "birthDate": "05/01/2018",
        "name": "Martín Omar Villanueva Tapia",
        "entryYear": "2026",
        "professional": "Andrea Galvez",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "6.985.075-8",
        "evaluatorRut": "08-07-2024",
        "evaluator": "Juan Carlos Toro",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "16",
        "courseCode": "3EBB",
        "course": "3° Básico B",
        "auto": "16",
        "rut": "26.067.268-1",
        "birthDate": "05/01/2018",
        "name": "Martín Omar Villanueva Tapia",
        "entryYear": "2026",
        "professional": "Andrea Galvez",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "6.985.075-8",
        "evaluatorRut": "08-07-2024",
        "evaluator": "Juan Carlos Toro",
        "specialty": "Neurología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Sofía Lisette Lefián Yáñez",
    "rut": "25.763.313-6",
    "course": "3° Básico B",
    "birthDate": "12/05/2017",
    "entryYear": "2026",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Andrea Galvez",
    "professionals": [
      "Andrea Galvez"
    ],
    "diagDate": "20.930.987-5",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "3EBB",
        "course": "3° Básico B",
        "auto": "",
        "rut": "25.763.313-6",
        "birthDate": "12/05/2017",
        "name": "Sofía Lisette Lefián Yáñez",
        "entryYear": "2026",
        "professional": "Andrea Galvez",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "20.930.987-5",
        "evaluatorRut": "16-03-2026",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Sofía Pascal Villablanca Huenchual",
    "rut": "25.944.933-2",
    "course": "3° Básico B",
    "birthDate": "12/10/2017",
    "entryYear": "2022",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
    "situaciones": [
      "NEET - INICIO AÑO 1 (REINGRESO)"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Andrea Galvez",
    "professionals": [
      "Andrea Galvez"
    ],
    "diagDate": "20.930.987-5",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "3EBB",
        "course": "3° Básico B",
        "auto": "",
        "rut": "25.944.933-2",
        "birthDate": "12/10/2017",
        "name": "Sofía Pascal Villablanca Huenchual",
        "entryYear": "2022",
        "professional": "Andrea Galvez",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
        "tipoNEE": "Transitoria",
        "diagDate": "20.930.987-5",
        "evaluatorRut": "20/11/2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Álvaro Tomás Olivero Vega",
    "rut": "26.048.595-4",
    "course": "3° Básico B",
    "birthDate": "21/12/2017",
    "entryYear": "2022",
    "diag": "GARC",
    "diagnoses": [
      "GARC"
    ],
    "situacion": "NEEP - INICIO AÑO 3",
    "situaciones": [
      "NEEP - INICIO AÑO 3"
    ],
    "tipoNEE": "Permanente",
    "professional": "Andrea Galvez",
    "professionals": [
      "Andrea Galvez"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "3EBB",
        "course": "3° Básico B",
        "auto": "",
        "rut": "26.048.595-4",
        "birthDate": "21/12/2017",
        "name": "Álvaro Tomás Olivero Vega",
        "entryYear": "2022",
        "professional": "Andrea Galvez",
        "diag": "GARC",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "06/05/2024",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Alexander Tomás Crot Downing",
    "rut": "25.612.582-K",
    "course": "4° Básico A",
    "birthDate": "26/12/2016",
    "entryYear": "2025",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Milton Osses",
    "professionals": [
      "Milton Osses"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "4EBA",
        "course": "4° Básico A",
        "auto": "2025",
        "rut": "25.612.582-K",
        "birthDate": "26/12/2016",
        "name": "Alexander Tomás Crot Downing",
        "entryYear": "2025",
        "professional": "Milton Osses",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "07-07-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "4EBA",
        "course": "4° Básico A",
        "auto": "2025",
        "rut": "25.612.582-K",
        "birthDate": "26/12/2016",
        "name": "Alexander Tomás Crot Downing",
        "entryYear": "2025",
        "professional": "Milton Osses",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "07-07-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Aníbal Jesús Rafael Pino Vergara",
    "rut": "25.551.545-4",
    "course": "4° Básico A",
    "birthDate": "30/10/2016",
    "entryYear": "2023",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Milton Osses",
    "professionals": [
      "Milton Osses"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "4EBA",
        "course": "4° Básico A",
        "auto": "2025",
        "rut": "25.551.545-4",
        "birthDate": "30/10/2016",
        "name": "Aníbal Jesús Rafael Pino Vergara",
        "entryYear": "2023",
        "professional": "Milton Osses",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "14-03-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "4EBA",
        "course": "4° Básico A",
        "auto": "2025",
        "rut": "25.551.545-4",
        "birthDate": "30/10/2016",
        "name": "Aníbal Jesús Rafael Pino Vergara",
        "entryYear": "2023",
        "professional": "Milton Osses",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "14-03-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Diego Israel Liberona Downing",
    "rut": "25.456.131-2",
    "course": "4° Básico A",
    "birthDate": "24/07/2016",
    "entryYear": "2025",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Milton Osses",
    "professionals": [
      "Milton Osses"
    ],
    "diagDate": "17.270.709-2",
    "evaluator": "José Ignacio Marín",
    "evaluators": [
      "José Ignacio Marín"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "4EBA",
        "course": "4° Básico A",
        "auto": "2025",
        "rut": "25.456.131-2",
        "birthDate": "24/07/2016",
        "name": "Diego Israel Liberona Downing",
        "entryYear": "2025",
        "professional": "Milton Osses",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "17.270.709-2",
        "evaluatorRut": "29-03-2025",
        "evaluator": "José Ignacio Marín",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "4EBA",
        "course": "4° Básico A",
        "auto": "2025",
        "rut": "25.456.131-2",
        "birthDate": "24/07/2016",
        "name": "Diego Israel Liberona Downing",
        "entryYear": "2025",
        "professional": "Milton Osses",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "17.270.709-2",
        "evaluatorRut": "29-03-2025",
        "evaluator": "José Ignacio Marín",
        "specialty": "Neurología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Florencia Aylen Jeldres Camus",
    "rut": "25.645.584-6",
    "course": "4° Básico A",
    "birthDate": "19/01/2017",
    "entryYear": "2024",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 3",
    "situaciones": [
      "NEEP - INICIO AÑO 3"
    ],
    "tipoNEE": "Permanente",
    "professional": "Milton Osses",
    "professionals": [
      "Milton Osses"
    ],
    "diagDate": "5.579.461-8",
    "evaluator": "Perla David",
    "evaluators": [
      "Perla David"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "4EBA",
        "course": "4° Básico A",
        "auto": "",
        "rut": "25.645.584-6",
        "birthDate": "19/01/2017",
        "name": "Florencia Aylen Jeldres Camus",
        "entryYear": "2024",
        "professional": "Milton Osses",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "diagDate": "5.579.461-8",
        "evaluatorRut": "25-03-2024",
        "evaluator": "Perla David",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Gaspar Emiliano Morales Gatica",
    "rut": "25.529.737-6",
    "course": "4° Básico A",
    "birthDate": "04/10/2016",
    "entryYear": "2025",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "María Soledad Salinas",
    "professionals": [
      "María Soledad Salinas"
    ],
    "diagDate": "19.562.388-3",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "4EBA",
        "course": "4° Básico A",
        "auto": "",
        "rut": "25.529.737-6",
        "birthDate": "04/10/2016",
        "name": "Gaspar Emiliano Morales Gatica",
        "entryYear": "2025",
        "professional": "María Soledad Salinas",
        "diag": "TDA",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-3",
        "evaluatorRut": "27-03-2025",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Maite Sofía Antonella Olivares Olivares",
    "rut": "25.495.342-3",
    "course": "4° Básico A",
    "birthDate": "31/08/2016",
    "entryYear": "2026",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "María Soledad Salinas",
    "professionals": [
      "María Soledad Salinas"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "4EBA",
        "course": "4° Básico A",
        "auto": "",
        "rut": "25.495.342-3",
        "birthDate": "31/08/2016",
        "name": "Maite Sofía Antonella Olivares Olivares",
        "entryYear": "2026",
        "professional": "María Soledad Salinas",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "18/03/2026",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Mateo Román Cisternas Peralta",
    "rut": "25.336.949-3",
    "course": "4° Básico A",
    "birthDate": "01/04/2016",
    "entryYear": "2023",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Milton Osses",
    "professionals": [
      "Milton Osses"
    ],
    "diagDate": "15.467.203-6",
    "evaluator": "Tamara Muñoz",
    "evaluators": [
      "Tamara Muñoz"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "4EBA",
        "course": "4° Básico A",
        "auto": "",
        "rut": "25.336.949-3",
        "birthDate": "01/04/2016",
        "name": "Mateo Román Cisternas Peralta",
        "entryYear": "2023",
        "professional": "Milton Osses",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "15.467.203-6",
        "evaluatorRut": "12/03/2026",
        "evaluator": "Tamara Muñoz",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Said Abdiel Ancamil Pinto",
    "rut": "25.561.264-6",
    "course": "4° Básico A",
    "birthDate": "27/10/2016",
    "entryYear": "2022",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "María Soledad Salinas",
    "professionals": [
      "María Soledad Salinas"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "4EBA",
        "course": "4° Básico A",
        "auto": "",
        "rut": "25.561.264-6",
        "birthDate": "27/10/2016",
        "name": "Said Abdiel Ancamil Pinto",
        "entryYear": "2022",
        "professional": "María Soledad Salinas",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "27/10/2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Valentina Ignacia Rodriguez Guzmán",
    "rut": "25.679.209-5",
    "course": "4° Básico A",
    "birthDate": "18/02/2017",
    "entryYear": "2024",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "María Soledad Salinas",
    "professionals": [
      "María Soledad Salinas"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "4EBA",
        "course": "4° Básico A",
        "auto": "",
        "rut": "25.679.209-5",
        "birthDate": "18/02/2017",
        "name": "Valentina Ignacia Rodriguez Guzmán",
        "entryYear": "2024",
        "professional": "María Soledad Salinas",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "13/03/2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Valentino Juan Carlos Gutierrez Adasme",
    "rut": "25.698.712-0",
    "course": "4° Básico A",
    "birthDate": "06/03/2017",
    "entryYear": "2025",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "María Soledad Salinas",
    "professionals": [
      "María Soledad Salinas"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "4EBA",
        "course": "4° Básico A",
        "auto": "",
        "rut": "25.698.712-0",
        "birthDate": "06/03/2017",
        "name": "Valentino Juan Carlos Gutierrez Adasme",
        "entryYear": "2025",
        "professional": "María Soledad Salinas",
        "diag": "TDA",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "27-03-2025",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Alonso Fernando Millapán Guzmán",
    "rut": "25.514.381-6",
    "course": "4° Básico B",
    "birthDate": "18/09/2016",
    "entryYear": "2026",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Milton Osses",
    "professionals": [
      "Milton Osses"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "18"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "4EBB",
        "course": "4° Básico B",
        "auto": "18",
        "rut": "25.514.381-6",
        "birthDate": "18/09/2016",
        "name": "Alonso Fernando Millapán Guzmán",
        "entryYear": "2026",
        "professional": "Milton Osses",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "18/03/2026",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "18",
        "courseCode": "4EBB",
        "course": "4° Básico B",
        "auto": "18",
        "rut": "25.514.381-6",
        "birthDate": "18/09/2016",
        "name": "Alonso Fernando Millapán Guzmán",
        "entryYear": "2026",
        "professional": "Milton Osses",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "18/03/2026",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Bastián Ignacio Figueroa Figueroa",
    "rut": "25.549.328-0",
    "course": "4° Básico B",
    "birthDate": "23/10/2016",
    "entryYear": "2024",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Milton Osses",
    "professionals": [
      "Milton Osses"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "4EBB",
        "course": "4° Básico B",
        "auto": "2025",
        "rut": "25.549.328-0",
        "birthDate": "23/10/2016",
        "name": "Bastián Ignacio Figueroa Figueroa",
        "entryYear": "2024",
        "professional": "Milton Osses",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "10-10-2024",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "4EBB",
        "course": "4° Básico B",
        "auto": "2025",
        "rut": "25.549.328-0",
        "birthDate": "23/10/2016",
        "name": "Bastián Ignacio Figueroa Figueroa",
        "entryYear": "2024",
        "professional": "Milton Osses",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "10-10-2024",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "David Emmanuel Myrtil Maignan",
    "rut": "25.495.452-7",
    "course": "4° Básico B",
    "birthDate": "30/08/2016",
    "entryYear": "2021",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Milton Osses",
    "professionals": [
      "Milton Osses"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "17"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "4EBB",
        "course": "4° Básico B",
        "auto": "17",
        "rut": "25.495.452-7",
        "birthDate": "30/08/2016",
        "name": "David Emmanuel Myrtil Maignan",
        "entryYear": "2021",
        "professional": "Milton Osses",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "2024-10-17",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "17",
        "courseCode": "4EBB",
        "course": "4° Básico B",
        "auto": "17",
        "rut": "25.495.452-7",
        "birthDate": "30/08/2016",
        "name": "David Emmanuel Myrtil Maignan",
        "entryYear": "2021",
        "professional": "Milton Osses",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "2024-10-17",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Ezequiel Alexander Quezada Melo",
    "rut": "25.689.895-0",
    "course": "4° Básico B",
    "birthDate": "02/03/2017",
    "entryYear": "2026",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "María Soledad Salinas",
    "professionals": [
      "María Soledad Salinas"
    ],
    "diagDate": "20.930.987-5",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicóloga",
    "specialties": [
      "Psicóloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "4EBB",
        "course": "4° Básico B",
        "auto": "",
        "rut": "25.689.895-0",
        "birthDate": "02/03/2017",
        "name": "Ezequiel Alexander Quezada Melo",
        "entryYear": "2026",
        "professional": "María Soledad Salinas",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "20.930.987-5",
        "evaluatorRut": "25-3-2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicóloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Fernando Joaquín Garrido Araya",
    "rut": "25.351.866-9",
    "course": "4° Básico B",
    "birthDate": "18/04/2016",
    "entryYear": "2023",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "María Soledad Salinas",
    "professionals": [
      "María Soledad Salinas"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "4EBB",
        "course": "4° Básico B",
        "auto": "",
        "rut": "25.351.866-9",
        "birthDate": "18/04/2016",
        "name": "Fernando Joaquín Garrido Araya",
        "entryYear": "2023",
        "professional": "María Soledad Salinas",
        "diag": "FIL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "30-10-2024",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Gisella Renata Tobar Díaz",
    "rut": "25.713.595-0",
    "course": "4° Básico B",
    "birthDate": "21/03/2017",
    "entryYear": "2025",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "María Soledad Salinas",
    "professionals": [
      "María Soledad Salinas"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "4EBB",
        "course": "4° Básico B",
        "auto": "",
        "rut": "25.713.595-0",
        "birthDate": "21/03/2017",
        "name": "Gisella Renata Tobar Díaz",
        "entryYear": "2025",
        "professional": "María Soledad Salinas",
        "diag": "TDA",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "27-03-2025",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Joaquín Nicolás Muñoz Córdova",
    "rut": "25.712.068-6",
    "course": "4° Básico B",
    "birthDate": "18/03/2017",
    "entryYear": "2023",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Milton Osses",
    "professionals": [
      "Milton Osses"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "4EBB",
        "course": "4° Básico B",
        "auto": "",
        "rut": "25.712.068-6",
        "birthDate": "18/03/2017",
        "name": "Joaquín Nicolás Muñoz Córdova",
        "entryYear": "2023",
        "professional": "Milton Osses",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "19-05-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Jordano Steven Ulloa Peña",
    "rut": "25.349.330-5",
    "course": "4° Básico B",
    "birthDate": "13/04/2016",
    "entryYear": "2024",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Milton Osses",
    "professionals": [
      "Milton Osses"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "4EBB",
        "course": "4° Básico B",
        "auto": "2024",
        "rut": "25.349.330-5",
        "birthDate": "13/04/2016",
        "name": "Jordano Steven Ulloa Peña",
        "entryYear": "2024",
        "professional": "Milton Osses",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "06/10/2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "4EBB",
        "course": "4° Básico B",
        "auto": "2024",
        "rut": "25.349.330-5",
        "birthDate": "13/04/2016",
        "name": "Jordano Steven Ulloa Peña",
        "entryYear": "2024",
        "professional": "Milton Osses",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "06/10/2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Mateo Alonso Cárcamo Castillo",
    "rut": "25.530.747-9",
    "course": "4° Básico B",
    "birthDate": "07/10/2016",
    "entryYear": "2025",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "María Soledad Salinas",
    "professionals": [
      "María Soledad Salinas"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "4EBB",
        "course": "4° Básico B",
        "auto": "",
        "rut": "25.530.747-9",
        "birthDate": "07/10/2016",
        "name": "Mateo Alonso Cárcamo Castillo",
        "entryYear": "2025",
        "professional": "María Soledad Salinas",
        "diag": "TDA",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "27-03-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Mateo Andrés Gutiérrez Villarreal",
    "rut": "25.364.116-9",
    "course": "4° Básico B",
    "birthDate": "29/04/2016",
    "entryYear": "2023",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Milton Osses",
    "professionals": [
      "Milton Osses"
    ],
    "diagDate": "8.718.602-4",
    "evaluator": "Marcela Legue",
    "evaluators": [
      "Marcela Legue"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "4EBB",
        "course": "4° Básico B",
        "auto": "",
        "rut": "25.364.116-9",
        "birthDate": "29/04/2016",
        "name": "Mateo Andrés Gutiérrez Villarreal",
        "entryYear": "2023",
        "professional": "Milton Osses",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "8.718.602-4",
        "evaluatorRut": "10-02-2021",
        "evaluator": "Marcela Legue",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Valentino Alexis Jesús Quintana Soto",
    "rut": "25.373.392-6",
    "course": "4° Básico B",
    "birthDate": "04/05/2016",
    "entryYear": "2026",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "María Soledad Salinas",
    "professionals": [
      "María Soledad Salinas"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicóloga",
    "specialties": [
      "Psicóloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "4EBB",
        "course": "4° Básico B",
        "auto": "",
        "rut": "25.373.392-6",
        "birthDate": "04/05/2016",
        "name": "Valentino Alexis Jesús Quintana Soto",
        "entryYear": "2026",
        "professional": "María Soledad Salinas",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "19-03-2026",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicóloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Damián Gaspar Fuentes Guzmán",
    "rut": "24.971.867-K",
    "course": "5° Básico A",
    "birthDate": "29/04/2015",
    "entryYear": "2026",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Yanel Parra",
    "professionals": [
      "Yanel Parra"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "5EBA",
        "course": "5° Básico A",
        "auto": "",
        "rut": "24.971.867-K",
        "birthDate": "29/04/2015",
        "name": "Damián Gaspar Fuentes Guzmán",
        "entryYear": "2026",
        "professional": "Yanel Parra",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "07/11/2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Denisse Agustina Galaz González",
    "rut": "25.324.802-5",
    "course": "5° Básico A",
    "birthDate": "17/03/2016",
    "entryYear": "2026",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Yanel Parra",
    "professionals": [
      "Yanel Parra"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "5EBA",
        "course": "5° Básico A",
        "auto": "",
        "rut": "25.324.802-5",
        "birthDate": "17/03/2016",
        "name": "Denisse Agustina Galaz González",
        "entryYear": "2026",
        "professional": "Yanel Parra",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "28/03/2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Felipe Elías Jarpa González",
    "rut": "24.574.448-K",
    "course": "5° Básico A",
    "birthDate": "21/03/2014",
    "entryYear": "2023",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Michael Vera",
    "professionals": [
      "Michael Vera"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "5EBA",
        "course": "5° Básico A",
        "auto": "2023",
        "rut": "24.574.448-K",
        "birthDate": "21/03/2014",
        "name": "Felipe Elías Jarpa González",
        "entryYear": "2023",
        "professional": "Michael Vera",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "22-10-2024",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "5EBA",
        "course": "5° Básico A",
        "auto": "2023",
        "rut": "24.574.448-K",
        "birthDate": "21/03/2014",
        "name": "Felipe Elías Jarpa González",
        "entryYear": "2023",
        "professional": "Michael Vera",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "22-10-2024",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Javier Alfonso Calderón Molina",
    "rut": "25.212.514-0",
    "course": "5° Básico A",
    "birthDate": "30/11/2015",
    "entryYear": "2026",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Yanel Parra",
    "professionals": [
      "Yanel Parra"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "5EBA",
        "course": "5° Básico A",
        "auto": "",
        "rut": "25.212.514-0",
        "birthDate": "30/11/2015",
        "name": "Javier Alfonso Calderón Molina",
        "entryYear": "2026",
        "professional": "Yanel Parra",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "2026-04-10",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Jhans Eduardo Jiménez Román",
    "rut": "25.317.202-9",
    "course": "5° Básico A",
    "birthDate": "12/03/2016",
    "entryYear": "2025",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Yanel Parra",
    "professionals": [
      "Yanel Parra"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "5EBA",
        "course": "5° Básico A",
        "auto": "2025",
        "rut": "25.317.202-9",
        "birthDate": "12/03/2016",
        "name": "Jhans Eduardo Jiménez Román",
        "entryYear": "2025",
        "professional": "Yanel Parra",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "01/04/2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "5EBA",
        "course": "5° Básico A",
        "auto": "2025",
        "rut": "25.317.202-9",
        "birthDate": "12/03/2016",
        "name": "Jhans Eduardo Jiménez Román",
        "entryYear": "2025",
        "professional": "Yanel Parra",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "01/04/2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Lorena Pascal Vergara Gallardo",
    "rut": "25.287.294-9",
    "course": "5° Básico A",
    "birthDate": "09/02/2016",
    "entryYear": "2023",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Yanel Parra",
    "professionals": [
      "Yanel Parra"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "5EBA",
        "course": "5° Básico A",
        "auto": "",
        "rut": "25.287.294-9",
        "birthDate": "09/02/2016",
        "name": "Lorena Pascal Vergara Gallardo",
        "entryYear": "2023",
        "professional": "Yanel Parra",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "29-10-2024",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Maximiliano León Cubillos Donoso",
    "rut": "25.303.385-1",
    "course": "5° Básico A",
    "birthDate": "27/02/2016",
    "entryYear": "2025",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Yanel Parra",
    "professionals": [
      "Yanel Parra"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "5EBA",
        "course": "5° Básico A",
        "auto": "2025",
        "rut": "25.303.385-1",
        "birthDate": "27/02/2016",
        "name": "Maximiliano León Cubillos Donoso",
        "entryYear": "2025",
        "professional": "Yanel Parra",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "08-11-2024",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "5EBA",
        "course": "5° Básico A",
        "auto": "2025",
        "rut": "25.303.385-1",
        "birthDate": "27/02/2016",
        "name": "Maximiliano León Cubillos Donoso",
        "entryYear": "2025",
        "professional": "Yanel Parra",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "08-11-2024",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Noa Belén Carrasco Fritis",
    "rut": "25.119.866-7",
    "course": "5° Básico A",
    "birthDate": "14/09/2015",
    "entryYear": "2025",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Yanel Parra",
    "professionals": [
      "Yanel Parra"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "5EBA",
        "course": "5° Básico A",
        "auto": "2025",
        "rut": "25.119.866-7",
        "birthDate": "14/09/2015",
        "name": "Noa Belén Carrasco Fritis",
        "entryYear": "2025",
        "professional": "Yanel Parra",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "31-03-2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "5EBA",
        "course": "5° Básico A",
        "auto": "2025",
        "rut": "25.119.866-7",
        "birthDate": "14/09/2015",
        "name": "Noa Belén Carrasco Fritis",
        "entryYear": "2025",
        "professional": "Yanel Parra",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "31-03-2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Paul Angel Steven Arenas Villanueva",
    "rut": "24.823.643-4",
    "course": "5° Básico A",
    "birthDate": "27/11/2014",
    "entryYear": "2023",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Michael Vera",
    "professionals": [
      "Michael Vera"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "5EBA",
        "course": "5° Básico A",
        "auto": "",
        "rut": "24.823.643-4",
        "birthDate": "27/11/2014",
        "name": "Paul Angel Steven Arenas Villanueva",
        "entryYear": "2023",
        "professional": "Michael Vera",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "20/10/2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Sofía Antonia Antipe Antipe",
    "rut": "25.207.970-K",
    "course": "5° Básico A",
    "birthDate": "23/11/2015",
    "entryYear": "2026",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Yanel Parra",
    "professionals": [
      "Yanel Parra"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "5EBA",
        "course": "5° Básico A",
        "auto": "",
        "rut": "25.207.970-K",
        "birthDate": "23/11/2015",
        "name": "Sofía Antonia Antipe Antipe",
        "entryYear": "2026",
        "professional": "Yanel Parra",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "13-03-2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Vicente Ignacio Salinas Marín",
    "rut": "25.135.139-2",
    "course": "5° Básico A",
    "birthDate": "15/10/2015",
    "entryYear": "2020",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Yanel Parra",
    "professionals": [
      "Yanel Parra"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "5EBA",
        "course": "5° Básico A",
        "auto": "",
        "rut": "25.135.139-2",
        "birthDate": "15/10/2015",
        "name": "Vicente Ignacio Salinas Marín",
        "entryYear": "2020",
        "professional": "Yanel Parra",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "13/03/2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Vicente Ignacio Ulloa Morales",
    "rut": "25.025.669-8",
    "course": "5° Básico A",
    "birthDate": "23/06/2015",
    "entryYear": "2024",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 3",
    "situaciones": [
      "NEEP - INICIO AÑO 3"
    ],
    "tipoNEE": "Permanente",
    "professional": "Yanel Parra",
    "professionals": [
      "Yanel Parra"
    ],
    "diagDate": "5.579.461-8",
    "evaluator": "Perla David",
    "evaluators": [
      "Perla David"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "5EBA",
        "course": "5° Básico A",
        "auto": "2024",
        "rut": "25.025.669-8",
        "birthDate": "23/06/2015",
        "name": "Vicente Ignacio Ulloa Morales",
        "entryYear": "2024",
        "professional": "Yanel Parra",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "diagDate": "5.579.461-8",
        "evaluatorRut": "24-11-2023",
        "evaluator": "Perla David",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "5EBA",
        "course": "5° Básico A",
        "auto": "2024",
        "rut": "25.025.669-8",
        "birthDate": "23/06/2015",
        "name": "Vicente Ignacio Ulloa Morales",
        "entryYear": "2024",
        "professional": "Yanel Parra",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "5.579.461-8",
        "evaluatorRut": "24-11-2023",
        "evaluator": "Perla David",
        "specialty": "Neurología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Vicente León Ramírez Mancilla",
    "rut": "25.243.509-3",
    "course": "5° Básico A",
    "birthDate": "02/01/2016",
    "entryYear": "2024",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 3",
    "situaciones": [
      "NEEP - INICIO AÑO 3"
    ],
    "tipoNEE": "Permanente",
    "professional": "Michael Vera",
    "professionals": [
      "Michael Vera"
    ],
    "diagDate": "5.579.461-8",
    "evaluator": "Perla David",
    "evaluators": [
      "Perla David"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "5EBA",
        "course": "5° Básico A",
        "auto": "2024",
        "rut": "25.243.509-3",
        "birthDate": "02/01/2016",
        "name": "Vicente León Ramírez Mancilla",
        "entryYear": "2024",
        "professional": "Michael Vera",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "diagDate": "5.579.461-8",
        "evaluatorRut": "07-09-2023",
        "evaluator": "Perla David",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "5EBA",
        "course": "5° Básico A",
        "auto": "2024",
        "rut": "25.243.509-3",
        "birthDate": "02/01/2016",
        "name": "Vicente León Ramírez Mancilla",
        "entryYear": "2024",
        "professional": "Michael Vera",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "5.579.461-8",
        "evaluatorRut": "07-09-2023",
        "evaluator": "Perla David",
        "specialty": "Neurología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Yohel Eduardo Jara Bastías",
    "rut": "25.208.590-4",
    "course": "5° Básico A",
    "birthDate": "27/11/2015",
    "entryYear": "2021",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 5",
    "situaciones": [
      "NEEP - INICIO AÑO 5"
    ],
    "tipoNEE": "Permanente",
    "professional": "Michael Vera",
    "professionals": [
      "Michael Vera"
    ],
    "diagDate": "16.835.580-7",
    "evaluator": "Mónica Barriere",
    "evaluators": [
      "Mónica Barriere"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "5EBA",
        "course": "5° Básico A",
        "auto": "2024",
        "rut": "25.208.590-4",
        "birthDate": "27/11/2015",
        "name": "Yohel Eduardo Jara Bastías",
        "entryYear": "2021",
        "professional": "Michael Vera",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 5",
        "tipoNEE": "Permanente",
        "diagDate": "16.835.580-7",
        "evaluatorRut": "20-12-2023",
        "evaluator": "Mónica Barriere",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "5EBA",
        "course": "5° Básico A",
        "auto": "2024",
        "rut": "25.208.590-4",
        "birthDate": "27/11/2015",
        "name": "Yohel Eduardo Jara Bastías",
        "entryYear": "2021",
        "professional": "Michael Vera",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 5",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "16.835.580-7",
        "evaluatorRut": "20-12-2023",
        "evaluator": "Mónica Barriere",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Agustín Ignacio Torrealba Fuentealba",
    "rut": "25.277.069-0",
    "course": "5° Básico B",
    "birthDate": "30/01/2016",
    "entryYear": "2026",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Yanel Parra",
    "professionals": [
      "Yanel Parra"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "5EBB",
        "course": "5° Básico B",
        "auto": "",
        "rut": "25.277.069-0",
        "birthDate": "30/01/2016",
        "name": "Agustín Ignacio Torrealba Fuentealba",
        "entryYear": "2026",
        "professional": "Yanel Parra",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "13/03/2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Carla Sarai Contreras Neira",
    "rut": "25.176.189-2",
    "course": "5° Básico B",
    "birthDate": "30/10/2015",
    "entryYear": "2023",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Yanel Parra",
    "professionals": [
      "Yanel Parra"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "5EBB",
        "course": "5° Básico B",
        "auto": "2023",
        "rut": "25.176.189-2",
        "birthDate": "30/10/2015",
        "name": "Carla Sarai Contreras Neira",
        "entryYear": "2023",
        "professional": "Yanel Parra",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "05-11-2024",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "5EBB",
        "course": "5° Básico B",
        "auto": "2023",
        "rut": "25.176.189-2",
        "birthDate": "30/10/2015",
        "name": "Carla Sarai Contreras Neira",
        "entryYear": "2023",
        "professional": "Yanel Parra",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "05-11-2024",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Christopher Adrian Castro Pulido",
    "rut": "28.044.493-6",
    "course": "5° Básico B",
    "birthDate": "24/04/2015",
    "entryYear": "2026",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Yanel Parra",
    "professionals": [
      "Yanel Parra"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "19"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "5EBB",
        "course": "5° Básico B",
        "auto": "19",
        "rut": "28.044.493-6",
        "birthDate": "24/04/2015",
        "name": "Christopher Adrian Castro Pulido",
        "entryYear": "2026",
        "professional": "Yanel Parra",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "19-11-2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "19",
        "courseCode": "5EBB",
        "course": "5° Básico B",
        "auto": "19",
        "rut": "28.044.493-6",
        "birthDate": "24/04/2015",
        "name": "Christopher Adrian Castro Pulido",
        "entryYear": "2026",
        "professional": "Yanel Parra",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "19-11-2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Damián Alexis Vargas Órdenes",
    "rut": "25.232.823-8",
    "course": "5° Básico B",
    "birthDate": "16/12/2015",
    "entryYear": "2024",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 3",
    "situaciones": [
      "NEEP - INICIO AÑO 3"
    ],
    "tipoNEE": "Permanente",
    "professional": "Yanel Parra",
    "professionals": [
      "Yanel Parra"
    ],
    "diagDate": "5.579.461-8",
    "evaluator": "Perla David",
    "evaluators": [
      "Perla David"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "5EBB",
        "course": "5° Básico B",
        "auto": "2024",
        "rut": "25.232.823-8",
        "birthDate": "16/12/2015",
        "name": "Damián Alexis Vargas Órdenes",
        "entryYear": "2024",
        "professional": "Yanel Parra",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "diagDate": "5.579.461-8",
        "evaluatorRut": "22-01-2024",
        "evaluator": "Perla David",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "5EBB",
        "course": "5° Básico B",
        "auto": "2024",
        "rut": "25.232.823-8",
        "birthDate": "16/12/2015",
        "name": "Damián Alexis Vargas Órdenes",
        "entryYear": "2024",
        "professional": "Yanel Parra",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "5.579.461-8",
        "evaluatorRut": "22-01-2024",
        "evaluator": "Perla David",
        "specialty": "Neurología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Florencia Souling Arancibia Arellano",
    "rut": "25.248.588-0",
    "course": "5° Básico B",
    "birthDate": "07/01/2016",
    "entryYear": "2020",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 5",
    "situaciones": [
      "NEEP - INICIO AÑO 5"
    ],
    "tipoNEE": "Permanente",
    "professional": "Yanel Parra",
    "professionals": [
      "Yanel Parra"
    ],
    "diagDate": "16.836.992-1",
    "evaluator": "Karem Andaur",
    "evaluators": [
      "Karem Andaur"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "5EBB",
        "course": "5° Básico B",
        "auto": "",
        "rut": "25.248.588-0",
        "birthDate": "07/01/2016",
        "name": "Florencia Souling Arancibia Arellano",
        "entryYear": "2020",
        "professional": "Yanel Parra",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 5",
        "tipoNEE": "Permanente",
        "diagDate": "16.836.992-1",
        "evaluatorRut": "28-03-22",
        "evaluator": "Karem Andaur",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Ian Iñaki Salinas Álvarez",
    "rut": "24.672.771-6",
    "course": "5° Básico B",
    "birthDate": "30/06/2014",
    "entryYear": "2024",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
    "situaciones": [
      "NEET - INICIO AÑO 1 (REINGRESO)"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Yanel Parra",
    "professionals": [
      "Yanel Parra"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "5EBB",
        "course": "5° Básico B",
        "auto": "",
        "rut": "24.672.771-6",
        "birthDate": "30/06/2014",
        "name": "Ian Iñaki Salinas Álvarez",
        "entryYear": "2024",
        "professional": "Yanel Parra",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "13-03-2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Isaac Antonio Navarrete Sobarzo",
    "rut": "24.987.423-K",
    "course": "5° Básico B",
    "birthDate": "18/05/2015",
    "entryYear": "2026",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Yanel Parra",
    "professionals": [
      "Yanel Parra"
    ],
    "diagDate": "14.257.476-4",
    "evaluator": "Guillermo Guzman",
    "evaluators": [
      "Guillermo Guzman"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "20"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "5EBB",
        "course": "5° Básico B",
        "auto": "20",
        "rut": "24.987.423-K",
        "birthDate": "18/05/2015",
        "name": "Isaac Antonio Navarrete Sobarzo",
        "entryYear": "2026",
        "professional": "Yanel Parra",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "14.257.476-4",
        "evaluatorRut": "18-3-2026",
        "evaluator": "Guillermo Guzman",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "20",
        "courseCode": "5EBB",
        "course": "5° Básico B",
        "auto": "20",
        "rut": "24.987.423-K",
        "birthDate": "18/05/2015",
        "name": "Isaac Antonio Navarrete Sobarzo",
        "entryYear": "2026",
        "professional": "Yanel Parra",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.257.476-4",
        "evaluatorRut": "18-3-2026",
        "evaluator": "Guillermo Guzman",
        "specialty": "Neurología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Jorge Ricardo Reyes Tejeda",
    "rut": "25.336.811-K",
    "course": "5° Básico B",
    "birthDate": "26/03/2016",
    "entryYear": "2020",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Yanel Parra",
    "professionals": [
      "Yanel Parra"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "5EBB",
        "course": "5° Básico B",
        "auto": "",
        "rut": "25.336.811-K",
        "birthDate": "26/03/2016",
        "name": "Jorge Ricardo Reyes Tejeda",
        "entryYear": "2020",
        "professional": "Yanel Parra",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "23/10/2024",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Mateo Isaac Elgueta Vidal",
    "rut": "25.036.582-9",
    "course": "5° Básico B",
    "birthDate": "06/07/2015",
    "entryYear": "2025",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Yanel Parra",
    "professionals": [
      "Yanel Parra"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "5EBB",
        "course": "5° Básico B",
        "auto": "",
        "rut": "25.036.582-9",
        "birthDate": "06/07/2015",
        "name": "Mateo Isaac Elgueta Vidal",
        "entryYear": "2025",
        "professional": "Yanel Parra",
        "diag": "FIL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "27-11-2024",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Mia Pascal Estrella Venegas Gutiérrez",
    "rut": "24.847.705-9",
    "course": "5° Básico B",
    "birthDate": "03/01/2015",
    "entryYear": "2022",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
    "situaciones": [
      "NEET - INICIO AÑO 1 (REINGRESO)"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Yanel Parra",
    "professionals": [
      "Yanel Parra"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Cortes Fabiana Acevedo",
    "evaluators": [
      "Cortes Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "5EBB",
        "course": "5° Básico B",
        "auto": "",
        "rut": "24.847.705-9",
        "birthDate": "03/01/2015",
        "name": "Mia Pascal Estrella Venegas Gutiérrez",
        "entryYear": "2022",
        "professional": "Yanel Parra",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
        "tipoNEE": "Transitoria",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "19-11-2025",
        "evaluator": "Cortes Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Roger Luciano Rodríguez Cusi",
    "rut": "24.771.817-6",
    "course": "5° Básico B",
    "birthDate": "16/10/2014",
    "entryYear": "2023",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Yanel Parra",
    "professionals": [
      "Yanel Parra"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "5EBB",
        "course": "5° Básico B",
        "auto": "",
        "rut": "24.771.817-6",
        "birthDate": "16/10/2014",
        "name": "Roger Luciano Rodríguez Cusi",
        "entryYear": "2023",
        "professional": "Yanel Parra",
        "diag": "FIL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "30-10-2024",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Adonis Anthuan Álvarez Riquelme",
    "rut": "24.928.026-7",
    "course": "6° Básico A",
    "birthDate": "10/03/2015",
    "entryYear": "2026",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Andrea Linco",
    "professionals": [
      "Andrea Linco"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "6EBA",
        "course": "6° Básico A",
        "auto": "",
        "rut": "24.928.026-7",
        "birthDate": "10/03/2015",
        "name": "Adonis Anthuan Álvarez Riquelme",
        "entryYear": "2026",
        "professional": "Andrea Linco",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "13/03/2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Amaro Ignacio Valderrama González",
    "rut": "24.609.260-5",
    "course": "6° Básico A",
    "birthDate": "28/04/2014",
    "entryYear": "2026",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Andrea Linco",
    "professionals": [
      "Andrea Linco"
    ],
    "diagDate": "14.739.429-5",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "22"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "6EBA",
        "course": "6° Básico A",
        "auto": "22",
        "rut": "24.609.260-5",
        "birthDate": "28/04/2014",
        "name": "Amaro Ignacio Valderrama González",
        "entryYear": "2026",
        "professional": "Andrea Linco",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-5",
        "evaluatorRut": "10/02/2026",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "22",
        "courseCode": "6EBA",
        "course": "6° Básico A",
        "auto": "22",
        "rut": "24.609.260-5",
        "birthDate": "28/04/2014",
        "name": "Amaro Ignacio Valderrama González",
        "entryYear": "2026",
        "professional": "Andrea Linco",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-5",
        "evaluatorRut": "10/02/2026",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Elian Isaias Olate González",
    "rut": "24.884.460-4",
    "course": "6° Básico A",
    "birthDate": "28/01/2015",
    "entryYear": "2026",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Andrea Linco",
    "professionals": [
      "Andrea Linco"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicóloga",
    "specialties": [
      "Psicóloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "6EBA",
        "course": "6° Básico A",
        "auto": "",
        "rut": "24.884.460-4",
        "birthDate": "28/01/2015",
        "name": "Elian Isaias Olate González",
        "entryYear": "2026",
        "professional": "Andrea Linco",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "20/03/2026",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicóloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Genesis Anays Aguilera Ortiz",
    "rut": "24.499.198-K",
    "course": "6° Básico A",
    "birthDate": "02/01/2014",
    "entryYear": "2023",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Andrea Linco",
    "professionals": [
      "Andrea Linco"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "6EBA",
        "course": "6° Básico A",
        "auto": "2023",
        "rut": "24.499.198-K",
        "birthDate": "02/01/2014",
        "name": "Genesis Anays Aguilera Ortiz",
        "entryYear": "2023",
        "professional": "Andrea Linco",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "11-11-2024",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "6EBA",
        "course": "6° Básico A",
        "auto": "2023",
        "rut": "24.499.198-K",
        "birthDate": "02/01/2014",
        "name": "Genesis Anays Aguilera Ortiz",
        "entryYear": "2023",
        "professional": "Andrea Linco",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "11-11-2024",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Lían Azael Parraga Isaias",
    "rut": "28.559.730-7",
    "course": "6° Básico A",
    "birthDate": "06/01/2015",
    "entryYear": "2026",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Andrea Linco",
    "professionals": [
      "Andrea Linco"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "24"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "6EBA",
        "course": "6° Básico A",
        "auto": "24",
        "rut": "28.559.730-7",
        "birthDate": "06/01/2015",
        "name": "Lían Azael Parraga Isaias",
        "entryYear": "2026",
        "professional": "Andrea Linco",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "23/03/2026",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "24",
        "courseCode": "6EBA",
        "course": "6° Básico A",
        "auto": "24",
        "rut": "28.559.730-7",
        "birthDate": "06/01/2015",
        "name": "Lían Azael Parraga Isaias",
        "entryYear": "2026",
        "professional": "Andrea Linco",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "23/03/2026",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Madeline Stephania Montano Arancibia",
    "rut": "24.321.764-4",
    "course": "6° Básico A",
    "birthDate": "21/06/2013",
    "entryYear": "2024",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Andrea Linco",
    "professionals": [
      "Andrea Linco"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "6EBA",
        "course": "6° Básico A",
        "auto": "2024",
        "rut": "24.321.764-4",
        "birthDate": "21/06/2013",
        "name": "Madeline Stephania Montano Arancibia",
        "entryYear": "2024",
        "professional": "Andrea Linco",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "20/10/2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "6EBA",
        "course": "6° Básico A",
        "auto": "2024",
        "rut": "24.321.764-4",
        "birthDate": "21/06/2013",
        "name": "Madeline Stephania Montano Arancibia",
        "entryYear": "2024",
        "professional": "Andrea Linco",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "20/10/2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Maite Antonella Provoste Huichicoy",
    "rut": "24.590.554-8",
    "course": "6° Básico A",
    "birthDate": "10/04/2014",
    "entryYear": "2026",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Andrea Linco",
    "professionals": [
      "Andrea Linco"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "6EBA",
        "course": "6° Básico A",
        "auto": "",
        "rut": "24.590.554-8",
        "birthDate": "10/04/2014",
        "name": "Maite Antonella Provoste Huichicoy",
        "entryYear": "2026",
        "professional": "Andrea Linco",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "13/03/2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Millaray Javiera Florencia Vigueras Caris",
    "rut": "24.895.377-2",
    "course": "6° Básico A",
    "birthDate": "09/02/2015",
    "entryYear": "2022",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Andrea Linco",
    "professionals": [
      "Andrea Linco"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "23"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "6EBA",
        "course": "6° Básico A",
        "auto": "23",
        "rut": "24.895.377-2",
        "birthDate": "09/02/2015",
        "name": "Millaray Javiera Florencia Vigueras Caris",
        "entryYear": "2022",
        "professional": "Andrea Linco",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "09/10/2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "23",
        "courseCode": "6EBA",
        "course": "6° Básico A",
        "auto": "23",
        "rut": "24.895.377-2",
        "birthDate": "09/02/2015",
        "name": "Millaray Javiera Florencia Vigueras Caris",
        "entryYear": "2022",
        "professional": "Andrea Linco",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "09/10/2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Nehemi Wily Mondesir Gelin",
    "rut": "24.277.563-5",
    "course": "6° Básico A",
    "birthDate": "15/05/2013",
    "entryYear": "2026",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Andrea Linco",
    "professionals": [
      "Andrea Linco"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "21"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "6EBA",
        "course": "6° Básico A",
        "auto": "21",
        "rut": "24.277.563-5",
        "birthDate": "15/05/2013",
        "name": "Nehemi Wily Mondesir Gelin",
        "entryYear": "2026",
        "professional": "Andrea Linco",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "17/11/2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "21",
        "courseCode": "6EBA",
        "course": "6° Básico A",
        "auto": "21",
        "rut": "24.277.563-5",
        "birthDate": "15/05/2013",
        "name": "Nehemi Wily Mondesir Gelin",
        "entryYear": "2026",
        "professional": "Andrea Linco",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "17/11/2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Stephano Andrés Ojeda Iglesias",
    "rut": "24.838.697-5",
    "course": "6° Básico A",
    "birthDate": "21/12/2014",
    "entryYear": "2022",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Andrea Linco",
    "professionals": [
      "Andrea Linco"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "6EBA",
        "course": "6° Básico A",
        "auto": "",
        "rut": "24.838.697-5",
        "birthDate": "21/12/2014",
        "name": "Stephano Andrés Ojeda Iglesias",
        "entryYear": "2022",
        "professional": "Andrea Linco",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "08/10/2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Tamara Valeska Duarte García",
    "rut": "24.924.882-7",
    "course": "6° Básico A",
    "birthDate": "09/03/2015",
    "entryYear": "2026",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Andrea Linco",
    "professionals": [
      "Andrea Linco"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "6EBA",
        "course": "6° Básico A",
        "auto": "",
        "rut": "24.924.882-7",
        "birthDate": "09/03/2015",
        "name": "Tamara Valeska Duarte García",
        "entryYear": "2026",
        "professional": "Andrea Linco",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "13/03/2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Vicente Agustín Zambrano Díaz",
    "rut": "24.726.347-0",
    "course": "6° Básico A",
    "birthDate": "29/08/2014",
    "entryYear": "2025",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Andrea Linco",
    "professionals": [
      "Andrea Linco"
    ],
    "diagDate": "14604162-0",
    "evaluator": "Alvarado Stalin",
    "evaluators": [
      "Alvarado Stalin"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "6EBA",
        "course": "6° Básico A",
        "auto": "",
        "rut": "24.726.347-0",
        "birthDate": "29/08/2014",
        "name": "Vicente Agustín Zambrano Díaz",
        "entryYear": "2025",
        "professional": "Andrea Linco",
        "diag": "TDA",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "14604162-0",
        "evaluatorRut": "26-06-2024",
        "evaluator": "Alvarado Stalin",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Victoria Noemí Seguel Peralta",
    "rut": "24.811.913-6",
    "course": "6° Básico A",
    "birthDate": "25/11/2014",
    "entryYear": "2019",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 3",
    "situaciones": [
      "NEEP - INICIO AÑO 3"
    ],
    "tipoNEE": "Permanente",
    "professional": "Andrea Linco",
    "professionals": [
      "Andrea Linco"
    ],
    "diagDate": "7368306-8",
    "evaluator": "Marcela Paredes",
    "evaluators": [
      "Marcela Paredes"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "6EBA",
        "course": "6° Básico A",
        "auto": "",
        "rut": "24.811.913-6",
        "birthDate": "25/11/2014",
        "name": "Victoria Noemí Seguel Peralta",
        "entryYear": "2019",
        "professional": "Andrea Linco",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "diagDate": "7368306-8",
        "evaluatorRut": "14-03-2024",
        "evaluator": "Marcela Paredes",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Agustín Ignacio Romero Ponce",
    "rut": "24.732.275-2",
    "course": "6° Básico B",
    "birthDate": "02/09/2014",
    "entryYear": "2023",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Andrea Linco",
    "professionals": [
      "Andrea Linco"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "6EBB",
        "course": "6° Básico B",
        "auto": "",
        "rut": "24.732.275-2",
        "birthDate": "02/09/2014",
        "name": "Agustín Ignacio Romero Ponce",
        "entryYear": "2023",
        "professional": "Andrea Linco",
        "diag": "FIL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "4-11-2024",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Amaro Agustín Bravo Bettancourt",
    "rut": "24.551.837-4",
    "course": "6° Básico B",
    "birthDate": "27/02/2014",
    "entryYear": "2023",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Andrea Linco",
    "professionals": [
      "Andrea Linco"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "6EBB",
        "course": "6° Básico B",
        "auto": "",
        "rut": "24.551.837-4",
        "birthDate": "27/02/2014",
        "name": "Amaro Agustín Bravo Bettancourt",
        "entryYear": "2023",
        "professional": "Andrea Linco",
        "diag": "FIL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "11-11-2024",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Carl Andy Cesar Cesar",
    "rut": "26.055.655-K",
    "course": "6° Básico B",
    "birthDate": "20/08/2014",
    "entryYear": "2024",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Michael Vera",
    "professionals": [
      "Michael Vera"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "6EBB",
        "course": "6° Básico B",
        "auto": "2024",
        "rut": "26.055.655-K",
        "birthDate": "20/08/2014",
        "name": "Carl Andy Cesar Cesar",
        "entryYear": "2024",
        "professional": "Michael Vera",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "30-09-2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "6EBB",
        "course": "6° Básico B",
        "auto": "2024",
        "rut": "26.055.655-K",
        "birthDate": "20/08/2014",
        "name": "Carl Andy Cesar Cesar",
        "entryYear": "2024",
        "professional": "Michael Vera",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "30-09-2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Colomba Pascale Silva Peredo",
    "rut": "24.945.036-7",
    "course": "6° Básico B",
    "birthDate": "31/03/2015",
    "entryYear": "2025",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Andrea Linco",
    "professionals": [
      "Andrea Linco"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "6EBB",
        "course": "6° Básico B",
        "auto": "",
        "rut": "24.945.036-7",
        "birthDate": "31/03/2015",
        "name": "Colomba Pascale Silva Peredo",
        "entryYear": "2025",
        "professional": "Andrea Linco",
        "diag": "FIL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "27-11-2024",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Ian Alexander Hurtado Venegas",
    "rut": "24.926.321-4",
    "course": "6° Básico B",
    "birthDate": "12/03/2015",
    "entryYear": "2020",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Michael Vera",
    "professionals": [
      "Michael Vera"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "6EBB",
        "course": "6° Básico B",
        "auto": "",
        "rut": "24.926.321-4",
        "birthDate": "12/03/2015",
        "name": "Ian Alexander Hurtado Venegas",
        "entryYear": "2020",
        "professional": "Michael Vera",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "08/10/2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Jair Karim Soto Medina",
    "rut": "24.664.915-4",
    "course": "6° Básico B",
    "birthDate": "20/06/2014",
    "entryYear": "2026",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Andrea Linco",
    "professionals": [
      "Andrea Linco"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "6EBB",
        "course": "6° Básico B",
        "auto": "",
        "rut": "24.664.915-4",
        "birthDate": "20/06/2014",
        "name": "Jair Karim Soto Medina",
        "entryYear": "2026",
        "professional": "Andrea Linco",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "13/03/2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Joaquín Esteban Torrealba Fuentealba",
    "rut": "24.666.462-5",
    "course": "6° Básico B",
    "birthDate": "10/06/2014",
    "entryYear": "2026",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Andrea Linco",
    "professionals": [
      "Andrea Linco"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "6EBB",
        "course": "6° Básico B",
        "auto": "",
        "rut": "24.666.462-5",
        "birthDate": "10/06/2014",
        "name": "Joaquín Esteban Torrealba Fuentealba",
        "entryYear": "2026",
        "professional": "Andrea Linco",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "13/03/2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Luan Ignacio Díaz Obando",
    "rut": "24.723.222-2",
    "course": "6° Básico B",
    "birthDate": "24/08/2014",
    "entryYear": "2024",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 3",
    "situaciones": [
      "NEEP - INICIO AÑO 3"
    ],
    "tipoNEE": "Permanente",
    "professional": "Michael Vera",
    "professionals": [
      "Michael Vera"
    ],
    "diagDate": "16.835.580-7",
    "evaluator": "Mónica Barriere",
    "evaluators": [
      "Mónica Barriere"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "6EBB",
        "course": "6° Básico B",
        "auto": "2024",
        "rut": "24.723.222-2",
        "birthDate": "24/08/2014",
        "name": "Luan Ignacio Díaz Obando",
        "entryYear": "2024",
        "professional": "Michael Vera",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "diagDate": "16.835.580-7",
        "evaluatorRut": "20-12-2023",
        "evaluator": "Mónica Barriere",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "6EBB",
        "course": "6° Básico B",
        "auto": "2024",
        "rut": "24.723.222-2",
        "birthDate": "24/08/2014",
        "name": "Luan Ignacio Díaz Obando",
        "entryYear": "2024",
        "professional": "Michael Vera",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "16.835.580-7",
        "evaluatorRut": "20-12-2023",
        "evaluator": "Mónica Barriere",
        "specialty": "Neurología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Lucas Alonso Núñez Galaz",
    "rut": "24.558.005-3",
    "course": "6° Básico B",
    "birthDate": "06/03/2014",
    "entryYear": "2026",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Michael Vera",
    "professionals": [
      "Michael Vera"
    ],
    "diagDate": "8.008.059-9",
    "evaluator": "Carmen León Martinez",
    "evaluators": [
      "Carmen León Martinez"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "25"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "6EBB",
        "course": "6° Básico B",
        "auto": "25",
        "rut": "24.558.005-3",
        "birthDate": "06/03/2014",
        "name": "Lucas Alonso Núñez Galaz",
        "entryYear": "2026",
        "professional": "Michael Vera",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "8.008.059-9",
        "evaluatorRut": "01-12-2025",
        "evaluator": "Carmen León Martinez",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "25",
        "courseCode": "6EBB",
        "course": "6° Básico B",
        "auto": "25",
        "rut": "24.558.005-3",
        "birthDate": "06/03/2014",
        "name": "Lucas Alonso Núñez Galaz",
        "entryYear": "2026",
        "professional": "Michael Vera",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "8.008.059-9",
        "evaluatorRut": "01-12-2025",
        "evaluator": "Carmen León Martinez",
        "specialty": "Neurología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Luis Joaquín Cifuentes Díaz",
    "rut": "24.765.389-9",
    "course": "6° Básico B",
    "birthDate": "08/10/2014",
    "entryYear": "2025",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Michael Vera",
    "professionals": [
      "Michael Vera"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "6EBB",
        "course": "6° Básico B",
        "auto": "2025",
        "rut": "24.765.389-9",
        "birthDate": "08/10/2014",
        "name": "Luis Joaquín Cifuentes Díaz",
        "entryYear": "2025",
        "professional": "Michael Vera",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "05-09-2024",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "6EBB",
        "course": "6° Básico B",
        "auto": "2025",
        "rut": "24.765.389-9",
        "birthDate": "08/10/2014",
        "name": "Luis Joaquín Cifuentes Díaz",
        "entryYear": "2025",
        "professional": "Michael Vera",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "05-09-2024",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Paulett Ignacia Sáez González",
    "rut": "24.753.859-3",
    "course": "6° Básico B",
    "birthDate": "17/09/2014",
    "entryYear": "2024",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Michael Vera",
    "professionals": [
      "Michael Vera"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "6EBB",
        "course": "6° Básico B",
        "auto": "2024",
        "rut": "24.753.859-3",
        "birthDate": "17/09/2014",
        "name": "Paulett Ignacia Sáez González",
        "entryYear": "2024",
        "professional": "Michael Vera",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "07/10/2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "6EBB",
        "course": "6° Básico B",
        "auto": "2024",
        "rut": "24.753.859-3",
        "birthDate": "17/09/2014",
        "name": "Paulett Ignacia Sáez González",
        "entryYear": "2024",
        "professional": "Michael Vera",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "07/10/2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Vicente Rodrigo Vial Becerra",
    "rut": "24.413.220-0",
    "course": "6° Básico B",
    "birthDate": "14/10/2013",
    "entryYear": "2020",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Michael Vera",
    "professionals": [
      "Michael Vera"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "6EBB",
        "course": "6° Básico B",
        "auto": "",
        "rut": "24.413.220-0",
        "birthDate": "14/10/2013",
        "name": "Vicente Rodrigo Vial Becerra",
        "entryYear": "2020",
        "professional": "Michael Vera",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "02/04/2026",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Anaís Alejandra Olivares González",
    "rut": "24.582.944-2",
    "course": "7° Básico A",
    "birthDate": "10/03/2014",
    "entryYear": "2024",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Diego Lagos",
    "professionals": [
      "Diego Lagos"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "7EBA",
        "course": "7° Básico A",
        "auto": "",
        "rut": "24.582.944-2",
        "birthDate": "10/03/2014",
        "name": "Anaís Alejandra Olivares González",
        "entryYear": "2024",
        "professional": "Diego Lagos",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "09/10/2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Benjamín Alonso Larrondo Huenul",
    "rut": "24.191.690-1",
    "course": "7° Básico A",
    "birthDate": "12/02/2013",
    "entryYear": "2020",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Carrillo",
    "professionals": [
      "Daniela Carrillo"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "7EBA",
        "course": "7° Básico A",
        "auto": "",
        "rut": "24.191.690-1",
        "birthDate": "12/02/2013",
        "name": "Benjamín Alonso Larrondo Huenul",
        "entryYear": "2020",
        "professional": "Daniela Carrillo",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "01-10-2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Doménico Baltazar Apiolaza Puglisivich",
    "rut": "24.428.883-9",
    "course": "7° Básico A",
    "birthDate": "24/10/2013",
    "entryYear": "2023",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 4",
    "situaciones": [
      "NEEP - INICIO AÑO 4"
    ],
    "tipoNEE": "Permanente",
    "professional": "Diego Lagos",
    "professionals": [
      "Diego Lagos"
    ],
    "diagDate": "16.430.431-0",
    "evaluator": "Ingrid Cardoso",
    "evaluators": [
      "Ingrid Cardoso"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "7EBA",
        "course": "7° Básico A",
        "auto": "",
        "rut": "24.428.883-9",
        "birthDate": "24/10/2013",
        "name": "Doménico Baltazar Apiolaza Puglisivich",
        "entryYear": "2023",
        "professional": "Diego Lagos",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 4",
        "tipoNEE": "Permanente",
        "diagDate": "16.430.431-0",
        "evaluatorRut": "12-05-2023",
        "evaluator": "Ingrid Cardoso",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Humberto Andrés González Gatica",
    "rut": "24.235.100-2",
    "course": "7° Básico A",
    "birthDate": "01/04/2013",
    "entryYear": "2025",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 3",
    "situaciones": [
      "NEEP - INICIO AÑO 3"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Carrillo",
    "professionals": [
      "Daniela Carrillo"
    ],
    "diagDate": "5.579.461-8",
    "evaluator": "Perla David",
    "evaluators": [
      "Perla David"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "7EBA",
        "course": "7° Básico A",
        "auto": "2025",
        "rut": "24.235.100-2",
        "birthDate": "01/04/2013",
        "name": "Humberto Andrés González Gatica",
        "entryYear": "2025",
        "professional": "Daniela Carrillo",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "diagDate": "5.579.461-8",
        "evaluatorRut": "12-11-2024",
        "evaluator": "Perla David",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "7EBA",
        "course": "7° Básico A",
        "auto": "2025",
        "rut": "24.235.100-2",
        "birthDate": "01/04/2013",
        "name": "Humberto Andrés González Gatica",
        "entryYear": "2025",
        "professional": "Daniela Carrillo",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "5.579.461-8",
        "evaluatorRut": "12-11-2024",
        "evaluator": "Perla David",
        "specialty": "Neurología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Kevin Agustín Núñez Becerra",
    "rut": "24.460.541-9",
    "course": "7° Básico A",
    "birthDate": "22/11/2013",
    "entryYear": "2026",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Diego Lagos",
    "professionals": [
      "Diego Lagos"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "7EBA",
        "course": "7° Básico A",
        "auto": "",
        "rut": "24.460.541-9",
        "birthDate": "22/11/2013",
        "name": "Kevin Agustín Núñez Becerra",
        "entryYear": "2026",
        "professional": "Diego Lagos",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "30/07/2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Lian Santos Santibáñez Febrero",
    "rut": "24.298.379-3",
    "course": "7° Básico A",
    "birthDate": "06/06/2013",
    "entryYear": "2019",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 4",
    "situaciones": [
      "NEEP - INICIO AÑO 4"
    ],
    "tipoNEE": "Permanente",
    "professional": "Diego Lagos",
    "professionals": [
      "Diego Lagos"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "7EBA",
        "course": "7° Básico A",
        "auto": "2024",
        "rut": "24.298.379-3",
        "birthDate": "06/06/2013",
        "name": "Lian Santos Santibáñez Febrero",
        "entryYear": "2019",
        "professional": "Diego Lagos",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 4",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "13-06-2024",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "7EBA",
        "course": "7° Básico A",
        "auto": "2024",
        "rut": "24.298.379-3",
        "birthDate": "06/06/2013",
        "name": "Lian Santos Santibáñez Febrero",
        "entryYear": "2019",
        "professional": "Diego Lagos",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 4",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "13-06-2024",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Mathias José del Piero Quito Aguilar",
    "rut": "28.389.859-8",
    "course": "7° Básico A",
    "birthDate": "02/10/2013",
    "entryYear": "2026",
    "diag": "DEA",
    "diagnoses": [
      "DEA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Diego Lagos",
    "professionals": [
      "Diego Lagos"
    ],
    "diagDate": "18.586.934-2",
    "evaluator": "Diego Lagos",
    "evaluators": [
      "Diego Lagos"
    ],
    "specialty": "Prof. Diferencial",
    "specialties": [
      "Prof. Diferencial"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "7EBA",
        "course": "7° Básico A",
        "auto": "",
        "rut": "28.389.859-8",
        "birthDate": "02/10/2013",
        "name": "Mathias José del Piero Quito Aguilar",
        "entryYear": "2026",
        "professional": "Diego Lagos",
        "diag": "DEA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "18.586.934-2",
        "evaluatorRut": "31-03-2026",
        "evaluator": "Diego Lagos",
        "specialty": "Prof. Diferencial",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Nelson Felipe Alonso Olivares Olivares",
    "rut": "23.557.549-3",
    "course": "7° Básico A",
    "birthDate": "11/02/2011",
    "entryYear": "2026",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Carrillo",
    "professionals": [
      "Daniela Carrillo"
    ],
    "diagDate": "10.621.545-6",
    "evaluator": "Yasna Vera Alarcón",
    "evaluators": [
      "Yasna Vera Alarcón"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "26"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "7EBA",
        "course": "7° Básico A",
        "auto": "26",
        "rut": "23.557.549-3",
        "birthDate": "11/02/2011",
        "name": "Nelson Felipe Alonso Olivares Olivares",
        "entryYear": "2026",
        "professional": "Daniela Carrillo",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "10.621.545-6",
        "evaluatorRut": "11-8-2025",
        "evaluator": "Yasna Vera Alarcón",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "26",
        "courseCode": "7EBA",
        "course": "7° Básico A",
        "auto": "26",
        "rut": "23.557.549-3",
        "birthDate": "11/02/2011",
        "name": "Nelson Felipe Alonso Olivares Olivares",
        "entryYear": "2026",
        "professional": "Daniela Carrillo",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "10.621.545-6",
        "evaluatorRut": "11-8-2025",
        "evaluator": "Yasna Vera Alarcón",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Pascal Molina Ortega",
    "rut": "24.240.898-5",
    "course": "7° Básico A",
    "birthDate": "25/03/2013",
    "entryYear": "2026",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Diego Lagos",
    "professionals": [
      "Diego Lagos"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "7EBA",
        "course": "7° Básico A",
        "auto": "",
        "rut": "24.240.898-5",
        "birthDate": "25/03/2013",
        "name": "Pascal Molina Ortega",
        "entryYear": "2026",
        "professional": "Diego Lagos",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "13-03-2026",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Tomás Antoine Torrealba Troncoso",
    "rut": "24.399.183-8",
    "course": "7° Básico A",
    "birthDate": "30/09/2013",
    "entryYear": "2024",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 3",
    "situaciones": [
      "NEEP - INICIO AÑO 3"
    ],
    "tipoNEE": "Permanente",
    "professional": "Diego Lagos",
    "professionals": [
      "Diego Lagos"
    ],
    "diagDate": "16.312.271-5",
    "evaluator": "Verónica Irrutia",
    "evaluators": [
      "Verónica Irrutia"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "7EBA",
        "course": "7° Básico A",
        "auto": "2024",
        "rut": "24.399.183-8",
        "birthDate": "30/09/2013",
        "name": "Tomás Antoine Torrealba Troncoso",
        "entryYear": "2024",
        "professional": "Diego Lagos",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "diagDate": "16.312.271-5",
        "evaluatorRut": "11-01-2024",
        "evaluator": "Verónica Irrutia",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "7EBA",
        "course": "7° Básico A",
        "auto": "2024",
        "rut": "24.399.183-8",
        "birthDate": "30/09/2013",
        "name": "Tomás Antoine Torrealba Troncoso",
        "entryYear": "2024",
        "professional": "Diego Lagos",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "16.312.271-5",
        "evaluatorRut": "11-01-2024",
        "evaluator": "Verónica Irrutia",
        "specialty": "Neurología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Zoe Camila Miranda Alejandro",
    "rut": "28.234.564-1",
    "course": "7° Básico A",
    "birthDate": "20/07/2013",
    "entryYear": "2026",
    "diag": "DEA",
    "diagnoses": [
      "DEA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Diego Lagos",
    "professionals": [
      "Diego Lagos"
    ],
    "diagDate": "18.586.934-2",
    "evaluator": "Diego Lagos",
    "evaluators": [
      "Diego Lagos"
    ],
    "specialty": "Prof. Diferencial",
    "specialties": [
      "Prof. Diferencial"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "7EBA",
        "course": "7° Básico A",
        "auto": "",
        "rut": "28.234.564-1",
        "birthDate": "20/07/2013",
        "name": "Zoe Camila Miranda Alejandro",
        "entryYear": "2026",
        "professional": "Diego Lagos",
        "diag": "DEA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "18.586.934-2",
        "evaluatorRut": "24/03/2026",
        "evaluator": "Diego Lagos",
        "specialty": "Prof. Diferencial",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Antonella Pascal Horztmeier Muñoz",
    "rut": "24.579.192-5",
    "course": "7° Básico B",
    "birthDate": "26/03/2014",
    "entryYear": "2026",
    "diag": "DEA",
    "diagnoses": [
      "DEA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Diego Lagos",
    "professionals": [
      "Diego Lagos"
    ],
    "diagDate": "18.586.934-2",
    "evaluator": "Diego Lagos",
    "evaluators": [
      "Diego Lagos"
    ],
    "specialty": "Prof. Diferencial",
    "specialties": [
      "Prof. Diferencial"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "7EBB",
        "course": "7° Básico B",
        "auto": "",
        "rut": "24.579.192-5",
        "birthDate": "26/03/2014",
        "name": "Antonella Pascal Horztmeier Muñoz",
        "entryYear": "2026",
        "professional": "Diego Lagos",
        "diag": "DEA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "18.586.934-2",
        "evaluatorRut": "24-03-2026",
        "evaluator": "Diego Lagos",
        "specialty": "Prof. Diferencial",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Constanza Isidora González Cáceres",
    "rut": "24.545.164-4",
    "course": "7° Básico B",
    "birthDate": "22/02/2014",
    "entryYear": "2020",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 4",
    "situaciones": [
      "NEEP - INICIO AÑO 4"
    ],
    "tipoNEE": "Permanente",
    "professional": "Diego Lagos",
    "professionals": [
      "Diego Lagos"
    ],
    "diagDate": "14.714.531-4",
    "evaluator": "Jessica Reyes",
    "evaluators": [
      "Jessica Reyes"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "7EBB",
        "course": "7° Básico B",
        "auto": "",
        "rut": "24.545.164-4",
        "birthDate": "22/02/2014",
        "name": "Constanza Isidora González Cáceres",
        "entryYear": "2020",
        "professional": "Diego Lagos",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 4",
        "tipoNEE": "Permanente",
        "diagDate": "14.714.531-4",
        "evaluatorRut": "13-04-2023",
        "evaluator": "Jessica Reyes",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Diego Gabriel González Ortúzar",
    "rut": "24.177.214-4",
    "course": "7° Básico B",
    "birthDate": "26/01/2013",
    "entryYear": "2026",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Diego Lagos",
    "professionals": [
      "Diego Lagos"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "7EBB",
        "course": "7° Básico B",
        "auto": "",
        "rut": "24.177.214-4",
        "birthDate": "26/01/2013",
        "name": "Diego Gabriel González Ortúzar",
        "entryYear": "2026",
        "professional": "Diego Lagos",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "02/04/2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Emily Antonella González Sánchez",
    "rut": "24.238.850-K",
    "course": "7° Básico B",
    "birthDate": "06/04/2013",
    "entryYear": "2026",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Diego Lagos",
    "professionals": [
      "Diego Lagos"
    ],
    "diagDate": "17.271.630-K",
    "evaluator": "Javier Ignacio Rojas",
    "evaluators": [
      "Javier Ignacio Rojas"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "27"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "7EBB",
        "course": "7° Básico B",
        "auto": "27",
        "rut": "24.238.850-K",
        "birthDate": "06/04/2013",
        "name": "Emily Antonella González Sánchez",
        "entryYear": "2026",
        "professional": "Diego Lagos",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "17.271.630-K",
        "evaluatorRut": "13-10-2025",
        "evaluator": "Javier Ignacio Rojas",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "27",
        "courseCode": "7EBB",
        "course": "7° Básico B",
        "auto": "27",
        "rut": "24.238.850-K",
        "birthDate": "06/04/2013",
        "name": "Emily Antonella González Sánchez",
        "entryYear": "2026",
        "professional": "Diego Lagos",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "17.271.630-K",
        "evaluatorRut": "13-10-2025",
        "evaluator": "Javier Ignacio Rojas",
        "specialty": "Neurología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Erick Maximiliano Crot Downing",
    "rut": "24.459.233-3",
    "course": "7° Básico B",
    "birthDate": "15/11/2013",
    "entryYear": "2024",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 3",
    "situaciones": [
      "NEEP - INICIO AÑO 3"
    ],
    "tipoNEE": "Permanente",
    "professional": "Diego Lagos",
    "professionals": [
      "Diego Lagos"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "7EBB",
        "course": "7° Básico B",
        "auto": "2024",
        "rut": "24.459.233-3",
        "birthDate": "15/11/2013",
        "name": "Erick Maximiliano Crot Downing",
        "entryYear": "2024",
        "professional": "Diego Lagos",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "19-07-2024",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "7EBB",
        "course": "7° Básico B",
        "auto": "2024",
        "rut": "24.459.233-3",
        "birthDate": "15/11/2013",
        "name": "Erick Maximiliano Crot Downing",
        "entryYear": "2024",
        "professional": "Diego Lagos",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "19-07-2024",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Jeiko Justin Martel Flores",
    "rut": "27.189.554-2",
    "course": "7° Básico B",
    "birthDate": "22/12/2013",
    "entryYear": "2023",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 4",
    "situaciones": [
      "NEEP - INICIO AÑO 4"
    ],
    "tipoNEE": "Permanente",
    "professional": "Diego Lagos",
    "professionals": [
      "Diego Lagos"
    ],
    "diagDate": "16.835.580-7",
    "evaluator": "Mónica Barriere",
    "evaluators": [
      "Mónica Barriere"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "7EBB",
        "course": "7° Básico B",
        "auto": "",
        "rut": "27.189.554-2",
        "birthDate": "22/12/2013",
        "name": "Jeiko Justin Martel Flores",
        "entryYear": "2023",
        "professional": "Diego Lagos",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 4",
        "tipoNEE": "Permanente",
        "diagDate": "16.835.580-7",
        "evaluatorRut": "10-10-2022",
        "evaluator": "Mónica Barriere",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "León Oliver Gabriel Olave Mellado",
    "rut": "24.307.390-1",
    "course": "7° Básico B",
    "birthDate": "16/06/2013",
    "entryYear": "2026",
    "diag": "DEA",
    "diagnoses": [
      "DEA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Diego Lagos",
    "professionals": [
      "Diego Lagos"
    ],
    "diagDate": "18.586.934-2",
    "evaluator": "Diego Lagos",
    "evaluators": [
      "Diego Lagos"
    ],
    "specialty": "Prof. Diferencial",
    "specialties": [
      "Prof. Diferencial"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "7EBB",
        "course": "7° Básico B",
        "auto": "",
        "rut": "24.307.390-1",
        "birthDate": "16/06/2013",
        "name": "León Oliver Gabriel Olave Mellado",
        "entryYear": "2026",
        "professional": "Diego Lagos",
        "diag": "DEA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "18.586.934-2",
        "evaluatorRut": "24-03-2026",
        "evaluator": "Diego Lagos",
        "specialty": "Prof. Diferencial",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Max Alejandro Cabello Sepúlveda",
    "rut": "24.122.718-9",
    "course": "7° Básico B",
    "birthDate": "21/11/2012",
    "entryYear": "2023",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Diego Lagos",
    "professionals": [
      "Diego Lagos"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Zapata Alejandra Vargas",
    "evaluators": [
      "Zapata Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "7EBB",
        "course": "7° Básico B",
        "auto": "",
        "rut": "24.122.718-9",
        "birthDate": "21/11/2012",
        "name": "Max Alejandro Cabello Sepúlveda",
        "entryYear": "2023",
        "professional": "Diego Lagos",
        "diag": "TDA",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "23-03-2025",
        "evaluator": "Zapata Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Montserrat Dannae Farías Díaz",
    "rut": "24.493.025-5",
    "course": "7° Básico B",
    "birthDate": "24/12/2013",
    "entryYear": "2024",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 3",
    "situaciones": [
      "NEEP - INICIO AÑO 3"
    ],
    "tipoNEE": "Permanente",
    "professional": "Diego Lagos",
    "professionals": [
      "Diego Lagos"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "7EBB",
        "course": "7° Básico B",
        "auto": "2024",
        "rut": "24.493.025-5",
        "birthDate": "24/12/2013",
        "name": "Montserrat Dannae Farías Díaz",
        "entryYear": "2024",
        "professional": "Diego Lagos",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "19-07-2024",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "7EBB",
        "course": "7° Básico B",
        "auto": "2024",
        "rut": "24.493.025-5",
        "birthDate": "24/12/2013",
        "name": "Montserrat Dannae Farías Díaz",
        "entryYear": "2024",
        "professional": "Diego Lagos",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "19-07-2024",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Santiago León Salazar Soto",
    "rut": "24,363,298-6",
    "course": "7° Básico B",
    "birthDate": "2013-08-17",
    "entryYear": "2026",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Diego Lagos",
    "professionals": [
      "Diego Lagos"
    ],
    "diagDate": "17.700.014-4",
    "evaluator": "Catalina Ureta",
    "evaluators": [
      "Catalina Ureta"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Pendiente",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos",
      "Pendientes"
    ],
    "classifications": [
      "S.CUPO",
      "28"
    ],
    "platformStatus": "SIN FUDEI",
    "scannerStatus": "NO",
    "loadedDocument": "",
    "pendingDocument": "NUEVO: FUDEI- PSICOLOGICO, FONO, PEDAGOGICO",
    "deadline": "2026-06-02",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "7EBB",
        "course": "7° Básico B",
        "auto": "28",
        "rut": "24,363,298-6",
        "birthDate": "2013-08-17",
        "name": "Santiago León Salazar Soto",
        "entryYear": "2026",
        "professional": "Diego Lagos",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "17.700.014-4",
        "evaluatorRut": "2026-04-15",
        "evaluator": "Catalina Ureta",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "28",
        "courseCode": "7EBB",
        "course": "7° Básico B",
        "auto": "28",
        "rut": "24,363,298-6",
        "birthDate": "2013-08-17",
        "name": "Santiago León Salazar Soto",
        "entryYear": "2026",
        "professional": "Diego Lagos",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "SIN FUDEI",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "17.700.014-4",
        "evaluatorRut": "2026-04-15",
        "evaluator": "Catalina Ureta",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      },
      {
        "sheet": "Pendientes",
        "status": "Pendiente",
        "classification": "S.CUPO",
        "courseCode": "7EBB",
        "course": "7° Básico B",
        "auto": "28",
        "rut": "24,363,298-6",
        "birthDate": "2013-08-17",
        "name": "Santiago León Salazar Soto",
        "entryYear": "2026",
        "professional": "Diego Lagos",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "SIN FUDEI",
        "scannerStatus": "NO",
        "pendingDocument": "NUEVO: FUDEI- PSICOLOGICO, FONO, PEDAGOGICO",
        "deadline": "2026-06-02",
        "diagDate": "17.700.014-4",
        "evaluatorRut": "2026-04-15",
        "evaluator": "Catalina Ureta",
        "specialty": "Psiquiatría",
        "approvedPreviousYears": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Simón Tomás Morales Escobar",
    "rut": "24.378.976-1",
    "course": "7° Básico B",
    "birthDate": "29/08/2013",
    "entryYear": "2022",
    "diag": "DA-HS",
    "diagnoses": [
      "DA-HS"
    ],
    "situacion": "NEEP - INICIO AÑO 4",
    "situaciones": [
      "NEEP - INICIO AÑO 4"
    ],
    "tipoNEE": "Permanente",
    "professional": "Diego Lagos",
    "professionals": [
      "Diego Lagos"
    ],
    "diagDate": "10.993.8920-4",
    "evaluator": "Maria Elena Torrente",
    "evaluators": [
      "Maria Elena Torrente"
    ],
    "specialty": "Otorrinolaringóloga",
    "specialties": [
      "Otorrinolaringóloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP *"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP *",
        "courseCode": "7EBB",
        "course": "7° Básico B",
        "auto": "",
        "rut": "24.378.976-1",
        "birthDate": "29/08/2013",
        "name": "Simón Tomás Morales Escobar",
        "entryYear": "2022",
        "professional": "Diego Lagos",
        "diag": "DA-HS",
        "situacion": "NEEP - INICIO AÑO 4",
        "tipoNEE": "Permanente",
        "diagDate": "10.993.8920-4",
        "evaluatorRut": "29-04-2024",
        "evaluator": "Maria Elena Torrente",
        "specialty": "Otorrinolaringóloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Vicente Tomás Tapia Salazar",
    "rut": "24.049.091-9",
    "course": "7° Básico B",
    "birthDate": "25/08/2012",
    "entryYear": "2017",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Diego Lagos",
    "professionals": [
      "Diego Lagos"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "7EBB",
        "course": "7° Básico B",
        "auto": "2025",
        "rut": "24.049.091-9",
        "birthDate": "25/08/2012",
        "name": "Vicente Tomás Tapia Salazar",
        "entryYear": "2017",
        "professional": "Diego Lagos",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "10-10-2024",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "7EBB",
        "course": "7° Básico B",
        "auto": "2025",
        "rut": "24.049.091-9",
        "birthDate": "25/08/2012",
        "name": "Vicente Tomás Tapia Salazar",
        "entryYear": "2017",
        "professional": "Diego Lagos",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "10-10-2024",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Ámbar Nazaret Cartes Contreras",
    "rut": "23.708.378-4",
    "course": "7° Básico B",
    "birthDate": "01/08/2011",
    "entryYear": "2025",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Diego Lagos",
    "professionals": [
      "Diego Lagos"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "7EBB",
        "course": "7° Básico B",
        "auto": "",
        "rut": "23.708.378-4",
        "birthDate": "01/08/2011",
        "name": "Ámbar Nazaret Cartes Contreras",
        "entryYear": "2025",
        "professional": "Diego Lagos",
        "diag": "TDA",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "27-03-2025",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Camila Mariana Álvarez Jara",
    "rut": "23.946.206-5",
    "course": "8° Básico A",
    "birthDate": "09/05/2012",
    "entryYear": "2025",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Perez",
    "professionals": [
      "Daniela Perez"
    ],
    "diagDate": "24457733-4",
    "evaluator": "Daniela Granado",
    "evaluators": [
      "Daniela Granado"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "8EBA",
        "course": "8° Básico A",
        "auto": "",
        "rut": "23.946.206-5",
        "birthDate": "09/05/2012",
        "name": "Camila Mariana Álvarez Jara",
        "entryYear": "2025",
        "professional": "Daniela Perez",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "24457733-4",
        "evaluatorRut": "14-11-2024",
        "evaluator": "Daniela Granado",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Emilia Rayen Amparo Pardo Gallardo",
    "rut": "23.923.708-8",
    "course": "8° Básico A",
    "birthDate": "14/04/2012",
    "entryYear": "2025",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Daniela Perez",
    "professionals": [
      "Daniela Perez"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "8EBA",
        "course": "8° Básico A",
        "auto": "",
        "rut": "23.923.708-8",
        "birthDate": "14/04/2012",
        "name": "Emilia Rayen Amparo Pardo Gallardo",
        "entryYear": "2025",
        "professional": "Daniela Perez",
        "diag": "FIL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "25-03-2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Francisca Ignacia Navarrete Sobarzo",
    "rut": "23.969.193-5",
    "course": "8° Básico A",
    "birthDate": "02/06/2012",
    "entryYear": "2026",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Daniela Perez",
    "professionals": [
      "Daniela Perez"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "8EBA",
        "course": "8° Básico A",
        "auto": "",
        "rut": "23.969.193-5",
        "birthDate": "02/06/2012",
        "name": "Francisca Ignacia Navarrete Sobarzo",
        "entryYear": "2026",
        "professional": "Daniela Perez",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "24/03/2026",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Isai Joel Bosques Gallardo",
    "rut": "24.198.402-8",
    "course": "8° Básico A",
    "birthDate": "18/02/2013",
    "entryYear": "2026",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Daniela Perez",
    "professionals": [
      "Daniela Perez"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "8EBA",
        "course": "8° Básico A",
        "auto": "",
        "rut": "24.198.402-8",
        "birthDate": "18/02/2013",
        "name": "Isai Joel Bosques Gallardo",
        "entryYear": "2026",
        "professional": "Daniela Perez",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "13/03/2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Jordán Brandon Muñoz Zárate",
    "rut": "23.799.693-3",
    "course": "8° Básico A",
    "birthDate": "15/11/2011",
    "entryYear": "2024",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Perez",
    "professionals": [
      "Daniela Perez"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "8EBA",
        "course": "8° Básico A",
        "auto": "2024",
        "rut": "23.799.693-3",
        "birthDate": "15/11/2011",
        "name": "Jordán Brandon Muñoz Zárate",
        "entryYear": "2024",
        "professional": "Daniela Perez",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "07-10-2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "8EBA",
        "course": "8° Básico A",
        "auto": "2024",
        "rut": "23.799.693-3",
        "birthDate": "15/11/2011",
        "name": "Jordán Brandon Muñoz Zárate",
        "entryYear": "2024",
        "professional": "Daniela Perez",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "07-10-2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Leonel Santiago Verdugo Castillo",
    "rut": "24.227.645-0",
    "course": "8° Básico A",
    "birthDate": "23/03/2013",
    "entryYear": "2022",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 3",
    "situaciones": [
      "NEEP - INICIO AÑO 3"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Perez",
    "professionals": [
      "Daniela Perez"
    ],
    "diagDate": "16.835.580-7",
    "evaluator": "Mónica Barriere",
    "evaluators": [
      "Mónica Barriere"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "8EBA",
        "course": "8° Básico A",
        "auto": "",
        "rut": "24.227.645-0",
        "birthDate": "23/03/2013",
        "name": "Leonel Santiago Verdugo Castillo",
        "entryYear": "2022",
        "professional": "Daniela Perez",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "diagDate": "16.835.580-7",
        "evaluatorRut": "20-12-2023",
        "evaluator": "Mónica Barriere",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Lovefany Alexandre Jean",
    "rut": "25.302.051-2",
    "course": "8° Básico A",
    "birthDate": "26/09/2012",
    "entryYear": "2024",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 3",
    "situaciones": [
      "NEEP - INICIO AÑO 3"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Perez",
    "professionals": [
      "Daniela Perez"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "8EBA",
        "course": "8° Básico A",
        "auto": "2024",
        "rut": "25.302.051-2",
        "birthDate": "26/09/2012",
        "name": "Lovefany Alexandre Jean",
        "entryYear": "2024",
        "professional": "Daniela Perez",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "02-10-2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "8EBA",
        "course": "8° Básico A",
        "auto": "2024",
        "rut": "25.302.051-2",
        "birthDate": "26/09/2012",
        "name": "Lovefany Alexandre Jean",
        "entryYear": "2024",
        "professional": "Daniela Perez",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "02-10-2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Renato Andrés Elgueta Vidal",
    "rut": "24.064.714-1",
    "course": "8° Básico A",
    "birthDate": "15/09/2012",
    "entryYear": "2021",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Daniela Perez",
    "professionals": [
      "Daniela Perez"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "8EBA",
        "course": "8° Básico A",
        "auto": "",
        "rut": "24.064.714-1",
        "birthDate": "15/09/2012",
        "name": "Renato Andrés Elgueta Vidal",
        "entryYear": "2021",
        "professional": "Daniela Perez",
        "diag": "FIL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "04-11-2024",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Ricardo Alonso Silva Loyola",
    "rut": "23.733.403-5",
    "course": "8° Básico A",
    "birthDate": "31/08/2011",
    "entryYear": "2026",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Daniela Perez",
    "professionals": [
      "Daniela Perez"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "8EBA",
        "course": "8° Básico A",
        "auto": "",
        "rut": "23.733.403-5",
        "birthDate": "31/08/2011",
        "name": "Ricardo Alonso Silva Loyola",
        "entryYear": "2026",
        "professional": "Daniela Perez",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "13/03/2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Tomás Alonso Moraga Lazo",
    "rut": "23.947.324-5",
    "course": "8° Básico A",
    "birthDate": "11/05/2012",
    "entryYear": "2024",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 4",
    "situaciones": [
      "NEEP - INICIO AÑO 4"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Perez",
    "professionals": [
      "Daniela Perez"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "8EBA",
        "course": "8° Básico A",
        "auto": "2024",
        "rut": "23.947.324-5",
        "birthDate": "11/05/2012",
        "name": "Tomás Alonso Moraga Lazo",
        "entryYear": "2024",
        "professional": "Daniela Perez",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 4",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "14-03-2024",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "8EBA",
        "course": "8° Básico A",
        "auto": "2024",
        "rut": "23.947.324-5",
        "birthDate": "11/05/2012",
        "name": "Tomás Alonso Moraga Lazo",
        "entryYear": "2024",
        "professional": "Daniela Perez",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 4",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "14-03-2024",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Agustín Jesús Vargas Blanco",
    "rut": "24.000.631-6",
    "course": "8° Básico B",
    "birthDate": "04/07/2012",
    "entryYear": "2026",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Daniela Perez",
    "professionals": [
      "Daniela Perez"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "8EBB",
        "course": "8° Básico B",
        "auto": "",
        "rut": "24.000.631-6",
        "birthDate": "04/07/2012",
        "name": "Agustín Jesús Vargas Blanco",
        "entryYear": "2026",
        "professional": "Daniela Perez",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "13/04/2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Bladimyr Nicolás Cáceres Vargas",
    "rut": "23.925.322-9",
    "course": "8° Básico B",
    "birthDate": "14/04/2012",
    "entryYear": "2026",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Daniela Perez",
    "professionals": [
      "Daniela Perez"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "8EBB",
        "course": "8° Básico B",
        "auto": "",
        "rut": "23.925.322-9",
        "birthDate": "14/04/2012",
        "name": "Bladimyr Nicolás Cáceres Vargas",
        "entryYear": "2026",
        "professional": "Daniela Perez",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "13/04/2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Elías Agustín Vielma Bello",
    "rut": "23.974.287-4",
    "course": "8° Básico B",
    "birthDate": "03/06/2012",
    "entryYear": "2024",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Daniela Perez",
    "professionals": [
      "Daniela Perez"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "8EBB",
        "course": "8° Básico B",
        "auto": "",
        "rut": "23.974.287-4",
        "birthDate": "03/06/2012",
        "name": "Elías Agustín Vielma Bello",
        "entryYear": "2024",
        "professional": "Daniela Perez",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "08/10/2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Javier Antonio Alejandro González Farías",
    "rut": "23.929.800-1",
    "course": "8° Básico B",
    "birthDate": "21/04/2012",
    "entryYear": "2025",
    "diag": "DEA",
    "diagnoses": [
      "DEA"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Daniela Perez",
    "professionals": [
      "Daniela Perez"
    ],
    "diagDate": "17.306.188-9",
    "evaluator": "Daniela Barra",
    "evaluators": [
      "Daniela Barra"
    ],
    "specialty": "Prof. diferencial",
    "specialties": [
      "Prof. diferencial"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "8EBB",
        "course": "8° Básico B",
        "auto": "",
        "rut": "23.929.800-1",
        "birthDate": "21/04/2012",
        "name": "Javier Antonio Alejandro González Farías",
        "entryYear": "2025",
        "professional": "Daniela Perez",
        "diag": "DEA",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "17.306.188-9",
        "evaluatorRut": "09-04-2025",
        "evaluator": "Daniela Barra",
        "specialty": "Prof. diferencial",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Joaquín Ignacio Herrera Burgos",
    "rut": "23.952.929-1",
    "course": "8° Básico B",
    "birthDate": "14/05/2012",
    "entryYear": "2024",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 3",
    "situaciones": [
      "NEEP - INICIO AÑO 3"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Perez",
    "professionals": [
      "Daniela Perez"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "8EBB",
        "course": "8° Básico B",
        "auto": "2024",
        "rut": "23.952.929-1",
        "birthDate": "14/05/2012",
        "name": "Joaquín Ignacio Herrera Burgos",
        "entryYear": "2024",
        "professional": "Daniela Perez",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "01-08-2024",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "8EBB",
        "course": "8° Básico B",
        "auto": "2024",
        "rut": "23.952.929-1",
        "birthDate": "14/05/2012",
        "name": "Joaquín Ignacio Herrera Burgos",
        "entryYear": "2024",
        "professional": "Daniela Perez",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "01-08-2024",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Josthan Jochua Arce Castro",
    "rut": "23.389.303-K",
    "course": "8° Básico B",
    "birthDate": "30/07/2010",
    "entryYear": "2023",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Daniela Perez",
    "professionals": [
      "Daniela Perez"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "8EBB",
        "course": "8° Básico B",
        "auto": "",
        "rut": "23.389.303-K",
        "birthDate": "30/07/2010",
        "name": "Josthan Jochua Arce Castro",
        "entryYear": "2023",
        "professional": "Daniela Perez",
        "diag": "FIL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "04-11-2024",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Vicente Antonio Belmades Meneses",
    "rut": "24.093.935-5",
    "course": "8° Básico B",
    "birthDate": "18/10/2012",
    "entryYear": "2017",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Perez",
    "professionals": [
      "Daniela Perez"
    ],
    "diagDate": "15.467.203-6",
    "evaluator": "Tamara Muñoz",
    "evaluators": [
      "Tamara Muñoz"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "8EBB",
        "course": "8° Básico B",
        "auto": "",
        "rut": "24.093.935-5",
        "birthDate": "18/10/2012",
        "name": "Vicente Antonio Belmades Meneses",
        "entryYear": "2017",
        "professional": "Daniela Perez",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "15.467.203-6",
        "evaluatorRut": "05/02/2026",
        "evaluator": "Tamara Muñoz",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Violeta Pascale Valdés Silva",
    "rut": "24.172.670-3",
    "course": "8° Básico B",
    "birthDate": "17/01/2013",
    "entryYear": "2025",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Perez",
    "professionals": [
      "Daniela Perez"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "8EBB",
        "course": "8° Básico B",
        "auto": "2025",
        "rut": "24.172.670-3",
        "birthDate": "17/01/2013",
        "name": "Violeta Pascale Valdés Silva",
        "entryYear": "2025",
        "professional": "Daniela Perez",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "19-05-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "8EBB",
        "course": "8° Básico B",
        "auto": "2025",
        "rut": "24.172.670-3",
        "birthDate": "17/01/2013",
        "name": "Violeta Pascale Valdés Silva",
        "entryYear": "2025",
        "professional": "Daniela Perez",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "19-05-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Yonathan Jasiel Andrés Reyes Tejeda",
    "rut": "23.835.929-5",
    "course": "8° Básico B",
    "birthDate": "30/12/2011",
    "entryYear": "2017",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Perez",
    "professionals": [
      "Daniela Perez"
    ],
    "diagDate": "20.930.987-4",
    "evaluator": "Fabiana Acevedo",
    "evaluators": [
      "Fabiana Acevedo"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "8EBB",
        "course": "8° Básico B",
        "auto": "",
        "rut": "23.835.929-5",
        "birthDate": "30/12/2011",
        "name": "Yonathan Jasiel Andrés Reyes Tejeda",
        "entryYear": "2017",
        "professional": "Daniela Perez",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "20.930.987-4",
        "evaluatorRut": "13/10/2025",
        "evaluator": "Fabiana Acevedo",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Adonay Yaris Muñoz Aguilera",
    "rut": "23.199.765-2",
    "course": "III° Medio A",
    "birthDate": "13/12/2009",
    "entryYear": "2026",
    "diag": "DEA -C",
    "diagnoses": [
      "DEA -C"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "María José Solari",
    "professionals": [
      "María José Solari"
    ],
    "diagDate": "17.485.973-6",
    "evaluator": "Maria José Solari",
    "evaluators": [
      "Maria José Solari"
    ],
    "specialty": "Prof. diferencial",
    "specialties": [
      "Prof. diferencial"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "IIIEMA",
        "course": "III° Medio A",
        "auto": "",
        "rut": "23.199.765-2",
        "birthDate": "13/12/2009",
        "name": "Adonay Yaris Muñoz Aguilera",
        "entryYear": "2026",
        "professional": "María José Solari",
        "diag": "DEA -C",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "17.485.973-6",
        "evaluatorRut": "02/04/2026",
        "evaluator": "Maria José Solari",
        "specialty": "Prof. diferencial",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Aracelli Millaray Apablaza Solís",
    "rut": "23.259.929-4",
    "course": "III° Medio A",
    "birthDate": "19/02/2010",
    "entryYear": "2017",
    "diag": "DEA -C",
    "diagnoses": [
      "DEA -C"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "María José Solari",
    "professionals": [
      "María José Solari"
    ],
    "diagDate": "16.429.535-4",
    "evaluator": "Danae Bulicic",
    "evaluators": [
      "Danae Bulicic"
    ],
    "specialty": "Prof. diferencial",
    "specialties": [
      "Prof. diferencial"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "IIIEMA",
        "course": "III° Medio A",
        "auto": "",
        "rut": "23.259.929-4",
        "birthDate": "19/02/2010",
        "name": "Aracelli Millaray Apablaza Solís",
        "entryYear": "2017",
        "professional": "María José Solari",
        "diag": "DEA -C",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "16.429.535-4",
        "evaluatorRut": "20-11-2024",
        "evaluator": "Danae Bulicic",
        "specialty": "Prof. diferencial",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Belén Almendra Moncada Saavedra",
    "rut": "23.088.520-6",
    "course": "III° Medio A",
    "birthDate": "05/08/2009",
    "entryYear": "2023",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "María José Solari",
    "professionals": [
      "María José Solari"
    ],
    "diagDate": "14739429-2",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IIIEMA",
        "course": "III° Medio A",
        "auto": "2025",
        "rut": "23.088.520-6",
        "birthDate": "05/08/2009",
        "name": "Belén Almendra Moncada Saavedra",
        "entryYear": "2023",
        "professional": "María José Solari",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "14739429-2",
        "evaluatorRut": "6-12-2024",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "IIIEMA",
        "course": "III° Medio A",
        "auto": "2025",
        "rut": "23.088.520-6",
        "birthDate": "05/08/2009",
        "name": "Belén Almendra Moncada Saavedra",
        "entryYear": "2023",
        "professional": "María José Solari",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14739429-2",
        "evaluatorRut": "6-12-2024",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Damián Estefano Contreras Álvarez",
    "rut": "22.944.209-0",
    "course": "III° Medio A",
    "birthDate": "09/02/2009",
    "entryYear": "2023",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 4",
    "situaciones": [
      "NEEP - INICIO AÑO 4"
    ],
    "tipoNEE": "Permanente",
    "professional": "María José Solari",
    "professionals": [
      "María José Solari"
    ],
    "diagDate": "13.493.815 -3",
    "evaluator": "Alejandra Sierbert",
    "evaluators": [
      "Alejandra Sierbert"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "IIIEMA",
        "course": "III° Medio A",
        "auto": "",
        "rut": "22.944.209-0",
        "birthDate": "09/02/2009",
        "name": "Damián Estefano Contreras Álvarez",
        "entryYear": "2023",
        "professional": "María José Solari",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 4",
        "tipoNEE": "Permanente",
        "diagDate": "13.493.815 -3",
        "evaluatorRut": "26-04-2022",
        "evaluator": "Alejandra Sierbert",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Michelle Montserrat Cortés Farías",
    "rut": "22.875.291-6",
    "course": "III° Medio A",
    "birthDate": "15/11/2008",
    "entryYear": "2026",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "María José Solari",
    "professionals": [
      "María José Solari"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "IIIEMA",
        "course": "III° Medio A",
        "auto": "",
        "rut": "22.875.291-6",
        "birthDate": "15/11/2008",
        "name": "Michelle Montserrat Cortés Farías",
        "entryYear": "2026",
        "professional": "María José Solari",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "10/03/2026",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Sofía Antonia Aliaga Gutiérrez",
    "rut": "23.044.760-8",
    "course": "III° Medio A",
    "birthDate": "11/06/2009",
    "entryYear": "2026",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "María José Solari",
    "professionals": [
      "María José Solari"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "IIIEMA",
        "course": "III° Medio A",
        "auto": "",
        "rut": "23.044.760-8",
        "birthDate": "11/06/2009",
        "name": "Sofía Antonia Aliaga Gutiérrez",
        "entryYear": "2026",
        "professional": "María José Solari",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "10/04/2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Sofía Ignacia Araya Bermejo",
    "rut": "23.256.460-1",
    "course": "III° Medio A",
    "birthDate": "20/02/2010",
    "entryYear": "2026",
    "diag": "DEA -C",
    "diagnoses": [
      "DEA -C"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "María José Solari",
    "professionals": [
      "María José Solari"
    ],
    "diagDate": "17.485.973-6",
    "evaluator": "Maria José Solari",
    "evaluators": [
      "Maria José Solari"
    ],
    "specialty": "Prof. diferencial",
    "specialties": [
      "Prof. diferencial"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "IIIEMA",
        "course": "III° Medio A",
        "auto": "",
        "rut": "23.256.460-1",
        "birthDate": "20/02/2010",
        "name": "Sofía Ignacia Araya Bermejo",
        "entryYear": "2026",
        "professional": "María José Solari",
        "diag": "DEA -C",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "17.485.973-6",
        "evaluatorRut": "02/04/2026",
        "evaluator": "Maria José Solari",
        "specialty": "Prof. diferencial",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Steven Jesús Benavides Fuentes",
    "rut": "22.956.805-1",
    "course": "III° Medio A",
    "birthDate": "26/02/2009",
    "entryYear": "2025",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "María José Solari",
    "professionals": [
      "María José Solari"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IIIEMA",
        "course": "III° Medio A",
        "auto": "2025",
        "rut": "22.956.805-1",
        "birthDate": "26/02/2009",
        "name": "Steven Jesús Benavides Fuentes",
        "entryYear": "2025",
        "professional": "María José Solari",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "12-3-2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "IIIEMA",
        "course": "III° Medio A",
        "auto": "2025",
        "rut": "22.956.805-1",
        "birthDate": "26/02/2009",
        "name": "Steven Jesús Benavides Fuentes",
        "entryYear": "2025",
        "professional": "María José Solari",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "12-3-2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Vicente Bastián Ruz Guajardo",
    "rut": "23.151.902-5",
    "course": "III° Medio A",
    "birthDate": "18/10/2009",
    "entryYear": "2025",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "María José Solari",
    "professionals": [
      "María José Solari"
    ],
    "diagDate": "24457733-4",
    "evaluator": "Daniela Granado",
    "evaluators": [
      "Daniela Granado"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "IIIEMA",
        "course": "III° Medio A",
        "auto": "",
        "rut": "23.151.902-5",
        "birthDate": "18/10/2009",
        "name": "Vicente Bastián Ruz Guajardo",
        "entryYear": "2025",
        "professional": "María José Solari",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "24457733-4",
        "evaluatorRut": "12-11-2024",
        "evaluator": "Daniela Granado",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Analia Valeska Pino Vergara",
    "rut": "23.078.559-7",
    "course": "III° Medio B",
    "birthDate": "22/07/2009",
    "entryYear": "2025",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "María José Solari",
    "professionals": [
      "María José Solari"
    ],
    "diagDate": "20098689-k",
    "evaluator": "Javiera Muggane",
    "evaluators": [
      "Javiera Muggane"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IIITPB",
        "course": "III° Medio B",
        "auto": "2025",
        "rut": "23.078.559-7",
        "birthDate": "22/07/2009",
        "name": "Analia Valeska Pino Vergara",
        "entryYear": "2025",
        "professional": "María José Solari",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "20098689-k",
        "evaluatorRut": "22-04-2024",
        "evaluator": "Javiera Muggane",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "IIITPB",
        "course": "III° Medio B",
        "auto": "2025",
        "rut": "23.078.559-7",
        "birthDate": "22/07/2009",
        "name": "Analia Valeska Pino Vergara",
        "entryYear": "2025",
        "professional": "María José Solari",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "20098689-k",
        "evaluatorRut": "22-04-2024",
        "evaluator": "Javiera Muggane",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Angelo Andrés Rojas Campos",
    "rut": "22.747.269-3",
    "course": "III° Medio B",
    "birthDate": "14/06/2008",
    "entryYear": "2025",
    "diag": "DEA -C",
    "diagnoses": [
      "DEA -C"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "María José Solari",
    "professionals": [
      "María José Solari"
    ],
    "diagDate": "17.992.015-8",
    "evaluator": "Elena Galarce",
    "evaluators": [
      "Elena Galarce"
    ],
    "specialty": "Prof. diferencial",
    "specialties": [
      "Prof. diferencial"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "IIITPB",
        "course": "III° Medio B",
        "auto": "",
        "rut": "22.747.269-3",
        "birthDate": "14/06/2008",
        "name": "Angelo Andrés Rojas Campos",
        "entryYear": "2025",
        "professional": "María José Solari",
        "diag": "DEA -C",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "17.992.015-8",
        "evaluatorRut": "11-04-2025",
        "evaluator": "Elena Galarce",
        "specialty": "Prof. diferencial",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Benjamín Alexander Castillo Cifuentes",
    "rut": "23.263.381-6",
    "course": "III° Medio B",
    "birthDate": "05/03/2010",
    "entryYear": "2026",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "María José Solari",
    "professionals": [
      "María José Solari"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "IIITPB",
        "course": "III° Medio B",
        "auto": "",
        "rut": "23.263.381-6",
        "birthDate": "05/03/2010",
        "name": "Benjamín Alexander Castillo Cifuentes",
        "entryYear": "2026",
        "professional": "María José Solari",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "16/03/2026",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Charlotte Anaiz Cuadra Cabezas",
    "rut": "23.266.569-6",
    "course": "III° Medio B",
    "birthDate": "06/03/2010",
    "entryYear": "2017",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Daniela Carrillo",
    "professionals": [
      "Daniela Carrillo"
    ],
    "diagDate": "",
    "evaluator": "",
    "evaluators": [],
    "specialty": "",
    "specialties": [],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "39"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IIITPB",
        "course": "III° Medio B",
        "auto": "39",
        "rut": "23.266.569-6",
        "birthDate": "06/03/2010",
        "name": "Charlotte Anaiz Cuadra Cabezas",
        "entryYear": "2017",
        "professional": "Daniela Carrillo",
        "diag": "DIL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "",
        "evaluatorRut": "",
        "evaluator": "",
        "specialty": "",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "39",
        "courseCode": "IIITPB",
        "course": "III° Medio B",
        "auto": "39",
        "rut": "23.266.569-6",
        "birthDate": "06/03/2010",
        "name": "Charlotte Anaiz Cuadra Cabezas",
        "entryYear": "2017",
        "professional": "Daniela Carrillo",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "",
        "evaluatorRut": "",
        "evaluator": "",
        "specialty": "",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Cristóbal Ignacio Ancamil Moreno",
    "rut": "23.062.494-1",
    "course": "III° Medio B",
    "birthDate": "02/07/2009",
    "entryYear": "2026",
    "diag": "DEA -C",
    "diagnoses": [
      "DEA -C"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "María José Solari",
    "professionals": [
      "María José Solari"
    ],
    "diagDate": "17.485.973-6",
    "evaluator": "Maria José Solari",
    "evaluators": [
      "Maria José Solari"
    ],
    "specialty": "Prof. diferencial",
    "specialties": [
      "Prof. diferencial"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "IIITPB",
        "course": "III° Medio B",
        "auto": "",
        "rut": "23.062.494-1",
        "birthDate": "02/07/2009",
        "name": "Cristóbal Ignacio Ancamil Moreno",
        "entryYear": "2026",
        "professional": "María José Solari",
        "diag": "DEA -C",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "17.485.973-6",
        "evaluatorRut": "27/03/2026",
        "evaluator": "Maria José Solari",
        "specialty": "Prof. diferencial",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Giovanni Isaac Salomón Contreras Neira",
    "rut": "22.944.286-4",
    "course": "III° Medio B",
    "birthDate": "09/02/2009",
    "entryYear": "2021",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Carrillo",
    "professionals": [
      "Daniela Carrillo"
    ],
    "diagDate": "14739429-2",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IIITPB",
        "course": "III° Medio B",
        "auto": "2025",
        "rut": "22.944.286-4",
        "birthDate": "09/02/2009",
        "name": "Giovanni Isaac Salomón Contreras Neira",
        "entryYear": "2021",
        "professional": "Daniela Carrillo",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "14739429-2",
        "evaluatorRut": "21-10-2024",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "IIITPB",
        "course": "III° Medio B",
        "auto": "2025",
        "rut": "22.944.286-4",
        "birthDate": "09/02/2009",
        "name": "Giovanni Isaac Contreras Neira",
        "entryYear": "2021",
        "professional": "Daniela Carrillo",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14739429-2",
        "evaluatorRut": "21-10-2024",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Ignacio Andrés Carrillo Riquelme",
    "rut": "22.860.611-1",
    "course": "III° Medio B",
    "birthDate": "05/11/2008",
    "entryYear": "2025",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Carrillo",
    "professionals": [
      "Daniela Carrillo"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "IIITPB",
        "course": "III° Medio B",
        "auto": "",
        "rut": "22.860.611-1",
        "birthDate": "05/11/2008",
        "name": "Ignacio Andrés Carrillo Riquelme",
        "entryYear": "2025",
        "professional": "Daniela Carrillo",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "14-04-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Ignacio Andrés Dinamarca Valenzuela",
    "rut": "23.050.229-3",
    "course": "III° Medio B",
    "birthDate": "15/06/2009",
    "entryYear": "2026",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Carrillo",
    "professionals": [
      "Daniela Carrillo"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "37"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IIITPB",
        "course": "III° Medio B",
        "auto": "37",
        "rut": "23.050.229-3",
        "birthDate": "15/06/2009",
        "name": "Ignacio Andrés Dinamarca Valenzuela",
        "entryYear": "2026",
        "professional": "Daniela Carrillo",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "18/03/2026",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "37",
        "courseCode": "IIITPB",
        "course": "III° Medio B",
        "auto": "37",
        "rut": "23.050.229-3",
        "birthDate": "15/06/2009",
        "name": "Ignacio Andrés Dinamarca Valenzuela",
        "entryYear": "2026",
        "professional": "Daniela Carrillo",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "18/03/2026",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Justin Bastián Jara Bastías",
    "rut": "22.551.900-5",
    "course": "III° Medio B",
    "birthDate": "13/11/2007",
    "entryYear": "2016",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Carrillo",
    "professionals": [
      "Daniela Carrillo"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IIITPB",
        "course": "III° Medio B",
        "auto": "2025",
        "rut": "22.551.900-5",
        "birthDate": "13/11/2007",
        "name": "Justin Bastián Jara Bastías",
        "entryYear": "2016",
        "professional": "Daniela Carrillo",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "24/10/2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "IIITPB",
        "course": "III° Medio B",
        "auto": "2025",
        "rut": "22.551.900-5",
        "birthDate": "13/11/2007",
        "name": "Justin Bastián Jara Bastías",
        "entryYear": "2016",
        "professional": "Daniela Carrillo",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "24/10/2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Lely David Montaño Valencia",
    "rut": "28.260.117-6",
    "course": "III° Medio B",
    "birthDate": "18/03/2010",
    "entryYear": "2025",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "María José Solari",
    "professionals": [
      "María José Solari"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IIITPB",
        "course": "III° Medio B",
        "auto": "2025",
        "rut": "28.260.117-6",
        "birthDate": "18/03/2010",
        "name": "Lely David Montaño Valencia",
        "entryYear": "2025",
        "professional": "María José Solari",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "24-3-2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "IIITPB",
        "course": "III° Medio B",
        "auto": "2025",
        "rut": "28.260.117-6",
        "birthDate": "18/03/2010",
        "name": "Lely David Montaño Valencia",
        "entryYear": "2025",
        "professional": "María José Solari",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "24-3-2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Libens Victor .",
    "rut": "28.441.796-8",
    "course": "III° Medio B",
    "birthDate": "09/08/2009",
    "entryYear": "2026",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "María José Solari",
    "professionals": [
      "María José Solari"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "38"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IIITPB",
        "course": "III° Medio B",
        "auto": "38",
        "rut": "28.441.796-8",
        "birthDate": "09/08/2009",
        "name": "Libens Victor .",
        "entryYear": "2026",
        "professional": "María José Solari",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "20/03/2026",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "38",
        "courseCode": "IIITPB",
        "course": "III° Medio B",
        "auto": "38",
        "rut": "28.441.796-8",
        "birthDate": "09/08/2009",
        "name": "Libens Victor .",
        "entryYear": "2026",
        "professional": "María José Solari",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "20/03/2026",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Lusian Amaro Rodríguez Tejeda",
    "rut": "23.248.189-7",
    "course": "III° Medio B",
    "birthDate": "11/02/2010",
    "entryYear": "2018",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Carrillo",
    "professionals": [
      "Daniela Carrillo"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "IIITPB",
        "course": "III° Medio B",
        "auto": "",
        "rut": "23.248.189-7",
        "birthDate": "11/02/2010",
        "name": "Lusian Amaro Rodríguez Tejeda",
        "entryYear": "2018",
        "professional": "Daniela Carrillo",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "27/10/2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Maicol Martín Bettancourt Medel",
    "rut": "23.197.682-5",
    "course": "III° Medio B",
    "birthDate": "08/12/2009",
    "entryYear": "2026",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "María José Solari",
    "professionals": [
      "María José Solari"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "IIITPB",
        "course": "III° Medio B",
        "auto": "",
        "rut": "23.197.682-5",
        "birthDate": "08/12/2009",
        "name": "Maicol Martín Bettancourt Medel",
        "entryYear": "2026",
        "professional": "María José Solari",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "06/04/2026",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Sergio Alejandro Rincon Viña",
    "rut": "100.670.785-4",
    "course": "III° Medio B",
    "birthDate": "06/11/2008",
    "entryYear": "2026",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "María José Solari",
    "professionals": [
      "María José Solari"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "IIITPB",
        "course": "III° Medio B",
        "auto": "",
        "rut": "100.670.785-4",
        "birthDate": "06/11/2008",
        "name": "Sergio Alejandro Rincon Viña",
        "entryYear": "2026",
        "professional": "María José Solari",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "30/03/2026",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Bastián Francisco Ignacio Reyes Muñoz",
    "rut": "23.277.230-1",
    "course": "II° Medio A",
    "birthDate": "20/03/2010",
    "entryYear": "2023",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Natalia Miranda",
    "professionals": [
      "Natalia Miranda"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Toronto Juan Carrasco",
    "evaluators": [
      "Toronto Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IIEMA",
        "course": "II° Medio A",
        "auto": "2023",
        "rut": "23.277.230-1",
        "birthDate": "20/03/2010",
        "name": "Bastián Francisco Ignacio Reyes Muñoz",
        "entryYear": "2023",
        "professional": "Natalia Miranda",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "22-10-2024",
        "evaluator": "Toronto Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "IIEMA",
        "course": "II° Medio A",
        "auto": "2023",
        "rut": "23.277.230-1",
        "birthDate": "20/03/2010",
        "name": "Bastián Francisco Ignacio Reyes Muñoz",
        "entryYear": "2023",
        "professional": "Natalia Miranda",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "22-10-2024",
        "evaluator": "Toronto Juan Carrasco",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Bisleydi Yire Jofré Pinto",
    "rut": "23.349.383-K",
    "course": "II° Medio A",
    "birthDate": "13/06/2010",
    "entryYear": "2025",
    "diag": "DEA -C",
    "diagnoses": [
      "DEA -C"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Natalia Miranda",
    "professionals": [
      "Natalia Miranda"
    ],
    "diagDate": "16.429.535-4",
    "evaluator": "Danae Bulicic",
    "evaluators": [
      "Danae Bulicic"
    ],
    "specialty": "Prof. diferencial",
    "specialties": [
      "Prof. diferencial"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "IIEMA",
        "course": "II° Medio A",
        "auto": "",
        "rut": "23.349.383-K",
        "birthDate": "13/06/2010",
        "name": "Bisleydi Yire Jofré Pinto",
        "entryYear": "2025",
        "professional": "Natalia Miranda",
        "diag": "DEA -C",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "16.429.535-4",
        "evaluatorRut": "24-03-2025",
        "evaluator": "Danae Bulicic",
        "specialty": "Prof. diferencial",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Camilo Alberto Azar Órdenes",
    "rut": "23.224.905-6",
    "course": "II° Medio A",
    "birthDate": "14/01/2010",
    "entryYear": "2016",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 3",
    "situaciones": [
      "NEEP - INICIO AÑO 3"
    ],
    "tipoNEE": "Permanente",
    "professional": "Natalia Miranda",
    "professionals": [
      "Natalia Miranda"
    ],
    "diagDate": "25.680.058-6",
    "evaluator": "Miguel Grau",
    "evaluators": [
      "Miguel Grau"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "IIEMA",
        "course": "II° Medio A",
        "auto": "",
        "rut": "23.224.905-6",
        "birthDate": "14/01/2010",
        "name": "Camilo Alberto Azar Órdenes",
        "entryYear": "2016",
        "professional": "Natalia Miranda",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "diagDate": "25.680.058-6",
        "evaluatorRut": "2-11-2023",
        "evaluator": "Miguel Grau",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Danitza Alejandra Muñoz Tapia",
    "rut": "23.152.313-8",
    "course": "II° Medio A",
    "birthDate": "20/10/2009",
    "entryYear": "2025",
    "diag": "DEA -C",
    "diagnoses": [
      "DEA -C"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Natalia Miranda",
    "professionals": [
      "Natalia Miranda"
    ],
    "diagDate": "16.429.535-4",
    "evaluator": "Danae Bulicic",
    "evaluators": [
      "Danae Bulicic"
    ],
    "specialty": "Prof. diferencial",
    "specialties": [
      "Prof. diferencial"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "IIEMA",
        "course": "II° Medio A",
        "auto": "",
        "rut": "23.152.313-8",
        "birthDate": "20/10/2009",
        "name": "Danitza Alejandra Muñoz Tapia",
        "entryYear": "2025",
        "professional": "Natalia Miranda",
        "diag": "DEA -C",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "16.429.535-4",
        "evaluatorRut": "24-03-2025",
        "evaluator": "Danae Bulicic",
        "specialty": "Prof. diferencial",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Felipe Isaias Fuentes Ibarra",
    "rut": "23.261.266-5",
    "course": "II° Medio A",
    "birthDate": "01/03/2010",
    "entryYear": "2026",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Carrillo",
    "professionals": [
      "Daniela Carrillo"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "35"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IIEMA",
        "course": "II° Medio A",
        "auto": "35",
        "rut": "23.261.266-5",
        "birthDate": "01/03/2010",
        "name": "Felipe Isaias Fuentes Ibarra",
        "entryYear": "2026",
        "professional": "Daniela Carrillo",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "10-11-2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "35",
        "courseCode": "IIEMA",
        "course": "II° Medio A",
        "auto": "35",
        "rut": "23.261.266-5",
        "birthDate": "01/03/2010",
        "name": "Felipe Isaias Fuentes Ibarra",
        "entryYear": "2026",
        "professional": "Daniela Carrillo",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "10-11-2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Jean Phillippe Navarrete Castillo",
    "rut": "23.386.073-5",
    "course": "II° Medio A",
    "birthDate": "31/07/2010",
    "entryYear": "2023",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Natalia Miranda",
    "professionals": [
      "Natalia Miranda"
    ],
    "diagDate": "16.835580-7",
    "evaluator": "Mónica Barriere",
    "evaluators": [
      "Mónica Barriere"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IIEMA",
        "course": "II° Medio A",
        "auto": "2023",
        "rut": "23.386.073-5",
        "birthDate": "31/07/2010",
        "name": "Jean Phillippe Navarrete Castillo",
        "entryYear": "2023",
        "professional": "Natalia Miranda",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "16.835580-7",
        "evaluatorRut": "15-12-2022",
        "evaluator": "Mónica Barriere",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "IIEMA",
        "course": "II° Medio A",
        "auto": "2023",
        "rut": "23.386.073-5",
        "birthDate": "31/07/2010",
        "name": "Jean Phillippe Navarrete Castillo",
        "entryYear": "2023",
        "professional": "Natalia Miranda",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "16.835580-7",
        "evaluatorRut": "15-12-2022",
        "evaluator": "Mónica Barriere",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Jordán Daniel Alejandro Gutiérrez Fuentes",
    "rut": "23.375.111-1",
    "course": "II° Medio A",
    "birthDate": "18/07/2010",
    "entryYear": "2026",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Natalia Miranda",
    "professionals": [
      "Natalia Miranda"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "IIEMA",
        "course": "II° Medio A",
        "auto": "",
        "rut": "23.375.111-1",
        "birthDate": "18/07/2010",
        "name": "Jordán Daniel Alejandro Gutiérrez Fuentes",
        "entryYear": "2026",
        "professional": "Natalia Miranda",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "22/04/2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Nicolás Ignacio Cerda López",
    "rut": "23.329.713-5",
    "course": "II° Medio A",
    "birthDate": "21/05/2010",
    "entryYear": "2019",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 5",
    "situaciones": [
      "NEEP - INICIO AÑO 5"
    ],
    "tipoNEE": "Permanente",
    "professional": "Natalia Miranda",
    "professionals": [
      "Natalia Miranda"
    ],
    "diagDate": "15.366.081-6",
    "evaluator": "Paula Leppe",
    "evaluators": [
      "Paula Leppe"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "IIEMA",
        "course": "II° Medio A",
        "auto": "",
        "rut": "23.329.713-5",
        "birthDate": "21/05/2010",
        "name": "Nicolás Ignacio Cerda López",
        "entryYear": "2019",
        "professional": "Natalia Miranda",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 5",
        "tipoNEE": "Permanente",
        "diagDate": "15.366.081-6",
        "evaluatorRut": "15-5-2022",
        "evaluator": "Paula Leppe",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Paz Ignacia Iriarte Jara",
    "rut": "23.275.589-K",
    "course": "II° Medio A",
    "birthDate": "20/03/2010",
    "entryYear": "2026",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Carrillo",
    "professionals": [
      "Daniela Carrillo"
    ],
    "diagDate": "17.318.061-6",
    "evaluator": "Alina Garcia",
    "evaluators": [
      "Alina Garcia"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "36"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IIEMA",
        "course": "II° Medio A",
        "auto": "36",
        "rut": "23.275.589-K",
        "birthDate": "20/03/2010",
        "name": "Paz Ignacia Iriarte Jara",
        "entryYear": "2026",
        "professional": "Daniela Carrillo",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "17.318.061-6",
        "evaluatorRut": "26/09/2025",
        "evaluator": "Alina Garcia",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "36",
        "courseCode": "IIEMA",
        "course": "II° Medio A",
        "auto": "36",
        "rut": "23.275.589-K",
        "birthDate": "20/03/2010",
        "name": "Paz Ignacia Iriarte Jara",
        "entryYear": "2026",
        "professional": "Daniela Carrillo",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "17.318.061-6",
        "evaluatorRut": "26/09/2025",
        "evaluator": "Alina Garcia",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Sebastian Stefan Navea Villagra",
    "rut": "23.092.947-5",
    "course": "II° Medio A",
    "birthDate": "03/08/2009",
    "entryYear": "2026",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Natalia Miranda",
    "professionals": [
      "Natalia Miranda"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "IIEMA",
        "course": "II° Medio A",
        "auto": "",
        "rut": "23.092.947-5",
        "birthDate": "03/08/2009",
        "name": "Sebastian Stefan Navea Villagra",
        "entryYear": "2026",
        "professional": "Natalia Miranda",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "17/04/2026",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Yessica del Carmen Bustos Casanova",
    "rut": "23.571.672-0",
    "course": "II° Medio A",
    "birthDate": "18/02/2011",
    "entryYear": "2026",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Natalia Miranda",
    "professionals": [
      "Natalia Miranda"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "IIEMA",
        "course": "II° Medio A",
        "auto": "",
        "rut": "23.571.672-0",
        "birthDate": "18/02/2011",
        "name": "Yessica del Carmen Bustos Casanova",
        "entryYear": "2026",
        "professional": "Natalia Miranda",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "13/03/2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Aylin Ignacia González Hernández",
    "rut": "23.574.404-K",
    "course": "II° Medio B",
    "birthDate": "01/03/2011",
    "entryYear": "2015",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Carrillo",
    "professionals": [
      "Daniela Carrillo"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "IIEMB",
        "course": "II° Medio B",
        "auto": "",
        "rut": "23.574.404-K",
        "birthDate": "01/03/2011",
        "name": "Aylin Ignacia González Hernández",
        "entryYear": "2015",
        "professional": "Daniela Carrillo",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "20/10/2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Benjamín Antonio Avendaño Bravo",
    "rut": "23.434.154-5",
    "course": "II° Medio B",
    "birthDate": "23/09/2010",
    "entryYear": "2025",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Natalia Miranda",
    "professionals": [
      "Natalia Miranda"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IIEMB",
        "course": "II° Medio B",
        "auto": "2025",
        "rut": "23.434.154-5",
        "birthDate": "23/09/2010",
        "name": "Benjamín Antonio Avendaño Bravo",
        "entryYear": "2025",
        "professional": "Natalia Miranda",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "7-6-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "IIEMB",
        "course": "II° Medio B",
        "auto": "2025",
        "rut": "23.434.154-5",
        "birthDate": "23/09/2010",
        "name": "Benjamín Antonio Avendaño Bravo",
        "entryYear": "2025",
        "professional": "Natalia Miranda",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "7-6-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Benjamín Ignacio Jara Herrera",
    "rut": "23.572.439-1",
    "course": "II° Medio B",
    "birthDate": "26/02/2011",
    "entryYear": "2025",
    "diag": "DEA",
    "diagnoses": [
      "DEA"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Natalia Miranda",
    "professionals": [
      "Natalia Miranda"
    ],
    "diagDate": "14196041-5",
    "evaluator": "Paula Moncada",
    "evaluators": [
      "Paula Moncada"
    ],
    "specialty": "Prof. diferencial",
    "specialties": [
      "Prof. diferencial"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "IIEMB",
        "course": "II° Medio B",
        "auto": "",
        "rut": "23.572.439-1",
        "birthDate": "26/02/2011",
        "name": "Benjamín Ignacio Jara Herrera",
        "entryYear": "2025",
        "professional": "Natalia Miranda",
        "diag": "DEA",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "14196041-5",
        "evaluatorRut": "12-11-2024",
        "evaluator": "Paula Moncada",
        "specialty": "Prof. diferencial",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Benjamín Thomas Oyarzún Osorio",
    "rut": "23.596.479-1",
    "course": "II° Medio B",
    "birthDate": "15/03/2011",
    "entryYear": "2025",
    "diag": "DEA",
    "diagnoses": [
      "DEA"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Natalia Miranda",
    "professionals": [
      "Natalia Miranda"
    ],
    "diagDate": "16.429.535-4",
    "evaluator": "Danae Bulicic",
    "evaluators": [
      "Danae Bulicic"
    ],
    "specialty": "Prof. diferencial",
    "specialties": [
      "Prof. diferencial"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "IIEMB",
        "course": "II° Medio B",
        "auto": "",
        "rut": "23.596.479-1",
        "birthDate": "15/03/2011",
        "name": "Benjamín Thomas Oyarzún Osorio",
        "entryYear": "2025",
        "professional": "Natalia Miranda",
        "diag": "DEA",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "16.429.535-4",
        "evaluatorRut": "24-03-2025",
        "evaluator": "Danae Bulicic",
        "specialty": "Prof. diferencial",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Cristóbal Maximiliano Rodriguez Tapia",
    "rut": "22.837.987-5",
    "course": "II° Medio B",
    "birthDate": "08/10/2008",
    "entryYear": "2026",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Natalia Miranda",
    "professionals": [
      "Natalia Miranda"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "IIEMB",
        "course": "II° Medio B",
        "auto": "",
        "rut": "22.837.987-5",
        "birthDate": "08/10/2008",
        "name": "Cristóbal Maximiliano Rodriguez Tapia",
        "entryYear": "2026",
        "professional": "Natalia Miranda",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "24/03/2026",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Dailin Alejandra Soto Escanilla",
    "rut": "23.605.804-2",
    "course": "II° Medio B",
    "birthDate": "25/03/2011",
    "entryYear": "2019",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Natalia Miranda",
    "professionals": [
      "Natalia Miranda"
    ],
    "diagDate": "14739429-2",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IIEMB",
        "course": "II° Medio B",
        "auto": "2023",
        "rut": "23.605.804-2",
        "birthDate": "25/03/2011",
        "name": "Dailin Alejandra Soto Escanilla",
        "entryYear": "2019",
        "professional": "Natalia Miranda",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "14739429-2",
        "evaluatorRut": "15-11-2024",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "IIEMB",
        "course": "II° Medio B",
        "auto": "2023",
        "rut": "23.605.804-2",
        "birthDate": "25/03/2011",
        "name": "Dailin Alejandra Soto Escanilla",
        "entryYear": "2019",
        "professional": "Natalia Miranda",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14739429-2",
        "evaluatorRut": "15-11-2024",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Daniel Abraham Fuentes Ebannur",
    "rut": "22.982.945-9",
    "course": "II° Medio B",
    "birthDate": "28/03/2009",
    "entryYear": "2024",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Carrillo",
    "professionals": [
      "Daniela Carrillo"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IIEMB",
        "course": "II° Medio B",
        "auto": "2024",
        "rut": "22.982.945-9",
        "birthDate": "28/03/2009",
        "name": "Daniel Abraham Fuentes Ebannur",
        "entryYear": "2024",
        "professional": "Daniela Carrillo",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "20/10/2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "IIEMB",
        "course": "II° Medio B",
        "auto": "2024",
        "rut": "22.982.945-9",
        "birthDate": "28/03/2009",
        "name": "Daniel Abraham Fuentes Ebannur",
        "entryYear": "2024",
        "professional": "Daniela Carrillo",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "20/10/2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Isidora Alondra Álvarez Riquelme",
    "rut": "23.242.054-5",
    "course": "II° Medio B",
    "birthDate": "04/02/2010",
    "entryYear": "2015",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Daniela Carrillo",
    "professionals": [
      "Daniela Carrillo"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "IIEMB",
        "course": "II° Medio B",
        "auto": "",
        "rut": "23.242.054-5",
        "birthDate": "04/02/2010",
        "name": "Isidora Alondra Álvarez Riquelme",
        "entryYear": "2015",
        "professional": "Daniela Carrillo",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "23/10/2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Joaquín Alexis Vicencio Márquez",
    "rut": "23.618.280-0",
    "course": "II° Medio B",
    "birthDate": "08/04/2011",
    "entryYear": "2023",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 4",
    "situaciones": [
      "NEEP - INICIO AÑO 4"
    ],
    "tipoNEE": "Permanente",
    "professional": "Natalia Miranda",
    "professionals": [
      "Natalia Miranda"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IIEMB",
        "course": "II° Medio B",
        "auto": "2023",
        "rut": "23.618.280-0",
        "birthDate": "08/04/2011",
        "name": "Joaquín Alexis Vicencio Márquez",
        "entryYear": "2023",
        "professional": "Natalia Miranda",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 4",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "14-04-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "IIEMB",
        "course": "II° Medio B",
        "auto": "2023",
        "rut": "23.618.280-0",
        "birthDate": "08/04/2011",
        "name": "Joaquín Alexis Vicencio Márquez",
        "entryYear": "2023",
        "professional": "Natalia Miranda",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 4",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "14-04-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Luis Fabián Jara Bastías",
    "rut": "23.568.830-1",
    "course": "II° Medio B",
    "birthDate": "25/02/2011",
    "entryYear": "2026",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Natalia Miranda",
    "professionals": [
      "Natalia Miranda"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "IIEMB",
        "course": "II° Medio B",
        "auto": "",
        "rut": "23.568.830-1",
        "birthDate": "25/02/2011",
        "name": "Luis Fabián Jara Bastías",
        "entryYear": "2026",
        "professional": "Natalia Miranda",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "13/03/2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Rayen Ivanna Maldonado Cifuentes",
    "rut": "23.539.119-8",
    "course": "II° Medio B",
    "birthDate": "21/01/2011",
    "entryYear": "2024",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
    "situaciones": [
      "NEET - INICIO AÑO 1 (REINGRESO)"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Natalia Miranda",
    "professionals": [
      "Natalia Miranda"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "IIEMB",
        "course": "II° Medio B",
        "auto": "",
        "rut": "23.539.119-8",
        "birthDate": "21/01/2011",
        "name": "Rayen Ivanna Maldonado Cifuentes",
        "entryYear": "2024",
        "professional": "Natalia Miranda",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "13/03/2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Carla Belén Carrasco Carvajal",
    "rut": "22.845.113-4",
    "course": "IV° Medio A",
    "birthDate": "15/10/2008",
    "entryYear": "2026",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Elena Galarce",
    "professionals": [
      "Elena Galarce"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "IVEMA",
        "course": "IV° Medio A",
        "auto": "",
        "rut": "22.845.113-4",
        "birthDate": "15/10/2008",
        "name": "Carla Belén Carrasco Carvajal",
        "entryYear": "2026",
        "professional": "Elena Galarce",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "04/12/2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Franchesca Millaray González Sánchez",
    "rut": "22.920.738-5",
    "course": "IV° Medio A",
    "birthDate": "13/01/2009",
    "entryYear": "2023",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
    "situaciones": [
      "NEET - INICIO AÑO 1 (REINGRESO)"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Elena Galarce",
    "professionals": [
      "Elena Galarce"
    ],
    "diagDate": "17831978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "IVEMA",
        "course": "IV° Medio A",
        "auto": "",
        "rut": "22.920.738-5",
        "birthDate": "13/01/2009",
        "name": "Franchesca Millaray González Sánchez",
        "entryYear": "2023",
        "professional": "Elena Galarce",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
        "tipoNEE": "Transitoria",
        "diagDate": "17831978-7",
        "evaluatorRut": "10/11/2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Isidora Antonella Riquelme Ordinola",
    "rut": "22.982.688-3",
    "course": "IV° Medio A",
    "birthDate": "26/03/2009",
    "entryYear": "2023",
    "diag": "DEA -C",
    "diagnoses": [
      "DEA -C"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Elena Galarce",
    "professionals": [
      "Elena Galarce"
    ],
    "diagDate": "17.992.015-8",
    "evaluator": "Elena Galarce",
    "evaluators": [
      "Elena Galarce"
    ],
    "specialty": "Prof. diferencial",
    "specialties": [
      "Prof. diferencial"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "IVEMA",
        "course": "IV° Medio A",
        "auto": "",
        "rut": "22.982.688-3",
        "birthDate": "26/03/2009",
        "name": "Isidora Antonella Riquelme Ordinola",
        "entryYear": "2023",
        "professional": "Elena Galarce",
        "diag": "DEA -C",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "17.992.015-8",
        "evaluatorRut": "11-04-2025",
        "evaluator": "Elena Galarce",
        "specialty": "Prof. diferencial",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Israel Andrés Santander Vásquez",
    "rut": "22.929.246-3",
    "course": "IV° Medio A",
    "birthDate": "08/01/2009",
    "entryYear": "2023",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 4",
    "situaciones": [
      "NEEP - INICIO AÑO 4"
    ],
    "tipoNEE": "Permanente",
    "professional": "Elena Galarce",
    "professionals": [
      "Elena Galarce"
    ],
    "diagDate": "16.835580-7",
    "evaluator": "Mónica Barriere",
    "evaluators": [
      "Mónica Barriere"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "IVEMA",
        "course": "IV° Medio A",
        "auto": "",
        "rut": "22.929.246-3",
        "birthDate": "08/01/2009",
        "name": "Israel Andrés Santander Vásquez",
        "entryYear": "2023",
        "professional": "Elena Galarce",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 4",
        "tipoNEE": "Permanente",
        "diagDate": "16.835580-7",
        "evaluatorRut": "13-04-2023",
        "evaluator": "Mónica Barriere",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Kimberly Maricel Celia Macarena González Ortúzar",
    "rut": "22.761.075-1",
    "course": "IV° Medio A",
    "birthDate": "27/06/2008",
    "entryYear": "2024",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
    "situaciones": [
      "NEET - INICIO AÑO 1 (REINGRESO)"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Elena Galarce",
    "professionals": [
      "Elena Galarce"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "IVEMA",
        "course": "IV° Medio A",
        "auto": "",
        "rut": "22.761.075-1",
        "birthDate": "27/06/2008",
        "name": "Kimberly Maricel Celia Macarena González Ortúzar",
        "entryYear": "2024",
        "professional": "Elena Galarce",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "13/03/2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Matías Ignacio Carrasco Fritis",
    "rut": "22.852.784-K",
    "course": "IV° Medio A",
    "birthDate": "22/10/2008",
    "entryYear": "2025",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Elena Galarce",
    "professionals": [
      "Elena Galarce"
    ],
    "diagDate": "17831978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "IVEMA",
        "course": "IV° Medio A",
        "auto": "",
        "rut": "22.852.784-K",
        "birthDate": "22/10/2008",
        "name": "Matías Ignacio Carrasco Fritis",
        "entryYear": "2025",
        "professional": "Elena Galarce",
        "diag": "FIL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "17831978-7",
        "evaluatorRut": "09-12-2024",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Tatiana Karina Cisterna Araos",
    "rut": "22.803.758-3",
    "course": "IV° Medio A",
    "birthDate": "24/08/2008",
    "entryYear": "2020",
    "diag": "DEA -C",
    "diagnoses": [
      "DEA -C"
    ],
    "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
    "situaciones": [
      "NEET - INICIO AÑO 1 (REINGRESO)"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Elena Galarce",
    "professionals": [
      "Elena Galarce"
    ],
    "diagDate": "16.429.535.4",
    "evaluator": "Danae Bulicic",
    "evaluators": [
      "Danae Bulicic"
    ],
    "specialty": "Prof. diferencial",
    "specialties": [
      "Prof. diferencial"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "IVEMA",
        "course": "IV° Medio A",
        "auto": "",
        "rut": "22.803.758-3",
        "birthDate": "24/08/2008",
        "name": "Tatiana Karina Cisterna Araos",
        "entryYear": "2020",
        "professional": "Elena Galarce",
        "diag": "DEA -C",
        "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
        "tipoNEE": "Transitoria",
        "diagDate": "16.429.535.4",
        "evaluatorRut": "21/11/2025",
        "evaluator": "Danae Bulicic",
        "specialty": "Prof. diferencial",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Cristhoper Pedro Ruz Cáceres",
    "rut": "22.504.971-8",
    "course": "IV° Medio B",
    "birthDate": "21/09/2007",
    "entryYear": "2024",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Elena Galarce",
    "professionals": [
      "Elena Galarce"
    ],
    "diagDate": "17831978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "IVTPB",
        "course": "IV° Medio B",
        "auto": "",
        "rut": "22.504.971-8",
        "birthDate": "21/09/2007",
        "name": "Cristhoper Pedro Ruz Cáceres",
        "entryYear": "2024",
        "professional": "Elena Galarce",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "17831978-7",
        "evaluatorRut": "21/10/2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Cristóbal Patricio Jara Figueroa",
    "rut": "22.795.535-K",
    "course": "IV° Medio B",
    "birthDate": "15/08/2008",
    "entryYear": "2025",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Elena Galarce",
    "professionals": [
      "Elena Galarce"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "IVTPB",
        "course": "IV° Medio B",
        "auto": "",
        "rut": "22.795.535-K",
        "birthDate": "15/08/2008",
        "name": "Cristóbal Patricio Jara Figueroa",
        "entryYear": "2025",
        "professional": "Elena Galarce",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "10/04/2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Ian Ignacio Catalán Calderón",
    "rut": "22.999.454-9",
    "course": "IV° Medio B",
    "birthDate": "19/04/2009",
    "entryYear": "2025",
    "diag": "DEA -C",
    "diagnoses": [
      "DEA -C"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Elena Galarce",
    "professionals": [
      "Elena Galarce"
    ],
    "diagDate": "17.992.015-8",
    "evaluator": "Elena Galarce",
    "evaluators": [
      "Elena Galarce"
    ],
    "specialty": "Prof. diferencial",
    "specialties": [
      "Prof. diferencial"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "IVTPB",
        "course": "IV° Medio B",
        "auto": "",
        "rut": "22.999.454-9",
        "birthDate": "19/04/2009",
        "name": "Ian Ignacio Catalán Calderón",
        "entryYear": "2025",
        "professional": "Elena Galarce",
        "diag": "DEA -C",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "17.992.015-8",
        "evaluatorRut": "11-04-2025",
        "evaluator": "Elena Galarce",
        "specialty": "Prof. diferencial",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Isaias Leandro Soto Valdebenito",
    "rut": "22.802.294-2",
    "course": "IV° Medio B",
    "birthDate": "20/08/2008",
    "entryYear": "2020",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Elena Galarce",
    "professionals": [
      "Elena Galarce"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "IVTPB",
        "course": "IV° Medio B",
        "auto": "",
        "rut": "22.802.294-2",
        "birthDate": "20/08/2008",
        "name": "Isaias Leandro Soto Valdebenito",
        "entryYear": "2020",
        "professional": "Elena Galarce",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "31-03-2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Jazmín Isabel Soto Galaz",
    "rut": "22.966.706-8",
    "course": "IV° Medio B",
    "birthDate": "08/03/2009",
    "entryYear": "2020",
    "diag": "DEA -C",
    "diagnoses": [
      "DEA -C"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Elena Galarce",
    "professionals": [
      "Elena Galarce"
    ],
    "diagDate": "17.992.015-8",
    "evaluator": "Elena Galarce",
    "evaluators": [
      "Elena Galarce"
    ],
    "specialty": "Prof. diferencial",
    "specialties": [
      "Prof. diferencial"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "IVTPB",
        "course": "IV° Medio B",
        "auto": "",
        "rut": "22.966.706-8",
        "birthDate": "08/03/2009",
        "name": "Jazmín Isabel Soto Galaz",
        "entryYear": "2020",
        "professional": "Elena Galarce",
        "diag": "DEA -C",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "17.992.015-8",
        "evaluatorRut": "11-04-2025",
        "evaluator": "Elena Galarce",
        "specialty": "Prof. diferencial",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Jesús Román Ranzel Leal Olea",
    "rut": "22.852.279-1",
    "course": "IV° Medio B",
    "birthDate": "23/10/2008",
    "entryYear": "2026",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Elena Galarce",
    "professionals": [
      "Elena Galarce"
    ],
    "diagDate": "17.831.978-8",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "IVTPB",
        "course": "IV° Medio B",
        "auto": "",
        "rut": "22.852.279-1",
        "birthDate": "23/10/2008",
        "name": "Jesús Román Ranzel Leal Olea",
        "entryYear": "2026",
        "professional": "Elena Galarce",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "17.831.978-8",
        "evaluatorRut": "27/03/2026",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Johans Israel Fuentes Calderón",
    "rut": "22.938.803-7",
    "course": "IV° Medio B",
    "birthDate": "10/01/2009",
    "entryYear": "2026",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Elena Galarce",
    "professionals": [
      "Elena Galarce"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "IVTPB",
        "course": "IV° Medio B",
        "auto": "",
        "rut": "22.938.803-7",
        "birthDate": "10/01/2009",
        "name": "Johans Israel Fuentes Calderón",
        "entryYear": "2026",
        "professional": "Elena Galarce",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "13/03/2026",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Patricio Ignacio Morales Salazar",
    "rut": "22.721.939-4",
    "course": "IV° Medio B",
    "birthDate": "16/05/2008",
    "entryYear": "2020",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Elena Galarce",
    "professionals": [
      "Elena Galarce"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IVTPB",
        "course": "IV° Medio B",
        "auto": "2024",
        "rut": "22.721.939-4",
        "birthDate": "16/05/2008",
        "name": "Patricio Ignacio Morales Salazar",
        "entryYear": "2020",
        "professional": "Elena Galarce",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "23/10/2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "IVTPB",
        "course": "IV° Medio B",
        "auto": "2024",
        "rut": "22.721.939-4",
        "birthDate": "16/05/2008",
        "name": "Patricio Ignacio Morales Salazar",
        "entryYear": "2020",
        "professional": "Elena Galarce",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "23/10/2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Antonella Anahys Rivera Guzmán",
    "rut": "23.770.115-1",
    "course": "I° Medio A",
    "birthDate": "13/10/2011",
    "entryYear": "2023",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Anaís López",
    "professionals": [
      "Anaís López"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IEMA",
        "course": "I° Medio A",
        "auto": "2025",
        "rut": "23.770.115-1",
        "birthDate": "13/10/2011",
        "name": "Antonella Anahys Rivera Guzmán",
        "entryYear": "2023",
        "professional": "Anaís López",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "17-10-2024",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "IEMA",
        "course": "I° Medio A",
        "auto": "2025",
        "rut": "23.770.115-1",
        "birthDate": "13/10/2011",
        "name": "Antonella Anahys Rivera Guzmán",
        "entryYear": "2023",
        "professional": "Anaís López",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "17-10-2024",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Antonella Paz Aedo Monjes",
    "rut": "23.721.530-3",
    "course": "I° Medio A",
    "birthDate": "13/08/2011",
    "entryYear": "2024",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
    "situaciones": [
      "NEET - INICIO AÑO 1 (REINGRESO)"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Anaís López",
    "professionals": [
      "Anaís López"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "IEMA",
        "course": "I° Medio A",
        "auto": "",
        "rut": "23.721.530-3",
        "birthDate": "13/08/2011",
        "name": "Antonella Paz Aedo Monjes",
        "entryYear": "2024",
        "professional": "Anaís López",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
        "tipoNEE": "Transitoria",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "07/11/2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Camilo Leandro Cárdenas Valdebenito",
    "rut": "23.035.464-2",
    "course": "I° Medio A",
    "birthDate": "26/05/2009",
    "entryYear": "2026",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Anaís López",
    "professionals": [
      "Anaís López"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "IEMA",
        "course": "I° Medio A",
        "auto": "",
        "rut": "23.035.464-2",
        "birthDate": "26/05/2009",
        "name": "Camilo Leandro Cárdenas Valdebenito",
        "entryYear": "2026",
        "professional": "Anaís López",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "16/03/2026",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Catalina Franchesca Manríquez Villegas",
    "rut": "23.777.101-K",
    "course": "I° Medio A",
    "birthDate": "19/10/2011",
    "entryYear": "2020",
    "diag": "DEA -C",
    "diagnoses": [
      "DEA -C"
    ],
    "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
    "situaciones": [
      "NEET - INICIO AÑO 1 (REINGRESO)"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Anaís López",
    "professionals": [
      "Anaís López"
    ],
    "diagDate": "16.429.535.4",
    "evaluator": "Danae Bulicic",
    "evaluators": [
      "Danae Bulicic"
    ],
    "specialty": "Prof. diferencial",
    "specialties": [
      "Prof. diferencial"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "IEMA",
        "course": "I° Medio A",
        "auto": "",
        "rut": "23.777.101-K",
        "birthDate": "19/10/2011",
        "name": "Catalina Franchesca Manríquez Villegas",
        "entryYear": "2020",
        "professional": "Anaís López",
        "diag": "DEA -C",
        "situacion": "NEET - INICIO AÑO 1 (REINGRESO)",
        "tipoNEE": "Transitoria",
        "diagDate": "16.429.535.4",
        "evaluatorRut": "05/11/2025",
        "evaluator": "Danae Bulicic",
        "specialty": "Prof. diferencial",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Gerardo Eliecer Olivero Vega",
    "rut": "23.841.168-8",
    "course": "I° Medio A",
    "birthDate": "08/01/2012",
    "entryYear": "2024",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 3",
    "situaciones": [
      "NEEP - INICIO AÑO 3"
    ],
    "tipoNEE": "Permanente",
    "professional": "Anaís López",
    "professionals": [
      "Anaís López"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "IEMA",
        "course": "I° Medio A",
        "auto": "",
        "rut": "23.841.168-8",
        "birthDate": "08/01/2012",
        "name": "Gerardo Eliecer Olivero Vega",
        "entryYear": "2024",
        "professional": "Anaís López",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "16-05-2024",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Gustavo Elías Carrasco Fritis",
    "rut": "23.913.234-0",
    "course": "I° Medio A",
    "birthDate": "31/03/2012",
    "entryYear": "2018",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 3",
    "situaciones": [
      "NEEP - INICIO AÑO 3"
    ],
    "tipoNEE": "Permanente",
    "professional": "Anaís López",
    "professionals": [
      "Anaís López"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IEMA",
        "course": "I° Medio A",
        "auto": "2023",
        "rut": "23.913.234-0",
        "birthDate": "31/03/2012",
        "name": "Gustavo Elías Carrasco Fritis",
        "entryYear": "2018",
        "professional": "Anaís López",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "09-10-2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "IEMA",
        "course": "I° Medio A",
        "auto": "2023",
        "rut": "23.913.234-0",
        "birthDate": "31/03/2012",
        "name": "Gustavo Elías Carrasco Fritis",
        "entryYear": "2018",
        "professional": "Anaís López",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "09-10-2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Isidora Noemí Díaz Urrea",
    "rut": "23.753.019-5",
    "course": "I° Medio A",
    "birthDate": "22/09/2011",
    "entryYear": "2026",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Anaís López",
    "professionals": [
      "Anaís López"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "31"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IEMA",
        "course": "I° Medio A",
        "auto": "31",
        "rut": "23.753.019-5",
        "birthDate": "22/09/2011",
        "name": "Isidora Noemí Díaz Urrea",
        "entryYear": "2026",
        "professional": "Anaís López",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "30/30/2026",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "31",
        "courseCode": "IEMA",
        "course": "I° Medio A",
        "auto": "31",
        "rut": "23.753.019-5",
        "birthDate": "22/09/2011",
        "name": "Isidora Noemí Díaz Urrea",
        "entryYear": "2026",
        "professional": "Anaís López",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "30/30/2026",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Johans Steven Godoy Ayala",
    "rut": "23.863.364-8",
    "course": "I° Medio A",
    "birthDate": "05/02/2012",
    "entryYear": "2026",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Anaís López",
    "professionals": [
      "Anaís López"
    ],
    "diagDate": "17.026.082-1",
    "evaluator": "Sebastían Rodriguez",
    "evaluators": [
      "Sebastían Rodriguez"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "29"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IEMA",
        "course": "I° Medio A",
        "auto": "29",
        "rut": "23.863.364-8",
        "birthDate": "05/02/2012",
        "name": "Johans Steven Godoy Ayala",
        "entryYear": "2026",
        "professional": "Anaís López",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "17.026.082-1",
        "evaluatorRut": "4-7-2025",
        "evaluator": "Sebastían Rodriguez",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "29",
        "courseCode": "IEMA",
        "course": "I° Medio A",
        "auto": "29",
        "rut": "23.863.364-8",
        "birthDate": "05/02/2012",
        "name": "Johans Steven Godoy Ayala",
        "entryYear": "2026",
        "professional": "Anaís López",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "17.026.082-1",
        "evaluatorRut": "4-7-2025",
        "evaluator": "Sebastían Rodriguez",
        "specialty": "Neurología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Josue Abraham Castro Pulido",
    "rut": "28.044.495-2",
    "course": "I° Medio A",
    "birthDate": "19/11/2011",
    "entryYear": "2026",
    "diag": "TDA",
    "diagnoses": [
      "TDA"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Anaís López",
    "professionals": [
      "Anaís López"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "IEMA",
        "course": "I° Medio A",
        "auto": "",
        "rut": "28.044.495-2",
        "birthDate": "19/11/2011",
        "name": "Josue Abraham Castro Pulido",
        "entryYear": "2026",
        "professional": "Anaís López",
        "diag": "TDA",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "13/03/2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Juan Alberto Zamora Elgueta",
    "rut": "23.320.856-6",
    "course": "I° Medio A",
    "birthDate": "08/05/2010",
    "entryYear": "2017",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Anaís López",
    "professionals": [
      "Anaís López"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IEMA",
        "course": "I° Medio A",
        "auto": "2024",
        "rut": "23.320.856-6",
        "birthDate": "08/05/2010",
        "name": "Juan Alberto Zamora Elgueta",
        "entryYear": "2017",
        "professional": "Anaís López",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "01-10-2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "IEMA",
        "course": "I° Medio A",
        "auto": "2024",
        "rut": "23.320.856-6",
        "birthDate": "08/05/2010",
        "name": "Juan Alberto Zamora Elgueta",
        "entryYear": "2017",
        "professional": "Anaís López",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "01-10-2025",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Martín Eduardo Calixto Urrea",
    "rut": "23.872.378-7",
    "course": "I° Medio A",
    "birthDate": "11/02/2012",
    "entryYear": "2018",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 4",
    "situaciones": [
      "NEEP - INICIO AÑO 4"
    ],
    "tipoNEE": "Permanente",
    "professional": "Anaís López",
    "professionals": [
      "Anaís López"
    ],
    "diagDate": "16.835580-7",
    "evaluator": "Mónica Barriere",
    "evaluators": [
      "Mónica Barriere"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "IEMA",
        "course": "I° Medio A",
        "auto": "",
        "rut": "23.872.378-7",
        "birthDate": "11/02/2012",
        "name": "Martín Eduardo Calixto Urrea",
        "entryYear": "2018",
        "professional": "Anaís López",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 4",
        "tipoNEE": "Permanente",
        "diagDate": "16.835580-7",
        "evaluatorRut": "13-04-2023",
        "evaluator": "Mónica Barriere",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Mauricio Jordano Isaias Milanesi Lara",
    "rut": "23.902.852-7",
    "course": "I° Medio A",
    "birthDate": "17/03/2012",
    "entryYear": "2026",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Anaís López",
    "professionals": [
      "Anaís López"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "IEMA",
        "course": "I° Medio A",
        "auto": "",
        "rut": "23.902.852-7",
        "birthDate": "17/03/2012",
        "name": "Mauricio Jordano Isaias Milanesi Lara",
        "entryYear": "2026",
        "professional": "Anaís López",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "12/03/2026",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Valentina Constanza Martínez González",
    "rut": "23.770.594-7",
    "course": "I° Medio A",
    "birthDate": "15/10/2011",
    "entryYear": "2026",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Anaís López",
    "professionals": [
      "Anaís López"
    ],
    "diagDate": "17.318.061-6",
    "evaluator": "Alina Garcia",
    "evaluators": [
      "Alina Garcia"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "30"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IEMA",
        "course": "I° Medio A",
        "auto": "30",
        "rut": "23.770.594-7",
        "birthDate": "15/10/2011",
        "name": "Valentina Constanza Martínez González",
        "entryYear": "2026",
        "professional": "Anaís López",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "17.318.061-6",
        "evaluatorRut": "13-3-2026",
        "evaluator": "Alina Garcia",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "30",
        "courseCode": "IEMA",
        "course": "I° Medio A",
        "auto": "30",
        "rut": "23.770.594-7",
        "birthDate": "15/10/2011",
        "name": "Valentina Constanza Martínez González",
        "entryYear": "2026",
        "professional": "Anaís López",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "17.318.061-6",
        "evaluatorRut": "13-3-2026",
        "evaluator": "Alina Garcia",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Alonso Antonio Soto Rivas",
    "rut": "23.680.692-8",
    "course": "I° Medio B",
    "birthDate": "25/06/2011",
    "entryYear": "2025",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Anaís López",
    "professionals": [
      "Anaís López"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "IEMB",
        "course": "I° Medio B",
        "auto": "",
        "rut": "23.680.692-8",
        "birthDate": "25/06/2011",
        "name": "Alonso Antonio Soto Rivas",
        "entryYear": "2025",
        "professional": "Anaís López",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "27-03-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Anaís Valentina Burgos Vicencio",
    "rut": "23.883.897-5",
    "course": "I° Medio B",
    "birthDate": "23/02/2012",
    "entryYear": "2026",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Anaís López",
    "professionals": [
      "Anaís López"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "32"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IEMB",
        "course": "I° Medio B",
        "auto": "32",
        "rut": "23.883.897-5",
        "birthDate": "23/02/2012",
        "name": "Anaís Valentina Burgos Vicencio",
        "entryYear": "2026",
        "professional": "Anaís López",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "06-11-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "32",
        "courseCode": "IEMB",
        "course": "I° Medio B",
        "auto": "32",
        "rut": "23.883.897-5",
        "birthDate": "23/02/2012",
        "name": "Anaís Valentina Burgos Vicencio",
        "entryYear": "2026",
        "professional": "Anaís López",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "06-11-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Antonella Isidora Flores Sáez",
    "rut": "23.389.626-8",
    "course": "I° Medio B",
    "birthDate": "2010-07-30",
    "entryYear": "2026",
    "diag": "DIL",
    "diagnoses": [
      "DIL"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "María José Solari",
    "professionals": [
      "María José Solari"
    ],
    "diagDate": "10.330.702-3",
    "evaluator": "Paula Belmar Brito",
    "evaluators": [
      "Paula Belmar Brito"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "34"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IEMB",
        "course": "I° Medio B",
        "auto": "34",
        "rut": "23.389.626-8",
        "birthDate": "2010-07-30",
        "name": "Antonella Isidora Flores Sáez",
        "entryYear": "2026",
        "professional": "María José Solari",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "10.330.702-3",
        "evaluatorRut": "2024-12-24",
        "evaluator": "Paula Belmar Brito",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "34",
        "courseCode": "IEMB",
        "course": "I° Medio B",
        "auto": "34",
        "rut": "23.389.626-8",
        "birthDate": "2010-07-30",
        "name": "Antonella Isidora Flores Sáez",
        "entryYear": "2026",
        "professional": "María José Solari",
        "siblings": "",
        "diag": "DIL",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "10.330.702-3",
        "evaluatorRut": "2024-12-24",
        "evaluator": "Paula Belmar Brito",
        "specialty": "Psicología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Benjamín Andrés Camus Torres",
    "rut": "23.170.581-3",
    "course": "I° Medio B",
    "birthDate": "31/10/2009",
    "entryYear": "2026",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Anaís López",
    "professionals": [
      "Anaís López"
    ],
    "diagDate": "19.133.479-5",
    "evaluator": "María Jesús Hazbún Ab",
    "evaluators": [
      "María Jesús Hazbún Ab"
    ],
    "specialty": "uPgsaitctoalsogía",
    "specialties": [
      "uPgsaitctoalsogía"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "IEMB",
        "course": "I° Medio B",
        "auto": "",
        "rut": "23.170.581-3",
        "birthDate": "31/10/2009",
        "name": "Benjamín Andrés Camus Torres",
        "entryYear": "2026",
        "professional": "Anaís López",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "19.133.479-5",
        "evaluatorRut": "24/09/2025",
        "evaluator": "María Jesús Hazbún Ab",
        "specialty": "uPgsaitctoalsogía",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Emily Antonia Rodríguez Guzmán",
    "rut": "23.883.682-4",
    "course": "I° Medio B",
    "birthDate": "28/02/2012",
    "entryYear": "2025",
    "diag": "DEA -C",
    "diagnoses": [
      "DEA -C"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Anaís López",
    "professionals": [
      "Anaís López"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "IEMB",
        "course": "I° Medio B",
        "auto": "",
        "rut": "23.883.682-4",
        "birthDate": "28/02/2012",
        "name": "Emily Antonia Rodríguez Guzmán",
        "entryYear": "2025",
        "professional": "Anaís López",
        "diag": "DEA -C",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "05-12-2024",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Gaspar Patricio Cáceres Vargas",
    "rut": "23.625.962-5",
    "course": "I° Medio B",
    "birthDate": "20/04/2011",
    "entryYear": "2021",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 3",
    "situaciones": [
      "NEEP - INICIO AÑO 3"
    ],
    "tipoNEE": "Permanente",
    "professional": "Anaís López",
    "professionals": [
      "Anaís López"
    ],
    "diagDate": "16.835580-7",
    "evaluator": "Mónica Barriere",
    "evaluators": [
      "Mónica Barriere"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "IEMB",
        "course": "I° Medio B",
        "auto": "",
        "rut": "23.625.962-5",
        "birthDate": "20/04/2011",
        "name": "Gaspar Patricio Cáceres Vargas",
        "entryYear": "2021",
        "professional": "Anaís López",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 3",
        "tipoNEE": "Permanente",
        "diagDate": "16.835580-7",
        "evaluatorRut": "20-12-2023",
        "evaluator": "Mónica Barriere",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Matías Benjamín Quiñilen Cofre",
    "rut": "23.796.637-6",
    "course": "I° Medio B",
    "birthDate": "2011-11-11",
    "entryYear": "2026",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Anaís López",
    "professionals": [
      "Anaís López"
    ],
    "diagDate": "25.680.058-6",
    "evaluator": "Miguel Grau",
    "evaluators": [
      "Miguel Grau"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Pendiente",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos",
      "Pendientes"
    ],
    "classifications": [
      "S.CUPO",
      "33"
    ],
    "platformStatus": "SIN FUDEI",
    "scannerStatus": "NO",
    "loadedDocument": "",
    "pendingDocument": "- FUDEI: PSICOPEDAGOGICO Y  FONO",
    "deadline": "2026-06-01",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "IEMB",
        "course": "I° Medio B",
        "auto": "33",
        "rut": "23.796.637-6",
        "birthDate": "2011-11-11",
        "name": "Matías Benjamín Quiñilen Cofre",
        "entryYear": "2026",
        "professional": "Anaís López",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "25.680.058-6",
        "evaluatorRut": "2025-08-14",
        "evaluator": "Miguel Grau",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "33",
        "courseCode": "IEMB",
        "course": "I° Medio B",
        "auto": "33",
        "rut": "23.796.637-6",
        "birthDate": "2011-11-11",
        "name": "Matías Benjamín Quiñilen Cofre",
        "entryYear": "2026",
        "professional": "Anaís López",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "SIN FUDEI",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "25.680.058-6",
        "evaluatorRut": "2025-08-14",
        "evaluator": "Miguel Grau",
        "specialty": "Neurología",
        "pendingDocument": "",
        "deadline": ""
      },
      {
        "sheet": "Pendientes",
        "status": "Pendiente",
        "classification": "S.CUPO",
        "courseCode": "IEMB",
        "course": "I° Medio B",
        "auto": "33",
        "rut": "23.796.637-6",
        "birthDate": "2011-11-11",
        "name": "Matías Benjamín Quiñilen Cofre",
        "entryYear": "2026",
        "professional": "Anaís López",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "SIN FUDEI",
        "scannerStatus": "NO",
        "pendingDocument": "- FUDEI: PSICOPEDAGOGICO Y  FONO",
        "deadline": "2026-06-01",
        "diagDate": "25.680.058-6",
        "evaluatorRut": "2025-08-14",
        "evaluator": "Miguel Grau",
        "specialty": "Neurología",
        "approvedPreviousYears": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Natasha Monserrat Contreras Hernández",
    "rut": "23.623.660-9",
    "course": "I° Medio B",
    "birthDate": "16/04/2011",
    "entryYear": "2026",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Anaís López",
    "professionals": [
      "Anaís López"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "IEMB",
        "course": "I° Medio B",
        "auto": "",
        "rut": "23.623.660-9",
        "birthDate": "16/04/2011",
        "name": "Natasha Monserrat Contreras Hernández",
        "entryYear": "2026",
        "professional": "Anaís López",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "23/03/2026",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Scarlet Nahomi Quito Cajamarca",
    "rut": "25.286.197-1",
    "course": "I° Medio B",
    "birthDate": "17/03/2010",
    "entryYear": "2026",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Anaís López",
    "professionals": [
      "Anaís López"
    ],
    "diagDate": "17.831.978-7",
    "evaluator": "Juan Carrasco",
    "evaluators": [
      "Juan Carrasco"
    ],
    "specialty": "Psicología",
    "specialties": [
      "Psicología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "IEMB",
        "course": "I° Medio B",
        "auto": "",
        "rut": "25.286.197-1",
        "birthDate": "17/03/2010",
        "name": "Scarlet Nahomi Quito Cajamarca",
        "entryYear": "2026",
        "professional": "Anaís López",
        "diag": "FIL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "17.831.978-7",
        "evaluatorRut": "16/03/2026",
        "evaluator": "Juan Carrasco",
        "specialty": "Psicología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Vicente Ignacio Avila Cataldo",
    "rut": "23.739.910-2",
    "course": "I° Medio B",
    "birthDate": "06/09/2011",
    "entryYear": "2025",
    "diag": "FIL",
    "diagnoses": [
      "FIL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Anaís López",
    "professionals": [
      "Anaís López"
    ],
    "diagDate": "17.485.973-6",
    "evaluator": "Maria José Solari",
    "evaluators": [
      "Maria José Solari"
    ],
    "specialty": "Prof. diferencial",
    "specialties": [
      "Prof. diferencial"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "IEMB",
        "course": "I° Medio B",
        "auto": "",
        "rut": "23.739.910-2",
        "birthDate": "06/09/2011",
        "name": "Vicente Ignacio Avila Cataldo",
        "entryYear": "2025",
        "professional": "Anaís López",
        "diag": "FIL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "17.485.973-6",
        "evaluatorRut": "10-04-2025",
        "evaluator": "Maria José Solari",
        "specialty": "Prof. diferencial",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Alonso Ismael Escobar Méndez",
    "rut": "27.361.638-1",
    "course": "Kínder A",
    "birthDate": "24/09/2020",
    "entryYear": "2025",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Kaira Ruz",
    "professionals": [
      "Kaira Ruz"
    ],
    "diagDate": "17.313.388-k",
    "evaluator": "Ivan Ramirez Méndez",
    "evaluators": [
      "Ivan Ramirez Méndez"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "1KA",
        "course": "Kínder A",
        "auto": "",
        "rut": "27.361.638-1",
        "birthDate": "24/09/2020",
        "name": "Alonso Ismael Escobar Méndez",
        "entryYear": "2025",
        "professional": "Kaira Ruz",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "17.313.388-k",
        "evaluatorRut": "28-11-2023",
        "evaluator": "Ivan Ramirez Méndez",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Angel Antonio González Reyes",
    "rut": "27.413.625-1",
    "course": "Kínder A",
    "birthDate": "04/12/2020",
    "entryYear": "2025",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Kaira Ruz",
    "professionals": [
      "Kaira Ruz"
    ],
    "diagDate": "23.366.740-4",
    "evaluator": "Margarita Alvarado",
    "evaluators": [
      "Margarita Alvarado"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "1KA",
        "course": "Kínder A",
        "auto": "",
        "rut": "27.413.625-1",
        "birthDate": "04/12/2020",
        "name": "Angel Antonio González Reyes",
        "entryYear": "2025",
        "professional": "Kaira Ruz",
        "diag": "TL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "23.366.740-4",
        "evaluatorRut": "10-03-2025",
        "evaluator": "Margarita Alvarado",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Dante Israel Lefián Yáñez",
    "rut": "27.332.285-K",
    "course": "Kínder A",
    "birthDate": "17/08/2020",
    "entryYear": "2026",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Kaira Ruz",
    "professionals": [
      "Kaira Ruz"
    ],
    "diagDate": "19.562.388-0",
    "evaluator": "Valeria Andrades",
    "evaluators": [
      "Valeria Andrades"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "1KA",
        "course": "Kínder A",
        "auto": "",
        "rut": "27.332.285-K",
        "birthDate": "17/08/2020",
        "name": "Dante Israel Lefián Yáñez",
        "entryYear": "2026",
        "professional": "Kaira Ruz",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-0",
        "evaluatorRut": "12/03/2026",
        "evaluator": "Valeria Andrades",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Dastan Leonardo Herrera Pino",
    "rut": "27.265.025-K",
    "course": "Kínder A",
    "birthDate": "23/04/2020",
    "entryYear": "2026",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Ana Zamora",
    "professionals": [
      "Ana Zamora"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "1KA",
        "course": "Kínder A",
        "auto": "",
        "rut": "27.265.025-K",
        "birthDate": "23/04/2020",
        "name": "Dastan Leonardo Herrera Pino",
        "entryYear": "2026",
        "professional": "Ana Zamora",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "14-08-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Dyoulissa Pierre Abraham",
    "rut": "27.484.960-6",
    "course": "Kínder A",
    "birthDate": "05/03/2021",
    "entryYear": "2025",
    "diag": "GARC",
    "diagnoses": [
      "GARC"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Ana Zamora",
    "professionals": [
      "Ana Zamora"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "1KA",
        "course": "Kínder A",
        "auto": "2025",
        "rut": "27.484.960-6",
        "birthDate": "05/03/2021",
        "name": "Dyoulissa Pierre Abraham",
        "entryYear": "2025",
        "professional": "Ana Zamora",
        "diag": "GARC",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "27-03-2025",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "1KA",
        "course": "Kínder A",
        "auto": "2025",
        "rut": "27.484.960-6",
        "birthDate": "05/03/2021",
        "name": "Dyoulissa Pierre Abraham",
        "entryYear": "2025",
        "professional": "Ana Zamora",
        "siblings": "",
        "diag": "GARC",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "27-03-2025",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Felipe Luis Ignacio Gómez Silva",
    "rut": "27.299.816-7",
    "course": "Kínder A",
    "birthDate": "21/06/2020",
    "entryYear": "2025",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Kaira Ruz",
    "professionals": [
      "Kaira Ruz"
    ],
    "diagDate": "23.366.740-4",
    "evaluator": "Margarita Alvarado",
    "evaluators": [
      "Margarita Alvarado"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "1KA",
        "course": "Kínder A",
        "auto": "",
        "rut": "27.299.816-7",
        "birthDate": "21/06/2020",
        "name": "Felipe Luis Ignacio Gómez Silva",
        "entryYear": "2025",
        "professional": "Kaira Ruz",
        "diag": "TL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "23.366.740-4",
        "evaluatorRut": "10-03-2025",
        "evaluator": "Margarita Alvarado",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Renata Ignacia Padilla Muñoz",
    "rut": "27.255.688-1",
    "course": "Kínder A",
    "birthDate": "05/04/2020",
    "entryYear": "2025",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Kaira Ruz",
    "professionals": [
      "Kaira Ruz"
    ],
    "diagDate": "23.366.740-4",
    "evaluator": "Margarita Alvarado",
    "evaluators": [
      "Margarita Alvarado"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "1KA",
        "course": "Kínder A",
        "auto": "",
        "rut": "27.255.688-1",
        "birthDate": "05/04/2020",
        "name": "Renata Ignacia Padilla Muñoz",
        "entryYear": "2025",
        "professional": "Kaira Ruz",
        "diag": "TL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "23.366.740-4",
        "evaluatorRut": "10-03-2025",
        "evaluator": "Margarita Alvarado",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Sammantha Rusett Pavez Ongaro",
    "rut": "27.434.437-7",
    "course": "Kínder A",
    "birthDate": "23/12/2020",
    "entryYear": "2025",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Kaira Ruz",
    "professionals": [
      "Kaira Ruz"
    ],
    "diagDate": "16.011.500-9",
    "evaluator": "Carolina Quintana",
    "evaluators": [
      "Carolina Quintana"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "1KA",
        "course": "Kínder A",
        "auto": "2025",
        "rut": "27.434.437-7",
        "birthDate": "23/12/2020",
        "name": "Sammantha Rusett Pavez Ongaro",
        "entryYear": "2025",
        "professional": "Kaira Ruz",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "16.011.500-9",
        "evaluatorRut": "16-05-2025",
        "evaluator": "Carolina Quintana",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "1KA",
        "course": "Kínder A",
        "auto": "2025",
        "rut": "27.434.437-7",
        "birthDate": "23/12/2020",
        "name": "Sammantha Rusett Pavez Ongaro",
        "entryYear": "2025",
        "professional": "Kaira Ruz",
        "siblings": "",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "16.011.500-9",
        "evaluatorRut": "16-05-2025",
        "evaluator": "Carolina Quintana",
        "specialty": "Neurología",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Trinidad Denisse Aedo Machado",
    "rut": "27.355.861-6",
    "course": "Kínder A",
    "birthDate": "08/09/2020",
    "entryYear": "2026",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Kaira Ruz",
    "professionals": [
      "Kaira Ruz"
    ],
    "diagDate": "19.562.388-0",
    "evaluator": "Valeria Andrades",
    "evaluators": [
      "Valeria Andrades"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "1KA",
        "course": "Kínder A",
        "auto": "",
        "rut": "27.355.861-6",
        "birthDate": "08/09/2020",
        "name": "Trinidad Denisse Aedo Machado",
        "entryYear": "2026",
        "professional": "Kaira Ruz",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-0",
        "evaluatorRut": "12/03/2026",
        "evaluator": "Valeria Andrades",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Ahinara Emiliana Fuentes Mella",
    "rut": "27.357.165-5",
    "course": "Kínder B",
    "birthDate": "14/09/2020",
    "entryYear": "2025",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Carolina Linco",
    "professionals": [
      "Carolina Linco"
    ],
    "diagDate": "23.366.740-4",
    "evaluator": "Margarita Alvarado",
    "evaluators": [
      "Margarita Alvarado"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "1KB",
        "course": "Kínder B",
        "auto": "",
        "rut": "27.357.165-5",
        "birthDate": "14/09/2020",
        "name": "Ahinara Emiliana Fuentes Mella",
        "entryYear": "2025",
        "professional": "Carolina Linco",
        "diag": "TL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "23.366.740-4",
        "evaluatorRut": "10-03-2025",
        "evaluator": "Margarita Alvarado",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Jorge Manuel Rodriguez Chirinos",
    "rut": "100.788.209-9",
    "course": "Kínder B",
    "birthDate": "16/12/2020",
    "entryYear": "2026",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Carolina Linco",
    "professionals": [
      "Carolina Linco"
    ],
    "diagDate": "19.562.388-0",
    "evaluator": "Valeria Andrades",
    "evaluators": [
      "Valeria Andrades"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "1KB",
        "course": "Kínder B",
        "auto": "",
        "rut": "100.788.209-9",
        "birthDate": "16/12/2020",
        "name": "Jorge Manuel Rodriguez Chirinos",
        "entryYear": "2026",
        "professional": "Carolina Linco",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-0",
        "evaluatorRut": "12-03-2026",
        "evaluator": "Valeria Andrades",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Leniel Branco Bórquez Becher",
    "rut": "27.337.263-6",
    "course": "Kínder B",
    "birthDate": "12/08/2020",
    "entryYear": "2025",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Carolina Linco",
    "professionals": [
      "Carolina Linco"
    ],
    "diagDate": "23.366.740-4",
    "evaluator": "Margarita Alvarado",
    "evaluators": [
      "Margarita Alvarado"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "1KB",
        "course": "Kínder B",
        "auto": "",
        "rut": "27.337.263-6",
        "birthDate": "12/08/2020",
        "name": "Leniel Branco Bórquez Becher",
        "entryYear": "2025",
        "professional": "Carolina Linco",
        "diag": "TL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "23.366.740-4",
        "evaluatorRut": "10-03-2025",
        "evaluator": "Margarita Alvarado",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Milovan Martín Barrales Gajardo",
    "rut": "27.365.890-4",
    "course": "Kínder B",
    "birthDate": "01/10/2020",
    "entryYear": "2025",
    "diag": "GARC",
    "diagnoses": [
      "GARC"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Carolina Linco",
    "professionals": [
      "Carolina Linco"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "1KB",
        "course": "Kínder B",
        "auto": "2025",
        "rut": "27.365.890-4",
        "birthDate": "01/10/2020",
        "name": "Milovan Martín Barrales Gajardo",
        "entryYear": "2025",
        "professional": "Carolina Linco",
        "diag": "GARC",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "14-04-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "1KB",
        "course": "Kínder B",
        "auto": "2025",
        "rut": "27.365.890-4",
        "birthDate": "01/10/2020",
        "name": "Milovan Martín Barrales Gajardo",
        "entryYear": "2025",
        "professional": "Carolina Linco",
        "siblings": "",
        "diag": "GARC",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "14-04-2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Máximo Aáron Belmar Arocutipa",
    "rut": "27.269.927-5",
    "course": "Kínder B",
    "birthDate": "21/04/2020",
    "entryYear": "2026",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Carolina Linco",
    "professionals": [
      "Carolina Linco"
    ],
    "diagDate": "19.562.388-0",
    "evaluator": "Valeria Andrades",
    "evaluators": [
      "Valeria Andrades"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "1KB",
        "course": "Kínder B",
        "auto": "",
        "rut": "27.269.927-5",
        "birthDate": "21/04/2020",
        "name": "Máximo Aáron Belmar Arocutipa",
        "entryYear": "2026",
        "professional": "Carolina Linco",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-0",
        "evaluatorRut": "12-03-2026",
        "evaluator": "Valeria Andrades",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Nicolás Francisco Aguayo Garay",
    "rut": "27.480.960-4",
    "course": "Kínder B",
    "birthDate": "03/03/2021",
    "entryYear": "2025",
    "diag": "GARC",
    "diagnoses": [
      "GARC"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Carolina Linco",
    "professionals": [
      "Carolina Linco"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "1KB",
        "course": "Kínder B",
        "auto": "",
        "rut": "27.480.960-4",
        "birthDate": "03/03/2021",
        "name": "Nicolás Francisco Aguayo Garay",
        "entryYear": "2025",
        "professional": "Carolina Linco",
        "diag": "GARC",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "27-03-2025",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Thomas Antonio Fuentes Ebannur",
    "rut": "27.312.334-2",
    "course": "Kínder B",
    "birthDate": "13/07/2020",
    "entryYear": "2025",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Carolina Linco",
    "professionals": [
      "Carolina Linco"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "1KB",
        "course": "Kínder B",
        "auto": "",
        "rut": "27.312.334-2",
        "birthDate": "13/07/2020",
        "name": "Thomas Antonio Fuentes Ebannur",
        "entryYear": "2025",
        "professional": "Carolina Linco",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "18/12/2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Vallolet Fernanda Castro Aguilar",
    "rut": "27.446.933-1",
    "course": "Kínder B",
    "birthDate": "08/01/2021",
    "entryYear": "2025",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Carolina Linco",
    "professionals": [
      "Carolina Linco"
    ],
    "diagDate": "23.366.740-4",
    "evaluator": "Margarita Alvarado",
    "evaluators": [
      "Margarita Alvarado"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "1KB",
        "course": "Kínder B",
        "auto": "",
        "rut": "27.446.933-1",
        "birthDate": "08/01/2021",
        "name": "Vallolet Fernanda Castro Aguilar",
        "entryYear": "2025",
        "professional": "Carolina Linco",
        "diag": "TL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "23.366.740-4",
        "evaluatorRut": "10-03-2025",
        "evaluator": "Margarita Alvarado",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Carl Abraham Cesar Cesar",
    "rut": "27.384.819-3",
    "course": "Kínder C",
    "birthDate": "30/10/2020",
    "entryYear": "2025",
    "diag": "GARC",
    "diagnoses": [
      "GARC"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Debbie Lara",
    "professionals": [
      "Debbie Lara"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "1KC",
        "course": "Kínder C",
        "auto": "2025",
        "rut": "27.384.819-3",
        "birthDate": "30/10/2020",
        "name": "Carl Abraham Cesar Cesar",
        "entryYear": "2025",
        "professional": "Debbie Lara",
        "diag": "GARC",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "27-03-2025",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "1KC",
        "course": "Kínder C",
        "auto": "2025",
        "rut": "27.384.819-3",
        "birthDate": "30/10/2020",
        "name": "Carl Abraham Cesar Cesar",
        "entryYear": "2025",
        "professional": "Debbie Lara",
        "siblings": "",
        "diag": "GARC",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "27-03-2025",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Chellodjina Midsaelah Delice Florestal",
    "rut": "27.486.962-3",
    "course": "Kínder C",
    "birthDate": "09/03/2021",
    "entryYear": "2026",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Debbie Lara",
    "professionals": [
      "Debbie Lara"
    ],
    "diagDate": "19.562.388-2",
    "evaluator": "Valeria Andrades",
    "evaluators": [
      "Valeria Andrades"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "1KC",
        "course": "Kínder C",
        "auto": "",
        "rut": "27.486.962-3",
        "birthDate": "09/03/2021",
        "name": "Chellodjina Midsaelah Delice Florestal",
        "entryYear": "2026",
        "professional": "Debbie Lara",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-2",
        "evaluatorRut": "12/03/2026",
        "evaluator": "Valeria Andrades",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Crismeily Bernard Jean Baptiste",
    "rut": "27.268.706-4",
    "course": "Kínder C",
    "birthDate": "29/04/2020",
    "entryYear": "2026",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Debbie Lara",
    "professionals": [
      "Debbie Lara"
    ],
    "diagDate": "19.562.388-2",
    "evaluator": "Valeria Andrades",
    "evaluators": [
      "Valeria Andrades"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "1KC",
        "course": "Kínder C",
        "auto": "",
        "rut": "27.268.706-4",
        "birthDate": "29/04/2020",
        "name": "Crismeily Bernard Jean Baptiste",
        "entryYear": "2026",
        "professional": "Debbie Lara",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-2",
        "evaluatorRut": "12/03/2026",
        "evaluator": "Valeria Andrades",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Daniel Valentino Enrique Cisterna Araos",
    "rut": "27.470.554-K",
    "course": "Kínder C",
    "birthDate": "13/02/2021",
    "entryYear": "2025",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Debbie Lara",
    "professionals": [
      "Debbie Lara"
    ],
    "diagDate": "23.366.740-4",
    "evaluator": "Margarita Alvarado",
    "evaluators": [
      "Margarita Alvarado"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "1KC",
        "course": "Kínder C",
        "auto": "",
        "rut": "27.470.554-K",
        "birthDate": "13/02/2021",
        "name": "Daniel Valentino Enrique Cisterna Araos",
        "entryYear": "2025",
        "professional": "Debbie Lara",
        "diag": "TL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "23.366.740-4",
        "evaluatorRut": "10/03/2025",
        "evaluator": "Margarita Alvarado",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Dante Amaru Cortez Cornejo",
    "rut": "27.449.550-2",
    "course": "Kínder C",
    "birthDate": "2021-01-14",
    "entryYear": "2026",
    "diag": "GARC",
    "diagnoses": [
      "TEA",
      "GARC"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Debbie Lara",
    "professionals": [
      "Debbie Lara"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Pendiente",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos",
      "Pendientes"
    ],
    "classifications": [
      "S.CUPO",
      "2"
    ],
    "platformStatus": "SIN FUDEI",
    "scannerStatus": "NO",
    "loadedDocument": "",
    "pendingDocument": "- FUDEI  Y  PSICOPEDAGOGICO",
    "deadline": "2026-06-01",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "1KC",
        "course": "Kínder C",
        "auto": "2",
        "rut": "27.449.550-2",
        "birthDate": "2021-01-14",
        "name": "Dante Amaru Cortez Cornejo",
        "entryYear": "2026",
        "professional": "Debbie Lara",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "2026-05-28",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "2",
        "courseCode": "1KC",
        "course": "Kínder C",
        "auto": "2",
        "rut": "27.449.550-2",
        "birthDate": "2021-01-14",
        "name": "Dante Amaru Cortez Cornejo",
        "entryYear": "2026",
        "professional": "Debbie Lara",
        "siblings": "",
        "diag": "GARC",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "SIN FUDEI",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "2026-05-28",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      },
      {
        "sheet": "Pendientes",
        "status": "Pendiente",
        "classification": "S.CUPO",
        "courseCode": "1KC",
        "course": "Kínder C",
        "auto": "2",
        "rut": "27.449.550-2",
        "birthDate": "2021-01-14",
        "name": "Dante Amaru Cortez Cornejo",
        "entryYear": "2026",
        "professional": "Debbie Lara",
        "diag": "GARC",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "SIN FUDEI",
        "scannerStatus": "NO",
        "pendingDocument": "- FUDEI  Y  PSICOPEDAGOGICO",
        "deadline": "2026-06-01",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "2026-05-28",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "approvedPreviousYears": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Eidan Antonel Pérez Vidal",
    "rut": "27.479.837-8",
    "course": "Kínder C",
    "birthDate": "01/03/2021",
    "entryYear": "2026",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Debbie Lara",
    "professionals": [
      "Debbie Lara"
    ],
    "diagDate": "19.562.388-2",
    "evaluator": "Valeria Andrades",
    "evaluators": [
      "Valeria Andrades"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "1KC",
        "course": "Kínder C",
        "auto": "",
        "rut": "27.479.837-8",
        "birthDate": "01/03/2021",
        "name": "Eidan Antonel Pérez Vidal",
        "entryYear": "2026",
        "professional": "Debbie Lara",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-2",
        "evaluatorRut": "12/03/2026",
        "evaluator": "Valeria Andrades",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Emiliano Alexander Molina Martínez",
    "rut": "27.273.463-1",
    "course": "Kínder C",
    "birthDate": "07/05/2020",
    "entryYear": "2025",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET- INICIO AÑO 2",
    "situaciones": [
      "NEET- INICIO AÑO 2"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Debbie Lara",
    "professionals": [
      "Debbie Lara"
    ],
    "diagDate": "23.366.740-4",
    "evaluator": "Margarita Alvarado",
    "evaluators": [
      "Margarita Alvarado"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "1KC",
        "course": "Kínder C",
        "auto": "",
        "rut": "27.273.463-1",
        "birthDate": "07/05/2020",
        "name": "Emiliano Alexander Molina Martínez",
        "entryYear": "2025",
        "professional": "Debbie Lara",
        "diag": "TL",
        "situacion": "NEET- INICIO AÑO 2",
        "tipoNEE": "Transitoria",
        "diagDate": "23.366.740-4",
        "evaluatorRut": "10/03/2025",
        "evaluator": "Margarita Alvarado",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Lian Alexander Palacios Puas",
    "rut": "27.466.565-3",
    "course": "Kínder C",
    "birthDate": "06/02/2021",
    "entryYear": "2025",
    "diag": "GARC",
    "diagnoses": [
      "GARC"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Debbie Lara",
    "professionals": [
      "Debbie Lara"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO"
    ],
    "platformStatus": "OK",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "SI",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "1KC",
        "course": "Kínder C",
        "auto": "2025",
        "rut": "27.466.565-3",
        "birthDate": "06/02/2021",
        "name": "Lian Alexander Palacios Puas",
        "entryYear": "2025",
        "professional": "Debbie Lara",
        "diag": "GARC",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "27-03-2025",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "S.CUPO",
        "courseCode": "1KC",
        "course": "Kínder C",
        "auto": "2025",
        "rut": "27.466.565-3",
        "birthDate": "06/02/2021",
        "name": "Lian Alexander Palacios Puas",
        "entryYear": "2025",
        "professional": "Debbie Lara",
        "siblings": "",
        "diag": "GARC",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "SI",
        "scannerStatus": "",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "27-03-2025",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Lucas Ignacio Araos Alcántar",
    "rut": "27.392.623-2",
    "course": "Kínder C",
    "birthDate": "14/10/2020",
    "entryYear": "2025",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Debbie Lara",
    "professionals": [
      "Debbie Lara"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "1KC",
        "course": "Kínder C",
        "auto": "",
        "rut": "27.392.623-2",
        "birthDate": "14/10/2020",
        "name": "Lucas Ignacio Araos Alcántar",
        "entryYear": "2025",
        "professional": "Debbie Lara",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "18/12/2025",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Ángela Elizabeth Fuentes Araya",
    "rut": "27.404.786-0",
    "course": "Kínder C",
    "birthDate": "21/11/2020",
    "entryYear": "2025",
    "diag": "GARC",
    "diagnoses": [
      "GARC"
    ],
    "situacion": "NEEP - INICIO AÑO 2",
    "situaciones": [
      "NEEP - INICIO AÑO 2"
    ],
    "tipoNEE": "Permanente",
    "professional": "Debbie Lara",
    "professionals": [
      "Debbie Lara"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "1KC",
        "course": "Kínder C",
        "auto": "",
        "rut": "27.404.786-0",
        "birthDate": "21/11/2020",
        "name": "Ángela Elizabeth Fuentes Araya",
        "entryYear": "2025",
        "professional": "Debbie Lara",
        "diag": "GARC",
        "situacion": "NEEP - INICIO AÑO 2",
        "tipoNEE": "Permanente",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "27-03-2025",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Amparo Esnelda Pardo Gallardo",
    "rut": "27.736.576-6",
    "course": "Prekínder A",
    "birthDate": "05/03/2022",
    "entryYear": "2026",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Kaira Ruz",
    "professionals": [
      "Kaira Ruz"
    ],
    "diagDate": "19.562.388-3",
    "evaluator": "Valeria Andrades",
    "evaluators": [
      "Valeria Andrades"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "1PKA",
        "course": "Prekínder A",
        "auto": "",
        "rut": "27.736.576-6",
        "birthDate": "05/03/2022",
        "name": "Amparo Esnelda Pardo Gallardo",
        "entryYear": "2026",
        "professional": "Kaira Ruz",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-3",
        "evaluatorRut": "12/03/2026",
        "evaluator": "Valeria Andrades",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Astrid Melina Rodríguez Cusi",
    "rut": "27.708.013-3",
    "course": "Prekínder A",
    "birthDate": "26/01/2022",
    "entryYear": "2026",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Kaira Ruz",
    "professionals": [
      "Kaira Ruz"
    ],
    "diagDate": "19.562.388-4",
    "evaluator": "Valeria Andrades",
    "evaluators": [
      "Valeria Andrades"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "1PKA",
        "course": "Prekínder A",
        "auto": "",
        "rut": "27.708.013-3",
        "birthDate": "26/01/2022",
        "name": "Astrid Melina Rodríguez Cusi",
        "entryYear": "2026",
        "professional": "Kaira Ruz",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-4",
        "evaluatorRut": "12/03/2026",
        "evaluator": "Valeria Andrades",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Facundo Eduardo López Cornejo",
    "rut": "27.593.813-0",
    "course": "Prekínder A",
    "birthDate": "08/08/2021",
    "entryYear": "2026",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Kaira Ruz",
    "professionals": [
      "Kaira Ruz"
    ],
    "diagDate": "5579461-8",
    "evaluator": "Perla David",
    "evaluators": [
      "Perla David"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "1PKA",
        "course": "Prekínder A",
        "auto": "",
        "rut": "27.593.813-0",
        "birthDate": "08/08/2021",
        "name": "Facundo Eduardo López Cornejo",
        "entryYear": "2026",
        "professional": "Kaira Ruz",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "5579461-8",
        "evaluatorRut": "07/04/2026",
        "evaluator": "Perla David",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Florencia Anais Crot Downing",
    "rut": "27.662.224-2",
    "course": "Prekínder A",
    "birthDate": "23/11/2021",
    "entryYear": "2026",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP- INICIO AÑO 1",
    "situaciones": [
      "NEEP- INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Kaira Ruz",
    "professionals": [
      "Kaira Ruz"
    ],
    "diagDate": "13.493.815 -3",
    "evaluator": "Alejandra Siebert",
    "evaluators": [
      "Alejandra Siebert"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "1PKA",
        "course": "Prekínder A",
        "auto": "",
        "rut": "27.662.224-2",
        "birthDate": "23/11/2021",
        "name": "Florencia Anais Crot Downing",
        "entryYear": "2026",
        "professional": "Kaira Ruz",
        "diag": "TEA",
        "situacion": "NEEP- INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "13.493.815 -3",
        "evaluatorRut": "06/01/2026",
        "evaluator": "Alejandra Siebert",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Gaspar Martín Jaque Pinto",
    "rut": "27.721.444-K",
    "course": "Prekínder A",
    "birthDate": "09/02/2022",
    "entryYear": "2026",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Kaira Ruz",
    "professionals": [
      "Kaira Ruz"
    ],
    "diagDate": "19.562.388-1",
    "evaluator": "Valeria Andrades",
    "evaluators": [
      "Valeria Andrades"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "1PKA",
        "course": "Prekínder A",
        "auto": "",
        "rut": "27.721.444-K",
        "birthDate": "09/02/2022",
        "name": "Gaspar Martín Jaque Pinto",
        "entryYear": "2026",
        "professional": "Kaira Ruz",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-1",
        "evaluatorRut": "12/03/2026",
        "evaluator": "Valeria Andrades",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Leider Alexander Mijares Orosco",
    "rut": "28.970.937-1",
    "course": "Prekínder A",
    "birthDate": "26/10/2021",
    "entryYear": "2026",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Kaira Ruz",
    "professionals": [
      "Kaira Ruz"
    ],
    "diagDate": "19.562.388-2",
    "evaluator": "Valeria Andrades",
    "evaluators": [
      "Valeria Andrades"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "1PKA",
        "course": "Prekínder A",
        "auto": "",
        "rut": "28.970.937-1",
        "birthDate": "26/10/2021",
        "name": "Leider Alexander Mijares Orosco",
        "entryYear": "2026",
        "professional": "Kaira Ruz",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-2",
        "evaluatorRut": "12/03/2026",
        "evaluator": "Valeria Andrades",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Lucas Esteban Azola López",
    "rut": "27.632.334-2",
    "course": "Prekínder A",
    "birthDate": "03/10/2021",
    "entryYear": "2026",
    "diag": "GARC",
    "diagnoses": [
      "GARC"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Kaira Ruz",
    "professionals": [
      "Kaira Ruz"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Sobrecupo",
    "sourceSheets": [
      "Cupos",
      "Sobrecupos"
    ],
    "classifications": [
      "S.CUPO",
      "1"
    ],
    "platformStatus": "OK",
    "scannerStatus": "SI",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "S.CUPO",
        "courseCode": "1PKA",
        "course": "Prekínder A",
        "auto": "1",
        "rut": "27.632.334-2",
        "birthDate": "03/10/2021",
        "name": "Lucas Esteban Azola López",
        "entryYear": "2026",
        "professional": "Kaira Ruz",
        "diag": "GARC",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "2026-03-13",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      },
      {
        "sheet": "Sobrecupos",
        "status": "Sobrecupo",
        "classification": "1",
        "courseCode": "1PKA",
        "course": "Prekínder A",
        "auto": "1",
        "rut": "27.632.334-2",
        "birthDate": "03/10/2021",
        "name": "Lucas Esteban Azola López",
        "entryYear": "2026",
        "professional": "Kaira Ruz",
        "siblings": "",
        "diag": "GARC",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "platformStatus": "OK",
        "approvedPreviousYears": "",
        "scannerStatus": "SI",
        "loadedDocument": "",
        "appealResult": "",
        "finalResult": "",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "2026-03-13",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "pendingDocument": "",
        "deadline": ""
      }
    ]
  },
  {
    "name": "Vicente Joan Águila Silva",
    "rut": "27.688.474-3",
    "course": "Prekínder A",
    "birthDate": "31/12/2021",
    "entryYear": "2026",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Kaira Ruz",
    "professionals": [
      "Kaira Ruz"
    ],
    "diagDate": "19.562.388-0",
    "evaluator": "Valeria Andrades",
    "evaluators": [
      "Valeria Andrades"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "1PKA",
        "course": "Prekínder A",
        "auto": "",
        "rut": "27.688.474-3",
        "birthDate": "31/12/2021",
        "name": "Vicente Joan Águila Silva",
        "entryYear": "2026",
        "professional": "Kaira Ruz",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-0",
        "evaluatorRut": "12/03/2026",
        "evaluator": "Valeria Andrades",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Aaron Daniel Sanchez Godoy",
    "rut": "27.673.403-2",
    "course": "Prekínder B",
    "birthDate": "05/12/2021",
    "entryYear": "2026",
    "diag": "GARC",
    "diagnoses": [
      "GARC"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Ana Zamora",
    "professionals": [
      "Ana Zamora"
    ],
    "diagDate": "14.739.429-2",
    "evaluator": "Carlos Zambrano",
    "evaluators": [
      "Carlos Zambrano"
    ],
    "specialty": "Psiquiatría",
    "specialties": [
      "Psiquiatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "1PKB",
        "course": "Prekínder B",
        "auto": "",
        "rut": "27.673.403-2",
        "birthDate": "05/12/2021",
        "name": "Aaron Daniel Sanchez Godoy",
        "entryYear": "2026",
        "professional": "Ana Zamora",
        "diag": "GARC",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "14.739.429-2",
        "evaluatorRut": "23/04/2026",
        "evaluator": "Carlos Zambrano",
        "specialty": "Psiquiatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Alonso Joaquín Flores Echavarría",
    "rut": "27.562.566-3",
    "course": "Prekínder B",
    "birthDate": "14/06/2021",
    "entryYear": "2026",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Carolina Linco",
    "professionals": [
      "Carolina Linco"
    ],
    "diagDate": "19.562.388-1",
    "evaluator": "Valeria Andrades",
    "evaluators": [
      "Valeria Andrades"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "1PKB",
        "course": "Prekínder B",
        "auto": "",
        "rut": "27.562.566-3",
        "birthDate": "14/06/2021",
        "name": "Alonso Joaquín Flores Echavarría",
        "entryYear": "2026",
        "professional": "Carolina Linco",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-1",
        "evaluatorRut": "12/03/2026",
        "evaluator": "Valeria Andrades",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Jean Pierre Tapia Juanillo",
    "rut": "27.642.544-7",
    "course": "Prekínder B",
    "birthDate": "12/10/2021",
    "entryYear": "2026",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Carolina Linco",
    "professionals": [
      "Carolina Linco"
    ],
    "diagDate": "19.562.388-3",
    "evaluator": "Valeria Andrades",
    "evaluators": [
      "Valeria Andrades"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "1PKB",
        "course": "Prekínder B",
        "auto": "",
        "rut": "27.642.544-7",
        "birthDate": "12/10/2021",
        "name": "Jean Pierre Tapia Juanillo",
        "entryYear": "2026",
        "professional": "Carolina Linco",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-3",
        "evaluatorRut": "12/03/2026",
        "evaluator": "Valeria Andrades",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Keyla Ester Tapia Jarpa",
    "rut": "27.759.969-4",
    "course": "Prekínder B",
    "birthDate": "25/03/2022",
    "entryYear": "2026",
    "diag": "GARC",
    "diagnoses": [
      "GARC"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Carolina Linco",
    "professionals": [
      "Carolina Linco"
    ],
    "diagDate": "7.413.411-4",
    "evaluator": "Alejandra Vargas",
    "evaluators": [
      "Alejandra Vargas"
    ],
    "specialty": "Pediatría",
    "specialties": [
      "Pediatría"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "1PKB",
        "course": "Prekínder B",
        "auto": "",
        "rut": "27.759.969-4",
        "birthDate": "25/03/2022",
        "name": "Keyla Ester Tapia Jarpa",
        "entryYear": "2026",
        "professional": "Carolina Linco",
        "diag": "GARC",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "7.413.411-4",
        "evaluatorRut": "13/03/2026",
        "evaluator": "Alejandra Vargas",
        "specialty": "Pediatría",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Lucas Ariel Urbina Gallardo",
    "rut": "27.519.578-2",
    "course": "Prekínder B",
    "birthDate": "28/04/2021",
    "entryYear": "2026",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Carolina Linco",
    "professionals": [
      "Carolina Linco"
    ],
    "diagDate": "19.562.388-4",
    "evaluator": "Valeria Andrades",
    "evaluators": [
      "Valeria Andrades"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "1PKB",
        "course": "Prekínder B",
        "auto": "",
        "rut": "27.519.578-2",
        "birthDate": "28/04/2021",
        "name": "Lucas Ariel Urbina Gallardo",
        "entryYear": "2026",
        "professional": "Carolina Linco",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-4",
        "evaluatorRut": "12/03/2026",
        "evaluator": "Valeria Andrades",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Pia Trinidad Uziel Arriagada Montero",
    "rut": "27.535.049-4",
    "course": "Prekínder B",
    "birthDate": "12/05/2021",
    "entryYear": "2026",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Carolina Linco",
    "professionals": [
      "Carolina Linco"
    ],
    "diagDate": "19.562.388-2",
    "evaluator": "Valeria Andrades",
    "evaluators": [
      "Valeria Andrades"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "1PKB",
        "course": "Prekínder B",
        "auto": "",
        "rut": "27.535.049-4",
        "birthDate": "12/05/2021",
        "name": "Pia Trinidad Uziel Arriagada Montero",
        "entryYear": "2026",
        "professional": "Carolina Linco",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-2",
        "evaluatorRut": "12/03/2026",
        "evaluator": "Valeria Andrades",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Samira Antonella Castillo Rubio",
    "rut": "27.733.632-4",
    "course": "Prekínder B",
    "birthDate": "26/02/2022",
    "entryYear": "2026",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Carolina Linco",
    "professionals": [
      "Carolina Linco"
    ],
    "diagDate": "19.562.388-0",
    "evaluator": "Valeria Andrades",
    "evaluators": [
      "Valeria Andrades"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "1PKB",
        "course": "Prekínder B",
        "auto": "",
        "rut": "27.733.632-4",
        "birthDate": "26/02/2022",
        "name": "Samira Antonella Castillo Rubio",
        "entryYear": "2026",
        "professional": "Carolina Linco",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-0",
        "evaluatorRut": "12/03/2026",
        "evaluator": "Valeria Andrades",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Alonso Benjamín Vera Crespo",
    "rut": "27.564.443-9",
    "course": "Prekínder C",
    "birthDate": "23/06/2021",
    "entryYear": "2026",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Debbie Lara",
    "professionals": [
      "Debbie Lara"
    ],
    "diagDate": "6985075-8",
    "evaluator": "Gastellu Juantapia",
    "evaluators": [
      "Gastellu Juantapia"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "1PKC",
        "course": "Prekínder C",
        "auto": "",
        "rut": "27.564.443-9",
        "birthDate": "23/06/2021",
        "name": "Alonso Benjamín Vera Crespo",
        "entryYear": "2026",
        "professional": "Debbie Lara",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "6985075-8",
        "evaluatorRut": "11/09/2025",
        "evaluator": "Gastellu Juantapia",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Benjamín Matías Urrutia Riquelme",
    "rut": "27.674.850-5",
    "course": "Prekínder C",
    "birthDate": "04/12/2021",
    "entryYear": "2026",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Debbie Lara",
    "professionals": [
      "Debbie Lara"
    ],
    "diagDate": "19.562.388-3",
    "evaluator": "Valeria Andrades",
    "evaluators": [
      "Valeria Andrades"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "4"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "4",
        "courseCode": "1PKC",
        "course": "Prekínder C",
        "auto": "",
        "rut": "27.674.850-5",
        "birthDate": "04/12/2021",
        "name": "Benjamín Matías Urrutia Riquelme",
        "entryYear": "2026",
        "professional": "Debbie Lara",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-3",
        "evaluatorRut": "12/03/2026",
        "evaluator": "Valeria Andrades",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Franciel Melymel Juste Jiménez",
    "rut": "27.680.612-2",
    "course": "Prekínder C",
    "birthDate": "16/12/2021",
    "entryYear": "2026",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Debbie Lara",
    "professionals": [
      "Debbie Lara"
    ],
    "diagDate": "19.562.388-1",
    "evaluator": "Valeria Andrades",
    "evaluators": [
      "Valeria Andrades"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "2"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "2",
        "courseCode": "1PKC",
        "course": "Prekínder C",
        "auto": "",
        "rut": "27.680.612-2",
        "birthDate": "16/12/2021",
        "name": "Franciel Melymel Juste Jiménez",
        "entryYear": "2026",
        "professional": "Debbie Lara",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-1",
        "evaluatorRut": "12/03/2026",
        "evaluator": "Valeria Andrades",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Liat Adaia Colipí Mora",
    "rut": "27.723.166-2",
    "course": "Prekínder C",
    "birthDate": "15/02/2022",
    "entryYear": "2026",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Debbie Lara",
    "professionals": [
      "Debbie Lara"
    ],
    "diagDate": "19.562.388-0",
    "evaluator": "Valeria Andrades",
    "evaluators": [
      "Valeria Andrades"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "1"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "1",
        "courseCode": "1PKC",
        "course": "Prekínder C",
        "auto": "",
        "rut": "27.723.166-2",
        "birthDate": "15/02/2022",
        "name": "Liat Adaia Colipí Mora",
        "entryYear": "2026",
        "professional": "Debbie Lara",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-0",
        "evaluatorRut": "12/03/2026",
        "evaluator": "Valeria Andrades",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Noah Ezequiel Valdés Burgos",
    "rut": "27.733.953-6",
    "course": "Prekínder C",
    "birthDate": "01/03/2022",
    "entryYear": "2026",
    "diag": "TEA",
    "diagnoses": [
      "TEA"
    ],
    "situacion": "NEEP - INICIO AÑO 1",
    "situaciones": [
      "NEEP - INICIO AÑO 1"
    ],
    "tipoNEE": "Permanente",
    "professional": "Debbie Lara",
    "professionals": [
      "Debbie Lara"
    ],
    "diagDate": "6372467-k",
    "evaluator": "Juan Gonzalez",
    "evaluators": [
      "Juan Gonzalez"
    ],
    "specialty": "Neurología",
    "specialties": [
      "Neurología"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "NEEP"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "NEEP",
        "courseCode": "1PKC",
        "course": "Prekínder C",
        "auto": "",
        "rut": "27.733.953-6",
        "birthDate": "01/03/2022",
        "name": "Noah Ezequiel Valdés Burgos",
        "entryYear": "2026",
        "professional": "Debbie Lara",
        "diag": "TEA",
        "situacion": "NEEP - INICIO AÑO 1",
        "tipoNEE": "Permanente",
        "diagDate": "6372467-k",
        "evaluatorRut": "07/12/2024",
        "evaluator": "Juan Gonzalez",
        "specialty": "Neurología",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Paolo Francisco Nicolás Zúñiga Yáñez",
    "rut": "27.622.132-9",
    "course": "Prekínder C",
    "birthDate": "16/09/2021",
    "entryYear": "2026",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Debbie Lara",
    "professionals": [
      "Debbie Lara"
    ],
    "diagDate": "19.562.388-4",
    "evaluator": "Valeria Andrades",
    "evaluators": [
      "Valeria Andrades"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "5"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "5",
        "courseCode": "1PKC",
        "course": "Prekínder C",
        "auto": "",
        "rut": "27.622.132-9",
        "birthDate": "16/09/2021",
        "name": "Paolo Francisco Nicolás Zúñiga Yáñez",
        "entryYear": "2026",
        "professional": "Debbie Lara",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-4",
        "evaluatorRut": "12/03/2026",
        "evaluator": "Valeria Andrades",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  },
  {
    "name": "Patricia Dabenchina Fleuristil Pierrecine",
    "rut": "27.719.048-6",
    "course": "Prekínder C",
    "birthDate": "11/02/2022",
    "entryYear": "2026",
    "diag": "TL",
    "diagnoses": [
      "TL"
    ],
    "situacion": "NEET - INICIO AÑO 1",
    "situaciones": [
      "NEET - INICIO AÑO 1"
    ],
    "tipoNEE": "Transitoria",
    "professional": "Debbie Lara",
    "professionals": [
      "Debbie Lara"
    ],
    "diagDate": "19.562.388-2",
    "evaluator": "Valeria Andrades",
    "evaluators": [
      "Valeria Andrades"
    ],
    "specialty": "Fonoaudióloga",
    "specialties": [
      "Fonoaudióloga"
    ],
    "cupo": "Cupo",
    "sourceSheets": [
      "Cupos"
    ],
    "classifications": [
      "3"
    ],
    "platformStatus": "",
    "scannerStatus": "",
    "loadedDocument": "",
    "pendingDocument": "",
    "deadline": "",
    "approvedPreviousYears": "",
    "appealResult": "",
    "finalResult": "",
    "siblings": "",
    "records": [
      {
        "sheet": "Cupos",
        "status": "Cupo",
        "classification": "3",
        "courseCode": "1PKC",
        "course": "Prekínder C",
        "auto": "",
        "rut": "27.719.048-6",
        "birthDate": "11/02/2022",
        "name": "Patricia Dabenchina Fleuristil Pierrecine",
        "entryYear": "2026",
        "professional": "Debbie Lara",
        "diag": "TL",
        "situacion": "NEET - INICIO AÑO 1",
        "tipoNEE": "Transitoria",
        "diagDate": "19.562.388-2",
        "evaluatorRut": "12/03/2026",
        "evaluator": "Valeria Andrades",
        "specialty": "Fonoaudióloga",
        "platformStatus": "",
        "approvedPreviousYears": "",
        "scannerStatus": "",
        "loadedDocument": "",
        "pendingDocument": "",
        "deadline": "",
        "appealResult": "",
        "finalResult": "",
        "siblings": ""
      }
    ]
  }
];

export const PIE_PROFESSIONALS: PieProfessional[] = [
  {
    "name": "Kaira Ruz",
    "cargo": "Profesor Diferencial",
    "specialty": "Discapacidad Intelectual",
    "email": "k.ruz@colegiosanlucas.com"
  },
  {
    "name": "Carolina Linco",
    "cargo": "Profesor Diferencial",
    "specialty": "Problemas de Audición y Lenguaje",
    "email": "c.linco@colegiosanlucas.com"
  },
  {
    "name": "Debbie Lara",
    "cargo": "Profesor Diferencial",
    "specialty": "Trastornos especificos del lenguaje oral",
    "email": "d.lara@colegiosanlucas.com"
  },
  {
    "name": "Ana Zamora",
    "cargo": "Profesor Diferencial",
    "specialty": "Trastornos especificos del lenguaje oral",
    "email": "a.zamora@colegiosanlucas.com"
  },
  {
    "name": "Daniela Villagra",
    "cargo": "Profesor Diferencial",
    "specialty": "Psicopedagogía",
    "email": "d.villagra@colegiosanlucas.com"
  },
  {
    "name": "Nicolle Salinas",
    "cargo": "Profesor Diferencial",
    "specialty": "Literacidad",
    "email": "n.salinas@colegiosanlucas"
  },
  {
    "name": "Andrea Galvez",
    "cargo": "Profesor Diferencial",
    "specialty": "Dificultades del lenguaje y aprendizaje",
    "email": "a.galvez@colegiosanlucas.com"
  },
  {
    "name": "M. Soledad Salinas",
    "cargo": "Profesor Diferencial",
    "specialty": "Discapacidad Intelectual",
    "email": "m.salinas@colegiosanlucas.com"
  },
  {
    "name": "Milton Osses",
    "cargo": "Profesor Diferencial",
    "specialty": "Dificultades del aprendizaje y del lenguaje",
    "email": "m.osses@colegiosanlucas.com"
  },
  {
    "name": "Danae Bulicic",
    "cargo": "Profesor Diferencial",
    "specialty": "Problemas de Aprendizaje",
    "email": "d.bulicic@colegiosanlucas.com"
  },
  {
    "name": "Yanel Parra",
    "cargo": "Profesor Diferencial",
    "specialty": "Psicopedagogía",
    "email": "y.parra@colegiosanlucas.com"
  },
  {
    "name": "Andrea Linco",
    "cargo": "Profesor Diferencial",
    "specialty": "Problemas de Aprendizaje",
    "email": "a.linco@colegiosanlucas.com"
  },
  {
    "name": "Diego Lagos",
    "cargo": "Profesor Diferencial",
    "specialty": "Accesibilidad de los aprendizajes",
    "email": "d.lagos@colegiosanlucas.com"
  },
  {
    "name": "Daniela Perez",
    "cargo": "Profesor Diferencial",
    "specialty": "Discapacidad Intelectual",
    "email": "d.perez@colegiosanlucas.com"
  },
  {
    "name": "Michael Vera",
    "cargo": "Profesor Diferencial",
    "specialty": "Psicopedagogía",
    "email": "m.vera.i@colegiosanlucas.com"
  },
  {
    "name": "Anaís López",
    "cargo": "Profesor Diferencial",
    "specialty": "Discapacidad Intelectual",
    "email": "a.lopez.matamala@colegiosanlucas.com"
  },
  {
    "name": "Natalia Miranda",
    "cargo": "Profesor Diferencial",
    "specialty": "Problemas de Aprendizaje",
    "email": "n.miranda@colegiosanlucas.com"
  },
  {
    "name": "M. José Solari",
    "cargo": "Profesor Diferencial",
    "specialty": "Discapacidad Intelectual",
    "email": "m.solari@colegiosanlucas.com"
  },
  {
    "name": "Elena Galarce",
    "cargo": "Profesor Diferencial",
    "specialty": "Dificultades especificas del aprendizaje- dificultades sociemocionales",
    "email": "e.galarce@colegiosanlucas.com"
  },
  {
    "name": "Daniela Carrillo",
    "cargo": "Profesor Diferencial",
    "specialty": "Dificultades específicas del aprendizaje",
    "email": "d.carrillo@colegiosanlucas.com"
  },
  {
    "name": "Valeria Andrades",
    "cargo": "Fonoaudióloga",
    "specialty": "-",
    "email": "v.andrades@colegiosanlucas.com"
  },
  {
    "name": "Yocelyn Pérez",
    "cargo": "Fonoaudióloga",
    "specialty": "-",
    "email": "y.perez@colegiosanlucas.com"
  },
  {
    "name": "Margarita Alvarado",
    "cargo": "Fonoaudióloga",
    "specialty": "-",
    "email": "m.alvarado@colegiosanlucas.com"
  },
  {
    "name": "Arlette Espina",
    "cargo": "Terapeuta Ocupacional",
    "specialty": "",
    "email": "a.espina@colegiosanlucas.com"
  },
  {
    "name": "Tihare Amaya",
    "cargo": "Terapeuta Ocupacional",
    "specialty": "-",
    "email": "t.amaya@colegiosanlucas.com"
  },
  {
    "name": "Juan Carrasco",
    "cargo": "Psicólogo",
    "specialty": "Educacional clinico",
    "email": "j.e.carrasco@gmail.com"
  },
  {
    "name": "Fabiana Acevedo",
    "cargo": "Psicóloga",
    "specialty": "-",
    "email": "f.acevedo@colegiosanlucas.com"
  },
  {
    "name": "Daniela Barra",
    "cargo": "Subdirectora PIE",
    "specialty": "Problemas de Aprendizaje",
    "email": "d.barra@colegiosanlucas.com"
  },
  {
    "name": "Otros",
    "cargo": "",
    "specialty": "",
    "email": ""
  },
  {
    "name": "Alejandra Vargas",
    "cargo": "Pediatra",
    "specialty": "",
    "email": "pie@colegiosanlucas.com"
  },
  {
    "name": "Carlos Zambrano",
    "cargo": "Psiquiatra",
    "specialty": "",
    "email": "c.zambrano@colegiosanlucas.com"
  }
];
