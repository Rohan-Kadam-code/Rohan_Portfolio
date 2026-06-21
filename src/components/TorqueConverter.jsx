import React, { useState, useEffect, useRef } from 'react';
import RevealOnScroll from './RevealOnScroll';
import GlitchText from './GlitchText';

// Presets Definition
const ENGINE_PRESETS = {
  f1_v10: {
    name: 'F1 V10 Engine',
    redline: 18500,
    idle: 3500,
    curve: [
      { rpm: 3500, torque: 180 },
      { rpm: 6000, torque: 280 },
      { rpm: 9000, torque: 420 },
      { rpm: 12000, torque: 580 },
      { rpm: 15000, torque: 650 },
      { rpm: 17500, torque: 620 },
      { rpm: 18500, torque: 520 },
    ],
    defaultCi0: 2.2,
    defaultTr0: 1.8,
    defaultCP: 0.88,
    defaultMass: 650, // F1 car weight in kg
    defaultGear: 2, // 2nd gear for launch
  },
  v8_muscle: {
    name: 'V8 Muscle Car',
    redline: 6800,
    idle: 800,
    curve: [
      { rpm: 800, torque: 350 },
      { rpm: 2000, torque: 520 },
      { rpm: 3500, torque: 650 },
      { rpm: 4500, torque: 700 },
      { rpm: 5500, torque: 660 },
      { rpm: 6500, torque: 560 },
      { rpm: 6800, torque: 480 },
    ],
    defaultCi0: 38.0,
    defaultTr0: 2.3,
    defaultCP: 0.85,
    defaultMass: 1600,
    defaultGear: 0, // 1st gear
  },
  heavy_diesel: {
    name: 'Forklift Heavy Diesel',
    redline: 2800,
    idle: 700,
    curve: [
      { rpm: 700, torque: 180 },
      { rpm: 1200, torque: 330 },
      { rpm: 1600, torque: 350 },
      { rpm: 2000, torque: 330 },
      { rpm: 2400, torque: 290 },
      { rpm: 2800, torque: 220 },
    ],
    defaultCi0: 110.0,
    defaultTr0: 2.1,
    defaultCP: 0.82,
    defaultMass: 4500, // Heavy forklift
    defaultGear: 0,
  },
  inline4_turbo: {
    name: 'Inline-4 Turbocharged',
    redline: 7000,
    idle: 850,
    curve: [
      { rpm: 850, torque: 150 },
      { rpm: 1800, torque: 320 },
      { rpm: 3000, torque: 320 },
      { rpm: 4500, torque: 320 },
      { rpm: 5800, torque: 280 },
      { rpm: 6500, torque: 230 },
      { rpm: 7000, torque: 180 },
    ],
    defaultCi0: 16.0,
    defaultTr0: 2.0,
    defaultCP: 0.85,
    defaultMass: 1400,
    defaultGear: 0,
  }
};

const GEAR_RATIOS = [3.5, 2.1, 1.4, 1.0, 0.73]; // 5-speed transmission
const AXLE_RATIO = 3.9;
const TIRE_RADIUS = 0.33; // meters

// Helper for engine torque interpolation
const getEngineTorque = (rpm, curve, redline, idle) => {
  if (rpm < idle) {
    // Engine drag/idle resistance torque model
    const pct = rpm / idle;
    return curve[0].torque * Math.max(0.1, pct);
  }
  if (rpm > redline) return 0;
  
  const sorted = [...curve].sort((a, b) => a.rpm - b.rpm);
  if (rpm <= sorted[0].rpm) return sorted[0].torque;
  if (rpm >= sorted[sorted.length - 1].rpm) return sorted[sorted.length - 1].torque;

  for (let i = 0; i < sorted.length - 1; i++) {
    const p1 = sorted[i];
    const p2 = sorted[i + 1];
    if (rpm >= p1.rpm && rpm <= p2.rpm) {
      const t = (rpm - p1.rpm) / (p2.rpm - p1.rpm);
      return p1.torque + t * (p2.torque - p1.torque);
    }
  }
  return 0;
};

// Torque Converter Characteristics formulas
// Capacity Coefficient: Ci(sr) = T_impeller / (N_impeller/1000)^2
const getCi = (sr, Ci0) => {
  const r = Math.min(1.0, Math.max(0.0, sr));
  // Standard converter curve shape: starts flat at stall, drops off to 0 near coupling
  return Ci0 * (1.0 - 0.15 * Math.pow(r, 2) - 0.85 * Math.pow(r, 8));
};

// Torque Ratio: TR(sr) = T_turbine / T_impeller
const getTR = (sr, Tr0, cp) => {
  const r = Math.min(1.0, Math.max(0.0, sr));
  if (r >= cp) return 1.0;
  // Linear decay from stall TR0 to 1.0 at coupling point
  return Tr0 - (Tr0 - 1.0) * (r / cp);
};

// Numerical solver to find matching Engine RPM for a given Turbine RPM (Nt)
// Solving: T_engine(Ne) * throttle = Ci(Nt / Ne) * (Ne/1000)^2
const solveMatchingPoint = (Nt, engineCurve, redline, idle, Ci0, throttlePercent) => {
  const throttleFactor = Math.max(0.12, throttlePercent / 100);
  
  let low = Math.max(idle, Nt);
  let high = Math.max(redline, Nt + 500);
  let matchedNe = low;
  let steps = 0;

  // If turbine speed is extremely high, lock up or clip
  if (Nt >= redline) {
    return redline;
  }

  while (steps < 25 && (high - low) > 1) {
    const mid = (low + high) / 2;
    const sr = Nt / mid;
    const Te = getEngineTorque(mid, engineCurve, redline, idle) * throttleFactor;
    const Ti = getCi(sr, Ci0) * Math.pow(mid / 1000, 2);
    const diff = Te - Ti;

    if (Math.abs(diff) < 0.05) {
      matchedNe = mid;
      break;
    }

    if (diff > 0) {
      // Engine has excess torque -> accelerates
      low = mid;
    } else {
      // Impeller loads engine down -> decelerates
      high = mid;
    }
    matchedNe = mid;
    steps++;
  }
  
  return Math.min(redline, Math.max(idle, matchedNe));
};

