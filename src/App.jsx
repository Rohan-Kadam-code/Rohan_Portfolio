import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Journey from './components/Journey';
import Expertise from './components/Expertise';
import Projects from './components/Projects';
import Contact from './components/Contact';
import MouseGlow from './components/MouseGlow';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <MouseGlow />
      <div className="App" style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s ease 0.2s' }}>
        <Navbar />
        <Hero />
        <About />
        <Journey />
        <Expertise />
        <Projects />
        <Contact />
      </div>
    </>
  );
}

export default App;
