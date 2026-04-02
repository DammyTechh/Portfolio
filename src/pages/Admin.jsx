import { useState, useEffect, useRef } from 'react'
import {
  signIn, signOut, getSession, onAuthChange,
  getAllProjects, createProject, updateProject, deleteProject,
  getCV, upsertCV,
  getAllCerts, createCert, updateCert, deleteCert,
  uploadFile, deleteFile,
} from '../lib/supabase'
import styles from './Admin.module.css'

const ACCENT_OPTIONS = [
  { label: 'Sky Blue', value: 'var(--sky-400)',        hex: '#38bdf8' },
  { label: 'Cyan',     value: 'var(--cyan-400)',       hex: '#22d3ee' },
  { label: 'Indigo',   value: 'var(--indigo-400)',     hex: '#818cf8' },
  { label: 'Emerald',  value: 'var(--emerald-400)',    hex: '#34d399' },
  { label: 'Amber',    value: 'var(--amber-400)',      hex: '#fbbf24' },
  { label: 'White',    value: 'rgba(255,255,255,0.8)', hex: '#f0f8ff' },
]
const EMPTY_PROJECT = {
  title:'',tagline:'',description:'',category:'',year:new Date().getFullYear().toString(),
  stack:'',highlights:'',link:'',image_url:'',video_url:'',
  accent:'var(--sky-400)',featured:false,published:true,sort_order:0,
}
const EMPTY_CERT = {
  title:'',issuer:'',issued_date:'',expiry_date:'',
  credential_id:'',credential_url:'',image_url:'',
  published:true,sort_order:0,
}

/* ── Shared ───────────────────────────────────────────────────────────────── */

function LoginScreen() {
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState('')
  const [loading,setLoading]=useState(false)
  const handleSubmit=async e=>{
    e.preventDefault();setError('');setLoading(true)
    try{await signIn(email,password)}catch(err){setError(err.message||'Login failed')}finally{setLoading(false)}
  }
  return(
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <div className={styles.loginLogo}><span className={styles.loginInitials}>OKB</span><span className={styles.loginDot}/></div>
        <h1 className={styles.loginTitle}>Admin Portal</h1>
        <p className={styles.loginSub}>Sign in to manage your portfolio</p>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div><label className="admin-label">Email</label><input className="admin-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" required/></div>
          <div><label className="admin-label">Password</label><input className="admin-input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required/></div>
          {error&&<div className={styles.errorBox}>{error}</div>}
          <button type="submit" className={styles.btnPrimary} disabled={loading}>{loading?'Signing in…':'Sign In'}</button>
        </form>
        <p className={styles.loginNote}>Use the credentials you set up in Supabase Authentication.</p>
      </div>
    </div>
  )
}

function UploadField({label,accept,value,onChange,folder,showPreview=true}){
  const inputRef=useRef(null)
  const [progress,setProgress]=useState(null)
  const [err,setErr]=useState('')
  const handleFile=async e=>{
    const file=e.target.files[0];if(!file)return
    setErr('');setProgress(0)
    try{
      const tick=setInterval(()=>setProgress(p=>Math.min(p+10,85)),200)
      const url=await uploadFile(file,folder)
      clearInterval(tick);setProgress(100);onChange(url)
      setTimeout(()=>setProgress(null),800)
    }catch(err){setErr(err.message||'Upload failed');setProgress(null)}
    e.target.value=''
  }
  const isImg=accept.includes('image')
  const isPDF=accept.includes('pdf')||accept.includes('application')
  return(
    <div className={styles.fileField}>
      <label className="admin-label">{label}</label>
      <div className={styles.fileRow}>
        <input className="admin-input" type="text" value={value} onChange={e=>onChange(e.target.value)} placeholder="Paste URL or upload below"/>
        <button type="button" className={styles.btnUpload} onClick={()=>inputRef.current?.click()}>↑ Upload</button>
        <input ref={inputRef} type="file" accept={accept} onChange={handleFile} style={{display:'none'}}/>
      </div>
      {progress!==null&&(
        <div className={styles.progressWrap}>
          <div className={styles.progressBar} style={{width:`${progress}%`}}/>
          <span className={styles.progressLabel}>{progress<100?'Uploading…':'Done ✓'}</span>
        </div>
      )}
      {showPreview&&value&&(
        <div className={styles.filePreview}>
          {isImg&&<img src={value} alt="preview" className={styles.imgPreview}/>}
          {isPDF&&<a href={value} target="_blank" rel="noopener noreferrer" className={styles.pdfPreview}>📄 View uploaded file ↗</a>}
        </div>
      )}
      {err&&<span className={styles.fieldError}>{err}</span>}
    </div>
  )
}

