import { useState } from "react";
import { Check, Layers, ShieldCheck } from "lucide-react";

type LoginPageProps = {
  onLogin: () => void;
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [submitting, setSubmitting] = useState(false);

  function startMicrosoftSso() {
    setSubmitting(true);
    window.setTimeout(() => {
      onLogin();
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
          <p className="mt-4 text-[14px] leading-6 max-w-md" style={{ color: "rgba(255,255,255,0.66)" }}>Manage the workspace, projects, teams and delivery from one focused operating view.</p>
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-lg">
            {["Microsoft SSO", "Project visibility", "Team governance"].map(item => <div key={item} className="flex items-center gap-2 text-[11px]" style={{ color: "rgba(255,255,255,0.74)" }}><span className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.12)" }}><Check size={9} /></span>{item}</div>)}
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
                <div><p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#8c94a6" }}>Microsoft SSO</p><h2 className="text-[21px] font-semibold tracking-tight" style={{ color: "#1a2234" }}>Sign in to Mini Rally</h2></div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#edf2fb", color: "#1d3f73" }}><ShieldCheck size={19} /></div>
              </div>
              <p className="text-[12px] mt-2" style={{ color: "#5c6478" }}>Use your organization Microsoft account. Mini Rally does not collect a local password in the Phase 0 baseline.</p>
            </div>

            <div className="px-7 py-6">
              <button type="button" disabled={submitting} onClick={startMicrosoftSso} className="w-full py-2.5 rounded text-[12px] font-semibold text-white disabled:opacity-60 flex items-center justify-center gap-2" style={{ backgroundColor: "#1d3f73" }}>
                <span className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5" aria-hidden="true">
                  <span style={{ backgroundColor: "#f25022" }} />
                  <span style={{ backgroundColor: "#7fba00" }} />
                  <span style={{ backgroundColor: "#00a4ef" }} />
                  <span style={{ backgroundColor: "#ffb900" }} />
                </span>
                {submitting ? "Redirecting to Microsoft…" : "Continue with Microsoft"}
              </button>

              <div className="mt-4 rounded px-3 py-2.5 text-[11px] leading-5" style={{ backgroundColor: "#f7f8fa", border: "1px solid #edf0f4", color: "#5c6478" }}>
                After Microsoft validates the account, Mini Rally creates the app session, resolves the fixed Workspace and opens Home or the safe return URL.
              </div>
            </div>

            <div className="px-7 py-4" style={{ backgroundColor: "#f7f8fa", borderTop: "1px solid #edf0f4" }}>
              <p className="text-[9px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#8c94a6" }}>Phase 0 baseline</p>
              <p className="text-[10px] leading-5" style={{ color: "#5c6478" }}>Local email/password login, forgot password and reset password are Future Backlog unless BA reopens the authentication scope.</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-5 text-[10px]" style={{ color: "#8c94a6" }}><button>Privacy</button><span>·</span><button>Support</button><span>·</span><span>v0.1 Mockup</span></div>
        </div>
      </section>
    </main>
  );
}
