"""
Generate an ATS-friendly Word document resume for Rohan Kadam.
"""
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
import os

doc = Document()

# -- Page margins
for section in doc.sections:
    section.top_margin = Inches(0.5)
    section.bottom_margin = Inches(0.5)
    section.left_margin = Inches(0.6)
    section.right_margin = Inches(0.6)

style = doc.styles['Normal']
font = style.font
font.name = 'Calibri'
font.size = Pt(10.5)
font.color.rgb = RGBColor(0x22, 0x22, 0x22)

# ============================================================
# HEADER — Name & Contact
# ============================================================
name = doc.add_paragraph()
name.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = name.add_run('ROHAN KADAM')
run.bold = True
run.font.size = Pt(22)
run.font.color.rgb = RGBColor(0x11, 0x11, 0x11)
name.paragraph_format.space_after = Pt(2)

title = doc.add_paragraph()
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = title.add_run('Solutions Architect — Embedded Automotive Systems')
run.font.size = Pt(11)
run.font.color.rgb = RGBColor(0x55, 0x55, 0x55)
title.paragraph_format.space_after = Pt(6)

contact = doc.add_paragraph()
contact.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = contact.add_run('+91 96734 75039  |  rohankadam.1023@gmail.com  |  Pune, India  |  linkedin.com/in/rohan-kadam-7bb932161  |  github.com/rohaaaaaan')
run.font.size = Pt(9)
run.font.color.rgb = RGBColor(0x44, 0x44, 0x44)
contact.paragraph_format.space_after = Pt(4)


def add_section_heading(text):
    """ATS-friendly section heading with a bottom border."""
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(4)
    run = p.add_run(text.upper())
    run.bold = True
    run.font.size = Pt(12)
    run.font.color.rgb = RGBColor(0x11, 0x11, 0x11)
    # Bottom border
    pPr = p._p.get_or_add_pPr()
    pBdr = pPr.makeelement(qn('w:pBdr'), {})
    bottom = pBdr.makeelement(qn('w:bottom'), {
        qn('w:val'): 'single',
        qn('w:sz'): '6',
        qn('w:space'): '1',
        qn('w:color'): '333333',
    })
    pBdr.append(bottom)
    pPr.append(pBdr)
    return p


def add_bullet(text):
    p = doc.add_paragraph(text, style='List Bullet')
    p.paragraph_format.space_after = Pt(1)
    p.paragraph_format.space_before = Pt(1)
    for run in p.runs:
        run.font.size = Pt(10)
    return p


# ============================================================
# PROFESSIONAL SUMMARY
# ============================================================
add_section_heading('Professional Summary')
summary = doc.add_paragraph()
summary.paragraph_format.space_after = Pt(6)
run = summary.add_run(
    'Systems & E/E Engineer with over 6 years of experience bridging physical mechanical development, design '
    'thinking, and high-voltage EV systems feature ownership. Proven track record in orchestrating the V-cycle '
    'lifecycle for EV Propulsion Range and Powerflow systems on next-gen STLA architectures, leveraging MBSE '
    '(SysML) and IBM DOORS Next Gen. Strong foundation in powertrain cooling, mechanical packaging (CATIA V5), '
    'and thermal CFD modeling for commercial ICE and electrified platforms. Adept at applying design thinking '
    'principles—such as Pugh decision analysis, 8D root-cause resolution, and cross-functional APQP quality gateways—to '
    'optimize packaging boundaries and E/E configurations from concept to production-grade validation.'
)
run.font.size = Pt(10)


