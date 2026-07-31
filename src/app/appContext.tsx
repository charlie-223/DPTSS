import React, { createContext, useContext, useEffect, useState } from "react";

export type ProgramModule = { title: string; duration: string };
export type Program = {
  id: string;
  title: string;
  level: string;
  modules: number;
  duration: string;
  status: string;
  description?: string;
  objectives?: string[];
  prerequisites?: string;
  targetAudience?: string;
  certificationName?: string;
  passingScore?: number;
  tags?: string[];
  createdBy?: string;
  createdDate?: string;
  lastUpdated?: string;
  moduleList?: ProgramModule[];
};
export type Session = {
  id: string;
  course: string;
  date: string;
  time: string;
  location: string;
  trainer: string;
  enrolled: number;
  capacity: number;
  status?: string;
  description?: string;
  sessionType?: string;
  contactEmail?: string;
  materials?: string[];
  notes?: string;
  waitlist?: number;
  createdBy?: string;
  createdDate?: string;
  lastUpdated?: string;
};
export type Participant = { id: string; name: string; dept?: string; role?: string; level?: string; status?: string; email?: string };
export type Notification = { id: string; type: string; subject: string; body?: string; date: string; status?: string; read?: boolean };
export type AttendanceRecord = {
  id: string;
  participantId?: string;
  participantName: string;
  program: string;
  sessionId?: string;
  date: string;
  status: "Completed" | "In Progress" | "No Show" | "Enrolled";
  score?: number;
  certificate?: string;
};

