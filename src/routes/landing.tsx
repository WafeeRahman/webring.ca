import { Hono } from 'hono'
import { raw } from 'hono/html'
import type { Bindings } from '../types'
import { getActiveMembers } from '../data'
import Layout from '../templates/Layout'

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
  c.header('Cache-Control', 'public, max-age=300')
  const active = await getActiveMembers(c.env.WEBRING)

  return c.html(
    <Layout fullHeight hideChrome>
      {raw(`<style>
        html, body { color-scheme: light; background: #fff; color: #000; }
        .landing {
          display: flex;
          flex: 1;
          min-height: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* ── Left column — single CSS grid ── */
        .landing-left {
          flex: 0 0 47%;
          display: grid;
          grid-template-rows:
            auto          /* title */
            auto 1fr      /* about header, about body (open) */
            auto 0fr      /* members header, members body */
            auto 0fr;     /* join header, join body */
          transition: grid-template-rows 0.4s ease;
          align-content: start;
          border-left: 2px solid #000;
          border-right: 2px solid #000;
        }

        /* ── Site title ── */
        .landing-title {
          font-size: 3.5rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          padding: 1.5rem 2rem;
          line-height: 1.1;
          color: #000;
          text-decoration: none;
          display: block;
        }

        /* ── Accordion headers ── */
        .accordion-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.1rem 2rem;
          background: none;
          border: none;
          border-top: 2px solid #000;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 2.8rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: #000;
          text-align: left;
          line-height: 1.15;
        }
        .accordion-toggle {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          border: 1.5px solid #000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .accordion-toggle svg {
          width: 16px;
          height: 16px;
          stroke: #000;
          stroke-width: 2;
          fill: none;
        }

        /* ── Accordion bodies ── */
        .accordion-body {
          overflow: hidden;
          min-height: 0;
        }
        .accordion-body-inner {
          padding: 0 2rem 1.8rem;
        }
        .accordion-about {
          font-size: 1.15rem;
          font-weight: 400;
          line-height: 1.55;
          color: #000;
          max-width: 42ch;
        }

        /* ── Members list ── */
        .member-list { list-style: none; padding-left: 0; }
        .member-list li {
          padding: 0.6rem 0;
          border-bottom: 1px solid #ddd;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .member-list li:first-child { border-top: 1px solid #ddd; }
        .member-list-name {
          font-size: 1rem;
          font-weight: 600;
          color: #000;
          text-decoration: none;
        }
        .member-list-name:hover { color: #c22; }
        .member-list-meta {
          font-size: 0.8rem;
          font-weight: 400;
          color: #888;
        }

        /* ── Join section ── */
        .join-text {
          font-size: 1.05rem;
          line-height: 1.55;
          color: #000;
          margin-bottom: 1rem;
        }
        .join-link {
          font-size: 0.9rem;
          font-weight: 700;
          color: #c22;
          text-decoration: none;
        }
        .join-link:hover { opacity: 0.7; }

        /* ── Right column ── */
        .landing-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .landing-right img {
          max-width: 300px;
          width: 55%;
          height: auto;
          display: block;
        }
        .drag-hint {
          position: absolute;
          bottom: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          color: #000;
          letter-spacing: 0.01em;
        }
        .drag-hint-arrow {
          font-size: 1rem;
        }

        /* ── Responsive ── */
        @media (max-width: 767px) {
          .landing { flex-direction: column; height: auto; }
          .landing-left {
            border-left: none;
            border-right: none;
            border-bottom: 2px solid #000;
            /* all bodies collapsed on mobile by default, JS overrides */
            grid-template-rows:
              auto
              auto 1fr
              auto 0fr
              auto 0fr !important;
          }
          .landing-title { font-size: 2.2rem; padding: 1.2rem 1.5rem; }
          .accordion-header { font-size: 1.8rem; padding: 1rem 1.5rem; }
          .accordion-body-inner { padding: 0 1.5rem 1.5rem; }
          .accordion-toggle { width: 30px; height: 30px; }
          .accordion-toggle svg { width: 14px; height: 14px; }
          .landing-right {
            flex: none;
            min-height: 50vh;
          }
          .landing-right img { max-width: 200px; }
        }
      </style>`)}
      {raw(`<noscript><style>.landing-left { grid-template-rows: auto auto 1fr auto 1fr auto 1fr !important; } .accordion-toggle { display: none; }</style></noscript>`)}
      <div class="landing">
        <div class="landing-left" id="landing-left">
          <a href="/" class="landing-title">webring.ca</a>

          <button class="accordion-header" aria-expanded="true" aria-controls="accordion-about" data-index="0">
            <span>About</span>
            <span class="accordion-toggle" aria-hidden="true">
              {raw('<svg viewBox="0 0 16 16"><line x1="3" y1="8" x2="13" y2="8" /></svg>')}
            </span>
          </button>
          <div class="accordion-body" id="accordion-about">
            <div class="accordion-body-inner">
              <p class="accordion-about">webring.ca is a curated community of Canadian builders, designers, and creators. We connect and showcase the diverse talent across Canada, fostering collaboration and innovation in the digital space.</p>
            </div>
          </div>

          <button class="accordion-header" aria-expanded="false" aria-controls="accordion-members" data-index="1">
            <span>Members</span>
            <span class="accordion-toggle" aria-hidden="true">
              {raw('<svg viewBox="0 0 16 16"><line x1="3" y1="8" x2="13" y2="8" /><line x1="8" y1="3" x2="8" y2="13" /></svg>')}
            </span>
          </button>
          <div class="accordion-body" id="accordion-members">
            <div class="accordion-body-inner">
              {active.length === 0 ? (
                <p class="accordion-about">No members yet.</p>
              ) : (
                <ul class="member-list">
                  {active.map((m) => (
                    <li>
                      <a href={m.url} target="_blank" rel="noopener noreferrer" class="member-list-name">{m.name}</a>
                      <span class="member-list-meta">{m.city ?? ''}{m.city ? ' \u00b7 ' : ''}{m.type}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <button class="accordion-header" aria-expanded="false" aria-controls="accordion-join" data-index="2">
            <span>Join</span>
            <span class="accordion-toggle" aria-hidden="true">
              {raw('<svg viewBox="0 0 16 16"><line x1="3" y1="8" x2="13" y2="8" /><line x1="8" y1="3" x2="8" y2="13" /></svg>')}
            </span>
          </button>
          <div class="accordion-body" id="accordion-join">
            <div class="accordion-body-inner">
              <p class="join-text">
                <strong>{active.length} member{active.length !== 1 ? 's' : ''}</strong> across Canada.
                Add your site to the ring and join a community of builders sharing their work on the open web.
              </p>
              <a href="/join" class="join-link">Join the ring {raw('&rarr;')}</a>
            </div>
          </div>
        </div>

        <div class="landing-right">
          <img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Flag_of_Canada_%28Pantone%29.svg" alt="Flag of Canada" width="300" height="150" />
          <div class="drag-hint">
            <span class="drag-hint-arrow">{raw('&uarr;')}</span>
            <span>Drag Up</span>
          </div>
        </div>
      </div>
      {raw(`<script>
(function() {
  var MINUS = '<svg viewBox="0 0 16 16"><line x1="3" y1="8" x2="13" y2="8" /></svg>';
  var PLUS = '<svg viewBox="0 0 16 16"><line x1="3" y1="8" x2="13" y2="8" /><line x1="8" y1="3" x2="8" y2="13" /></svg>';
  var state = [true, false, false];
  var left = document.getElementById('landing-left');
  var headers = left.querySelectorAll('.accordion-header');

  function updateGrid() {
    var rows = 'auto';
    for (var i = 0; i < state.length; i++) {
      rows += ' auto ' + (state[i] ? '1fr' : '0fr');
    }
    left.style.gridTemplateRows = rows;
  }

  headers.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var i = parseInt(btn.getAttribute('data-index'), 10);
      var opening = !state[i];
      if (opening) {
        for (var j = 0; j < state.length; j++) {
          if (j !== i && state[j]) {
            state[j] = false;
            var otherBtn = headers[j];
            otherBtn.querySelector('.accordion-toggle').innerHTML = PLUS;
            otherBtn.setAttribute('aria-expanded', 'false');
          }
        }
      }
      state[i] = opening;
      var icon = btn.querySelector('.accordion-toggle');
      icon.innerHTML = opening ? MINUS : PLUS;
      btn.setAttribute('aria-expanded', opening ? 'true' : 'false');
      updateGrid();
    });
  });
})();
</script>`)}
    </Layout>
  )
})

export default app
