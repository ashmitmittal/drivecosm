import type { ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

// Hand-rolled stroke icons — no icon library needed.
function Svg({ size = 18, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  )
}

export const IconLogo = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M18.9 8.5c2.1 1.1 3.4 2.4 3.1 3.5-.5 1.9-5.3 2.4-10.7 1S1.6 9.1 2.1 7.2c.3-1.1 2.1-1.6 4.5-1.5" />
  </Svg>
)

export const IconSun = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Svg>
)

export const IconMoon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </Svg>
)

export const IconPlus = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)

export const IconSearch = (p: IconProps) => (
  <Svg size={16} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </Svg>
)

export const IconUpload = (p: IconProps) => (
  <Svg {...p}>
    <path d="M21 15v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3M7 9l5-5 5 5M12 4v12" />
  </Svg>
)

export const IconDownload = (p: IconProps) => (
  <Svg size={16} {...p}>
    <path d="M21 15v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3M7 10l5 5 5-5M12 15V3" />
  </Svg>
)

export const IconTrash = (p: IconProps) => (
  <Svg size={16} {...p}>
    <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-.8 13.2a2 2 0 0 1-2 1.8H7.8a2 2 0 0 1-2-1.8L5 6" />
  </Svg>
)

export const IconExternal = (p: IconProps) => (
  <Svg size={16} {...p}>
    <path d="M14 4h6v6M20 4l-9 9M20 14v5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19V6a1.5 1.5 0 0 1 1.5-1.5H10" />
  </Svg>
)

export const IconRefresh = (p: IconProps) => (
  <Svg size={16} {...p}>
    <path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6" />
  </Svg>
)

export const IconCopy = (p: IconProps) => (
  <Svg size={15} {...p}>
    <rect x="9" y="9" width="12" height="12" rx="2.5" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </Svg>
)

export const IconCheck = (p: IconProps) => (
  <Svg size={15} {...p}>
    <path d="m4 12.5 5.5 5.5L20 6.5" />
  </Svg>
)

export const IconCloud = (p: IconProps) => (
  <Svg {...p}>
    <path d="M17.5 19a4.5 4.5 0 0 0 .4-8.99A7 7 0 0 0 4.3 12.1 4 4 0 0 0 6 19.9h11.5z" />
  </Svg>
)

export const IconLink = (p: IconProps) => (
  <Svg size={16} {...p}>
    <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
  </Svg>
)

export const IconHome = (p: IconProps) => (
  <Svg size={16} {...p}>
    <path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19z" />
    <path d="M9.5 20.5v-6h5v6" />
  </Svg>
)

export const IconFolders = (p: IconProps) => (
  <Svg size={16} {...p}>
    <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4L10.5 8.5h8A1.5 1.5 0 0 1 20 10v8a1.5 1.5 0 0 1-1.5 1.5h-14A1.5 1.5 0 0 1 3 18z" />
  </Svg>
)

export const IconPhotos = (p: IconProps) => (
  <Svg size={16} {...p}>
    <rect x="3" y="7" width="14" height="14" rx="3" />
    <path d="M7.5 7V6a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v7.5a3 3 0 0 1-3 3h-1" />
    <circle cx="7.5" cy="11.5" r="1.4" />
    <path d="m17 20-4.3-4.3a1.5 1.5 0 0 0-2.1 0L6 20" />
  </Svg>
)

export const IconGear = (p: IconProps) => (
  <Svg size={16} {...p}>
    <circle cx="12" cy="12" r="3.1" />
    <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" />
  </Svg>
)

export const IconGrid = (p: IconProps) => (
  <Svg size={15} {...p}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="1.8" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.8" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.8" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.8" />
  </Svg>
)

export const IconRows = (p: IconProps) => (
  <Svg size={15} {...p}>
    <path d="M4 6.5h16M4 12h16M4 17.5h16" />
  </Svg>
)

