/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useSpring, AnimatePresence } from "motion/react";
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Code2, 
  Database, 
  Server, 
  Cpu, 
  Briefcase, 
  GraduationCap, 
  ChevronRight,
  Terminal,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  Facebook,
  Instagram,
  User,
  X,
  Loader2,
  Lock,
  Send
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// --- Firebase Init ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Error Handling helper
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- Types ---
interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string[];
}

interface Education {
  school: string;
  degree: string;
  period: string;
  location?: string;
}

// --- Data ---
const experiences: Experience[] = [
  {
    company: "Tech Mahindra",
    role: "Software Engineer",
    period: "October 2024 - Present",
    location: "Noida, India",
    description: [
      "Specializing in enterprise-scale software solutions using Spring Boot and Java.",
      "Collaborating with cross-functional teams to deliver high-quality, scalable code.",
      "Optimizing database performance and system architecture."
    ]
  },
  {
    company: "VEST, Inc.",
    role: "Software Engineer",
    period: "October 2023 - September 2024",
    location: "Noida, India",
    description: [
      "Focused on backend development and system integration.",
      "Customized software for live projects meeting specific client needs.",
      "Improved deployment pipelines and code reliability."
    ]
  },
  {
    company: "Odessa",
    role: "Software Engineer",
    period: "September 2022 - October 2023",
    location: "Bengaluru, India",
    description: [
      "Worked on core product features and modular enhancements.",
      "Developed complex business logic and integrated 3rd party APIs.",
      "Mentored junior engineers and participated in code reviews."
    ]
  },
  {
    company: "Odessa",
    role: "Associate Software Engineer",
    period: "September 2021 - September 2022",
    location: "Bengaluru, India",
    description: [
      "Contributed to front-end and back-end bug fixes and feature requests.",
      "Assisted in migrating legacy components to modern frameworks.",
      "Documented technical specifications and user guides."
    ]
  }
];

const education: Education[] = [
  {
    school: "GL Bajaj Institute of Technology and Management",
    degree: "Bachelor of Technology - BTech, Information Technology",
    period: "2018 - 2022",
  },
  {
    school: "Sant atulanand residential academy",
    degree: "Class 12, PCM",
    period: "2015 - 2017",
  },
  {
    school: "Shah Faiz public school",
    degree: "School Study",
    period: "2003 - 2015",
  }
];

const skills = [
  { category: "Languages", items: ["C#", "Java", "SQL", "VB.NET", "JavaScript"], icon: <Server className="w-5 h-5 text-zinc-400" /> },
  { category: "Frameworks & Platforms", items: [".NET Core", "ASP.NET Core", ".NET Core MVC", "Entity Framework"], icon: <Server className="w-5 h-5 text-zinc-400" /> },
  { category: "APIs & Services", items: ["REST Web API", "LINQ", "SQL Server", "Ranorex", "Jenkins"], icon: <Database className="w-5 h-5 text-zinc-400" /> },
  { category: "Architecture & Principles", items: ["SOLID Principles", "System Design", "MVC Pattern", "Clean Architecture"], icon: <Terminal className="w-5 h-5 text-zinc-400" /> },
  { category: "Tools & Practices", items: ["CI/CD", "Debugging", "Git", "Agile/Scrum"], icon: <Cpu className="w-5 h-5 text-zinc-400" /> },
  { category: "Currently Learning", items: ["System Design", "Microservices", "Azure", "Angular"], icon: <Cpu className="w-5 h-5 text-zinc-400" /> }
];

const projects = [
  {
    title: "Restaurant Management System",
    description: "A web platform to support access to food, medicine, and essential goods. Built as a minor project covering end-to-end ordering and management flows.",
    tags: ["Web", ".NET"],
    icon: "🍴"
  },
  {
    title: "V-Care",
    description: "Major project — an Android application for table booking and pre-ordering food. Provides a seamless digital dining experience from seat reservation to order placement.",
    tags: ["Android", "Mobile"],
    icon: "📱",
    featured: true
  },
  {
    title: "Student Adda",
    description: "An online student portal enabling notes sharing, peer collaboration, and alumni interaction. Designed to bridge the gap between students and alumni communities.",
    tags: ["Web", "Community"],
    icon: "🎓"
  }
];

