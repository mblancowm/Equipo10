import { useEffect, useState, type FormEvent } from 'react'
import '../../src/index.css'

type View = 'pipeline' | 'repository' | 'candidates' | 'talent' | 'admin'
type PreviewMode = 'recruiter' | 'manager' | 'admin'

type Candidate = {
  id: string
  name: string
  email: string
  source: string
  skills: string[]
  summary: string
  resume?: string
}

type Application = {
  id: string
  sourceId: string
  role: string
  stage: string
  outcome: string
  updated: string
}

type TeamMember = { name: string; email: string; role: string; status: string }

const stages = ['Added to role', 'Screening', 'Interview', 'Decision']
const outcomes = ['Selected', 'Not selected']
const initialRoles = ['Data Analyst', 'Analytics Consultant', 'Data Engineer']
const initialSkills = [
  'SQL',
  'Python',
  'Power BI',
  'Databricks',
  'AWS',
  'Data modeling',
  'Excel',
  'Stakeholder skills',
]

const initialRepository: Candidate[] = [
  {
    id: 'SRC-1042',
    name: 'Elena Mora',
    email: 'elena.mora@example.test',
    source: 'Referral',
    skills: ['SQL · strong', 'Python · working', 'Power BI · strong'],
    summary: 'Synthetic profile for the front-end concept.',
  },
  {
    id: 'SRC-1088',
    name: 'Andres Solano',
    email: 'andres.solano@example.test',
    source: 'Talent pool',
    skills: ['Python · strong', 'Databricks · working', 'SQL · strong'],
    summary: 'Synthetic profile for the front-end concept.',
  },
  {
    id: 'SRC-1125',
    name: 'Lucia Campos',
    email: 'lucia.campos@example.test',
    source: 'Referral',
    skills: ['Stakeholder skills · strong', 'Power BI · strong', 'SQL · working'],
    summary: 'Synthetic profile for the front-end concept.',
  },
  {
    id: 'SRC-1181',
    name: 'Diego Vargas',
    email: 'diego.vargas@example.test',
    source: 'Recruiting',
    skills: ['AWS · working', 'Python · strong', 'Data modeling · strong'],
    summary: 'Synthetic profile for the front-end concept.',
  },
  {
    id: 'SRC-1210',
    name: 'Sofia Rojas',
    email: 'sofia.rojas@example.test',
    source: 'Referral',
    skills: ['Business case · strong', 'Excel · strong', 'SQL · working'],
    summary: 'Synthetic profile for the front-end concept.',
  },
]

const initialApplications: Application[] = [
  { id: 'APP-301', sourceId: 'SRC-1042', role: 'Data Analyst', stage: 'Interview', outcome: '', updated: 'Today' },
  { id: 'APP-302', sourceId: 'SRC-1088', role: 'Data Engineer', stage: 'Screening', outcome: '', updated: 'Today' },
  { id: 'APP-303', sourceId: 'SRC-1125', role: 'Analytics Consultant', stage: 'Decision', outcome: 'Selected', updated: 'Yesterday' },
  { id: 'APP-304', sourceId: 'SRC-1210', role: 'Data Analyst', stage: 'Added to role', outcome: '', updated: 'Yesterday' },
]

const initialTeam: TeamMember[] = [
  { name: 'Maya Chen', email: 'maya.chen@example.test', role: 'Recruiter', status: 'Demo active' },
  { name: 'Jordan Lee', email: 'jordan.lee@example.test', role: 'Hiring manager', status: 'Demo active' },
]

const viewDetails: Record<View, { title: string; subtitle: string; icon: string }> = {
  pipeline: { title: 'Role pipeline', subtitle: 'Track role applications from an existing candidate repository.', icon: '▦' },
  repository: { title: 'Candidate repository', subtitle: 'Read existing source profiles and link candidates to roles.', icon: '◎' },
  candidates: { title: 'Candidates', subtitle: 'Create and maintain recruiter-sourced candidate profiles.', icon: '＋' },
  talent: { title: 'Reusable pool', subtitle: 'Review potential candidates for future openings.', icon: '⌕' },
  admin: { title: 'Administration', subtitle: 'Manage demo skills, roles, and team access.', icon: '⚙' },
}

function profileFor(sourceId: string, profiles: Candidate[]) {
  return profiles.find((profile) => profile.id === sourceId)
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
}

function displayName(profile: Candidate | undefined, index: number, mode: PreviewMode) {
  if (mode === 'manager') return `Candidate ${String(index + 1).padStart(2, '0')}`
  return profile?.name ?? 'Unknown candidate'
}

