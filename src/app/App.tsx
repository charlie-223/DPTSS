import { useState, useRef, useEffect } from "react";
import { AppProvider, useApp } from "./appContext";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen, Cpu, Users, BarChart3, FileText, Bell, ChevronRight,
  Plus, Search, Filter, MoreHorizontal, CheckCircle, Clock, XCircle,
  Activity, Target, Layers, MapPin, Calendar, Download, Play, Edit2,
  Eye, TrendingUp, TrendingDown, Shield, Zap, Wind, Flame, Droplets,
  User, ChevronDown, AlertTriangle, Mail, BookMarked, Sliders, List,
  PlusCircle, Trash2, ChevronUp, CheckSquare, Square, Timer, Smartphone,
  FileCheck, TrendingUp as Trend, Building2, Package, UserCheck, LogIn,
  Send, Info, Check, X, Lock, LogOut, Key, Settings, ShieldCheck,
  UserPlus, UserX, RefreshCw, ToggleLeft, ToggleRight, Hash, Globe,
  ClipboardList, Star, Award, Sun, Moon,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid,
  PolarAngleAxis, Radar, AreaChart, Area,
} from "recharts";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.07 } }),
};
const fadeIn = {
  hidden: { opacity: 0 },
  show: (i = 0) => ({ opacity: 1, transition: { duration: 0.28, delay: i * 0.06 } }),
};
const slideRight = {
  hidden: { opacity: 0, x: -16 },
  show: (i = 0) => ({ opacity: 1, x: 0, transition: { duration: 0.3, delay: i * 0.05 } }),
};
const pageTransition = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18 } },
};
const tabTransition = {
  hidden: { opacity: 0, x: 10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, x: -10, transition: { duration: 0.15 } },
};

type Role = "user" | "admin" | "superadmin";
type AdminModule = "dashboard" | "training" | "simulation" | "participants" | "evaluation" | "reporting";
type SuperAdminModule = AdminModule | "usermgmt" | "settings";
type UserModule = "myDashboard" | "mySessions" | "myPerformance" | "browsedrills";
type TrainingTab = "curriculum" | "schedule" | "resources";
type SimTab = "selector" | "injector" | "roles";
type ParticipantTab = "portal" | "profiles" | "attendance" | "notifications";
type EvalTab = "objectives" | "analytics" | "assessor";
type ReportTab = "aar" | "compliance" | "trends";

interface AuthUser {
  name: string;
  email: string;
  role: Role;
  dept: string;
  avatar: string;
}

const DEMO_ACCOUNTS: AuthUser[] = [
  { name: "Maria Santos", email: "m.santos@ems.gov", role: "user", dept: "Rescue Alpha", avatar: "MS" },
  { name: "Capt. Santos", email: "admin@ems.gov", role: "admin", dept: "Training Division", avatar: "CS" },
  { name: "Director Reyes", email: "superadmin@ems.gov", role: "superadmin", dept: "Command HQ", avatar: "DR" },
];

function Badge({ status, children }: { status?: string; children: React.ReactNode }) {
  const colorMap: Record<string, string> = {
    Active: "bg-green-500/15 text-green-400 border-green-500/20",
    Draft: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    Archived: "bg-gray-500/15 text-gray-400 border-gray-500/20",
    Completed: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    "In Progress": "bg-orange-500/15 text-orange-400 border-orange-500/20",
    Critical: "bg-red-500/15 text-red-400 border-red-500/20",
    Scheduled: "bg-purple-500/15 text-purple-400 border-purple-500/20",
    Low: "bg-green-500/15 text-green-400 border-green-500/20",
    Medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    High: "bg-orange-500/15 text-orange-400 border-orange-500/20",
    Extreme: "bg-red-500/15 text-red-400 border-red-500/20",
    Passed: "bg-green-500/15 text-green-400 border-green-500/20",
    Failed: "bg-red-500/15 text-red-400 border-red-500/20",
    Pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    Sent: "bg-green-500/15 text-green-400 border-green-500/20",
    Queued: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    user: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    admin: "bg-purple-500/15 text-purple-400 border-purple-500/20",
    superadmin: "bg-primary/15 text-primary border-primary/20",
    Suspended: "bg-red-500/15 text-red-400 border-red-500/20",
    Advanced: "bg-primary/15 text-primary border-primary/20",
    Intermediate: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    Basic: "bg-gray-500/15 text-gray-400 border-gray-500/20",
  };
  const k = status ?? (children as string);
  const cls = colorMap[k] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[13px] font-mono font-medium border ${cls}`}>
      {children}
    </span>
  );
}

function TabBar({ tabs, active, onChange }: { tabs: { id: string; label: string; icon: React.ElementType }[]; active: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-0.5 bg-secondary p-1 rounded-lg w-fit flex-wrap">
      {tabs.map(t => {
        const Icon = t.icon;
        return (
          <motion.button key={t.id} onClick={() => onChange(t.id)}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${active === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            <Icon size={14} />{t.label}
          </motion.button>
        );
      })}
    </div>
  );
}

function AvatarCircle({ initials, color = "bg-secondary" }: { initials: string; color?: string }) {
  return (
    <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-sm font-bold text-foreground flex-shrink-0`}>
      {initials}
    </div>
  );
}

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function notificationIcon(type: string): React.ElementType {
  const map: Record<string, React.ElementType> = {
    System: Info,
    Session: Calendar,
    Evaluation: BarChart3,
    Export: Download,
    Alert: AlertTriangle,
    Registration: UserCheck,
  };
  return map[type] ?? Mail;
}

