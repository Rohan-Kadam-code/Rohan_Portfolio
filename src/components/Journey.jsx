import React, { useState, useEffect, useRef } from 'react';
import RevealOnScroll from './RevealOnScroll';
import GlitchText from './GlitchText';

const Journey = () => {
    const [activeGp, setActiveGp] = useState(3); // Default to Cognizant (active/latest)
    const [activeTurnIdx, setActiveTurnIdx] = useState(0);
    const [showFinish, setShowFinish] = useState(false);
    const [carPos, setCarPos] = useState({ x: 50, y: 250, angle: 0 });
    const [currentProgress, setCurrentProgress] = useState(0.08);
    const [isMobile, setIsMobile] = useState(false);
    const [pathLength, setPathLength] = useState(1000);
    const [nodeCoords, setNodeCoords] = useState([]);

    const trackRef = useRef(null);
    const animRef = useRef(null);

    const gps = [
        {
            id: 0,
            name: "VELOCE RACING GP",
            company: "Veloce Racing",
            role: "Brake Systems Design",
            year: "Test Lap",
            compound: "SOFT",
            compoundColor: "#E10600",
            isFinished: true,
            finishYear: "2018–2019",
            raceResult: "P1 — Formula Student",
            takeaways: [
                { title: "HYDRAULIC MASTERY", desc: "Designed closed-loop brake circuits with transducers; validated against live telemetry, gaining foundational simulation-to-hardware pipeline skills." },
                { title: "FEA THERMAL ANALYSIS", desc: "Ran ANSYS thermal stress sweeps on ventilated rotors under race-duty cycles — first hands-on FEA experience." },
                { title: "SYSTEMS THINKING", desc: "Balance bar optimization introduced multi-system constraint thinking: kinematics, force distribution, and safety margins." },
            ],
            trackPath: "M 250,260 L 150,260 L 140,250 L 135,265 L 125,260 C 105,280 85,270 70,220 L 60,150 L 68,146 L 68,138 L 55,135 L 55,60 C 55,45 65,35 85,40 C 100,43 110,50 125,65 L 180,160 C 170,170 165,178 180,182 C 190,185 200,185 220,185 L 260,185 C 290,185 300,260 250,260 Z",
            startLine: { x1: 240, y1: 250, x2: 240, y2: 270 },
            turns: [
                {
                    pct: 0.14,
                    name: "T1 RETTIFILO",
                    activity: "Hydraulic Brake Circuits",
                    speed: "285 km/h",
                    gear: "G6",
                    status: "SIM_COMPLETE",
                    bullets: [
                        "Designed hydraulic control loops with integrated pressure/travel transducers for Formula Student chassis.",
                        "Optimized brake balance bar assembly ratios based on real-time track deceleration logs.",
                        "Performed 3D FEA thermal stress simulations on ventilated brake rotors in ANSYS under high duty cycles."
                    ]
                },
                {
                    pct: 0.54,
                    name: "T2 LESMO",
                    activity: "FEA Rotor Thermal Stress",
                    speed: "165 km/h",
                    gear: "G3",
                    status: "CALIBRATION_OK",
                    bullets: [
                        "Calculated thermal boundary coefficients based on kinetic energy dissipation rates.",
                        "Conducted mesh convergence sweeps on high-stress ventilated rotor channels.",
                        "Validated simulation results against thermocouple telemetry logged during track tests."
                    ]
                },
                {
                    pct: 0.90,
                    name: "T3 PARABOLICA",
                    activity: "Brake Balance Bar Alignment",
                    speed: "312 km/h",
                    gear: "G7",
                    status: "SYSTEM_OK",
                    bullets: [
                        "Optimized balance bar linkage geometries to prevent premature front axle lockup under braking.",
                        "Developed kinematic models representing force distributions across brake pedal strokes."
                    ]
                }
            ]
        },
        {
            id: 1,
            name: "TATA TECH GP",
            company: "TATA Technologies",
            role: "Powertrain Design Lead",
            year: "Lap 1 • 2019–2023",
            compound: "MEDIUM",
            compoundColor: "#FFCC00",
            isFinished: true,
            finishYear: "2019–2023",
            raceResult: "P1 — 3.5 Years, 12 Platforms",
            takeaways: [
                { title: "POWERTRAIN DESIGN & ARCHITECTURE", desc: "Selected transmissions/axles and matched 50+ powertrain combinations." },
                { title: "CAD & VEHICLE PACKAGING", desc: "Designed mounting brackets, and packaged complex cooling systems, exhaust routings, and air intakes with innovative designs." },
                { title: "EMBEDDED IoT INTEGRATION", desc: "Co-engineered CAN bus telematics architectures, DTC definitions, and cloud-linked vehicle health monitoring pipelines." },
            ],
            trackPath: "M 125.4 162.9 C 127.0 160.8 128.9 157.6 132.8 157.1 C 140.2 156.0 144.7 157.9 151.9 158.9 C 160.7 160.2 165.5 158.7 170.1 155.2 C 178.8 148.5 185.3 143.3 191.1 138.5 C 195.0 135.2 198.2 137.7 198.8 140.1 C 199.6 143.4 200.3 146.3 202.6 153.6 C 203.5 156.5 207.7 157.6 209.4 153.9 C 212.2 148.1 212.9 145.3 213.7 142.0 C 216.8 129.7 213.3 126.7 212.2 125.6 C 195.9 111.2 146.4 66.4 142.3 62.7 C 136.9 57.7 126.9 60.3 126.4 65.4 C 126.0 70.5 125.9 72.1 125.7 75.2 C 125.6 77.0 121.8 84.8 114.4 82.1 C 106.7 79.3 110.1 70.9 110.4 70.3 C 114.4 62.8 118.9 54.4 121.6 50.1 C 126.8 41.8 135.6 36.4 143.1 35.7 C 153.4 34.7 184.6 32.0 200.6 30.6 C 202.1 30.5 203.6 30.4 204.8 30.3 C 209.1 30.0 216.5 32.9 218.4 39.3 C 222.8 54.4 225.4 63.0 226.2 76.0 C 226.8 87.8 227.5 99.1 227.6 103.1 C 227.7 108.0 228.6 110.4 232.8 116.5 C 233.2 117.1 233.6 117.7 234.1 118.3 C 235.3 120.0 235.9 122.3 234.0 127.3 C 231.9 132.7 228.8 138.4 229.0 143.5 C 229.3 150.3 231.3 151.0 234.1 154.2 C 239.5 160.7 238.0 168.2 231.6 172.0 C 229.2 173.4 226.9 174.7 224.8 176.0 C 219.7 179.0 217.5 181.1 214.9 186.5 C 207.8 200.9 169.2 269.6 161.0 280.7 C 154.1 290.0 140.0 286.5 137.2 277.1 C 136.4 274.6 128.3 260.6 126.0 258.4 C 120.4 253.2 116.9 249.5 115.0 246.9 C 113.1 244.3 110.8 241.8 107.4 237.4 C 105.9 235.5 103.8 234.7 101.6 237.0 C 99.8 238.9 98.7 240.2 97.6 240.9 C 96.2 241.9 93.0 241.9 91.3 239.8 C 90.3 238.7 85.4 232.9 83.6 227.8 C 81.4 221.9 80.5 221.2 86.7 213.1 C 92.7 205.2 115.1 176.2 118.9 171.4 C 120.5 169.5 122.9 166.3 125.4 162.9 Z",
            startLine: { x1: 125, y1: 153, x2: 125, y2: 173 },
            turns: [
                {
                    pct: 0.35,
                    name: "T1 COPSE",
                    activity: "Powertrain Sizing & Calibration",
                    speed: "310 km/h",
                    gear: "G7",
                    status: "VALIDATED",
                    bullets: [
                        "Conducted Engine, transmission and axle selection, sizing and matching 50+ combinations using virtual road simulation duty cycles.",
                        "Configured torque curves and gear ratios to maximize tractive efforts for heavy duty industrial platforms.",
                        "Benchmarked mechanical powertrain losses against competitor systems to optimize baseline efficiencies."
                    ]
                },
                {
                    pct: 0.48,
                    name: "T2 BECKETTS S-CURVES",
                    activity: "ROI & Benchmarking Matrices",
                    speed: "225 km/h",
                    gear: "G5",
                    status: "SIGN_OFF_OK",
                    bullets: [
                        "Formulated technical ROI matrices comparing ICE, and fully electrified powertrain platforms.",
                        "Presented design recommendations to executive panels, securing approvals for prototype trials."
                    ]
                },
                {
                    pct: 0.60,
                    name: "T3 STOWE",
                    activity: "On-site Calibration & Validation",
                    speed: "295 km/h",
                    gear: "G6",
                    status: "PASS_GATE_C",
                    bullets: [
                        "Conducted functional test check-outs on prototype vehicles, validating system integration contracts.",
                        "Drafted system interface specifications documenting electrical, mechanical, and safety boundaries."
                    ]
                },
                {
                    pct: 0.72,
                    name: "T4 VALE",
                    activity: "CAD Component Design & Packaging",
                    speed: "135 km/h",
                    gear: "G2",
                    status: "DESIGN_RELEASED",
                    bullets: [
                        "Designed mounting brackets and structural chassis elements using CAD modeling tools.",
                        "Integrated and packaged cooling systems, exhaust tracks, and air intakes with innovative routing designs.",
                        "Conducted clearance and interference analysis to guarantee integration packaging compliance."
                    ]
                },
                {
                    pct: 0.82,
                    name: "T5 CLUB",
                    activity: "IoT & Telematics Integration",
                    speed: "185 km/h",
                    gear: "G4",
                    status: "LIVE_STREAMING",
                    bullets: [
                        "Co-engineered CAN database architectures for transmitting telematics packets to cloud portals.",
                        "Defined diagnostic trouble codes (DTCs) and reporting triggers to monitor vehicle health."
                    ]
                }
            ]
        },
        {
            id: 2,
            name: "MAHINDRA GP",
            company: "Mahindra & Mahindra",
            role: "Thermal Systems Architecture",
            year: "Lap 2 • 2023–2024",
            compound: "HARD",
            compoundColor: "#FFFFFF",
            isFinished: true,
            finishYear: "2023–2024",
            raceResult: "P2 — ASIL-C Homologated",
            takeaways: [
                { title: "FULL-STACK THERMAL CFD", desc: "End-to-end thermal design from 1D GT-Suite system modelling to 3D CFD optimisation of coolant circuits for BS6 diesel platforms." },
                { title: "ISO 26262 ASIL-C SAFETY", desc: "Owned accelerator pedal ASIL-C safety case from concept through injection moulding — complete functional safety lifecycle exposure." },
                { title: "APQP & GATEWAY SIGN-OFF", desc: "Drove PPAP dossiers, DFMEA reviews, and gateway milestone tracking — built rigorous automotive production quality mindset." },
            ],
            trackPath: "M 135.3 250.4 C 132.2 248.1 124.5 242.4 118.1 251.3 C 115.1 255.6 108.8 265.9 105.2 271.6 C 101.1 277.9 96.5 273.6 83.8 264.2 C 78.5 260.2 79.9 252.2 80.6 249.2 C 84.3 235.3 91.0 227.1 97.8 221.2 S 114.2 208.4 125.7 204.4 C 137.2 200.3 140.7 196.9 143.9 191.1 C 152.8 174.7 157.2 167.5 156.2 159.4 C 155.3 151.4 145.7 135.4 143.7 128.4 C 142.3 123.3 141.1 110.3 140.8 99.5 C 140.8 97.6 140.5 95.5 144.2 96.1 C 150.1 96.9 148.5 92.1 147.6 90.9 C 143.3 84.6 141.4 81.6 137.8 75.3 C 134.0 68.5 116.1 36.0 114.9 33.9 C 113.2 30.9 114.7 30.0 116.7 31.1 C 118.7 32.2 143.9 48.1 147.3 50.4 C 150.7 52.7 153.1 55.3 155.2 57.7 C 158.6 61.6 171.2 76.8 173.8 79.8 C 175.1 81.3 176.5 82.7 178.7 83.4 C 179.1 83.5 179.6 83.6 180.1 83.7 C 181.8 84.0 185.4 85.1 187.8 89.1 C 190.6 93.7 190.9 95.6 190.4 101.2 C 190.1 104.5 190.5 107.6 191.6 109.3 C 194.4 113.3 200.3 121.7 204.3 127.2 C 209.1 133.8 213.6 143.1 215.4 149.3 S 238.3 228.8 239.3 233.1 C 240.4 237.5 241.5 238.5 236.3 241.6 C 233.8 243.0 231.7 245.1 232.6 249.2 C 233.3 252.2 237.9 263.7 233.1 267.1 C 231.9 267.9 206.4 285.1 201.7 288.1 C 198.8 290.0 194.9 288.6 193.3 285.9 C 191.7 283.2 191.4 279.5 195.6 277.2 C 198.8 275.3 200.7 274.3 209.7 268.9 C 211.9 267.6 213.1 264.7 211.5 261.0 C 210.0 257.7 207.3 249.6 206.0 245.8 C 202.9 237.1 200.2 219.2 198.1 207.8 C 197.3 203.1 194.1 198.5 187.6 197.9 C 186.1 197.7 181.4 197.4 177.3 197.6 C 173.2 197.7 165.8 200.2 162.0 210.1 C 159.3 217.4 153.5 232.1 148.9 244.4 C 145.2 254.0 136.6 251.4 135.3 250.4 Z",
            startLine: { x1: 130, y1: 240, x2: 130, y2: 260 },
            turns: [
                {
                    pct: 0.08,
                    name: "T1 LA SOURCE",
                    activity: "1D/3D CFD Thermal Design",
                    speed: "318 km/h",
                    gear: "G7",
                    status: "CFD_OPTIMIZED",
                    bullets: [
                        "Architected coolant circuit layouts and heat exchanger sizing parameters for high-performance diesel platforms.",
                        "Conducted transient thermal simulations in GT-Suite to optimize component sizing and coolant flows."
                    ]
                },
                {
                    pct: 0.20,
                    name: "T2 EAU ROUGE",
                    activity: "Wind Tunnel & Sensor Rigs",
                    speed: "332 km/h",
                    gear: "G8",
                    status: "TUNNEL_PASS",
                    bullets: [
                        "Led wind tunnel verification trials using high-density thermocouple grids and hot-wire anemometer rigs.",
                        "Acquired and post-processed aerodynamic telemetry logs to refine radiator scoop cooling layouts."
                    ]
                },
                {
                    pct: 0.76,
                    name: "T3 POUHON",
                    activity: "ASIL-C Accelerator Module",
                    speed: "245 km/h",
                    gear: "G5",
                    status: "ASIL_C_SIGN",
                    bullets: [
                        "Owned accelerator pedal assembly design from packaging concepts through injection mold tooling.",
                        "Prepared system safety cases demonstrating compliance to ASIL-C functional safety requirements."
                    ]
                },
                {
                    pct: 0.83,
                    name: "T4 STAVELOT",
                    activity: "APQP, DFMEA & Quality Signoffs",
                    speed: "298 km/h",
                    gear: "G6",
                    status: "GATEWAY_5_PASS",
                    bullets: [
                        "Facilitated design review workshops to compile PPAP dossiers and DFMEA risk assessments.",
                        "Drove corrective actions tracking prototype issues to meet vehicle production milestones."
                    ]
                },
                {
                    pct: 0.98,
                    name: "T5 BUS STOP",
                    activity: "CAN Modulation Fan Controls",
                    speed: "120 km/h",
                    gear: "G2",
                    status: "DUTY_CYCLE_OK",
                    bullets: [
                        "Designed speed modulation logic utilizing CAN bus signals to adjust fan duty cycles dynamically."
                    ]
                }
            ]
        },
        {
            id: 3,
            name: "COGNIZANT GP",
            company: "Cognizant (Stellantis)",
            role: "Feature Owner — Range & Powerflow",
            year: "Lap 3 • 2024–Present",
            compound: "SOFT",
            compoundColor: "#E10600",
            isFinished: false, // Still in progress!
            trackPath: "M 136.2 198.0 S 147.7 203.2 150.9 204.2 C 154.1 205.1 159.8 207.2 168.4 207.1 C 177.0 207.0 192.5 206.1 201.3 203.0 C 210.0 200.0 237.5 190.9 245.3 187.6 S 269.0 176.7 272.3 174.6 C 274.3 173.3 275.6 172.6 275.7 170.7 C 275.8 168.9 272.7 166.8 271.2 166.1 C 269.6 165.4 268.5 165.0 266.5 163.4 C 264.4 161.6 263.4 159.7 263.4 157.5 C 263.4 153.5 266.2 150.6 269.5 150.5 C 271.6 150.4 278.0 150.6 279.8 150.3 C 281.6 149.9 284.2 149.0 285.6 146.9 S 288.6 141.6 289.1 140.9 C 290.0 139.6 289.7 138.8 288.2 138.1 C 286.6 137.4 285.7 136.3 286.5 134.1 C 287.3 132.0 288.8 126.1 289.1 124.5 C 289.3 123.0 288.9 121.1 286.7 121.1 C 283.9 121.1 215.1 118.6 206.6 118.4 C 197.9 118.2 79.8 113.8 65.9 113.0 C 61.5 112.8 60.5 115.3 60.8 116.6 C 61.3 119.1 67.5 123.0 71.3 125.2 C 75.1 127.4 76.5 127.9 81.0 128.1 C 85.5 128.3 88.2 127.0 90.7 125.5 S 98.4 121.1 104.5 119.8 C 108.9 118.8 116.8 119.0 119.9 119.5 C 124.2 120.1 128.5 121.9 132.4 124.1 C 136.3 126.2 161.7 140.7 161.7 140.7 S 184.6 153.7 188.3 155.7 C 192.0 157.8 194.2 160.1 194.1 161.7 C 194.0 163.2 192.4 165.2 190.7 166.3 C 189.0 167.3 186.1 168.7 184.9 170.3 C 183.7 171.8 182.8 173.0 182.7 176.9 S 182.6 183.9 181.7 186.2 C 181.0 188.1 178.6 192.5 170.1 195.4 C 161.8 198.2 159.3 197.5 152.4 197.3 C 146.1 197.2 139.9 193.8 139.9 193.8 S 107.4 175.9 104.3 174.2 C 101.1 172.4 96.1 171.5 92.0 172.4 C 87.8 173.3 86.7 174.2 84.3 175.9 C 82.3 177.3 79.4 179.5 76.7 179.8 C 74.0 180.1 70.6 179.9 67.9 178.8 C 65.4 177.7 62.2 174.4 60.6 172.8 S 55.7 169.0 50.9 168.9 C 47.0 168.8 38.5 169.7 33.5 175.4 C 31.5 177.7 30.0 179.5 30.0 184.0 C 30.0 187.3 33.1 191.8 36.2 191.8 C 42.3 191.9 40.8 191.1 45.5 190.9 C 51.3 190.7 53.8 191.3 57.0 192.5 C 60.2 193.7 69.2 195.9 74.0 195.9 C 80.3 196.0 118.5 195.2 121.0 195.2 C 127.3 195.2 132.4 196.4 136.2 198.0 Z",
            startLine: { x1: 130, y1: 188, x2: 130, y2: 208 },
            turns: [
                {
                    pct: 0.09,
                    name: "T1 HARD ROCK BEND",
                    activity: "Range & Powerflow Feature Owner",
                    speed: "342 km/h",
                    gear: "G8",
                    status: "DRS_ACTIVE",
                    bullets: [
                        "Feature owner for Range Estimation algorithms, managing full block lifecycle requirements.",
                        "Authoring system requirements packages within DOORS Next Gen with complete traceability loops.",
                        "Driving cross-functional issue resolutions across powertrain control and vehicle integration teams."
                    ]
                },
                {
                    pct: 0.25,
                    name: "T2 BEACH STRAIGHT",
                    activity: "DOORS Traceability Matrices",
                    speed: "328 km/h",
                    gear: "G8",
                    status: "TRACEABILITY_OK",
                    bullets: [
                        "Established requirement trace linking stakeholder requests to physical component specs.",
                        "Automated traceability checks using scripting extensions to accelerate QA cycles by 30%."
                    ]
                },
                {
                    pct: 0.50,
                    name: "T3 TURNPIKE CHICANE",
                    activity: "ETAS INCA HIL Calibrations",
                    speed: "215 km/h",
                    gear: "G4",
                    status: "CALIBRATION_OK",
                    bullets: [
                        "Executed calibration and validation checkouts on HIL rigs using ETAS INCA diagnostic tools.",
                        "Monitored CAN/CAN-FD signals and resolved interface discrepancies before releasing production baselines."
                    ]
                },
                {
                    pct: 0.95,
                    name: "T4 TURN 17 HAIRPIN",
                    activity: "SysML Architecture & Modeling",
                    speed: "145 km/h",
                    gear: "G3",
                    status: "MODEL_COMMITTED",
                    bullets: [
                        "Built block definition (BDD) and interface contract models inside IBM Rhapsody using SysML.",
                        "Defined port parameters and activity diagrams representing subsystem interactions."
                    ]
                }
            ]
        }
    ];

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 992);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate node coordinates along path dynamically to guarantee alignment
    useEffect(() => {
        if (trackRef.current) {
            const path = trackRef.current;
            const totalLen = path.getTotalLength();
            setPathLength(totalLen);

            const activeGpData = gps[activeGp];
            const coords = activeGpData.turns.map(turn => {
                const pt = path.getPointAtLength(turn.pct * totalLen);
                return { x: pt.x, y: pt.y };
            });
            setNodeCoords(coords);
            setShowFinish(false);
            
            // Instantly place car on the first turn's position
            const firstTurn = activeGpData.turns[0];
            if (firstTurn) {
                updateCarPosOnPath(firstTurn.pct);
                setCurrentProgress(firstTurn.pct);
            }
        }
    }, [activeGp]);

    const updateCarPosOnPath = (pct) => {
        if (trackRef.current) {
            const pathEl = trackRef.current;
            const totalLen = pathEl.getTotalLength();
            const currentLength = (pct % 1) * totalLen;
            const p1 = pathEl.getPointAtLength(currentLength);
            const p2 = pathEl.getPointAtLength(Math.min(totalLen, currentLength + 2));
            
            const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
            setCarPos({ x: p1.x, y: p1.y, angle });
        }
    };

    const animateCarToTurn = (targetPct) => {
        if (animRef.current) cancelAnimationFrame(animRef.current);
        
        const startVal = currentProgress;
        const diff = targetPct - startVal;
        
        let startTime = null;
        const duration = 1000;

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            const eased = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            const nextPct = startVal + diff * eased;
            updateCarPosOnPath(nextPct);
            
            if (progress < 1) {
                animRef.current = requestAnimationFrame(step);
            } else {
                updateCarPosOnPath(targetPct);
                setCurrentProgress(targetPct);
            }
        };

        animRef.current = requestAnimationFrame(step);
    };

    const handleTurnClick = (idx) => {
        setActiveTurnIdx(idx);
        setShowFinish(false);
        const targetPct = gps[activeGp].turns[idx].pct;
        animateCarToTurn(targetPct);
    };

    const handleFinishClick = () => {
        setShowFinish(true);
        // Animate car all the way around to just before the start line
        animateCarToTurn(0.999);
    };

    const handleGpChange = (gpIdx) => {
        setActiveGp(gpIdx);
        setActiveTurnIdx(0);
        setShowFinish(false);
        if (animRef.current) cancelAnimationFrame(animRef.current);
    };

    const currentGpData = gps[activeGp];
    const currentTurnData = currentGpData.turns[activeTurnIdx];

    // Checkered flag SVG pattern
    const CheckeredFlag = ({ size = 48 }) => (
        <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: 'inline-block', flexShrink: 0 }}>
            <rect width="48" height="48" fill="none"/>
            {/* Flag pole */}
            <rect x="3" y="2" width="3" height="44" fill="#888" rx="1"/>
            {/* Flag body - checkerboard 5x4 grid */}
            {[0,1,2,3,4].map(col =>
                [0,1,2,3].map(row => (
                    <rect
                        key={`${col}-${row}`}
                        x={6 + col * 8}
                        y={2 + row * 8}
                        width="8"
                        height="8"
                        fill={(col + row) % 2 === 0 ? '#fff' : '#000'}
                    />
                ))
            )}
            {/* Flag outline */}
            <rect x="6" y="2" width="40" height="32" fill="none" stroke="#555" strokeWidth="0.5"/>
        </svg>
    );

    // Live pulse indicator for Cognizant
    const LivePulse = () => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: '#E10600',
                display: 'inline-block',
                animation: 'livePulse 1.2s ease-in-out infinite',
            }}/>
            LIVE
        </span>
    );

    const styles = {
        section: {
            padding: '100px 0',
            background: 'var(--color-surface)',
            position: 'relative',
        },
        leaderboard: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '15px',
            marginBottom: '40px',
        },
        gpTab: (isActive) => ({
            background: isActive ? 'var(--color-primary)' : 'var(--color-bg)',
            border: `1px solid ${isActive ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.05)'}`,
            padding: '15px',
            borderRadius: '2px',
            cursor: 'pointer',
            textAlign: 'center',
            transform: 'skewX(-10deg)',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            boxShadow: isActive ? '0 10px 20px rgba(225, 6, 0, 0.15)' : 'none',
        }),
        gpTabText: (isActive) => ({
            transform: 'skewX(10deg)',
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            color: isActive ? '#fff' : 'var(--color-text-muted)',
            letterSpacing: '1px',
        }),
        grid: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '0.8fr 1.2fr',
            gap: '50px',
            alignItems: 'start',
            maxWidth: '1200px',
            margin: '0 auto',
        },
        stickyLeft: {
            background: 'var(--color-bg)',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.03)',
            borderRadius: '4px',
            boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        trackSVG: {
            width: '100%',
            maxWidth: '280px',
            height: 'auto',
            overflow: 'visible',
        },
        hudPanel: {
            width: '100%',
            marginTop: '25px',
            background: 'var(--color-surface)',
            borderTop: '2px solid var(--color-primary)',
            padding: '15px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            borderRadius: '2px',
        },
        hudRow: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
        },
        hudVal: {
            color: '#fff',
            fontWeight: 'bold',
        },
        rightContent: {
            background: 'var(--color-bg)',
            border: '1px solid rgba(255,255,255,0.03)',
            padding: '40px',
            borderRadius: '4px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
        },
        headerRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            paddingBottom: '20px',
            marginBottom: '25px',
        },
        tyreBadge: (color) => ({
            border: `1px solid ${color}`,
            color: color,
            padding: '3px 10px',
            fontSize: '0.65rem',
            borderRadius: '12px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 'bold',
            letterSpacing: '1px',
        }),
        turnTabsContainer: {
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '25px',
        },
        turnTabBtn: (isActive) => ({
            padding: '6px 12px',
            background: isActive ? 'var(--color-primary-dim)' : 'transparent',
            border: `1px solid ${isActive ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.08)'}`,
            borderRadius: '2px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            color: isActive ? '#fff' : 'var(--color-text-muted)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
        }),
        finishTabBtn: (isActive) => ({
            padding: '6px 14px',
            background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
            border: `1px solid ${isActive ? 'rgba(255,255,255,0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
            borderRadius: '2px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            color: isActive ? '#fff' : 'var(--color-text-muted)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
        }),
    };

    return (
        <>
            {/* Inline keyframe for live pulse */}
            <style>{`
                @keyframes livePulse {
                    0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(225,6,0,0.7); }
                    50% { opacity: 0.8; transform: scale(1.3); box-shadow: 0 0 0 6px rgba(225,6,0,0); }
                }
                @keyframes flagWave {
                    0% { transform: translateX(0) skewX(0deg); }
                    25% { transform: translateX(3px) skewX(-2deg); }
                    75% { transform: translateX(-3px) skewX(2deg); }
                    100% { transform: translateX(0) skewX(0deg); }
                }
                @keyframes finishFadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes podiumSlide {
                    from { opacity: 0; transform: translateX(-15px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .finish-screen { animation: finishFadeIn 0.5s ease forwards; }
                .podium-card { animation: podiumSlide 0.4s ease forwards; }
                .podium-card:nth-child(2) { animation-delay: 0.1s; }
                .podium-card:nth-child(3) { animation-delay: 0.2s; }
            `}</style>
            <section id="journey" style={styles.section}>
                <div className="container">
                    <RevealOnScroll>
                        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                            <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', marginBottom: '15px' }}>
                                <GlitchText text="CAREER CIRCUITS" />
                                <span style={{ fontSize: '0.5em', color: 'var(--color-text-muted)' }}> // PADDOCK TIMELINES</span>
                            </h2>
                            <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
                                Rohan's career timeline represented as individual F1 GP circuit track channels. Switch circuits and inspect turn telemetries to explore systems engineering work details.
                            </p>
                        </div>
                    </RevealOnScroll>

                    {/* Circuit Tabs Leaderboard Selector */}
                    <div style={styles.leaderboard} className="leaderboard-tabs">
                        {gps.map((gp) => {
                            const isActive = activeGp === gp.id;
                            return (
                                <div 
                                    key={gp.id} 
                                    style={styles.gpTab(isActive)}
                                    onClick={() => handleGpChange(gp.id)}
                                    className={!isActive ? 'nav-link-item' : ''}
                                >
                                    <span style={styles.gpTabText(isActive)}>
                                        {isActive ? '🏁 ' : ''}{gp.name}
                                    </span>
                                    {!gp.isFinished && (
                                        <span style={{ display: 'block', fontSize: '0.6rem', color: '#E10600', fontFamily: 'var(--font-mono)', marginTop: '4px', transform: 'skewX(10deg)' }}>
                                            ● LIVE
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div style={styles.grid}>
                        {/* Left Sticky Column: The SVG Racetrack */}
                        <div style={styles.stickyLeft} className="sticky-racetrack-card">
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', color: '#fff', marginBottom: '20px', letterSpacing: '2px' }}>
                                CIRCUIT MAP
                            </div>
                            
                            <svg viewBox="0 0 320 320" style={styles.trackSVG}>
                                {/* Outer/background layout track path */}
                                <path 
                                    d={currentGpData.trackPath} 
                                    fill="none" 
                                    stroke="var(--color-surface)" 
                                    strokeWidth="12" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                />
                                
                                {/* Inner racing line path */}
                                <path 
                                    ref={trackRef}
                                    d={currentGpData.trackPath} 
                                    fill="none" 
                                    stroke="#3A3A4A" 
                                    strokeWidth="4" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                />

                                {/* Dynamic active sector progress color overlay */}
                                <path 
                                    d={currentGpData.trackPath} 
                                    fill="none" 
                                    stroke={currentGpData.isFinished ? '#27AE60' : 'var(--color-primary)'}
                                    strokeWidth="4" 
                                    strokeDasharray={pathLength}
                                    strokeDashoffset={pathLength - (currentProgress * pathLength)}
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                    style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                                />

                                {/* Start/Finish Line */}
                                <line 
                                    x1={currentGpData.startLine.x1} 
                                    y1={currentGpData.startLine.y1} 
                                    x2={currentGpData.startLine.x2} 
                                    y2={currentGpData.startLine.y2} 
                                    stroke="#fff" 
                                    strokeWidth="3" 
                                    strokeDasharray="3 3" 
                                />

                                {/* Dynamically aligned node markers */}
                                {currentGpData.turns.map((turn, idx) => {
                                    const coords = nodeCoords[idx] || { x: 0, y: 0 };
                                    const isActive = !showFinish && activeTurnIdx === idx;
                                    let fill = '#333';
                                    if (isActive) {
                                        fill = currentGpData.compoundColor;
                                    }
                                    return (
                                        <circle 
                                            key={idx}
                                            cx={coords.x} 
                                            cy={coords.y} 
                                            r={isActive ? '8' : '6'} 
                                            fill={fill} 
                                            stroke="#fff" 
                                            strokeWidth="1.5" 
                                            onClick={() => handleTurnClick(idx)} 
                                            style={{ cursor: 'pointer', transition: 'all 0.3s ease' }} 
                                        />
                                    );
                                })}

                                {/* Finish flag marker on the track (only for finished GPs) */}
                                {currentGpData.isFinished && showFinish && (
                                    <g>
                                        <circle
                                            cx={currentGpData.startLine.x1}
                                            cy={(currentGpData.startLine.y1 + currentGpData.startLine.y2) / 2}
                                            r="10"
                                            fill="rgba(39,174,96,0.3)"
                                            stroke="#27AE60"
                                            strokeWidth="2"
                                        />
                                        <text
                                            x={currentGpData.startLine.x1}
                                            y={(currentGpData.startLine.y1 + currentGpData.startLine.y2) / 2 + 5}
                                            textAnchor="middle"
                                            fontSize="10"
                                            fill="#fff"
                                        >🏁</text>
                                    </g>
                                )}

                                {/* Cognizant "IN PROGRESS" indicator */}
                                {!currentGpData.isFinished && (
                                    <g>
                                        <circle
                                            cx={currentGpData.startLine.x1}
                                            cy={(currentGpData.startLine.y1 + currentGpData.startLine.y2) / 2}
                                            r="8"
                                            fill="rgba(225,6,0,0.2)"
                                            stroke="#E10600"
                                            strokeWidth="1.5"
                                        >
                                            <animate attributeName="r" values="6;10;6" dur="1.5s" repeatCount="indefinite"/>
                                            <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/>
                                        </circle>
                                    </g>
                                )}

                                {/* The Car Group */}
                                <g transform={`translate(${carPos.x}, ${carPos.y}) rotate(${carPos.angle})`}>
                                    <rect x="-8" y="-4" width="16" height="8" fill="#E10600" rx="1" />
                                    <rect x="3" y="-5" width="3" height="10" fill="#000" />
                                    <rect x="-8" y="-5" width="2" height="10" fill="#fff" />
                                    <circle cx="-4" cy="-5" r="2" fill="#000" />
                                    <circle cx="-4" cy="5" r="2" fill="#000" />
                                    <circle cx="4" cy="-5" r="2" fill="#000" />
                                    <circle cx="4" cy="5" r="2" fill="#000" />
                                </g>
                            </svg>

                            {/* Real-time telemetry HUD Box */}
                            <div style={styles.hudPanel}>
                                <div style={styles.hudRow}>
                                    <span>CORNER NODE</span>
                                    <span style={styles.hudVal}>
                                        {showFinish ? 'FINISH LINE' : currentTurnData?.name}
                                    </span>
                                </div>
                                <div style={styles.hudRow}>
                                    <span>CORNER SPEED</span>
                                    <span style={styles.hudVal}>
                                        {showFinish ? '—' : currentTurnData?.speed}
                                    </span>
                                </div>
                                <div style={styles.hudRow}>
                                    <span>GEAR SELECTION</span>
                                    <span style={styles.hudVal}>
                                        {showFinish ? '—' : currentTurnData?.gear}
                                    </span>
                                </div>
                                <div style={styles.hudRow}>
                                    <span>SYSTEM STATUS</span>
                                    <span style={{ ...styles.hudVal, color: showFinish ? '#27AE60' : (!currentGpData.isFinished && !showFinish ? '#E10600' : 'var(--color-secondary)') }}>
                                        {showFinish ? 'RACE_FINISHED' : (!currentGpData.isFinished ? 'LAP_IN_PROGRESS' : currentTurnData?.status)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Active circuit work details */}
                        <div style={styles.rightContent} className="circuit-work-panel">
                            <div style={styles.headerRow}>
                                <div>
                                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                                        {currentGpData.year}
                                    </span>
                                    <h3 style={{ fontSize: '1.8rem', color: '#fff', marginTop: '5px', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                                        {currentGpData.role}
                                    </h3>
                                    <div style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                                        {currentGpData.company}
                                    </div>
                                </div>
                                
                                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                                    <div style={styles.tyreBadge(currentGpData.compoundColor)}>
                                        {currentGpData.compound} TYRES
                                    </div>
                                    {!currentGpData.isFinished && (
                                        <div style={{ 
                                            border: '1px solid #E10600', 
                                            color: '#E10600', 
                                            padding: '3px 10px', 
                                            fontSize: '0.65rem', 
                                            borderRadius: '12px', 
                                            fontFamily: 'var(--font-mono)', 
                                            fontWeight: 'bold', 
                                            letterSpacing: '1px',
                                            display: 'flex', alignItems: 'center', gap: '5px'
                                        }}>
                                            <LivePulse />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Interactive Turn Tabs (Corners List) */}
                            <div style={styles.turnTabsContainer}>
                                {currentGpData.turns.map((turn, idx) => {
                                    const isActive = !showFinish && activeTurnIdx === idx;
                                    return (
                                        <button 
                                            key={idx}
                                            style={styles.turnTabBtn(isActive)}
                                            onClick={() => handleTurnClick(idx)}
                                            className="f1-skew-btn"
                                        >
                                            <span>{turn.name}</span>
                                        </button>
                                    );
                                })}

                                {/* Race Finished button for completed GPs only */}
                                {currentGpData.isFinished && (
                                    <button
                                        style={styles.finishTabBtn(showFinish)}
                                        onClick={handleFinishClick}
                                        className="f1-skew-btn"
                                    >
                                        <span>🏁</span>
                                        <span>RACE FINISHED</span>
                                    </button>
                                )}
                            </div>

                            {/* Turn details bullets display OR Race Finish Screen OR In-Progress Screen */}
                            {showFinish && currentGpData.isFinished ? (
                                /* === RACE FINISHED SCREEN === */
                                <div className="finish-screen" key={`finish-${activeGp}`}>
                                    {/* Podium Header */}
                                    <div style={{ 
                                        display: 'flex', alignItems: 'center', gap: '16px', 
                                        marginBottom: '24px',
                                        padding: '16px 20px',
                                        background: 'linear-gradient(135deg, rgba(39,174,96,0.08), rgba(39,174,96,0.02))',
                                        border: '1px solid rgba(39,174,96,0.3)',
                                        borderRadius: '4px',
                                        borderLeft: '4px solid #27AE60',
                                    }}>
                                        <div style={{ animation: 'flagWave 2s ease-in-out infinite', transformOrigin: 'left center', flexShrink: 0 }}>
                                            <svg width="52" height="44" viewBox="0 0 52 44">
                                                {/* Pole */}
                                                <rect x="1" y="0" width="3" height="44" fill="#888" rx="1"/>
                                                {/* Checkers 5x3 */}
                                                {[0,1,2,3,4].map(col =>
                                                    [0,1,2,3].map(row => (
                                                        <rect key={`${col}-${row}`}
                                                            x={4 + col * 9} y={2 + row * 9}
                                                            width="9" height="9"
                                                            fill={(col + row) % 2 === 0 ? '#fff' : '#111'}
                                                        />
                                                    ))
                                                )}
                                            </svg>
                                        </div>
                                        <div>
                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#27AE60', letterSpacing: '2px', marginBottom: '4px' }}>
                                                RACE COMPLETE // {currentGpData.finishYear}
                                            </div>
                                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '2px' }}>
                                                {currentGpData.raceResult}
                                            </div>
                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                                {currentGpData.company} — {currentGpData.role}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Key Takeaways */}
                                    <div style={{ 
                                        fontFamily: 'var(--font-mono)', fontSize: '0.7rem', 
                                        color: 'var(--color-text-muted)', letterSpacing: '2px', 
                                        marginBottom: '14px', textTransform: 'uppercase' 
                                    }}>
                                        // KEY TAKEAWAYS FROM THIS LAP
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {currentGpData.takeaways.map((item, idx) => (
                                            <div key={idx} className="podium-card" style={{ 
                                                display: 'flex', gap: '16px', alignItems: 'flex-start',
                                                padding: '16px',
                                                background: 'var(--color-surface)',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                borderLeft: `3px solid ${currentGpData.compoundColor}`,
                                                borderRadius: '2px',
                                                opacity: 0,
                                            }}>
                                                <span style={{
                                                    flexShrink: 0,
                                                    width: '32px',
                                                    height: '32px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    border: `1px solid ${currentGpData.compoundColor === '#FFFFFF' ? 'rgba(255,255,255,0.25)' : currentGpData.compoundColor}`,
                                                    borderRadius: '2px',
                                                    fontFamily: 'var(--font-mono)',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 'bold',
                                                    color: currentGpData.compoundColor === '#FFFFFF' ? 'rgba(255,255,255,0.5)' : currentGpData.compoundColor,
                                                    letterSpacing: '0.5px',
                                                    marginTop: '2px',
                                                }}>
                                                    {String(idx + 1).padStart(2, '0')}
                                                </span>
                                                <div>
                                                    <div style={{ 
                                                        fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 'bold',
                                                        color: currentGpData.compoundColor === '#FFFFFF' ? '#ccc' : currentGpData.compoundColor,
                                                        letterSpacing: '1.5px', marginBottom: '6px'
                                                    }}>
                                                        {item.title}
                                                    </div>
                                                    <div style={{ 
                                                        fontSize: '0.88rem', color: 'var(--color-text)', lineHeight: '1.6'
                                                    }}>
                                                        {item.desc}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : !currentGpData.isFinished && !showFinish ? (
                                /* === COGNIZANT IN-PROGRESS VIEW === */
                                <div key={`${activeGp}-${activeTurnIdx}`} className="animate-fade-in">
                                    {/* Live session banner */}
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        padding: '10px 16px',
                                        background: 'rgba(225,6,0,0.05)',
                                        border: '1px solid rgba(225,6,0,0.2)',
                                        borderRadius: '3px',
                                        marginBottom: '20px',
                                        fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)',
                                    }}>
                                        <LivePulse />
                                        <span>SESSION IN PROGRESS — LAP CONTINUES BEYOND THIS POINT</span>
                                    </div>
                                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: '#fff', marginBottom: '15px', borderLeft: '3px solid var(--color-primary)', paddingLeft: '10px' }}>
                                        {currentTurnData?.activity}
                                    </h4>
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {currentTurnData?.bullets?.map((bullet, idx) => (
                                            <li key={idx} style={{ display: 'flex', gap: '12px', fontSize: '0.92rem', color: 'var(--color-text)', marginBottom: '12px', lineHeight: '1.6' }}>
                                                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold', flexShrink: 0 }}>»</span>
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                /* === REGULAR TURN DETAILS === */
                                <div key={`${activeGp}-${activeTurnIdx}`} className="animate-fade-in">
                                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: '#fff', marginBottom: '15px', borderLeft: '3px solid var(--color-primary)', paddingLeft: '10px' }}>
                                        {currentTurnData?.activity}
                                    </h4>
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {currentTurnData?.bullets?.map((bullet, idx) => (
                                            <li key={idx} style={{ display: 'flex', gap: '12px', fontSize: '0.92rem', color: 'var(--color-text)', marginBottom: '12px', lineHeight: '1.6' }}>
                                                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold', flexShrink: 0 }}>»</span>
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Journey;
