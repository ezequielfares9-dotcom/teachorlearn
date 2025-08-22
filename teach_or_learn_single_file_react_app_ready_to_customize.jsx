import React, { useMemo, useState, useEffect } from "react";

// Single‑file React component for "TeachOrLearn"
// ‑ Clean Tailwind UI
// ‑ Role switch (Teacher / Student)
// ‑ Resource cards with instant downloads (generated on the fly)
// ‑ Simple image galleries (Unsplash placeholders you can replace)
// ‑ Mobile‑first, responsive, accessible

// ---------- Helper: download inline files without a backend ----------
function downloadTextFile(filename, content, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---------- Sample content generators (you can edit/expand) ----------
const filesForTeachers = [
  {
    title: "Lesson Plan Template (K‑12)",
    filename: "lesson-plan-template.md",
    description:
      "Plantilla clara y flexible para planificar clases con objetivos, materiales, procedimientos y evaluación.",
    preview:
      "https://images.unsplash.com/photo-1523246192284-188ceb1c3425?q=80&w=1200&auto=format&fit=crop",
    tags: ["Planificación", "Evaluación", "EGB/BGU"],
    content: `# Lesson Plan Template (K‑12)

**Teacher:** 
**Subject:** 
**Grade:** 
**Date:** 

## Objectives (SMART)
- 
- 

## Materials
- 

## Procedure (Stages)
1) Warm‑up (5')
2) Presentation (10')
3) Guided Practice (15')
4) Independent Practice (15')
5) Wrap‑up (5')

## Assessment
- Formative checks
- Exit ticket

## Differentiation
- Support (SEN)
- Fast‑finishers

## Reflection
- What worked?
- Improvements
`,
  },
  {
    title: "Rubric: Speaking (A1‑B1)",
    filename: "rubric-speaking-a1-b1.md",
    description:
      "Rúbrica simple para evaluar producción oral: fluidez, precisión, pronunciación e interacción.",
    preview:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop",
    tags: ["Rúbrica", "Inglés", "Oral"],
    content: `# Speaking Rubric (A1‑B1)

| Criteria | 4 | 3 | 2 | 1 |
|---|---|---|---|---|
| Fluency | Smooth, natural | Minor pauses | Frequent pauses | Halting |
| Accuracy | Few errors | Some errors | Many errors | Constant errors |
| Pronunciation | Clear | Mostly clear | Interferes sometimes | Hard to understand |
| Interaction | Initiates, responds | Responds well | Minimal response | Rarely interacts |

**Score:** /16  →  **Level:**  
`,
  },
  {
    title: "Worksheet: Reading + Vocabulary",
    filename: "worksheet-reading-vocabulary.md",
    description:
      "Hoja de trabajo con texto corto, vocabulario clave y preguntas de comprensión.",
    preview:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop",
    tags: ["Worksheet", "Lectura", "Vocabulario"],
    content: `# Reading & Vocabulary Worksheet

**Topic:** Daily Routines  
**Level:** A2

### Text
Maria wakes up at 6:30. She makes coffee and checks her messages... 

### Vocabulary
- wake up
- make coffee
- check messages

### Comprehension
1) What time does Maria wake up?  
2) What does she drink?  
3) What does *check* mean?  
`,
  },
  {
    title: "Syllabus: English I (16 weeks)",
    filename: "syllabus-english-I.md",
    description:
      "Programa base de asignatura con objetivos, calendarización, evaluación y políticas.",
    preview:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
    tags: ["Sílabo", "Universidad", "Inglés"],
    content: `# English I – Syllabus (16 Weeks)

**Instructor:**  | **Email:**  | **Office Hours:**  

## Course Description
Functional English for beginners focusing on communication.

## Assessment
- Participation 10%
- Quizzes 20%
- Projects 30%
- Midterm 20%
- Final 20%

## Weekly Outline
W1: Introductions, be  
W2: Family, have  
...  
W16: Final Exam  
`,
  },
];

const filesForStudents = [
  {
    title: "Study Planner (30 días)",
    filename: "study-planner-30dias.md",
    description:
      "Agenda imprimible para organizar objetivos, hábitos y estudio diario.",
    preview:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    tags: ["Productividad", "Hábitos", "Plan"],
    content: `# Study Planner – 30 Days

**Goal:**  
**Why it matters:**  

| Day | Focus | Done |
|---|---|---|
| 1 | | ☐ |
| 2 | | ☐ |
| 3 | | ☐ |
...
| 30 | | ☐ |
`,
  },
  {
    title: "Flashcards – 100 palabras básicas",
    filename: "flashcards-100-basic.md",
    description:
      "Lista de 100 palabras de alta frecuencia lista para Anki/quiz.",
    preview:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
    tags: ["Memoria", "Vocabulario", "Anki"],
    content: `# 100 Basic Words (EN‑ES)
I = yo
you = tú/usted
he = él
she = ella
it = eso
we = nosotros
...
`,
  },
  {
    title: "Checklist: Pronunciación en inglés",
    filename: "checklist-pronunciation.md",
    description:
      "Lista de verificación para practicar sonidos clave, acentuación y ritmo.",
    preview:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200&auto=format&fit=crop",
    tags: ["Pronunciación", "Speaking"],
    content: `# Pronunciation Checklist
- Th (think / this)
- Vowel length (ship vs sheep)
- Word stress (PHOtograph vs phoTOGraphy)
- Sentence stress & rhythm
- Connected speech (gonna, wanna)
`,
  },
  {
    title: "Template: Cornell Notes",
    filename: "template-cornell-notes.md",
    description:
      "Plantilla de apuntes Cornell para mejorar comprensión y memoria.",
    preview:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    tags: ["Técnicas de estudio", "Apuntes"],
    content: `# Cornell Notes – Template

**Course / Topic:**  
**Date:**  

| Cues | Notes |
|---|---|
| | |

**Summary:**  
`,
  },
];

// Combine + tag search
function useFilteredResources(role, query, tag) {
  const source = role === "teacher" ? filesForTeachers : filesForStudents;
  return useMemo(() => {
    const q = (query || "").toLowerCase();
    return source.filter((r) => {
      const inTags = tag ? r.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase()) : true;
      const inText = [r.title, r.description, ...(r.tags || [])]
        .join(" ")
        .toLowerCase()
        .includes(q);
      return inTags && inText;
    });
  }, [role, query, tag]);
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium text-gray-600 border-gray-200 bg-white/70 backdrop-blur">
      {children}
    </span>
  );
}

