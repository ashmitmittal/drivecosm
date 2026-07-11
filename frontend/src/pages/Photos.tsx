import { IconSparkles } from '../components/Icons'

// Reserved space for v2: one searchable photo library across every drive.
export default function Photos() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Photos</h1>
          <p className="page-sub">Coming in v2</p>
        </div>
      </div>
      <div className="empty empty-tall">
        <div className="empty-icon">
          <IconSparkles size={28} />
        </div>
        <h3>One photo library, every drive</h3>
        <p>
          All your photos from every connected drive in a single searchable timeline — including
          face recognition and natural-language search (&ldquo;photos of A and B at the beach&rdquo;),
          powered by AI that runs entirely on your machine.
        </p>
      </div>
    </>
  )
}