type AppContextType = {
  programs: Program[];
  sessions: Session[];
  participants: Participant[];
  notifications: Notification[];
  attendanceRecords: AttendanceRecord[];
  darkMode: boolean;
  toggleDarkMode: () => void;
  addProgram: (p: Program) => void;
  updateProgram: (id: string, updates: Partial<Program>) => void;
  deleteProgram: (id: string) => void;
  createSession: (s: Session) => string;
  updateSession: (id: string, updates: Partial<Session>) => void;
  cancelSession: (id: string) => void;
  launchSession: (id: string) => void;
  registerParticipant: (p: Participant) => void;
  addNotification: (n: Omit<Notification, "id" | "date" | "read">) => void;
  exportCSV: (type: "programs" | "sessions" | "participants" | "attendance") => void;
  addUser: (u: Participant) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addAttendanceRecord: (r: Omit<AttendanceRecord, "id">) => void;
  getAttendanceFor: (participantNameOrId: string) => AttendanceRecord[];
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const LS_KEYS = { programs: "dptss_programs", sessions: "dptss_sessions", participants: "dptss_participants", notifications: "dptss_notifications", darkMode: "dptss_dark_mode", attendance: "dptss_attendance" };

function uid(prefix = "id") { return `${prefix}-${Math.random().toString(36).slice(2, 9)}`; }

function minutesAgo(m: number) { return new Date(Date.now() - m * 60000).toISOString(); }

function seedNotifications(): Notification[] {
  return [
    { id: uid("N"), type: "Session", subject: "New session scheduled: Wildfire Response Drill", body: "Session SES-014 has been scheduled for Aug 5, 9:00 AM at Field Station 2.", date: minutesAgo(25), status: "Sent", read: false },
    { id: uid("N"), type: "System", subject: "Welcome to DPTSS", body: "Your training dashboard is ready. Explore your modules from the sidebar.", date: minutesAgo(90), status: "Sent", read: false },
    { id: uid("N"), type: "Evaluation", subject: "Performance review completed", body: "Your latest assessment results are now available for review.", date: minutesAgo(60 * 6), status: "Sent", read: false },
    { id: uid("N"), type: "Alert", subject: "Certification expiring soon", body: "Your HAZMAT certification expires in 14 days. Renew to stay compliant.", date: minutesAgo(60 * 20), status: "Pending", read: true },
    { id: uid("N"), type: "Export", subject: "Compliance report exported", body: "The Q3 compliance report has been generated and downloaded.", date: minutesAgo(60 * 48), status: "Sent", read: true },
    { id: uid("N"), type: "System", subject: "System maintenance scheduled", body: "Platform maintenance window on Saturday, 12:00 AM - 2:00 AM.", date: minutesAgo(60 * 96), status: "Sent", read: true },
  ];
}

function seedAttendance(): AttendanceRecord[] {
  return [
    { id: uid("ATT"), participantId: "P-001", participantName: "Maria Santos", program: "Earthquake Response", date: "2026-06-29", status: "Completed", score: 94, certificate: "CERT-EQR-2026" },
    { id: uid("ATT"), participantId: "P-001", participantName: "Maria Santos", program: "Flood Evacuation Protocol", date: "2026-06-22", status: "Completed", score: 88, certificate: "CERT-FEP-2026" },
    { id: uid("ATT"), participantId: "P-001", participantName: "Maria Santos", program: "Hazmat Level 1", date: "2026-06-08", status: "Completed", score: 91, certificate: "CERT-HZ1-2026" },
    { id: uid("ATT"), participantId: "P-002", participantName: "Jose Reyes", program: "Wildfire Response Drill", date: "2026-06-25", status: "Completed", score: 85 },
    { id: uid("ATT"), participantId: "P-002", participantName: "Jose Reyes", program: "CPR Recertification", date: "2026-06-10", status: "Completed", score: 96 },
    { id: uid("ATT"), participantId: "P-003", participantName: "Ana Cruz", program: "ICS-200 Command Structure", date: "2026-06-18", status: "Completed", score: 90 },
    { id: uid("ATT"), participantId: "P-003", participantName: "Ana Cruz", program: "Earthquake Response", date: "2026-06-29", status: "Completed", score: 92 },
    { id: uid("ATT"), participantId: "P-004", participantName: "Carlos Bautista", program: "Basic First Aid", date: "2026-06-14", status: "No Show" },
    { id: uid("ATT"), participantId: "P-005", participantName: "Elena Villanueva", program: "Hazmat Level 2", date: "2026-07-02", status: "In Progress" },
    { id: uid("ATT"), participantId: "P-005", participantName: "Elena Villanueva", program: "SCBA Field Operations", date: "2026-06-05", status: "Completed", score: 97 },
  ];
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [programs, setPrograms] = useState<Program[]>(() => {
    try { const v = localStorage.getItem(LS_KEYS.programs); return v ? JSON.parse(v) : []; } catch { return []; }
  });
  const [sessions, setSessions] = useState<Session[]>(() => {
    try { const v = localStorage.getItem(LS_KEYS.sessions); return v ? JSON.parse(v) : []; } catch { return []; }
  });
  const [participants, setParticipants] = useState<Participant[]>(() => {
    try { const v = localStorage.getItem(LS_KEYS.participants); return v ? JSON.parse(v) : []; } catch { return []; }
  });
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try { const v = localStorage.getItem(LS_KEYS.notifications); return v ? JSON.parse(v) : seedNotifications(); } catch { return seedNotifications(); }
  });
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    try { const v = localStorage.getItem(LS_KEYS.attendance); return v ? JSON.parse(v) : seedAttendance(); } catch { return seedAttendance(); }
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem(LS_KEYS.darkMode);
      if (v !== null) return v === "true";
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch { return false; }
  });

  useEffect(() => { localStorage.setItem(LS_KEYS.programs, JSON.stringify(programs)); }, [programs]);
  useEffect(() => { localStorage.setItem(LS_KEYS.sessions, JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem(LS_KEYS.participants, JSON.stringify(participants)); }, [participants]);
  useEffect(() => { localStorage.setItem(LS_KEYS.notifications, JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem(LS_KEYS.attendance, JSON.stringify(attendanceRecords)); }, [attendanceRecords]);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem(LS_KEYS.darkMode, String(darkMode));
  }, [darkMode]);

  const addProgram = (p: Program) => setPrograms(prev => [{ ...p, id: uid("PRG") }, ...prev]);
  const updateProgram = (id: string, updates: Partial<Program>) => {
    setPrograms(prev => prev.map(p => p.id === id ? { ...p, ...updates, lastUpdated: new Date().toISOString() } : p));
    addNotification({ type: "Program", subject: `Program updated: ${updates.title ?? id}`, status: "Sent" });
  };
  const deleteProgram = (id: string) => setPrograms(prev => prev.filter(p => p.id !== id));
  const createSession = (s: Session) => {
    const newS = { ...s, id: uid("SES") };
    setSessions(prev => [newS, ...prev]);
    return newS.id;
  };
  const updateSession = (id: string, updates: Partial<Session>) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates, lastUpdated: new Date().toISOString() } : s));
    addNotification({ type: "Session", subject: `Session updated: ${updates.course ?? id}`, status: "Sent" });
  };
  const cancelSession = (id: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: "Cancelled", lastUpdated: new Date().toISOString() } : s));
    addNotification({ type: "Session", subject: `Session ${id} cancelled`, status: "Sent" });
  };
  const launchSession = (id: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: "Launched" } : s));
    addNotification({ type: "System", subject: `Session ${id} launched`, body: "A new session has been launched", status: "Sent" });
  };
  const registerParticipant = (p: Participant) => setParticipants(prev => [{ ...p, id: uid("P") }, ...prev]);
  const addNotification = (n: Omit<Notification, "id" | "date" | "read">) => {
    const note: Notification = { id: uid("N"), date: new Date().toISOString(), read: false, ...n };
    setNotifications(prev => [note, ...prev]);
  };
  const addUser = (u: Participant) => setParticipants(prev => [{ ...u, id: uid("U") }, ...prev]);
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const addAttendanceRecord = (r: Omit<AttendanceRecord, "id">) => {
    setAttendanceRecords(prev => [{ id: uid("ATT"), ...r }, ...prev]);
    addNotification({ type: "Attendance", subject: `${r.participantName} — ${r.program} marked ${r.status}`, status: "Sent" });
  };
  const getAttendanceFor = (participantNameOrId: string) =>
    attendanceRecords.filter(r => r.participantId === participantNameOrId || r.participantName === participantNameOrId);

  const markNotificationRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllNotificationsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const clearNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));
  const clearAllNotifications = () => setNotifications([]);

  const exportCSV = (type: "programs" | "sessions" | "participants" | "attendance") => {
    let data: any[] = [];
    if (type === "programs") data = programs;
    if (type === "sessions") data = sessions;
    if (type === "participants") data = participants;
    if (type === "attendance") data = attendanceRecords;
    if (!data.length) { addNotification({ type: "Export", subject: `No ${type} to export`, status: "Failed" }); return; }
    const keys = Object.keys(data[0]);
    const csv = [keys.join(","), ...data.map(r => keys.map(k => `${((r as any)[k] ?? "").toString().replace(/"/g, '""')}`).join(",")).join("\n")];
    const blob = new Blob([csv.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${type}.csv`; a.click();
    URL.revokeObjectURL(url);
    addNotification({ type: "Export", subject: `Exported ${type}`, status: "Sent" });
  };

  return (
    <AppContext.Provider value={{ programs, sessions, participants, notifications, attendanceRecords, darkMode, toggleDarkMode, addProgram, updateProgram, deleteProgram, createSession, updateSession, cancelSession, launchSession, registerParticipant, addNotification, exportCSV, addUser, markNotificationRead, markAllNotificationsRead, clearNotification, clearAllNotifications, addAttendanceRecord, getAttendanceFor }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

export default AppContext;