function Card({ item, onDownload }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-xl">
      <img
        src={item.preview}
        alt="preview"
        className="h-40 w-full object-cover transition duration-300 group-hover:scale-105"
      />
      <div className="p-4 space-y-3">
        <h3 className="text-base font-semibold leading-tight">{item.title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
        <div className="flex flex-wrap gap-2">
          {item.tags?.map((t, i) => (
            <Badge key={i}>{t}</Badge>
          ))}
        </div>
        <div className="pt-2">
          <button
            onClick={() => onDownload(item)}
            className="w-full rounded-xl bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Descargar
          </button>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
    </div>
  );
}

function Header({ role, setRole }) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-indigo-600 text-white grid place-items-center font-black">T</div>
          <div>
            <p className="text-sm text-gray-500 leading-none">Bienvenido a</p>
            <h1 className="text-lg font-bold leading-none">Teach<span className="text-indigo-600">Or</span>Learn</h1>
          </div>
        </div>
        <nav className="flex items-center gap-2">
          <button
            onClick={() => setRole("teacher")}
            className={`rounded-full px-4 py-2 text-sm font-semibold border transition ${
              role === "teacher"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
            }`}
            aria-pressed={role === "teacher"}
          >
            Soy profesor/a
          </button>
          <button
            onClick={() => setRole("student")}
            className={`rounded-full px-4 py-2 text-sm font-semibold border transition ${
              role === "student"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
            }`}
            aria-pressed={role === "student"}
          >
            Soy estudiante
          </button>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <span className="inline-block rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            Nueva plataforma educativa
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Enseña o aprende con <span className="text-indigo-600">claridad</span> y
            <span className="text-indigo-600"> estilo</span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            TeachOrLearn reúne plantillas, guías y recursos prácticos para profesores y estudiantes.
            Todo en una interfaz simple, bonita y rápida.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#explore" className="rounded-xl bg-indigo-600 text-white px-5 py-3 text-sm font-semibold hover:bg-indigo-700">
              Explorar recursos
            </a>
            <a href="#how" className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:border-gray-300">
              ¿Cómo funciona?
            </a>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <img src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=400&auto=format&fit=crop" alt="class" className="h-12 w-12 rounded-xl object-cover" />
            <p className="text-sm text-gray-500">
              +500 descargas de plantillas en el primer mes — docentes y estudiantes felices ✨
            </p>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1400&auto=format&fit=crop"
            alt="hero"
            className="rounded-3xl shadow-xl border border-gray-200"
          />
          <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-64">
            <p className="text-xs font-semibold text-gray-700">Descarga inmediata</p>
            <p className="text-xs text-gray-500">Plantillas en .md / .txt listas para imprimir o editar.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      title: "Elige tu rol",
      desc: "Profesor o estudiante: verás recursos adaptados a tus necesidades.",
    },
    {
      title: "Busca y filtra",
      desc: "Usa la barra de búsqueda y etiquetas para encontrar justo lo que quieres.",
    },
    {
      title: "Descarga y usa",
      desc: "Clic en descargar y listo. Sin registro, sin complicaciones.",
    },
  ];
  return (
    <section id="how" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h3 className="text-2xl md:text-3xl font-bold mb-6">¿Cómo funciona?</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold">
              {i + 1}
            </div>
            <h4 className="font-semibold mb-1">{s.title}</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [role, setRole] = useState("teacher");
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");
  const data = useFilteredResources(role, query, tag);

  useEffect(() => {
    // Reset tag on role change
    setTag("");
  }, [role]);

  const allTags = useMemo(() => {
    const items = role === "teacher" ? filesForTeachers : filesForStudents;
    const t = new Set();
    items.forEach((r) => r.tags?.forEach((x) => t.add(x)));
    return Array.from(t);
  }, [role]);

  const handleDownload = (item) => {
    downloadTextFile(item.filename, item.content);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50/40 text-gray-900">
      <Header role={role} setRole={setRole} />
      <Hero />
      <HowItWorks />

      <section id="explore" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold">Recursos para {role === "teacher" ? "profesores" : "estudiantes"}</h3>
            <p className="text-gray-600 text-sm">Descargas rápidas, listas para imprimir o editar.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar recursos, p. ej. rúbrica, lectura..."
              className="w-full sm:w-80 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full sm:w-56 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Todas las etiquetas</option>
              {allTags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {data.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-600">
            No hay resultados. Prueba con otra búsqueda o etiqueta.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item) => (
              <Card key={item.filename} item={item} onDownload={handleDownload} />)
            )}
          </div>
        )}
      </section>

      <footer className="border-t border-gray-100 bg-white/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} TeachOrLearn. Hecho con ♥ en Ecuador.</p>
            <p className="text-xs text-gray-400">Reemplaza imágenes, textos y agrega más recursos en el código.</p>
          </div>
          <div className="flex md:justify-end gap-3">
            <a href="#" className="text-sm rounded-xl border border-gray-200 px-4 py-2.5 hover:bg-gray-50">Términos</a>
            <a href="#" className="text-sm rounded-xl border border-gray-200 px-4 py-2.5 hover:bg-gray-50">Privacidad</a>
            <a href="#" className="text-sm rounded-xl border border-gray-200 px-4 py-2.5 hover:bg-gray-50">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