function SkillList({ skills }: { skills: string[] }) {
  if (!skills.length) return <span className="muted">No skills listed</span>
  return (
    <div className="skill-list">
      {skills.map((skill) => (
        <span className="skill-chip" key={skill}>{skill}</span>
      ))}
    </div>
  )
}

function EmptyState({ title, children }: { title: string; children: string }) {
  return <div className="empty-state"><strong>{title}</strong><span>{children}</span></div>
}

export default function Page() {
  const [activeView, setActiveView] = useState<View>('pipeline')
  const [mode, setMode] = useState<PreviewMode>('recruiter')
  const [repository, setRepository] = useState(initialRepository)
  const [applications, setApplications] = useState(initialApplications)
  const [roles, setRoles] = useState(initialRoles)
  const [masterSkills, setMasterSkills] = useState(initialSkills)
  const [candidateIds, setCandidateIds] = useState<string[]>([])
  const [team, setTeam] = useState(initialTeam)
  const [selectedRole, setSelectedRole] = useState(initialRoles[0])
  const [editingCandidateId, setEditingCandidateId] = useState('')
  const [pipelineSearch, setPipelineSearch] = useState('')
  const [pipelineRole, setPipelineRole] = useState('')
  const [pipelineStage, setPipelineStage] = useState('')
  const [repositorySearch, setRepositorySearch] = useState('')
  const [talentSearch, setTalentSearch] = useState('')
  const [talentRole, setTalentRole] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const showToast = (message: string) => setToast(message)

  const navigate = (view: View) => {
    setActiveView(view)
    setEditingCandidateId('')
  }

  const updateApplication = (applicationId: string, field: 'stage' | 'outcome', value: string) => {
    setApplications((current) => current.map((application) =>
      application.id === applicationId
        ? { ...application, [field]: value, updated: 'Just now' }
        : application,
    ))
    showToast(field === 'stage' ? 'Role application stage updated.' : 'Role application outcome updated.')
  }

  const linkCandidate = (sourceId: string) => {
    if (applications.some((application) => application.sourceId === sourceId && application.role === selectedRole)) {
      showToast('This profile is already linked to that role.')
      return
    }
    setApplications((current) => [
      ...current,
      {
        id: `APP-${301 + current.length}`,
        sourceId,
        role: selectedRole,
        stage: 'Added to role',
        outcome: '',
        updated: 'Just now',
      },
    ])
    navigate('pipeline')
    showToast(`Linked existing source profile to ${selectedRole}. The source profile was not changed.`)
  }

  const saveCandidate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const skillNames = String(data.get('skills') ?? '').split(',').map((skill) => skill.trim()).filter(Boolean)
    const file = form.querySelector<HTMLInputElement>('input[type="file"]')?.files?.[0]
    const editing = repository.find((profile) => profile.id === editingCandidateId)
    const resume = file?.name ?? editing?.resume ?? ''

    if (editing) {
      setRepository((current) => current.map((profile) => profile.id === editing.id
        ? {
            ...profile,
            name,
            email,
            skills: skillNames.map((skill) => `${skill} · not assessed`),
            resume,
            summary: 'Recruiter-created demo candidate profile.',
          }
        : profile,
      ))
      showToast('Demo candidate profile updated. No file was uploaded.')
    } else {
      const id = `PR-${String(Date.now()).slice(-6)}`
      setRepository((current) => [...current, {
        id,
        name,
        email,
        source: 'Candidate',
        skills: skillNames.map((skill) => `${skill} · not assessed`),
        summary: 'Recruiter-created demo candidate profile.',
        resume,
      }])
      setCandidateIds((current) => [...current, id])
      showToast('Demo candidate profile created. No file was uploaded.')
    }
    setEditingCandidateId('')
    form.reset()
  }

  const addSkill = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const value = String(new FormData(form).get('skill') ?? '').trim()
    if (value && !masterSkills.some((skill) => skill.toLowerCase() === value.toLowerCase())) {
      setMasterSkills((current) => [...current, value])
      showToast('Skill added to the demo list.')
    }
    form.reset()
  }

  const addRole = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const value = String(new FormData(form).get('role') ?? '').trim()
    if (value && !roles.some((role) => role.toLowerCase() === value.toLowerCase())) {
      setRoles((current) => [...current, value])
      setSelectedRole(value)
      showToast('Role added to the demo options.')
    }
    form.reset()
  }

  const addTeamMember = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const email = String(data.get('email') ?? '').trim()
    if (team.some((member) => member.email.toLowerCase() === email.toLowerCase())) {
      showToast('A demo account with that email already exists.')
      return
    }
    const status = data.get('access') === 'active' ? 'Demo active' : 'Invite simulated'
    setTeam((current) => [...current, {
      name: String(data.get('name') ?? '').trim(),
      email,
      role: String(data.get('role') ?? ''),
      status,
    }])
    showToast(status === 'Demo active' ? 'Demo account created.' : `Invitation simulated for ${email}.`)
    form.reset()
  }

  const filteredApplications = applications.filter((application) => {
    const profile = profileFor(application.sourceId, repository)
    const text = `${profile?.name ?? ''} ${profile?.email ?? ''} ${profile?.skills.join(' ') ?? ''} ${application.role} ${application.stage} ${application.outcome}`.toLowerCase()
    return text.includes(pipelineSearch.toLowerCase())
      && (!pipelineRole || application.role === pipelineRole)
      && (!pipelineStage || application.stage === pipelineStage)
  })

  const filteredRepository = repository.filter((profile) => {
    const text = `${profile.name} ${profile.email} ${profile.source} ${profile.skills.join(' ')}`.toLowerCase()
    return text.includes(repositorySearch.toLowerCase())
  })

  const poolApplications = applications.filter((application) =>
    ['Interview', 'Decision'].includes(application.stage)
      && (!talentRole || application.role === talentRole)
      && `${application.role} ${profileFor(application.sourceId, repository)?.skills.join(' ') ?? ''}`
        .toLowerCase().includes(talentSearch.toLowerCase()),
  )

  const currentView = viewDetails[activeView]

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Main navigation">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">T</span>
          <span><strong>Talent workspace</strong><small>Referral &amp; pipeline</small></span>
        </div>
        <div className="navigation-group">
          <p className="nav-label">Workspace</p>
          <nav className="side-nav">
            {(['pipeline', 'repository', 'candidates', 'talent', 'admin'] as View[]).map((view) => (
              <button
                aria-current={activeView === view ? 'page' : undefined}
                className={activeView === view ? 'active' : ''}
                key={view}
                onClick={() => navigate(view)}
                type="button"
              >
                <span aria-hidden="true">{viewDetails[view].icon}</span>{viewDetails[view].title}
              </button>
            ))}
          </nav>
        </div>
        <div className="sidebar-footer">
          <strong>Concept prototype</strong>
          Synthetic sample data · no external system connected
        </div>
      </aside>

      <main className="main-content">
        <div className="topline">
          <div className="breadcrumb">Recruiting workspace <span>/</span> {currentView.title}</div>
          <label className="preview-mode">
            <span>Preview as</span>
            <select aria-label="Preview user role" value={mode} onChange={(event) => setMode(event.target.value as PreviewMode)}>
              <option value="recruiter">Recruiter — full details</option>
              <option value="manager">Hiring manager — anonymized</option>
              <option value="admin">Administrator — system setup</option>
            </select>
          </label>
        </div>

        <header className="page-heading">
          <div>
            <p className="eyebrow">Candidate operations</p>
            <h1>{currentView.title}</h1>
            <p className="page-subtitle">{currentView.subtitle}</p>
          </div>
          <span className="demo-pill"><span aria-hidden="true">●</span> Demo data</span>
        </header>

        <section className="slice-banner" aria-label="First vertical slice">
          <span className="slice-mark">1</span>
          <div><strong>First vertical slice · Repository to role pipeline</strong><p>Select an existing candidate, link them to a role, then update stage and outcome. The source profile stays read-only in this flow.</p></div>
        </section>

        <nav className="view-tabs" aria-label="Candidate views">
          {(['pipeline', 'repository', 'candidates', 'talent', 'admin'] as View[]).map((view) => (
            <button
              aria-current={activeView === view ? 'page' : undefined}
              className={activeView === view ? 'active' : ''}
              key={view}
              onClick={() => navigate(view)}
              type="button"
            >{viewDetails[view].title}</button>
          ))}
        </nav>

        <section className="view-panel" aria-live="polite">
          {activeView === 'pipeline' && (
            <>
              <div className="panel-heading">
                <div><h2>Applications in progress</h2><p>Each row is a role-specific application linked to a source profile.</p></div>
                <span className="pill blue">{applications.length} demo applications</span>
              </div>
              <div className="notice"><span aria-hidden="true">↳</span><p><strong>Source profiles stay read-only in this flow.</strong> Stage and outcome changes belong to the role application.</p></div>
              <div className="filters">
                <input aria-label="Search pipeline" className="text-field search-field" onChange={(event) => setPipelineSearch(event.target.value)} placeholder={mode === 'manager' ? 'Search role or skills' : 'Search candidate, role, or skill'} value={pipelineSearch} />
                <select aria-label="Filter by role" className="select-field" onChange={(event) => setPipelineRole(event.target.value)} value={pipelineRole}>
                  <option value="">All roles</option>{roles.map((role) => <option key={role}>{role}</option>)}
                </select>
                <select aria-label="Filter by stage" className="select-field" onChange={(event) => setPipelineStage(event.target.value)} value={pipelineStage}>
                  <option value="">All stages</option>{stages.map((stage) => <option key={stage}>{stage}</option>)}
                </select>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Candidate</th><th>Role</th><th>Stage</th><th>Outcome</th><th>Skills summary</th><th>Updated</th></tr></thead>
                  <tbody>
                    {filteredApplications.map((application) => {
                      const profile = profileFor(application.sourceId, repository)
                      const appIndex = applications.findIndex((item) => item.id === application.id)
                      return (
                        <tr key={application.id}>
                          <td><div className="candidate-cell"><span className="avatar">{mode === 'manager' ? 'C' : initials(profile?.name ?? '?')}</span><span><strong>{displayName(profile, appIndex, mode)}</strong><small>{mode === 'manager' ? 'Anonymized demo profile' : `${profile?.source ?? 'Unknown source'} · ${application.id}`}</small></span></div></td>
                          <td>{application.role}</td>
                          <td><select aria-label={`Stage for ${application.id}`} className="table-select" onChange={(event) => updateApplication(application.id, 'stage', event.target.value)} value={application.stage}>{stages.map((stage) => <option key={stage}>{stage}</option>)}</select></td>
                          <td><select aria-label={`Outcome for ${application.id}`} className="table-select" onChange={(event) => updateApplication(application.id, 'outcome', event.target.value)} value={application.outcome}><option value="">—</option>{outcomes.map((outcome) => <option key={outcome}>{outcome}</option>)}</select></td>
                          <td><SkillList skills={profile?.skills ?? []} /></td>
                          <td><span className="updated-label">{application.updated}</span></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {!filteredApplications.length && <EmptyState title="No matching applications">Try changing the search or filters.</EmptyState>}
              </div>
            </>
          )}

          {activeView === 'repository' && (
            mode === 'manager' ? (
              <EmptyState title="Candidate repository is recruiter-only in this concept">Hiring managers would use the anonymized pool preview, or request candidates through the recruiting team. Access rules are still a demo assumption.</EmptyState>
            ) : (
              <>
                <div className="panel-heading">
                  <div><h2>Candidate repository</h2><p>Browse demo source profiles and link one to a role pipeline.</p></div>
                  <span className="pill teal">Read-only source</span>
                </div>
                <div className="notice"><span aria-hidden="true">i</span><p><strong>Repository-owned details stay unchanged.</strong> Linking a profile creates a role-specific demo record; it does not edit the source profile.</p></div>
                <div className="filters repository-filters">
                  <input aria-label="Search repository" className="text-field search-field" onChange={(event) => setRepositorySearch(event.target.value)} placeholder="Search name, source, or skill" value={repositorySearch} />
                  <label htmlFor="repo-role">Track for role</label>
                  <select className="select-field" id="repo-role" onChange={(event) => setSelectedRole(event.target.value)} value={selectedRole}>{roles.map((role) => <option key={role}>{role}</option>)}</select>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Source candidate</th><th>Source</th><th>Skills on profile</th><th>Action</th></tr></thead>
                    <tbody>
                      {filteredRepository.map((profile) => {
                        const alreadyLinked = applications.some((application) => application.sourceId === profile.id && application.role === selectedRole)
                        return <tr key={profile.id}>
                          <td><div className="candidate-cell"><span className="avatar">{initials(profile.name)}</span><span><strong>{profile.name}</strong><small>{profile.email}</small></span></div></td>
                          <td><span className="pill gray">{profile.source}</span></td>
                          <td><SkillList skills={profile.skills} /></td>
                          <td><button className="button primary" disabled={alreadyLinked} onClick={() => linkCandidate(profile.id)} type="button">{alreadyLinked ? 'Already linked' : 'Link to role'}</button></td>
                        </tr>
                      })}
                    </tbody>
                  </table>
                  {!filteredRepository.length && <EmptyState title="No matching candidates">Try another name or skill.</EmptyState>}
                </div>
              </>
            )
          )}

          {activeView === 'talent' && (
            <>
              <div className="panel-heading">
                <div><h2>Reusable candidate pool</h2><p>Concept view for candidates at interview or decision stage.</p></div>
                <span className={`pill ${mode === 'manager' ? 'amber' : 'blue'}`}>{mode === 'manager' ? 'Anonymized preview' : 'Recruiter view'}</span>
              </div>
              <div className="notice warning"><span aria-hidden="true">i</span><p><strong>Eligibility is a placeholder.</strong> This demo uses interview or decision stage as a sample filter. Reuse rules and skills criteria still need agreement.</p></div>
              <div className="filters">
                <input aria-label="Search reusable pool" className="text-field search-field" onChange={(event) => setTalentSearch(event.target.value)} placeholder="Search role or skill" value={talentSearch} />
                <select aria-label="Filter reusable pool by role" className="select-field" onChange={(event) => setTalentRole(event.target.value)} value={talentRole}><option value="">All roles</option>{roles.map((role) => <option key={role}>{role}</option>)}</select>
                <span className="pill gray">Demo filter: Interview or Decision</span>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Candidate</th><th>Prior role</th><th>Last stage</th><th>Outcome</th><th>Skills summary</th></tr></thead>
                  <tbody>
                    {poolApplications.map((application) => {
                      const profile = profileFor(application.sourceId, repository)
                      const appIndex = applications.findIndex((item) => item.id === application.id)
                      return <tr key={application.id}>
                        <td><div className="candidate-cell"><span className="avatar">{mode === 'manager' ? 'C' : initials(profile?.name ?? '?')}</span><span><strong>{displayName(profile, appIndex, mode)}</strong><small>{mode === 'manager' ? 'Anonymized demo profile' : profile?.source}</small></span></div></td>
                        <td>{application.role}</td><td><span className="pill blue">{application.stage}</span></td><td>{application.outcome || '—'}</td><td><SkillList skills={profile?.skills ?? []} /></td>
                      </tr>
                    })}
                  </tbody>
                </table>
                {!poolApplications.length && <EmptyState title="No demo candidates in this view">Try another role or search term.</EmptyState>}
              </div>
            </>
          )}

          {activeView === 'candidates' && (
            mode === 'manager' ? (
              <EmptyState title="Candidate management is recruiter-only in this concept">Hiring manager access shown here is a UI preview only.</EmptyState>
            ) : (
              <>
                <div className="panel-heading">
                  <div><h2>{editingCandidateId ? 'Edit candidate' : 'Add a candidate'}</h2><p>Create a recruiter-managed demo profile with contact details, a CV filename, and initial skills.</p></div>
                  <span className="pill teal">Recruiter workspace</span>
                </div>
                <form className="form-card" key={editingCandidateId || 'new-candidate'} onSubmit={saveCandidate}>
                  <div className="form-grid">
                    <label className="form-field">Full name<input defaultValue={repository.find((profile) => profile.id === editingCandidateId)?.name ?? ''} name="name" placeholder="e.g. Alex Rivera" required /></label>
                    <label className="form-field">Email<input defaultValue={repository.find((profile) => profile.id === editingCandidateId)?.email ?? ''} name="email" placeholder="alex@example.test" required type="email" /></label>
                    <label className="form-field">Initial skills<input defaultValue={repository.find((profile) => profile.id === editingCandidateId)?.skills.map((skill) => skill.replace(/ · .*/, '')).join(', ') ?? ''} list="skill-suggestions" name="skills" placeholder="SQL, Python, stakeholder management" /><datalist id="skill-suggestions">{masterSkills.map((skill) => <option key={skill} value={skill} />)}</datalist></label>
                    <label className="form-field">Curriculum vitae<input accept=".pdf,.doc,.docx" name="resume" type="file" /></label>
                    <p className="form-help">Demo only: the selected filename is displayed. No CV is uploaded or stored.</p>
                  </div>
                  <div className="form-actions"><button className="button primary" type="submit">{editingCandidateId ? 'Save demo changes' : 'Create demo candidate'}</button>{editingCandidateId && <button className="button" onClick={() => setEditingCandidateId('')} type="button">Cancel</button>}</div>
                </form>
                <div className="panel-heading list-heading"><div><h2>Candidates</h2><p>{candidateIds.length} recruiter-created demo profiles</p></div></div>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Candidate</th><th>Initial skills</th><th>Curriculum vitae</th><th>Action</th></tr></thead>
                    <tbody>{candidateIds.map((id) => {
                      const profile = repository.find((candidate) => candidate.id === id)
                      if (!profile) return null
                      return <tr key={profile.id}>
                        <td><div className="candidate-cell"><span className="avatar">{initials(profile.name)}</span><span><strong>{profile.name}</strong><small>{profile.email}</small></span></div></td>
                        <td><SkillList skills={profile.skills} /></td><td><span className="file-chip">{profile.resume || 'No CV attached'}</span></td>
                        <td><button className="button" onClick={() => setEditingCandidateId(profile.id)} type="button">Edit</button></td>
                      </tr>
                    })}</tbody>
                  </table>
                  {!candidateIds.length && <EmptyState title="No demo candidates yet">Use the form above to create the first profile.</EmptyState>}
                </div>
              </>
            )
          )}

          {activeView === 'admin' && (
            <>
              <div className="panel-heading"><div><h2>Workspace administration</h2><p>These lists and accounts only exist in this browser demo.</p></div><span className="pill amber">Demo controls</span></div>
              <div className="admin-grid">
                <section className="form-card">
                  <div className="box-heading"><div><h3>Skills</h3><p>Shared skill options for demo profiles.</p></div></div>
                  <form className="inline-form" onSubmit={addSkill}><input aria-label="New skill" className="text-field" name="skill" placeholder="New skill" required /><button className="button primary" type="submit">Add skill</button></form>
                  <ul className="manage-list">{masterSkills.map((skill, index) => <li key={skill}><span>{skill}</span><button aria-label={`Remove ${skill}`} className="icon-button" onClick={() => setMasterSkills((current) => current.filter((_, itemIndex) => itemIndex !== index))} type="button">×</button></li>)}</ul>
                </section>
                <section className="form-card">
                  <div className="box-heading"><div><h3>Roles</h3><p>Roles available in the demo pipeline.</p></div></div>
                  <form className="inline-form" onSubmit={addRole}><input aria-label="New role" className="text-field" name="role" placeholder="New role" required /><button className="button primary" type="submit">Add role</button></form>
                  <ul className="manage-list">{roles.map((role, index) => <li key={role}><span>{role}</span><button aria-label={`Remove ${role}`} className="icon-button" onClick={() => {
                    if (roles.length < 2) { showToast('Keep at least one demo role.'); return }
                    setRoles((current) => current.filter((_, itemIndex) => itemIndex !== index))
                    if (selectedRole === role) setSelectedRole(roles.find((item) => item !== role) ?? '')
                  }} type="button">×</button></li>)}</ul>
                </section>
              </div>
              <section className="form-card team-card">
                <div className="box-heading"><div><h3>Team accounts</h3><p>Invitation behavior is simulated. No user, password, or email account is created.</p></div></div>
                <form onSubmit={addTeamMember}>
                  <div className="form-grid team-form-grid">
                    <label className="form-field">Full name<input name="name" placeholder="Full name" required /></label>
                    <label className="form-field">Work email<input name="email" placeholder="name@example.test" required type="email" /></label>
                    <label className="form-field">Role<select className="select-field" name="role"><option>Recruiter</option><option>Hiring manager</option></select></label>
                    <label className="form-field">Account access<select className="select-field" name="access"><option value="invite">Simulate setup invitation</option><option value="active">Create demo account</option></select></label>
                  </div>
                  <div className="form-actions"><button className="button primary" type="submit">Create demo account</button></div>
                </form>
                <div className="table-wrap team-table">
                  <table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead><tbody>
                    {team.map((member, index) => <tr key={`${member.email}-${index}`}><td>{member.name}</td><td>{member.email}</td><td>{member.role}</td><td><span className="pill gray">{member.status}</span></td><td><button className="button" onClick={() => showToast(`Demo invitation simulated for ${member.email}.`)} type="button">Resend invite</button></td></tr>)}
                  </tbody></table>
                </div>
              </section>
            </>
          )}
        </section>

        <p className="prototype-note"><strong>Prototype behavior:</strong> changes stay in this page session and reset when it reloads. Candidate repository connection, CV storage, role-based access, reuse rules, skill interpretation, team invitations, and persistence are not connected.</p>
      </main>
      {toast && <div className="toast-message" role="status" aria-live="polite">{toast}</div>}
    </div>
  )
}
