(() => {
  'use strict';

  const D = window.CRUSH_DATA;
  const {
    personas,
    personaOrder,
    dimensions,
    dimensionOrder,
    stages,
    questions,
    levels,
    partLabels,
    analysisLines
  } = D;

  const state = {
    view: 'landing',
    crushName: '',
    stage: null,
    answers: new Array(questions.length).fill(null),
    index: 0,
    result: null,
    shareDataUrl: null,
    shareText: '',
    locked: false,
    analysisRun: 0
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const pad = (num) => String(num).padStart(2, '0');

  const els = {
    views: $$('.view'),
    stageList: $('#stage-list'),
    nameInput: $('#crush-name'),
    quizView: $('#view-quiz'),
    segmentTrack: $('#segment-track'),
    quizCount: $('#quiz-count'),
    railPart: $('#rail-part'),
    railNumber: $('#rail-number'),
    railEn: $('#rail-en'),
    railNote: $('#rail-note'),
    partPill: $('#part-pill'),
    questionIndex: $('#question-index'),
    questionPanel: $('#question-panel'),
    questionTitle: $('#question-title'),
    questionHint: $('#question-hint'),
    optionList: $('#option-list'),
    prev: $('#btn-prev'),
    analysisPercent: $('#analysis-percent'),
    analysisLine: $('#analysis-line'),
    resultContent: $('#result-content'),
    indexGrid: $('#index-grid'),
    shareImage: $('#share-image'),
    shareTags: $('#share-tags'),
    nativeShare: $('#btn-native-share'),
    toast: $('#toast'),
    modalIndex: $('#modal-index'),
    modalShare: $('#modal-share')
  };

  let toastTimer = null;
  let lastFocused = null;
  let revealObserver = null;

  const levelPalettes = {
    high: ['#b79cff', '#f0d58a', 'rgba(151, 120, 255, 0.27)'],
    warm: ['#c0a2ff', '#ffb0d2', 'rgba(168, 130, 255, 0.23)'],
    mid: ['#8d6bff', '#7c9bff', 'rgba(141, 107, 255, 0.22)'],
    low: ['#7c8bd6', '#c9b8ff', 'rgba(124, 139, 214, 0.18)'],
    faint: ['#746d9c', '#c4b9df', 'rgba(116, 109, 156, 0.16)'],
    cold: ['#5e5a7a', '#a99bc8', 'rgba(94, 90, 122, 0.14)']
  };

  /* =========================================================
     Basics
     ========================================================= */

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function showView(name) {
    state.view = name;
    els.views.forEach((view) => {
      view.classList.toggle('is-active', view.id === `view-${name}`);
    });
    window.scrollTo(0, 0);
    if (name === 'landing') {
      document.title = '心动回响 · Ta是不是也在偷偷喜欢你？';
    }
  }

  function resetTestData() {
    state.answers = new Array(questions.length).fill(null);
    state.index = 0;
    state.result = null;
    state.shareDataUrl = null;
    state.shareText = '';
    state.locked = false;
    state.analysisRun += 1;
    if (revealObserver) {
      revealObserver.disconnect();
      revealObserver = null;
    }
  }

  function makeCaseNo(name, echo) {
    let seed = 0;
    for (const char of name) seed += char.charCodeAt(0);
    return String(1000 + ((seed + echo * 37) % 9000));
  }

  function renderStages() {
    els.stageList.innerHTML = stages
      .map(
        (stage) => `
        <button class="stage-chip${state.stage === stage.id ? ' is-active' : ''}" type="button" data-stage="${stage.id}" aria-pressed="${state.stage === stage.id}">
          ${stage.label}
        </button>`
      )
      .join('');
  }

  function openSetup() {
    closeAllModals();
    resetTestData();
    state.crushName = '';
    state.stage = null;
    els.nameInput.value = '';
    renderStages();
    showView('setup');
    document.title = '设置你的暗恋侦测 · 心动回响';
    setTimeout(() => {
      if (state.view === 'setup') els.nameInput.focus({ preventScroll: true });
    }, 180);
  }

  function startQuiz() {
    const name = (state.crushName || '').trim().slice(0, 12);
    state.crushName = name || 'Ta';
    resetTestData();
    showView('quiz');
    document.title = '暗恋信号侦测中 · 心动回响';
    renderQuestion(0, false);
  }

  /* =========================================================
     Quiz
     ========================================================= */

  function initSegments() {
    if (els.segmentTrack.children.length) return;
    els.segmentTrack.innerHTML = questions.map(() => '<span class="segment"></span>').join('');
  }

  function updateSegments() {
    initSegments();
    const segments = $$('.segment', els.segmentTrack);
    segments.forEach((segment, index) => {
      segment.classList.toggle('is-done', state.answers[index] !== null);
      segment.classList.toggle('is-current', index === state.index);
    });
    els.quizCount.textContent = `${pad(state.index + 1)} / ${pad(questions.length)}`;
  }

  function renderQuestion(index, animate = true) {
    const question = questions[index];
    const part = partLabels[question.part];
    state.index = index;

    els.quizView.dataset.part = String(question.part);
    els.railPart.textContent = part.no;
    els.railNumber.textContent = pad(index + 1);
    els.railEn.textContent = part.en;
    els.railNote.textContent = part.hint;
    els.partPill.textContent = part.name;
    els.questionIndex.textContent = `QUESTION ${pad(index + 1)}`;
    els.questionTitle.textContent = question.q;
    els.questionHint.textContent = question.hint;
    els.prev.disabled = index === 0;

    els.optionList.innerHTML = question.options
      .map((option, i) => {
        const selected = state.answers[index] === i;
        return `
          <button class="option${selected ? ' is-selected' : ''}" type="button" data-option="${i}" style="--i:${i}" aria-pressed="${selected}">
            <span class="option-num">${pad(i + 1)}</span>
            <span class="option-text">${escapeHtml(option.text)}</span>
            <span class="option-arrow" aria-hidden="true">↗</span>
          </button>`;
      })
      .join('');

    if (animate) {
      els.questionPanel.classList.remove('is-in', 'is-out');
      void els.questionPanel.offsetWidth;
      els.questionPanel.classList.add('is-in');
    }
    updateSegments();
    els.questionTitle.focus({ preventScroll: true });
  }

  function chooseOption(optionIndex) {
    if (state.locked || state.view !== 'quiz') return;
    const question = questions[state.index];
    if (!question || optionIndex < 0 || optionIndex >= question.options.length) return;

    state.answers[state.index] = optionIndex;
    $$('.option', els.optionList).forEach((button, i) => {
      const selected = i === optionIndex;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    updateSegments();

    state.locked = true;
    const isLast = state.index === questions.length - 1;
    setTimeout(() => {
      if (isLast) {
        state.locked = false;
        startAnalysis();
        return;
      }
      renderQuestion(state.index + 1);
      state.locked = false;
    }, 300);
  }

  function goPrev() {
    if (state.locked || state.view !== 'quiz' || state.index === 0) return;
    renderQuestion(state.index - 1);
  }

  /* =========================================================
     Scoring
     ========================================================= */

  function computeResult() {
    const selfAnswers = state.answers.slice(0, 10);
    const counts = Object.fromEntries(personaOrder.map((id) => [id, 0]));
    const recency = Object.fromEntries(personaOrder.map((id) => [id, -1]));

    selfAnswers.forEach((answer, index) => {
      const option = questions[index].options[answer];
      if (!option) return;
      counts[option.type] += 1;
      recency[option.type] = index;
    });

    const ranked = [...personaOrder].sort((a, b) => {
      return counts[b] - counts[a] || recency[b] - recency[a] || personaOrder.indexOf(a) - personaOrder.indexOf(b);
    });
    const primary = personas[ranked[0]];
    const secondary = personas[ranked[1]];

    const dimRaw = Object.fromEntries(dimensionOrder.map((id) => [id, 0]));
    let total = 0;
    state.answers.slice(10).forEach((answer, offset) => {
      const question = questions[offset + 10];
      const option = question.options[answer];
      if (!option) return;
      dimRaw[question.dimension] += option.points;
      total += option.points;
    });

    const dims = dimensionOrder.map((id) => {
      const raw = dimRaw[id];
      return {
        ...dimensions[id],
        raw,
        pct: Math.round(12 + (raw / 6) * 88)
      };
    });
    const strongest = [...dims].sort((a, b) => b.raw - a.raw || dimensionOrder.indexOf(a.id) - dimensionOrder.indexOf(b.id))[0];
    let weakest = [...dims].sort((a, b) => a.raw - b.raw || dimensionOrder.indexOf(a.id) - dimensionOrder.indexOf(b.id))[0];
    if (weakest.id === strongest.id) {
      weakest = dims.find((dim) => dim.id !== strongest.id) || weakest;
    }
    const balanced = new Set(dims.map((dim) => dim.raw)).size === 1;
    const noSignal = dims.every((dim) => dim.raw === 0);

    const echo = Math.max(8, Math.min(92, Math.round(8 + (total / 30) * 84)));
    const level = levels.find((item) => echo >= item.min) || levels[levels.length - 1];
    const stage = stages.find((item) => item.id === state.stage) || null;
    const crushName = state.crushName || 'Ta';

    return {
      primary,
      secondary,
      counts,
      dims,
      strongest,
      weakest,
      echo,
      level,
      balanced,
      noSignal,
      stage,
      crushName,
      caseNo: makeCaseNo(crushName, echo),
      palette: levelPalettes[level.key] || levelPalettes.mid
    };
  }

  /* =========================================================
     Analysis
     ========================================================= */

  function startAnalysis() {
    const runId = ++state.analysisRun;
    showView('analysis');
    document.title = '正在扫描Ta的心动信号 · 心动回响';
    els.analysisPercent.innerHTML = '00<small>%</small>';
    els.analysisLine.textContent = analysisLines[0];
    els.analysisLine.style.opacity = '1';

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduced ? 650 : 2400;
    const start = performance.now();
    let lineIndex = 0;

    const lineTimer = setInterval(() => {
      if (runId !== state.analysisRun) return;
      lineIndex = (lineIndex + 1) % analysisLines.length;
      els.analysisLine.style.opacity = '0';
      setTimeout(() => {
        if (runId !== state.analysisRun) return;
        els.analysisLine.textContent = analysisLines[lineIndex];
        els.analysisLine.style.opacity = '1';
      }, 150);
    }, 570);

    function tick(now) {
      if (runId !== state.analysisRun) return;
      const progress = Math.min(1, (now - start) / duration);
      els.analysisPercent.innerHTML = `${pad(Math.round(progress * 100))}<small>%</small>`;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    setTimeout(() => {
      clearInterval(lineTimer);
      if (runId !== state.analysisRun) return;
      els.analysisPercent.innerHTML = '100<small>%</small>';
      const result = computeResult();
      state.result = result;
      state.shareDataUrl = null;
      renderResult(result);
    }, duration + 110);
  }

  /* =========================================================
     Result
     ========================================================= */

  function renderResult(result) {
    const {
      primary,
      secondary,
      dims,
      strongest,
      weakest,
      balanced,
      noSignal,
      echo,
      level,
      stage,
      crushName,
      caseNo,
      palette
    } = result;
    const safeName = escapeHtml(crushName);
    const delicateWeak = !balanced && weakest.pct >= 75;
    let strongLabel = strongest.pct >= 80 ? 'STRONGEST SIGNAL / 最强信号' : 'RELATIVE SIGNAL / 相对最强';
    let strongText = strongest.pct >= 80
      ? strongest.strong
      : strongest.pct >= 55
        ? `Ta在${strongest.name}上的信号比较明显，但还需要更多观察。`
        : `这一项是五个维度里相对最明显的，但整体信号仍然偏弱。`;
    let weakLabel = balanced
      ? 'SIGNAL BALANCE / 信号分布'
      : delicateWeak
        ? 'RELATIVE SIGNAL / 相对最弱'
        : 'WEAKEST SIGNAL / 最弱信号';
    let weakTitle = balanced ? '五个信号势均力敌' : `${weakest.name} ${weakest.pct}%`;
    let weakText = balanced
      ? '这一组信号没有明显短板，也没有压倒性的证据。别只看分数，回到你们的真实相处里。'
      : delicateWeak
        ? `即使这是五项里相对较弱的一项，也已经有 ${weakest.pct}% 的信号。Ta的表达可能只是更克制。`
        : weakest.weak;

    if (noSignal) {
      strongLabel = 'NO CLEAR SIGNAL / 未捕捉到信号';
      strongText = '从你提供的观察来看，五个维度都很安静。目前没有足够证据说明Ta在向你发出心动信号。';
      weakLabel = 'THIS IS NOT A VERDICT / 这不是判决';
      weakTitle = '别用一次测试给自己判刑';
      weakText = '一次观察不能定义关系。你可以把注意力收回一点，看看真实的相处会把你带到哪里。';
    }
    const strongestMeta = noSignal ? '暂无明确信号' : `${strongest.name} ${strongest.pct}%`;
    const stageLabel = stage ? stage.label : '关系未命名';
    const [levelA, levelB, levelGlow] = palette;

    const evidenceRows = dims
      .map(
        (dim) => `
        <div class="evidence-row" style="--dim-color:${dim.color}">
          <span class="evidence-icon">${dim.id.slice(0, 2).toUpperCase()}</span>
          <div class="evidence-main">
            <div class="evidence-label">
              <span class="evidence-name">${dim.name}</span>
              <span class="evidence-en">${dim.en}</span>
            </div>
            <div class="evidence-track"><i class="evidence-fill" data-width="${dim.pct}"></i></div>
          </div>
          <span class="evidence-value">${dim.pct}<small>%</small></span>
        </div>`
      )
      .join('');

    const blips = dims
      .map(
        (dim) => `<span class="r-blip r-blip--${dim.id}" style="--blip-color:${dim.color}"><i></i>${dim.name}</span>`
      )
      .join('');

    const tags = primary.tags.map((tag) => `<span class="result-tag">${tag}</span>`).join('');

    const html = `
      <article class="result-hero" style="--level-a:${levelA};--level-b:${levelB};--level-glow:${levelGlow}">
        <div class="result-hero-inner">
          <div class="result-topline">
            <span>CRUSH ECHO REPORT · CASE NO. ${caseNo}</span>
            <span>20 SIGNALS / 1 ANSWER</span>
          </div>
          <div class="result-main">
            <div class="result-copy">
              <p class="result-kicker">关于 <strong>「${safeName}」</strong> 的心动侦测 <span class="dot"></span> ${stageLabel}</p>
              <div class="result-score">
                <span class="score-num">${echo}</span>
                <span class="score-meta"><span>HEART ECHO INDEX</span><strong>心动回响指数</strong></span>
              </div>
              <h1 class="result-verdict">${level.title}</h1>
              <p class="result-sub">${level.sub}</p>
              <div class="result-persona">
                <span class="persona-label">你的暗恋人格 / YOUR CRUSH PERSONA</span>
                <div class="persona-name-row">
                  <span class="persona-name">${primary.name}</span>
                  <span class="persona-name-en">${primary.en}</span>
                </div>
                <div class="result-tags">${tags}</div>
                <span class="result-level">${level.label} · 副人格 ${secondary.name}</span>
              </div>
            </div>
            <div class="result-radar-wrap">
              <div class="result-radar">
                <span class="r-ring r-ring--one"></span>
                <span class="r-ring r-ring--two"></span>
                <span class="r-ring r-ring--three"></span>
                <span class="r-ring r-ring--four"></span>
                <span class="r-axis r-axis--x"></span>
                <span class="r-axis r-axis--y"></span>
                <span class="r-sweep"></span>
                ${blips}
                <span class="r-you"><i></i>YOU</span>
                <span class="r-ta"><i></i>TA</span>
                <span class="result-radar-caption">SIGNAL MAP / 5 CHANNELS<br>${strongestMeta}</span>
              </div>
            </div>
          </div>
          <div class="result-hero-bottom">
            <div class="result-hero-meta">
              <span>TO <b>${safeName}</b></span>
              <span class="sep"></span>
              <span>关系 <b>${stageLabel}</b></span>
              <span class="sep"></span>
              <span>最强信号 <b>${strongestMeta}</b></span>
            </div>
            <button class="hero-share" type="button" data-share-card>
              <span class="hero-share-label">生成分享卡</span><span class="hero-share-icon" aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      </article>

      <div class="result-body">
        <section class="result-section reveal-up">
          <div class="section-head">
            <div class="section-heading">
              <span class="section-no">01</span>
              <h2 class="section-title">Ta的心动证据</h2>
            </div>
            <span class="section-en">THE EVIDENCE</span>
          </div>
          <div class="evidence-layout">
            <div class="evidence-list">${evidenceRows}</div>
            <aside class="evidence-aside">
              <article class="evidence-note evidence-note--strong">
                <span class="note-label">${strongLabel}</span>
                <h3 class="note-title">${noSignal ? '五个信号都很安静' : `${strongest.name} ${strongest.pct}%`}</h3>
                <p class="note-text">${strongText}</p>
              </article>
              <article class="evidence-note">
                <span class="note-label">${weakLabel}</span>
                <h3 class="note-title">${weakTitle}</h3>
                <p class="note-text">${weakText}</p>
              </article>
            </aside>
          </div>
        </section>

        <section class="result-section reveal-up">
          <div class="section-head">
            <div class="section-heading">
              <span class="section-no">02</span>
              <h2 class="section-title">你的暗恋人格</h2>
            </div>
            <span class="section-en">CRUSH PERSONA</span>
          </div>
          <div class="persona-layout">
            <article class="persona-feature" style="--persona-color:${primary.color}">
              <span class="section-en">PERSONA ${primary.no} / 10</span>
              <h3>${primary.name}</h3>
              <p class="persona-feature-en">${primary.en}</p>
              <p class="tagline">${primary.tagline}</p>
              <p class="desc">${primary.desc}</p>
              <div class="result-tags">${tags}</div>
              <p class="persona-quote">${primary.quote}</p>
            </article>
            <div class="persona-cards">
              <article class="persona-mini" style="--persona-color:${primary.color}">
                <span class="persona-mini-label">HIDDEN HABIT / 藏不住的小动作</span>
                <h4>你身体比嘴诚实</h4>
                <p>${primary.habit}</p>
              </article>
              <article class="persona-mini" style="--persona-color:${primary.color}">
                <span class="persona-mini-label">INNER SCENE / 你的内心戏</span>
                <h4>你在心里说过很多次</h4>
                <p>${primary.inner}</p>
              </article>
              <article class="persona-mini" style="--persona-color:${primary.color}">
                <span class="persona-mini-label">TA'S VIEW / Ta可能怎么看你</span>
                <h4>Ta看到的版本</h4>
                <p>${primary.taView}</p>
              </article>
              <article class="persona-mini" style="--persona-color:${primary.color}">
                <span class="persona-mini-label">BLIND SPOT / 你最容易误读</span>
                <h4>别让想象替你回答</h4>
                <p>${primary.bias}</p>
              </article>
            </div>
          </div>
        </section>

        <section class="result-section reveal-up">
          <div class="section-head">
            <div class="section-heading">
              <span class="section-no">03</span>
              <h2 class="section-title">下一步怎么走</h2>
            </div>
            <span class="section-en">NEXT MOVE</span>
          </div>
          <div class="next-grid">
            <article class="next-card">
              <span class="next-no">01 / PERSONAL MOVE</span>
              <h4>最适合你的小动作</h4>
              <p>${primary.move}</p>
              <span class="next-caption">DO THIS ONCE</span>
            </article>
            <article class="next-card">
              <span class="next-no">02 / PACE</span>
              <h4>现在的节奏</h4>
              <p>${level.next[0]}</p>
              <span class="next-caption">DON'T RUSH</span>
            </article>
            <article class="next-card">
              <span class="next-no">03 / AVOID</span>
              <h4>先别做这件事</h4>
              <p>${primary.trap}</p>
              <span class="next-caption">KEEP YOURSELF</span>
            </article>
          </div>
          <p class="next-line">“${level.line}”</p>
        </section>

        <section class="share-cta reveal-up">
          <div class="share-cta-copy">
            <p class="eyebrow"><span class="live-dot"></span> SHARE YOUR ECHO</p>
            <h3>这一份心动，<br>值得被听见。</h3>
            <p>生成 1080 × 1440 的专属分享卡。带上你的回响指数和暗恋人格，去找到那个懂你欲言又止的人。</p>
          </div>
          <button class="btn-main" type="button" data-share-card><span>生成分享卡</span><span class="btn-symbol">↗</span></button>
        </section>
        <p class="result-disclaimer">本测试基于你对Ta的观察，不构成读心、心理诊断或关系保证。心动回响指数是叙事化的结果，真正的答案在你们的相处里。样本占比与人格设定仅用于产品表达。</p>
      </div>`;

    els.resultContent.innerHTML = html;
    document.title = `关于「${crushName}」的心动回响：${echo}% · 心动回响`;
    showView('result');

    const verdict = $('.result-verdict', els.resultContent);
    if (verdict) {
      verdict.setAttribute('tabindex', '-1');
      setTimeout(() => verdict.focus({ preventScroll: true }), 100);
    }

    animateEvidenceBars();
    initRevealObserver();
    state.shareText = buildShareText(result);

    setTimeout(() => {
      if (state.result === result) prepareShareCard().catch(() => {});
    }, 950);
  }

  function animateEvidenceBars() {
    setTimeout(() => {
      $$('.evidence-fill', els.resultContent).forEach((fill) => {
        fill.style.width = `${fill.dataset.width}%`;
      });
    }, 230);
  }

  function initRevealObserver() {
    if (revealObserver) revealObserver.disconnect();
    const items = $$('.reveal-up', els.resultContent);
    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.07, rootMargin: '0px 0px -40px 0px' }
    );
    items.forEach((item) => revealObserver.observe(item));
  }

  /* =========================================================
     Index
     ========================================================= */

  function renderIndex() {
    els.indexGrid.innerHTML = personaOrder
      .map((id) => {
        const persona = personas[id];
        return `
          <article class="index-card" style="--persona-color:${persona.color}">
            <div class="index-top"><span>TYPE ${persona.no}</span><span>CRUSH MODE</span></div>
            <h3>${persona.name}</h3>
            <p class="index-en">${persona.en}</p>
            <p class="index-tags">${persona.tags.join(' · ')}</p>
          </article>`;
      })
      .join('');
  }

  /* =========================================================
     Modals
     ========================================================= */

  function openModal(modal) {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    const focusTarget = modal.querySelector('.modal-close, button, a');
    if (focusTarget) setTimeout(() => focusTarget.focus({ preventScroll: true }), 80);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.modal.is-open')) document.body.classList.remove('modal-open');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus({ preventScroll: true });
  }

  function closeAllModals() {
    $$('.modal.is-open').forEach((modal) => closeModal(modal));
  }

  function trapFocus(event) {
    const open = $('.modal.is-open');
    if (!open || event.key !== 'Tab') return;
    const focusables = $$('button, a[href], input, textarea, [tabindex]:not([tabindex="-1"])', open).filter(
      (el) => !el.disabled && el.offsetParent !== null
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  async function openShareModal() {
    if (!state.result) return;
    const buttons = $$('[data-share-card]');
    const originals = buttons.map((button) => ({
      button,
      label: button.querySelector('span')?.textContent || ''
    }));
    buttons.forEach((button) => {
      button.disabled = true;
      const label = button.querySelector('span');
      if (label) label.textContent = '生成中';
    });

    try {
      if (!state.shareDataUrl) await prepareShareCard();
      if (!state.shareDataUrl) throw new Error('Share card unavailable');
      els.shareImage.src = state.shareDataUrl;
      els.shareImage.alt = `关于${state.result.crushName}的心动回响：${state.result.echo}%，暗恋人格${state.result.primary.name}`;
      els.shareTags.textContent = `${state.result.primary.keywords.join(' ')} #心动回响 #暗恋测试 #Ta喜欢你吗`;
      els.nativeShare.hidden = !navigator.share;
      openModal(els.modalShare);
    } catch (error) {
      showToast('分享卡生成失败，请再试一次');
    } finally {
      originals.forEach(({ button, label }) => {
        button.disabled = false;
        const target = button.querySelector('span');
        if (target) target.textContent = label;
      });
    }
  }

  /* =========================================================
     Share card
     ========================================================= */

  function buildShareText(result) {
    return [
      `我在「心动回响」测了${result.crushName}的心动回响：${result.echo}%`,
      result.level.title,
      `我的暗恋人格：${result.primary.name}（${result.primary.tagline}）`,
      `副人格：${result.secondary.name}`,
      '',
      '#心动回响 #暗恋测试 #Ta喜欢你吗'
    ].join('\n');
  }

  async function waitForFonts() {
    if (!document.fonts) return;
    try {
      await Promise.race([
        Promise.all([
          document.fonts.load('900 120px "Noto Sans SC"'),
          document.fonts.load('500 48px "Noto Serif SC"'),
          document.fonts.load('400 12px "Consolas"')
        ]),
        new Promise((resolve) => setTimeout(resolve, 1200))
      ]);
      await Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 1200))]);
    } catch (error) {
      /* system font fallback */
    }
  }

  function rgba(hex, alpha) {
    const value = hex.replace('#', '');
    const normalized = value.length === 3 ? value.split('').map((char) => char + char).join('') : value;
    const number = parseInt(normalized, 16);
    return `rgba(${(number >> 16) & 255}, ${(number >> 8) & 255}, ${number & 255}, ${alpha})`;
  }

  function roundedRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, height / 2, width / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  function drawTracking(ctx, text, x, y, spacing) {
    const chars = [...text];
    const widths = chars.map((char) => ctx.measureText(char).width);
    const total = widths.reduce((sum, width) => sum + width, 0) + Math.max(0, chars.length - 1) * spacing;
    let cursor = x;
    if (ctx.textAlign === 'right') cursor = x - total;
    else if (ctx.textAlign === 'center') cursor = x - total / 2;
    chars.forEach((char, index) => {
      ctx.fillText(char, cursor, y);
      cursor += widths[index] + spacing;
    });
    return cursor;
  }

  function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) {
    const noLineStart = '，。、；：！？）》」』】…%';
    const lines = [];
    let line = '';
    for (const char of text) {
      const test = line + char;
      if (line && ctx.measureText(test).width > maxWidth) {
        if (noLineStart.includes(char) && line.length > 1) {
          const carry = line.slice(-1);
          lines.push(line.slice(0, -1));
          line = carry + char;
        } else {
          lines.push(line);
          line = char;
        }
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);

    if (lines.length === 2) {
      const combined = lines[0] + lines[1];
      let best = null;
      for (let i = 1; i < combined.length; i += 1) {
        if (noLineStart.includes(combined[i])) continue;
        const first = combined.slice(0, i);
        const second = combined.slice(i);
        const firstWidth = ctx.measureText(first).width;
        const secondWidth = ctx.measureText(second).width;
        if (firstWidth <= maxWidth && secondWidth <= maxWidth) {
          const score = Math.abs(firstWidth - secondWidth);
          if (!best || score < best.score) best = { first, second, score };
        }
      }
      if (best) lines.splice(0, 2, best.first, best.second);
    }

    const visible = lines.slice(0, maxLines);
    if (lines.length > maxLines) visible[maxLines - 1] = `${visible[maxLines - 1].slice(0, -1)}…`;
    visible.forEach((current, index) => ctx.fillText(current, x, y + index * lineHeight));
    return y + visible.length * lineHeight;
  }

  function drawCanvasRadar(ctx, cx, cy, radius, result) {
    const [levelA, levelB] = result.palette;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
    const glow = ctx.createRadialGradient(cx, cy, radius * 0.05, cx, cy, radius);
    glow.addColorStop(0, rgba(levelA, 0.18));
    glow.addColorStop(0.55, rgba(levelB, 0.06));
    glow.addColorStop(1, 'rgba(11, 11, 22, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    if (typeof ctx.createConicGradient === 'function') {
      const sweep = ctx.createConicGradient(-Math.PI * 0.45, cx, cy);
      sweep.addColorStop(0, 'rgba(255,255,255,0)');
      sweep.addColorStop(0.16, 'rgba(255,255,255,0)');
      sweep.addColorStop(0.24, rgba(levelA, 0.2));
      sweep.addColorStop(0.34, 'rgba(255,255,255,0)');
      sweep.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = sweep;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    }
    ctx.restore();

    for (let i = 1; i <= 4; i += 1) {
      ctx.beginPath();
      ctx.arc(cx, cy, (radius * i) / 4, 0, Math.PI * 2);
      ctx.strokeStyle = i === 2 ? rgba(levelA, 0.28) : 'rgba(248, 244, 255, 0.12)';
      ctx.lineWidth = 1;
      if (i === 3) ctx.setLineDash([3, 7]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.strokeStyle = 'rgba(248, 244, 255, 0.09)';
    ctx.beginPath();
    ctx.moveTo(cx - radius, cy);
    ctx.lineTo(cx + radius, cy);
    ctx.moveTo(cx, cy - radius);
    ctx.lineTo(cx, cy + radius);
    ctx.stroke();

    const positions = [
      [-0.3, -0.5],
      [0.6, -0.16],
      [0.34, 0.56],
      [-0.58, 0.34],
      [-0.12, 0.03]
    ];
    result.dims.forEach((dim, index) => {
      const [px, py] = positions[index];
      const x = cx + px * radius;
      const y = cy + py * radius;
      ctx.save();
      ctx.shadowColor = dim.color;
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = dim.color;
      ctx.fill();
      ctx.restore();
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.strokeStyle = rgba(dim.color, 0.26);
      ctx.stroke();
    });

    const youX = cx - radius * 0.27;
    const youY = cy + radius * 0.4;
    const taX = cx + radius * 0.42;
    const taY = cy - radius * 0.38;
    ctx.setLineDash([2, 6]);
    ctx.beginPath();
    ctx.moveTo(youX, youY);
    ctx.lineTo(taX, taY);
    ctx.strokeStyle = 'rgba(248, 244, 255, 0.24)';
    ctx.stroke();
    ctx.setLineDash([]);

    [
      [youX, youY, levelA, 'YOU'],
      [taX, taY, '#F4D35E', 'TA']
    ].forEach(([x, y, color, label]) => {
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, 13, 0, Math.PI * 2);
      ctx.strokeStyle = rgba(color, 0.3);
      ctx.stroke();
      ctx.fillStyle = 'rgba(248,244,255,0.55)';
      ctx.font = '400 8px Consolas, monospace';
      ctx.fillText(label, x + 15, y + 3);
    });

    ctx.fillStyle = rgba(levelA, 0.8);
    ctx.font = '400 14px Consolas, monospace';
    ctx.fillText('+', cx - 4, cy + 5);
  }

  function drawTagPill(ctx, text, x, y, color, textColor = 'rgba(248,244,255,0.72)') {
    const width = ctx.measureText(text).width + 28;
    roundedRect(ctx, x, y, width, 34, 17);
    ctx.fillStyle = rgba(color, 0.075);
    ctx.fill();
    ctx.strokeStyle = rgba(color, 0.3);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = textColor;
    ctx.fillText(text, x + 14, y + 22);
    return width;
  }

  async function prepareShareCard() {
    if (!state.result) return null;
    if (state.shareDataUrl) return state.shareDataUrl;
    await waitForFonts();

    const result = state.result;
    const { primary, echo, level, dims, strongest, stage, crushName, caseNo, palette } = result;
    const [levelA, levelB] = palette;
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1440;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');

    const sans = '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif';
    const serif = '"Noto Serif SC", "Source Han Serif SC", "Songti SC", serif';
    const mono = 'Consolas, "Courier New", monospace';
    const cream = '#F8F4FF';
    const creamSoft = 'rgba(248, 244, 255, 0.58)';
    const creamFaint = 'rgba(248, 244, 255, 0.26)';

    // Background
    const bg = ctx.createLinearGradient(0, 0, 1080, 1440);
    bg.addColorStop(0, '#100b22');
    bg.addColorStop(0.58, '#080611');
    bg.addColorStop(1, '#0c081b');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1080, 1440);

    const glowA = ctx.createRadialGradient(860, 280, 20, 860, 280, 540);
    glowA.addColorStop(0, rgba(levelA, 0.28));
    glowA.addColorStop(0.55, rgba(levelA, 0.055));
    glowA.addColorStop(1, rgba(levelA, 0));
    ctx.fillStyle = glowA;
    ctx.fillRect(0, 0, 1080, 860);

    const glowB = ctx.createRadialGradient(120, 1120, 20, 120, 1120, 520);
    glowB.addColorStop(0, rgba('#7B61FF', 0.15));
    glowB.addColorStop(1, rgba('#7B61FF', 0));
    ctx.fillStyle = glowB;
    ctx.fillRect(0, 540, 760, 900);

    // Grid
    ctx.strokeStyle = 'rgba(248, 244, 255, 0.035)';
    ctx.lineWidth = 1;
    for (let x = 54; x < 1080; x += 54) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1440);
      ctx.stroke();
    }
    for (let y = 54; y < 1440; y += 54) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1080, y);
      ctx.stroke();
    }

    // Stars
    for (let i = 0; i < 90; i += 1) {
      const x = Math.random() * 1080;
      const y = Math.random() * 900;
      const size = Math.random() < 0.15 ? 2 : 1;
      ctx.fillStyle = `rgba(248, 244, 255, ${0.1 + Math.random() * 0.25})`;
      ctx.fillRect(x, y, size, size);
    }

    // Border and corner marks
    ctx.strokeStyle = 'rgba(248, 244, 255, 0.14)';
    ctx.strokeRect(42, 42, 996, 1356);
    ctx.strokeStyle = 'rgba(248, 244, 255, 0.28)';
    [
      [42, 42, 1, 1],
      [1038, 42, -1, 1],
      [42, 1398, 1, -1],
      [1038, 1398, -1, -1]
    ].forEach(([x, y, dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(x, y + dy * 14);
      ctx.lineTo(x, y);
      ctx.lineTo(x + dx * 14, y);
      ctx.stroke();
    });

    // Header
    ctx.textAlign = 'left';
    ctx.fillStyle = cream;
    ctx.font = `800 27px ${sans}`;
    ctx.fillText('心动回响', 80, 108);
    ctx.fillStyle = 'rgba(248, 244, 255, 0.42)';
    ctx.font = `400 10px ${mono}`;
    drawTracking(ctx, 'CRUSH ECHO', 80, 132, 3.4);

    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(248, 244, 255, 0.42)';
    ctx.font = `400 10px ${mono}`;
    drawTracking(ctx, 'SECRET SIGNAL REPORT', 1000, 105, 2.2);
    drawTracking(ctx, `2026 / CASE ${caseNo}`, 1000, 130, 2.2);

    ctx.strokeStyle = 'rgba(248, 244, 255, 0.16)';
    ctx.beginPath();
    ctx.moveTo(80, 162);
    ctx.lineTo(1000, 162);
    ctx.stroke();

    // Kicker
    ctx.textAlign = 'left';
    ctx.fillStyle = levelA;
    ctx.font = `500 14px ${mono}`;
    drawTracking(ctx, 'CRUSH ECHO REPORT', 80, 208, 2.4);
    ctx.fillStyle = creamSoft;
    ctx.font = `400 19px ${sans}`;
    ctx.fillText(`关于「${crushName}」的心动侦测`, 80, 244);
    if (stage) {
      ctx.fillStyle = 'rgba(248, 244, 255, 0.34)';
      ctx.font = `400 12px ${sans}`;
      ctx.fillText(`TO: ${crushName}  /  ${stage.label}`, 80, 270);
    }

    // Big score
    const scoreText = String(echo);
    ctx.font = `900 286px ${sans}`;
    const scoreWidth = ctx.measureText(scoreText).width;
    const scoreGradient = ctx.createLinearGradient(70, 250, 70 + scoreWidth, 480);
    scoreGradient.addColorStop(0, levelA);
    scoreGradient.addColorStop(1, levelB);
    ctx.fillStyle = scoreGradient;
    ctx.fillText(scoreText, 68, 490);
    ctx.font = `700 82px ${sans}`;
    ctx.fillStyle = levelB;
    ctx.fillText('%', 68 + scoreWidth + 8, 490);

    ctx.fillStyle = creamSoft;
    ctx.font = `400 12px ${mono}`;
    drawTracking(ctx, 'HEART ECHO INDEX / 心动回响指数', 74, 530, 1.8);

    // Radar
    drawCanvasRadar(ctx, 842, 350, 145, result);

    // Verdict
    ctx.fillStyle = cream;
    ctx.font = `500 48px ${serif}`;
    const verdictY = wrapCanvasText(ctx, level.title, 80, 628, 900, 62, 2);
    ctx.fillStyle = creamSoft;
    ctx.font = `400 18px ${sans}`;
    wrapCanvasText(ctx, level.sub, 80, Math.max(714, verdictY + 19), 820, 29, 2);

    ctx.strokeStyle = 'rgba(248, 244, 255, 0.15)';
    ctx.beginPath();
    ctx.moveTo(80, 800);
    ctx.lineTo(1000, 800);
    ctx.stroke();

    // Persona
    ctx.fillStyle = primary.color;
    ctx.font = `500 11px ${mono}`;
    drawTracking(ctx, 'YOUR CRUSH PERSONA', 80, 840, 2);
    ctx.fillStyle = cream;
    ctx.font = `900 56px ${sans}`;
    ctx.fillText(primary.name, 78, 904);
    ctx.fillStyle = 'rgba(248, 244, 255, 0.36)';
    ctx.font = `400 10px ${mono}`;
    drawTracking(ctx, primary.en, 82, 928, 2.5);

    ctx.fillStyle = 'rgba(248, 244, 255, 0.65)';
    ctx.font = `400 18px ${serif}`;
    wrapCanvasText(ctx, primary.tagline, 80, 965, 840, 30, 1);

    ctx.font = `400 14px ${sans}`;
    let tagX = 80;
    primary.tags.forEach((tag, index) => {
      const width = drawTagPill(ctx, tag, tagX, 992, index === 1 ? levelA : primary.color, index === 1 ? 'rgba(248,244,255,0.82)' : 'rgba(248,244,255,0.62)');
      tagX += width + 9;
    });

    // Evidence
    ctx.fillStyle = cream;
    ctx.font = `500 14px ${sans}`;
    ctx.fillText("TA'S SIGNALS / 心动证据", 80, 1085);
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(248, 244, 255, 0.3)';
    ctx.font = `400 9px ${mono}`;
    drawTracking(ctx, '5 CHANNELS / 10 CLUES', 1000, 1085, 1.6);
    ctx.textAlign = 'left';

    const rows = [
      { label: '主动靠近', en: 'INITIATIVE' },
      { label: '关注细节', en: 'ATTENTION' },
      { label: '特殊对待', en: 'SPECIAL' },
      { label: '身体语言', en: 'BODY SIGNAL' },
      { label: '情绪回响', en: 'EMOTIONAL ECHO' }
    ];
    dims.forEach((dim, index) => {
      const y = 1120 + index * 42;
      ctx.fillStyle = 'rgba(248, 244, 255, 0.72)';
      ctx.font = `400 14px ${sans}`;
      ctx.fillText(rows[index].label, 80, y + 4);
      ctx.fillStyle = 'rgba(248, 244, 255, 0.3)';
      ctx.font = `400 8px ${mono}`;
      drawTracking(ctx, rows[index].en, 178, y + 2, 1.2);

      ctx.fillStyle = 'rgba(248, 244, 255, 0.15)';
      ctx.fillRect(350, y, 560, 3);
      ctx.fillStyle = dim.color;
      ctx.fillRect(350, y, (560 * dim.pct) / 100, 3);

      ctx.textAlign = 'right';
      ctx.fillStyle = cream;
      ctx.font = `700 17px ${mono}`;
      ctx.fillText(`${dim.pct}%`, 1000, y + 6);
      ctx.textAlign = 'left';
    });

    // Footer
    ctx.strokeStyle = 'rgba(248, 244, 255, 0.14)';
    ctx.beginPath();
    ctx.moveTo(80, 1340);
    ctx.lineTo(1000, 1340);
    ctx.stroke();

    ctx.fillStyle = 'rgba(248, 244, 255, 0.42)';
    ctx.font = `400 9px ${mono}`;
    drawTracking(ctx, '心动回响 · CRUSH ECHO', 80, 1375, 1.7);
    ctx.textAlign = 'right';
    drawTracking(ctx, '20 SIGNALS · 1 ANSWER', 1000, 1375, 1.7);
    ctx.textAlign = 'left';

    // Fine grain
    for (let i = 0; i < 1900; i += 1) {
      const x = Math.random() * 1080;
      const y = Math.random() * 1440;
      ctx.fillStyle = `rgba(248, 244, 255, ${Math.random() * 0.06})`;
      ctx.fillRect(x, y, 1, 1);
    }

    if (state.result !== result) return null;
    state.shareDataUrl = canvas.toDataURL('image/png');
    return state.shareDataUrl;
  }

  function downloadShareCard() {
    if (!state.shareDataUrl || !state.result) {
      showToast('分享卡还在生成，请稍等一下');
      return;
    }
    const link = document.createElement('a');
    link.href = state.shareDataUrl;
    link.download = `心动回响-${state.result.primary.name}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('分享卡已保存');
  }

  async function copyShareText() {
    const text = state.shareText || (state.result ? buildShareText(state.result) : '');
    if (!text) return;
    let copied = false;
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch (error) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        copied = document.execCommand('copy');
      } catch (fallbackError) {
        copied = false;
      }
      textarea.remove();
    }
    showToast(copied ? '分享文案已复制' : '复制失败，请手动选择文案');
  }

  async function nativeShare() {
    if (!state.result) return;
    const title = `关于${state.result.crushName}的心动回响：${state.result.echo}%`;
    const text = state.shareText;
    try {
      if (state.shareDataUrl && navigator.canShare) {
        const blob = await (await fetch(state.shareDataUrl)).blob();
        const file = new File([blob], `心动回响-${state.result.primary.name}.png`, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ title, text, files: [file] });
            showToast('已打开分享');
            return;
          } catch (fileError) {
            if (fileError && fileError.name === 'AbortError') return;
          }
        }
      }
      await navigator.share({ title, text });
      showToast('已打开分享');
    } catch (error) {
      if (error && error.name !== 'AbortError') showToast('当前浏览器不支持直接分享，可保存图片');
    }
  }

  function showToast(message) {
    if (!els.toast) return;
    clearTimeout(toastTimer);
    els.toast.textContent = message;
    els.toast.classList.add('is-visible');
    toastTimer = setTimeout(() => els.toast.classList.remove('is-visible'), 2400);
  }

  /* =========================================================
     Events
     ========================================================= */

  function bindEvents() {
    $('#btn-start').addEventListener('click', openSetup);
    $('#btn-setup-back').addEventListener('click', () => showView('landing'));
    $('#btn-enter').addEventListener('click', startQuiz);
    $('#btn-skip-setup').addEventListener('click', startQuiz);
    $('#btn-quiz-home').addEventListener('click', () => showView('landing'));
    $('#btn-quiz-close').addEventListener('click', () => showView('landing'));
    $('#btn-prev').addEventListener('click', goPrev);
    $('#btn-restart-top').addEventListener('click', openSetup);
    $('#btn-result-home').addEventListener('click', () => showView('landing'));
    $('#btn-result-restart').addEventListener('click', openSetup);
    $('#btn-index-start').addEventListener('click', openSetup);
    $('#btn-download').addEventListener('click', downloadShareCard);
    $('#btn-copy').addEventListener('click', copyShareText);
    els.nativeShare.addEventListener('click', nativeShare);

    $$('[data-go-home]').forEach((button) => button.addEventListener('click', () => showView('landing')));

    els.stageList.addEventListener('click', (event) => {
      const chip = event.target.closest('[data-stage]');
      if (!chip) return;
      state.stage = chip.dataset.stage;
      $$('.stage-chip', els.stageList).forEach((item) => {
        item.classList.toggle('is-active', item === chip);
        item.setAttribute('aria-pressed', String(item === chip));
      });
    });

    els.nameInput.addEventListener('input', () => {
      state.crushName = els.nameInput.value.slice(0, 12);
    });

    els.nameInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        startQuiz();
      }
    });

    els.optionList.addEventListener('click', (event) => {
      const option = event.target.closest('[data-option]');
      if (!option) return;
      chooseOption(Number(option.dataset.option));
    });

    document.addEventListener('click', (event) => {
      if (event.target.closest('[data-open-index]')) {
        openModal(els.modalIndex);
      }

      const closeTrigger = event.target.closest('[data-close-modal]');
      if (closeTrigger) closeModal(closeTrigger.closest('.modal'));

      const shareTrigger = event.target.closest('[data-share-card]');
      if (shareTrigger) {
        event.preventDefault();
        openShareModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      const open = $('.modal.is-open');
      if (open) {
        if (event.key === 'Escape') {
          event.preventDefault();
          closeModal(open);
          return;
        }
        trapFocus(event);
        return;
      }

      if (state.view === 'quiz') {
        if (/^[1-4]$/.test(event.key)) {
          event.preventDefault();
          chooseOption(Number(event.key) - 1);
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault();
          goPrev();
        }
      }
    });
  }

  function init() {
    initSegments();
    renderStages();
    renderIndex();
    bindEvents();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      $$('.ticker-track, .radar-sweep, .r-sweep, .a-sweep, .r-ring--three, .a-ring--two').forEach((element) => {
        element.style.animation = 'none';
      });
    }
  }

  init();
})();