# ============================================================
# CORE COMPETENCIES (keyword-rich for ATS)
# ============================================================
add_section_heading('Core Competencies')
competencies = doc.add_paragraph()
competencies.paragraph_format.space_after = Pt(6)
run = competencies.add_run(
    'Systems Engineering (V-Model, ASPICE, MBSE/SysML)  •  EV Powertrain & Battery Integration  •  '
    'Vehicle Networks (CAN, CAN FD, LIN, Ethernet)  •  Functional Safety (ISO 26262 ASIL-C/D)  •  '
    'Powertrain Cooling & Active Thermal Management  •  Requirements Engineering (IBM DOORS Next Gen)  •  '
    'HIL Testing & Calibration (Vector CANoe, ETAS INCA)  •  CAD Packaging & PLM (CATIA V5, Siemens Teamcenter)'
)
run.font.size = Pt(10)
run.font.color.rgb = RGBColor(0x33, 0x33, 0x33)


# ============================================================
# PROFESSIONAL EXPERIENCE
# ============================================================
add_section_heading('Professional Experience')

experiences = [
    {
        'company': 'Cognizant (Client: Stellantis)',
        'title': 'Systems Engineer / Feature Owner — EV Range & Powerflow',
        'period': '2024 – Present',
        'location': 'Pune, India',
        'bullets': [
            'Systems Engineer / Feature Owner for EV Propulsion Range Estimation, managing system-level requirements and E/E architecture integration across global STLA architectures (STLA Brain, Large, Frame) and Atlantis High/Mid platforms.',
            'Authored system requirements for the Distance-to-Empty (DTE) range algorithm in IBM DOORS Next Gen, specifying functional logic for dynamic energy models, State of Charge (SOC) tracking, and signal filtering.',
            'Acted as Systems Feature Owner for EV Powerflow HMI Visualizations; defined signal routing, system interfaces, and the mathematical framework for real-time power balance calculations, including auxiliary "Grey Power" losses.',
            'Authored system requirements and interface specifications for ADAS functions (Adaptive Cruise Control, Active Emergency Braking) and their torque arbitration logic with the propulsion controller\'s Base Torque Management module.',
            'Supported controls development (MATLAB/Simulink) and calibration teams by executing Hardware-in-the-Loop (HIL) checkout testing, debugging network interfaces via CANoe, and utilizing ETAS INCA for calibration parameters.',
            'Owned ISO 26262 functional safety requirements up to ASIL-D for propulsion and vehicle securement paths; conducted HARA, established Functional/Technical Safety Concepts (FSC/TSR), and specified fail-safe torque-neutral requirements.',
            'Ensured system-level compliance with ASPICE SYS.1-SYS.5 processes and defined AUTOSAR Software Component (SWC) interface mappings for ASW-BSW software integration.',
            'Managed network signal mapping and interface configurations to coordinate the vehicle-level network transition from legacy C-CAN to high-speed CAN FD communications.',
            'Developed engineering innovations to fast-track development: an AI tool to classify requirements per INCOSE guidelines, an Advanced DBC Visualizer, a Macrovariant Development tool for CFTS, and an Advanced Signal Data Analysis tool.',
            'Deployed Model-Based Systems Engineering (MBSE) using SysML in IBM Rational Rhapsody and CATIA Magic to model functional architectures, port configurations, and interface contracts.',
        ]
    },
    {
        'company': 'Mahindra & Mahindra',
        'title': 'Thermal Systems Architecture Engineer',
        'period': '2023 – 2024',
        'location': 'Pune, India',
        'bullets': [
            'Primary Owner of commercial vehicle powertrain cooling and EV active thermal management systems; managed a team of 2 engineers through APQP quality gates and PPAP dossiers.',
            'Sized radiator core and charge-air intercooler thermal envelopes based on Logarithmic Mean Temperature Difference (LMTD) and convective heat transfer equations and engine trials to maintain performance under 45°C ambient boundaries.',
            'Leveraged CATIA V5 to model underhood packaging layouts, routing high-pressure lines and releasing production 2D drawings with strict GD&T and tolerance stack-up via Siemens Teamcenter PLM.',
            'Conducted 1D GT-Suite transient system simulations and 3D CFD airflow modeling to eliminate underhood hot-air recirculation zones; validated scopes in wind tunnels using thermocouple and hot-wire anemometer rigs.',
            'Designed and validated the ISO 26262 ASIL-C safety case for the Accelerator Pedal Module, executing HARA and DFMEA risk assessments from concept to tooling.',
            'Defined system specs for a 5-way rotary electric coolant valve to enable serial, parallel, and waste-heat recovery cooling modes for battery and e-motor thermal loops.',
            'Resolved 15+ clearance and packaging defects during the VP0 prototype build using 8D root-cause methodologies, earning the title of VP0 Build Issue Resolution Champion.',
        ]
    },
    {
        'company': 'TATA Technologies',
        'title': 'Powertrain Design Lead — 3T Forklifts',
        'period': '2019 – 2023',
        'location': 'Pune, India',
        'bullets': [
            'Powertrain System Owner for a major forklift program, designing and integrating engine, powershift transmission, and drive/steer axles for a family of 1.5T to 3T forklifts across 70+ variants.',
            'Created a predictive torque converter matching and tractive effort simulation model combining engine torque, converter torque ratio multipliers, and transmission and drive axle ratios, achieving a 2% mean error validated against GT-Suite and test track data.',
            'Utilized weighted Pugh Decision Matrices to select engine-transmission combinations, balancing objective physics performance against cost, lead times, and supplier service networks.',
            'Conducted 1D cooling simulations for radiator/oil cooler packages and sized mechanical/electric engine fans to minimize parasitic power draws.',
            'Designed embedded safety features including fuel cut-off interlock solenoids, seatbelt/seat-switch driver presence detection, and calibrated electronic throttle/joystick potentiometer signals.',
            'Co-engineered CAN bus (SAE J1939) fleet telematics configurations, mapping DTC diagnostic alerts and implementing store-and-forward flash memory buffering for cell-dead zones.',
        ]
    },
]