function Toggle({checked,onChange,label}){
  return(
    <label className={styles.toggle}>
      <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)}/>
      <span className={styles.toggleTrack}><span className={styles.toggleThumb}/></span>
      <span className={styles.toggleLabel}>{label}</span>
    </label>
  )
}

/* ── Projects ─────────────────────────────────────────────────────────────── */

function ProjectForm({initial,onSave,onCancel,saving}){
  const [form,setForm]=useState(()=>{
    if(!initial)return EMPTY_PROJECT
    return{...initial,stack:Array.isArray(initial.stack)?initial.stack.join(', '):(initial.stack||''),highlights:Array.isArray(initial.highlights)?initial.highlights.join('\n'):(initial.highlights||'')}
  })
  const set=(k,v)=>setForm(p=>({...p,[k]:v}))
  const handleSubmit=e=>{
    e.preventDefault()
    onSave({...form,stack:form.stack?form.stack.split(',').map(s=>s.trim()).filter(Boolean):[],highlights:form.highlights?form.highlights.split('\n').map(s=>s.trim()).filter(Boolean):[],sort_order:Number(form.sort_order)||0})
  }
  return(
    <form onSubmit={handleSubmit} className={styles.projectForm}>
      <div className={styles.formGrid}>
        <div className={styles.formCol}>
          <h3 className={styles.formSection}>Project Details</h3>
          <div className={styles.field}><label className="admin-label">Title *</label><input className="admin-input" value={form.title} onChange={e=>set('title',e.target.value)} placeholder="e.g. Smart IoT Freezer Monitoring System" required/></div>
          <div className={styles.field}><label className="admin-label">Tagline</label><input className="admin-input" value={form.tagline} onChange={e=>set('tagline',e.target.value)} placeholder="One-line summary shown on the card"/></div>
          <div className={styles.field}><label className="admin-label">Description</label><textarea className="admin-input" rows={4} value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Detailed project description…"/></div>
          <div className={styles.fieldRow}>
            <div className={styles.field}><label className="admin-label">Category</label><input className="admin-input" value={form.category} onChange={e=>set('category',e.target.value)} placeholder="IoT · Embedded"/></div>
            <div className={styles.field}><label className="admin-label">Year</label><input className="admin-input" value={form.year} onChange={e=>set('year',e.target.value)} placeholder="2024"/></div>
            <div className={styles.field}><label className="admin-label">Order</label><input className="admin-input" type="number" value={form.sort_order} onChange={e=>set('sort_order',e.target.value)}/></div>
          </div>
          <div className={styles.field}><label className="admin-label">Tech Stack (comma-separated)</label><input className="admin-input" value={form.stack} onChange={e=>set('stack',e.target.value)} placeholder="ESP32, Arduino, Firebase, Python"/></div>
          <div className={styles.field}><label className="admin-label">Highlights (one per line)</label><textarea className="admin-input" rows={4} value={form.highlights} onChange={e=>set('highlights',e.target.value)} placeholder={"Real-time monitoring\nAuto cutoff on overload\nRemote access"}/></div>
          <div className={styles.field}><label className="admin-label">Project / GitHub Link</label><input className="admin-input" type="url" value={form.link} onChange={e=>set('link',e.target.value)} placeholder="https://github.com/…"/></div>
        </div>
        <div className={styles.formCol}>
          <h3 className={styles.formSection}>Media</h3>
          <UploadField label="Project Image" accept="image/*" folder="projects/images" value={form.image_url} onChange={v=>set('image_url',v)}/>
          <UploadField label="Demo Video (optional — plays instead of image)" accept="video/*" folder="projects/videos" value={form.video_url} onChange={v=>set('video_url',v)} showPreview={false}/>
          <h3 className={styles.formSection} style={{marginTop:24}}>Display</h3>
          <div className={styles.field}>
            <label className="admin-label">Card Accent Colour</label>
            <div className={styles.accentRow}>
              {ACCENT_OPTIONS.map(opt=>(
                <button key={opt.value} type="button"
                  className={`${styles.accentChip} ${form.accent===opt.value?styles.accentChipActive:''}`}
                  style={{'--ac':opt.hex}} onClick={()=>set('accent',opt.value)} title={opt.label}/>
              ))}
            </div>
          </div>
          <div className={styles.toggleRow}><Toggle checked={form.published} onChange={v=>set('published',v)} label="Published (visible on site)"/></div>
          <div className={styles.toggleRow}><Toggle checked={form.featured} onChange={v=>set('featured',v)} label="Featured (pinned first)"/></div>
        </div>
      </div>
      <div className={styles.formActions}>
        <button type="button" className={styles.btnGhost} onClick={onCancel}>Cancel</button>
        <button type="submit" className={styles.btnPrimary} disabled={saving}>{saving?'Saving…':(initial?.id?'Update Project':'Add Project')}</button>
      </div>
    </form>
  )
}