function NotificationBell() {
  const app = useApp();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const sorted = [...app.notifications].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const unreadCount = sorted.filter(n => !n.read).length;

  return (
    <div className="relative" ref={wrapRef}>
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
        className="relative text-muted-foreground hover:text-foreground transition-colors"
      >
        <Bell size={17} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary text-[10px] font-mono text-primary-foreground flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-border bg-secondary/30">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-foreground">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-primary/15 text-primary">{unreadCount} new</span>
                )}
              </div>
              <div className="flex items-center gap-2.5">
                {unreadCount > 0 && (
                  <button onClick={() => app.markAllNotificationsRead()} className="text-[12px] font-mono text-primary hover:underline flex items-center gap-1">
                    <Check size={12} />Mark all read
                  </button>
                )}
                {sorted.length > 0 && (
                  <button onClick={() => app.clearAllNotifications()} title="Clear all" className="text-muted-foreground hover:text-red-400 transition-colors">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {sorted.length === 0 && (
                <div className="px-3 py-10 flex flex-col items-center gap-2 text-center">
                  <Bell size={22} className="text-muted-foreground/40" />
                  <div className="text-[13px] text-muted-foreground">You're all caught up</div>
                </div>
              )}
              {sorted.map(n => {
                const Icon = notificationIcon(n.type);
                return (
                  <div
                    key={n.id}
                    onClick={() => !n.read && app.markNotificationRead(n.id)}
                    className={`group flex gap-2.5 px-3 py-2.5 border-b border-border last:border-b-0 transition-colors ${!n.read ? "bg-primary/5 cursor-pointer" : "hover:bg-secondary/40"}`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${!n.read ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>
                      <Icon size={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className={`text-[13px] leading-tight ${!n.read ? "font-semibold text-foreground" : "font-medium text-muted-foreground"}`}>
                          {n.subject}
                        </div>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1" />}
                      </div>
                      {n.body && <div className="text-[12px] text-muted-foreground mt-0.5 leading-snug line-clamp-2">{n.body}</div>}
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1"><Clock size={10} />{timeAgo(n.date)}</span>
                        {n.status && <Badge status={n.status}>{n.status}</Badge>}
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); app.clearNotification(n.id); }}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-opacity flex-shrink-0"
                      title="Dismiss"
                    >
                      <X size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useApp();
  return (
    <button
      onClick={toggleDarkMode}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      className="relative w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
    >
      <AnimatePresence mode="wait" initial={false}>
        {darkMode ? (
          <motion.span key="sun" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.18 }} className="absolute">
            <Sun size={16} />
          </motion.span>
        ) : (
          <motion.span key="moon" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.18 }} className="absolute">
            <Moon size={16} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function LogoutConfirmModal({ auth, onConfirm, onCancel }: { auth: AuthUser; onConfirm: () => void; onCancel: () => void }) {
  const roleLabel = auth.role === "superadmin" ? "Super Admin" : auth.role === "admin" ? "Admin" : "Participant";
  const roleColor = auth.role === "superadmin" ? "bg-primary/20 text-primary" : auth.role === "admin" ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-400";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={onCancel}
        />

        {/* Dialog */}
        <motion.div
          className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-sm overflow-hidden"
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 8 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/60 to-transparent" />

          <div className="p-6">
            {/* Icon */}
            <motion.div
              className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <LogOut size={22} className="text-red-400" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
              <h2 className="text-center text-lg font-bold font-['Barlow_Condensed'] tracking-wide text-foreground">
                CONFIRM SIGN OUT
              </h2>
              <p className="text-center text-xs text-muted-foreground mt-1">
                You are about to end your session. Any unsaved changes may be lost.
              </p>
            </motion.div>

            {/* User info card */}
            <motion.div
              className="mt-4 flex items-center gap-3 bg-secondary rounded-lg p-3 border border-border"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${roleColor}`}>
                {auth.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">{auth.name}</div>
                <div className="text-[12px] font-mono text-muted-foreground">{auth.email}</div>
              </div>
              <Badge status={auth.role}>{roleLabel}</Badge>
            </motion.div>

            {/* Buttons */}
            <motion.div
              className="flex gap-2.5 mt-5"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
            >
              <motion.button
                onClick={onCancel}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex-1 px-4 py-2.5 rounded-lg bg-secondary border border-border text-sm font-semibold text-foreground hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={onConfirm}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/15 border border-red-500/30 text-sm font-semibold text-red-400 hover:bg-red-500/25 transition-colors"
              >
                <LogOut size={16} />Sign Out
              </motion.button>
            </motion.div>

            <p className="text-center text-[12px] font-mono text-muted-foreground mt-3">
              Session will be cleared from this device
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function LoginScreen({ onLogin }: { onLogin: (u: AuthUser) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleLogin = () => {
    const account = DEMO_ACCOUNTS.find(a => a.email === email.trim().toLowerCase());
    if (!account) { setError("No account found for this email."); return; }
    if (password !== "password123") { setError("Incorrect password."); return; }
    setError("");
    onLogin(account);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6" style={{ fontFamily: "'DM Sans', 'Barlow', sans-serif" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <motion.div className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
          <motion.div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center"
            initial={{ scale: 0.5, rotate: -15 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 200 }}>
            <Shield size={22} className="text-primary-foreground" />
          </motion.div>
          <div>
            <div className="text-sm font-bold font-['Barlow_Condensed'] tracking-widest text-foreground uppercase">DPTSS</div>
            <div className="text-[12px] font-mono text-muted-foreground tracking-wider">Disaster Preparedness Training & Simulation</div>
          </div>
        </motion.div>

        <motion.div className="bg-card border border-border rounded-xl p-6 space-y-5"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}>
          <div>
            <h1 className="text-3xl font-bold font-['Barlow_Condensed'] tracking-wide text-foreground">Sign in to your account</h1>
            <p className="text-base text-muted-foreground mt-0.5">Authorized personnel only. All sessions are logged.</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-mono text-muted-foreground uppercase tracking-widest block mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="you@ems.gov"
                className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-mono text-muted-foreground uppercase tracking-widest block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  placeholder="••••••••••••"
                  className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary pr-10"
                />
                <button onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  <Eye size={15} />
                </button>
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-base text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
                <AlertTriangle size={13} />{error}
              </div>
            )}
            <motion.button onClick={handleLogin}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-md text-lg font-semibold hover:bg-primary/90 transition-colors">
              <LogIn size={16} />Sign In
            </motion.button>
          </div>

          <div className="border-t border-border pt-4">
            <div className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Demo Accounts (password: password123)</div>
            <div className="space-y-1.5">
              {DEMO_ACCOUNTS.map((a, i) => (
                <motion.button key={a.email} onClick={() => { setEmail(a.email); setPassword("password123"); setError(""); }}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.07, duration: 0.28 }}
                  whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-md hover:bg-secondary transition-colors text-left group">
                  <AvatarCircle initials={a.avatar} color={a.role === "superadmin" ? "bg-primary/20" : a.role === "admin" ? "bg-purple-500/20" : "bg-blue-500/20"} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-foreground">{a.name}</div>
                    <div className="text-[12px] font-mono text-muted-foreground">{a.email}</div>
                  </div>
                  <Badge status={a.role}>{a.role === "superadmin" ? "Super Admin" : a.role === "admin" ? "Admin" : "User"}</Badge>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.p className="text-center text-[12px] font-mono text-muted-foreground mt-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          Emergency Management Systems · v2.4.1 · RESTRICTED
        </motion.p>
      </div>
    </div>
  );
}

const userSessions = [
  { id: "SES-001", name: "Basic Earthquake Response", date: "Jul 03, 2026", time: "08:00–12:00", location: "District 4 EOC", type: "In-person", status: "Scheduled", level: "Basic" },
  { id: "SES-004", name: "Mass Casualty Management", date: "Jul 15, 2026", time: "08:00–16:00", location: "General Hospital Annex", type: "In-person", status: "Scheduled", level: "Intermediate" },
];

const upcomingBrowse = [
  { id: "SES-002", name: "Advanced Flood Evacuation", date: "Jul 08", slots: 11, type: "Virtual", level: "Advanced", desc: "Flood zone mapping, evacuation route planning, and victim rescue in swift water conditions." },
  { id: "SES-003", name: "Hazmat Level 2", date: "Jul 10", slots: 13, type: "In-person", level: "Advanced", desc: "HAZMAT identification, decontamination procedures, and chemical agent response." },
  { id: "SES-005", name: "SAR Night Operations", date: "Jul 15", slots: 4, type: "In-person", level: "Intermediate", desc: "Nighttime search and rescue techniques, lighting protocols, and victim extraction." },
  { id: "SES-006", name: "Typhoon Preparedness 101", date: "Jul 22", slots: 28, type: "Virtual", level: "Basic", desc: "Typhoon watch protocols, shelter-in-place guidance, and community evacuation." },
];

const userScores = [
  { drill: "D1", score: 71 }, { drill: "D2", score: 78 }, { drill: "D3", score: 75 },
  { drill: "D4", score: 82 }, { drill: "D5", score: 88 }, { drill: "D6", score: 94 },
];

const userObjectives = [
  { text: "Incident Commander assumes command on radio net", done: true, time: "1:42", limit: "2 min" },
  { text: "Gas valve shut off at utility panel", done: true, time: "1:58", limit: "2 min" },
  { text: "Evacuation route cleared and opened", done: false, time: "6:12", limit: "5 min" },
  { text: "Triage zone established with START protocol", done: true, time: "4:31", limit: "5 min" },
  { text: "SITREP transmitted to EOC", done: true, time: "9:05", limit: "10 min" },
];

function UserPortal({ auth, onLogout }: { auth: AuthUser; onLogout: () => void }) {
  const app = useApp();
  const [mod, setMod] = useState<UserModule>("myDashboard");
  const [signedUp, setSignedUp] = useState<string[]>(["SES-001", "SES-004"]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const myAttendance = app.getAttendanceFor(auth.name);
  const myCompleted = myAttendance.filter(r => r.status === "Completed");

  const USER_NAV = [
    { id: "myDashboard" as UserModule, label: "My Dashboard", icon: Activity },
    { id: "mySessions" as UserModule, label: "My Sessions", icon: Calendar },
    { id: "myPerformance" as UserModule, label: "My Performance", icon: BarChart3 },
    { id: "browsedrills" as UserModule, label: "Browse Drills", icon: Search },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex" style={{ fontFamily: "'DM Sans', 'Barlow', sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col" style={{ minHeight: "100vh" }}>
        <div className="px-4 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <Shield size={16} className="text-primary-foreground" />
            </div>
            <div>
              <div className="text-[13px] font-bold font-['Barlow_Condensed'] tracking-widest text-foreground uppercase leading-none">DPTSS</div>
              <div className="text-[11px] font-mono text-muted-foreground mt-0.5 leading-none">Participant Portal</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest px-2 mb-2">Navigation</div>
          {USER_NAV.map((item, i) => {
            const Icon = item.icon;
            const active = mod === item.id;
            return (
              <motion.button key={item.id} onClick={() => setMod(item.id)}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05, duration: 0.25 }}
                whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left transition-colors text-xs font-medium ${active ? "bg-sidebar-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"}`}>
                <Icon size={15} className={active ? "text-primary" : "text-current"} />
                <span>{item.label}</span>
                {active && <motion.span layoutId="user-nav-indicator" className="ml-auto"><ChevronRight size={12} className="text-primary" /></motion.span>}
              </motion.button>
            );
          })}
        </nav>
        <div className="px-3 pb-3">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="text-[11px] font-mono text-blue-400 uppercase tracking-widest mb-1">Access Level</div>
            <div className="text-xs font-semibold text-foreground">Participant</div>
            <div className="text-[12px] text-muted-foreground">{auth.dept}</div>
          </div>
        </div>
        <div className="px-4 py-3 border-t border-sidebar-border flex items-center gap-2.5">
          <AvatarCircle initials={auth.avatar} color="bg-blue-500/20" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-foreground truncate">{auth.name}</div>
            <div className="text-[12px] font-mono text-muted-foreground">Participant</div>
          </div>
          <motion.button onClick={() => setShowLogoutModal(true)} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="text-muted-foreground hover:text-red-400 transition-colors"><LogOut size={15} /></motion.button>
        </div>
      </aside>

      {showLogoutModal && (
        <LogoutConfirmModal auth={auth} onConfirm={onLogout} onCancel={() => setShowLogoutModal(false)} />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/50 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <span>DPTSS</span><ChevronRight size={12} /><span className="text-foreground">{USER_NAV.find(n => n.id === mod)?.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-mono text-green-400"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />ONLINE</div>
            <DarkModeToggle />
            <NotificationBell />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <AnimatePresence mode="wait">
          <motion.div key={mod} variants={pageTransition} initial="hidden" animate="show" exit="exit">
          {mod === "myDashboard" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold font-['Barlow_Condensed'] tracking-wide text-foreground">WELCOME BACK, {auth.name.split(" ")[0].toUpperCase()}</h1>
                <p className="text-muted-foreground text-sm mt-0.5">{auth.dept} · Participant Portal · June 30, 2026</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Sessions Enrolled", value: signedUp.length, icon: Calendar, color: "text-primary" },
                  { label: "Drills Completed", value: String(myCompleted.length), icon: CheckCircle, color: "text-green-400" },
                  { label: "Latest Score", value: "94%", icon: Star, color: "text-primary" },
                  { label: "Certifications", value: "3", icon: Award, color: "text-blue-400" },
                ].map(s => (
                  <div key={s.label} className="bg-card border border-border rounded-lg p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest">{s.label}</span>
                      <s.icon size={16} className={s.color} />
                    </div>
                    <div className="text-3xl font-bold font-['Barlow_Condensed'] text-foreground">{s.value}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-lg p-5">
                  <h3 className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest mb-3">My Score Trend</h3>
                  <ResponsiveContainer width="100%" height={160}>
                    <AreaChart data={userScores} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="user-dash-score-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f0a500" stopOpacity={0.2} /><stop offset="95%" stopColor="#f0a500" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(240,246,252,0.06)" />
                      <XAxis dataKey="drill" tick={{ fill: "#8b949e", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[60, 100]} tick={{ fill: "#8b949e", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "#1c2128", border: "1px solid rgba(240,246,252,0.1)", borderRadius: 6, fontSize: 11, fontFamily: "JetBrains Mono" }} />
                      <Area key="area-user-dash-score" type="monotone" dataKey="score" name="Score" stroke="#f0a500" fill="url(#user-dash-score-grad)" strokeWidth={2} dot={{ fill: "#f0a500", r: 3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-card border border-border rounded-lg p-5">
                  <h3 className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest mb-3">Upcoming Sessions</h3>
                  <div className="space-y-2">
                    {userSessions.map(s => (
                      <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-md bg-secondary/60">
                        <div className="w-8 h-8 rounded-md bg-primary/15 flex items-center justify-center text-[12px] font-mono text-primary font-bold">{s.date.split(", ")[0].split(" ")[1]}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-foreground truncate">{s.name}</div>
                          <div className="text-[12px] font-mono text-muted-foreground">{s.date} · {s.type}</div>
                        </div>
                        <Badge status="Scheduled">Scheduled</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest mb-3">Last Drill Objectives — Earthquake Response</h3>
                <div className="space-y-2">
                  {userObjectives.map((o, i) => (
                    <div key={i} className={`flex items-center gap-3 p-2.5 rounded-md ${o.done ? "bg-green-500/5 border border-green-500/10" : "bg-red-500/5 border border-red-500/10"}`}>
                      {o.done ? <CheckCircle size={15} className="text-green-400 flex-shrink-0" /> : <XCircle size={15} className="text-red-400 flex-shrink-0" />}
                      <span className="flex-1 text-xs text-foreground">{o.text}</span>
                      <span className={`text-xs font-mono font-bold ${o.done ? "text-green-400" : "text-red-400"}`}>{o.time}</span>
                      <span className="text-[12px] font-mono text-muted-foreground">/ {o.limit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {mod === "mySessions" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold font-['Barlow_Condensed'] tracking-wide text-foreground">MY SESSIONS</h1>
                <p className="text-muted-foreground text-sm mt-0.5">Your enrolled training sessions and completion history</p>
              </div>
              <div className="space-y-3">
                {userSessions.map(s => (
                  <div key={s.id} className="bg-card border border-border rounded-lg p-4 hover:border-[rgba(240,165,0,0.25)] transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex flex-col items-center justify-center flex-shrink-0">
                        <div className="text-xs font-mono text-muted-foreground">{s.date.split(" ")[0]}</div>
                        <div className="text-lg font-bold font-['Barlow_Condensed'] text-primary leading-none">{s.date.split(" ")[1].replace(",", "")}</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-foreground">{s.name}</h3>
                          <Badge status={s.status}>{s.status}</Badge>
                          <Badge status={s.level}>{s.level}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock size={12} />{s.time}</span>
                          <span className="flex items-center gap-1"><MapPin size={12} />{s.location}</span>
                          <span className="flex items-center gap-1"><Globe size={12} />{s.type}</span>
                        </div>
                      </div>
                      <button onClick={() => setSignedUp(p => p.filter(x => x !== s.id))}
                        className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-md bg-red-500/10 border border-red-500/20 transition-colors flex items-center gap-1.5">
                        <X size={13} />Withdraw
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-2 mb-3">
                  <ClipboardList size={14} className="text-muted-foreground" />
                  <h3 className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest">My Training Attendance Record</h3>
                </div>
                {myAttendance.length === 0 ? (
                  <div className="bg-card border border-border rounded-lg p-4 text-xs text-muted-foreground">No attendance records yet. Completed and in-progress drills will appear here.</div>
                ) : (
                  <div className="space-y-2">
                    {myAttendance.map(r => (
                      <div key={r.id} className="bg-card border border-border rounded-lg p-4 opacity-90">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-secondary flex flex-col items-center justify-center flex-shrink-0">
                            <div className="text-xs font-mono text-muted-foreground">{new Date(r.date).toLocaleDateString(undefined, { month: "short" })}</div>
                            <div className="text-lg font-bold font-['Barlow_Condensed'] text-muted-foreground leading-none">{new Date(r.date).getDate()}</div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-semibold text-foreground">{r.program}</h3>
                              <Badge status={r.status}>{r.status}</Badge>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-muted-foreground">
                              <span>{new Date(r.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</span>
                              {typeof r.score === "number" && <span className="flex items-center gap-1"><Star size={12} />Score: {r.score}%</span>}
                            </div>
                          </div>
                          {r.status === "Completed" && (
                            <button onClick={() => app.addNotification({ type: "Export", subject: `Certificate requested — ${r.program}`, status: "Sent" })} className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md bg-secondary transition-colors flex items-center gap-1.5"><Download size={13} />Certificate</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {mod === "myPerformance" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold font-['Barlow_Condensed'] tracking-wide text-foreground">MY PERFORMANCE</h1>
                <p className="text-muted-foreground text-sm mt-0.5">Personal evaluation history and competency progress</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "Latest Score", value: "94%", color: "text-green-400" },
                  { label: "Avg Score", value: "81%", color: "text-primary" },
                  { label: "Drills Completed", value: "6", color: "text-foreground" },
                  { label: "Pass Rate", value: "100%", color: "text-green-400" },
                ].map(s => (
                  <div key={s.label} className="bg-card border border-border rounded-lg p-4">
                    <div className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest mb-1">{s.label}</div>
                    <div className={`text-2xl font-bold font-['Barlow_Condensed'] ${s.color}`}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-lg p-5">
                  <h3 className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest mb-4">Score History</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={userScores} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="user-perf-score-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f0a500" stopOpacity={0.2} /><stop offset="95%" stopColor="#f0a500" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(240,246,252,0.06)" />
                      <XAxis dataKey="drill" tick={{ fill: "#8b949e", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[60, 100]} tick={{ fill: "#8b949e", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "#1c2128", border: "1px solid rgba(240,246,252,0.1)", borderRadius: 6, fontSize: 11, fontFamily: "JetBrains Mono" }} />
                      <Area key="area-user-perf-score" type="monotone" dataKey="score" name="Score" stroke="#f0a500" fill="url(#user-perf-score-grad)" strokeWidth={2} dot={{ fill: "#f0a500", r: 3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-card border border-border rounded-lg p-5">
                  <h3 className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest mb-3">Competency Areas</h3>
                  <div className="space-y-2.5">
                    {[
                      { area: "Command & Control", score: 88 },
                      { area: "Protocol Adherence", score: 94 },
                      { area: "Response Speed", score: 76 },
                      { area: "Communication", score: 91 },
                      { area: "Team Coordination", score: 85 },
                    ].map(c => (
                      <div key={c.area}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{c.area}</span>
                          <span className={`font-mono font-bold ${c.score >= 80 ? "text-green-400" : c.score >= 65 ? "text-primary" : "text-red-400"}`}>{c.score}</span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${c.score >= 80 ? "bg-green-400" : c.score >= 65 ? "bg-primary" : "bg-red-400"}`} style={{ width: `${c.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest mb-3">Drill History</h3>
                <div className="space-y-2">
                  {[
                    { drill: "Earthquake Response — Advanced", date: "Jun 28", score: 94, result: "Passed", assessor: "Eval. Torres" },
                    { drill: "Flood Evacuation Protocol", date: "Jun 22", score: 88, result: "Passed", assessor: "Eval. Lim" },
                    { drill: "Hazmat Level 1", date: "Jun 08", score: 82, result: "Passed", assessor: "Eval. Torres" },
                    { drill: "SAR Night Ops", date: "May 30", score: 78, result: "Passed", assessor: "Eval. Cruz" },
                    { drill: "Mass Casualty", date: "May 15", score: 75, result: "Passed", assessor: "Eval. Lim" },
                    { drill: "Basic First Response", date: "Apr 20", score: 71, result: "Passed", assessor: "Eval. Torres" },
                  ].map((h, i) => (
                    <div key={i} className="flex items-center gap-4 p-2.5 rounded-md bg-secondary/50 hover:bg-secondary transition-colors">
                      <span className="text-[12px] font-mono text-muted-foreground w-12">{h.date}</span>
                      <span className="flex-1 text-xs text-foreground">{h.drill}</span>
                      <span className="text-[12px] font-mono text-muted-foreground">by {h.assessor}</span>
                      <div className="w-16 h-1.5 bg-background rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-green-400" style={{ width: `${h.score}%` }} />
                      </div>
                      <span className="text-xs font-mono font-bold text-green-400 w-8 text-right">{h.score}</span>
                      <Badge status={h.result}>{h.result}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {mod === "browsedrills" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold font-['Barlow_Condensed'] tracking-wide text-foreground">BROWSE DRILLS</h1>
                <p className="text-muted-foreground text-sm mt-0.5">Upcoming training sessions open for self-registration</p>
              </div>
              <div className="relative max-w-sm">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input placeholder="Search drills..." className="w-full bg-input-background border border-border rounded-md pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {upcomingBrowse.map(d => {
                  const joined = signedUp.includes(d.id);
                  return (
                    <div key={d.id} className={`bg-card border rounded-lg p-4 transition-all ${joined ? "border-primary/40" : "border-border hover:border-border/70"}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">{d.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge status={d.level}>{d.level}</Badge>
                            <span className="text-[12px] font-mono text-muted-foreground">{d.type}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold font-['Barlow_Condensed'] text-primary">{d.date}</div>
                          <div className={`text-[12px] font-mono ${d.slots < 5 ? "text-red-400" : "text-muted-foreground"}`}>{d.slots} slots left</div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{d.desc}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary/40 rounded-full" style={{ width: `${100 - (d.slots / 30) * 100}%` }} />
                        </div>
                        <button onClick={() => setSignedUp(prev => joined ? prev.filter(x => x !== d.id) : [...prev, d.id])}
                          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-semibold transition-colors whitespace-nowrap ${joined ? "bg-secondary text-muted-foreground hover:text-red-400" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
                          {joined ? <><X size={13} />Withdraw</> : <><Plus size={13} />Sign Up</>}
                        </button>
                      </div>
                      {joined && <div className="mt-2 flex items-center gap-1.5 text-[12px] font-mono text-green-400"><CheckCircle size={12} />Registered — confirmation sent</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}


const drillActivity = [
  { month: "Jan", drills: 4, participants: 62 }, { month: "Feb", drills: 6, participants: 89 },
  { month: "Mar", drills: 5, participants: 74 }, { month: "Apr", drills: 8, participants: 110 },
  { month: "May", drills: 7, participants: 98 }, { month: "Jun", drills: 11, participants: 143 },
];

function AdminDashboard() {
  return (
    <motion.div className="space-y-6" variants={{ show: { transition: { staggerChildren: 0.08 } } }} initial="hidden" animate="show">
      <motion.div variants={fadeUp}>
        <h1 className="text-4xl font-bold font-['Barlow_Condensed'] text-foreground tracking-wide">COMMAND OVERVIEW</h1>
        <p className="text-muted-foreground text-base mt-0.5">Monday, June 30, 2026 — Operational Status: <span className="text-green-400 font-mono">NOMINAL</span></p>
      </motion.div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Programs", value: "12", delta: "+3", icon: BookOpen },
          { label: "Scheduled Drills", value: "7", delta: "+1", icon: Calendar },
          { label: "Participants", value: "348", delta: "+24", icon: Users },
          { label: "Avg. Score", value: "82%", delta: "+4%", icon: Target },
        ].map((s, i) => (
          <motion.div key={s.label} custom={i} variants={fadeUp} whileHover={{ y: -2, borderColor: "rgba(240,165,0,0.35)" }} className="bg-card border border-border rounded-lg p-5 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest">{s.label}</span>
              <s.icon size={15} className="text-primary" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold font-['Barlow_Condensed'] text-foreground leading-none">{s.value}</span>
              <span className="flex items-center gap-0.5 text-xs font-mono text-green-400 mb-0.5"><TrendingUp size={12} />{s.delta}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={fadeUp} className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-semibold text-[13px] font-mono uppercase tracking-widest text-muted-foreground mb-4">Drill Activity — 6 Months</h3>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={drillActivity} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(240,246,252,0.06)" />
              <XAxis dataKey="month" tick={{ fill: "#8b949e", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#8b949e", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1c2128", border: "1px solid rgba(240,246,252,0.1)", borderRadius: 6, fontSize: 11, fontFamily: "JetBrains Mono" }} />
              <Bar key="bar-drills" dataKey="drills" name="Drills" fill="#f0a500" radius={[3, 3, 0, 0]} />
              <Bar key="bar-participants" dataKey="participants" name="Participants" fill="#58a6ff" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div variants={fadeUp} className="bg-card border border-border rounded-lg p-5 space-y-3">
          <h3 className="font-semibold text-[13px] font-mono uppercase tracking-widest text-muted-foreground">Active Alerts</h3>
          {[
            { type: "Earthquake", severity: "Critical", location: "District 4", time: "09:14" },
            { type: "Wildfire", severity: "High", location: "Northern Ridge", time: "08:52" },
            { type: "Flood", severity: "Medium", location: "River Basin", time: "07:30" },
          ].map((a, i) => (
            <motion.div key={a.type} custom={i} variants={slideRight} className="flex items-center gap-3 p-2.5 rounded-md bg-secondary/50">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${a.severity === "Critical" ? "bg-red-400" : a.severity === "High" ? "bg-orange-400" : "bg-yellow-400"}`} />
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="text-xs font-semibold text-foreground">{a.type}</span>
                  <span className="text-[12px] font-mono text-muted-foreground">{a.time}</span>
                </div>
                <div className="flex items-center gap-1 text-[12px] text-muted-foreground"><MapPin size={11} />{a.location}</div>
              </div>
              <Badge status={a.severity}>{a.severity}</Badge>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

function NewProgramModal({ onConfirm, onCancel }: { onConfirm: (title: string, level: string, modules: number) => void; onCancel: () => void }) {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<"Basic" | "Intermediate" | "Advanced">("Basic");
  const [modules, setModules] = useState(4);
  const [desc, setDesc] = useState("");

  const levelInfo: Record<string, { desc: string; color: string }> = {
    Basic: { desc: "Introductory level suitable for new personnel", color: "text-gray-400" },
    Intermediate: { desc: "Mid-level for experienced responders", color: "text-primary" },
    Advanced: { desc: "Expert-level for specialized roles", color: "text-orange-400" },
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onCancel} />
      <motion.div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden" initial={{ opacity: 0, scale: 0.92, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 8 }} transition={{ duration: 0.25 }}>
        <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/60 to-transparent" />
        <div className="p-6 space-y-5">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-3xl font-bold font-['Barlow_Condensed'] tracking-wide text-foreground">CREATE NEW TRAINING PROGRAM</h2>
            <p className="text-base text-muted-foreground mt-1">Define curriculum, level, and module structure for your new disaster preparedness training program.</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-mono text-muted-foreground uppercase tracking-widest block mb-2">Program Title</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Advanced Earthquake Response" className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" /></div>
            <div><label className="text-sm font-mono text-muted-foreground uppercase tracking-widest block mb-2">Difficulty Level</label><select value={level} onChange={e => setLevel(e.target.value as any)} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-base text-foreground focus:outline-none focus:ring-1 focus:ring-primary"><option value="Basic">Basic</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option></select></div>
          </div>

          <div className="p-3 rounded-lg bg-secondary/50 border border-border"><div className="flex items-start gap-2"><Info size={16} className="text-primary flex-shrink-0 mt-0.5" /><div className="text-base text-muted-foreground"><span className="font-semibold text-foreground block">{level}</span><span>{levelInfo[level].desc}</span></div></div></div>

          <div><label className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Number of Modules: <span className="text-foreground font-bold">{modules}</span></label><input type="range" min="1" max="12" value={modules} onChange={e => setModules(Number(e.target.value))} className="w-full" /><p className="text-[12px] text-muted-foreground mt-2">Estimated Duration: <span className="text-foreground font-mono font-bold">{modules * 2} hours</span> (assuming 2 hrs per module)</p></div>

          <div><label className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Program Description (Optional)</label><textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Add key topics, learning objectives, prerequisites..." rows={3} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" /></div>

          <div className="grid grid-cols-4 gap-2 p-3 rounded-lg bg-secondary/30 border border-border text-[12px]">
            {[{ label: "Status", value: "Draft" }, { label: "Created", value: "Today" }, { label: "Est. Hours", value: `${modules * 2}` }, { label: "Estimated Cost", value: "$2,400" }].map(s => (<div key={s.label}><div className="text-muted-foreground uppercase tracking-widest">{s.label}</div><div className="text-foreground font-bold">{s.value}</div></div>))}
          </div>

          <div className="flex gap-2.5 pt-2">
            <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-lg bg-secondary border border-border text-sm font-semibold text-foreground hover:bg-secondary/80 transition-colors">Cancel</button>
            <button onClick={() => { if (!title.trim()) { alert("Program title required"); return; } onConfirm(title, level, modules); }} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"><Plus size={16} />Create Program</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function LaunchScenarioModal({ scenario, onConfirm, onCancel }: { scenario: any; onConfirm: () => void; onCancel: () => void }) {
  const [duration, setDuration] = useState("4 hours");
  const [area, setArea] = useState("12.5");
  const [casualties, setCasualties] = useState("45");
  const [level, setLevel] = useState("Level 2");

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onCancel} />
      <motion.div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden" initial={{ opacity: 0, scale: 0.92, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 8 }} transition={{ duration: 0.25 }}>
        <div className={`h-1 w-full bg-gradient-to-r ${scenario.color === "text-orange-400" ? "from-orange-400" : "from-primary"} via-primary/60 to-transparent`} />
        <div className="p-6 space-y-5">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-3 mb-2">
              <scenario.icon size={22} className={scenario.color} />
              <h2 className="text-lg font-bold font-['Barlow_Condensed'] tracking-wide text-foreground">{scenario.name}</h2>
              <Badge status={scenario.severity}>{scenario.severity}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Configure and launch this disaster simulation scenario with participants.</p>
          </motion.div>

          <div className="bg-secondary/30 border border-border rounded-lg p-3 space-y-2">
            <div className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Simulation Parameters</div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-[12px] text-muted-foreground block mb-1">Simulation Duration</label><select value={duration} onChange={e => setDuration(e.target.value)} className="w-full bg-input-background border border-border rounded px-2 py-1 text-xs text-foreground"><option>2 hours</option><option>4 hours</option><option>6 hours</option><option>8 hours</option></select></div>
              <div><label className="text-[12px] text-muted-foreground block mb-1">Affected Area (km²)</label><input type="number" value={area} onChange={e => setArea(e.target.value)} className="w-full bg-input-background border border-border rounded px-2 py-1 text-xs text-foreground" /></div>
              <div><label className="text-[12px] text-muted-foreground block mb-1">Est. Casualties</label><input type="number" value={casualties} onChange={e => setCasualties(e.target.value)} className="w-full bg-input-background border border-border rounded px-2 py-1 text-xs text-foreground" /></div>
              <div><label className="text-[12px] text-muted-foreground block mb-1">Response Level</label><select value={level} onChange={e => setLevel(e.target.value)} className="w-full bg-input-background border border-border rounded px-2 py-1 text-xs text-foreground"><option>Level 1</option><option>Level 2</option><option>Level 3</option><option>Level 4</option></select></div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 p-3 rounded-lg bg-secondary/30 border border-border text-[12px]">
            {[{ label: "Start Time", value: "Now" }, { label: "Duration", value: duration }, { label: "Participants", value: "~30" }, { label: "Status", value: "Ready" }].map(s => (<div key={s.label}><div className="text-muted-foreground uppercase tracking-widest">{s.label}</div><div className="text-foreground font-bold">{s.value}</div></div>))}
          </div>

          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 flex items-start gap-2"><AlertTriangle size={16} className="text-primary flex-shrink-0 mt-0.5" /><div className="text-xs text-muted-foreground"><span className="font-semibold text-foreground block">Pre-Launch Checklist</span><span>Ensure all trainers are notified, participants briefed, and equipment ready before launch.</span></div></div>

          <div className="flex gap-2.5 pt-2">
            <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-lg bg-secondary border border-border text-sm font-semibold text-foreground hover:bg-secondary/80 transition-colors">Cancel</button>
            <button onClick={onConfirm} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"><Play size={16} />Launch Scenario</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function RegisterParticipantModal({ onConfirm, onCancel }: { onConfirm: (name: string, email: string, dept: string, role: string) => void; onCancel: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dept, setDept] = useState("");
  const [role, setRole] = useState("Responder");

  const depts = ["Rescue Alpha", "Medical Bravo", "Command HQ", "Supply Delta", "Hazmat Echo"];
  const roles = ["First Responder", "Team Leader", "Trainer", "Medical Officer", "Communications", "Logistics"];

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onCancel} />
      <motion.div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden" initial={{ opacity: 0, scale: 0.92, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 8 }} transition={{ duration: 0.25 }}>
        <div className="h-1 w-full bg-gradient-to-r from-blue-400 via-primary/60 to-transparent" />
        <div className="p-6 space-y-5">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-lg font-bold font-['Barlow_Condensed'] tracking-wide text-foreground">REGISTER NEW PARTICIPANT</h2>
            <p className="text-xs text-muted-foreground mt-1">Add a new personnel to the disaster preparedness training system with full profile information.</p>
          </motion.div>

          <div className="space-y-3">
            <div><label className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Full Name *</label><input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., John Smith" className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" /></div>
            <div><label className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Email Address *</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g., john.smith@ems.gov" className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Department *</label><select value={dept} onChange={e => setDept(e.target.value)} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"><option value="">Select Department</option>{depts.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
              <div><label className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Role *</label><select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-input-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"><option value="">Select Role</option>{roles.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 space-y-2">
            <div className="text-[12px] font-mono text-blue-400 uppercase tracking-widest font-bold">Registration Details</div>
            <div className="grid grid-cols-2 gap-2 text-[12px]"><div><span className="text-muted-foreground">Name:</span> <span className="text-foreground font-mono">{name || "—"}</span></div><div><span className="text-muted-foreground">Email:</span> <span className="text-foreground font-mono">{email || "—"}</span></div><div><span className="text-muted-foreground">Department:</span> <span className="text-foreground font-mono">{dept || "—"}</span></div><div><span className="text-muted-foreground">Role:</span> <span className="text-foreground font-mono">{role || "—"}</span></div></div>
          </div>

          <div className="p-3 rounded-lg bg-secondary/30 border border-border text-[12px] space-y-1">
            <div className="text-muted-foreground"><span className="font-semibold">✓</span> Welcome email will be sent automatically</div>
            <div className="text-muted-foreground"><span className="font-semibold">✓</span> Temporary password created and sent securely</div>
            <div className="text-muted-foreground"><span className="font-semibold">✓</span> Participant can self-register for available drills</div>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-lg bg-secondary border border-border text-sm font-semibold text-foreground hover:bg-secondary/80 transition-colors">Cancel</button>
            <button onClick={() => { if (!name.trim() || !email.trim() || !dept || !role) { alert("All fields required"); return; } onConfirm(name, email, dept, role); }} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"><UserPlus size={16} />Register Participant</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ExportContextModal({ type, count, onConfirm, onCancel }: { type: string; count: number; onConfirm: () => void; onCancel: () => void }) {
  const [format, setFormat] = useState("csv");
  const [includeDetails, setIncludeDetails] = useState(true);

  const exportInfo: Record<string, { desc: string; color: string; fields: string[] }> = {
    participants: { desc: "Export all registered participants and their profiles", color: "text-blue-400", fields: ["ID", "Name", "Email", "Department", "Role", "Status", "Enrollment Date"] },
    sessions: { desc: "Export all training sessions and scheduling data", color: "text-green-400", fields: ["ID", "Course", "Date", "Location", "Trainer", "Enrolled", "Capacity"] },
    programs: { desc: "Export all training programs and curriculum data", color: "text-orange-400", fields: ["ID", "Title", "Level", "Modules", "Duration", "Status", "Created Date"] },
    attendance: { desc: "Export every participant's training attendance record", color: "text-primary", fields: ["ID", "Participant", "Program", "Date", "Status", "Score"] },
  };

  const info = exportInfo[type] || exportInfo.participants;

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onCancel} />
      <motion.div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden" initial={{ opacity: 0, scale: 0.92, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 8 }} transition={{ duration: 0.25 }}>
        <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/60 to-transparent" />
        <div className="p-6 space-y-5">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-lg font-bold font-['Barlow_Condensed'] tracking-wide text-foreground">EXPORT DATA</h2>
            <p className="text-xs text-muted-foreground mt-1">{info.desc}</p>
          </motion.div>

          <div className="p-3 rounded-lg bg-secondary/50 border border-border"><div className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Export Summary</div><div className="flex justify-between items-center"><span className="text-sm font-semibold text-foreground">{type.charAt(0).toUpperCase() + type.slice(1)}</span><span className="text-lg font-bold text-primary">{count}</span></div><div className="text-[12px] text-muted-foreground mt-2">{count} record{count !== 1 ? "s" : ""} will be exported</div></div>

          <div className="space-y-3">
            <div><label className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Export Format</label><div className="flex gap-2">{[{ id: "csv", label: "CSV", desc: "Spreadsheet compatible" }, { id: "json", label: "JSON", desc: "Data interchange format" }, { id: "pdf", label: "PDF", desc: "Report document" }].map(f => <button key={f.id} onClick={() => setFormat(f.id)} className={`flex-1 p-2 rounded-md border transition-colors ${format === f.id ? "bg-primary/20 border-primary text-primary" : "bg-secondary border-border text-muted-foreground hover:border-primary/50"}`}><div className="text-xs font-semibold">{f.label}</div><div className="text-[12px] text-muted-foreground">{f.desc}</div></button>)}</div></div>

            <label className="flex items-center gap-2 p-2 rounded-md bg-secondary/30 cursor-pointer hover:bg-secondary/50 transition-colors"><input type="checkbox" checked={includeDetails} onChange={e => setIncludeDetails(e.target.checked)} className="w-4 h-4" /><span className="text-xs text-foreground flex-1">Include detailed information & metadata</span></label>
          </div>

          <div className="p-3 rounded-lg bg-secondary/30 border border-border"><div className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Fields Included</div><div className="flex flex-wrap gap-1">{info.fields.map(f => <span key={f} className="text-[12px] font-mono px-2 py-1 rounded bg-primary/10 border border-primary/20 text-primary">{f}</span>)}</div></div>

          <div className="flex gap-2.5 pt-2">
            <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-lg bg-secondary border border-border text-sm font-semibold text-foreground hover:bg-secondary/80 transition-colors">Cancel</button>
            <button onClick={onConfirm} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"><Download size={16} />Export {count} Records</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TrainingModule() {
  const [tab, setTab] = useState<TrainingTab>("curriculum");
  const [showNewProgram, setShowNewProgram] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState<"programs" | "sessions">("programs");
  const courses = [
    { id: "CRS-001", title: "Basic Earthquake Response", level: "Basic", modules: 5, duration: "4 hrs", status: "Active" },
    { id: "CRS-002", title: "Advanced Flood Evacuation Protocols", level: "Advanced", modules: 8, duration: "6 hrs", status: "Active" },
    { id: "CRS-003", title: "Wildfire Containment Basics", level: "Basic", modules: 4, duration: "3 hrs", status: "Active" },
    { id: "CRS-004", title: "Chemical Hazmat Level 2", level: "Advanced", modules: 10, duration: "12 hrs", status: "Draft" },
    { id: "CRS-005", title: "Mass Casualty Incident Management", level: "Intermediate", modules: 7, duration: "8 hrs", status: "Active" },
  ];
  const sessions = [
    { id: "SES-001", course: "Basic Earthquake Response", date: "Jul 03", time: "08:00–12:00", location: "District 4 EOC", trainer: "Maj. Reyes", enrolled: 42, capacity: 60 },
    { id: "SES-002", course: "Advanced Flood Evacuation", date: "Jul 08", time: "09:00–15:00", location: "Virtual — MS Teams", trainer: "Capt. Santos", enrolled: 89, capacity: 100 },
    { id: "SES-003", course: "Hazmat Level 2", date: "Jul 10", time: "07:00–19:00", location: "Industrial Zone Fac.", trainer: "Dr. Villanueva", enrolled: 17, capacity: 30 },
  ];
  const resources = [
    { name: "Maj. Reyes", type: "Trainer", spec: "Seismic Response", available: true },
    { name: "Capt. Santos", type: "Trainer", spec: "Flood/Water Rescue", available: true },
    { name: "Dr. Villanueva", type: "Trainer", spec: "Hazmat / Chemical", available: false },
    { name: "SCBA Units (×12)", type: "Equipment", spec: "Hazmat / Fire", available: true },
    { name: "District 4 EOC", type: "Venue", spec: "Multi-purpose", available: true },
  ];
  const app = useApp();

  return (
    <div className="space-y-5">
      {showNewProgram && (
        <NewProgramModal
          onConfirm={(title, level, modules) => {
            app.addProgram({ id: "", title, level, modules, duration: `${modules * 2} hrs`, status: "Draft" });
            app.addNotification({ type: "Program", subject: `Program created: ${title}`, status: "Sent" });
            setShowNewProgram(false);
          }}
          onCancel={() => setShowNewProgram(false)}
        />
      )}
      {showExportModal && (
        <ExportContextModal
          type={exportType}
          count={exportType === "programs" ? courses.length : sessions.length}
          onConfirm={() => {
            app.exportCSV(exportType);
            setShowExportModal(false);
          }}
          onCancel={() => setShowExportModal(false)}
        />
      )}
      <div className="flex items-center justify-between">
        <div><h1 className="text-4xl font-bold font-['Barlow_Condensed'] tracking-wide text-foreground">TRAINING PROGRAM MANAGEMENT</h1><p className="text-muted-foreground text-base mt-0.5">Curriculum · scheduling · resource allocation</p></div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowNewProgram(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-base font-semibold hover:bg-primary/90 transition-colors"><Plus size={16} />New Program</button>
          <button onClick={() => { setExportType("programs"); setShowExportModal(true); }} className="flex items-center gap-2 bg-secondary text-muted-foreground px-3 py-2 rounded-md text-base font-semibold hover:bg-secondary/90 transition-colors"><Download size={16} />Export</button>
        </div>
      </div>
      <TabBar tabs={[{ id: "curriculum", label: "Curriculum Builder", icon: BookMarked }, { id: "schedule", label: "Scheduling", icon: Calendar }, { id: "resources", label: "Resource Allocation", icon: Package }]} active={tab} onChange={v => setTab(v as TrainingTab)} />
      {tab === "curriculum" && (
        <div className="space-y-2">
          {courses.map(c => (
            <div key={c.id} className="bg-card border border-border rounded-lg p-4 hover:border-[rgba(240,165,0,0.2)] transition-colors group">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5"><span className="text-[12px] font-mono text-muted-foreground">{c.id}</span><Badge status={c.status}>{c.status}</Badge><Badge status={c.level}>{c.level}</Badge></div>
                  <h3 className="text-sm font-semibold text-foreground">{c.title}</h3>
                </div>
                <div className="flex gap-6 text-center">
                  <div><div className="text-lg font-bold font-['Barlow_Condensed'] text-foreground">{c.modules}</div><div className="text-[12px] font-mono text-muted-foreground">modules</div></div>
                  <div><div className="text-lg font-bold font-['Barlow_Condensed'] text-foreground">{c.duration}</div><div className="text-[12px] font-mono text-muted-foreground">duration</div></div>
                </div>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-secondary flex items-center gap-1"><Edit2 size={12} />Edit</button>
                  <button className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-secondary flex items-center gap-1"><Eye size={12} />View</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === "schedule" && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-secondary/40">{["ID", "Course", "Date", "Location", "Trainer", "Enrollment", ""].map(h => <th key={h} className="text-left text-[12px] font-mono font-medium text-muted-foreground uppercase tracking-widest px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>{sessions.map((s, i) => { const pct = Math.round(s.enrolled / s.capacity * 100); return (<tr key={s.id} className={`border-b border-border hover:bg-secondary/30 ${i === sessions.length - 1 ? "border-b-0" : ""}`}><td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.id}</td><td className="px-4 py-3 text-xs font-semibold text-foreground">{s.course}</td><td className="px-4 py-3"><div className="text-xs font-mono text-foreground">{s.date}</div><div className="text-[12px] font-mono text-muted-foreground">{s.time}</div></td><td className="px-4 py-3 text-xs text-muted-foreground">{s.location}</td><td className="px-4 py-3 text-xs text-muted-foreground">{s.trainer}</td><td className="px-4 py-3 min-w-[120px]"><div className="flex items-center gap-2"><div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden"><div className={`h-full rounded-full ${pct > 85 ? "bg-red-400" : "bg-primary"}`} style={{ width: `${pct}%` }} /></div><span className="text-[12px] font-mono text-muted-foreground">{s.enrolled}/{s.capacity}</span></div></td><td className="px-4 py-3"><button className="text-muted-foreground hover:text-foreground"><MoreHorizontal size={16} /></button></td></tr>); })}</tbody>
          </table>
        </div>
      )}
      {tab === "resources" && (
        <div className="space-y-2">
          {resources.map(r => (
            <div key={r.name} className="bg-card border border-border rounded-lg p-3 flex items-center gap-4 hover:border-[rgba(240,165,0,0.2)] transition-colors">
              <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
                {r.type === "Trainer" ? <User size={15} className="text-muted-foreground" /> : r.type === "Equipment" ? <Package size={15} className="text-muted-foreground" /> : <Building2 size={15} className="text-muted-foreground" />}
              </div>
              <div className="flex-1"><div className="text-sm font-semibold text-foreground">{r.name}</div><div className="text-[12px] font-mono text-muted-foreground">{r.type} · {r.spec}</div></div>
              <span className={`flex items-center gap-1 text-[12px] font-mono ${r.available ? "text-green-400" : "text-orange-400"}`}><span className={`w-1.5 h-1.5 rounded-full ${r.available ? "bg-green-400" : "bg-orange-400"}`} />{r.available ? "Available" : "Committed"}</span>
              <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal size={16} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SimModule() {
  const [tab, setTab] = useState<SimTab>("selector");
  const [showLaunchDialog, setShowLaunchDialog] = useState(false);
  const templates = [
    { id: "EQ", name: "Earthquake", icon: Zap, severity: "Extreme", color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
    { id: "FL", name: "Flood / Storm Surge", icon: Droplets, severity: "High", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
    { id: "FR", name: "Wildfire", icon: Flame, severity: "High", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
    { id: "TY", name: "Typhoon", icon: Wind, severity: "Extreme", color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/20" },
    { id: "HZ", name: "Hazmat Spill", icon: Shield, severity: "Critical", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
    { id: "MH", name: "Multi-Hazard Cascade", icon: Layers, severity: "Extreme", color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
  ];
  const app = useApp();
  const [sel, setSel] = useState(templates[0]);
  const injects = [
    { time: "T+05:00", event: "Power grid fails — backup generators activated", type: "complication" as const },
    { time: "T+12:00", event: "Main exit blocked by structural debris", type: "complication" as const },
    { time: "T+18:00", event: "Additional medical team arrives", type: "resource" as const },
    { time: "T+25:00", event: "Secondary gas leak — expand exclusion zone", type: "decision" as const },
    { time: "T+40:00", event: "Communications tower down — radio only", type: "complication" as const },
  ];
  const roles = [
    { name: "Incident Commander", abbr: "IC", count: 1 },
    { name: "Operations Section Chief", abbr: "OPS", count: 2 },
    { name: "First Responder", abbr: "FR", count: 8 },
    { name: "Medical Officer", abbr: "MED", count: 4 },
    { name: "Communications Officer", abbr: "COMM", count: 2 },
    { name: "Evacuee (Observer)", abbr: "EVA", count: 12 },
  ];
  const injectColors = { complication: "border-red-400/30 bg-red-400/5 text-red-400", resource: "border-green-400/30 bg-green-400/5 text-green-400", decision: "border-yellow-400/30 bg-yellow-400/5 text-yellow-400" };
  return (
    <div className="space-y-5">
      {showLaunchDialog && (
        <LaunchScenarioModal
          scenario={sel}
          onConfirm={() => {
            const session = { id: "", course: sel.name, date: new Date().toLocaleDateString(), time: "TBD", location: "Live", trainer: "Automated", enrolled: 0, capacity: 100 };
            const id = app.createSession(session);
            app.launchSession(id);
            app.addNotification({ type: "Simulation", subject: `Launched: ${sel.name}`, status: "Sent" });
            setShowLaunchDialog(false);
          }}
          onCancel={() => setShowLaunchDialog(false)}
        />
      )}
      <div className="flex items-center justify-between">
        <div><h1 className="text-4xl font-bold font-['Barlow_Condensed'] tracking-wide text-foreground">SIMULATION SCENARIO BUILDER</h1><p className="text-muted-foreground text-base mt-0.5">Disaster type · variable injector · role configuration</p></div>
        <button onClick={() => setShowLaunchDialog(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-base font-semibold hover:bg-primary/90"><Play size={16} />Launch Scenario</button>
      </div>
      <TabBar tabs={[{ id: "selector", label: "Disaster Type Selector", icon: Target }, { id: "injector", label: "Variable Injector", icon: Sliders }, { id: "roles", label: "Role Configuration", icon: Users }]} active={tab} onChange={v => setTab(v as SimTab)} />
      {tab === "selector" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">{templates.map(t => { const Icon = t.icon; const active = sel.id === t.id; return (<button key={t.id} onClick={() => setSel(t)} className={`text-left p-3 rounded-lg border transition-all ${active ? `${t.border} ${t.bg}` : "border-border bg-card hover:border-border/80"}`}><div className="flex items-center gap-2 mb-1"><Icon size={16} className={active ? t.color : "text-muted-foreground"} /><span className="text-xs font-semibold text-foreground">{t.name}</span>{active && <Check size={13} className="text-primary ml-auto" />}</div><Badge status={t.severity}>{t.severity}</Badge></button>); })}</div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm font-semibold text-foreground mb-3">Configure: {sel.name}</div>
            <div className="grid grid-cols-4 gap-3">{["Simulation Duration", "Affected Area (km²)", "Est. Casualties", "Response Level"].map(f => (<div key={f}><label className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest block mb-1">{f}</label><input defaultValue={f.includes("Duration") ? "4 hours" : f.includes("Area") ? "12.5" : f.includes("Cas") ? "45" : "Level 2"} className="w-full bg-input-background border border-border rounded-md px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary" /></div>))}</div>
          </div>
        </div>
      )}
      {tab === "injector" && (
        <div className="space-y-3">
          {injects.map((inj, idx) => (
            <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg border ${injectColors[inj.type]}`}>
              <span className="text-[12px] font-mono font-bold mt-0.5">{inj.time}</span>
              <span className="flex-1 text-xs text-foreground">{inj.event}</span>
              <span className={`text-[12px] font-mono capitalize ${injectColors[inj.type].split(" ")[2]}`}>{inj.type}</span>
            </div>
          ))}
          <button className="w-full flex items-center justify-center gap-2 border border-dashed border-border rounded-lg p-3 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"><PlusCircle size={14} />Add Inject</button>
        </div>
      )}
      {tab === "roles" && (
        <div className="grid grid-cols-2 gap-3">{roles.map(r => (<div key={r.name} className="bg-card border border-border rounded-lg p-3 flex items-center gap-3"><span className="text-xs font-mono font-bold text-primary border border-primary/30 bg-primary/10 px-2 py-1 rounded">{r.abbr}</span><div className="flex-1"><div className="text-xs font-semibold text-foreground">{r.name}</div></div><div className="flex items-center gap-1"><button className="w-5 h-5 rounded bg-secondary flex items-center justify-center text-xs text-muted-foreground">−</button><span className="text-xs font-mono text-foreground w-5 text-center">{r.count}</span><button className="w-5 h-5 rounded bg-secondary flex items-center justify-center text-xs text-muted-foreground">+</button></div></div>))}</div>
      )}
    </div>
  );
}

function ParticipantsModule() {
  const [tab, setTab] = useState<ParticipantTab>("profiles");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const app = useApp();
  const participants = [
    { id: "P-001", name: "Maria Santos", dept: "Rescue Alpha", role: "Team Leader", level: "Advanced", certs: ["CERT-A", "First Aid", "SCBA"], status: "Active", enrolled: 3 },
    { id: "P-002", name: "Jose Reyes", dept: "Medical Bravo", role: "Medic", level: "Intermediate", certs: ["EMT-B", "CPR"], status: "Active", enrolled: 2 },
    { id: "P-003", name: "Ana Cruz", dept: "Command HQ", role: "Communications", level: "Advanced", certs: ["CERT-A", "ICS-200"], status: "Active", enrolled: 4 },
    { id: "P-004", name: "Carlos Bautista", dept: "Supply Delta", role: "Logistics", level: "Basic", certs: ["First Aid"], status: "Pending", enrolled: 1 },
    { id: "P-005", name: "Elena Villanueva", dept: "Hazmat Echo", role: "Hazmat Specialist", level: "Advanced", certs: ["HAZMAT-OPS", "SCBA"], status: "Active", enrolled: 5 },
  ];
  return (
    <div className="space-y-5">
      {showRegisterModal && (
        <RegisterParticipantModal
          onConfirm={(name, email, dept, role) => {
            app.registerParticipant({ id: "", name, email, dept, role, status: "Pending" });
            app.addNotification({ type: "Registration", subject: `Registered: ${name}`, status: "Queued" });
            setShowRegisterModal(false);
          }}
          onCancel={() => setShowRegisterModal(false)}
        />
      )}
      {showExportModal && (
        <ExportContextModal
          type={tab === "attendance" ? "attendance" : "participants"}
          count={tab === "attendance" ? app.attendanceRecords.length : participants.length}
          onConfirm={() => {
            app.exportCSV(tab === "attendance" ? "attendance" : "participants");
            setShowExportModal(false);
          }}
          onCancel={() => setShowExportModal(false)}
        />
      )}
      <div className="flex items-center justify-between">
        <div><h1 className="text-4xl font-bold font-['Barlow_Condensed'] tracking-wide text-foreground">PARTICIPANT REGISTRATION</h1><p className="text-muted-foreground text-base mt-0.5">Profiles · attendance records · self-service portal · notifications</p></div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowRegisterModal(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-base font-semibold hover:bg-primary/90"><Plus size={16} />Register</button>
          <button onClick={() => setShowExportModal(true)} className="flex items-center gap-2 bg-secondary text-muted-foreground px-3 py-2 rounded-md text-base font-semibold hover:bg-secondary/90"><ClipboardList size={16} />Export</button>
        </div>
      </div>
      <TabBar tabs={[{ id: "profiles", label: "User Profiles", icon: UserCheck }, { id: "attendance", label: "Attendance Records", icon: ClipboardList }, { id: "portal", label: "Self-Service Portal", icon: LogIn }, { id: "notifications", label: "Notifications", icon: Mail }]} active={tab} onChange={v => setTab(v as ParticipantTab)} />
      {tab === "profiles" && (
        <div className="space-y-2">{participants.map(p => {
          const history = app.getAttendanceFor(p.id);
          const completedCount = history.filter(r => r.status === "Completed").length;
          const isOpen = expandedId === p.id;
          return (
            <div key={p.id} className="bg-card border border-border rounded-lg overflow-hidden hover:border-[rgba(240,165,0,0.2)] transition-colors">
              <div className="p-3 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">{p.name.split(" ").map(n => n[0]).join("")}</div>
                <div className="flex-1 grid grid-cols-4 gap-4">
                  <div><div className="text-xs font-semibold text-foreground">{p.name}</div><div className="text-[12px] text-muted-foreground">{p.role} · {p.dept}</div></div>
                  <div><div className="flex flex-wrap gap-1">{p.certs.map(c => <span key={c} className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{c}</span>)}</div></div>
                  <div className="flex items-center gap-1.5"><Badge status={p.status}>{p.status}</Badge><Badge status={p.level}>{p.level}</Badge></div>
                  <div className="text-xs font-mono text-muted-foreground">{completedCount} program{completedCount === 1 ? "" : "s"} attended</div>
                </div>
                <button onClick={() => setExpandedId(isOpen ? null : p.id)} className="flex items-center gap-1 text-[12px] font-mono text-muted-foreground hover:text-foreground px-2 py-1 rounded-md bg-secondary/60">
                  <ClipboardList size={13} />Attendance{isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
                <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal size={16} /></button>
              </div>
              {isOpen && (
                <div className="border-t border-border bg-secondary/30 p-3 space-y-1.5">
                  {history.length === 0 ? (
                    <p className="text-[12px] text-muted-foreground px-1">No attendance records for this participant yet.</p>
                  ) : history.map(r => (
                    <div key={r.id} className="flex items-center gap-3 bg-card border border-border rounded-md px-3 py-2">
                      <span className="text-xs text-foreground flex-1">{r.program}</span>
                      <span className="text-[12px] font-mono text-muted-foreground">{new Date(r.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</span>
                      {typeof r.score === "number" && <span className="text-[12px] font-mono text-muted-foreground">{r.score}%</span>}
                      <Badge status={r.status}>{r.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}</div>
      )}
      {tab === "attendance" && (
        <div className="space-y-2">
          <div className="bg-card border border-primary/15 rounded-lg p-4 flex items-center gap-3"><Info size={16} className="text-primary" /><p className="text-xs text-muted-foreground">Every registered participant's training attendance is logged here — visible to Admin and Super Admin roles, and mirrored on each participant's own portal.</p></div>
          {app.attendanceRecords.map(r => (
            <div key={r.id} className="bg-card border border-border rounded-lg p-3 flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">{r.participantName.split(" ").map(n => n[0]).join("")}</div>
              <div className="flex-1 grid grid-cols-3 gap-4">
                <div><div className="text-xs font-semibold text-foreground">{r.participantName}</div><div className="text-[12px] text-muted-foreground">{r.participantId ?? "—"}</div></div>
                <div><div className="text-xs text-foreground">{r.program}</div><div className="text-[12px] font-mono text-muted-foreground">{new Date(r.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</div></div>
                <div className="flex items-center gap-2"><Badge status={r.status}>{r.status}</Badge>{typeof r.score === "number" && <span className="text-[12px] font-mono text-muted-foreground">{r.score}%</span>}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === "portal" && (
        <div className="bg-card border border-primary/15 rounded-lg p-4 flex items-center gap-3"><Info size={16} className="text-primary" /><p className="text-xs text-muted-foreground">Self-service drill sign-up portal is available to all registered participants. Manage slot capacity and open/close registration per session.</p></div>
      )}
      {tab === "notifications" && (
        <div className="space-y-2">{[
          { id: "NTF-001", type: "Confirmation", recipient: "Maria Santos", subject: "Drill Confirmation — Jul 03 Earthquake Response", status: "Sent", sent: "Jun 29" },
          { id: "NTF-002", type: "Waiver", recipient: "Carlos Bautista", subject: "Digital Waiver — Hazmat Level 2 (action required)", status: "Queued", sent: "—" },
          { id: "NTF-003", type: "Study Material", recipient: "All SES-002 Enrollees", subject: "Pre-drill reading: Advanced Flood Evacuation SOP v3", status: "Sent", sent: "Jun 28" },
        ].map(n => (<div key={n.id} className="bg-card border border-border rounded-lg p-3 flex items-center gap-4"><span className="text-[11px] font-mono px-2 py-1 rounded bg-secondary text-muted-foreground">{n.type}</span><div className="flex-1"><div className="text-xs text-foreground">{n.subject}</div><div className="text-[12px] font-mono text-muted-foreground">{n.recipient}</div></div><Badge status={n.status}>{n.status}</Badge><span className="text-[12px] font-mono text-muted-foreground">{n.sent}</span></div>))}</div>
      )}
    </div>
  );
}

const trendHistory = [
  { drill: "D1", avgScore: 61, passRate: 58, respTime: 8.2 }, { drill: "D2", avgScore: 67, passRate: 64, respTime: 7.5 },
  { drill: "D3", avgScore: 72, passRate: 70, respTime: 6.8 }, { drill: "D4", avgScore: 69, passRate: 66, respTime: 7.1 },
  { drill: "D5", avgScore: 78, passRate: 75, respTime: 5.9 }, { drill: "D6", avgScore: 82, passRate: 81, respTime: 5.2 },
];

function EvalModule() {
  const [tab, setTab] = useState<EvalTab>("objectives");
  const [objs, setObjs] = useState([
    { id: 1, text: "IC assumes command on radio net", done: true, time: "1:42", limit: "2 min" },
    { id: 2, text: "Gas valve shut off at utility panel", done: true, time: "1:58", limit: "2 min" },
    { id: 3, text: "Evacuation route cleared and opened", done: false, time: "6:12", limit: "5 min" },
    { id: 4, text: "Triage zone with START protocol", done: true, time: "4:31", limit: "5 min" },
    { id: 5, text: "SITREP transmitted to EOC", done: true, time: "9:05", limit: "10 min" },
    { id: 6, text: "Accountability check completed", done: false, time: "—", limit: "10 min" },
  ]);
  const passed = objs.filter(o => o.done).length;
  const radarData = [
    { subject: "Command", A: 88, B: 72 }, { subject: "Response", A: 75, B: 80 },
    { subject: "Comms", A: 92, B: 65 }, { subject: "Protocols", A: 85, B: 78 },
    { subject: "Safety", A: 90, B: 82 }, { subject: "Coord.", A: 78, B: 70 },
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold font-['Barlow_Condensed'] tracking-wide text-foreground">PERFORMANCE EVALUATION</h1><p className="text-muted-foreground text-sm mt-0.5">Objective tracking · analytics · assessor dashboard</p></div>
        <div className="text-xs font-mono text-muted-foreground bg-secondary px-3 py-2 rounded-md">Earthquake Response — Advanced · Jun 28</div>
      </div>
      <TabBar tabs={[{ id: "objectives", label: "Objective Tracking", icon: CheckSquare }, { id: "analytics", label: "Analytics", icon: BarChart3 }, { id: "assessor", label: "Assessor Dashboard", icon: Smartphone }]} active={tab} onChange={v => setTab(v as EvalTab)} />
      {tab === "objectives" && (
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-3">{[{ label: "Total", value: objs.length, color: "text-foreground" }, { label: "Passed", value: passed, color: "text-green-400" }, { label: "Missed", value: objs.length - passed, color: "text-red-400" }, { label: "Score", value: `${Math.round(passed / objs.length * 100)}%`, color: "text-primary" }].map(s => (<div key={s.label} className="bg-card border border-border rounded-lg p-4"><div className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest mb-1">{s.label}</div><div className={`text-2xl font-bold font-['Barlow_Condensed'] ${s.color}`}>{s.value}</div></div>))}</div>
          <div className="bg-card border border-border rounded-lg divide-y divide-border">
            {objs.map(o => (<div key={o.id} className="flex items-center gap-4 px-4 py-3 hover:bg-secondary/30"><button onClick={() => setObjs(prev => prev.map(x => x.id === o.id ? { ...x, done: !x.done } : x))}>{o.done ? <CheckSquare size={17} className="text-green-400" /> : <Square size={17} className="text-muted-foreground" />}</button><span className="flex-1 text-xs text-foreground">{o.text}</span><span className={`text-xs font-mono font-bold ${o.done ? "text-green-400" : "text-red-400"}`}>{o.time}</span><span className="text-[12px] font-mono text-muted-foreground">/ {o.limit}</span></div>))}
          </div>
        </div>
      )}
      {tab === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-lg p-5"><h3 className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest mb-4">Competency Radar</h3><ResponsiveContainer width="100%" height={220}><RadarChart data={radarData}><PolarGrid stroke="rgba(240,246,252,0.08)" /><PolarAngleAxis dataKey="subject" tick={{ fill: "#8b949e", fontSize: 10, fontFamily: "JetBrains Mono" }} /><Radar key="radar-eval-alpha" name="Rescue Alpha" dataKey="A" stroke="#f0a500" fill="#f0a500" fillOpacity={0.15} strokeWidth={2} /><Radar key="radar-eval-bravo" name="Medical Bravo" dataKey="B" stroke="#58a6ff" fill="#58a6ff" fillOpacity={0.1} strokeWidth={2} /><Tooltip contentStyle={{ background: "#1c2128", border: "1px solid rgba(240,246,252,0.1)", borderRadius: 6, fontSize: 11 }} /></RadarChart></ResponsiveContainer></div>
          <div className="bg-card border border-border rounded-lg p-5"><h3 className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest mb-3">Individual Scores</h3><div className="space-y-2">{[{ name: "Maria Santos", score: 94 }, { name: "Jose Reyes", score: 76 }, { name: "Carlos Bautista", score: 58 }, { name: "Ana Cruz", score: 88 }, { name: "Elena Villanueva", score: 91 }].map(p => (<div key={p.name} className="flex items-center gap-3"><span className="text-xs text-foreground w-36 truncate">{p.name}</span><div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden"><div className={`h-full rounded-full ${p.score >= 80 ? "bg-green-400" : p.score >= 65 ? "bg-primary" : "bg-red-400"}`} style={{ width: `${p.score}%` }} /></div><span className={`text-xs font-mono font-bold w-8 text-right ${p.score >= 80 ? "text-green-400" : p.score >= 65 ? "text-primary" : "text-red-400"}`}>{p.score}</span></div>))}</div></div>
        </div>
      )}
      {tab === "assessor" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-lg p-5 space-y-4"><h3 className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest">Quick Score Entry</h3>
            <select className="w-full bg-input-background border border-border rounded-md px-2 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"><option>Maria Santos</option><option>Jose Reyes</option><option>Carlos Bautista</option></select>
            <div className="grid grid-cols-2 gap-3">{["Command", "Protocols", "Response Speed", "Coordination"].map(c => (<div key={c}><label className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest block mb-1">{c}</label><input type="number" min="0" max="100" defaultValue={Math.floor(Math.random() * 20 + 75)} className="w-full bg-input-background border border-border rounded-md px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary" /></div>))}</div>
            <textarea rows={3} placeholder="Field observations..." className="w-full bg-input-background border border-border rounded-md px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
            <button className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 rounded-md text-sm font-semibold hover:bg-primary/90"><Send size={15} />Submit</button>
          </div>
          <div className="bg-card border border-border rounded-lg p-5 space-y-3"><h3 className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest">Recent Submissions</h3>{[{ name: "Maria Santos", score: 94, note: "Excellent command presence." }, { name: "Ana Cruz", score: 88, note: "Strong comms, minor SITREP delay." }, { name: "Jose Reyes", score: 76, note: "Triage initiated, slow IC comms." }].map((s, i) => (<div key={i} className="p-2.5 rounded-md bg-secondary/60"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-foreground">{s.name}</span><span className={`text-xs font-bold font-mono ${s.score >= 80 ? "text-green-400" : "text-primary"}`}>{s.score}</span></div><p className="text-[12px] text-muted-foreground mt-0.5">{s.note}</p></div>))}</div>
        </div>
      )}
    </div>
  );
}

function ReportModule() {
  const [tab, setTab] = useState<ReportTab>("aar");
  const compliance = [
    { name: "Fire Safety", score: 94, target: 90, status: "Passed" }, { name: "Earthquake Protocol", score: 82, target: 85, status: "Failed" },
    { name: "Flood Evacuation", score: 91, target: 90, status: "Passed" }, { name: "Hazmat Response", score: 88, target: 85, status: "Passed" },
    { name: "Mass Casualty", score: 79, target: 80, status: "Failed" }, { name: "Communications", score: 96, target: 90, status: "Passed" },
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold font-['Barlow_Condensed'] tracking-wide text-foreground">DISASTER DRILL REPORTING</h1><p className="text-muted-foreground text-sm mt-0.5">After-action reports · compliance · trend analysis</p></div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold hover:bg-primary/90"><Download size={16} />Export</button>
      </div>
      <TabBar tabs={[{ id: "aar", label: "After-Action Report", icon: FileCheck }, { id: "compliance", label: "Compliance Analytics", icon: Shield }, { id: "trends", label: "Trend Analysis", icon: Trend }]} active={tab} onChange={v => setTab(v as ReportTab)} />
      {tab === "aar" && (
        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <div><div className="flex items-center gap-2 mb-1"><span className="text-[12px] font-mono text-muted-foreground">RPT-2026-018</span><Badge status="Completed">Completed</Badge></div><h2 className="text-lg font-bold font-['Barlow_Condensed'] text-foreground">Earthquake Response — Advanced</h2><div className="flex gap-4 mt-1 text-xs font-mono text-muted-foreground"><span>Jun 28, 2026</span><span>·</span><span>District 4 EOC</span><span>·</span><span>42 participants</span></div></div>
          <div className="grid grid-cols-2 gap-4">
            <div><div className="text-[12px] font-mono text-green-400 uppercase tracking-widest mb-2">Strengths</div><div className="space-y-1.5">{["Rapid medical deployment — triage in 4:31 (target: 5 min)", "Communications protocols maintained throughout all phases", "Gas valve shutoff avg 1:52 across all teams"].map((s, i) => (<div key={i} className="flex items-start gap-2 p-2 rounded bg-green-500/5 border border-green-500/10"><span className="w-1 h-1 rounded-full bg-green-400 mt-1.5 flex-shrink-0" /><span className="text-xs text-muted-foreground">{s}</span></div>))}</div></div>
            <div><div className="text-[12px] font-mono text-red-400 uppercase tracking-widest mb-2">Gaps & Failures</div><div className="space-y-1.5">{["Evacuation signage inadequate in Sector C — avg time 6:12 vs 5:00 target", "Accountability check missed by 4 teams within 10-minute limit", "Equipment cache access delayed 3–5 min by procedural bottleneck"].map((g, i) => (<div key={i} className="flex items-start gap-2 p-2 rounded bg-red-500/5 border border-red-500/10"><span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 flex-shrink-0" /><span className="text-xs text-muted-foreground">{g}</span></div>))}</div></div>
          </div>
          <div><div className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Recommendations</div><div className="space-y-1.5">{[{ p: "Critical", t: "Update Sector C maps and install additional signage" }, { p: "High", t: "Streamline cache retrieval — pre-position equipment" }, { p: "Medium", t: "ICS refresher for 4 newly assigned team leads" }].map((r, i) => (<div key={i} className="flex items-start gap-2 p-2 rounded bg-secondary/50"><Badge status={r.p}>{r.p}</Badge><span className="text-xs text-muted-foreground">{r.t}</span></div>))}</div></div>
        </div>
      )}
      {tab === "compliance" && (
        <div className="space-y-3">{compliance.map(c => (<div key={c.name} className="flex items-center gap-4 p-3 rounded-lg bg-card border border-border"><span className="text-xs text-foreground w-36">{c.name}</span><div className="flex-1 relative h-6 bg-secondary rounded"><div className={`h-full rounded ${c.score >= c.target ? "bg-green-500/30" : "bg-red-500/20"}`} style={{ width: `${c.score}%` }} /><div className="absolute top-0 bottom-0 border-l-2 border-dashed border-yellow-400/60" style={{ left: `${c.target}%` }} /><span className="absolute right-2 top-1/2 -translate-y-1/2 text-[12px] font-mono font-bold text-foreground">{c.score}%</span></div><span className="text-[12px] font-mono text-muted-foreground w-16">min {c.target}%</span><Badge status={c.status}>{c.status}</Badge></div>))}</div>
      )}
      {tab === "trends" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">{[{ label: "Score Improvement", value: "+21pts", color: "text-green-400" }, { label: "Pass Rate Growth", value: "+23%", color: "text-primary" }, { label: "Response Time Δ", value: "−3.0 min", color: "text-blue-400" }].map(s => (<div key={s.label} className="bg-card border border-border rounded-lg p-4"><div className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest mb-1">{s.label}</div><div className={`text-2xl font-bold font-['Barlow_Condensed'] ${s.color}`}>{s.value}</div></div>))}</div>
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest mb-4">Score & Pass Rate Trends</h3>
            <ResponsiveContainer width="100%" height={200}><AreaChart data={trendHistory} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}><defs><linearGradient id="rpt-score-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f0a500" stopOpacity={0.2} /><stop offset="95%" stopColor="#f0a500" stopOpacity={0} /></linearGradient><linearGradient id="rpt-pass-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3fb950" stopOpacity={0.2} /><stop offset="95%" stopColor="#3fb950" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="rgba(240,246,252,0.06)" /><XAxis dataKey="drill" tick={{ fill: "#8b949e", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} /><YAxis domain={[50, 100]} tick={{ fill: "#8b949e", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: "#1c2128", border: "1px solid rgba(240,246,252,0.1)", borderRadius: 6, fontSize: 11 }} /><Area key="area-rpt-score" type="monotone" dataKey="avgScore" name="Avg Score" stroke="#f0a500" fill="url(#rpt-score-grad)" strokeWidth={2} dot={{ fill: "#f0a500", r: 3 }} /><Area key="area-rpt-pass" type="monotone" dataKey="passRate" name="Pass Rate" stroke="#3fb950" fill="url(#rpt-pass-grad)" strokeWidth={2} dot={{ fill: "#3fb950", r: 3 }} /></AreaChart></ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

type ManagedUser = { id: string; name: string; email: string; role: Role; dept: string; status: "Active" | "Suspended"; lastLogin: string; avatar: string };

const initialUsers: ManagedUser[] = [
  { id: "USR-001", name: "Director Reyes", email: "superadmin@ems.gov", role: "superadmin", dept: "Command HQ", status: "Active", lastLogin: "Jun 30, 09:01", avatar: "DR" },
  { id: "USR-002", name: "Capt. Santos", email: "admin@ems.gov", role: "admin", dept: "Training Division", status: "Active", lastLogin: "Jun 30, 08:45", avatar: "CS" },
  { id: "USR-003", name: "Lt. Cruz", email: "lcruz@ems.gov", role: "admin", dept: "Operations", status: "Active", lastLogin: "Jun 29, 14:30", avatar: "LC" },
  { id: "USR-004", name: "Maria Santos", email: "m.santos@ems.gov", role: "user", dept: "Rescue Alpha", status: "Active", lastLogin: "Jun 30, 08:12", avatar: "MS" },
  { id: "USR-005", name: "Jose Reyes", email: "j.reyes@ems.gov", role: "user", dept: "Medical Bravo", status: "Active", lastLogin: "Jun 29, 16:02", avatar: "JR" },
  { id: "USR-006", name: "Ana Cruz", email: "a.cruz@ems.gov", role: "user", dept: "Command HQ", status: "Active", lastLogin: "Jun 29, 11:55", avatar: "AC" },
  { id: "USR-007", name: "Carlos Bautista", email: "c.bautista@ems.gov", role: "user", dept: "Supply Delta", status: "Suspended", lastLogin: "Jun 20, 09:00", avatar: "CB" },
  { id: "USR-008", name: "Elena Villanueva", email: "e.villanueva@ems.gov", role: "user", dept: "Hazmat Echo", status: "Active", lastLogin: "Jun 30, 07:58", avatar: "EV" },
];

function UserManagement() {
  const app = useApp();
  const [users, setUsers] = useState<ManagedUser[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | Role>("all");
  const [editId, setEditId] = useState<string | null>(null);

  const filtered = users.filter(u =>
    (filter === "all" || u.role === filter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleStatus = (id: string) =>
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" } : u));

  const changeRole = (id: string, role: Role) =>
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));

  const roleColors: Record<Role, string> = {
    superadmin: "bg-primary/20 text-primary border-primary/30",
    admin: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    user: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };
  const roleLabels: Record<Role, string> = { superadmin: "Super Admin", admin: "Admin", user: "User" };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-['Barlow_Condensed'] tracking-wide text-foreground">USER MANAGEMENT</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage accounts, roles, and access permissions across the platform</p>
        </div>
        <motion.button onClick={() => {
          const name = prompt("Name:"); if (!name) return;
          const email = prompt("Email:", "") || "";
          const role = (prompt("Role (user/admin/superadmin):", "user") as Role) || "user";
          const dept = prompt("Department:", "General") || "General";
          const newUser: ManagedUser = { id: `USR-${Math.random().toString(36).slice(2,6).toUpperCase()}`, name, email, role, dept, status: "Active", lastLogin: "—", avatar: name.split(" ").map(n => n[0]).slice(0,2).join("") };
          setUsers(prev => [newUser, ...prev]);
          app.addUser({ id: "", name, email, dept, role, status: "Active" });
          app.addNotification({ type: "UserMgmt", subject: `User added: ${name}`, status: "Sent" });
        }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors"><UserPlus size={16} />Add User</motion.button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Users", value: users.length, icon: Users, color: "text-foreground" },
          { label: "Super Admins", value: users.filter(u => u.role === "superadmin").length, icon: ShieldCheck, color: "text-primary" },
          { label: "Admins", value: users.filter(u => u.role === "admin").length, icon: Shield, color: "text-purple-400" },
          { label: "Suspended", value: users.filter(u => u.status === "Suspended").length, icon: UserX, color: "text-red-400" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest">{s.label}</span>
              <s.icon size={15} className={s.color} />
            </div>
            <div className={`text-2xl font-bold font-['Barlow_Condensed'] ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
            className="w-full bg-input-background border border-border rounded-md pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div className="flex gap-1.5">
          {(["all", "superadmin", "admin", "user"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
              {f === "all" ? "All" : f === "superadmin" ? "Super Admin" : f === "admin" ? "Admin" : "Users"}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/40">
              {["User", "Email", "Role", "Department", "Status", "Last Login", "Actions"].map(h => (
                <th key={h} className="text-left text-[12px] font-mono font-medium text-muted-foreground uppercase tracking-widest px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <motion.tr key={u.id} custom={i} variants={fadeIn} initial="hidden" animate="show"
                className={`border-b border-border hover:bg-secondary/30 transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""} ${u.status === "Suspended" ? "opacity-60" : ""}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <AvatarCircle initials={u.avatar} color={u.role === "superadmin" ? "bg-primary/20" : u.role === "admin" ? "bg-purple-500/20" : "bg-blue-500/20"} />
                    <div>
                      <div className="text-xs font-semibold text-foreground">{u.name}</div>
                      <div className="text-[11px] font-mono text-muted-foreground">{u.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3">
                  {editId === u.id ? (
                    <select value={u.role} onChange={e => { changeRole(u.id, e.target.value as Role); setEditId(null); }}
                      className="bg-input-background border border-border rounded px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
                  ) : (
                    <span className={`text-[12px] font-mono font-bold px-2 py-0.5 rounded border ${roleColors[u.role]}`}>{roleLabels[u.role]}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{u.dept}</td>
                <td className="px-4 py-3"><Badge status={u.status}>{u.status}</Badge></td>
                <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{u.lastLogin}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setEditId(editId === u.id ? null : u.id)}
                      title="Change Role"
                      className="text-muted-foreground hover:text-primary transition-colors p-1 rounded hover:bg-secondary">
                      <Key size={14} />
                    </button>
                    <button onClick={() => toggleStatus(u.id)}
                      title={u.status === "Active" ? "Suspend" : "Reactivate"}
                      className={`transition-colors p-1 rounded hover:bg-secondary ${u.status === "Active" ? "text-muted-foreground hover:text-red-400" : "text-muted-foreground hover:text-green-400"}`}>
                      {u.status === "Active" ? <UserX size={14} /> : <UserCheck size={14} />}
                    </button>
                    <button title="Reset Password" className="text-muted-foreground hover:text-yellow-400 transition-colors p-1 rounded hover:bg-secondary"><RefreshCw size={14} /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SystemSettings() {
  const [notifications, setNotifications] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [auditLog, setAuditLog] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);

  const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${on ? "bg-primary" : "bg-secondary border border-border"}`}>
      <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all ${on ? "left-5.5 translate-x-0.5" : "left-0.5"}`} style={{ left: on ? "calc(100% - 18px)" : 2 }} />
    </button>
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold font-['Barlow_Condensed'] tracking-wide text-foreground">SYSTEM SETTINGS</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Platform configuration, security, and administrative controls</p>
      </div>

      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-4" variants={{ show: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="show">
        <motion.div variants={fadeUp} className="bg-card border border-border rounded-lg p-5 space-y-4">
          <h3 className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest">Platform Settings</h3>
          {[
            { label: "Email Notifications", desc: "Send automated drill confirmations and reminders", value: notifications, set: () => setNotifications(p => !p) },
            { label: "Maintenance Mode", desc: "Restrict portal access for scheduled maintenance", value: maintenanceMode, set: () => setMaintenanceMode(p => !p) },
            { label: "Audit Log", desc: "Track all admin actions and user logins", value: auditLog, set: () => setAuditLog(p => !p) },
            { label: "Two-Factor Auth (Require)", desc: "Enforce 2FA for all admin and super admin accounts", value: twoFactor, set: () => setTwoFactor(p => !p) },
          ].map((s, i) => (
            <motion.div key={s.label} custom={i} variants={fadeUp} initial="hidden" animate="show" className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-foreground">{s.label}</div>
                <div className="text-xs text-muted-foreground">{s.desc}</div>
              </div>
              <Toggle on={s.value} onChange={s.set} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} className="bg-card border border-border rounded-lg p-5 space-y-4">
          <h3 className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest">System Information</h3>
          {[
            { label: "Platform Version", value: "DPTSS v2.4.1" },
            { label: "Last Backup", value: "Jun 30, 2026 · 02:00 AM" },
            { label: "Database Records", value: "12,847 entries" },
            { label: "Active Sessions", value: "3 concurrent" },
            { label: "Uptime", value: "99.98% (30 days)" },
            { label: "Storage Used", value: "4.2 GB / 50 GB" },
          ].map((s, i) => (
            <motion.div key={s.label} custom={i} variants={fadeIn} initial="hidden" animate="show" className="flex justify-between items-center border-b border-border pb-2 last:border-b-0 last:pb-0">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <span className="text-xs font-mono text-foreground font-semibold">{s.value}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} className="bg-card border border-border rounded-lg p-5 space-y-3">
          <h3 className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest">Recent Audit Log</h3>
          {[
            { action: "Role changed", target: "Carlos Bautista → Suspended", user: "Director Reyes", time: "09:32" },
            { action: "Program created", target: "Typhoon Preparedness 101", user: "Capt. Santos", time: "08:55" },
            { action: "User logged in", target: "m.santos@ems.gov", user: "System", time: "08:12" },
            { action: "Report exported", target: "RPT-2026-018 (PDF)", user: "Lt. Cruz", time: "07:48" },
            { action: "Scenario launched", target: "Urban Earthquake M7.2", user: "Capt. Santos", time: "Jun 29 · 15:10" },
          ].map((l, i) => (
            <motion.div key={i} custom={i} variants={fadeIn} initial="hidden" animate="show" className="flex items-start gap-3 text-xs border-b border-border pb-2 last:border-b-0 last:pb-0">
              <span className="font-mono text-muted-foreground w-12 flex-shrink-0">{l.time}</span>
              <span className="text-primary font-medium">{l.action}</span>
              <span className="text-muted-foreground flex-1">{l.target}</span>
              <span className="text-muted-foreground font-mono flex-shrink-0">{l.user}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} className="bg-card border border-border rounded-lg p-5 space-y-3">
          <h3 className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest">Admin Actions</h3>
          {[
            { label: "Force Backup Now", icon: Download, color: "text-blue-400" },
            { label: "Clear Session Cache", icon: RefreshCw, color: "text-yellow-400" },
            { label: "Export Full Audit Log", icon: FileText, color: "text-muted-foreground" },
            { label: "Send System Announcement", icon: Bell, color: "text-muted-foreground" },
          ].map(a => (
            <motion.button key={a.label} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }} className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-left">
              <a.icon size={16} className={a.color} />
              <span className="text-sm text-foreground">{a.label}</span>
              <ChevronRight size={14} className="ml-auto text-muted-foreground" />
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

function AdminShell({ auth, onLogout }: { auth: AuthUser; onLogout: () => void }) {
  const [mod, setMod] = useState<AdminModule>("dashboard");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const ADMIN_NAV = [
    { id: "dashboard" as AdminModule, label: "Command Overview", icon: Activity },
    { id: "training" as AdminModule, label: "Training Programs", icon: BookOpen },
    { id: "simulation" as AdminModule, label: "Scenario Builder", icon: Cpu },
    { id: "participants" as AdminModule, label: "Participants", icon: Users },
    { id: "evaluation" as AdminModule, label: "Performance Eval", icon: BarChart3 },
    { id: "reporting" as AdminModule, label: "Drill Reports", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex" style={{ fontFamily: "'DM Sans', 'Barlow', sans-serif" }}>
      <aside className="w-64 flex-shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col" style={{ minHeight: "100vh" }}>
        <div className="px-4 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center"><Shield size={16} className="text-primary-foreground" /></div>
            <div><div className="text-[13px] font-bold font-['Barlow_Condensed'] tracking-widest text-foreground uppercase leading-none">DPTSS</div><div className="text-[11px] font-mono text-muted-foreground mt-0.5 leading-none">Admin Console</div></div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest px-2 mb-2">Modules</div>
          {ADMIN_NAV.map((item, i) => { const Icon = item.icon; const active = mod === item.id; return (<motion.button key={item.id} onClick={() => setMod(item.id)} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }} whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }} className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left transition-colors text-xs font-medium ${active ? "bg-sidebar-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"}`}><Icon size={15} className={active ? "text-primary" : "text-current"} /><span>{item.label}</span>{active && <ChevronRight size={12} className="ml-auto text-primary" />}</motion.button>); })}
        </nav>
        <div className="px-3 pb-3">
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
            <div className="text-[11px] font-mono text-purple-400 uppercase tracking-widest mb-1">Access Level</div>
            <div className="text-xs font-semibold text-foreground">Administrator</div>
            <div className="text-[12px] text-muted-foreground">{auth.dept}</div>
          </div>
        </div>
        <div className="px-4 py-3 border-t border-sidebar-border flex items-center gap-2.5">
          <AvatarCircle initials={auth.avatar} color="bg-purple-500/20" />
          <div className="flex-1 min-w-0"><div className="text-xs font-semibold text-foreground truncate">{auth.name}</div><div className="text-[12px] font-mono text-muted-foreground">Admin</div></div>
          <motion.button onClick={() => setShowLogoutModal(true)} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="text-muted-foreground hover:text-red-400 transition-colors"><LogOut size={15} /></motion.button>
        </div>
      </aside>
      {showLogoutModal && (
        <LogoutConfirmModal auth={auth} onConfirm={onLogout} onCancel={() => setShowLogoutModal(false)} />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/50 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono"><span>DPTSS</span><ChevronRight size={12} /><span className="text-foreground">{ADMIN_NAV.find(n => n.id === mod)?.label}</span></div>
          <div className="flex items-center gap-3"><div className="flex items-center gap-1.5 text-xs font-mono text-green-400"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />SYS OPERATIONAL</div><DarkModeToggle /><NotificationBell /></div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <AnimatePresence mode="wait">
            <motion.div key={mod} variants={pageTransition} initial="hidden" animate="show" exit="exit">
              {mod === "dashboard" && <AdminDashboard />}
              {mod === "training" && <TrainingModule />}
              {mod === "simulation" && <SimModule />}
              {mod === "participants" && <ParticipantsModule />}
              {mod === "evaluation" && <EvalModule />}
              {mod === "reporting" && <ReportModule />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function SuperAdminShell({ auth, onLogout }: { auth: AuthUser; onLogout: () => void }) {
  const [mod, setMod] = useState<SuperAdminModule>("dashboard");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const SA_NAV = [
    { id: "dashboard" as SuperAdminModule, label: "Command Overview", icon: Activity, group: "Operations" },
    { id: "training" as SuperAdminModule, label: "Training Programs", icon: BookOpen, group: "Operations" },
    { id: "simulation" as SuperAdminModule, label: "Scenario Builder", icon: Cpu, group: "Operations" },
    { id: "participants" as SuperAdminModule, label: "Participants", icon: Users, group: "Operations" },
    { id: "evaluation" as SuperAdminModule, label: "Performance Eval", icon: BarChart3, group: "Operations" },
    { id: "reporting" as SuperAdminModule, label: "Drill Reports", icon: FileText, group: "Operations" },
    { id: "usermgmt" as SuperAdminModule, label: "User Management", icon: ShieldCheck, group: "System" },
    { id: "settings" as SuperAdminModule, label: "System Settings", icon: Settings, group: "System" },
  ];

  const groups = ["Operations", "System"];

  return (
    <div className="min-h-screen bg-background text-foreground flex" style={{ fontFamily: "'DM Sans', 'Barlow', sans-serif" }}>
      <aside className="w-64 flex-shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col" style={{ minHeight: "100vh" }}>
        <div className="px-4 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center"><Shield size={16} className="text-primary-foreground" /></div>
            <div><div className="text-[13px] font-bold font-['Barlow_Condensed'] tracking-widest text-foreground uppercase leading-none">DPTSS</div><div className="text-[11px] font-mono text-muted-foreground mt-0.5 leading-none">Super Admin</div></div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
          {groups.map(g => (
            <div key={g}>
              <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest px-2 mb-1.5">{g}</div>
              <div className="space-y-0.5">
                {SA_NAV.filter(n => n.group === g).map((item, i) => { const Icon = item.icon; const active = mod === item.id; return (<motion.button key={item.id} onClick={() => setMod(item.id)} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }} whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }} className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left transition-colors text-xs font-medium ${active ? `bg-sidebar-accent text-foreground` : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"}`}><Icon size={15} className={active ? "text-primary" : "text-current"} /><span>{item.label}</span>{active && <ChevronRight size={12} className="ml-auto text-primary" />}</motion.button>); })}
              </div>
            </div>
          ))}
        </nav>
        <div className="px-3 pb-3">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
            <div className="text-[11px] font-mono text-primary uppercase tracking-widest mb-1">Access Level</div>
            <div className="text-xs font-semibold text-foreground">Super Administrator</div>
            <div className="text-[12px] text-muted-foreground">Full system access</div>
          </div>
        </div>
        <div className="px-4 py-3 border-t border-sidebar-border flex items-center gap-2.5">
          <AvatarCircle initials={auth.avatar} color="bg-primary/20" />
          <div className="flex-1 min-w-0"><div className="text-xs font-semibold text-foreground truncate">{auth.name}</div><div className="text-[12px] font-mono text-primary">Super Admin</div></div>
          <motion.button onClick={() => setShowLogoutModal(true)} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="text-muted-foreground hover:text-red-400 transition-colors"><LogOut size={15} /></motion.button>
        </div>
        {showLogoutModal && (
          <LogoutConfirmModal auth={auth} onConfirm={onLogout} onCancel={() => setShowLogoutModal(false)} />
        )}
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/50 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <span>DPTSS</span><ChevronRight size={12} />
            <span className={`${["usermgmt", "settings"].includes(mod) ? "text-primary" : "text-foreground"}`}>{SA_NAV.find(n => n.id === mod)?.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-mono text-primary border border-primary/20 bg-primary/10 px-2 py-0.5 rounded"><ShieldCheck size={12} />SUPER ADMIN</div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-green-400"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />SYS OPERATIONAL</div>
            <DarkModeToggle />
            <NotificationBell />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <AnimatePresence mode="wait">
            <motion.div key={mod} variants={pageTransition} initial="hidden" animate="show" exit="exit">
              {mod === "dashboard" && <AdminDashboard />}
              {mod === "training" && <TrainingModule />}
              {mod === "simulation" && <SimModule />}
              {mod === "participants" && <ParticipantsModule />}
              {mod === "evaluation" && <EvalModule />}
              {mod === "reporting" && <ReportModule />}
              {mod === "usermgmt" && <UserManagement />}
              {mod === "settings" && <SystemSettings />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [auth, setAuth] = useState<AuthUser | null>(null);

  if (!auth) return <LoginScreen onLogin={setAuth} />;

  return (
    <AppProvider>
      {auth.role === "user" && <UserPortal auth={auth} onLogout={() => setAuth(null)} />}
      {auth.role === "admin" && <AdminShell auth={auth} onLogout={() => setAuth(null)} />}
      {auth.role === "superadmin" && <SuperAdminShell auth={auth} onLogout={() => setAuth(null)} />}
    </AppProvider>
  );
}