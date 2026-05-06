"use client";

import React, { useState } from 'react';
import { 
  Home, 
  BookOpen, 
  Users, 
  UsersRound, 
  Calendar, 
  Lightbulb, 
  Plus, 
  X, 
  Search, 
  Bell, 
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  FileText,
  MessageSquare,
  FolderOpen,
  Cloud,
  ExternalLink,
  GraduationCap,
  ClipboardList,
  User,
  ChevronRight,
  ArrowLeft
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

const COURSES = [
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

export default function ColegioDashboard() {
  const [currentView, setCurrentView] = useState('inicio');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for data
  const [bitacora, setBitacora] = useState(INITIAL_BITACORA);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Modal Form State
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteType, setNewNoteType] = useState('Registro');
  const [newNoteTags, setNewNoteTags] = useState('');

  const navigation = [
    { id: 'inicio', name: 'Dashboard Principal', icon: Home },
    { id: 'cursos', name: 'Cursos & Estudiantes', icon: GraduationCap },
    { id: 'bitacora', name: 'Mi Bitácora Diaria', icon: BookOpen },
    { id: 'reuniones', name: 'Reuniones & Talleres', icon: UsersRound },
    { id: 'archivos', name: 'Archivos & Drive', icon: Cloud },
  ];

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

  // --- VISTAS ---

  const ViewInicio = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Valores Institucionales */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Valores Institucionales</h2>
          <p className="text-sm text-slate-600 mb-4">
            Plataforma integral de gestión escolar de Tiza Education. Nuestro sistema centraliza la información de los estudiantes para una toma de decisiones más efectiva.
          </p>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <img 
            src="/emblema-valores.png" 
            alt="Valores Colegio San Lucas" 
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
    if (selectedStudent) {
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
                {selectedCourse.students?.map((student: any) => (
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden md:flex flex-col h-screen sticky top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center shadow-inner overflow-hidden relative">
              <span className="text-white font-bold text-lg absolute z-0">SL</span>
              <img 
                src="/logo-san-lucas.png" 
                alt="Logo Tiza Education" 
                className="w-full h-full object-cover relative z-10 p-1"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-800 leading-tight">Tiza Education</h1>
              <p className="text-xs font-medium text-slate-500">Colegio San Lucas (Demo)</p>
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
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-slate-800 capitalize tracking-tight">
              {navigation.find(n => n.id === currentView)?.name || currentView}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm shadow-cyan-600/20 transition-all hover:shadow-md hover:shadow-cyan-600/30 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Registro en Bitácora
            </button>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-5xl mx-auto">
            {currentView === 'inicio' && <ViewInicio />}
            {currentView === 'bitacora' && <ViewBitacora />}
            {currentView === 'cursos' && <ViewCursos />}
            {currentView === 'reuniones' && <ViewReuniones />}
            {currentView === 'archivos' && <ViewArchivos />}
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
