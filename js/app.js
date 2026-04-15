(function () {
  const data = window.PatentBenchData;
  const page = document.body.dataset.page;
  const STORAGE_KEY = 'patentbench-current-matter';
  const STORAGE_CHART = 'patentbench-current-chart';
  const STORAGE_OFFICE = 'patentbench-current-office';

  const $ = (id) => document.getElementById(id);
  const qs = (sel) => document.querySelector(sel);

  function normalize(text) {
    return String(text || '').toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function tokenize(text) {
    return normalize(text).split(' ').filter(Boolean);
  }

  function titleize(key) {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
  }

  function download(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function recommendationFromScore(score) {
    if (score >= 85) return 'Allowance leaning';
    if (score >= 70) return 'Office action leaning';
    return 'Rejection leaning';
  }

  function populateNavSelection() {
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('href') === location.pathname.split('/').pop()) {
        link.classList.add('active');
      }
    });
  }

  function defaultMatterFromFiling(filingId) {
    const filing = data.filings.find(f => f.id === filingId) || data.filings[0];
    return {
      filingId: filing.id,
      reviewMode: 'balanced',
      matterName: filing.title,
      techArea: filing.domain,
      summary: filing.summary,
      claimText: filing.claims.split('\n')[0],
      specText: filing.specText,
      references: filing.references.map(r => ({ title: r.title, text: r.text }))
    };
  }

  function blankMatter() {
    return {
      filingId: 'custom',
      reviewMode: 'balanced',
      matterName: '',
      techArea: '',
      summary: '',
      claimText: '',
      specText: '',
      references: []
    };
  }


  function matterHasUserContent(matter) {
    if (!matter) return false;
    const refs = Array.isArray(matter.references) ? matter.references : [];
    return Boolean(
      normalize(matter.matterName) ||
      normalize(matter.techArea) ||
      normalize(matter.summary) ||
      normalize(matter.claimText) ||
      normalize(matter.specText) ||
      refs.some(ref => normalize(`${ref.title || ''} ${ref.text || ''}`))
    );
  }

  function clearConsoleOutput() {
    if ($('filingTitle')) $('filingTitle').textContent = 'No matter loaded yet';
    if ($('filingSummary')) $('filingSummary').textContent = 'Start with a blank file, enter patent material, or click Load Sample Matter. Then click Run Full Examination.';
    if ($('metricGrid')) $('metricGrid').innerHTML = '';
    if ($('riskGrid')) $('riskGrid').innerHTML = '<div class="risk-card moderate"><div class="risk-label"><span>Waiting for input</span><span>—</span></div><div class="risk-note">No examination has been run yet.</div></div>';
    if ($('recommendationBand')) $('recommendationBand').textContent = 'Awaiting review';
    if ($('recommendationText')) $('recommendationText').innerHTML = '<p>Enter claim, specification, and reference material. Results will appear here after you run the examination.</p>';
    if ($('matchedCases')) $('matchedCases').innerHTML = '<article class="case-card"><h4>No matched cases yet</h4><p>Case recommendations will appear after the examination runs.</p></article>';
    if ($('quickMemo')) $('quickMemo').textContent = 'No office-action preview yet.';
    renderScoreRing(0, false);
  }

  function clearChartOutput() {
    if ($('claimChartBody')) $('claimChartBody').innerHTML = '<tr><td colspan="4" class="muted">No claim chart yet. Enter matter data or load the sample matter, then click Build Claim Chart.</td></tr>';
    if ($('chartSummary')) $('chartSummary').innerHTML = '<p>No chart generated yet.</p>';
  }

  function clearOfficeOutput() {
    if ($('officeActionMemo')) $('officeActionMemo').textContent = 'No office action generated yet. Enter matter data or load the sample matter, then click Generate Office Action.';
    if ($('officeBand')) $('officeBand').textContent = 'Awaiting review';
    if ($('riskGrid')) $('riskGrid').innerHTML = '<div class="risk-card moderate"><div class="risk-label"><span>Waiting for input</span><span>—</span></div><div class="risk-note">No office action has been generated yet.</div></div>';
    if ($('officeCases')) $('officeCases').innerHTML = '<article class="case-card"><h4>No matched cases yet</h4><p>Case support will appear after the office action is generated.</p></article>';
  }

  function getMatter() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    const base = blankMatter();
    saveMatter(base);
    return base;
  }

  function saveMatter(matter) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matter));
  }

  function setMatterFromForm() {
    const matter = {
      filingId: $('filingSelect') ? $('filingSelect').value : (getMatter().filingId || 'custom'),
      reviewMode: $('reviewLens') ? $('reviewLens').value : getMatter().reviewMode,
      matterName: $('matterName') ? $('matterName').value : getMatter().matterName,
      techArea: $('techArea') ? $('techArea').value : getMatter().techArea,
      summary: $('matterSummary') ? $('matterSummary').value : getMatter().summary,
      claimText: $('claimInput') ? $('claimInput').value : getMatter().claimText,
      specText: $('specInput') ? $('specInput').value : getMatter().specText,
      references: [1,2,3].map(i => ({
        title: $(`refTitle${i}`) ? $(`refTitle${i}`).value : '',
        text: $(`refText${i}`) ? $(`refText${i}`).value : ''
      })).filter(r => normalize(r.title + ' ' + r.text))
    };
    saveMatter(matter);
    return matter;
  }

  function fillFormFromMatter(matter) {
    if ($('filingSelect')) $('filingSelect').value = matter.filingId || data.filings[0].id;
    if ($('reviewLens')) $('reviewLens').value = matter.reviewMode || 'balanced';
    if ($('matterName')) $('matterName').value = matter.matterName || '';
    if ($('techArea')) $('techArea').value = matter.techArea || '';
    if ($('matterSummary')) $('matterSummary').value = matter.summary || '';
    if ($('claimInput')) $('claimInput').value = matter.claimText || '';
    if ($('specInput')) $('specInput').value = matter.specText || '';
    [1,2,3].forEach(i => {
      if ($(`refTitle${i}`)) $(`refTitle${i}`).value = matter.references[i-1] ? matter.references[i-1].title : '';
      if ($(`refText${i}`)) $(`refText${i}`).value = matter.references[i-1] ? matter.references[i-1].text : '';
    });
  }

  function loadSelectedFilingIntoMatter() {
    const filingId = $('filingSelect').value;
    const current = getMatter();
    const filing = data.filings.find(f => f.id === filingId) || data.filings[0];
    const merged = {
      ...current,
      filingId: filing.id,
      matterName: filing.title,
      techArea: filing.domain,
      summary: filing.summary,
      claimText: filing.claims.split('\n')[0],
      specText: filing.specText,
      references: filing.references.map(r => ({ title: r.title, text: r.text }))
    };
    saveMatter(merged);
    fillFormFromMatter(merged);
    return merged;
  }

  function splitClaimIntoLimitations(claimText) {
    const cleaned = String(claimText || '').replace(/^\s*\d+\.\s*/, '').replace(/\s+/g, ' ').trim();
    if (!cleaned) return [];
    return cleaned
      .split(/;|,\s+wherein\s+|,\s+and\s+|\sand\s|\scomprising\s|\sconfigured to\s/gi)
      .map(s => s.trim())
      .filter(Boolean)
      .map((text, idx) => ({ id: idx + 1, text }));
  }

  function scoreLimitationAgainstReference(limitation, reference) {
    const limTokens = tokenize(limitation.text).filter(t => t.length > 3);
    const refText = normalize(reference.text);
    const hits = limTokens.filter(t => refText.includes(t));
    const ratio = limTokens.length ? hits.length / limTokens.length : 0;
    let coverage = 'Weak';
    if (ratio >= 0.65) coverage = 'Strong';
    else if (ratio >= 0.35) coverage = 'Partial';
    return {
      ratio,
      coverage,
      hitTerms: hits,
      excerpt: reference.text.slice(0, 180) + (reference.text.length > 180 ? '…' : ''),
      referenceTitle: reference.title
    };
  }

  function buildClaimChart(matter) {
    const segments = splitClaimIntoLimitations(matter.claimText);
    const references = matter.references || [];
    const rows = segments.map(seg => {
      const scores = references.map(ref => scoreLimitationAgainstReference(seg, ref));
      const best = scores.sort((a,b) => b.ratio - a.ratio)[0] || { ratio: 0, coverage: 'Weak', referenceTitle: 'No reference', excerpt: 'No reference text supplied.' };
      return {
        limitationId: seg.id,
        limitationText: seg.text,
        bestReference: best.referenceTitle,
        coverage: best.coverage,
        ratio: best.ratio,
        mapping: best.coverage === 'Weak'
          ? 'No strong single-reference mapping found. Attorney review needed.'
          : `${best.referenceTitle}: ${best.excerpt}`,
        allScores: references.map(ref => ({
          title: ref.title,
          ...scoreLimitationAgainstReference(seg, ref)
        }))
      };
    });
    const chart = { generatedAt: new Date().toISOString(), matterName: matter.matterName, rows };
    localStorage.setItem(STORAGE_CHART, JSON.stringify(chart));
    return chart;
  }

  function evaluate101(matter) {
    const claim = normalize(matter.claimText);
    const spec = normalize(matter.specText);
    const abstractTerms = ['computer', 'platform', 'ranked', 'map', 'analyze', 'score', 'detect', 'rule', 'model'];
    const biotechNatural = ['biomarker', 'correlation', 'metabolite', 'natural', 'diagnostic'];
    const concreteTerms = ['chamber', 'controller', 'membrane', 'polymer', 'valve', 'sensor', 'substrate', 'sleeve', 'capsule', 'film', 'chip'];
    const abstractHits = abstractTerms.filter(t => claim.includes(t)).length;
    const naturalHits = biotechNatural.filter(t => claim.includes(t) || spec.includes(t)).length;
    const concreteHits = concreteTerms.filter(t => claim.includes(t) || spec.includes(t)).length;
    if ((abstractHits >= 3 || naturalHits >= 2) && concreteHits < 2) {
      return {
        risk: 'Moderate–High Risk',
        note: 'The claim appears vulnerable to an abstract-idea or natural-law challenge because the technological implementation is thin.',
        authorities: ['Alice Corp. v. CLS Bank Int’l', 'Mayo Collaborative Servs. v. Prometheus Labs., Inc.']
      };
    }
    return {
      risk: 'Lower Risk',
      note: 'The claim is tied to concrete apparatus or process features when read as a whole.',
      authorities: ['Diamond v. Diehr', 'Diamond v. Chakrabarty']
    };
  }

  function evaluate102(chart) {
    if (!chart.rows.length) return { risk: 'Not Run', note: 'No claim chart has been generated yet.', authorities: [] };
    const weakRows = chart.rows.filter(r => r.ratio < 0.65);
    if (weakRows.length === 0) {
      return {
        risk: 'High Risk',
        note: 'Each limitation has at least one strong single-reference mapping, creating a serious anticipation concern subject to arrangement and claim construction.',
        authorities: ['In re Robertson', 'Verdegaal Bros. v. Union Oil Co.']
      };
    }
    return {
      risk: weakRows.length <= 1 ? 'Moderate Risk' : 'Lower Risk',
      note: `${weakRows.length} limitation(s) do not show strong coverage in any one reference, which weakens a strict anticipation theory.`,
      authorities: ['In re Robertson', 'Titanium Metals Corp. v. Banner']
    };
  }

  function evaluate103(chart) {
    if (!chart.rows.length) return { risk: 'Not Run', note: 'No claim chart has been generated yet.', authorities: [] };
    const distributed = chart.rows.filter(r => r.allScores.some(s => s.ratio >= 0.35)).length;
    const ratio = distributed / chart.rows.length;
    if (ratio >= 0.85) {
      return {
        risk: 'High Risk',
        note: 'The claim limitations are broadly distributed across the reference set, creating a strong combination-based obviousness concern.',
        authorities: ['Graham v. John Deere Co.', 'KSR Int’l Co. v. Teleflex Inc.']
      };
    }
    if (ratio >= 0.6) {
      return {
        risk: 'Moderate Risk',
        note: 'Several limitations appear across multiple references and may support an obviousness rationale if motivation to combine is persuasive.',
        authorities: ['Graham v. John Deere Co.', 'KSR Int’l Co. v. Teleflex Inc.']
      };
    }
    return {
      risk: 'Lower Risk',
      note: 'The references do not collectively cover enough limitations to create a straightforward combination theory.',
      authorities: ['Graham v. John Deere Co.']
    };
  }

  function evaluate112(matter, chart) {
    const claim = normalize(matter.claimText);
    const spec = normalize(matter.specText);
    const vagueTerms = ['optimized', 'effective', 'substantially', 'about', 'configured to', 'module', 'adapted to'];
    const vagueHits = vagueTerms.filter(t => claim.includes(t)).length;
    const claimTokens = tokenize(claim).filter(t => t.length > 3);
    const specTokens = tokenize(spec);
    const overlap = claimTokens.length ? claimTokens.filter(t => specTokens.includes(t)).length / claimTokens.length : 0;
    const weakRows = chart.rows.filter(r => r.ratio < 0.2).length;
    if (vagueHits >= 2 || overlap < 0.35 || weakRows >= 2) {
      return {
        risk: 'Moderate–High Risk',
        note: 'The claim may face indefiniteness, written-description, or enablement pressure because broad language is paired with thin specification support.',
        authorities: ['Nautilus, Inc. v. Biosig Instruments, Inc.', 'Ariad Pharm., Inc. v. Eli Lilly & Co.', 'In re Wands', 'Amgen Inc. v. Sanofi']
      };
    }
    return {
      risk: 'Lower Risk',
      note: 'The claim terms appear reasonably bounded and the specification shares substantial overlap with the claimed subject matter.',
      authorities: ['Phillips v. AWH Corp.', 'Ariad Pharm., Inc. v. Eli Lilly & Co.']
    };
  }

  function matchedCasesForMatter(matter, analysis) {
    const filing = data.filings.find(f => f.id === matter.filingId);
    const techHints = tokenize(matter.techArea).slice(0, 4);
    const desired = new Set([...(filing ? filing.tags : []), ...analysis.tagHints, ...techHints]);
    const matched = data.cases.filter(c => c.tags.some(t => desired.has(t)));
    return (matched.length ? matched : data.cases.slice(0, 8)).slice(0, 8);
  }

  function calculateWeightedScore(metrics, mode) {
    const weights = (data.reviewModes[mode] || data.reviewModes.balanced).weights;
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    const weighted = Object.keys(weights).reduce((sum, k) => sum + (metrics[k] * weights[k]), 0);
    return Math.round(weighted / total);
  }

  function buildMetricsForMatter(matter, chart, office) {
    const filing = data.filings.find(f => f.id === matter.filingId);
    let metrics = filing ? { ...filing.metrics } : { novelty: 75, nonObviousness: 72, claimClarity: 78, enablement: 75, utility: 85, writtenDescription: 76, eligibility: 74 };
    const weak = chart.rows.filter(r => r.coverage === 'Weak').length;
    const partial = chart.rows.filter(r => r.coverage === 'Partial').length;
    metrics.novelty = Math.max(40, Math.min(98, metrics.novelty - partial * 2 - weak * 5));
    metrics.nonObviousness = Math.max(35, Math.min(96, metrics.nonObviousness - partial * 3));
    metrics.claimClarity = Math.max(45, Math.min(96, metrics.claimClarity - (office.r112.risk.includes('High') ? 14 : office.r112.risk.includes('Moderate') ? 8 : 0)));
    metrics.enablement = Math.max(40, Math.min(96, metrics.enablement - (office.r112.risk.includes('High') ? 12 : office.r112.risk.includes('Moderate') ? 6 : 0)));
    metrics.eligibility = Math.max(35, Math.min(98, metrics.eligibility - (office.r101.risk.includes('High') ? 20 : office.r101.risk.includes('Moderate') ? 10 : 0)));
    return metrics;
  }

  function buildOfficeAction(matter, chart) {
    const r101 = evaluate101(matter);
    const r102 = evaluate102(chart);
    const r103 = evaluate103(chart);
    const r112 = evaluate112(matter, chart);
    const tagHints = [];
    if (r101.authorities.length) tagHints.push('101', 'eligibility');
    if (r102.authorities.length) tagHints.push('102', 'anticipation');
    if (r103.authorities.length) tagHints.push('103', 'obviousness');
    if (r112.authorities.length) tagHints.push('112', 'claim clarity', 'enablement');
    const missing = chart.rows.filter(r => r.coverage === 'Weak').map(r => `Limitation ${r.limitationId}: ${r.limitationText}`);
    const partial = chart.rows.filter(r => r.coverage === 'Partial').map(r => `Limitation ${r.limitationId}: ${r.limitationText}`);
    const memo = `UNITED STATES PATENT AND TRADEMARK OFFICE\n\nMatter: ${matter.matterName}\nTechnology Area: ${matter.techArea}\nReview Mode: ${(data.reviewModes[matter.reviewMode] || data.reviewModes.balanced).label}\n\nEXAMINER-STYLE ANALYSIS\n\nI. Claim Reviewed\n${matter.claimText || 'No claim entered.'}\n\nII. Section 101\nRisk Level: ${r101.risk}\nAnalysis: ${r101.note}\nAuthorities: ${r101.authorities.join('; ')}\n\nIII. Section 102\nRisk Level: ${r102.risk}\nAnalysis: ${r102.note}\nAuthorities: ${r102.authorities.join('; ')}\n${missing.length ? `Potentially missing from a single reference:\n- ${missing.join('\n- ')}` : 'All limitations have at least one strong single-reference mapping in the first-pass chart.'}\n\nIV. Section 103\nRisk Level: ${r103.risk}\nAnalysis: ${r103.note}\nAuthorities: ${r103.authorities.join('; ')}\n${partial.length ? `Combination-sensitive limitations:\n- ${partial.join('\n- ')}` : 'The chart does not show meaningful distributed coverage across multiple references.'}\n\nV. Section 112\nRisk Level: ${r112.risk}\nAnalysis: ${r112.note}\nAuthorities: ${r112.authorities.join('; ')}\n\nVI. Suggested Next Moves\n1. Tighten result-oriented or purely functional language in the independent claim.\n2. Add embodiment detail, thresholds, and fallback claim language where the specification is thin.\n3. Distinguish the strongest reference limitation by limitation.\n4. Build narrower dependent claims that preserve commercial value if a rejection appears likely.\n\nVII. Internal Note\nThis output is a drafting aid for attorney review. It does not replace prior-art searching, claim construction analysis, or legal judgment.`;
    const office = { generatedAt: new Date().toISOString(), r101, r102, r103, r112, memo, tagHints };
    localStorage.setItem(STORAGE_OFFICE, JSON.stringify(office));
    return office;
  }

  function renderMetricGrid(metrics) {
    const grid = $('metricGrid');
    if (!grid) return;
    grid.innerHTML = '';
    Object.entries(metrics).forEach(([key, value]) => {
      const card = document.createElement('div');
      card.className = 'metric-card';
      card.innerHTML = `<div class="metric-label"><span>${titleize(key)}</span><span>${value}</span></div><div class="progress"><span data-width="${value}%"></span></div>`;
      grid.appendChild(card);
    });
    requestAnimationFrame(() => {
      grid.querySelectorAll('.progress > span').forEach((bar, index) => {
        const width = bar.dataset.width || '0%';
        bar.style.width = '0%';
        bar.style.opacity = '0.2';
        setTimeout(() => {
          bar.style.width = width;
          bar.style.opacity = '1';
        }, 70 * index + 40);
      });
    });
  }

  function renderScoreRing(score, animate = true) {
    const target = $('ringValue');
    if (!target) return;
    const circumference = 2 * Math.PI * 48;
    target.style.strokeDasharray = `${circumference}`;
    if (!animate) {
      target.style.transition = 'none';
      target.style.strokeDashoffset = `${circumference - (score / 100) * circumference}`;
      if ($('overallScore')) $('overallScore').textContent = score;
      requestAnimationFrame(() => { target.style.transition = 'stroke-dashoffset 0.9s cubic-bezier(.2,.8,.2,1)'; });
      return;
    }
    target.style.transition = 'none';
    target.style.strokeDashoffset = `${circumference}`;
    if ($('overallScore')) $('overallScore').textContent = 0;
    requestAnimationFrame(() => {
      target.style.transition = 'stroke-dashoffset 0.9s cubic-bezier(.2,.8,.2,1)';
      target.style.strokeDashoffset = `${circumference - (score / 100) * circumference}`;
      if ($('overallScore')) $('overallScore').textContent = score;
    });
  }

  function renderRiskGrid(office) {
    const grid = $('riskGrid');
    if (!grid) return;
    const items = [
      ['101', office.r101],
      ['102', office.r102],
      ['103', office.r103],
      ['112', office.r112]
    ];
    grid.innerHTML = '';
    items.forEach(([stat, item]) => {
      const cls = item.risk.toLowerCase().includes('lower') ? 'low' : item.risk.toLowerCase().includes('moderate') ? 'moderate' : item.risk.toLowerCase().includes('high') ? 'high' : 'moderate';
      const block = document.createElement('div');
      block.className = `risk-card ${cls}`;
      block.innerHTML = `<div class="risk-label"><span>§${stat}</span><span>${item.risk}</span></div><div class="risk-note">${item.note}</div>`;
      grid.appendChild(block);
    });
  }

  function renderRecommendation(score, office) {
    if ($('recommendationBand')) $('recommendationBand').textContent = recommendationFromScore(score);
    if ($('recommendationText')) {
      $('recommendationText').innerHTML = `
        <p><strong>Primary issue:</strong> ${office.r103.note}</p>
        <p><strong>Drafting concern:</strong> ${office.r112.note}</p>
        <p><strong>Next move:</strong> Use the dedicated claim-chart and office-action pages to refine the analysis and export the memo.</p>
      `;
    }
  }

  function renderMatchedCases(cases, containerId) {
    const root = $(containerId);
    if (!root) return;
    root.innerHTML = '';
    cases.forEach(item => {
      const card = document.createElement('article');
      card.className = 'case-card';
      card.innerHTML = `<h4>${item.name}</h4><div class="case-meta"><span class="case-tag">${item.citation}</span><span class="case-tag">${item.doctrine}</span></div><p><strong>Issue:</strong> ${item.issue}</p><p><strong>Why it matters here:</strong> ${item.practicalUse}</p>`;
      root.appendChild(card);
    });
  }

  function renderClaimChartTable(chart, tbodyId) {
    const body = $(tbodyId);
    if (!body) return;
    body.innerHTML = '';
    if (!chart.rows.length) {
      body.innerHTML = '<tr><td colspan="4" class="muted">Enter claim and reference text to generate a chart.</td></tr>';
      return;
    }
    chart.rows.forEach(row => {
      const tr = document.createElement('tr');
      const cls = row.coverage === 'Strong' ? 'coverage-strong' : row.coverage === 'Partial' ? 'coverage-partial' : 'coverage-weak';
      tr.innerHTML = `<td>${row.limitationId}. ${row.limitationText}</td><td>${row.bestReference}</td><td>${row.mapping}</td><td><span class="coverage-pill ${cls}">${row.coverage}</span></td>`;
      body.appendChild(tr);
    });
  }

  function getOrBuildCurrentAnalysis() {
    const matter = getMatter();
    const chart = buildClaimChart(matter);
    const office = buildOfficeAction(matter, chart);
    const metrics = buildMetricsForMatter(matter, chart, office);
    const score = calculateWeightedScore(metrics, matter.reviewMode || 'balanced');
    return { matter, chart, office, metrics, score, cases: matchedCasesForMatter(matter, office) };
  }

  function exportJson() {
    const analysis = getOrBuildCurrentAnalysis();
    download('patentbench-matter.json', JSON.stringify(analysis, null, 2), 'application/json');
  }

  function exportHtmlMemo() {
    const analysis = getOrBuildCurrentAnalysis();
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Mock USPTO Office Action</title><style>body{font-family:Arial,sans-serif;padding:32px;line-height:1.6;color:#111}pre{white-space:pre-wrap;font-family:inherit}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #bbb;padding:8px;text-align:left;vertical-align:top}</style></head><body><h1>PatentBench Office Action Memo</h1><pre>${analysis.office.memo.replace(/</g,'&lt;')}</pre><h2>Claim Chart</h2><table><thead><tr><th>Limitation</th><th>Best Reference</th><th>Mapping</th><th>Coverage</th></tr></thead><tbody>${analysis.chart.rows.map(r=>`<tr><td>${r.limitationId}. ${r.limitationText}</td><td>${r.bestReference}</td><td>${r.mapping.replace(/</g,'&lt;')}</td><td>${r.coverage}</td></tr>`).join('')}</tbody></table></body></html>`;
    download('patentbench-office-action.html', html, 'text/html');
  }

  function bindSharedButtons() {
    ['saveMatterBtn','saveMatterBtn2','saveMatterBtn3'].forEach(id => {
      if ($(id)) $(id).addEventListener('click', () => { setMatterFromForm(); alert('Matter saved locally in this browser.'); });
    });
    ['loadSampleBtn','loadSampleBtn2','loadSampleBtn3'].forEach(id => {
      if ($(id)) $(id).addEventListener('click', () => {
        const matter = defaultMatterFromFiling(data.filings[0].id);
        saveMatter(matter);
        fillFormFromMatter(matter);
        if ($('filingSelect')) $('filingSelect').value = matter.filingId;
        if ($('reviewLens')) $('reviewLens').value = matter.reviewMode;
        if (page === 'console') runConsole();
        if (page === 'claim-chart') runChartPage();
        if (page === 'office-action') runOfficePage();
      });
    });
    ['exportJsonBtn','exportJsonBtn2','exportJsonBtn3'].forEach(id => { if ($(id)) $(id).addEventListener('click', exportJson); });
    ['exportHtmlBtn','exportHtmlBtn2','exportHtmlBtn3'].forEach(id => { if ($(id)) $(id).addEventListener('click', exportHtmlMemo); });
  }

  function populateFilingSelect() {
    const select = $('filingSelect');
    if (!select) return;
    select.innerHTML = '';
    data.filings.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.id;
      opt.textContent = `${f.title} (${f.domain})`;
      select.appendChild(opt);
    });
    select.value = getMatter().filingId || data.filings[0].id;
  }

  function populateModeSelect() {
    const select = $('reviewLens');
    if (!select) return;
    select.innerHTML = '';
    Object.entries(data.reviewModes).forEach(([value, item]) => {
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = item.label;
      select.appendChild(opt);
    });
    select.value = getMatter().reviewMode || 'balanced';
  }

  function runConsole() {
    const matter = setMatterFromForm();
    if (!matterHasUserContent(matter)) {
      clearConsoleOutput();
      return;
    }
    const analysis = getOrBuildCurrentAnalysis();
    $('filingTitle').textContent = analysis.matter.matterName || 'Untitled matter';
    $('filingSummary').textContent = analysis.matter.summary || 'Enter claim and reference material, then run the examination to generate a review snapshot.';
    renderMetricGrid(analysis.metrics);
    renderScoreRing(analysis.score);
    renderRiskGrid(analysis.office);
    renderRecommendation(analysis.score, analysis.office);
    renderMatchedCases(analysis.cases, 'matchedCases');
    if ($('quickMemo')) $('quickMemo').textContent = analysis.office.memo.split('\n\n').slice(0,4).join('\n\n');
  }

  function runChartPage() {
    const matter = setMatterFromForm();
    if (!matterHasUserContent(matter)) {
      clearChartOutput();
      return;
    }
    const chart = buildClaimChart(matter);
    renderClaimChartTable(chart, 'claimChartBody');
    if ($('chartSummary')) {
      const strong = chart.rows.filter(r => r.coverage === 'Strong').length;
      const partial = chart.rows.filter(r => r.coverage === 'Partial').length;
      const weak = chart.rows.filter(r => r.coverage === 'Weak').length;
      $('chartSummary').innerHTML = `<p><strong>${strong}</strong> strong mappings, <strong>${partial}</strong> partial mappings, and <strong>${weak}</strong> weak mappings were detected.</p><p>Use this chart as a first-pass mapping document. The strongest rows can be refined into citation-ready attorney work product.</p>`;
    }
  }

  function runOfficePage() {
    const matter = setMatterFromForm();
    if (!matterHasUserContent(matter)) {
      clearOfficeOutput();
      return;
    }
    const chart = buildClaimChart(matter);
    const office = buildOfficeAction(matter, chart);
    const metrics = buildMetricsForMatter(matter, chart, office);
    const score = calculateWeightedScore(metrics, matter.reviewMode || 'balanced');
    $('officeActionMemo').textContent = office.memo;
    if ($('officeBand')) $('officeBand').textContent = recommendationFromScore(score);
    renderRiskGrid(office);
    renderMatchedCases(matchedCasesForMatter(matter, office), 'officeCases');
  }

  function initConsolePage() {
    populateModeSelect();
    const matter = getMatter();
    fillFormFromMatter(matter);
    if ($('runReview')) $('runReview').addEventListener('click', runConsole);
    if ($('reviewLens')) $('reviewLens').addEventListener('change', () => { if (matterHasUserContent(setMatterFromForm())) runConsole(); });
    if (matterHasUserContent(matter)) {
      clearConsoleOutput();
    } else {
      clearConsoleOutput();
    }
  }

  function initClaimChartPage() {
    populateModeSelect();
    const matter = getMatter();
    fillFormFromMatter(matter);
    if ($('buildChartBtn')) $('buildChartBtn').addEventListener('click', runChartPage);
    clearChartOutput();
  }

  function initOfficePage() {
    populateModeSelect();
    const matter = getMatter();
    fillFormFromMatter(matter);
    if ($('generateOfficeBtn')) $('generateOfficeBtn').addEventListener('click', runOfficePage);
    clearOfficeOutput();
  }

  function initAnalysisPage() {
    const grid = $('engineGrid');
    if (!grid) return;
    grid.innerHTML = '';
    data.engines.forEach(engine => {
      const card = document.createElement('article');
      card.className = 'engine-card';
      card.innerHTML = `<h3>${engine.name}</h3><p>${engine.text}</p>`;
      grid.appendChild(card);
    });
  }

  function initCasesPage() {
    const list = $('caseList');
    const count = $('caseCount');
    const search = $('caseSearch');
    const filter = $('caseFilter');
    function render() {
      const q = normalize(search.value);
      const doctrine = filter.value;
      const filtered = data.cases.filter(c => {
        const matchesSearch = !q || normalize(`${c.name} ${c.citation} ${c.doctrine} ${c.issue} ${c.practicalUse}`).includes(q);
        const matchesFilter = doctrine === 'all' || normalize(c.doctrine).includes(normalize(doctrine)) || c.tags.includes(doctrine);
        return matchesSearch && matchesFilter;
      });
      count.textContent = `${filtered.length} cases shown`;
      list.innerHTML = '';
      filtered.forEach(item => {
        const card = document.createElement('article');
        card.className = 'case-card';
        card.innerHTML = `<h3>${item.name}</h3><div class="case-meta"><span class="case-tag">${item.citation}</span><span class="case-tag">${item.doctrine}</span></div><p><strong>Issue:</strong> ${item.issue}</p><p><strong>Practical use:</strong> ${item.practicalUse}</p>`;
        list.appendChild(card);
      });
    }
    search.addEventListener('input', render);
    filter.addEventListener('change', render);
    render();
  }

  function initMethodologyPage() {
    const root = $('weightsTable');
    if (!root) return;
    root.innerHTML = '';
    Object.entries(data.reviewWeights).forEach(([key, value]) => {
      const row = document.createElement('div');
      row.className = 'weight-row';
      row.innerHTML = `<span>${titleize(key)}</span><strong>${value}</strong>`;
      root.appendChild(row);
    });
  }

  function init() {
    populateNavSelection();
    bindSharedButtons();
    if (page === 'console') initConsolePage();
    if (page === 'analysis') initAnalysisPage();
    if (page === 'cases') initCasesPage();
    if (page === 'methodology') initMethodologyPage();
    if (page === 'claim-chart') initClaimChartPage();
    if (page === 'office-action') initOfficePage();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
