import { Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import Flies from './components/Flies'
import Typewriter from './components/Typewriter'
import FloatingGallery from './components/FloatingGallery'

const base = import.meta.env.BASE_URL

function Layout({ children }) {
  const location = useLocation()
  const isHome = location.pathname === '/'
  return (
    <div className="container cursive-glow">
      {children}
      {isHome && <Flies enabled activateOnClick={false} />}
    </div>
  )
}

function Checklist() {
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
          <li key={it.id}><label><Link to={it.to}>{it.label}</Link></label></li>
        ))}
      </ul>
    </div>
  )
}

function Home() { return (<Layout><Checklist /></Layout>) }
function Page1() { return (<Layout><div className="content-box"><h1>Je m'appelle Aurore Delune</h1></div><Checklist /></Layout>) }
function Page2() { return (<Layout><div className="content-box"><h1>Topographie de l'étrange</h1><div className="type-container"><Typewriter text="Du sacré dans le profane, de la beauté dans la décrépitude" /></div></div><FloatingGallery /></Layout>) }
function Page3() { return (<Layout><div className="content-box"><h1>Reliques du rêve</h1></div></Layout>) }
function Page4() { return (<Layout><div className="content-box"><h1>Mémoires du Mont Songe</h1></div></Layout>) }

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/page1" element={<Page1 />} />
      <Route path="/page2" element={<Page2 />} />
      <Route path="/page3" element={<Page3 />} />
      <Route path="/page4" element={<Page4 />} />
    </Routes>
  )
}