for exp in experiences:
    # Company + Period on same line
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(1)
    run = p.add_run(exp['company'])
    run.bold = True
    run.font.size = Pt(11)
    if exp['period']:
        run = p.add_run(f"  —  {exp['period']}")
        run.font.size = Pt(10)
        run.font.color.rgb = RGBColor(0x66, 0x66, 0x66)

    # Title + Location
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(3)
    run = p.add_run(exp['title'])
    run.italic = True
    run.font.size = Pt(10.5)
    run = p.add_run(f"  |  {exp['location']}")
    run.font.size = Pt(9.5)
    run.font.color.rgb = RGBColor(0x66, 0x66, 0x66)

    for bullet in exp['bullets']:
        add_bullet(bullet)


# ============================================================
# EDUCATION / EARLY EXPERIENCE
# ============================================================
add_section_heading('Education & Early Experience')

p = doc.add_paragraph()
p.paragraph_format.space_before = Pt(6)
p.paragraph_format.space_after = Pt(1)
run = p.add_run('Veloce Racing — Formula Student Team')
run.bold = True
run.font.size = Pt(11)

p = doc.add_paragraph()
p.paragraph_format.space_after = Pt(3)
run = p.add_run('Brake Systems Design')
run.italic = True
run.font.size = Pt(10.5)

add_bullet('Designed hydraulic brake control circuits with sensor integration for Formula Student race car.')
add_bullet('Designed and optimized brake balance bar assembly based on real-time data acquired during track testing.')
add_bullet('Performed FEA thermal analysis (ANSYS) on brake rotors — first exposure to simulation-driven design.')

p = doc.add_paragraph()
p.paragraph_format.space_before = Pt(10)
p.paragraph_format.space_after = Pt(1)
run = p.add_run('Bachelor of Engineering — Mechanical Engineering')
run.bold = True
run.font.size = Pt(11)

p = doc.add_paragraph()
p.paragraph_format.space_after = Pt(3)
run = p.add_run('Vishwakarma Institute of Technology (VIT), Savitribai Phule Pune University  |  2019  |  CGPA: 8.02')
run.italic = True
run.font.size = Pt(10)
run.font.color.rgb = RGBColor(0x66, 0x66, 0x66)