const recognitions = [
  {
    title: "TI India Innovation Quarterfinalist",
    description: "Reached the quarterfinals of the prestigious Texas Instruments India Innovation Challenge Design Contest during college.",
    icon: "🏆"
  },
  {
    title: "Best Innovative Ideas Award",
    description: "Awarded for outstanding innovative thinking and project execution in the academic setting.",
    icon: "💡"
  },
  {
    title: "Secretary, Rotaract Club Delhi Tempus",
    description: "Served as Secretary and led Project Saahas — a social initiative under the Rotaract umbrella focused on community impact.",
    icon: "🤝"
  }
];

const hobbies = [
  { name: "Gyming", icon: "🏋️" },
  { name: "Innovation", icon: "💡" },
  { name: "Social Work", icon: "🤝" },
  { name: "Tech Exploration", icon: "💻" },
  { name: "Learning", icon: "📚" }
];

// --- Components ---

const Navbar = ({ onOpenHireMe }: { onOpenHireMe: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${isScrolled ? "glass py-5 shadow-2xl border-b border-white/[0.05]" : "bg-transparent py-8"}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-display font-bold tracking-tighter"
        >
          AMAN<span className="text-red-500">.</span>
        </motion.div>
        
        <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
          {["About", "Experience", "Skills", "Projects", "Contact"].map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              whileHover={{ color: "#fb7185", y: -2 }}
              className="hover:text-red-400 transition-all font-bold"
            >
              {item}
            </motion.a>
          ))}
        </div>
        
        <motion.button
          onClick={onOpenHireMe}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2.5 rounded-xl glass border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-black hover:border-red-500 transition-all"
        >
          Work with me
        </motion.button>
      </div>
    </nav>
  );
};

const HireMeModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await addDoc(collection(db, 'inquiries'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'inquiries');
      setError("Failed to send inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg glass border-zinc-800 rounded-[2rem] p-8 overflow-hidden shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-3xl font-display font-bold mb-2">Let's Collaborate</h2>
            <p className="text-zinc-400 mb-8 font-light italic">Tell me about your project and I'll get back to you within 24 hours.</p>
            
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-12 text-center"
              >
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Inquiry Sent!</h3>
                <p className="text-zinc-400 font-light">Thank you for reaching out. I'll be in touch soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Name</label>
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-5 py-4 focus:border-zinc-500 outline-none transition-colors"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Email</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-5 py-4 focus:border-zinc-500 outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Message</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-5 py-4 focus:border-zinc-500 outline-none transition-colors resize-none"
                    placeholder="Tell me about your goals..."
                  />
                </div>
                {error && <p className="text-red-500 text-sm italic">{error}</p>}
                <button 
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-zinc-100 text-zinc-950 font-bold hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const SectionHeading = ({ children, icon, color = "red" }: { children: React.ReactNode, icon?: React.ReactNode, color?: "red" | "zinc" }) => (
  <div className="flex items-center gap-3 mb-12">
    {icon && <div className={`p-2 rounded-xl glass ${color === 'red' ? 'text-red-400 border-red-500/20' : 'text-zinc-400 border-zinc-800'}`}>{icon}</div>}
    <h2 className={`text-3xl md:text-5xl font-display font-bold uppercase tracking-tight ${color === 'red' ? 'text-red-gradient' : 'text-zinc-100'}`}>{children}</h2>
  </div>
);

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [isHireMeOpen, setIsHireMeOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const isAdmin = currentUser?.email === 'amansrivastava1995gzp@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    
    // Connection test
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setInquiries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'inquiries');
      });
      return () => unsubscribe();
    }
  }, [isAdmin]);

  const handleAdminSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Auth error", error);
    }
  };

  return (
    <div className="relative selection:bg-red-500 selection:text-black">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-red-400 z-[100] origin-left" style={{ scaleX }} />
      <Navbar onOpenHireMe={() => setIsHireMeOpen(true)} />
      <HireMeModal isOpen={isHireMeOpen} onClose={() => setIsHireMeOpen(false)} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-zinc-950 to-black z-[-1]" />
        <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-red-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-red-500/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-20 items-center z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border-red-500/20 text-xs font-bold text-red-400 mb-8 uppercase tracking-[0.2em]">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              Available for new opportunity
            </div>
            
            <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight mb-8 leading-[0.9]">
              Hi, I'm <br />
              <span className="text-red-gradient">Aman Srivastava</span>
            </h1>
            
            <p className="max-w-xl text-lg md:text-2xl text-zinc-400 mb-12 font-light leading-relaxed">
              Software Engineer specializing in <span className="text-zinc-100 font-medium">Full-Stack Development</span>. I build high-performance, scalable ecosystems for the modern web.
            </p>

            <div className="flex flex-wrap gap-6">
              <motion.button
                onClick={() => setIsHireMeOpen(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-red-500 text-black font-black hover:bg-red-400 transition-all shadow-[0_20px_50px_rgba(244,63,94,0.3)] group"
              >
                Let's Talk
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-10 py-5 rounded-2xl glass border-zinc-700 text-white font-bold hover:bg-zinc-800 transition-all shadow-xl"
              >
                View Work
              </motion.a>
            </div>

            <div className="mt-20 flex gap-8">
              {[
                { label: "Experience", value: "3+ Years" },
                { label: "Projects", value: "10+" },
                { label: "Location", value: "Gurugram, IN" }
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-red-400 text-2xl font-bold font-display">{stat.value}</p>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-80 h-80 md:w-[450px] md:h-[450px]">
              {/* Outer Rings */}
              <div className="absolute inset-0 border-2 border-red-500/10 rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="absolute -inset-10 border border-red-500/5 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
              
              {/* Profile Image Wrapper */}
              <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-red-500 bg-zinc-900 shadow-[0_0_80px_rgba(244,63,94,0.2)] group overflow-hidden">
                <img 
                  src="https://lh3.googleusercontent.com/u/0/d/1qhaTPP_Fe2BEdsrcUetbFUA0lc3xMfrN=w1000" 
                  alt="Aman Srivastava"
                  className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-red-gradient mix-blend-overlay opacity-20" />
              </div>
              
              {/* Floating Icons */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 p-4 rounded-2xl glass border-red-500/30 text-red-400 shadow-xl"
              >
                <Code2 className="w-8 h-8" />
              </motion.div>
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute bottom-10 -left-10 p-4 rounded-2xl glass border-red-500/30 text-red-400 shadow-xl"
              >
                <Database className="w-8 h-8" />
              </motion.div>
            </div>
            
            <div className="absolute -bottom-10 right-20 flex flex-col items-center gap-2 animate-bounce">
              <MapPin className="w-5 h-5 text-red-500" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Gurugram, India</span>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-32 space-y-64">
        
        {/* About Section */}
        <section id="about" className="relative">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <SectionHeading color="red">Who Am I </SectionHeading>
              <div className="space-y-8 text-xl text-zinc-400 leading-relaxed font-light">
                <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-red-500 first-letter:mr-3 first-letter:float-left">
                 Hey! I'm Aman Srivastava, a Software Engineer based in India with 3.5+ years of hands-on experience crafting scalable backend systems and enterprise-grade applications. I thrive at the intersection of clean code, performance optimization, and real-world problem solving.
                </p>
                <p>
				My journey in tech started at Odessa Technologies where I sharpened my skills in C#, MVC, and Entity Framework. Since then, I've worked at Virtual Engineering Services and currently at Tech Mahindra, each role expanding my expertise in ASP.NET Core, REST APIs, and CI/CD pipelines.
                </p>
				<p>
				I care deeply about writing maintainable, well-architected code and collaborating across teams to build products that actually work. Beyond coding, I'm actively involved in social work through the Rotaract Club and love the discipline that Gyming brings into my daily routine.
				</p>
				
                <div className="flex gap-4">
                  <div className="p-4 rounded-2xl glass border-red-500/20 flex-1">
                    <p className="text-red-400 font-bold mb-1">Growth</p>
                    <p className="text-xs text-zinc-500">Continuous learning is my baseline.</p>
                  </div>
                  <div className="p-4 rounded-2xl glass border-red-500/20 flex-1">
                    <p className="text-red-400 font-bold mb-1">Impact</p>
                    <p className="text-xs text-zinc-500">Building tools that matter.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 group relative">
              <div className="absolute -inset-4 bg-red-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden glass border-red-500/20 group-hover:border-red-500/50 transition-all duration-500 p-3">
                <img 
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800" 
                  alt="Tech workspace"
                  className="w-full h-full rounded-[2.2rem] object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience">
          <SectionHeading icon={<Briefcase className="w-5 h-5" />} color="red">Professional Journey</SectionHeading>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group glass p-10 rounded-[3.5rem] border-zinc-800 hover:border-red-500/30 transition-all duration-500 grid md:grid-cols-4 gap-10"
              >
                <div className="md:col-span-1">
                  <span className="text-red-500 text-sm font-bold font-mono tracking-widest block mb-2">{exp.period}</span>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em]">{exp.location}</p>
                </div>
                <div className="md:col-span-3">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-3xl font-display font-bold text-zinc-100 group-hover:text-red-400 transition-colors uppercase tracking-tight">{exp.role}</h3>
                      <p className="text-zinc-500 text-lg font-light italic">{exp.company}</p>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {exp.description.map((bullet, idx) => (
                      <li key={idx} className="flex gap-4 text-zinc-300 leading-relaxed font-light">
                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_10px_rgba(225,29,72,0.5)] flex-shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills">
          <div className="text-center mb-20">
            <SectionHeading icon={<Code2 className="w-5 h-5" />} color="red">Tech Stack</SectionHeading>
            <p className="text-zinc-500 max-w-2xl mx-auto font-light italic text-xl">
              Technologies and tools I work with professionally to build, test, and deploy applications.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -10 }}
                className="relative group p-12 rounded-[3.5rem] glass border-zinc-800 hover:border-red-500/30 transition-all duration-500"
              >
                <div className="p-4 rounded-2xl glass border-red-500/10 text-red-500 w-fit mb-10 group-hover:bg-red-500 group-hover:text-black transition-all duration-500">
                  {skill.icon}
                </div>
                <h3 className="text-2xl font-display font-bold mb-8 text-zinc-100 uppercase tracking-tight">{skill.category}</h3>
                <div className="flex flex-wrap gap-3">
                  {skill.items.map((item, id) => (
                    <span 
                      key={id} 
                      className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 group-hover:border-red-500/50 group-hover:text-red-400 transition-all duration-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <SectionHeading icon={<Layers className="w-5 h-5" />} color="red">Personal Portfolio</SectionHeading>
            <p className="text-zinc-500 max-w-md font-light italic text-right text-lg">
              Experimental platforms built to solve real-world problems and explore the boundaries of code.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -15 }}
                className={`relative p-10 rounded-[4rem] glass border-zinc-800 transition-all duration-500 group overflow-hidden ${project.featured ? "border-red-500/30 bg-red-500/[0.02]" : ""}`}
              >
                {project.featured && (
                  <div className="absolute top-10 right-10 px-4 py-1.5 rounded-full bg-red-500 text-black text-[10px] font-black uppercase tracking-[0.2em]">
                    Featured
                  </div>
                )}
                <div className="text-5xl mb-12 group-hover:scale-125 group-hover:rotate-6 transition-transform duration-700 w-fit p-6 rounded-3xl glass border-zinc-800">{project.icon}</div>
                <h3 className="text-3xl font-display font-bold mb-6 text-zinc-100">{project.title}</h3>
                <p className="text-zinc-400 leading-relaxed font-light mb-12 italic text-lg opacity-80 group-hover:opacity-100">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-4 pt-8 border-t border-zinc-900">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-black font-mono text-red-500 uppercase tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recognition Section */}
        <section id="recognition">
          <SectionHeading icon={<Sparkles className="w-5 h-5" />} color="red">Honors & Impact</SectionHeading>
          <div className="grid md:grid-cols-3 gap-10">
            {recognitions.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-12 rounded-[4rem] glass border-zinc-800 text-center hover:bg-red-500/[0.03] transition-all duration-500 group"
              >
                <div className="text-6xl mb-10 group-hover:rotate-12 transition-transform duration-500">{item.icon}</div>
                <h3 className="text-2xl font-display font-bold mb-6 leading-tight uppercase tracking-tight">{item.title}</h3>
                <p className="text-zinc-500 leading-relaxed font-light italic">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Hobbies & Education */}
        <div className="grid lg:grid-cols-2 gap-32">
          {/* Hobbies */}
          <section id="hobbies">
            <SectionHeading icon={<MapPin className="w-5 h-5" />} color="red">Inner World</SectionHeading>
            <div className="flex flex-wrap gap-4 mb-20">
              {hobbies.map((hobby, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="px-10 py-5 rounded-[2rem] glass border-zinc-800 text-zinc-100 flex items-center gap-4 hover:bg-red-500 hover:text-black hover:border-red-500 transition-all font-black group cursor-default"
                >
                  <span className="text-3xl group-hover:scale-125 transition-transform">{hobby.icon}</span>
                  <span className="uppercase text-xs tracking-[0.2em]">{hobby.name}</span>
                </motion.div>
              ))}
            </div>
            
            {/* Visual Flair */}
            <div className="relative rounded-[3.5rem] overflow-hidden glass border-zinc-800 p-3 h-80 group">
              <img 
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800" 
                alt="Workspace"
                className="w-full h-full object-cover rounded-[2.5rem] grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
              />
              <div className="absolute inset-0 flex items-center justify-center p-12 text-center pointer-events-none">
                <p className="text-red-500 font-display font-bold text-2xl tracking-[0.5em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-1000">Build. Iterate. Innovate.</p>
              </div>
            </div>
          </section>

          {/* Education */}
          <section id="education">
            <SectionHeading icon={<GraduationCap className="w-5 h-5" />} color="red">Foundations</SectionHeading>
            <div className="space-y-8">
              {education.map((edu, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-10 rounded-[3rem] glass border-zinc-800 hover:border-red-500/20 transition-all flex items-start gap-8 group"
                >
                  <div className="w-16 h-16 rounded-2xl glass border-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500 group-hover:text-black transition-all">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-red-500 uppercase tracking-[0.3em] mb-2 block">{edu.period}</span>
                    <h3 className="text-2xl font-display font-bold mb-3 leading-tight group-hover:text-red-400 transition-colors uppercase tracking-tight">{edu.school}</h3>
                    <p className="text-zinc-500 font-light italic">{edu.degree}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Contact Section */}
        <section id="contact">
          <div className="glass rounded-[5rem] p-16 md:p-32 overflow-hidden border-zinc-800 transition-all hover:border-red-500/10 group relative">
            <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-red-500/5 rounded-full blur-[200px] translate-x-1/4 -translate-y-1/4 pointer-events-none" />
            
            <div className="max-w-3xl relative z-10 text-center mx-auto">
              <div className="inline-flex p-6 rounded-3xl glass border-red-500/20 text-red-500 mb-12 animate-bounce">
                <Send className="w-10 h-10" />
              </div>
              <h2 className="text-5xl md:text-8xl font-display font-bold mb-10 leading-[0.9] tracking-tight">
                Let's Build <br />
                <span className="text-red-gradient italic">Next Gen Tech</span>
              </h2>
              <p className="text-2xl text-zinc-400 font-light mb-16 leading-relaxed italic opacity-80">
                Dropping 3 years of engineering expertise into every collaboration. Open for groundbreaking roles and creative ventures.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <motion.button 
                  onClick={() => setIsHireMeOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  className="px-12 py-6 rounded-3xl bg-red-500 text-black font-black hover:bg-red-400 shadow-[0_25px_60px_rgba(244,63,94,0.3)] transition-all uppercase tracking-widest"
                >
                  Start a conversation
                </motion.button>
                <div className="flex gap-6 justify-center items-center px-10">
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-4 rounded-2xl glass border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-500/30 transition-all"><Linkedin className="w-8 h-8" /></a>
                  <a href="mailto:amansrivastava1995gzp@gmail.com" className="p-4 rounded-2xl glass border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-500/30 transition-all"><Mail className="w-8 h-8" /></a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-32 border-t border-zinc-900 bg-black/60 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-16 mb-24">
            <div>
              <p className="text-4xl font-display font-bold mb-4 tracking-tighter">AMAN<span className="text-red-500">.</span></p>
              <p className="text-zinc-500 text-lg font-light italic max-w-sm">Architecting resilient digital landscapes with precision and passion.</p>
            </div>
            <div className="grid grid-cols-2 gap-x-16 gap-y-6 font-black text-xs uppercase tracking-[0.3em] text-zinc-500">
              {["About", "Experience", "Skills", "Projects", "Education", "Contact"].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-red-400 transition-colors">{item}</a>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-10 pt-16 border-t border-zinc-800">
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">
               © {new Date().getFullYear()} Aman Srivastava • Engineered for Excellence
            </p>
            <div className="flex items-center gap-8">
              <a href="https://github.com" className="text-zinc-500 hover:text-red-400 transition-all"><Github className="w-6 h-6" /></a>
              <div className="w-[1px] h-6 bg-zinc-800" />
              <button 
                onClick={isAdmin ? () => signOut(auth) : handleAdminSignIn}
                className="text-zinc-500 hover:text-red-400 transition-all uppercase text-[10px] font-black tracking-[0.2em] flex items-center gap-3"
              >
                {isAdmin ? "Admin Sign Out" : "Secure Portal"}
                {isAdmin ? <Lock className="w-4 h-4 text-red-500" /> : <User className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Global Admin Dash (only when logged in) */}
        {isAdmin && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-12 mt-20"
          >
            <div className="glass rounded-[3rem] p-12 border-red-500/20 shadow-[0_0_100px_rgba(255,0,0,0.05)]">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-red-500/10"><Lock className="w-8 h-8 text-red-500" /></div>
                  <div>
                    <h2 className="text-3xl font-display font-bold uppercase tracking-tight">Active Inquiries</h2>
                    <p className="text-zinc-500 text-sm font-light italic mt-1">Found {inquiries.length} submissions in your database.</p>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-4">
                {inquiries.map((iq) => (
                  <div key={iq.id} className="p-8 rounded-2xl glass border-zinc-800 hover:border-red-500/20 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-zinc-100">{iq.name}</h3>
                        <p className="text-red-500 text-sm font-medium">{iq.email}</p>
                      </div>
                      <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest py-1 px-3 glass rounded-lg">
                        {iq.createdAt?.toDate().toLocaleString()}
                      </span>
                    </div>
                    <p className="text-zinc-400 font-light italic leading-relaxed pt-4 border-t border-zinc-900 group-hover:text-zinc-200 transition-colors">
                      {iq.message}
                    </p>
                  </div>
                ))}
                {inquiries.length === 0 && (
                  <div className="py-20 text-center glass rounded-3xl border-dashed border-zinc-800">
                    <p className="text-zinc-500 italic">No inquiries found yet. Your inbox is currently quiet.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </footer>
    </div>
  );
}
