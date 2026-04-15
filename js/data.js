window.PatentBenchData = {
  reviewWeights: {
    novelty: 22,
    nonObviousness: 22,
    claimClarity: 15,
    enablement: 14,
    utility: 10,
    writtenDescription: 10,
    eligibility: 7
  },
  reviewModes: {
    balanced: { label: 'Balanced examination', weights: { novelty: 22, nonObviousness: 22, claimClarity: 15, enablement: 14, utility: 10, writtenDescription: 10, eligibility: 7 } },
    strict112: { label: '§112-heavy drafting review', weights: { novelty: 18, nonObviousness: 16, claimClarity: 20, enablement: 18, utility: 8, writtenDescription: 14, eligibility: 6 } },
    strict103: { label: '§103-heavy prior art review', weights: { novelty: 24, nonObviousness: 28, claimClarity: 14, enablement: 10, utility: 8, writtenDescription: 8, eligibility: 8 } },
    biotech: { label: 'Biotech / enablement lens', weights: { novelty: 20, nonObviousness: 20, claimClarity: 12, enablement: 18, utility: 8, writtenDescription: 16, eligibility: 6 } },
    software: { label: 'Software / eligibility lens', weights: { novelty: 20, nonObviousness: 20, claimClarity: 14, enablement: 12, utility: 8, writtenDescription: 8, eligibility: 18 } }
  },
  engines: [
    { name: '01. Novelty Engine', text: 'Measures separation from known reference clusters and identifies when a single reference appears to cover most claim limitations.' },
    { name: '02. Non-Obviousness Mapper', text: 'Tests whether multiple references collectively teach the claimed combination and whether the combination looks predictable.' },
    { name: '03. Claim Clarity Scanner', text: 'Flags vague, functional, and result-oriented phrasing that may trigger indefiniteness or overbreadth concerns.' },
    { name: '04. Enablement Check', text: 'Evaluates whether the specification contains enough make-and-use detail for a skilled person to practice the invention.' },
    { name: '05. Written Description Review', text: 'Looks for support between disclosed embodiments and the actual claim language.' },
    { name: '06. Utility Screen', text: 'Verifies operability, practical use, and whether the invention has a concrete application.' },
    { name: '07. Eligibility Review', text: 'Screens for abstract-idea and natural-law risk while checking whether the claim is tied to a concrete technological implementation.' },
    { name: '08. Office Action Composer', text: 'Transforms the detected issues into a prosecution-style memo with next-step guidance.' }
  ],
  cases: [
    { name: 'Graham v. John Deere Co.', citation: '383 U.S. 1 (1966)', year: 1966, doctrine: '§103 obviousness', issue: 'Framework for obviousness', practicalUse: 'Baseline case for assessing prior-art differences, skill in the art, and secondary considerations.', tags: ['103', 'obviousness'] },
    { name: 'KSR Int’l Co. v. Teleflex Inc.', citation: '550 U.S. 398 (2007)', year: 2007, doctrine: '§103 obviousness', issue: 'Flexible motivation-to-combine analysis', practicalUse: 'Supports obviousness risk when references can be combined in a predictable way.', tags: ['103', 'obviousness'] },
    { name: 'In re Robertson', citation: '169 F.3d 743 (Fed. Cir. 1999)', year: 1999, doctrine: '§102 anticipation', issue: 'Single reference must disclose every element', practicalUse: 'Useful when testing whether one prior-art reference really teaches all limitations.', tags: ['102', 'anticipation'] },
    { name: 'Titanium Metals Corp. v. Banner', citation: '778 F.2d 775 (Fed. Cir. 1985)', year: 1985, doctrine: '§102 anticipation', issue: 'Prior art anticipating composition claims', practicalUse: 'Useful for chemistry or materials cases where ranges and compositions overlap closely.', tags: ['102', 'anticipation', 'chemistry'] },
    { name: 'Nautilus, Inc. v. Biosig Instruments, Inc.', citation: '572 U.S. 898 (2014)', year: 2014, doctrine: '§112 indefiniteness', issue: 'Reasonable certainty standard', practicalUse: 'Applied when claim language may be too uncertain for a skilled artisan.', tags: ['112', 'indefiniteness', 'claim clarity'] },
    { name: 'Ariad Pharm., Inc. v. Eli Lilly & Co.', citation: '598 F.3d 1336 (Fed. Cir. 2010)', year: 2010, doctrine: '§112 written description', issue: 'Possession of full claim scope', practicalUse: 'Important when broad biotech or genus claims may exceed what the specification shows.', tags: ['112', 'written description', 'biotech'] },
    { name: 'In re Wands', citation: '858 F.2d 731 (Fed. Cir. 1988)', year: 1988, doctrine: '§112 enablement', issue: 'Undue experimentation factors', practicalUse: 'Useful for screening whether broad claims require too much experimentation.', tags: ['112', 'enablement', 'biotech'] },
    { name: 'Phillips v. AWH Corp.', citation: '415 F.3d 1303 (Fed. Cir. 2005)', year: 2005, doctrine: 'Claim construction', issue: 'Importance of specification in construing claims', practicalUse: 'Supports reading claims in view of the specification and intrinsic record.', tags: ['claim construction', '112'] },
    { name: 'Markman v. Westview Instruments, Inc.', citation: '517 U.S. 370 (1996)', year: 1996, doctrine: 'Claim construction', issue: 'Court decides claim meaning', practicalUse: 'Important for explaining why consistent terminology and claim framing matter.', tags: ['claim construction'] },
    { name: 'Alice Corp. v. CLS Bank Int’l', citation: '573 U.S. 208 (2014)', year: 2014, doctrine: '§101 eligibility', issue: 'Abstract idea framework', practicalUse: 'Central case for software and computer-implemented invention eligibility analysis.', tags: ['101', 'eligibility', 'software'] },
    { name: 'Mayo Collaborative Servs. v. Prometheus Labs., Inc.', citation: '566 U.S. 66 (2012)', year: 2012, doctrine: '§101 eligibility', issue: 'Natural law framework', practicalUse: 'Important for diagnostics and biotech claims tied to natural relationships.', tags: ['101', 'eligibility', 'biotech'] },
    { name: 'Diamond v. Diehr', citation: '450 U.S. 175 (1981)', year: 1981, doctrine: '§101 eligibility', issue: 'Technological process can remain eligible', practicalUse: 'Helps when software or algorithms are tied to a specific industrial process.', tags: ['101', 'eligibility', 'software'] },
    { name: 'Diamond v. Chakrabarty', citation: '447 U.S. 303 (1980)', year: 1980, doctrine: '§101 eligibility', issue: 'Patentable subject matter in biotechnology', practicalUse: 'Supports eligibility when claims are directed to human-made biological innovation.', tags: ['101', 'eligibility', 'biotech'] },
    { name: 'Festo Corp. v. Shoketsu Kinzoku Kogyo Kabushiki Co.', citation: '535 U.S. 722 (2002)', year: 2002, doctrine: 'Prosecution history estoppel', issue: 'Effect of narrowing amendments', practicalUse: 'Relevant when explaining why amendments may limit later doctrine-of-equivalents arguments.', tags: ['equivalents', 'estoppel'] },
    { name: 'Warner-Jenkinson Co. v. Hilton Davis Chem. Co.', citation: '520 U.S. 17 (1997)', year: 1997, doctrine: 'Doctrine of equivalents', issue: 'Equivalence analysis', practicalUse: 'Shows how small textual changes can still matter when evaluating infringement positions.', tags: ['equivalents'] },
    { name: 'eBay Inc. v. MercExchange, L.L.C.', citation: '547 U.S. 388 (2006)', year: 2006, doctrine: 'Remedies', issue: 'Injunction standard', practicalUse: 'Useful context for litigation strategy and why patent quality still affects downstream leverage.', tags: ['remedies'] },
    { name: 'Amgen Inc. v. Sanofi', citation: '598 U.S. 594 (2023)', year: 2023, doctrine: '§112 enablement', issue: 'Broad genus claims and enablement', practicalUse: 'Strong modern authority for biotech enablement risk on broad functional claims.', tags: ['112', 'enablement', 'biotech'] },
    { name: 'Berkheimer v. HP Inc.', citation: '881 F.3d 1360 (Fed. Cir. 2018)', year: 2018, doctrine: '§101 eligibility', issue: 'Fact-sensitive eligibility disputes', practicalUse: 'Helpful when arguing that claimed improvements are rooted in computer technology.', tags: ['101', 'eligibility', 'software'] },
    { name: 'In re Halliburton Energy Servs., Inc.', citation: '514 F.3d 1244 (Fed. Cir. 2008)', year: 2008, doctrine: '§112 indefiniteness', issue: 'Functional claiming concerns', practicalUse: 'Useful when a claim uses abstract result language without concrete boundaries.', tags: ['112', 'indefiniteness', 'claim clarity'] },
    { name: 'Verdegaal Bros. v. Union Oil Co.', citation: '814 F.2d 628 (Fed. Cir. 1987)', year: 1987, doctrine: '§102 anticipation', issue: 'Anticipation standard', practicalUse: 'Supports strict single-reference anticipation analysis.', tags: ['102', 'anticipation'] }
  ],
  filings: [
    {
      id: 'adaptive-enzyme-capsule',
      domain: 'Biotech',
      title: 'Adaptive Enzyme Preservation Capsule',
      summary: 'Field-deployable enzyme storage system with responsive preservation controls.',
      claims: '1. A preservation capsule comprising a chamber containing an enzyme formulation, a thermal buffer layer surrounding the chamber, a hydration control membrane configured to regulate moisture exchange, and a sensor-driven vent assembly configured to open when a threshold temperature condition is detected.\n2. The capsule of claim 1, wherein the thermal buffer layer comprises a phase-change material.\n3. The capsule of claim 1, wherein the vent assembly is triggered by a thermochromic sensor.',
      specText: 'The disclosure describes a portable preservation capsule for storing fragile enzyme formulations during field transport. A central chamber holds the formulation. A thermal buffer layer may include phase-change material to absorb thermal spikes. A hydration control membrane modulates moisture transfer to reduce degradation. A vent assembly may open when a sensor detects a threshold temperature or pressure event. Example embodiments include agricultural testing kits and mobile medical diagnostics.',
      references: [
        { title: 'Cold-chain biological transport pod', text: 'A portable transport pod includes a payload chamber, thermal buffering material around the chamber, a humidity regulating membrane, and a relief vent that opens under high-temperature excursion conditions.' },
        { title: 'Responsive specimen cartridge', text: 'A cartridge for transporting specimens includes a sensor that detects temperature excursion and actuates a venting mechanism to protect the stored sample.' }
      ],
      metrics: { novelty: 88, nonObviousness: 80, claimClarity: 85, enablement: 82, utility: 90, writtenDescription: 81, eligibility: 98 },
      tags: ['103', '112', 'biotech', 'enablement']
    },
    {
      id: 'clause-conflict-grid',
      domain: 'Legal Tech',
      title: 'Clause Conflict Detection Grid',
      summary: 'Contract analysis system that prioritizes clause hierarchy and contradiction mapping.',
      claims: '1. A computer-implemented method comprising receiving a contract document, extracting clauses into a structured hierarchy, assigning dependency links between clauses, detecting contradiction patterns among linked clauses, and outputting a ranked conflict map for attorney review.\n2. The method of claim 1, wherein the ranked conflict map highlights override language and inconsistent timelines.\n3. The method of claim 1, wherein the hierarchy is generated from headings, cross-references, and semantic role labeling.',
      specText: 'The system processes contract documents by segmenting clauses, mapping dependencies between obligations and exceptions, and ranking conflicts for review. A conflict map visually surfaces contradictions such as payment timing mismatches, superseding provisions, and hidden override clauses. The interface is intended to assist lawyers but not replace review.',
      references: [
        { title: 'Document clause extraction system', text: 'A software platform ingests contracts, parses clauses, and builds a hierarchical clause structure from headings and references.' },
        { title: 'Contradiction analysis engine', text: 'A legal analytics engine identifies inconsistent obligations and generates a ranked list of conflicting clauses for reviewer attention.' }
      ],
      metrics: { novelty: 74, nonObviousness: 67, claimClarity: 83, enablement: 77, utility: 89, writtenDescription: 78, eligibility: 62 },
      tags: ['101', '103', 'software']
    },
    {
      id: 'pressure-recovery-sleeve',
      domain: 'Medical Device',
      title: 'Variable Pressure Recovery Sleeve',
      summary: 'Compression sleeve with staged chamber control and recovery pacing.',
      claims: '1. A recovery sleeve comprising a textile body, a plurality of inflatable chambers distributed along the body, a pressure controller configured to inflate the chambers in a staged sequence, and a recovery profile memory storing patient-specific compression parameters.\n2. The sleeve of claim 1, wherein the staged sequence applies distal-to-proximal pressure.\n3. The sleeve of claim 1, wherein the controller updates the recovery profile based on pressure sensor feedback.',
      specText: 'A wearable recovery sleeve uses multiple inflatable chambers to deliver compression therapy. A controller sequences inflation and may adapt the compression pattern using sensor feedback. The sleeve stores patient profiles and can apply distal-to-proximal compression over timed intervals for rehabilitation.',
      references: [
        { title: 'Sequential compression garment', text: 'A therapy garment includes multiple inflatable chambers and a controller that inflates the chambers in sequence to improve circulation.' },
        { title: 'Adaptive rehabilitation sleeve', text: 'A rehabilitation sleeve stores user treatment profiles and modifies inflation pressure based on sensor readings.' }
      ],
      metrics: { novelty: 79, nonObviousness: 72, claimClarity: 84, enablement: 83, utility: 92, writtenDescription: 80, eligibility: 97 },
      tags: ['103', '112']
    },
    {
      id: 'self-healing-film',
      domain: 'Materials',
      title: 'Self-Healing Protective Polymer Film',
      summary: 'Protective layer using embedded repair capsules activated by abrasion events.',
      claims: '1. A protective film comprising a polymer matrix, a plurality of embedded repair capsules dispersed within the matrix, and an activation interface configured to rupture a subset of the repair capsules in response to abrasion, thereby releasing a healing agent into a damaged region.\n2. The film of claim 1, wherein the repair capsules contain a curable monomer.\n3. The film of claim 1, wherein the activation interface is formed by a brittle microstructure positioned near a surface region.',
      specText: 'The invention relates to coatings and films that self-repair after abrasion. Repair capsules are dispersed in a polymer matrix. When surface abrasion reaches a brittle activation interface, selected capsules rupture and release healing agent to the damaged region. Embodiments include automotive coatings and industrial protective wraps.',
      references: [
        { title: 'Microcapsule repair coating', text: 'A coating contains microcapsules that rupture upon crack propagation to release a healing composition.' },
        { title: 'Abrasion-sensitive polymer layer', text: 'A polymer layer includes a brittle region near the surface that responds to abrasion and can trigger local release events.' }
      ],
      metrics: { novelty: 82, nonObviousness: 76, claimClarity: 81, enablement: 78, utility: 88, writtenDescription: 79, eligibility: 99 },
      tags: ['103', '112', 'chemistry']
    },
    {
      id: 'signal-authentication-mesh',
      domain: 'Cybersecurity',
      title: 'Distributed Signal Authentication Mesh',
      summary: 'Network security system that validates device signals through rotating trust anchors.',
      claims: '1. A network authentication system comprising a plurality of edge nodes, a rotating trust-anchor schedule shared among the edge nodes, a validation engine configured to compare a received device signal against an expected anchor state, and a quarantine controller configured to isolate the device when the comparison falls outside a threshold confidence band.\n2. The system of claim 1, wherein the expected anchor state is updated according to node reputation.\n3. The system of claim 1, wherein the quarantine controller selectively restricts network privileges rather than terminating all communication.',
      specText: 'A distributed security system rotates trust anchors across edge nodes to validate device identity over time. The system compares observed device signals against expected anchor states and can isolate suspicious devices or reduce privileges. Implementations include industrial networks and medical IoT systems.',
      references: [
        { title: 'Dynamic trust schedule for edge devices', text: 'An edge security framework rotates trusted verification states among nodes to authenticate devices over time.' },
        { title: 'Network quarantine controller', text: 'A controller restricts access privileges for devices whose authentication score falls below a confidence threshold.' }
      ],
      metrics: { novelty: 77, nonObviousness: 70, claimClarity: 79, enablement: 75, utility: 90, writtenDescription: 77, eligibility: 68 },
      tags: ['101', '103', 'software']
    },
    {
      id: 'microfluidic-gradient-chip',
      domain: 'Bioengineering',
      title: 'Microfluidic Gradient Culture Chip',
      summary: 'Cell-culture chip with dynamic gradient control for comparative biological testing.',
      claims: '1. A microfluidic culture chip comprising a substrate defining a first inlet, a second inlet, a mixing region configured to establish a concentration gradient, a culture chamber fluidically coupled to the mixing region, and a control assembly configured to vary the gradient over time according to a programmed sequence.\n2. The chip of claim 1, wherein the programmed sequence varies pH and nutrient concentration.\n3. The chip of claim 1, wherein the control assembly adjusts flow through at least one microvalve.',
      specText: 'The disclosure concerns a microfluidic chip for growing or testing cells under varying concentration conditions. Two inlets feed a mixing region that generates gradients. A control assembly changes the gradient over time by adjusting one or more valves. Applications include drug testing and tissue engineering.',
      references: [
        { title: 'Gradient-forming microfluidic device', text: 'A microfluidic device with multiple inlets and a mixing region generates concentration gradients for cell culture.' },
        { title: 'Programmable microvalve controller', text: 'A controller adjusts microvalves over time according to a programmed sequence to change fluid conditions in a chamber.' }
      ],
      metrics: { novelty: 79, nonObviousness: 74, claimClarity: 82, enablement: 80, utility: 91, writtenDescription: 81, eligibility: 95 },
      tags: ['103', '112', 'biotech']
    }
  ]
};
