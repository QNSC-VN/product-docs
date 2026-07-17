import { useState } from "react";
import { TopNav, ContextBar } from "./components/layout";
import { type Page, type Role, type ScopeProject, type WorkItem, NOTIFICATIONS, ROLE_SCOPE, SCOPE_PROJECTS, WORK_ITEMS } from "./model";
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
import { AccessStatePage } from "./pages/AccessStatePage";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [currentRole, setCurrentRole] = useState<Role>("Workspace Admin");
  const [currentProject, setCurrentProject] = useState<ScopeProject>(SCOPE_PROJECTS[0]);
  const [currentTeam, setCurrentTeam] = useState("All Teams");
  const [activeItem, setActiveItem] = useState<WorkItem | null>(null);
  const [showFullDetail, setShowFullDetail] = useState(false);
  const [fullDetailItem, setFullDetailItem] = useState<WorkItem | null>(null);
  const [projectCreateRequest, setProjectCreateRequest] = useState(0);
  const [accessState, setAccessState] = useState<"access-denied" | "not-found" | null>(null);
  const unreadCount = NOTIFICATIONS.filter(notification => !notification.read).length;

  function handleItemClick(item: WorkItem) { setActiveItem(previous => previous?.id === item.id ? null : item); }
  function navigateTo(page: Page) {
    if (currentRole === "Project Member" && !["home", "backlog", "track", "notifications", "settings"].includes(page)) {
      setAccessState("access-denied");
      setActiveItem(null);
      closeFullDetail();
      return;
    }
    setAccessState(null);
    setCurrentPage(page);
    setActiveItem(null);
    closeFullDetail();
  }
  function changeScope(project: ScopeProject, team: string) {
    if (currentRole === "Project Member") {
      if (project.key !== ROLE_SCOPE.projectMemberProjectKey || !ROLE_SCOPE.projectMemberTeams.includes(team as typeof ROLE_SCOPE.projectMemberTeams[number])) return;
    }
    setCurrentProject(project);
    setCurrentTeam(team);
    setAccessState(null);
    setActiveItem(null);
    closeFullDetail();
  }
  function changeRole(nextRole: Role) {
    setCurrentRole(nextRole);
    if (nextRole === "Project Member") {
      const memberProject = SCOPE_PROJECTS.find(project => project.key === ROLE_SCOPE.projectMemberProjectKey) ?? SCOPE_PROJECTS[0];
      setCurrentProject(memberProject);
      setCurrentTeam(ROLE_SCOPE.projectMemberTeams[0]);
      if (!["home", "backlog", "track", "notifications", "settings"].includes(currentPage)) setAccessState("access-denied");
      else setAccessState(null);
    } else {
      setAccessState(null);
      if (currentTeam !== "All Teams") setCurrentTeam("All Teams");
    }
    setActiveItem(null);
    closeFullDetail();
  }
  function openFullDetail(item: WorkItem) {
    if (currentRole === "Project Member" && item.project !== ROLE_SCOPE.projectMemberProjectKey) {
      setAccessState("access-denied");
      setActiveItem(null);
      closeFullDetail();
      return;
    }
    setAccessState(null);
    setActiveItem(null);
    setFullDetailItem(item);
    setShowFullDetail(true);
  }
  function openNotificationWorkItem(workItemId: string) {
    const item = WORK_ITEMS.find(workItem => workItem.id === workItemId);
    if (item) openFullDetail(item);
    else setAccessState("not-found");
  }
  function minimizeFullDetail(item: WorkItem) { setActiveItem(item); setShowFullDetail(false); setFullDetailItem(null); }
  function closeFullDetail() { setShowFullDetail(false); setFullDetailItem(null); }
  function signOut() {
    closeFullDetail();
    setActiveItem(null);
    setCurrentPage("home");
    setCurrentRole("Workspace Admin");
    setAccessState(null);
    setIsAuthenticated(false);
  }
  function renderPage() {
    const projectReadOnly = currentRole === "Project Admin" && !ROLE_SCOPE.projectAdminProjectKeys.includes(currentProject.key as typeof ROLE_SCOPE.projectAdminProjectKeys[number]);
    switch (currentPage) {
      case "home": return <HomePage role={currentRole} onNavigate={navigateTo} />;
      case "projects": return <ProjectsPage role={currentRole} createRequest={projectCreateRequest} onCreateRequestHandled={() => setProjectCreateRequest(0)} />;
      case "backlog": return <BacklogPage role={currentRole} project={currentProject} team={currentTeam} activeItem={activeItem} onItemClick={handleItemClick} onOpenFull={openFullDetail} />;
      case "iterations": return <IterationsPage role={currentRole} readOnly={projectReadOnly} />;
      case "track": return <TrackPage key="track" title="Iteration" role={currentRole} readOnly={projectReadOnly} activeItem={activeItem} onItemClick={handleItemClick} onOpenFull={openFullDetail} />;
      case "teamBoard": return <TeamBoardPage role={currentRole} activeItem={activeItem} onItemClick={handleItemClick} onOpenFull={openFullDetail} />;
      case "teamStatus": return <TeamStatusPage role={currentRole} readOnly={projectReadOnly} onOpenFull={openFullDetail} />;
      case "quality": return <QualityPage role={currentRole} readOnly={projectReadOnly} activeItem={activeItem} onItemClick={handleItemClick} onOpenFull={openFullDetail} />;
      case "portfolio": return <PortfolioPage role={currentRole} />;
      case "releases": return <ReleasesPage role={currentRole} readOnly={projectReadOnly} />;
      case "reports": return <ReportsPage role={currentRole} readOnly={projectReadOnly} />;
      case "notifications": return <NotificationsPage onOpenWorkItem={openNotificationWorkItem} />;
      case "settings": return <SettingsPage role={currentRole} projectReadOnly={projectReadOnly} />;
    }
  }

  if (!isAuthenticated) return <LoginPage onLogin={() => { setCurrentRole("Workspace Admin"); setIsAuthenticated(true); }} />;

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", backgroundColor: "#f0f2f5" }}>
      <TopNav currentPage={currentPage} onNavigate={navigateTo} currentRole={currentRole} onRoleChange={changeRole} unreadCount={unreadCount} currentProject={currentProject} currentTeam={currentTeam} onScopeChange={changeScope} onSignOut={signOut} onCreateProject={() => { setCurrentPage("projects"); setProjectCreateRequest(1); }} />
      <ContextBar currentPage={currentPage} currentProject={currentProject} currentTeam={currentTeam} />
      <div className="flex flex-1 overflow-hidden">
        {accessState
          ? <AccessStatePage variant={accessState} onBack={() => { setAccessState(null); setCurrentPage("backlog"); }} />
          : showFullDetail && fullDetailItem
            ? <WorkItemDetailPage item={fullDetailItem} role={currentRole} readOnly={currentRole === "Project Admin" && !ROLE_SCOPE.projectAdminProjectKeys.includes((fullDetailItem.project ?? "") as typeof ROLE_SCOPE.projectAdminProjectKeys[number])} project={currentProject} team={currentTeam} onBack={closeFullDetail} onMinimize={minimizeFullDetail} />
            : renderPage()}
      </div>
    </div>
  );
}