function ItemRow({img,title,meta,published,onEdit,onToggle,onDelete}){
  const [del,setDel]=useState(false)
  return(
    <div className={`${styles.row} ${!published?styles.rowDraft:''}`}>
      <div className={styles.rowImg}>{img?<img src={img} alt=""/>:<span>·</span>}</div>
      <div className={styles.rowInfo}>
        <span className={styles.rowTitle}>{title}</span>
        <div className={styles.rowMeta}>
          {meta.map((m,i)=><span key={i}>{m}</span>)}
          <span className={`${styles.statusBadge} ${published?styles.statusLive:styles.statusDraft}`}>{published?'Live':'Draft'}</span>
        </div>
      </div>
      <div className={styles.rowActions}>
        <button className={styles.btnIcon} onClick={onToggle} title={published?'Unpublish':'Publish'}>{published?'◉':'○'}</button>
        <button className={styles.btnIcon} onClick={onEdit} title="Edit">✎</button>
        <button className={`${styles.btnIcon} ${styles.btnIconDanger}`} disabled={del} onClick={async()=>{if(!confirm('Delete this?'))return;setDel(true);try{await onDelete()}finally{setDel(false)}}}>{del?'…':'✕'}</button>
      </div>
    </div>
  )
}

function ProjectsTab({showToast}){
  const [projects,setProjects]=useState([])
  const [loading,setLoading]=useState(false)
  const [view,setView]=useState('list')
  const [editing,setEditing]=useState(null)
  const [saving,setSaving]=useState(false)
  const reload=()=>{setLoading(true);getAllProjects().then(setProjects).catch(e=>showToast(e.message,'error')).finally(()=>setLoading(false))}
  useEffect(reload,[])
  const handleSave=async payload=>{
    setSaving(true)
    try{editing?.id?await updateProject(editing.id,payload):await createProject(payload);showToast(editing?.id?'Project updated!':'Project added!');setView('list');setEditing(null);reload()}
    catch(e){showToast(e.message,'error')}finally{setSaving(false)}
  }
  const handleDelete=async p=>{
    try{if(p.image_url?.includes('portfolio-media'))await deleteFile(p.image_url);if(p.video_url?.includes('portfolio-media'))await deleteFile(p.video_url);await deleteProject(p.id);showToast('Deleted');reload()}
    catch(e){showToast(e.message,'error')}
  }
  const handleToggle=async p=>{try{await updateProject(p.id,{published:!p.published});showToast(p.published?'Unpublished':'Now live');reload()}catch(e){showToast(e.message,'error')}}

  if(view!=='list')return(<div><div className={styles.formHeader}><button className={styles.backBtn} onClick={()=>{setView('list');setEditing(null)}}>← Back</button><h2 className={styles.tabTitle}>{view==='new'?'Add Project':`Edit: ${editing?.title}`}</h2></div><ProjectForm initial={editing} onSave={handleSave} onCancel={()=>{setView('list');setEditing(null)}} saving={saving}/></div>)

  return(<div>
    <div className={styles.listHeader}>
      <div><h2 className={styles.tabTitle}>Projects</h2><p className={styles.tabSub}>{projects.length} project{projects.length!==1?'s':''} · changes go live immediately</p></div>
      <button className={styles.btnPrimary} onClick={()=>{setEditing(null);setView('new')}}>+ Add Project</button>
    </div>
    {loading?<div className={styles.skeletonList}>{[1,2,3].map(i=><div key={i} className={styles.rowSkeleton}/>)}</div>
    :projects.length===0?<div className={styles.emptyState}><div className={styles.emptyIcon}>⬡</div><h3>No projects yet</h3><p>Add your first project and it appears on the site automatically.</p><button className={styles.btnPrimary} onClick={()=>setView('new')}>Add First Project</button></div>
    :<div className={styles.rowList}>{projects.map(p=><ItemRow key={p.id} img={p.image_url} title={p.title} meta={[p.category,p.year].filter(Boolean)} published={p.published} onEdit={()=>{setEditing(p);setView('edit')}} onToggle={()=>handleToggle(p)} onDelete={()=>handleDelete(p)}/>)}</div>}
  </div>)
}