const TorqueConverter = () => {
  // Config & State
  const [selectedPresetKey, setSelectedPresetKey] = useState('v8_muscle');
  const [engineCurve, setEngineCurve] = useState(ENGINE_PRESETS.v8_muscle.curve);
  const [redline, setRedline] = useState(ENGINE_PRESETS.v8_muscle.redline);
  const [idleSpeed, setIdleSpeed] = useState(ENGINE_PRESETS.v8_muscle.idle);
  
  const [ci0, setCi0] = useState(ENGINE_PRESETS.v8_muscle.defaultCi0);
  const [tr0, setTr0] = useState(ENGINE_PRESETS.v8_muscle.defaultTr0);
  const [couplingPoint, setCouplingPoint] = useState(ENGINE_PRESETS.v8_muscle.defaultCP);
  const [lockupEnabled, setLockupEnabled] = useState(true);
  const [vehicleMass, setVehicleMass] = useState(ENGINE_PRESETS.v8_muscle.defaultMass);
  
  // Custom edit states
  const [editRpm, setEditRpm] = useState('');
  const [editTorque, setEditTorque] = useState('');

  // Active view tab: 'telemetry' or 'simulation'
  const [activeTab, setActiveTab] = useState('telemetry');

  // Interactive zoom & hover telemetry states
  const [zoomedChart, setZoomedChart] = useState(null); // 'matching' | 'ratios' | null
  const [matchingHover, setMatchingHover] = useState(null); // { rpm, viewBoxX, tEngine, tConverters }
  const [ratiosHover, setRatiosHover] = useState(null); // { sr, viewBoxX, tr, eff }
  const [isMobile, setIsMobile] = useState(false);

  const handleMatchingMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const clientX = e.clientX - rect.left;
    const viewBoxX = (clientX / width) * svgWidth;
    
    const xMin = 0;
    const xMax = redline;
    const innerWidth = svgWidth - 2 * padding;
    const xVal = xMin + ((viewBoxX - padding) / innerWidth) * (xMax - xMin);

    if (xVal >= idleSpeed && xVal <= redline) {
      const tEngine = getEngineTorque(xVal, engineCurve, redline, idleSpeed);
      const tConverters = [0.0, 0.4, 0.6, 0.8].map(sr => ({
        sr,
        torque: getCi(sr, ci0) * Math.pow(xVal / 1000, 2)
      }));
      setMatchingHover({
        rpm: Math.round(xVal),
        viewBoxX,
        tEngine: Math.round(tEngine),
        tConverters: tConverters.map(c => ({ ...c, torque: Math.round(c.torque) }))
      });
    } else {
      setMatchingHover(null);
    }
  };

  const handleRatiosMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const clientX = e.clientX - rect.left;
    const viewBoxX = (clientX / width) * svgWidth;
    
    const xMin = 0;
    const xMax = 1.0;
    const innerWidth = svgWidth - 2 * padding;
    const srVal = xMin + ((viewBoxX - padding) / innerWidth) * (xMax - xMin);

    if (srVal >= 0 && srVal <= 1.0) {
      const tr = getTR(srVal, tr0, couplingPoint);
      const eff = tr * srVal;
      setRatiosHover({
        sr: parseFloat(srVal.toFixed(3)),
        viewBoxX,
        tr: parseFloat(tr.toFixed(2)),
        eff: parseFloat(eff.toFixed(2))
      });
    } else {
      setRatiosHover(null);
    }
  };

  // Simulation variables
  const [simRunning, setSimRunning] = useState(false);
  const [simThrottle, setSimThrottle] = useState(0); // 0-100%
  const [simBrake, setSimBrake] = useState(100); // 0-100%
  const [simGear, setSimGear] = useState(0); // 0 = 1st, 1 = 2nd...
  const [simAutoShift, setSimAutoShift] = useState(true);

  // Live simulation outputs
  const [simSpeed, setSimSpeed] = useState(0); // km/h
  const [simEngineRpm, setSimEngineRpm] = useState(ENGINE_PRESETS.v8_muscle.idle);
  const [simTurbineRpm, setSimTurbineRpm] = useState(0);
  const [simSlipRatio, setSimSlipRatio] = useState(0);
  const [simTorqueRatio, setSimTorqueRatio] = useState(1.0);
  const [simEngineTorque, setSimEngineTorque] = useState(0);
  const [simTurbineTorque, setSimTurbineTorque] = useState(0);
  const [simTractiveForce, setSimTractiveForce] = useState(0);
  const [simLockupActive, setSimLockupActive] = useState(false);

  // Refs for animation loop
  const requestRef = useRef();
  const simStateRef = useRef({
    speed: 0, // m/s
    engineRpm: ENGINE_PRESETS.v8_muscle.idle,
    turbineRpm: 0,
    gear: 0,
  });

  // Load preset handler
  const loadPreset = (key) => {
    const preset = ENGINE_PRESETS[key];
    setSelectedPresetKey(key);
    setEngineCurve(preset.curve);
    setRedline(preset.redline);
    setIdleSpeed(preset.idle);
    setCi0(preset.defaultCi0);
    setTr0(preset.defaultTr0);
    setCouplingPoint(preset.defaultCP);
    setVehicleMass(preset.defaultMass);
    setSimGear(preset.defaultGear);

    // Sync simulation ref
    simStateRef.current = {
      speed: 0,
      engineRpm: preset.idle,
      turbineRpm: 0,
      gear: preset.defaultGear,
    };
    setSimSpeed(0);
    setSimEngineRpm(preset.idle);
    setSimTurbineRpm(0);
    setSimSlipRatio(0);
    setSimLockupActive(false);
  };

  // Sync simulation initial values on preset mount, add escape keydown listener, and track window resize
  useEffect(() => {
    loadPreset('v8_muscle');
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setZoomedChart(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Solve matching curves for static plotting
  const generateMatchCurvesData = () => {
    // Generate Engine Torque curve
    const enginePoints = [];
    const step = (redline - idleSpeed) / 50;
    for (let r = idleSpeed; r <= redline; r += step) {
      enginePoints.push({ x: r, y: getEngineTorque(r, engineCurve, redline, idleSpeed) });
    }

    // Generate Converter Input Torque curves at varying speed ratios (SR = 0, 0.4, 0.6, 0.8)
    const srs = [0.0, 0.4, 0.6, 0.8];
    const converterLines = srs.map(sr => {
      const pts = [];
      for (let r = idleSpeed; r <= redline; r += step) {
        // Ti = Ci(sr) * (rpm/1000)^2
        const torque = getCi(sr, ci0) * Math.pow(r / 1000, 2);
        pts.push({ x: r, y: torque });
      }
      return { sr, pts };
    });

    return { enginePoints, converterLines };
  };

  const generateConverterStatsData = () => {
    const data = [];
    for (let sr = 0; sr <= 1.0; sr += 0.02) {
      const tr = getTR(sr, tr0, couplingPoint);
      const eff = tr * sr;
      const ci = getCi(sr, ci0);
      // K-factor = 1000 / sqrt(Ci)
      const k = ci > 0 ? (1000 / Math.sqrt(ci)) : 9999;
      data.push({ sr, tr, eff, ci, k });
    }
    return data;
  };

  // Simulation physics update loop
  const updateSim = (time) => {
    const dt = 0.016; // fixed time step ~60fps
    const state = simStateRef.current;

    // 1. Calculate Turbine Speed from Vehicle Speed
    // Wheel angular speed: w_wheel = speed / tire_radius
    const w_wheel = state.speed / TIRE_RADIUS;
    // Wheel RPM = w_wheel * 60 / (2 * pi)
    const n_wheel = w_wheel * 60 / (2 * Math.PI);
    
    // Turbine RPM = Wheel RPM * gear_ratio * axle_ratio
    const gearRatio = GEAR_RATIOS[state.gear];
    let targetNt = n_wheel * gearRatio * AXLE_RATIO;
    targetNt = Math.max(0, targetNt);

    // 2. Solve for matching Engine RPM
    let matchedNe = idleSpeed;
    let currentSR = 0;
    let currentTR = 1.0;
    let isLocked = false;

    // Check lockup condition
    if (targetNt > 0) {
      currentSR = targetNt / state.engineRpm;
      if (currentSR > 1.0) currentSR = 1.0;
    }

    if (lockupEnabled && currentSR >= couplingPoint && state.speed > 5.0) {
      isLocked = true;
      matchedNe = Math.max(idleSpeed, targetNt);
      currentSR = 1.0;
      currentTR = 1.0;
    } else {
      // Solve steady-state fluid coupling point
      matchedNe = solveMatchingPoint(targetNt, engineCurve, redline, idleSpeed, ci0, simThrottle);
      currentSR = matchedNe > 0 ? (targetNt / matchedNe) : 0;
      if (currentSR > 1.0) currentSR = 1.0;
      currentTR = getTR(currentSR, tr0, couplingPoint);
    }

    // 3. Torque & Power Calculations
    const throttleFactor = Math.max(0.12, simThrottle / 100);
    const rawEngineTorque = getEngineTorque(matchedNe, engineCurve, redline, idleSpeed);
    const engineTorqueOutput = rawEngineTorque * throttleFactor;
    
    // Turbine torque: multiplication active only when unlocked
    const turbineTorqueOutput = isLocked ? engineTorqueOutput : (engineTorqueOutput * currentTR);

    // 4. Force & Acceleration Calculations
    const wheelTorque = turbineTorqueOutput * gearRatio * AXLE_RATIO * 0.95; // 95% transmission efficiency
    const tractiveForce = wheelTorque / TIRE_RADIUS;

    // Resisting forces
    // Aerodynamic drag: F_drag = 0.5 * rho * A * Cd * v^2
    const fd = 0.5 * 1.2 * 2.1 * 0.33 * Math.pow(state.speed, 2);
    // Rolling resistance: F_rr = mass * g * crr
    const frr = vehicleMass * 9.81 * 0.015;
    // Braking force: Max brake force ~12kN scaled by slider percentage
    const fb = (simBrake / 100) * 15000;

    const netForce = tractiveForce - fd - frr - fb;
    let accel = netForce / vehicleMass;

    // If speed is zero and net force is negative, vehicle cannot move backwards
    if (state.speed <= 0.01 && netForce <= 0) {
      accel = 0;
      state.speed = 0;
    }

    // Update speed
    state.speed += accel * dt;
    if (state.speed < 0) state.speed = 0;

    // Update turbine RPM based on new speed
    const new_w_wheel = state.speed / TIRE_RADIUS;
    const new_n_wheel = new_w_wheel * 60 / (2 * Math.PI);
    state.turbineRpm = Math.max(0, new_n_wheel * gearRatio * AXLE_RATIO);
    
    // Smooth transition engine RPM towards matched Ne to simulate inertia
    state.engineRpm += (matchedNe - state.engineRpm) * 0.15;
    if (state.engineRpm < idleSpeed) state.engineRpm = idleSpeed;
    if (state.engineRpm > redline) state.engineRpm = redline;

    // Auto Shifting Logic
    if (simAutoShift) {
      const upshiftThreshold = redline * 0.92;
      const downshiftThreshold = Math.max(idleSpeed * 1.2, 1400);

      if (state.engineRpm > upshiftThreshold && state.gear < GEAR_RATIOS.length - 1) {
        state.gear += 1; // Upshift
      } else if (state.engineRpm < downshiftThreshold && state.gear > 0 && state.speed > 2.0) {
        state.gear -= 1; // Downshift
      }
    }

    // Sync values to component states for re-render
    setSimSpeed(state.speed * 3.6); // m/s to km/h
    setSimEngineRpm(state.engineRpm);
    setSimTurbineRpm(state.turbineRpm);
    setSimSlipRatio(currentSR);
    setSimTorqueRatio(currentTR);
    setSimEngineTorque(engineTorqueOutput);
    setSimTurbineTorque(turbineTorqueOutput);
    setSimTractiveForce(tractiveForce);
    setSimLockupActive(isLocked);
    setSimGear(state.gear);

    if (simRunning) {
      requestRef.current = requestAnimationFrame(updateSim);
    }
  };

  // Start/Stop simulation loop
  useEffect(() => {
    if (simRunning) {
      requestRef.current = requestAnimationFrame(updateSim);
    } else {
      cancelAnimationFrame(requestRef.current);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [simRunning, simThrottle, simBrake, simAutoShift, ci0, tr0, couplingPoint, lockupEnabled, vehicleMass]);

  // Handle engine curve coordinate edits
  const handleAddPoint = (e) => {
    e.preventDefault();
    const rpm = parseInt(editRpm);
    const torque = parseInt(editTorque);
    if (!isNaN(rpm) && !isNaN(torque) && rpm > 0 && torque > 0) {
      const newCurve = [...engineCurve, { rpm, torque }].sort((a, b) => a.rpm - b.rpm);
      setEngineCurve(newCurve);
      setEditRpm('');
      setEditTorque('');
    }
  };

  const handleRemovePoint = (index) => {
    if (engineCurve.length > 2) {
      const newCurve = engineCurve.filter((_, idx) => idx !== index);
      setEngineCurve(newCurve);
    }
  };

  // Reset simulation dashboard
  const handleResetSim = () => {
    const preset = ENGINE_PRESETS[selectedPresetKey];
    simStateRef.current = {
      speed: 0,
      engineRpm: preset.idle,
      turbineRpm: 0,
      gear: preset.defaultGear,
    };
    setSimSpeed(0);
    setSimEngineRpm(preset.idle);
    setSimTurbineRpm(0);
    setSimSlipRatio(0);
    setSimLockupActive(false);
    setSimThrottle(0);
    setSimBrake(100);
  };

  const matchData = generateMatchCurvesData();
  const converterStats = generateConverterStatsData();

  // Custom responsive SVG Chart bounds
  const svgWidth = 550;
  const svgHeight = 350;
  const padding = 55;

  // Chart coordinate mapping helpers
  const mapCoords = (x, y, xMin, xMax, yMin, yMax) => {
    const px = padding + ((x - xMin) / (xMax - xMin)) * (svgWidth - 2 * padding);
    const py = svgHeight - padding - ((y - yMin) / (yMax - yMin)) * (svgHeight - 2 * padding);
    return { px, py };
  };

  // 1. Matching Points Chart Details
  const renderMatchingChart = () => {
    const xMin = 0;
    const xMax = redline;
    const yMin = 0;
    const yMax = Math.max(...engineCurve.map(p => p.torque)) * 1.25;

    const { enginePoints, converterLines } = matchData;

    // Convert curves to SVG path definitions
    const makePath = (points) => {
      return points.map((p, idx) => {
        const { px, py } = mapCoords(p.x, p.y, xMin, xMax, yMin, yMax);
        return `${idx === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`;
      }).join(' ');
    };

    // Calculate grid lines
    const xTicks = [];
    const yTicks = [];
    for (let x = 2000; x <= redline; x += 3000) xTicks.push(x);
    for (let y = 100; y <= yMax; y += 150) yTicks.push(y);

    return (
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ background: '#0e1014', border: '1px solid rgba(255,255,255,0.03)', cursor: 'crosshair' }}
        onMouseMove={handleMatchingMouseMove}
        onMouseLeave={() => setMatchingHover(null)}
      >
        {/* Grid lines */}
        {xTicks.map(val => {
          const { px } = mapCoords(val, 0, xMin, xMax, yMin, yMax);
          return (
            <g key={`x-${val}`}>
              <line x1={px} y1={padding} x2={px} y2={svgHeight - padding} stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
              <text x={px} y={svgHeight - padding + 15} fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">{val}</text>
            </g>
          );
        })}
        {yTicks.map(val => {
          const { py } = mapCoords(0, val, xMin, xMax, yMin, yMax);
          return (
            <g key={`y-${val}`}>
              <line x1={padding} y1={py} x2={svgWidth - padding} y2={py} stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
              <text x={padding - 8} y={py + 3} fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="end">{val}</text>
            </g>
          );
        })}

        {/* Axes */}
        <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="rgba(255,255,255,0.2)" />
        <line x1={padding} y1={padding} x2={padding} y2={svgHeight - padding} stroke="rgba(255,255,255,0.2)" />

        {/* Axis Labels */}
        <text x={svgWidth / 2} y={svgHeight - 10} fill="#fff" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle" letterSpacing="1">ENGINE ROTATIONAL SPEED (RPM)</text>
        <text x={12} y={svgHeight / 2} fill="#fff" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle" transform={`rotate(-90 12 ${svgHeight / 2})`} letterSpacing="1">TORQUE CAPACITY (NM)</text>

        {/* Converter Lines (Impeller absorbed torque at various Speed Ratios) */}
        {converterLines.map((line, idx) => {
          const path = makePath(line.pts);
          const labelPoint = line.pts[Math.round(line.pts.length * 0.75)];
          const { px, py } = mapCoords(labelPoint.x, labelPoint.y, xMin, xMax, yMin, yMax);
          return (
            <g key={`converter-line-${idx}`}>
              <path d={path} fill="none" stroke="var(--color-telemetry-blue)" strokeWidth="1.5" opacity={0.4 + idx * 0.2} />
              <text x={px} y={py - 6} fill="var(--color-telemetry-blue)" fontSize="8" fontFamily="var(--font-mono)" opacity={0.6 + idx * 0.15}>SR={line.sr}</text>
            </g>
          );
        })}

        {/* Engine Torque Line */}
        <path d={makePath(enginePoints)} fill="none" stroke="var(--color-primary)" strokeWidth="3" />

        {/* Legend */}
        <rect x={padding + 15} y={padding + 10} width="220" height="45" fill="rgba(10,12,16,0.85)" stroke="rgba(255,255,255,0.06)" />
        <line x1={padding + 25} y1={padding + 22} x2={padding + 45} y2={padding + 22} stroke="var(--color-primary)" strokeWidth="3" />
        <text x={padding + 52} y={padding + 25} fill="#fff" fontSize="9" fontFamily="var(--font-mono)">ENGINE TORQUE (100% THR)</text>
        
        <line x1={padding + 25} y1={padding + 38} x2={padding + 45} y2={padding + 38} stroke="var(--color-telemetry-blue)" strokeWidth="1.5" />
        <text x={padding + 52} y={padding + 41} fill="var(--color-telemetry-blue)" fontSize="9" fontFamily="var(--font-mono)">CONVERTER INPUT TORQUE (Ti)</text>

        {/* Hover Crosshair and Telemetry Box */}
        {matchingHover && (
          <g>
            <line
              x1={matchingHover.viewBoxX}
              y1={padding}
              x2={matchingHover.viewBoxX}
              y2={svgHeight - padding}
              stroke="var(--color-primary)"
              strokeWidth="1.5"
              strokeDasharray="4,4"
            />
            {!isMobile && (
              <g>
                <rect
                  x={matchingHover.viewBoxX + 15 + 230 > svgWidth - padding ? matchingHover.viewBoxX - 245 : matchingHover.viewBoxX + 15}
                  y={padding + 50}
                  width="230"
                  height="115"
                  fill="rgba(10,12,16,0.94)"
                  stroke="var(--color-primary)"
                  strokeWidth="1"
                  rx="2"
                />
                <text
                  x={matchingHover.viewBoxX + 15 + 230 > svgWidth - padding ? matchingHover.viewBoxX - 230 : matchingHover.viewBoxX + 30}
                  y={padding + 70}
                  fill="#fff"
                  fontSize="9.5"
                  fontFamily="var(--font-mono)"
                  fontWeight="bold"
                >
                  RPM: {matchingHover.rpm} RPM
                </text>
                <text
                  x={matchingHover.viewBoxX + 15 + 230 > svgWidth - padding ? matchingHover.viewBoxX - 230 : matchingHover.viewBoxX + 30}
                  y={padding + 85}
                  fill="var(--color-primary)"
                  fontSize="9"
                  fontFamily="var(--font-mono)"
                >
                  ENGINE TORQUE: {matchingHover.tEngine} Nm
                </text>
                {matchingHover.tConverters.map((c, i) => (
                  <text
                    key={i}
                    x={matchingHover.viewBoxX + 15 + 230 > svgWidth - padding ? matchingHover.viewBoxX - 230 : matchingHover.viewBoxX + 30}
                    y={padding + 100 + i * 13}
                    fill="var(--color-telemetry-blue)"
                    fontSize="8.5"
                    fontFamily="var(--font-mono)"
                    opacity={0.6 + i * 0.15}
                  >
                    Ti (SR={c.sr.toFixed(1)}): {c.torque} Nm
                  </text>
                ))}
              </g>
            )}
          </g>
        )}
      </svg>
    );
  };

  // 2. Performance Ratios Chart (Torque Ratio, Efficiency vs Speed Ratio)
  const renderRatiosChart = () => {
    const xMin = 0;
    const xMax = 1.0;
    const yMin = 0;
    const yMax = Math.max(3.0, tr0);

    const makeRatioPath = (key) => {
      return converterStats.map((p, idx) => {
        const { px, py } = mapCoords(p.sr, p[key], xMin, xMax, yMin, yMax);
        return `${idx === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`;
      }).join(' ');
    };

    // Calculate grid lines
    const xTicks = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0];
    const yTicks = [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0];

    return (
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ background: '#0e1014', border: '1px solid rgba(255,255,255,0.03)', cursor: 'crosshair' }}
        onMouseMove={handleRatiosMouseMove}
        onMouseLeave={() => setRatiosHover(null)}
      >
        {/* Grid lines */}
        {xTicks.map(val => {
          const { px } = mapCoords(val, 0, xMin, xMax, yMin, yMax);
          const isCP = Math.abs(val - couplingPoint) < 0.05;
          return (
            <g key={`x-rat-${val}`}>
              <line x1={px} y1={padding} x2={px} y2={svgHeight - padding} stroke={isCP ? "rgba(225,6,0,0.2)" : "rgba(255,255,255,0.05)"} strokeDasharray="3,3" />
              <text x={px} y={svgHeight - padding + 15} fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">{val.toFixed(1)}</text>
            </g>
          );
        })}
        {yTicks.map(val => {
          if (val > yMax) return null;
          const { py } = mapCoords(0, val, xMin, xMax, yMin, yMax);
          return (
            <g key={`y-rat-${val}`}>
              <line x1={padding} y1={py} x2={svgWidth - padding} y2={py} stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
              <text x={padding - 8} y={py + 3} fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="end">{val.toFixed(1)}</text>
            </g>
          );
        })}

        {/* Axes */}
        <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="rgba(255,255,255,0.2)" />
        <line x1={padding} y1={padding} x2={padding} y2={svgHeight - padding} stroke="rgba(255,255,255,0.2)" />

        {/* Axis Labels */}
        <text x={svgWidth / 2} y={svgHeight - 10} fill="#fff" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle" letterSpacing="1">SPEED RATIO (SR = Nt / Ne)</text>
        <text x={12} y={svgHeight / 2} fill="#fff" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle" transform={`rotate(-90 12 ${svgHeight / 2})`} letterSpacing="1">RATIO / EFFICIENCY</text>

        {/* Highlight coupling point */}
        {(() => {
          const { px } = mapCoords(couplingPoint, 0, xMin, xMax, yMin, yMax);
          return (
            <g>
              <line x1={px} y1={padding} x2={px} y2={svgHeight - padding} stroke="var(--color-primary)" strokeWidth="1" strokeDasharray="5,5" />
              <text x={px + 5} y={padding + 15} fill="var(--color-primary)" fontSize="8" fontFamily="var(--font-mono)">COUPLING POINT ({couplingPoint.toFixed(2)})</text>
            </g>
          );
        })()}

        {/* Curves */}
        {/* Torque Ratio TR */}
        <path d={makeRatioPath('tr')} fill="none" stroke="var(--color-secondary)" strokeWidth="2.5" />
        
        {/* Efficiency η */}
        <path d={makeRatioPath('eff')} fill="none" stroke="var(--color-telemetry-blue)" strokeWidth="2.5" />

        {/* Legend */}
        <rect x={padding + 15} y={padding + 25} width="170" height="45" fill="rgba(10,12,16,0.85)" stroke="rgba(255,255,255,0.06)" />
        <line x1={padding + 25} y1={padding + 37} x2={padding + 45} y2={padding + 37} stroke="var(--color-secondary)" strokeWidth="2.5" />
        <text x={padding + 52} y={padding + 40} fill="#fff" fontSize="9" fontFamily="var(--font-mono)">TORQUE RATIO (TR)</text>
        
        <line x1={padding + 25} y1={padding + 52} x2={padding + 45} y2={padding + 52} stroke="var(--color-telemetry-blue)" strokeWidth="2.5" />
        <text x={padding + 52} y={padding + 55} fill="var(--color-telemetry-blue)" fontSize="9" fontFamily="var(--font-mono)">EFFICIENCY (TR * SR)</text>

        {/* Hover Crosshair and Telemetry Box */}
        {ratiosHover && (
          <g>
            <line
              x1={ratiosHover.viewBoxX}
              y1={padding}
              x2={ratiosHover.viewBoxX}
              y2={svgHeight - padding}
              stroke="var(--color-secondary)"
              strokeWidth="1.5"
              strokeDasharray="4,4"
            />
            {!isMobile && (
              <g>
                <rect
                  x={ratiosHover.viewBoxX + 15 + 180 > svgWidth - padding ? ratiosHover.viewBoxX - 195 : ratiosHover.viewBoxX + 15}
                  y={padding + 50}
                  width="180"
                  height="75"
                  fill="rgba(10,12,16,0.94)"
                  stroke="var(--color-secondary)"
                  strokeWidth="1"
                  rx="2"
                />
                <text
                  x={ratiosHover.viewBoxX + 15 + 180 > svgWidth - padding ? ratiosHover.viewBoxX - 180 : ratiosHover.viewBoxX + 30}
                  y={padding + 70}
                  fill="#fff"
                  fontSize="9.5"
                  fontFamily="var(--font-mono)"
                  fontWeight="bold"
                >
                  SPEED RATIO: {ratiosHover.sr.toFixed(3)}
                </text>
                <text
                  x={ratiosHover.viewBoxX + 15 + 180 > svgWidth - padding ? ratiosHover.viewBoxX - 180 : ratiosHover.viewBoxX + 30}
                  y={padding + 85}
                  fill="var(--color-secondary)"
                  fontSize="9"
                  fontFamily="var(--font-mono)"
                >
                  TORQUE RATIO: {ratiosHover.tr.toFixed(2)}x
                </text>
                <text
                  x={ratiosHover.viewBoxX + 15 + 180 > svgWidth - padding ? ratiosHover.viewBoxX - 180 : ratiosHover.viewBoxX + 30}
                  y={padding + 100}
                  fill="var(--color-telemetry-blue)"
                  fontSize="9"
                  fontFamily="var(--font-mono)"
                >
                  EFFICIENCY: {(ratiosHover.eff * 100).toFixed(1)}%
                </text>
              </g>
            )}
          </g>
        )}
      </svg>
    );
  };

  // Real-time F1 Steering Shift LEDs
  const renderShiftLights = () => {
    const totalLEDs = 10;
    const rpmPct = (simEngineRpm - idleSpeed) / (redline - idleSpeed);
    const litLEDs = Math.round(rpmPct * totalLEDs);
    
    return (
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '15px', background: '#08090b', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
        {Array.from({ length: totalLEDs }).map((_, i) => {
          let ledColor = 'rgba(255,255,255,0.05)';
          const active = i < litLEDs;
          if (active) {
            if (i < 4) ledColor = '#00FF66'; // Green
            else if (i < 7) ledColor = '#FFD700'; // Yellow/Gold
            else ledColor = '#E10600'; // F1 Red (High Revs)
          }
          const ledGlow = active ? `0 0 10px ${ledColor}` : 'none';
          
          return (
            <div
              key={i}
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: active ? ledColor : 'rgba(255,255,255,0.05)',
                boxShadow: ledGlow,
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.1s ease',
              }}
            />
          );
        })}
      </div>
    );
  };

  const returnToMain = () => {
    window.location.hash = '#projects';
  };

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: 'calc(100vh - var(--nav-height))', paddingTop: 'var(--nav-height)', paddingBottom: '80px' }}>
      <div className="container">
        
        {/* Navigation Return Link */}
        <div 
          onClick={returnToMain}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '35px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--color-primary)',
            cursor: 'pointer',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            width: 'fit-content',
          }}
          className="link-hover"
        >
          <span>← RETURN TO PADDOCK (MAIN SITE)</span>
        </div>

        {/* Title */}
        <RevealOnScroll>
          <div style={{ marginBottom: '40px' }}>
            <h2 className="section-title">
              <GlitchText text="Tuning Lab" />
              <span style={{ fontSize: '0.5em', color: 'var(--color-text-muted)' }}> // TORQUE CONVERTER MATCHING LAB</span>
            </h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '850px', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Explore the engineering behind fluid couplings and torque converters. Connect custom engine torque curves to converters and solve the dynamic matching points. Use the real-time simulation module to see the torque multiplication and lockup clutch effects during a launch.
            </p>
          </div>
        </RevealOnScroll>

        {/* Preset Selector Banner */}
        <div style={{
          background: 'var(--color-surface)',
          padding: isMobile ? '12px' : '20px',
          borderRadius: '4px',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          marginBottom: '30px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? '10px' : '20px',
        }}>
          <span className="f1-mono-text" style={{ fontSize: '0.85rem', color: 'var(--color-secondary)' }}>SELECT COMBINED PRESET:</span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {Object.keys(ENGINE_PRESETS).map(key => (
              <button
                key={key}
                onClick={() => loadPreset(key)}
                style={{
                  background: selectedPresetKey === key ? 'var(--color-primary)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${selectedPresetKey === key ? 'var(--color-primary)' : 'rgba(255,255,255,0.08)'}`,
                  color: '#fff',
                  padding: isMobile ? '6px 12px' : '8px 18px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: isMobile ? '0.7rem' : '0.75rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transform: 'skewX(-10deg)',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ transform: 'skewX(10deg)', display: 'block' }}>{ENGINE_PRESETS[key].name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Dashboard Workspace Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 380px', gap: '20px', alignItems: 'start' }} className="journal-dashboard">
          
          {/* Left Block: Config Editors or Simulation Dashboard */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Module View Tab Toggle */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={() => { setActiveTab('telemetry'); setSimRunning(false); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'telemetry' ? '3px solid var(--color-primary)' : '3px solid transparent',
                  color: activeTab === 'telemetry' ? '#fff' : 'var(--color-text-muted)',
                  padding: isMobile ? '8px 12px' : '12px 25px',
                  fontFamily: 'var(--font-display)',
                  fontSize: isMobile ? '0.7rem' : '0.85rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {isMobile ? 'TELEMETRY' : 'MATHEMATICAL TELEMETRY CHARTS'}
              </button>
              <button
                onClick={() => setActiveTab('simulation')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'simulation' ? '3px solid var(--color-primary)' : '3px solid transparent',
                  color: activeTab === 'simulation' ? '#fff' : 'var(--color-text-muted)',
                  padding: isMobile ? '8px 12px' : '12px 25px',
                  fontFamily: 'var(--font-display)',
                  fontSize: isMobile ? '0.7rem' : '0.85rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {isMobile ? 'SIMULATOR' : 'REAL-TIME DRIVETRAIN SIMULATOR'}
              </button>
            </div>

            {/* TAB 1: TELEMETRY CHARTS */}
            {activeTab === 'telemetry' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }} className="journal-dashboard">
                  {/* Chart 1: Matching Points */}
                  <div
                    className="f1-card"
                    style={{ padding: '20px', cursor: 'pointer' }}
                    onClick={() => setZoomedChart('matching')}
                  >
                    <div className="f1-timing-box" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <span>TELEMETRY_STREAM // COUPLING MATCH POINTS</span>
                      <span style={{ color: 'var(--color-secondary)', fontSize: '0.7rem' }}>[🔎 CLICK TO ZOOM]</span>
                    </div>
                    <div style={{ height: isMobile ? '240px' : '310px' }} onClick={(e) => e.stopPropagation()}>
                      {renderMatchingChart()}
                    </div>
                    {isMobile && matchingHover && (
                      <div style={{
                        marginTop: '10px',
                        background: '#0e1014',
                        padding: '10px',
                        borderRadius: '2px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        borderLeft: '2px solid var(--color-primary)'
                      }}>
                        <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}>TELEMETRY AT {matchingHover.rpm} RPM:</div>
                        <div>Engine Torque: <span style={{ color: 'var(--color-primary)' }}>{matchingHover.tEngine} Nm</span></div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginTop: '4px', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                          {matchingHover.tConverters.map((c, i) => (
                            <div key={i}>SR {c.sr.toFixed(1)}: {c.torque} Nm</div>
                          ))}
                        </div>
                      </div>
                    )}
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '10px', lineHeight: 1.4 }}>
                      Plots the Engine Torque output against the converter impeller torque absorption (Ti) for different Speed Ratios (SR). The intersection points show where the engine will stabilize at steady state for that speed ratio.
                    </p>
                  </div>

                  {/* Chart 2: TR and Efficiency curves */}
                  <div
                    className="f1-card"
                    style={{ padding: '20px', cursor: 'pointer' }}
                    onClick={() => setZoomedChart('ratios')}
                  >
                    <div className="f1-timing-box" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <span>TELEMETRY_STREAM // RATIO & EFFICIENCY CURVES</span>
                      <span style={{ color: 'var(--color-secondary)', fontSize: '0.7rem' }}>[🔎 CLICK TO ZOOM]</span>
                    </div>
                    <div style={{ height: isMobile ? '240px' : '310px' }} onClick={(e) => e.stopPropagation()}>
                      {renderRatiosChart()}
                    </div>
                    {isMobile && ratiosHover && (
                      <div style={{
                        marginTop: '10px',
                        background: '#0e1014',
                        padding: '10px',
                        borderRadius: '2px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        borderLeft: '2px solid var(--color-secondary)'
                      }}>
                        <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}>TELEMETRY AT SR {ratiosHover.sr.toFixed(3)}:</div>
                        <div>Torque Ratio: <span style={{ color: 'var(--color-secondary)' }}>{ratiosHover.tr.toFixed(2)}x</span></div>
                        <div>Efficiency: <span style={{ color: 'var(--color-telemetry-blue)' }}>{(ratiosHover.eff * 100).toFixed(1)}%</span></div>
                      </div>
                    )}
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '10px', lineHeight: 1.4 }}>
                      Shows the Torque Ratio (TR) multiplication factor and hydrodynamic coupling efficiency vs. Speed Ratio (SR). High stall torque multiplication degrades to 1.0 (coupling point) as turbine speed approaches impeller speed.
                    </p>
                  </div>
                </div>

                {/* Engine Curve Editor & Converter Details Table */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }} className="journal-dashboard">
                  
                  {/* Engine Points Editor */}
                  <div style={{ background: 'var(--color-surface)', border: '1px solid rgba(255,255,255,0.04)', padding: '25px', borderRadius: '4px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '15px', color: '#fff', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '10px' }} className="f1-mono-text">
                      ENGINE CURVE COORDINATES
                    </h3>
                    
                    <div style={{ maxHeight: '180px', overflowY: 'auto', marginBottom: '15px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        <thead>
                          <tr style={{ background: '#0e1014', color: '#fff', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '8px' }}>ENGINE RPM</th>
                            <th style={{ padding: '8px' }}>TORQUE (NM)</th>
                            <th style={{ padding: '8px', textAlign: 'center' }}>REMOVE</th>
                          </tr>
                        </thead>
                        <tbody>
                          {engineCurve.map((point, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                              <td style={{ padding: '8px', color: '#fff' }}>{point.rpm} RPM</td>
                              <td style={{ padding: '8px', color: 'var(--color-secondary)' }}>{point.torque} Nm</td>
                              <td style={{ padding: '8px', textAlign: 'center' }}>
                                <button
                                  onClick={() => handleRemovePoint(index)}
                                  disabled={engineCurve.length <= 2}
                                  style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.85rem' }}
                                >
                                  ✖
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <form onSubmit={handleAddPoint} style={{ display: 'flex', gap: '10px', alignItems: 'end' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--color-text-muted)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>RPM</label>
                        <input
                          type="number"
                          placeholder="e.g. 5000"
                          value={editRpm}
                          onChange={(e) => setEditRpm(e.target.value)}
                          style={{ width: '100%', padding: '6px', background: '#0e1014', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--color-text-muted)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>TORQUE (NM)</label>
                        <input
                          type="number"
                          placeholder="e.g. 600"
                          value={editTorque}
                          onChange={(e) => setEditTorque(e.target.value)}
                          style={{ width: '100%', padding: '6px', background: '#0e1014', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}
                        />
                      </div>
                      <button
                        type="submit"
                        style={{
                          background: 'var(--color-secondary)',
                          border: 'none',
                          color: '#000',
                          padding: '6px 15px',
                          fontWeight: 'bold',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        ADD
                      </button>
                    </form>
                  </div>

                  {/* Converter Physics Specs */}
                  <div style={{ background: 'var(--color-surface)', border: '1px solid rgba(255,255,255,0.04)', padding: '25px', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <h3 style={{ fontSize: '1rem', color: '#fff', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '10px' }} className="f1-mono-text">
                      CONVERTER PARAMETERS
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.8rem' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontFamily: 'var(--font-mono)' }}>
                          <span>STALL TORQUE RATIO (TR0):</span>
                          <span style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}>{tr0.toFixed(2)}x</span>
                        </div>
                        <input
                          type="range"
                          min="1.5"
                          max="3.0"
                          step="0.05"
                          value={tr0}
                          onChange={(e) => setTr0(parseFloat(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                        />
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontFamily: 'var(--font-mono)' }}>
                          <span>STALL CAPACITY COEFFICIENT (Ci0):</span>
                          <span style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}>{ci0.toFixed(1)} Nm/kRPM²</span>
                        </div>
                        <input
                          type="range"
                          min="1.0"
                          max="150.0"
                          step="0.5"
                          value={ci0}
                          onChange={(e) => setCi0(parseFloat(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                        />
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontFamily: 'var(--font-mono)' }}>
                          <span>COUPLING SLIP POINT (CP):</span>
                          <span style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}>SR = {couplingPoint.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="0.70"
                          max="0.95"
                          step="0.01"
                          value={couplingPoint}
                          onChange={(e) => setCouplingPoint(parseFloat(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 2: REAL-TIME SIMULATOR */}
            {activeTab === 'simulation' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Simulator controls */}
                <div style={{ background: 'var(--color-surface)', border: '1px solid rgba(255,255,255,0.04)', padding: '25px', borderRadius: '4px' }}>
                  
                  {/* F1 HUD Title & Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                    <span className="f1-mono-text" style={{ fontSize: '0.9rem', color: '#fff' }}>SIMULATOR_TELEMETRY // LIVE PADDOCK SYSTEM</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <button
                        onClick={handleResetSim}
                        style={{
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff',
                          padding: '4px 12px',
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-mono)',
                          cursor: 'pointer',
                        }}
                      >
                        RESET VEHICLE
                      </button>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span className={`f1-led-light ${simRunning ? 'f1-led-green' : 'f1-led-red'}`} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{simRunning ? 'SOLVER ACTIVE' : 'STANDBY'}</span>
                      </div>
                    </div>
                  </div>

                  {renderShiftLights()}

                  {/* Dynamic cluster dials */}
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '10px' : '15px', marginBottom: '25px' }} className="journal-dashboard">
                    
                    <div style={{ background: '#0e1014', borderLeft: '3px solid var(--color-primary)', padding: '12px 15px', borderRadius: '2px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>ENGINE SPEED</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#fff', fontWeight: 'bold' }}>{Math.round(simEngineRpm)}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>RPM</span>
                    </div>

                    <div style={{ background: '#0e1014', borderLeft: '3px solid var(--color-telemetry-blue)', padding: '12px 15px', borderRadius: '2px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>TURBINE SPEED</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#fff', fontWeight: 'bold' }}>{Math.round(simTurbineRpm)}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>RPM (SR: {simSlipRatio.toFixed(2)})</span>
                    </div>

                    <div style={{ background: '#0e1014', borderLeft: '3px solid var(--color-secondary)', padding: '12px 15px', borderRadius: '2px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>VEHICLE SPEED</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#fff', fontWeight: 'bold' }}>{simSpeed.toFixed(1)}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>KM/H</span>
                    </div>

                    <div style={{ background: '#0e1014', borderLeft: `3px solid ${simLockupActive ? 'var(--color-secondary)' : '#666'}`, padding: '12px 15px', borderRadius: '2px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>CONVERTER STATE</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: simLockupActive ? 'var(--color-secondary)' : '#fff', fontWeight: 'bold', display: 'block', marginTop: '4px' }}>
                        {simLockupActive ? '🔒 LOCKED CLUTCH' : `⚡ MULTIPLY: ${simTorqueRatio.toFixed(2)}x`}
                      </span>
                    </div>

                  </div>

                  {/* Simulator Controls & Pedals */}
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '15px' : '30px', marginBottom: '20px' }} className="journal-dashboard">
                    
                    {/* Throttle (Gas Pedal) */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '8px' }}>
                        <span style={{ color: 'var(--color-secondary)' }}>🏁 ACCELERATOR PEDAL (THROTTLE):</span>
                        <span style={{ color: '#fff', fontWeight: 'bold' }}>{simThrottle}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={simThrottle}
                        onChange={(e) => {
                          setSimThrottle(parseInt(e.target.value));
                          if (parseInt(e.target.value) > 0 && !simRunning) {
                            setSimRunning(true);
                            setSimBrake(0);
                          }
                        }}
                        style={{ width: '100%', accentColor: 'var(--color-secondary)', height: '10px' }}
                      />
                    </div>

                    {/* Brake Pedal */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '8px' }}>
                        <span style={{ color: 'var(--color-primary)' }}>🛑 SERVICE BRAKE PRESSURE:</span>
                        <span style={{ color: '#fff', fontWeight: 'bold' }}>{simBrake}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={simBrake}
                        onChange={(e) => {
                          setSimBrake(parseInt(e.target.value));
                          if (parseInt(e.target.value) > 20) {
                            setSimThrottle(0); // Cut throttle on heavy braking
                          }
                        }}
                        style={{ width: '100%', accentColor: 'var(--color-primary)', height: '10px' }}
                      />
                    </div>

                  </div>

                  {/* Gearbox & Launch Configuration */}
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '20px' : '35px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }} className="journal-dashboard">
                    
                    {/* Shift Controls */}
                    <div>
                      <span className="f1-mono-text" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '10px' }}>TRANSMISSION CONTROLLER</span>
                      
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                        <button
                          onClick={() => setSimAutoShift(!simAutoShift)}
                          style={{
                            background: simAutoShift ? 'var(--color-secondary)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${simAutoShift ? 'var(--color-secondary)' : 'rgba(255,255,255,0.15)'}`,
                            color: simAutoShift ? '#000' : '#fff',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            padding: '6px 12px',
                            cursor: 'pointer',
                          }}
                        >
                          AUTO SHIFT: {simAutoShift ? 'ON' : 'OFF'}
                        </button>
                        
                        {!simAutoShift && (
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button
                              disabled={simGear === 0}
                              onClick={() => {
                                const state = simStateRef.current;
                                if (state.gear > 0) {
                                  state.gear -= 1;
                                  setSimGear(state.gear);
                                }
                              }}
                              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 10px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', cursor: 'pointer' }}
                            >
                              DOWN
                            </button>
                            <button
                              disabled={simGear === GEAR_RATIOS.length - 1}
                              onClick={() => {
                                const state = simStateRef.current;
                                if (state.gear < GEAR_RATIOS.length - 1) {
                                  state.gear += 1;
                                  setSimGear(state.gear);
                                }
                              }}
                              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 10px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', cursor: 'pointer' }}
                            >
                              UP
                            </button>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        {GEAR_RATIOS.map((ratio, i) => (
                          <div
                            key={i}
                            style={{
                              width: '30px',
                              height: '25px',
                              border: `1px solid ${simGear === i ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)'}`,
                              background: simGear === i ? 'var(--color-primary)' : '#0e1014',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontFamily: 'var(--font-display)',
                              fontSize: '0.8rem',
                              borderRadius: '2px',
                            }}
                          >
                            G{i + 1}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Launch / Setup Parameters */}
                    <div>
                      <span className="f1-mono-text" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '10px' }}>VEHICLE MASS & LOCKUP OPTIONS</span>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                          <span>VEHICLE MASS:</span>
                          <span style={{ color: 'var(--color-secondary)' }}>{vehicleMass} kg</span>
                        </div>
                        <input
                          type="range"
                          min="500"
                          max="5000"
                          step="100"
                          value={vehicleMass}
                          onChange={(e) => setVehicleMass(parseInt(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--color-secondary)' }}
                        />

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#fff', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={lockupEnabled}
                              onChange={(e) => setLockupEnabled(e.target.checked)}
                              style={{ accentColor: 'var(--color-primary)' }}
                            />
                            ENABLE LOCKUP CLUTCH (ON CP REACH)
                          </label>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

                {/* Simulation diagnostics */}
                <div style={{ background: 'var(--color-surface)', border: '1px solid rgba(255,255,255,0.04)', padding: '25px', borderRadius: '4px' }}>
                  <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '15px', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '10px' }} className="f1-mono-text">
                    LIVE SYSTEM POWER DIAGNOSTICS
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '10px' : '20px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '5px 0' }}>
                        <span>ENGINE TORQUE OUTPUT:</span>
                        <span style={{ color: 'var(--color-primary)' }}>{simEngineTorque.toFixed(1)} Nm</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '5px 0' }}>
                        <span>TURBINE TORQUE MULTIPLIED:</span>
                        <span style={{ color: 'var(--color-secondary)' }}>{simTurbineTorque.toFixed(1)} Nm</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '5px 0' }}>
                        <span>TRACTIVE FORCE (AT TIRE):</span>
                        <span style={{ color: 'var(--color-telemetry-blue)' }}>{simTractiveForce.toFixed(0)} N</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '5px 0' }}>
                        <span>COUPLED SLIPPAGE (SLIP):</span>
                        <span style={{ color: '#fff' }}>{((1 - simSlipRatio) * 100).toFixed(1)}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '5px 0' }}>
                        <span>COUPLING EFFICIENCY (HYDRO):</span>
                        <span style={{ color: 'var(--color-secondary)' }}>{(simSlipRatio * simTorqueRatio * 100).toFixed(1)}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '5px 0' }}>
                        <span>lockup status:</span>
                        <span style={{ color: simLockupActive ? 'var(--color-secondary)' : '#666', fontWeight: 'bold' }}>
                          {simLockupActive ? 'ENGAGED' : 'UNLOCKED'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Right Block: Engineering Theory Notes & Calibration Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* HUD Status box */}
            <div style={{
              background: '#0e1014',
              padding: '20px',
              border: '1px solid rgba(255,255,255,0.02)',
              borderRadius: '2px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>CALIBRATION_LAB</span>
                <span style={{ color: 'var(--color-secondary)' }}>SYNCHRONIZED</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>SOLVER_ENGINE</span>
                <span>BISECTION GRID SEARCH</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>INTEGRATION_RATE</span>
                <span>60 HZ REAL-TIME</span>
              </div>
              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.05)', margin: '5px 0' }} />
              <div style={{ fontSize: '0.7rem', color: '#666', lineHeight: 1.3 }}>
                Solver correlates engine curves with fluid shear characteristics. Presets load matching weights used in GT-Suite validation.
              </div>
            </div>

            {/* Scientific Theory / Educational Panel */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid rgba(255,255,255,0.04)', padding: '25px', borderRadius: '4px' }}>
              <h3 style={{ fontSize: '0.9rem', marginBottom: '15px', color: '#fff' }} className="f1-mono-text">
                THE PHYSICS OF MATCHING
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                <p>
                  A torque converter matches the power output of an internal combustion engine to the load demands of the wheels by shear forces in transmission fluid.
                </p>
                <div>
                  <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>1. Capacity Coefficient (Ci)</strong>
                  Co-relates how much torque the converter impeller absorbs at a given speed. Governed by:
                  <div style={{ fontStyle: 'italic', color: '#fff', background: '#0e1014', padding: '6px', textAlign: 'center', margin: '5px 0', fontFamily: 'var(--font-mono)' }}>
                    Ti = Ci(SR) * (Ni / 1000)²
                  </div>
                  Higher Ci coefficients represent "tight" converters (e.g. industrial/heavy-duty), while lower values create "loose" performance stall speeds.
                </div>
                <div>
                  <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>2. Torque Multiplication (TR)</strong>
                  At low speed ratios ($SR &lt; CP$), stator vanes redirect fluid to assist the impeller, creating torque multiplication (up to {tr0}x at stall in your configuration).
                </div>
                <div>
                  <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>3. The Coupling Point (CP)</strong>
                  The speed ratio where the stator begins freewheeling. Beyond this point, the converter behaves like a fluid coupling with $TR = 1.0$, prompting lockup clutch engagement to maximize fuel economy and eliminate hydrodynamic heat losses.
                </div>
              </div>
            </div>


          </div>

        </div>

      </div>

      {/* Zoom Modal */}
      {zoomedChart && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(5, 5, 8, 0.95)',
            backdropFilter: 'blur(16px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setZoomedChart(null)}
        >
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '4px',
              padding: isMobile ? '15px' : '25px',
              width: '95%',
              maxWidth: '850px',
              position: 'relative',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
              <div className="f1-timing-box">
                {zoomedChart === 'matching' ? 'DETAILED_ANALYSIS // COUPLING MATCH POINTS' : 'DETAILED_ANALYSIS // RATIO & EFFICIENCY CURVES'}
              </div>
              <button
                onClick={() => setZoomedChart(null)}
                style={{
                  background: 'var(--color-primary)',
                  border: 'none',
                  color: '#fff',
                  padding: '6px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transform: 'skewX(-10deg)',
                }}
              >
                <span style={{ transform: 'skewX(10deg)', display: 'block' }}>CLOSE [ESC]</span>
              </button>
            </div>
            <div style={{ width: '100%', height: isMobile ? '240px' : '500px', background: '#08090b', borderRadius: '4px', padding: '10px' }}>
              {zoomedChart === 'matching' ? renderMatchingChart() : renderRatiosChart()}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
              💡 <strong>Interactive Telemetry</strong>: Hover your cursor across the chart area to inspect dynamic calculated parameters and torque intersections.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TorqueConverter;
