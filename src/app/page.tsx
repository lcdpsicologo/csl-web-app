"use client";

import React, { useEffect, useState } from 'react';
import { 
  Home, 
  BookOpen, 
  UsersRound, 
  Calendar, 
  Plus, 
  X, 
  Search, 
  Bell, 
  CheckCircle2,
  AlertCircle,
  BarChart3,
  FileText,
  FolderOpen,
  Cloud,
  ExternalLink,
  GraduationCap,
  ClipboardList,
  User,
  ChevronRight,
  ArrowLeft,
  Trash2,
  Link as LinkIcon
} from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_BITACORA = [
  { 
    id: 1, 
    date: '2026-05-06T08:30:00', 
    type: 'Registro', 
    title: 'Revisión de asistencia semanal', 
    content: 'Se revisó la asistencia de los primeros medios. Se detectaron 3 casos de inasistencia reiterada que serán derivados a inspectoría.', 
    tags: ['Rutina', 'Asistencia'] 
  },
  { 
    id: 2, 
    date: '2026-05-05T14:30:00', 
    type: 'Acuerdo', 
    title: 'Coordinación Equipo PIE', 
    content: 'Reunión con educadoras diferenciales para ajustar adecuaciones curriculares del 2° Medio B.', 
    tags: ['PIE', 'Coordinación'] 
  }
];

const REUNIONES = [
  { id: 1, date: '2026-05-06T15:00:00', title: 'Entrevista Apoderado - Martín Soto', type: 'Apoderados', status: 'Pendiente' },
  { id: 2, date: '2026-05-07T10:00:00', title: 'Taller para Padres: Prevención Cyberbullying', type: 'Taller', status: 'Programado' },
  { id: 3, date: '2026-05-08T09:00:00', title: 'Reunión Equipo de Gestión', type: 'Directiva', status: 'Programado' },
];

type StudentRecord = {
  id: number;
  name: string;
  status: string;
  notesCount: number;
  lastNote: string;
};

type CourseRecord = {
  id: number;
  name: string;
  studentsCount: number;
  equipoAula: {
    profesorJefe: string;
    pie: string;
    inspector: string;
  };
  students: StudentRecord[];
};

const COURSES: CourseRecord[] = [
  { 
    id: 1, 
    name: '1° Medio A', 
    studentsCount: 35, 
    equipoAula: {
      profesorJefe: 'María González (Historia)',
      pie: 'Carlos Mendoza (Ed. Diferencial)',
      inspector: 'Juan Pérez (Patio Central)'
    },
    students: [
      { id: 101, name: 'Martín Soto', status: 'En seguimiento', notesCount: 3, lastNote: 'Problemas de integración en recreos.' },
      { id: 102, name: 'Sofía Castro', status: 'Regular', notesCount: 0, lastNote: '' },
      { id: 103, name: 'Lucas Valdés', status: 'PIE', notesCount: 1, lastNote: 'Adecuación en Matemáticas.' },
    ]
  },
  { 
    id: 2, 
    name: '2° Medio B', 
    studentsCount: 32, 
    equipoAula: {
      profesorJefe: 'Roberto Díaz (Matemáticas)',
      pie: 'Ana Silva (Psicopedagoga)',
      inspector: 'Luisa Tapia (Patio Norte)'
    },
    students: [
      { id: 201, name: 'Diego Torres', status: 'Convivencia', notesCount: 4, lastNote: 'Citación a apoderado pendiente.' },
      { id: 202, name: 'Valentina Ruiz', status: 'Regular', notesCount: 0, lastNote: '' },
    ]
  },
  { 
    id: 3, 
    name: '8° Básico C', 
    studentsCount: 38, 
    equipoAula: {
      profesorJefe: 'Carmen Rojas (Lenguaje)',
      pie: 'Carlos Mendoza (Ed. Diferencial)',
      inspector: 'Juan Pérez (Patio Central)'
    },
    students: []
  },
];

const DRIVE_FOLDERS = [
  { id: 1, name: 'Planificaciones 2026', type: 'folder', shared: true, link: '#' },
  { id: 2, name: 'Formatos de Entrevistas a Apoderados', type: 'folder', shared: true, link: '#' },
  { id: 3, name: 'Registros Equipo PIE', type: 'folder', shared: false, link: '#' },
  { id: 4, name: 'Protocolos de Convivencia Escolar.pdf', type: 'file', shared: true, link: '#' },
];

const ORIENTATION_ACTIONS = [
  'Soy amable',
  'Soy correcto',
  'Tengo propósito',
  'Soy responsable',
  'Tengo afán de superación',
  'Soy entusiasta',
  'Soy constructivo',
  'Hago las cosas bien',
  'Consejo de Curso',
  'Intervención Formativa',
  'Intervención estudiantes',
  'Intervención apoderados',
];

