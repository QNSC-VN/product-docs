import { useState } from "react";
import { TopNav, ContextBar } from "./components/layout";
import { type Page, type Role, type ScopeProject, type WorkItem, NOTIFICATIONS, SCOPE_PROJECTS } from "./model";
import { HomePage } from "./pages/HomePage";
import { TrackPage } from "./pages/IterationStatusPage";
import { TeamBoardPage } from "./pages/TeamBoardPage";
import { TeamStatusPage } from "./pages/TeamStatusPage";
import { BacklogPage } from "./pages/BacklogPage";
import { IterationsPage } from "./pages/IterationsPage";
import { QualityPage } from "./pages/QualityPage";
import { PortfolioPage } from "./pages/PortfolioPage";
import { ReleasesPage } from "./pages/ReleasesPage";
import { ReportsPage } from "./pages/ReportsPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { WorkItemDetailPage } from "./pages/WorkItemDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { ProjectsPage } from "./pages/ProjectsPage";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [currentRole, setCurrentRole] = useState<Role>("Workspace Admin");
  const [currentProject, setCurrentProject] = useState<ScopeProject>(SCOPE_PROJECTS[0]);
  const [currentTeam, setCurrentTeam] = useState(SCOPE_PROJECTS[0].teams[0]);
  const [activeItem, setActiveItem] = useState<WorkItem | null>(null);
  const [showFullDetail, setShowFullDetail] = useState(false);
  const [fullDetailItem, setFullDetailItem] = useState<WorkItem | null>(null);
  const [projectCreateRequest, setProjectCreateRequest] = useState(0);
  const unreadCount = NOTIFICATIONS.filter(notification => !notification.read).length;

  function handleItemClick(item: WorkItem) { setActiveItem(previous => previous?.id === item.id ? null : item); }
  function navigateTo(page: Page) { setCurrentPage(page); setActiveItem(null); closeFullDetail(); }
  function changeScope(project: ScopeProject, team: string) { setCurrentProject(project); setCurrentTeam(team); setActiveItem(null); closeFullDetail(); }
  function openFullDetail(item: WorkItem) { setActiveItem(null); setFullDetailItem(item); setShowFullDetail(true); }
  function minimizeFullDetail(item: WorkItem) { setActiveItem(item); setShowFullDetail(false); setFullDetailItem(null); }
  function closeFullDetail() { setShowFullDetail(false); setFullDetailItem(null); }
  function signOut() {
    closeFullDetail();
    setActiveItem(null);
    setCurrentPage("home");
    setCurrentRole("Workspace Admin");
    setIsAuthenticated(false);
  }
  function renderPage() {
    switch (currentPage) {
      case "home": return <HomePage role={currentRole} onNavigate={navigateTo} />;
      case "projects": return <ProjectsPage role={currentRole} createRequest={projectCreateRequest} onCreateRequestHandled={() => setProjectCreateRequest(0)} />;
      case "backlog": return <BacklogPage role={currentRole} activeItem={activeItem} onItemClick={handleItemClick} onOpenFull={openFullDetail} />;
      case "iterations": return <IterationsPage role={currentRole} />;
      case "track": return <TrackPage key="track" title="Iteration" role={currentRole} activeItem={activeItem} onItemClick={handleItemClick} onOpenFull={openFullDetail} />;
      case "teamBoard": return <TeamBoardPage role={currentRole} activeItem={activeItem} onItemClick={handleItemClick} onOpenFull={openFullDetail} />;
      case "teamStatus": return <TeamStatusPage role={currentRole} onOpenFull={openFullDetail} />;
      case "quality": return <QualityPage role={currentRole} activeItem={activeItem} onItemClick={handleItemClick} onOpenFull={openFullDetail} />;
      case "portfolio": return <PortfolioPage role={currentRole} />;
      case "releases": return <ReleasesPage role={currentRole} />;
      case "reports": return <ReportsPage role={currentRole} />;
      case "notifications": return <NotificationsPage />;
      case "settings": return <SettingsPage role={currentRole} />;
    }
  }

  if (!isAuthenticated) return <LoginPage onLogin={() => { setCurrentRole("Workspace Admin"); setIsAuthenticated(true); }} />;

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", backgroundColor: "#f0f2f5" }}>
      <TopNav currentPage={currentPage} onNavigate={navigateTo} currentRole={currentRole} onRoleChange={setCurrentRole} unreadCount={unreadCount} currentProject={currentProject} currentTeam={currentTeam} onScopeChange={changeScope} onSignOut={signOut} onCreateProject={() => { setCurrentPage("projects"); setProjectCreateRequest(1); }} />
      <ContextBar currentPage={currentPage} currentProject={currentProject} currentTeam={currentTeam} />
      <div className="flex flex-1 overflow-hidden">
        {showFullDetail && fullDetailItem ? <WorkItemDetailPage item={fullDetailItem} role={currentRole} project={currentProject} team={currentTeam} onBack={closeFullDetail} onMinimize={minimizeFullDetail} /> : renderPage()}
      </div>
    </div>
  );
}
