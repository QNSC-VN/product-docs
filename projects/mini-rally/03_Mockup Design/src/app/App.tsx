import { useState } from "react";
import { TopNav, ContextBar } from "./components/layout";
import { useEffect } from "react";
import { type IterationItem, type MilestoneItem, type NewIterationInput, type NewMilestoneInput, type NewReleaseInput, type NewTaskInput, type NewWorkItemInput, type Page, type ReleaseItem, type Role, type ScopeProject, type TaskItem, type WorkItem, ITERATIONS_DATA, MILESTONES_DATA, NOTIFICATIONS, OWNERS, RELEASES_DATA, ROLE_SCOPE, SCOPE_PROJECTS, TASKS_DATA, WORK_ITEMS } from "./model";
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
  const [workItems, setWorkItems] = useState<WorkItem[]>(() => WORK_ITEMS.map(item => {
    const releaseId = item.releaseId || ({ "Q4 2024": "REL-001", "Q1 2025": "REL-002", "Q2 2025": "REL-003" } as Record<string, string>)[item.release];
    const releaseName = RELEASES_DATA.find(release => release.id === releaseId)?.name;
    return { ...item, releaseId, release: releaseName || item.release };
  }));
  const [tasks, setTasks] = useState<TaskItem[]>(TASKS_DATA);
  const [iterations, setIterations] = useState<IterationItem[]>(ITERATIONS_DATA);
  const [releases, setReleases] = useState<ReleaseItem[]>(RELEASES_DATA);
  const [milestones, setMilestones] = useState<MilestoneItem[]>(MILESTONES_DATA);
  const [activeItem, setActiveItem] = useState<WorkItem | null>(null);
  const [showFullDetail, setShowFullDetail] = useState(false);
  const [fullDetailItem, setFullDetailItem] = useState<WorkItem | null>(null);
  const [projectCreateRequest, setProjectCreateRequest] = useState(0);
  const [accessState, setAccessState] = useState<"access-denied" | "not-found" | null>(null);
  const unreadCount = NOTIFICATIONS.filter(notification => !notification.read).length;

  function updateWorkItem(id: string, patch: Partial<WorkItem>) {
    setWorkItems(previous => previous.map(item => item.id === id ? { ...item, ...patch } : item));
    setActiveItem(previous => previous?.id === id ? { ...previous, ...patch } : previous);
    setFullDetailItem(previous => previous?.id === id ? { ...previous, ...patch } : previous);
  }
  function createWorkItem(input: NewWorkItemInput, openDetails: boolean) {
    const prefix = input.type === "Defect" ? "DE" : "US";
    const nextNumber = Math.max(0, ...workItems.filter(item => item.id.startsWith(`${prefix}-`)).map(item => Number(item.id.split("-")[1]) || 0)) + 1;
    const nextRank = Math.max(0, ...workItems.map(item => item.rank || 0)) + 1;
    const item: WorkItem = {
      id: `${prefix}-${nextNumber}`,
      type: input.type,
      title: input.title,
      status: "Idea",
      priority: input.type === "Defect" ? "High" : "Medium",
      owner: input.owner,
      planEstimate: input.planEstimate,
      taskCount: 0,
      completedTasks: 0,
      taskEstimate: 0,
      todoEstimate: 0,
      iteration: input.iteration || "Unscheduled",
      release: input.release || "Unscheduled",
      releaseId: input.releaseId || releases.find(release => release.name === input.release)?.id,
      milestoneIds: [],
      tags: [],
      description: input.title,
      lastUpdated: "Just now",
      project: input.project,
      team: input.team,
      rank: nextRank,
    };
    setWorkItems(previous => [...previous, item]);
    if (openDetails) {
      setFullDetailItem(item);
      setShowFullDetail(true);
    }
  }
  function updateTask(id: string, patch: Partial<TaskItem>) {
    setTasks(previous => previous.map(task => {
      if (task.id !== id) return task;
      const updated = { ...task, ...patch };
      return patch.state === "Completed" ? { ...updated, todo: 0, actuals: Math.max(updated.actuals, updated.estimate) } : updated;
    }));
  }
  function createTask(parent: WorkItem, input: NewTaskInput): TaskItem {
    const siblings = tasks.filter(task => task.parentWorkItemId === parent.id);
    const parentNumber = parent.id.replace(/\D/g, "") || "0";
    const nextSuffix = String(siblings.length + 1).padStart(2, "0");
    const task: TaskItem = {
      id: `TA-${parentNumber}${nextSuffix}`,
      parentWorkItemId: parent.id,
      rank: siblings.length + 1,
      name: input.name,
      state: "Defined",
      owner: input.owner,
      project: parent.project || currentProject.key,
      team: parent.team || currentTeam,
      estimate: input.estimate,
      todo: input.estimate,
      actuals: 0,
      description: input.name,
      notes: "",
      attachments: [],
    };
    setTasks(previous => [...previous, task]);
    return task;
  }
  function updateIteration(id: string, patch: Partial<IterationItem>) {
    setIterations(previous => previous.map(iteration => iteration.id === id ? { ...iteration, ...patch } : iteration));
  }
  function createIteration(input: NewIterationInput): IterationItem {
    const item: IterationItem = {
      id: `IT-${String(iterations.length + 1).padStart(3, "0")}`,
      name: input.name,
      theme: input.theme,
      state: input.state,
      projectKey: input.projectKey,
      team: input.team,
      startDate: input.startDate,
      endDate: input.endDate,
      project: SCOPE_PROJECTS.find(project => project.key === input.projectKey)?.name || input.projectKey,
      plannedVelocity: 0,
      taskEstimate: 0,
      capacity: 0,
      plannedPoints: 0,
      acceptedPoints: 0,
      itemCount: 0,
      defectCount: 0,
      blockedCount: 0,
      owner: OWNERS[0],
      goal: input.theme,
      history: ["Created just now"],
    };
    setIterations(previous => [...previous, item]);
    return item;
  }
  function updateRelease(id: string, patch: Partial<ReleaseItem>) {
    setReleases(previous => previous.map(release => release.id === id ? { ...release, ...patch } : release));
    if (patch.name) {
      const syncReleaseLabel = (item: WorkItem) => item.releaseId === id ? { ...item, release: patch.name as string } : item;
      setWorkItems(previous => previous.map(syncReleaseLabel));
      setActiveItem(previous => previous ? syncReleaseLabel(previous) : previous);
      setFullDetailItem(previous => previous ? syncReleaseLabel(previous) : previous);
    }
  }
  function createRelease(input: NewReleaseInput): ReleaseItem {
    const item: ReleaseItem = {
      id: `REL-${String(releases.length + 1).padStart(3, "0")}`,
      name: input.name,
      version: "Draft",
      status: input.status,
      startDate: input.startDate,
      releaseDate: input.releaseDate,
      progress: 0,
      totalItems: 0,
      completedItems: 0,
      openDefects: 0,
      blockedItems: 0,
      owner: OWNERS[0],
      description: input.description,
      projectKey: input.projectKey,
      team: input.team,
    };
    setReleases(previous => [...previous, item]);
    return item;
  }
  function updateMilestone(id: string, patch: Partial<MilestoneItem>) {
    setMilestones(previous => previous.map(milestone => milestone.id === id ? { ...milestone, ...patch } : milestone));
  }
  function createMilestone(input: NewMilestoneInput): MilestoneItem {
    const item: MilestoneItem = {
      id: `MS-${String(milestones.length + 1).padStart(3, "0")}`,
      name: input.name,
      description: input.description,
      state: input.state,
      releaseIds: input.releaseIds,
      projectKeys: input.projectKeys,
      teams: input.teams,
      manualStartDate: input.startDate,
      manualEndDate: input.endDate,
      owner: input.owner,
    };
    setMilestones(previous => [...previous, item]);
    return item;
  }
  useEffect(() => {
    function withTaskRollup(item: WorkItem): WorkItem {
      const children = tasks.filter(task => task.parentWorkItemId === item.id);
      if (children.length === 0) return item;
      const completedTasks = children.filter(task => task.state === "Completed").length;
      const allCompleted = completedTasks === children.length;
      const wasAllCompleted = item.taskCount > 0 && item.completedTasks === item.taskCount;
      const reopenedFromAllCompleted = wasAllCompleted && !allCompleted;
      const rolledUpStatus = allCompleted
        ? item.status !== "Accepted" && item.status !== "Release" ? "Completed" : item.status
        : reopenedFromAllCompleted ? "In-Progress" : item.status;
      return {
        ...item,
        taskCount: children.length,
        completedTasks,
        taskEstimate: children.reduce((sum, task) => sum + task.estimate, 0),
        todoEstimate: children.reduce((sum, task) => sum + task.todo, 0),
        status: rolledUpStatus,
      };
    }
    setWorkItems(previous => previous.map(withTaskRollup));
    setActiveItem(previous => previous ? withTaskRollup(previous) : previous);
    setFullDetailItem(previous => previous ? withTaskRollup(previous) : previous);
  }, [tasks]);
  useEffect(() => {
    setIterations(previous => previous.map(iteration => {
      const assignedItems = workItems.filter(item =>
        item.project === iteration.projectKey &&
        item.iteration === iteration.name &&
        (item.type === "Story" || item.type === "Defect")
      );
      const allAccepted = assignedItems.length > 0 && assignedItems.every(item => item.status === "Accepted");
      return allAccepted && iteration.state !== "Accepted" ? { ...iteration, state: "Accepted" } : iteration;
    }));
  }, [workItems]);
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
    const item = workItems.find(workItem => workItem.id === workItemId);
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
      case "backlog": return <BacklogPage role={currentRole} project={currentProject} team={currentTeam} iterations={iterations} releases={releases} items={workItems} onCreateItem={createWorkItem} onUpdateItem={updateWorkItem} activeItem={activeItem} onItemClick={handleItemClick} onOpenFull={openFullDetail} />;
      case "iterations": return <IterationsPage role={currentRole} readOnly={projectReadOnly} iterations={iterations} releases={releases} milestones={milestones} workItems={workItems} onCreateIteration={createIteration} onUpdateIteration={updateIteration} onCreateRelease={createRelease} onUpdateRelease={updateRelease} onCreateMilestone={createMilestone} onUpdateMilestone={updateMilestone} onUpdateWorkItem={updateWorkItem} />;
      case "track": return <TrackPage key="track" title="Iteration" role={currentRole} readOnly={projectReadOnly} projectKey={currentProject.key} iterations={iterations} onCreateItem={createWorkItem} onUpdateIteration={updateIteration} items={workItems} tasks={tasks} onUpdateItem={updateWorkItem} activeItem={activeItem} onItemClick={handleItemClick} onOpenFull={openFullDetail} />;
      case "teamBoard": return <TeamBoardPage role={currentRole} activeItem={activeItem} onItemClick={handleItemClick} onOpenFull={openFullDetail} />;
      case "teamStatus": return <TeamStatusPage role={currentRole} readOnly={projectReadOnly} items={workItems} tasks={tasks} onUpdateTask={updateTask} onOpenFull={openFullDetail} />;
      case "quality": return <QualityPage role={currentRole} readOnly={projectReadOnly} projectKey={currentProject.key} items={workItems} onUpdateItem={updateWorkItem} activeItem={activeItem} onItemClick={handleItemClick} onOpenFull={openFullDetail} />;
      case "portfolio": return <PortfolioPage role={currentRole} />;
      case "releasePlanning": return <ReleasePlanningPlaceholder />;
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
            ? <WorkItemDetailPage item={fullDetailItem} role={currentRole} readOnly={currentRole === "Project Admin" && !ROLE_SCOPE.projectAdminProjectKeys.includes((fullDetailItem.project ?? "") as typeof ROLE_SCOPE.projectAdminProjectKeys[number])} project={currentProject} team={currentTeam} iterations={iterations} releases={releases} milestones={milestones} tasks={tasks.filter(task => task.parentWorkItemId === fullDetailItem.id)} onCreateTask={createTask} onUpdateTask={updateTask} onUpdateItem={updateWorkItem} onBack={closeFullDetail} onMinimize={minimizeFullDetail} />
            : renderPage()}
      </div>
    </div>
  );
}

function ReleasePlanningPlaceholder() {
  return (
    <div className="flex flex-1 items-center justify-center bg-[#f7f8fa] p-8">
      <div className="max-w-xl rounded-md border border-[#d9dee7] bg-white p-7 shadow-sm">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-[#8c94a6]">Future Backlog · Phase 5</div>
        <h1 className="mt-2 text-[20px] font-semibold text-[#1a2234]">Release Planning</h1>
        <p className="mt-2 text-[13px] leading-6 text-[#5c6478]">Release Progress, percentage, zero-state and tracking formulas will be confirmed in Phase 5. Create and edit Release remains available only at Plan &gt; Timeboxes &gt; Releases.</p>
      </div>
    </div>
  );
}