const ORIENTATION_CYCLES = [
  {
    name: '1° Ciclo',
    description: 'PreK a 4° Básico',
    courses: ['Pre Kinder A', 'Pre Kinder B', 'Kinder A', 'Kinder B', '1° Básico A', '1° Básico B', '2° Básico A', '2° Básico B', '3° Básico A', '3° Básico B', '4° Básico A', '4° Básico B'],
  },
  {
    name: '2° Ciclo',
    description: '5° a 8° Básico',
    courses: ['5° Básico A', '5° Básico B', '6° Básico A', '6° Básico B', '7° Básico A', '7° Básico B', '8° Básico A', '8° Básico B'],
  },
  {
    name: 'Enseñanza Media',
    description: 'I° a IV° Medio',
    courses: ['I° Medio A', 'I° Medio B', 'II° Medio A', 'II° Medio B', 'III° Medio A', 'III° Medio B', 'IV° Medio A', 'IV° Medio B'],
  },
];

const INITIAL_ORIENTATION_RECORDS = [
  {
    id: 1,
    sem: '18/05 al 22/05 (Semana 12)',
    date: '2026-05-19',
    cycle: '1° Ciclo',
    course: 'Pre Kinder B',
    action: 'Hago las cosas bien',
    topic: 'Sesión 4',
    status: 'Realizado',
    observations: 'La araña hacendosa',
    evidenceLink: 'https://canva.link/x83vxwd4h45p6gb',
    planningLink: 'https://drive.google.com/',
  },
  {
    id: 2,
    sem: '18/05 al 22/05 (Semana 12)',
    date: '2026-05-20',
    cycle: '1° Ciclo',
    course: 'Pre Kinder C',
    action: 'Hago las cosas bien',
    topic: 'Sesión 4',
    status: 'Realizado',
    observations: 'La araña hacendosa',
    evidenceLink: 'https://canva.link/x83vxwd4h45p6gb',
    planningLink: 'https://drive.google.com/',
  },
  {
    id: 3,
    sem: '18/05 al 22/05 (Semana 12)',
    date: '2026-05-21',
    cycle: '1° Ciclo',
    course: 'Kinder A',
    action: 'Hago las cosas bien',
    topic: 'Sesión 3',
    status: 'Pendiente',
    observations: 'El desorden de Franklin',
    evidenceLink: 'https://canva.link/i4asqi5qao0qr9t',
    planningLink: '',
  },
  {
    id: 4,
    sem: '18/05 al 22/05 (Semana 12)',
    date: '2026-05-22',
    cycle: '1° Ciclo',
    course: 'Kinder C',
    action: 'Intervención Formativa',
    topic: 'Sesión 1',
    status: 'Realizado',
    observations: 'Kinder C juega con cuidado y buen trato',
    evidenceLink: 'https://canva.link/la4qtzcfajo6rcc',
    planningLink: 'https://drive.google.com/',
  },
  {
    id: 5,
    sem: '18/05 al 22/05 (Semana 12)',
    date: '2026-05-18',
    cycle: '1° Ciclo',
    course: '1° Básico A',
    action: 'Intervención Formativa',
    topic: 'Sesión 1',
    status: 'Realizado',
    observations: 'Devolución de prueba DIA socioemocional',
    evidenceLink: 'https://canva.link/y860v75hqwkhdd4p',
    planningLink: 'https://drive.google.com/',
  },
  {
    id: 6,
    sem: '18/05 al 22/05 (Semana 12)',
    date: '2026-05-22',
    cycle: '1° Ciclo',
    course: '2° Básico A',
    action: 'Intervención Formativa',
    topic: 'Sesión 1',
    status: 'Pendiente',
    observations: 'Devolución de prueba DIA socioemocional',
    evidenceLink: 'https://canva.link/e75srmdmto1vsms',
    planningLink: '',
  },
  {
    id: 7,
    sem: '18/05 al 22/05 (Semana 12)',
    date: '2026-05-18',
    cycle: '1° Ciclo',
    course: '4° Básico A',
    action: 'Intervención Formativa',
    topic: 'Sesión 1',
    status: 'Realizado',
    observations: 'Devolución de prueba DIA socioemocional. Durante la clase acompaña Subdirectora Valeska, Profesora Catalina y Orientador.',
    evidenceLink: 'https://canva.link/irg9u9ntpra8vyp',
    planningLink: 'https://drive.google.com/',
  },
];

const ORIENTATION_STORAGE_KEY = 'csl-orientation-records';
type OrientationRecord = (typeof INITIAL_ORIENTATION_RECORDS)[number];
type OrientationRecordField = keyof Omit<OrientationRecord, 'id'>;