p = doc.add_paragraph()
p.paragraph_format.space_before = Pt(8)
p.paragraph_format.space_after = Pt(1)
run = p.add_run('HSC (12th Standard)')
run.bold = True
run.font.size = Pt(10.5)
run = p.add_run('  |  2015  |  84.2%')
run.font.size = Pt(10)
run.font.color.rgb = RGBColor(0x66, 0x66, 0x66)

p = doc.add_paragraph()
p.paragraph_format.space_before = Pt(4)
p.paragraph_format.space_after = Pt(1)
run = p.add_run('SSC (10th Standard)')
run.bold = True
run.font.size = Pt(10.5)
run = p.add_run('  |  2013  |  93.46%')
run.font.size = Pt(10)
run.font.color.rgb = RGBColor(0x66, 0x66, 0x66)


# ============================================================
# KEY PROJECTS
# ============================================================
add_section_heading('Key Projects')

projects = [
    {
        'name': 'AI-Powered Systems Engineering Platform (AISE)',
        'tech': 'Python, LangChain, React, MBSE, SysML, RAG',
        'desc': 'Intelligent systems engineering platform automating requirements decomposition and trace matrices using LLMs. Converts natural language requirements into SysML-compliant block definitions and interface contracts.',
    },
    {
        'name': 'F1 Telemetry & 3D Race Visualisation',
        'tech': 'React, Three.js, Node.js, WebSockets, MQTT, Python',
        'desc': 'A real-time telemetry streaming and interactive 3D visualization dashboard. Decodes live CAN and sensor streams over WebSockets to render vehicle kinetics, tire thermal zones, and track positioning in a high-performance WebGL-based 3D environment.',
    },
]

for proj in projects:
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(1)
    run = p.add_run(proj['name'])
    run.bold = True
    run.font.size = Pt(10.5)
    run = p.add_run(f"  [{proj['tech']}]")
    run.font.size = Pt(9)
    run.font.color.rgb = RGBColor(0x66, 0x66, 0x66)

    p = doc.add_paragraph(proj['desc'])
    p.paragraph_format.space_after = Pt(4)
    for run in p.runs:
        run.font.size = Pt(10)


# ============================================================
# TECHNICAL SKILLS (categorized for ATS)
# ============================================================
add_section_heading('Technical Skills')

skills = [
    ('Protocols & Networks', 'CAN / CAN-FD, LIN, FlexRay, Automotive Ethernet, UDS / DoIP, XCP / A2L'),
    ('Architecture & Standards', 'AUTOSAR Classic & Adaptive (ASW-BSW), ISO 26262 (ASIL-C/D), ASPICE, V-Model, MBSE / SysML, 8D Problem Solving'),
    ('Tools & Platforms', 'Vector CANoe, ETAS INCA, MATLAB / Simulink, dSPACE HIL, Git / Jenkins CI, DOORS Next Gen, IBM Rhapsody, CATIA Magic'),
    ('CAD & Simulation & PLM', 'SolidWorks, CATIA V5, Creo, ANSYS, GT-Suite, Siemens Teamcenter PLM, GD&T'),
    ('Languages & Embedded', 'Embedded C, C++ (MISRA), Python, RTOS (FreeRTOS), Embedded Linux (Yocto)'),
    ('AI & Data', 'LLM Integration, Agentic AI Systems, LangChain / RAG, Data Analysis (Pandas), Prompt Engineering, ML Pipelines'),
]

for category, items in skills:
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    run = p.add_run(f'{category}: ')
    run.bold = True
    run.font.size = Pt(10)
    run = p.add_run(items)
    run.font.size = Pt(10)


# ============================================================
# SAVE
# ============================================================
output_path = os.path.join(os.path.dirname(__file__), 'public', 'Rohan_Kadam_Resume_v2.docx')
doc.save(output_path)
print(f'Resume saved to: {output_path}')
