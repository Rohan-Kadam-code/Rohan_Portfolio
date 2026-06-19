import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Journey from './components/Journey';
import Expertise from './components/Expertise';
import Projects from './components/Projects';
import Journal from './components/Journal';
import TorqueConverter from './components/TorqueConverter';
import Contact from './components/Contact';
import MouseGlow from './components/MouseGlow';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash;
    if (hash === '#/debrief') return 'debrief';
    if (hash === '#/tuning-lab') return 'tuning-lab';
    return 'main';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/debrief') {
        setCurrentView('debrief');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#/tuning-lab') {
        setCurrentView('tuning-lab');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentView('main');
        const targetId = hash.replace('#', '');
        if (targetId) {
          // Allow render state to settle before scrolling
          setTimeout(() => {
            const el = document.getElementById(targetId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Trigger scroll check on initial load if we have a target hash
    if (window.location.hash && window.location.hash !== '#/debrief' && window.location.hash !== '#/tuning-lab') {
      handleHashChange();
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <MouseGlow />
      <div className="App" style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s ease 0.2s' }}>
        <Navbar />
        {currentView === 'debrief' ? (
          <Journal />
        ) : currentView === 'tuning-lab' ? (
          <TorqueConverter />
        ) : (
          <>
            <Hero />
            <About />
            <Journey />
            <Expertise />
            <Projects />
            <Contact />
          </>
        )}
      </div>
    </>
  );
}

export default App;