export default function ColegioDashboard() {
  const [currentView, setCurrentView] = useState('inicio');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for data
  const [bitacora, setBitacora] = useState(INITIAL_BITACORA);
  const [orientationRecords, setOrientationRecords] = useState(INITIAL_ORIENTATION_RECORDS);
  const [orientationStorageReady, setOrientationStorageReady] = useState(false);
  const [orientationPersistence, setOrientationPersistence] = useState<'loading' | 'cloud' | 'local'>('loading');
  const [selectedCourse, setSelectedCourse] = useState<CourseRecord | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);

  // Modal Form State
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteType, setNewNoteType] = useState('Registro');
  const [newNoteTags, setNewNoteTags] = useState('');
  const [newOrientationRecord, setNewOrientationRecord] = useState({
    sem: '',
    date: new Date().toISOString().slice(0, 10),
    cycle: '1° Ciclo',
    course: 'Pre Kinder A',
    action: 'Soy amable',
    topic: 'Sesión 1',
    status: 'Pendiente',
    observations: '',
    evidenceLink: '',
    planningLink: '',
  });

  const navigation = [
    { id: 'inicio', name: 'Dashboard Principal', icon: Home },
    { id: 'cursos', name: 'Cursos & Estudiantes', icon: GraduationCap },
    { id: 'orientacion', name: 'Orientación SOY+', icon: BarChart3 },
    { id: 'bitacora', name: 'Mi Bitácora Diaria', icon: BookOpen },
    { id: 'reuniones', name: 'Reuniones & Talleres', icon: UsersRound },
    { id: 'archivos', name: 'Archivos & Drive', icon: Cloud },
  ];

  useEffect(() => {
    let isMounted = true;

    const loadSavedRecords = async () => {
      try {
        const response = await fetch('/api/orientation-records', { cache: 'no-store' });
        if (!response.ok) throw new Error('Unable to load orientation records');
        const data = await response.json();

        if (!isMounted) return;
        setOrientationRecords(Array.isArray(data.records) ? data.records : INITIAL_ORIENTATION_RECORDS);
        setOrientationPersistence(data.persistent ? 'cloud' : 'local');
      } catch {
        const savedRecords = window.localStorage.getItem(ORIENTATION_STORAGE_KEY);
        if (!isMounted) return;

        if (savedRecords) {
          setOrientationRecords(JSON.parse(savedRecords));
        }
        setOrientationPersistence('local');
      } finally {
        if (isMounted) setOrientationStorageReady(true);
      }
    };

    loadSavedRecords();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!orientationStorageReady) return;
    window.localStorage.setItem(ORIENTATION_STORAGE_KEY, JSON.stringify(orientationRecords));

    const saveRecords = window.setTimeout(async () => {
      try {
        const response = await fetch('/api/orientation-records', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ records: orientationRecords }),
        });
        const data = await response.json();
        setOrientationPersistence(data.persistent ? 'cloud' : 'local');
      } catch {
        setOrientationPersistence('local');
      }
    }, 500);

    return () => window.clearTimeout(saveRecords);
  }, [orientationRecords, orientationStorageReady]);

  const handleSaveBitacora = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      type: newNoteType,
      title: newNoteTitle,
      content: newNoteContent,
      tags: newNoteTags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    setBitacora([newEntry, ...bitacora]);
    setIsModalOpen(false);
    
    // Reset Form
    setNewNoteTitle('');
    setNewNoteContent('');
    setNewNoteType('Registro');
    setNewNoteTags('');
    
    if (currentView !== 'bitacora') setCurrentView('bitacora');
  };

  const handleSaveOrientationRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrientationRecord.course || !newOrientationRecord.action || !newOrientationRecord.observations.trim()) return;

    setOrientationRecords([
      { id: Date.now(), ...newOrientationRecord },
      ...orientationRecords,
    ]);
    setNewOrientationRecord({
      sem: '',
      date: new Date().toISOString().slice(0, 10),
      cycle: '1° Ciclo',
      course: 'Pre Kinder A',
      action: 'Soy amable',
      topic: 'Sesión 1',
      status: 'Pendiente',
      observations: '',
      evidenceLink: '',
      planningLink: '',
    });
  };

  const handleDeleteOrientationRecord = (recordId: number) => {
    setOrientationRecords(orientationRecords.filter(record => record.id !== recordId));
  };

  const handleUpdateOrientationRecord = (recordId: number, field: OrientationRecordField, value: string) => {
    setOrientationRecords(orientationRecords.map(record => {
      if (record.id !== recordId) return record;

      const updatedRecord = { ...record, [field]: value };
      if (field === 'cycle') {
        updatedRecord.course = ORIENTATION_CYCLES.find(cycle => cycle.name === value)?.courses[0] || record.course;
      }

      return updatedRecord;
    }));
  };

  const updateOrientationField = (field: string, value: string) => {
    const nextRecord = { ...newOrientationRecord, [field]: value };
    if (field === 'cycle') {
      nextRecord.course = ORIENTATION_CYCLES.find(cycle => cycle.name === value)?.courses[0] || '';
    }
    setNewOrientationRecord(nextRecord);
  };

  const getNoteTypeIcon = (type: string) => {
    switch(type) {
      case 'Incidencia': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'Acuerdo': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'Registro': return <ClipboardList className="w-5 h-5 text-blue-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNoteTypeColor = (type: string) => {
    switch(type) {
      case 'Incidencia': return 'bg-red-50 text-red-700 border-red-200';
      case 'Acuerdo': return 'bg-green-50 text-green-700 border-green-200';
      case 'Registro': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'En seguimiento': return 'bg-orange-100 text-orange-700';
      case 'Convivencia': return 'bg-red-100 text-red-700';
      case 'PIE': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getInterventionStatusColor = (status: string) => {
    switch(status) {
      case 'Realizado': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Pendiente': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Reprogramado': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // --- VISTAS ---

  const ViewInicio = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Valores Institucionales */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Colegio San Lucas de Lo Espejo</h2>
          <p className="text-sm text-slate-600 mb-4">
            Plataforma de orientación y seguimiento escolar para el Colegio San Lucas de Lo Espejo. Los datos, cursos, bitácoras e intervenciones visibles corresponden a este establecimiento.
          </p>
          <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Software por</span>
            <img src="/tiza-education-logo.svg" alt="Logo Tiza Education" className="h-7 w-auto" />
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <img 
            src="/emblema-valores.png" 
            alt="Valores Colegio San Lucas de Lo Espejo" 
            className="max-h-64 object-contain rounded-xl"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all cursor-pointer" onClick={() => setCurrentView('bitacora')}>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Registros en Bitácora</p>
            <h3 className="text-3xl font-bold text-slate-800">{bitacora.length}</h3>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl group-hover:bg-blue-100 transition-colors">
            <ClipboardList className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all cursor-pointer" onClick={() => setCurrentView('reuniones')}>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Entrevistas / Talleres</p>
            <h3 className="text-3xl font-bold text-slate-800">{REUNIONES.length}</h3>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl group-hover:bg-orange-100 transition-colors">
            <UsersRound className="w-6 h-6 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all cursor-pointer" onClick={() => setCurrentView('cursos')}>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Cursos Asignados</p>
            <h3 className="text-3xl font-bold text-slate-800">{COURSES.length}</h3>
          </div>
          <div className="bg-cyan-50 p-4 rounded-xl group-hover:bg-cyan-100 transition-colors">
            <GraduationCap className="w-6 h-6 text-cyan-600" />
          </div>
        </div>
      </div>
    </div>
  );

  const ViewCursos = () => {
    if (selectedStudent && selectedCourse) {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <button onClick={() => setSelectedStudent(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Volver a {selectedCourse.name}
          </button>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{selectedStudent.name}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${getStatusColor(selectedStudent.status)}`}>
                      {selectedStudent.status}
                    </span>
                    <span className="text-sm text-slate-500">Curso: {selectedCourse.name}</span>
                  </div>
                </div>
              </div>
              <button className="bg-cyan-50 text-cyan-700 hover:bg-cyan-100 px-4 py-2 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" /> Nueva Anotación
              </button>
            </div>
            
            <div className="mt-8 border-t border-slate-100 pt-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Historial y Seguimiento</h3>
              {selectedStudent.notesCount > 0 ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 relative">
                    <div className="absolute -left-[5px] top-5 w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-sm" />
                    <p className="text-xs font-semibold text-cyan-600 mb-1">Última actualización</p>
                    <p className="text-sm text-slate-700">{selectedStudent.lastNote}</p>
                  </div>
                  {/* More mock history could go here */}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No hay anotaciones registradas para este estudiante.</p>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (selectedCourse) {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <button onClick={() => setSelectedCourse(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Volver a Mis Cursos
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              {/* Información del Curso y Equipo de Aula */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-1">{selectedCourse.name}</h2>
                <p className="text-slate-500 text-sm mb-6">{selectedCourse.studentsCount} Estudiantes matriculados</p>
                
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Equipo de Aula</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">Profesor(a) Jefe</p>
                    <p className="text-sm font-medium text-slate-700">{selectedCourse.equipoAula.profesorJefe}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">Profesional PIE</p>
                    <p className="text-sm font-medium text-slate-700">{selectedCourse.equipoAula.pie}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">Inspector(a) de Patio</p>
                    <p className="text-sm font-medium text-slate-700">{selectedCourse.equipoAula.inspector}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800">Nómina de Estudiantes</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Buscar estudiante..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
              </div>

              <div className="space-y-2">
                {selectedCourse.students?.map((student) => (
                  <div 
                    key={student.id} 
                    onClick={() => setSelectedStudent(student)}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-cyan-200 hover:bg-cyan-50/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-cyan-100 group-hover:text-cyan-600 transition-colors">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{student.name}</p>
                        <p className="text-xs text-slate-500">{student.notesCount} anotaciones</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${getStatusColor(student.status)}`}>
                        {student.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-cyan-500" />
                    </div>
                  </div>
                ))}
                {selectedCourse.students?.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-8">No hay estudiantes cargados en este curso.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // List of courses
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Cursos Asignados</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map(course => (
            <div 
              key={course.id} 
              onClick={() => setSelectedCourse(course)}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-cyan-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                  {course.studentsCount} Alumnos
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">{course.name}</h3>
              <p className="text-sm text-slate-500 truncate">Prof. Jefe: {course.equipoAula.profesorJefe}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ViewOrientacion = () => {
    const totalRealizadas = orientationRecords.filter(record => record.status === 'Realizado').length;
    const totalPendientes = orientationRecords.filter(record => record.status === 'Pendiente').length;
    const recordsWithPlanning = orientationRecords.filter(record => record.planningLink).length;
    const currentCycleCourses = ORIENTATION_CYCLES.find(cycle => cycle.name === newOrientationRecord.cycle)?.courses || [];

    const countRecords = (course: string, action: string) => (
      orientationRecords.filter(record => record.course === course && record.action === action).length
    );

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-slate-800">Bitácora SOY+ del Colegio San Lucas de Lo Espejo</h2>
          <p className="text-sm text-slate-500">Clases e intervenciones desde orientación del Colegio San Lucas de Lo Espejo, con evidencia, planificación y seguimiento por estado.</p>
        </div>

        <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Registros de orientación</h3>
                <p className="text-xs text-slate-500">Agrega, modifica y elimina registros directamente desde esta bitácora.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
              <div className="rounded-lg bg-slate-50 px-3 py-2 border border-slate-100">
                <p className="text-[10px] font-bold uppercase text-slate-400">Total</p>
                <p className="text-lg font-bold text-slate-800">{orientationRecords.length}</p>
              </div>
              <div className="rounded-lg bg-emerald-50 px-3 py-2 border border-emerald-100">
                <p className="text-[10px] font-bold uppercase text-emerald-600">Realizadas</p>
                <p className="text-lg font-bold text-emerald-800">{totalRealizadas}</p>
              </div>
              <div className="rounded-lg bg-amber-50 px-3 py-2 border border-amber-100">
                <p className="text-[10px] font-bold uppercase text-amber-600">Pendientes</p>
                <p className="text-lg font-bold text-amber-800">{totalPendientes}</p>
              </div>
              <div className="rounded-lg bg-blue-50 px-3 py-2 border border-blue-100">
                <p className="text-[10px] font-bold uppercase text-blue-600">Planif.</p>
                <p className="text-lg font-bold text-blue-800">{recordsWithPlanning}</p>
              </div>
              <div className={`rounded-lg px-3 py-2 border ${orientationPersistence === 'cloud' ? 'bg-cyan-50 border-cyan-100' : 'bg-slate-50 border-slate-100'}`}>
                <p className={`text-[10px] font-bold uppercase ${orientationPersistence === 'cloud' ? 'text-cyan-700' : 'text-slate-400'}`}>Guardado</p>
                <p className={`text-sm font-bold ${orientationPersistence === 'cloud' ? 'text-cyan-800' : 'text-slate-700'}`}>
                  {orientationPersistence === 'loading' ? 'Cargando' : orientationPersistence === 'cloud' ? 'Nube' : 'Local'}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveOrientationRecord} className="bg-slate-50/70 border-b border-slate-100 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3">
              <input
                type="text"
                value={newOrientationRecord.sem}
                onChange={(e) => updateOrientationField('sem', e.target.value)}
                placeholder="SEM"
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <input
                type="date"
                value={newOrientationRecord.date}
                onChange={(e) => updateOrientationField('date', e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
              <select
                value={newOrientationRecord.cycle}
                onChange={(e) => updateOrientationField('cycle', e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {ORIENTATION_CYCLES.map(cycle => <option key={cycle.name}>{cycle.name}</option>)}
              </select>
              <select
                value={newOrientationRecord.course}
                onChange={(e) => updateOrientationField('course', e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {currentCycleCourses.map(course => <option key={course}>{course}</option>)}
              </select>
              <select
                value={newOrientationRecord.action}
                onChange={(e) => updateOrientationField('action', e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {ORIENTATION_ACTIONS.map(action => <option key={action}>{action}</option>)}
              </select>
              <input
                type="text"
                value={newOrientationRecord.topic}
                onChange={(e) => updateOrientationField('topic', e.target.value)}
                placeholder="Tema / comentario"
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <select
                value={newOrientationRecord.status}
                onChange={(e) => updateOrientationField('status', e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option>Realizado</option>
                <option>Pendiente</option>
                <option>Reprogramado</option>
              </select>
              <input
                type="url"
                value={newOrientationRecord.evidenceLink}
                onChange={(e) => updateOrientationField('evidenceLink', e.target.value)}
                placeholder="Link evidencia"
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <input
                type="url"
                value={newOrientationRecord.planningLink}
                onChange={(e) => updateOrientationField('planningLink', e.target.value)}
                placeholder="Link planificación"
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <input
                type="text"
                value={newOrientationRecord.observations}
                onChange={(e) => updateOrientationField('observations', e.target.value)}
                placeholder="Observaciones"
                className="md:col-span-2 xl:col-span-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" /> Agregar
              </button>
            </div>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1620px] border-collapse text-sm">
              <thead>
                <tr>
                  {['SEM', 'Fecha', 'Ciclo', 'Curso', 'Acción / Fortaleza', 'Tema / Comentario', 'Estado', 'Observaciones', 'Link evidencia', 'Planificación', ''].map(header => (
                    <th key={header || 'acciones'} className="bg-sky-700 border border-sky-200 px-3 py-3 text-left text-xs font-bold uppercase text-white">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orientationRecords.map(record => (
                  <tr key={record.id} className="odd:bg-white even:bg-slate-50/50 hover:bg-cyan-50/40 transition-colors">
                    <td className="border border-slate-200 p-1.5">
                      <input
                        value={record.sem}
                        onChange={(e) => handleUpdateOrientationRecord(record.id, 'sem', e.target.value)}
                        placeholder="Sin semana"
                        className="w-full min-w-44 rounded-md border border-transparent bg-transparent px-2 py-1.5 text-slate-700 outline-none focus:border-cyan-300 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                      />
                    </td>
                    <td className="border border-slate-200 p-1.5">
                      <input
                        type="date"
                        value={record.date}
                        onChange={(e) => handleUpdateOrientationRecord(record.id, 'date', e.target.value)}
                        className="w-full min-w-36 rounded-md border border-transparent bg-transparent px-2 py-1.5 text-slate-700 outline-none focus:border-cyan-300 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                      />
                    </td>
                    <td className="border border-slate-200 p-1.5">
                      <select
                        value={record.cycle}
                        onChange={(e) => handleUpdateOrientationRecord(record.id, 'cycle', e.target.value)}
                        className="w-full min-w-36 rounded-md border border-transparent bg-transparent px-2 py-1.5 text-slate-700 outline-none focus:border-cyan-300 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                      >
                        {ORIENTATION_CYCLES.map(cycle => <option key={cycle.name}>{cycle.name}</option>)}
                      </select>
                    </td>
                    <td className="border border-slate-200 p-1.5">
                      <select
                        value={record.course}
                        onChange={(e) => handleUpdateOrientationRecord(record.id, 'course', e.target.value)}
                        className="w-full min-w-40 rounded-md border border-transparent bg-transparent px-2 py-1.5 font-semibold text-slate-700 outline-none focus:border-cyan-300 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                      >
                        {(ORIENTATION_CYCLES.find(cycle => cycle.name === record.cycle)?.courses || currentCycleCourses).map(course => <option key={course}>{course}</option>)}
                      </select>
                    </td>
                    <td className="border border-slate-200 p-1.5">
                      <select
                        value={record.action}
                        onChange={(e) => handleUpdateOrientationRecord(record.id, 'action', e.target.value)}
                        className="w-full min-w-52 rounded-md border border-transparent bg-transparent px-2 py-1.5 text-slate-700 outline-none focus:border-cyan-300 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                      >
                        {ORIENTATION_ACTIONS.map(action => <option key={action}>{action}</option>)}
                      </select>
                    </td>
                    <td className="border border-slate-200 p-1.5">
                      <input
                        value={record.topic}
                        onChange={(e) => handleUpdateOrientationRecord(record.id, 'topic', e.target.value)}
                        className="w-full min-w-36 rounded-md border border-transparent bg-transparent px-2 py-1.5 text-slate-700 outline-none focus:border-cyan-300 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                      />
                    </td>
                    <td className="border border-slate-200 p-1.5">
                      <select
                        value={record.status}
                        onChange={(e) => handleUpdateOrientationRecord(record.id, 'status', e.target.value)}
                        className={`w-full min-w-32 rounded-md border px-2 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-cyan-100 ${getInterventionStatusColor(record.status)}`}
                      >
                        <option>Realizado</option>
                        <option>Pendiente</option>
                        <option>Reprogramado</option>
                      </select>
                    </td>
                    <td className="border border-slate-200 p-1.5">
                      <textarea
                        value={record.observations}
                        onChange={(e) => handleUpdateOrientationRecord(record.id, 'observations', e.target.value)}
                        rows={2}
                        className="w-full min-w-72 resize-y rounded-md border border-transparent bg-transparent px-2 py-1.5 text-slate-700 outline-none focus:border-cyan-300 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                      />
                    </td>
                    <td className="border border-slate-200 p-1.5">
                      <div className="flex min-w-56 items-center gap-2">
                        <input
                          value={record.evidenceLink}
                          onChange={(e) => handleUpdateOrientationRecord(record.id, 'evidenceLink', e.target.value)}
                          placeholder="Link evidencia"
                          className="w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-blue-700 outline-none focus:border-cyan-300 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                        />
                        {record.evidenceLink && (
                          <a href={record.evidenceLink} target="_blank" rel="noreferrer" className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-blue-600 hover:bg-blue-50" title="Abrir evidencia">
                            <LinkIcon className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="border border-slate-200 p-1.5">
                      <div className="flex min-w-56 items-center gap-2">
                        <input
                          value={record.planningLink}
                          onChange={(e) => handleUpdateOrientationRecord(record.id, 'planningLink', e.target.value)}
                          placeholder="Link planificación"
                          className="w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-blue-700 outline-none focus:border-cyan-300 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                        />
                        {record.planningLink && (
                          <a href={record.planningLink} target="_blank" rel="noreferrer" className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-blue-600 hover:bg-blue-50" title="Abrir planificación">
                            <FileText className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="border border-slate-200 px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteOrientationRecord(record.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        aria-label={`Eliminar registro de ${record.course}`}
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-cyan-600" />
            <div>
              <h3 className="font-bold text-slate-800">Dashboard de intervenciones por ciclo</h3>
              <p className="text-xs text-slate-500">Conteo automático por curso y tipo de acción.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[1120px] divide-y divide-slate-100">
              {ORIENTATION_CYCLES.map(cycle => (
                <div key={cycle.name} className="p-5">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-cyan-50 px-3 py-2">
                    <FolderOpen className="w-4 h-4 text-cyan-700" />
                    <span className="text-sm font-bold text-slate-800">{cycle.name}</span>
                    <span className="text-xs text-slate-500">{cycle.description}</span>
                  </div>
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr>
                        <th className="sticky left-0 z-10 bg-slate-50 border border-sky-100 px-3 py-3 text-left font-bold text-slate-700 min-w-44">Curso</th>
                        {ORIENTATION_ACTIONS.map(action => (
                          <th key={action} className="bg-sky-600 border border-sky-200 px-3 py-3 text-center text-xs font-bold text-white min-w-32">
                            {action}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {cycle.courses.map(course => (
                        <tr key={course}>
                          <td className="sticky left-0 z-10 bg-white border border-sky-100 px-3 py-2 font-bold text-slate-700">{course}</td>
                          {ORIENTATION_ACTIONS.map(action => {
                            const count = countRecords(course, action);
                            return (
                              <td
                                key={`${course}-${action}`}
                                className={`border border-sky-100 px-3 py-2 text-center font-semibold ${count > 0 ? 'bg-emerald-100 text-emerald-900' : 'bg-white text-slate-500'}`}
                              >
                                {count}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    );
  };

  const ViewBitacora = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Bitácora Diaria</h2>
          <p className="text-sm text-slate-500">Registra y haz seguimiento de tus actividades diarias.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Nuevo Registro
        </button>
      </div>

      <div className="space-y-4">
        {bitacora.map(note => (
          <div key={note.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${getNoteTypeColor(note.type).replace('text-', 'bg-').replace('50', '100').split(' ')[0]}`}>
                {getNoteTypeIcon(note.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {new Date(note.date).toLocaleDateString('es-CL', { weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${getNoteTypeColor(note.type)}`}>
                    {note.type}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800">{note.title}</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{note.content}</p>
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  {note.tags.map(tag => (
                    <span key={tag} className="text-[11px] font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ViewReuniones = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Reuniones y Talleres</h2>
          <p className="text-sm text-slate-500">Gestión de entrevistas con apoderados y actividades grupales.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-semibold text-sm transition-all">
          <Calendar className="w-4 h-4" /> Agendar
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {REUNIONES.map(reunion => (
            <div key={reunion.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                  <UsersRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{reunion.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(reunion.date).toLocaleString('es-CL')}</span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded-md font-medium">{reunion.type}</span>
                  </div>
                </div>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                reunion.status === 'Programado' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {reunion.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ViewArchivos = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Repositorio Institucional</h2>
            <p className="text-sm text-slate-500">Enlaces directos a carpetas y documentos en Google Drive.</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-xl font-semibold text-sm transition-colors">
            <ExternalLink className="w-4 h-4" />
            Abrir Drive
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DRIVE_FOLDERS.map(item => (
            <a 
              key={item.id}
              href={item.link} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
            >
              <div className={`p-3 rounded-xl ${item.type === 'folder' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                {item.type === 'folder' ? <FolderOpen className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
              </div>
              <div className="overflow-hidden">
                <h3 className="font-semibold text-slate-800 truncate group-hover:text-blue-700 transition-colors">{item.name}</h3>
                <p className="text-xs text-slate-500">{item.shared ? 'Compartido con el equipo' : 'Privado'}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* SIDEBAR */}
      <aside className="hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center shadow-inner overflow-hidden relative">
              <span className="text-white font-bold text-lg absolute z-0">SL</span>
              <img 
                src="/logo-san-lucas.png" 
                alt="Logo Colegio San Lucas de Lo Espejo" 
                className="w-full h-full object-cover relative z-10 p-1"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-800 leading-tight">Colegio San Lucas</h1>
              <p className="text-xs font-medium text-slate-500">Lo Espejo</p>
            </div>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <p className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Módulos</p>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    if (item.id !== 'cursos') {
                      setSelectedCourse(null);
                      setSelectedStudent(null);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-cyan-50 text-cyan-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-cyan-600' : 'text-slate-400'}`} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-cyan-200 flex items-center justify-center flex-shrink-0">
              <span className="text-cyan-800 font-bold text-xs">GC</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate">Gustavo Caro</p>
              <p className="text-xs text-slate-500 truncate">Orientador</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* HEADER */}
        <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
          <div className="px-4 md:px-6 py-3 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center shadow-inner overflow-hidden relative shrink-0">
                  <span className="text-white font-bold text-lg absolute z-0">SL</span>
                  <img
                    src="/logo-san-lucas.png"
                    alt="Logo Colegio San Lucas de Lo Espejo"
                    className="w-full h-full object-cover relative z-10 p-1"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <div className="min-w-0">
                  <h1 className="font-bold text-lg text-slate-800 leading-tight truncate">Colegio San Lucas de Lo Espejo</h1>
                  <p className="text-xs font-medium text-slate-500 truncate">{navigation.find(n => n.id === currentView)?.name || currentView}</p>
                </div>
              </div>
              <button className="relative p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors xl:hidden">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_auto] xl:items-center">
              <select
                value={currentView}
                onChange={(e) => {
                  setCurrentView(e.target.value);
                  if (e.target.value !== 'cursos') {
                    setSelectedCourse(null);
                    setSelectedStudent(null);
                  }
                }}
                className="lg:hidden w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {navigation.map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>

            <nav className="hidden lg:grid grid-cols-6 gap-2">
              {navigation.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      if (item.id !== 'cursos') {
                        setSelectedCourse(null);
                        setSelectedStudent(null);
                      }
                    }}
                    className={`min-w-0 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/20'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </button>
                );
              })}
            </nav>

            <div className="hidden xl:flex items-center gap-3">
              <div className="hidden 2xl:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Software por</span>
                <img src="/tiza-education-logo.svg" alt="Logo Tiza Education" className="h-7 w-auto" />
              </div>
              <button className="relative p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="hidden sm:flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm shadow-cyan-600/20 transition-all hover:shadow-md hover:shadow-cyan-600/30 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Registro
              </button>
            </div>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className={`${currentView === 'orientacion' ? 'max-w-none' : 'max-w-5xl'} mx-auto`}>
            {currentView === 'inicio' && ViewInicio()}
            {currentView === 'bitacora' && ViewBitacora()}
            {currentView === 'cursos' && ViewCursos()}
            {currentView === 'orientacion' && ViewOrientacion()}
            {currentView === 'reuniones' && ViewReuniones()}
            {currentView === 'archivos' && ViewArchivos()}
          </div>
        </div>
      </main>

      {/* MODAL BITÁCORA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">Nuevo Registro de Bitácora</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveBitacora} className="p-6 overflow-y-auto flex-1">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Título / Actividad</label>
                  <input 
                    type="text" 
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    placeholder="Ej: Reunión con profesora jefe 1° Medio A..."
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Tipo de Registro</label>
                    <select 
                      value={newNoteType}
                      onChange={(e) => setNewNoteType(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-sm cursor-pointer"
                    >
                      <option>Registro</option>
                      <option>Incidencia</option>
                      <option>Acuerdo</option>
                      <option>Seguimiento</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Etiquetas (separadas por coma)</label>
                    <input 
                      type="text" 
                      value={newNoteTags}
                      onChange={(e) => setNewNoteTags(e.target.value)}
                      placeholder="Ej: Orientación, 1° Medio A"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Detalle</label>
                  <textarea 
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Describe los detalles de la actividad, acuerdos, etc..."
                    rows={5}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-sm resize-none"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl shadow-sm shadow-cyan-600/20 transition-all hover:shadow-md hover:shadow-cyan-600/30"
                >
                  Guardar en Bitácora
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
