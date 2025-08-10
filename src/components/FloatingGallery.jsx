import { useEffect, useRef } from 'react'

export default function FloatingGallery() {
  const galleryRef = useRef(null)
  const animRef = useRef({ draggingFigure: null, offsetX: 0, offsetY: 0, currentX: 0, currentY: 0, targetX: 0, targetY: 0, frame: 0, zTop: 10 })

  useEffect(() => {
    const gallery = galleryRef.current
    if (!gallery) return

    function startDrag(e) {
      const state = animRef.current
      const isTouch = e.type.startsWith('touch')
      const pointer = isTouch ? e.touches[0] : e
      const fig = document.elementFromPoint(pointer.clientX, pointer.clientY)?.closest('figure')
      if (!fig || !gallery.contains(fig)) return
      state.draggingFigure = fig
      const rect = fig.getBoundingClientRect()
      const galleryRect = gallery.getBoundingClientRect()
      state.offsetX = pointer.clientX - rect.left
      state.offsetY = pointer.clientY - rect.top
      fig.style.cursor = 'grabbing'
      fig.style.zIndex = String(++state.zTop)
      state.targetX = rect.left - galleryRect.left
      state.targetY = rect.top - galleryRect.top
      state.currentX = state.targetX
      state.currentY = state.targetY

      if (isTouch) {
        document.addEventListener('touchmove', onDrag, { passive: false })
        document.addEventListener('touchend', endDrag)
      } else {
        document.addEventListener('mousemove', onDrag)
        document.addEventListener('mouseup', endDrag)
      }
      animate()
    }

    function onDrag(e) {
      const state = animRef.current
      if (!state.draggingFigure) return
      const isTouch = e.type.startsWith('touch')
      const pointer = isTouch ? e.touches[0] : e
      const galleryRect = gallery.getBoundingClientRect()
      
      // Allow images to go beyond container boundaries
      let newX = pointer.clientX - galleryRect.left - state.offsetX
      let newY = pointer.clientY - galleryRect.top - state.offsetY
      
      // Allow negative values to go beyond left and top edges
      // Only limit extreme values to prevent images from going too far off-screen
      newX = Math.max(-200, Math.min(newX, window.innerWidth - 50))
      newY = Math.max(-200, Math.min(newY, window.innerHeight - 50))
      
      state.targetX = newX
      state.targetY = newY
      if (isTouch) e.preventDefault()
    }

    function animate() {
      const state = animRef.current
      if (!state.draggingFigure) return
      state.currentX += (state.targetX - state.currentX) * 0.35
      state.currentY += (state.targetY - state.currentY) * 0.35
      state.draggingFigure.style.left = `${state.currentX}px`
      state.draggingFigure.style.top = `${state.currentY}px`
      state.frame = requestAnimationFrame(animate)
    }

    function endDrag() {
      const state = animRef.current
      if (state.draggingFigure) {
        state.draggingFigure.style.cursor = 'grab'
        state.draggingFigure = null
      }
      cancelAnimationFrame(state.frame)
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', endDrag)
      document.removeEventListener('touchmove', onDrag)
      document.removeEventListener('touchend', endDrag)
    }

    gallery.addEventListener('mousedown', startDrag)
    gallery.addEventListener('touchstart', startDrag, { passive: false })
    return () => {
      gallery.removeEventListener('mousedown', startDrag)
      gallery.removeEventListener('touchstart', startDrag)
    }
  }, [])

  const figStyle = { position: 'absolute', width: 250, margin: 0, cursor: 'grab', userSelect: 'none' }
  const bigStyle = { ...figStyle, width: 350 }
  const imgStyle = { width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' }
  const capStyle = { color: '#fff', textShadow: '0 1px 2px #000', background: 'rgba(0,0,0,0.35)', padding: '4px 6px', borderRadius: 4, fontSize: '1.1rem' }
  const capStyleBig = { ...capStyle, fontSize: '1.3rem', fontWeight: 'bold' }

  return (
    <div
      className="floating-gallery"
      id="floating-gallery"
      ref={galleryRef}
      style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'visible', cursor: 'grab', margin: '0 auto', padding: 0 }}
    >
      <figure style={{ ...figStyle, top: '10%', left: '20%' }}>
        <img src="/images/610c1761-8c76-4285-99ae-10ce1a644614.jpg" alt="" draggable={false} style={imgStyle} />
        <figcaption style={capStyle}>But the trees spread darkness for a wandering beam of sun</figcaption>
      </figure>
      <figure className="big-figure" style={{ ...bigStyle, top: '50%', left: '60%' }}>
        <img src="/images/38340221-c73f-4f8a-a87a-3a18bcc629a6.jpg" alt="" draggable={false} style={imgStyle} />
        <figcaption style={capStyleBig}>The Sick Garden</figcaption>
      </figure>
      <figure style={{ ...figStyle, top: '30%', left: '10%' }}>
        <img src="/images/frog.jpeg" alt="" draggable={false} style={imgStyle} />
        <figcaption style={capStyle}>In memoriam</figcaption>
      </figure>
      <figure style={{ ...figStyle, top: '70%', left: '40%' }}>
        <img src="/images/P1082183.JPG" alt="" draggable={false} style={imgStyle} />
        <figcaption style={capStyle}>Sacrifice</figcaption>
      </figure>
    </div>
  )
} 