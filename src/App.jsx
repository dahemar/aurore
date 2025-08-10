import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
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
  const [isPlaying, setIsPlaying] = useState(false)

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
    const onPlay = () => { localStorage.setItem('audioSrc', audio.src); localStorage.setItem('audioPlaying', 'true'); setIsPlaying(true) }
    const onPause = () => { localStorage.setItem('audioPlaying', 'false'); setIsPlaying(false) }
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [])

  return (
    <audio id="audio-player" ref={audioRef} preload="metadata" controls style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000, width: 250, height: 30 }} />
  )
}

function LayoutShell({ children }) {
  const location = useLocation()
  const isHome = location.pathname === '/'
  
  useEffect(() => {
    // Keep body.home in sync for mobile-specific styles
    if (isHome) document.body.classList.add('home')
    else document.body.classList.remove('home')
  }, [isHome])
  
  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo(0, 0)
  }, [location.pathname])
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
        {items.map((it) => {
          const isActive = path === it.to
          return (
            <li key={it.id}>
              <input type="checkbox" id={it.id} defaultChecked={isActive} />
              <label htmlFor={it.id}>
                <Link to={it.to}>{it.label}</Link>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  const sfxRef = useRef(null)
  const base = import.meta.env.BASE_URL
  const sfxFiles = useRef([`${base}audio/1.m4a`, `${base}audio/2.m4a`, `${base}audio/3.m4a`])
  const sfxIndex = useRef(0)
  const homeImgRef = useRef(null)

  function playNextSfx() {
    const audio = sfxRef.current
    if (!audio) return
    const files = sfxFiles.current
    const idx = sfxIndex.current % files.length
    audio.src = files[idx]
    sfxIndex.current += 1
    audio.loop = false
    try {
      audio.pause()
      audio.currentTime = 0
      audio.load()
      audio.play().catch(() => {})
    } catch {}
  }

  useEffect(() => {
    const sfx = sfxRef.current
    if (!sfx) return
    const onEnded = () => {
      if (sfxIndex.current % sfxFiles.current.length !== 0) {
        playNextSfx()
      }
    }
    sfx.addEventListener('ended', onEnded)
    return () => sfx.removeEventListener('ended', onEnded)
  }, [])

  const onLogoClick = (e) => {
    const img = homeImgRef.current
    if (img) {
      img.classList.add('glow')
      setTimeout(() => img.classList.remove('glow'), 400)
    }
    if (!isHome) {
      navigate('/')
      return
    }
    e.preventDefault()
    playNextSfx()
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
    if (selected && audio) {
      try {
        audio.pause()
        audio.src = selected
        audio.load()
        audio.play().catch(() => {})
      } catch {}
    }
  }
  return (
    <div className="simple-dropdown">
      <select id="tech-select" onChange={onChange}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function Home() {
  return (
    <Layout>
      <Checklist />
      <SongSelect />
    </Layout>
  )
}

function Page1() {
  const onSubmit = (e) => {
    e.preventDefault()
    const name = e.target.name.value.trim()
    const email = e.target.email.value.trim()
    const message = e.target.message.value.trim()
    const body = `${name}\n${email}\n\n${message}`
    const mailtoLink = `mailto:dawn.ng@outlook.com?subject=Website%20Contact&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
  }

  return (
    <Layout>
      <div className="content-box">
        <h1>Je m'appelle Aurore Delune</h1>
        <h2>Comment vous appelez-vous ?</h2>
        <form onSubmit={onSubmit} id="contactForm">
          <label htmlFor="name">Votre nom :</label><br />
          <input type="text" id="name" name="name" required /><br /><br />

          <label htmlFor="email">Votre email :</label><br />
          <input type="email" id="email" name="email" required /><br /><br />

          <label htmlFor="message">Votre message:</label><br />
          <textarea id="message" name="message" rows={5} required />
          <br /><br />

          <button type="submit">Envoyer</button>
        </form>
      </div>
      <img src={`${base}images/19669_221989538788_6246420_n.jpg`} height="200" style={{ marginTop: 50 }} />
      <Checklist />
      <SongSelect />
    </Layout>
  )
}

function Page2() {
  return (
    <Layout>
      <div className="content-box">
        <h1>Topographie de l'étrange</h1>
        <div className="type-container">
          <Typewriter text="Du sacré dans le profane, de la beauté dans la décrépitude" />
        </div>
      </div>
      <FloatingGallery />
      <Checklist />
      <SongSelect />
    </Layout>
  )
}

function Page3() {
  return (
    <Layout>
      <div className="content-box">
        <h1>Reliques du rêve</h1>
        <div className="type-container">
          <Typewriter text="A la lisière du rêve et du mythe, de l'humain et de l'autre" />
        </div>
      </div>
      <img src={`${base}images/P1082181.JPG`} height="600" style={{ margin: '40px 5px 5px 5px' }} />
      <Checklist />
      <SongSelect />
    </Layout>
  )
}

function Page4() {
  return (
    <Layout>
      <div className="content-box">
        <h1>Mémoires du Mont Songe</h1>
        <blockquote>
          <p>
            So you should view this fleeting world -<br />
            A star at dawn, a bubble in a stream,<br />
            A flash of lightning in a summer cloud,<br />
            A flickering lamp, a phantom, and a dream.<br />
            - <em>The Diamond Sutra</em>
          </p>
        </blockquote>
      </div>

      <div className="poem">
        <blockquote>
          <p>
            Dans le brouillard j'erre en cherchant. Dans la brise légère comme un souffle je suis les pas d'un fantôme familier, passeur vers un monde où les créatures mi animaux mi hommes rivalisent avec la nature. Singes aux poils touffus, raides comme des épines, sombres comme la forêt des pins d'hiver. Ils s'engagent dans une lutte frénétique, insondable, dont je suis le voyeur indiscret et exclusif.
          </p>
          <p>
            Des yeux pénétrants, d'un bleu glacial, me surprennent dans le vide vertigineux de cet instant intemporel. Corps contre corps, dans la contagion irrépressible d'une rage inconsolable, ils se livrent au combat sans lendemain, autour d'un rondin qui refuse de céder. Le vent pluvieux s'abat, indifférent, sur ces masses intransigeantes, qui se figent dans le silence assourdissant de cet espace blanchâtre et sans bornes. Les arbres rétrécissent autour de cette étreinte sempiternelle, fanant aux rafales de vent, soufflant de la vie restante aux cœurs haletants.
          </p>
          <p>
            Seul le général au regard tranchant jaillit de ce paysage ensorcelant, bleus diamants subjuguant tout passant importun, s'élançant à la conquête d'un étranger sans abri. Une passerelle imperceptible, jetée sur le vide, nous lie entre deux espace-temps disjoints. Deux rives entrent en collision en provoquant un grand séisme intérieur, celui dont nous rêvons depuis la nuit des temps, des sommeils tumultueux que nul ne saurait rasséréner.
          </p>
          <p>
            Nous nageons à tâtons, en se laissant porter par le courant d'eau ou à contre-courant, dans les eaux noircies par les affres d'une douleur incommensurable. Nous cherchons à l'horizon une issue, avant que nous ne soyons empêtrés dans les tentacules de racines invisibles qui nous tirent vers le fond abyssal, nous asphyxiant sans nous donner une mort certaine. De cette vie interminable nous n'avons connu que les faux éclairages, témoins distraits et fugaces de notre cheminement maladroit vers le trou noir. De ce monde nous n'avons connu que les figures qui apparaissent sans s'attarder, et disparaissent sans adieu. Les mots s'accumulent en des montagnes de carcasses que nous mâchons et déchiquetons en vain. Trouver la dernière parcelle de vie qui vaille. Nous nous noyons, sous le flot de mots comme sous celui du silence ; nous nous asphyxions sur les cimes du mont comme dans les tréfonds de l'océan, impuissants à nous accommoder d'un milieu respirable.
          </p>
          <p>
            Les yeux fermés je pénètre dans la catacombe des âmes inassouvies. Au-devant de la vallée noire, vide, j'entends hurler le vent, j'attends que les méduses éthérées fondent sur moi, visages défigurés par le désespoir. Leurs bouches s'ouvrant béantes poussent des hurlements muets. Leurs yeux écarquillés, pleins de fureur, ont le regard vide d'un animal abattu, une étincelle de souffrance. Dans leurs violentes convulsions elles me saisissent, m'engloutissant dans un gouffre tournoyant, sans fin.
          </p>
          <p>
            Dans les méandres du quotidien je suis ceux du serpent cyclopéen que j'avais rencontré dans la caverne alvéolée, sphère de craie immaculée autour de laquelle vient s'enrouler d'immenses bandes d'écailles irisées.
          </p>
          <p>O douce tendresse !</p>
          <p>O sommeil funeste !</p>
          <p>
            Sous l'immense voûte d'une blancheur éblouissante, je me vis en fée téméraire aux cheveux incendiaires, chevauchant un serpent volant surgi de mon ventre béant, grossissant jusqu'à m'obscurcir les yeux. Dans vos ambres si sombres et clairvoyants, mon ami, je vis mon destin s'étioler et apparaître un univers noir ondoyant, où scintillent, clignotants, les spectres de chimères furtives.
          </p>
          <p>
            Était-ce l'allégresse d'une enfance retrouvée, ou le chagrin d'une imagination condamnée ? Petite fille je rêvais d'ascension aux cieux des êtres inouïs. Éperdue je cherchais sur le toit au-dessus de moi, derrière les couches épaisses de terre translucide et les racines entassées, la lumière mouvante, l'astérie rose violacée au toucher de laquelle je m'évaporerais vers les hauteurs de l'invisible mystère.
          </p>
          <p>
            Vous souvenez-vous du chant que je chantais pour séduire la fleur tentaculaire, pour attiser la moindre lueur ? Hélas, le chant des retrouvailles fut comme un rêve dont nous nous réveillons trop tôt sans avoir pensé à nous en souvenir. À leur grand désespoir les rêveurs accablés d'un sentiment d'atroce nostalgie perdent sans cesse les êtres qui leur viennent dans leurs rêves. Ces individus ou créatures leur échappent, avant qu'ils n'aient réussi de les sauver des profondeurs océaniques de l'oubli, où s'entassent des cadavres qui ont perdu leur nom et leur visage, déchiquetés par la foule des ombres passantes.
          </p>
        </blockquote>
      </div>

      <div className="poem">
        <section className="poem-block">
          <p>
            Une goutte de sang glissa le long d'une courbe<br />
            De l'enduit laqué, et tomba<br />
            Du bord escarpé,<br />
            Dans l'étang de l'amour estropié.
          </p>
          <p>
            Un visage impassible s'écroula,
            Mettant à nu les viscères enflammés
            D'un ange déchu.
          </p>
          <p>
            La chute effrénée<br />
            De nos torses ensanglantés.
          </p>
        </section>
      </div>

      <div className="poem">
        <section className="poem-block">
          <p>
            Dans son berceau putride il languit de solitude,<br />
            Auprès d'une veuve qui s'engourdit en sentinelle.<br />
            Le temps, figé entre les parois flétris,<br />
            Stagne depuis le départ de l'espoir.
          </p>
          <p>
            Plié sous le poids des os trop lourds à soulever,<br />
            Enseveli dans la camisole d'une peau prête à se fendre,<br />
            Il céda son corps défait<br />
            Aux chaînes rouges et bleues qui le sillonnaient,
            Aux poches gorgées d'eau smaragdine qui pendaient
            À ses bras impuissants.
          </p>
          <p>
            Parlez-moi du désir, des caresses amoureuses,
            L'homme moribond marmonna les mots de sa bouche asséchée,
            Dans une dernière tentative de vivre.
          </p>
          <p>
            Il se livra, tremblotant, à la première étreinte de lamore.
          </p>
        </section>
      </div>
      <Checklist />
      <SongSelect />
    </Layout>
  )
}

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
