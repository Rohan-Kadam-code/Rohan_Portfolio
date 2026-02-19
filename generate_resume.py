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
    'Embedded systems engineer with 6+ years of experience spanning ICE powertrains, HV battery integration, '
    'and electrified platforms across 3 OEMs and 5+ vehicle platforms. Now specializing in solutions architecture '
    'for automotive E/E systems — bridging mechanical design, embedded software, and system-level requirements. '
    'Deep expertise in AUTOSAR, ISO 26262 functional safety, model-based systems engineering (MBSE/SysML), '
    'and production-grade requirements management with DOORS Next Gen. Proven track record of leading '
    'cross-functional teams from concept through production release.'
)
run.font.size = Pt(10)


# ============================================================
# CORE COMPETENCIES (keyword-rich for ATS)
# ============================================================
add_section_heading('Core Competencies')
competencies = doc.add_paragraph()
competencies.paragraph_format.space_after = Pt(6)
run = competencies.add_run(
    'AUTOSAR Classic & Adaptive  •  ISO 26262 Functional Safety  •  ASPICE  •  MBSE / SysML  •  '
    'CAN / CAN-FD / LIN / FlexRay  •  Automotive Ethernet  •  UDS / DoIP  •  XCP / A2L  •  '
    'Vector CANoe  •  ETAS INCA  •  MATLAB / Simulink  •  dSPACE HIL  •  DOORS Next Gen  •  '
    'IBM Rhapsody  •  Embedded C  •  C++ (MISRA)  •  Python  •  FreeRTOS  •  Embedded Linux (Yocto)  •  '
    'SolidWorks  •  CATIA  •  Creo  •  ANSYS  •  GT-Suite  •  Git / Jenkins CI  •  '
    'LLM Integration  •  Agentic AI  •  LangChain / RAG  •  V-Model  •  PPAP  •  DFMEA  •  APQP'
)
run.font.size = Pt(9.5)
run.font.color.rgb = RGBColor(0x33, 0x33, 0x33)


# ============================================================
# PROFESSIONAL EXPERIENCE
# ============================================================
add_section_heading('Professional Experience')

experiences = [
    {
        'company': 'Cognizant (Client: Stellantis)',
        'title': 'Feature Owner — Range & Powerflow Systems',
        'period': '2024 – Present',
        'location': 'Pune, India',
        'bullets': [
            'Feature owner for Range Estimation and Powerflow management — end-to-end ownership from requirements through validation.',
            'Authoring, reviewing, and releasing system requirements using DOORS Next Gen; maintaining full traceability from stakeholder needs to system specs.',
            'Led a process improvement initiative to develop an internal DOORS NXG alternative, streamlining requirements management workflows across teams.',
            'Performing requirements validation and calibration through ETAS INCA — verifying system behavior against specification on HIL and vehicle.',
            'Creating and maintaining system architecture models in IBM Rhapsody using SysML — defining block definitions, activity diagrams, and interface contracts.',
            'Driving cross-functional issue resolution across powertrain controls, calibration, and integration teams for production release milestones.',
        ]
    },
    {
        'company': 'Mahindra & Mahindra',
        'title': 'Thermal Systems Architecture Engineer',
        'period': '2023 – 2024',
        'location': 'Pune, India',
        'bullets': [
            'Owned end-to-end thermal management architecture: 1D/3D CFD for radiator, intercooler, and EGR cooler sizing; validated in wind tunnel with hands-on instrumentation and sensor rigs.',
            'Conducted data acquisition and post-processing analysis; drove design improvements through iterative test-analyze-fix cycles with full documented signoffs.',
            'Designed accelerator pedal module from concept to tooling completion — including technology selection, mechanical packaging design, and ASIL C functional safety signoffs.',
            'Followed OEM product development practices: PPAP, DFMEA, quality gateway reviews, and warranty signoff processes aligned with Mahindra\'s APQP framework.',
            'Defined coolant circuit topology and fan control architecture with CAN-based speed modulation under varying duty cycles.',
        ]
    },
    {
        'company': 'TATA Technologies',
        'title': 'Powertrain Design Lead — 3T Forklifts',
        'period': '2019 – 2023',
        'location': 'Pune, India',
        'bullets': [
            'Led complete powertrain design for 3D/E forklifts, simulating 50+ engine-transmission combinations for optimal performance.',
            'Conducted comprehensive benchmarking and ROI analysis to propose cost-effective, high-performance powertrain architectures.',
            'Validated systems on-site and prepared detailed engineering documentation, calculations, and interface specifications.',
            'Collaborated on embedded integration: fleet management strategy, IoT connectivity modules, and thermal sensor selection.',
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
        'name': 'CAN Bus Analyser & Diagnostic Platform',
        'tech': 'C++, Embedded C, CAN Protocol, UDS, DBC, Qt, Python',
        'desc': 'Production-grade diagnostic tool for real-time CAN/CAN-FD bus monitoring, DBC-based signal decoding, and UDS diagnostic session management. Features HAL for multi-vendor CAN interfaces, pluggable protocol decoders, and real-time filtering engine.',
    },
    {
        'name': 'AI-Powered Systems Engineering Platform',
        'tech': 'Python, LangChain, React, MBSE, SysML',
        'desc': 'Intelligent platform automating requirements decomposition and system architecture generation using LLMs. Converts natural language requirements into SysML-compatible block diagrams and interface definitions.',
    },
    {
        'name': 'Connected Mobility Platform',
        'tech': 'React Native, Node.js, MQTT, Socket.io, REST API',
        'desc': 'Full-stack connected vehicle application with real-time fleet telemetry, OTA update orchestration, and predictive maintenance alerts. Designed with SOA principles for scalable V2C communication.',
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
    ('Architecture & Standards', 'AUTOSAR Classic, AUTOSAR Adaptive, ISO 26262, ASPICE, V-Model, MBSE / SysML'),
    ('Tools & Platforms', 'Vector CANoe, ETAS INCA, MATLAB / Simulink, dSPACE HIL, Git / Jenkins CI, DOORS Next Gen, IBM Rhapsody'),
    ('CAD & Simulation', 'SolidWorks, CATIA, Creo, FreeCAD, ANSYS, GT-Suite'),
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
