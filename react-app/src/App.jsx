import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import './App.css'
import Flies from './components/Flies'
import Typewriter from './components/Typewriter'
import FloatingGallery from './components/FloatingGallery'
import Lightbox from './components/Lightbox'
import HoverTrail from './components/HoverTrail'

const base = import.meta.env.BASE_URL

function AudioPlayer() {
  const audioRef = useRef(null)
  const [src, setSrc] = useState('')
  useEffect(() => {
    const savedSrc = localStorage.getItem('audioSrc') || ''
    const savedTime = parseFloat(localStorage.getItem('audioTime') || '0')
    const savedPlaying = localStorage.getItem('audioPlaying') === 'true'
    if (savedSrc) {
      setSrc(savedSrc)
      const audio = audioRef.current
      audio.src = savedSrc
      const onLoaded = () => {
        if (!isNaN(savedTime)) audio.currentTime = savedTime
        if (savedPlaying) audio.play().catch(() => {})
      }
      audio.addEventListener('loadedmetadata', onLoaded, { once: true })
    }
  }, [])
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => { localStorage.setItem('audioTime', String(audio.currentTime)) }
    const onPlay = () => { localStorage.setItem('audioSrc', audio.src); localStorage.setItem('audioPlaying', 'true') }
    const onPause = () => { localStorage.setItem('audioPlaying', 'false') }
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [])
  return <audio id="audio-player" ref={audioRef} preload="metadata" controls style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000, width: 250, height: 30 }} />
}

function LayoutShell({ children }) {
  const location = useLocation()
  const isHome = location.pathname === '/'
  useEffect(() => {
    if (isHome) document.body.classList.add('home')
    else document.body.classList.remove('home')
  }, [isHome])
  useEffect(() => { window.scrollTo(0, 0) }, [location.pathname])
  return (
    <div className="container cursive-glow">
      <HoverTrail />
      {children}
      <AudioPlayer />
      <Lightbox />
      <Flies enabled={isHome} activateOnClick={false} />
    </div>
  )
}

function Checklist() {
  const location = useLocation()
  const path = location.pathname
  const items = [
    { id: 'item1', to: '/page1', label: "Je m'appelle Aurore Delune" },
    { id: 'item2', to: '/page2', label: "Topographie de l'étrange" },
    { id: 'item3', to: '/page3', label: 'Reliques du rêve' },
    { id: 'item4', to: '/page4', label: 'Mémoires du Mont Songe' },
  ]
  return (
    <div className="checklist">
      <ul>
        {items.map((it) => (
          <li key={it.id}>
            <input type="checkbox" id={it.id} defaultChecked={path === it.to} />
            <label htmlFor={it.id}><Link to={it.to}>{it.label}</Link></label>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const sfxRef = useRef(null)
  const homeImgRef = useRef(null)
  const sfxFiles = useRef([`${base}audio/1.m4a`, `${base}audio/2.m4a`, `${base}audio/3.m4a`])
  const sfxIndex = useRef(0)
  function playNextSfx() {
    const audio = sfxRef.current
    if (!audio) return
    const files = sfxFiles.current
    const idx = sfxIndex.current % files.length
    audio.src = files[idx]
    sfxIndex.current += 1
    audio.loop = false
    try { audio.pause(); audio.currentTime = 0; audio.load(); audio.play().catch(() => {}) } catch {}
  }
  useEffect(() => {
    const sfx = sfxRef.current
    if (!sfx) return
    const onEnded = () => { if (sfxIndex.current % sfxFiles.current.length !== 0) playNextSfx() }
    sfx.addEventListener('ended', onEnded)
    return () => sfx.removeEventListener('ended', onEnded)
  }, [])
  const onLogoClick = (e) => {
    const img = homeImgRef.current
    if (img) { img.classList.add('glow'); setTimeout(() => img.classList.remove('glow'), 400) }
    if (!isHome) { navigate('/'); return }
    e.preventDefault(); playNextSfx()
  }
  return (
    <>
      <button className="home-logo" onClick={onLogoClick} style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
        <img ref={homeImgRef} src={`${base}images/orchidd.jpg`} alt="Home" />
      </button>
      <div className="main-content">{children}</div>
      <audio ref={sfxRef} style={{ display: 'none' }} />
    </>
  )
}

function SongSelect() {
  const options = [
    { value: '', label: 'chansons' },
    { value: `${base}audio/song1.wav`, label: 'Stray' },
    { value: `${base}audio/song2.wav`, label: 'deep Forest' },
  ]
  const onChange = (e) => {
    const selected = e.target.value
    const audio = document.getElementById('audio-player')
    if (selected && audio) { try { audio.pause(); audio.src = selected; audio.load(); audio.play().catch(() => {}) } catch {} }
  }
  return (
    <div className="simple-dropdown">
      <select id="tech-select" onChange={onChange}>
        {options.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
      </select>
    </div>
  )
}

function Home() { return (<Layout><Checklist /><SongSelect /></Layout>) }
function Page1() {
  return (
    <Layout>
      <div className="content-box">
        <h1>Je m'appelle Aurore Delune</h1>
        <h2>Comment vous appelez-vous ?</h2>
      </div>
      <Checklist />
      <SongSelect />
    </Layout>
  )
}
function Page2() { return (<Layout><div className="content-box"><h1>Topographie de l'étrange</h1><div className="type-container"><Typewriter text="Du sacré dans le profane, de la beauté dans la décrépitude" /></div></div><FloatingGallery /><Checklist /><SongSelect /></Layout>) }
function Page3() { return (<Layout><div className="content-box"><h1>Reliques du rêve</h1><div className="type-container"><Typewriter text="A la lisière du rêve et du mythe, de l'humain et de l'autre" /></div></div><Checklist /><SongSelect /></Layout>) }
function Page4() { return (<Layout><div className="content-box"><h1>Mémoires du Mont Songe</h1></div><Checklist /><SongSelect /></Layout>) }

export default function App() {
  return (
    <LayoutShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/page1" element={<Page1 />} />
        <Route path="/page2" element={<Page2 />} />
        <Route path="/page3" element={<Page3 />} />
        <Route path="/page4" element={<Page4 />} />
      </Routes>
    </LayoutShell>
  )
}
