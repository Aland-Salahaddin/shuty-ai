export default function Background() {
  return (
    <>
      {/* Grid texture */}
      <div className="fixed inset-0 z-0 pointer-events-none texture-grid texture-grid-fade opacity-60" />

      {/* Aurora blobs */}
      <div className="fixed top-[-100px] left-[-100px] z-0 pointer-events-none aurora aurora-1" />
      <div className="fixed bottom-[-150px] right-[-150px] z-0 pointer-events-none aurora aurora-2" />

      {/* Scanlines */}
      <div className="fixed inset-0 z-0 pointer-events-none texture-scanlines" />

      {/* Grain — top-most */}
      <div className="fixed inset-0 pointer-events-none texture-grain" style={{ zIndex: 100 }} />
    </>
  )
}
