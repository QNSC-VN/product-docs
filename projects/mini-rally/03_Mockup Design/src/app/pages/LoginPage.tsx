import { useState, type FormEvent } from "react";
import { AlertCircle, Check, Eye, EyeOff, Layers, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

type LoginPageProps = {
  onLogin: () => void;
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("admin@acme.com");
  const [password, setPassword] = useState("Admin@123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Enter both email and password to continue.");
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      if (email.trim().toLowerCase() === "admin@acme.com" && password === "Admin@123") {
        onLogin();
      } else {
        setError("Email or password is incorrect. Use the demo Admin account below.");
        setSubmitting(false);
      }
    }, 450);
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-[minmax(420px,0.9fr)_minmax(560px,1.1fr)]" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", backgroundColor: "#f3f5f8" }}>
      <section className="hidden lg:flex flex-col justify-between p-10 xl:p-14 text-white relative overflow-hidden" style={{ backgroundColor: "#1d3f73" }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 15% 20%, #8cb3e8 0, transparent 28%), radial-gradient(circle at 85% 82%, #5b83bd 0, transparent 32%)" }} />
        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.18)" }}><Layers size={19} /></div>
          <div><div className="text-[16px] font-semibold tracking-tight">Mini Rally</div><div className="text-[10px]" style={{ color: "rgba(255,255,255,0.55)" }}>Work Management Platform</div></div>
        </div>

        <div className="relative max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-widest mb-5" style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.78)" }}><ShieldCheck size={12} /> Workspace Administration</div>
          <h1 className="text-[32px] xl:text-[38px] font-semibold leading-tight tracking-tight">Plan clearly.<br />Deliver with confidence.</h1>
          <p className="mt-4 text-[14px] leading-6 max-w-md" style={{ color: "rgba(255,255,255,0.66)" }}>Manage company workspaces, projects, teams and delivery from one focused operating view.</p>
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-lg">
            {["Workspace control", "Project visibility", "Team governance"].map(item => <div key={item} className="flex items-center gap-2 text-[11px]" style={{ color: "rgba(255,255,255,0.74)" }}><span className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.12)" }}><Check size={9} /></span>{item}</div>)}
          </div>
        </div>

        <div className="relative text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>© 2026 Mini Rally · Internal workspace</div>
      </section>

      <section className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-[430px]">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded flex items-center justify-center text-white" style={{ backgroundColor: "#1d3f73" }}><Layers size={16} /></div>
            <div><div className="text-[14px] font-semibold" style={{ color: "#1a2234" }}>Mini Rally</div><div className="text-[9px]" style={{ color: "#8c94a6" }}>Work Management Platform</div></div>
          </div>

          <div className="bg-white rounded-md shadow-sm overflow-hidden" style={{ border: "1px solid #d9dee7" }}>
            <div className="px-7 pt-7 pb-5" style={{ borderBottom: "1px solid #edf0f4" }}>
              <div className="flex items-center justify-between gap-4">
                <div><p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#8c94a6" }}>Admin access</p><h2 className="text-[21px] font-semibold tracking-tight" style={{ color: "#1a2234" }}>Sign in to Mini Rally</h2></div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#edf2fb", color: "#1d3f73" }}><ShieldCheck size={19} /></div>
              </div>
              <p className="text-[12px] mt-2" style={{ color: "#5c6478" }}>Use your Workspace Admin account to continue.</p>
            </div>

            <form onSubmit={submitLogin} className="px-7 py-6">
              {error && <div role="alert" className="flex items-start gap-2 px-3 py-2.5 rounded mb-4 text-[11px]" style={{ color: "#b91c1c", backgroundColor: "#fef2f2", border: "1px solid #f0c7c1" }}><AlertCircle size={14} className="shrink-0 mt-px" />{error}</div>}

              <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#5c6478" }} htmlFor="admin-email">Email address</label>
              <div className="relative mb-4">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#8c94a6" }} />
                <input id="admin-email" type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded text-[12px] focus:outline-none" style={{ border: "1px solid #d9dee7", color: "#1a2234" }} />
              </div>

              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#5c6478" }} htmlFor="admin-password">Password</label>
                <button type="button" className="text-[10px] font-medium" style={{ color: "#2558a6" }}>Forgot password?</button>
              </div>
              <div className="relative mb-4">
                <LockKeyhole size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#8c94a6" }} />
                <input id="admin-password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} className="w-full pl-9 pr-10 py-2.5 rounded text-[12px] focus:outline-none" style={{ border: "1px solid #d9dee7", color: "#1a2234" }} />
                <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(value => !value)} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1" style={{ color: "#8c94a6" }}>{showPassword ? <EyeOff size={14} /> : <Eye size={14} />}</button>
              </div>

              <label className="inline-flex items-center gap-2 text-[11px] cursor-pointer mb-5" style={{ color: "#5c6478" }}><input type="checkbox" checked={rememberMe} onChange={event => setRememberMe(event.target.checked)} style={{ accentColor: "#1d3f73" }} />Keep me signed in on this device</label>

              <button type="submit" disabled={submitting} className="w-full py-2.5 rounded text-[12px] font-semibold text-white disabled:opacity-60" style={{ backgroundColor: "#1d3f73" }}>{submitting ? "Signing in…" : "Sign in as Workspace Admin"}</button>
            </form>

            <div className="px-7 py-4" style={{ backgroundColor: "#f7f8fa", borderTop: "1px solid #edf0f4" }}>
              <p className="text-[9px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#8c94a6" }}>Demo Admin account</p>
              <div className="grid grid-cols-[70px_1fr] gap-y-1 text-[10px]"><span style={{ color: "#8c94a6" }}>Email</span><code style={{ color: "#1a2234" }}>admin@acme.com</code><span style={{ color: "#8c94a6" }}>Password</span><code style={{ color: "#1a2234" }}>Admin@123</code></div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-5 text-[10px]" style={{ color: "#8c94a6" }}><button>Privacy</button><span>·</span><button>Support</button><span>·</span><span>v0.1 Mockup</span></div>
        </div>
      </section>
    </main>
  );
}