export const IconClose = (p: IconProps) => (
  <Svg size={15} {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Svg>
)

export const IconChevronRight = (p: IconProps) => (
  <Svg size={13} {...p}>
    <path d="m9 5 7 7-7 7" />
  </Svg>
)

// Filled folder for the explorer views — reads instantly at any size.
export const IconFolderFill = ({ size = 18, ...p }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" {...p}>
    <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.3c.66 0 1.3.26 1.77.73L12.2 7.4h6.3A2.5 2.5 0 0 1 21 9.9v7.6a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z" />
  </svg>
)

export const IconSparkles = (p: IconProps) => (
  <Svg {...p}>
    <path d="m12 4 1.7 4.3L18 10l-4.3 1.7L12 16l-1.7-4.3L6 10l4.3-1.7z" />
    <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8zM5 3l.7 1.8 1.8.7-1.8.7L5 8l-.7-1.8L2.5 5.5l1.8-.7z" />
  </Svg>
)

// Simplified provider marks in the same stroke style as everything else —
// deliberately not the providers' trademarked logos.
const providerGlyphs: Record<string, ReactNode> = {
  // Filled rounded triangle — evokes Drive without copying the trademark.
  google: <path d="M12 4.6 20.4 19H3.6z" fill="currentColor" strokeWidth={2.6} />,
  telegram: <path d="M21 4.5 3.5 11.3l5 1.9L10 19l3-3.3 4.5 3.3zM8.5 13.2 17 7.5" />,
  onedrive: <path d="M17.5 18.5a4 4 0 0 0 .4-8A6.2 6.2 0 0 0 6 9.3a4.4 4.4 0 0 0 .5 9.2z" />,
  dropbox: <path d="M12 6.5 7 3 2 6.5 7 10zM22 6.5 17 3l-5 3.5L17 10zM2 13.5 7 10l5 3.5L7 17zM22 13.5 17 10l-5 3.5 5 3.5zM7 18.4l5 3.1 5-3.1" />,
  webdav: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a13.5 13.5 0 0 1 0 18M12 3a13.5 13.5 0 0 0 0 18" /></>,
  s3: <><path d="M5 5c0-1.4 3.1-2.5 7-2.5S19 3.6 19 5l-1.6 14.2c0 1.3-2.4 2.3-5.4 2.3s-5.4-1-5.4-2.3z" /><path d="M5 5c0 1.4 3.1 2.5 7 2.5S19 6.4 19 5" /></>,
}

export const ProviderGlyph = ({ provider, ...p }: IconProps & { provider: string }) => (
  <Svg size={16} {...p}>{providerGlyphs[provider] ?? providerGlyphs.google}</Svg>
)

type FileKind = 'folder' | 'image' | 'video' | 'audio' | 'pdf' | 'archive' | 'doc' | 'sheet' | 'slides' | 'generic'

const fileIconPaths: Record<FileKind, ReactNode> = {
  folder: <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.3c.66 0 1.3.26 1.77.73L12.2 7.4h6.3A2.5 2.5 0 0 1 21 9.9v7.6a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z" />,
  image: <><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="9" cy="9" r="1.6" /><path d="m21 15.5-4.2-4.2a1.5 1.5 0 0 0-2.1 0L6 20" /></>,
  video: <><rect x="2" y="5" width="14" height="14" rx="3" /><path d="m16 10 5-3v10l-5-3" /></>,
  audio: <><path d="M9 18V6l11-2v12" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="17.5" cy="16" r="2.5" /></>,
  pdf: <><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" /><path d="M14 2v5h5M9 13h6M9 17h4" /></>,
  archive: <><rect x="3" y="4" width="18" height="16" rx="2.5" /><path d="M12 4v16M12 8h3M12 12h3M12 16h3" /></>,
  doc: <><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" /><path d="M14 2v5h5M9 12h6M9 16h6" /></>,
  sheet: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M3 9h18M3 15h18M9 3v18" /></>,
  slides: <><rect x="3" y="4" width="18" height="13" rx="2.5" /><path d="M12 17v4M8 21h8" /></>,
  generic: <><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" /><path d="M14 2v5h5" /></>,
}

export function fileKind(mimeType = ''): FileKind {
  if (mimeType === 'application/vnd.google-apps.folder') return 'folder'
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType === 'application/pdf') return 'pdf'
  if (/zip|rar|7z|tar|gzip|compressed/.test(mimeType)) return 'archive'
  if (mimeType === 'application/vnd.google-apps.document' || /word|text\//.test(mimeType)) return 'doc'
  if (mimeType === 'application/vnd.google-apps.spreadsheet' || /sheet|excel|csv/.test(mimeType)) return 'sheet'
  if (mimeType === 'application/vnd.google-apps.presentation' || /presentation|powerpoint/.test(mimeType)) return 'slides'
  return 'generic'
}

export const IconFile = ({ mimeType, ...p }: IconProps & { mimeType?: string }) => (
  <Svg size={16} {...p}>{fileIconPaths[fileKind(mimeType)]}</Svg>
)
