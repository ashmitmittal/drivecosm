import { accountColor, formatBytes, formatDate } from '../lib/format'
import type { DriveFile } from '../types'
import { IconClose, IconDownload, IconExternal, IconFile, IconTrash, fileKind } from './Icons'

interface Props {
  file: DriveFile
  accountIndex: number
  onClose: () => void
  onTrash: (file: DriveFile) => void
}

const KIND_LABELS: Record<ReturnType<typeof fileKind>, string> = {
  folder: 'Folder',
  image: 'Image',
  video: 'Video',
  audio: 'Audio',
  pdf: 'PDF document',
  archive: 'Archive',
  doc: 'Document',
  sheet: 'Spreadsheet',
  slides: 'Presentation',
  generic: 'File',
}

export default function Inspector({ file, accountIndex, onClose, onTrash }: Props) {
  const isGoogleDoc = file.mimeType.startsWith('application/vnd.google-apps')

  return (
    <aside className="inspector" aria-label="File details">
      <div className="inspector-head">
        <span className="inspector-title">Info</span>
        <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close details">
          <IconClose />
        </button>
      </div>

      <div className="inspector-thumb">
        {file.thumbnailLink && (
          <img
            src={file.thumbnailLink}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        )}
        <IconFile mimeType={file.mimeType} size={34} />
      </div>

      <div className="inspector-name" title={file.name}>
        {file.name}
      </div>

      <dl className="inspector-meta">
        <dt>Kind</dt>
        <dd>{KIND_LABELS[fileKind(file.mimeType)]}</dd>
        <dt>Size</dt>
        <dd>{file.size ? formatBytes(file.size) : '—'}</dd>
        <dt>Modified</dt>
        <dd>{formatDate(file.modifiedTime)}</dd>
        <dt>Drive</dt>
        <dd className="inspector-account" title={file.accountEmail}>
          <span className="badge-dot" style={{ background: accountColor(accountIndex) }} />
          {file.accountEmail}
        </dd>
      </dl>

      <div className="inspector-actions">
        {file.webViewLink && (
          <a className="btn btn-primary" href={file.webViewLink} target="_blank" rel="noreferrer">
            <IconExternal /> Open in Drive
          </a>
        )}
        {!isGoogleDoc && (
          <a
            className="btn"
            href={`/api/files/download?${new URLSearchParams({ accountId: file.accountId, id: file.id })}`}
          >
            <IconDownload /> Download
          </a>
        )}
        <button className="btn btn-danger" onClick={() => onTrash(file)}>
          <IconTrash /> Move to trash
        </button>
      </div>
    </aside>
  )
}