/* ── CV Tab ───────────────────────────────────────────────────────────────── */

function CVTab({showToast}){
  const [cv,setCV]=useState(null)
  const [loading,setLoading]=useState(true)
  const [saving,setSaving]=useState(false)
  const [form,setForm]=useState({file_url:'',file_name:'',label:'Download CV'})
  const set=(k,v)=>setForm(p=>({...p,[k]:v}))

  useEffect(()=>{
    getCV().then(data=>{if(data){setCV(data);setForm({file_url:data.file_url,file_name:data.file_name||'',label:data.label||'Download CV'})}}).catch(e=>showToast(e.message,'error')).finally(()=>setLoading(false))
  },[])

  const handleSave=async e=>{
    e.preventDefault()
    if(!form.file_url){showToast('Please upload or paste a CV file URL first','error');return}
    setSaving(true)
    try{
      await upsertCV({file_url:form.file_url,file_name:form.file_name||'CV.pdf',label:form.label||'Download CV'})
      showToast('CV updated — visitors will now download your latest file!')
      const updated=await getCV();setCV(updated)
    }catch(e){showToast(e.message,'error')}finally{setSaving(false)}
  }

  if(loading)return <div className={styles.skeletonList}><div className={styles.rowSkeleton}/></div>

  return(<div>
    <div className={styles.listHeader}>
      <div><h2 className={styles.tabTitle}>CV / Resume</h2><p className={styles.tabSub}>The "Download CV" button on your site always links to the file you upload here</p></div>
    </div>

    {cv&&(
      <div className={styles.currentCVCard}>
        <div className={styles.cvCardIcon}>📄</div>
        <div className={styles.cvCardInfo}>
          <span className={styles.cvCardName}>{cv.file_name||'CV.pdf'}</span>
          <span className={styles.cvCardDate}>Last updated {new Date(cv.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</span>
        </div>
        <a href={cv.file_url} target="_blank" rel="noopener noreferrer" className={styles.btnGhost}>View Current ↗</a>
      </div>
    )}

    <form onSubmit={handleSave} className={styles.cvForm}>
      <div className={styles.cvFormInner}>
        <UploadField label="Upload new CV / Resume (PDF recommended)" accept=".pdf,.doc,.docx,application/pdf" folder="cv" value={form.file_url} onChange={v=>set('file_url',v)} showPreview={true}/>
        <div className={styles.fieldRow}>
          <div className={styles.field}><label className="admin-label">Display filename</label><input className="admin-input" value={form.file_name} onChange={e=>set('file_name',e.target.value)} placeholder="Olawale_Kabiru_CV_2025.pdf"/></div>
          <div className={styles.field}><label className="admin-label">Button label on site</label><input className="admin-input" value={form.label} onChange={e=>set('label',e.target.value)} placeholder="Download CV"/></div>
        </div>
        <div className={styles.cvNote}><span>⚡</span><span>Once saved, every visitor who clicks "Download CV" on your site gets this file. Replace it any time — the button URL updates instantly.</span></div>
        <button type="submit" className={styles.btnPrimary} disabled={saving} style={{alignSelf:'flex-start'}}>{saving?'Saving…':cv?'Update CV':'Save CV'}</button>
      </div>
    </form>
  </div>)
}

/* ── Certifications Tab ───────────────────────────────────────────────────── */

function CertForm({initial,onSave,onCancel,saving}){
  const [form,setForm]=useState(initial||EMPTY_CERT)
  const set=(k,v)=>setForm(p=>({...p,[k]:v}))
  return(
    <form onSubmit={e=>{e.preventDefault();onSave({...form,sort_order:Number(form.sort_order)||0})}} className={styles.projectForm}>
      <div className={styles.formGrid}>
        <div className={styles.formCol}>
          <h3 className={styles.formSection}>Certificate Details</h3>
          <div className={styles.field}><label className="admin-label">Certificate Title *</label><input className="admin-input" value={form.title} onChange={e=>set('title',e.target.value)} placeholder="e.g. AWS Certified Solutions Architect" required/></div>
          <div className={styles.field}><label className="admin-label">Issuing Organisation *</label><input className="admin-input" value={form.issuer} onChange={e=>set('issuer',e.target.value)} placeholder="e.g. Amazon Web Services" required/></div>
          <div className={styles.fieldRow}>
            <div className={styles.field}><label className="admin-label">Issue Date</label><input className="admin-input" type="month" value={form.issued_date} onChange={e=>set('issued_date',e.target.value)}/></div>
            <div className={styles.field}><label className="admin-label">Expiry Date</label><input className="admin-input" type="month" value={form.expiry_date} onChange={e=>set('expiry_date',e.target.value)} placeholder="Leave blank if no expiry"/></div>
            <div className={styles.field}><label className="admin-label">Sort Order</label><input className="admin-input" type="number" value={form.sort_order} onChange={e=>set('sort_order',e.target.value)}/></div>
          </div>
          <div className={styles.field}><label className="admin-label">Credential ID</label><input className="admin-input" value={form.credential_id} onChange={e=>set('credential_id',e.target.value)} placeholder="e.g. ABC-123-XYZ"/></div>
          <div className={styles.field}><label className="admin-label">Verification URL</label><input className="admin-input" type="url" value={form.credential_url} onChange={e=>set('credential_url',e.target.value)} placeholder="https://…"/></div>
          <div className={styles.toggleRow}><Toggle checked={form.published} onChange={v=>set('published',v)} label="Published (visible on site)"/></div>
        </div>
        <div className={styles.formCol}>
          <h3 className={styles.formSection}>Badge / Image</h3>
          <UploadField label="Certificate badge or image" accept="image/*" folder="certifications" value={form.image_url} onChange={v=>set('image_url',v)}/>
          <p className={styles.certImgNote}>Upload a badge, certificate screenshot, or organisation logo. Shown in the Certifications grid on your portfolio.</p>
        </div>
      </div>
      <div className={styles.formActions}>
        <button type="button" className={styles.btnGhost} onClick={onCancel}>Cancel</button>
        <button type="submit" className={styles.btnPrimary} disabled={saving}>{saving?'Saving…':(initial?.id?'Update Certificate':'Add Certificate')}</button>
      </div>
    </form>
  )
}

function CertificationsTab({showToast}){
  const [certs,setCerts]=useState([])
  const [loading,setLoading]=useState(false)
  const [view,setView]=useState('list')
  const [editing,setEditing]=useState(null)
  const [saving,setSaving]=useState(false)
  const reload=()=>{setLoading(true);getAllCerts().then(setCerts).catch(e=>showToast(e.message,'error')).finally(()=>setLoading(false))}
  useEffect(reload,[])
  const handleSave=async payload=>{
    setSaving(true)
    try{editing?.id?await updateCert(editing.id,payload):await createCert(payload);showToast(editing?.id?'Certificate updated!':'Certificate added!');setView('list');setEditing(null);reload()}
    catch(e){showToast(e.message,'error')}finally{setSaving(false)}
  }
  const handleDelete=async c=>{
    try{if(c.image_url?.includes('portfolio-media'))await deleteFile(c.image_url);await deleteCert(c.id);showToast('Deleted');reload()}catch(e){showToast(e.message,'error')}
  }
  const handleToggle=async c=>{try{await updateCert(c.id,{published:!c.published});showToast(c.published?'Unpublished':'Now live');reload()}catch(e){showToast(e.message,'error')}}
  const fmtDate=d=>d?new Date(d+'-01').toLocaleDateString('en-GB',{month:'short',year:'numeric'}):''

  if(view!=='list')return(<div><div className={styles.formHeader}><button className={styles.backBtn} onClick={()=>{setView('list');setEditing(null)}}>← Back</button><h2 className={styles.tabTitle}>{view==='new'?'Add Certificate':`Edit: ${editing?.title}`}</h2></div><CertForm initial={editing} onSave={handleSave} onCancel={()=>{setView('list');setEditing(null)}} saving={saving}/></div>)

  return(<div>
    <div className={styles.listHeader}>
      <div><h2 className={styles.tabTitle}>Certifications</h2><p className={styles.tabSub}>{certs.length} certificate{certs.length!==1?'s':''} · shown in the Certifications section on your portfolio</p></div>
      <button className={styles.btnPrimary} onClick={()=>{setEditing(null);setView('new')}}>+ Add Certificate</button>
    </div>
    {loading?<div className={styles.skeletonList}>{[1,2,3].map(i=><div key={i} className={styles.rowSkeleton}/>)}</div>
    :certs.length===0?<div className={styles.emptyState}><div className={styles.emptyIcon}>🏅</div><h3>No certifications yet</h3><p>Add a professional certificate and it will appear in the Certifications section on your portfolio.</p><button className={styles.btnPrimary} onClick={()=>setView('new')}>Add First Certificate</button></div>
    :<div className={styles.rowList}>{certs.map(c=><ItemRow key={c.id} img={c.image_url} title={c.title} meta={[c.issuer,fmtDate(c.issued_date)].filter(Boolean)} published={c.published} onEdit={()=>{setEditing(c);setView('edit')}} onToggle={()=>handleToggle(c)} onDelete={()=>handleDelete(c)}/>)}</div>}
  </div>)
}

/* ── Main ─────────────────────────────────────────────────────────────────── */

const TABS=[{id:'projects',label:'Projects',icon:'⬡'},{id:'cv',label:'CV & Resume',icon:'📄'},{id:'certs',label:'Certifications',icon:'🏅'}]

export default function AdminPage(){
  const [session,setSession]=useState(null)
  const [authLoading,setAuthLoading]=useState(true)
  const [activeTab,setActiveTab]=useState('projects')
  const [toast,setToast]=useState(null)
  const showToast=(msg,type='success')=>{setToast({msg,type});setTimeout(()=>setToast(null),3500)}

  useEffect(()=>{
    getSession().then(s=>{setSession(s);setAuthLoading(false)})
    const {data:{subscription}}=onAuthChange(s=>setSession(s))
    return()=>subscription.unsubscribe()
  },[])

  if(authLoading)return <div className={styles.loadingScreen}><div className={styles.loadingSpinner}/></div>
  if(!session)return <LoginScreen/>

  return(
    <div className={styles.admin}>
      {toast&&<div className={`${styles.toast} ${toast.type==='error'?styles.toastError:styles.toastSuccess}`}>{toast.msg}</div>}

      <header className={styles.adminHeader}>
        <div className={styles.adminHeaderInner}>
          <div className={styles.adminBrand}>
            <span className={styles.adminLogo}>OKB</span>
            <div><span className={styles.adminTitle}>Portfolio Admin</span><span className={styles.adminEmail}>{session.user?.email}</span></div>
          </div>
          <div className={styles.adminHeaderActions}>
            <a href="/" target="_blank" className={styles.btnGhost}>↗ View Site</a>
            <button className={styles.btnGhost} onClick={()=>signOut()}>Sign Out</button>
          </div>
        </div>
      </header>

      <div className={styles.adminLayout}>
        <aside className={styles.sidebar}>
          <nav className={styles.sideNav}>
            {TABS.map(tab=>(
              <button key={tab.id} className={`${styles.sideNavItem} ${activeTab===tab.id?styles.sideNavItemActive:''}`} onClick={()=>setActiveTab(tab.id)}>
                <span className={styles.sideNavIcon}>{tab.icon}</span>
                <span className={styles.sideNavLabel}>{tab.label}</span>
              </button>
            ))}
          </nav>
          <div className={styles.sideFooter}><p className={styles.sideFooterText}>All changes go live on your portfolio immediately after saving.</p></div>
        </aside>
        <main className={styles.adminMain}>
          {activeTab==='projects'&&<ProjectsTab showToast={showToast}/>}
          {activeTab==='cv'&&<CVTab showToast={showToast}/>}
          {activeTab==='certs'&&<CertificationsTab showToast={showToast}/>}
        </main>
      </div>
    </div>
  )
}
