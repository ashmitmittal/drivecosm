import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Inspector from '../components/Inspector'
import {
  IconChevronRight,
  IconDownload,
  IconExternal,
  IconFile,
  IconFolderFill,
  IconGrid,
  IconRefresh,
  IconRows,
  IconSearch,
  IconTrash,
  IconUpload,
} from '../components/Icons'
import { Toasts, useToasts } from '../components/Toast'
import { useAccounts } from '../lib/AccountsContext'
import { api } from '../lib/api'
import { accountColor, formatBytes, formatDate } from '../lib/format'
import type { ApiResult, DriveFile } from '../types'

type ViewMode = 'grid' | 'list'

/** One step of the folder path being browsed. Folders belong to one account. */
interface Crumb {
  id: string
  name: string
  accountId: string
}

const fileKey = (f: DriveFile) => `${f.accountId}-${f.id}`
const isFolder = (f: DriveFile) => f.mimeType === 'application/vnd.google-apps.folder'
const isGoogleDoc = (mimeType: string) => mimeType.startsWith('application/vnd.google-apps')

export default function Files() {
  const { accounts } = useAccounts()
  const [files, setFiles] = useState<DriveFile[] | null>(null)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [accountFilter, setAccountFilter] = useState('')
  const [crumbs, setCrumbs] = useState<Crumb[]>([])
  const [view, setView] = useState<ViewMode>('grid')
  const [selected, setSelected] = useState<DriveFile | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [unreachable, setUnreachable] = useState<string[]>([])
  const [reloadTick, setReloadTick] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toasts, push } = useToasts()
  const [searchParams] = useSearchParams()
  const paramAccount = searchParams.get('account') || ''

  const searching = debouncedQuery.length > 0
  const currentFolder = crumbs[crumbs.length - 1]

  // Landing here (or clicking a drive in the sidebar) starts at that drive's root.
  useEffect(() => {
    setAccountFilter(paramAccount)
    setCrumbs([])
    setQuery('')
  }, [paramAccount])

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300)
    return () => clearTimeout(t)
  }, [query])

  // One loader for every navigation change; the cleanup flag drops responses
  // that were superseded while in flight.
  useEffect(() => {
    let current = true
    async function load() {
      const params = new URLSearchParams()
      if (debouncedQuery) {
        params.set('q', debouncedQuery)
        if (accountFilter) params.set('accountId', accountFilter)
      } else if (currentFolder) {
        params.set('parent', currentFolder.id)
        params.set('accountId', currentFolder.accountId)
      } else if (accountFilter) {
        params.set('accountId', accountFilter)
      }
      const data = await api.get<{ files?: DriveFile[]; errors?: { accountEmail: string }[]; error?: string }>(
        `/api/files?${params}`
      )
      if (!current) return
      if (data.error) push(data.error, 'err')
      setFiles(data.files || [])
      setUnreachable((data.errors || []).map((e) => e.accountEmail))
      setSelected(null)
    }
    load()
    return () => {
      current = false
    }
  }, [debouncedQuery, accountFilter, currentFolder, reloadTick, push])

  const reload = () => setReloadTick((t) => t + 1)

  function openFolder(f: DriveFile) {
    setQuery('')
    setDebouncedQuery('')
    setCrumbs((c) => [...c, { id: f.id, name: f.name, accountId: f.accountId }])
  }

  function open(f: DriveFile) {
    if (isFolder(f)) openFolder(f)
    else if (f.webViewLink) window.open(f.webViewLink, '_blank', 'noopener')
  }

  function onFilter(value: string) {
    setAccountFilter(value)
    setCrumbs([])
  }

  async function uploadFiles(fileList: File[]) {
    setUploading(true)
    for (const file of fileList) {
      push(`Uploading ${file.name}…`)
      const form = new FormData()
      form.append('file', file)
      const data = await api.postForm<ApiResult & { accountEmail?: string }>('/api/upload', form)
      if (data.ok) push(`${file.name} → ${data.accountEmail}`)
      else push(data.error || `Upload of ${file.name} failed.`, 'err')
    }
    setUploading(false)
    reload()
  }

  async function trash(file: DriveFile) {
    const kind = isFolder(file) ? 'folder' : 'file'
    if (!confirm(`Move this ${kind} to the trash of ${file.accountEmail}?\n\nIt stays recoverable in Drive's trash for 30 days.`)) return
    const data = await api.post<ApiResult>('/api/files/trash', { accountId: file.accountId, fileId: file.id })
    if (data.ok) {
      push(`Moved "${file.name}" to trash`)
      setFiles((f) => (f ? f.filter((x) => fileKey(x) !== fileKey(file)) : f))
      setSelected((s) => (s && fileKey(s) === fileKey(file) ? null : s))
    } else {
      push(data.error || 'Could not move it to trash.', 'err')
    }
  }

  const accountIndex = (accountId: string) => (accounts || []).findIndex((a) => a.id === accountId)
  const colorFor = (accountId: string) => accountColor(accountIndex(accountId))
  const isSelected = (f: DriveFile) => selected !== null && fileKey(selected) === fileKey(f)
  const rootLabel = accountFilter
    ? (accounts || []).find((a) => a.id === accountFilter)?.email || 'Drive'
    : 'All drives'

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        if (e.dataTransfer.files?.length) uploadFiles([...e.dataTransfer.files])
      }}
    >
      <div className="page-head">
        <div>
          <h1 className="page-title">Files</h1>
          <p className="page-sub">Browse every drive as one — or drop a file anywhere to upload</p>
        </div>
        <button className="btn btn-primary" onClick={() => inputRef.current?.click()} disabled={uploading}>
          <IconUpload size={16} /> {uploading ? 'Uploading…' : 'Upload'}
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files?.length) uploadFiles([...e.target.files])
            e.target.value = ''
          }}
        />
      </div>

      <div className="toolbar">
        <div className="search-wrap">
          <IconSearch />
          <input
            className="input"
            placeholder="Search across all drives…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select className="input" value={accountFilter} onChange={(e) => onFilter(e.target.value)}>
          <option value="">All drives</option>
          {(accounts || []).map((a) => (
            <option key={a.id} value={a.id}>
              {a.email}
            </option>
          ))}
        </select>
        <div className="view-toggle" role="group" aria-label="View mode">
          <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')} title="Grid view">
            <IconGrid />
          </button>
          <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')} title="List view">
            <IconRows />
          </button>
        </div>
        <button className="btn btn-icon" title="Refresh" onClick={reload}>
          <IconRefresh />
        </button>
      </div>

      {unreachable.length > 0 && (
        <div className="notice">
          Couldn&apos;t reach {unreachable.join(', ')} — files stored there are missing from this list.
        </div>
      )}

      <div className="files-layout">
        <div className={`panel files-main${dragging ? ' dropzone-active' : ''}`}>
          <div className="panel-head">
            <nav className="crumbs" aria-label="Folder path">
              {searching ? (
                <span className="crumb-current">Search results for “{debouncedQuery}”</span>
              ) : (
                <>
                  <button className="crumb" onClick={() => setCrumbs([])} disabled={crumbs.length === 0}>
                    {rootLabel}
                  </button>
                  {crumbs.map((c, i) => (
                    <span key={c.id} className="crumb-step">
                      <IconChevronRight />
                      {i === crumbs.length - 1 ? (
                        <span className="crumb-current">{c.name}</span>
                      ) : (
                        <button className="crumb" onClick={() => setCrumbs(crumbs.slice(0, i + 1))}>
                          {c.name}
                        </button>
                      )}
                    </span>
                  ))}
                </>
              )}
            </nav>
            {files !== null && (
              <span className="panel-count">
                {files.length} item{files.length === 1 ? '' : 's'}
              </span>
            )}
          </div>

          {files === null ? (
            <div className="file-grid panel-body">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="skeleton" style={{ height: 150 }} />
              ))}
            </div>
          ) : files.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">
                <IconFile size={26} />
              </div>
              <h3>{searching ? 'No files match your search' : 'Nothing here yet'}</h3>
              <p>
                {(accounts || []).length === 0 ? (
                  <>
                    Add a drive on the <Link to="/" style={{ color: 'var(--accent)' }}>dashboard</Link> first.
                  </>
                ) : (
                  'Upload something — DriveCosm automatically sends it to the drive with the most free space.'
                )}
              </p>
            </div>
          ) : view === 'grid' ? (
            <div className="file-grid panel-body">
              {files.map((f) => (
                <button
                  key={fileKey(f)}
                  className={`file-card${isSelected(f) ? ' selected' : ''}`}
                  onClick={() => setSelected(f)}
                  onDoubleClick={() => open(f)}
                >
                  <span className={`file-thumb${isFolder(f) ? ' is-folder' : ''}`}>
                    {isFolder(f) ? (
                      <IconFolderFill size={44} />
                    ) : (
                      <>
                        <IconFile mimeType={f.mimeType} size={26} />
                        {f.thumbnailLink && (
                          <img
                            src={f.thumbnailLink}
                            alt=""
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                        )}
                      </>
                    )}
                  </span>
                  <span className="file-card-name" title={f.name}>
                    {f.name}
                  </span>
                  <span className="file-card-meta">
                    <span className="badge-dot" style={{ background: colorFor(f.accountId) }} />
                    {isFolder(f) ? 'Folder' : f.size ? formatBytes(f.size) : '—'}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Drive</th>
                    <th>Size</th>
                    <th>Modified</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {files.map((f) => (
                    <tr
                      key={fileKey(f)}
                      className={isSelected(f) ? 'selected' : ''}
                      onClick={() => setSelected(f)}
                      onDoubleClick={() => open(f)}
                    >
                      <td>
                        <div className="file-name">
                          <span className={`file-icon${isFolder(f) ? ' is-folder' : ''}`}>
                            <IconFile mimeType={f.mimeType} />
                          </span>
                          <span title={f.name}>{f.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge" title={f.accountEmail}>
                          <span className="badge-dot" style={{ background: colorFor(f.accountId) }} />
                          <span>{f.accountEmail}</span>
                        </span>
                      </td>
                      <td className="muted">{isFolder(f) ? '—' : f.size ? formatBytes(f.size) : '—'}</td>
                      <td className="muted">{formatDate(f.modifiedTime)}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="row-actions">
                          {f.webViewLink && (
                            <a className="btn btn-ghost btn-icon" href={f.webViewLink} target="_blank" rel="noreferrer" title="Open in Drive">
                              <IconExternal />
                            </a>
                          )}
                          {!isGoogleDoc(f.mimeType) && (
                            <a
                              className="btn btn-ghost btn-icon"
                              href={`/api/files/download?${new URLSearchParams({ accountId: f.accountId, id: f.id })}`}
                              title="Download"
                            >
                              <IconDownload />
                            </a>
                          )}
                          <button className="btn btn-ghost btn-icon btn-danger" onClick={() => trash(f)} title="Move to trash">
                            <IconTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selected && (
          <Inspector
            file={selected}
            accountIndex={accountIndex(selected.accountId)}
            onClose={() => setSelected(null)}
            onTrash={trash}
          />
        )}
      </div>

      <Toasts toasts={toasts} />
    </div>
  )
}
