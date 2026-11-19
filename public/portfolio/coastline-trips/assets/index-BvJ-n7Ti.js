(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const w of i.addedNodes)w.tagName==="LINK"&&w.rel==="modulepreload"&&s(w)}).observe(document,{childList:!0,subtree:!0});function a(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(o){if(o.ep)return;o.ep=!0;const i=a(o);fetch(o.href,i)}})();const _={title:"Coastline Trips",act:"Acts I-II",start:"01",tagline:"Lifestyle, wealth and Networking."},J={brafino:{name:"Chief Brafino",role:"The Chief",portraits:{neutral:"assets/characters/brafino/neutral.webp",cold:"assets/characters/brafino/cold.webp",grin:"assets/characters/brafino/grin.webp"}},tunde:{name:"Tunde",role:"Business partner",portraits:{anxious:"assets/characters/tunde/anxious.webp",beaming:"assets/characters/tunde/beaming.webp",deflated:"assets/characters/tunde/deflated.webp"}},caller:{name:"The Caller",role:"Unknown number",portraits:{shadow:"assets/characters/caller/shadow.webp"}},guard:{name:"Jetty Security",role:"Guard",portraits:{blank:"assets/characters/guard/blank.webp"}}},Z={creed:{who:"caller",line:'"You smell like every landlord in Lekki."',access:0,note:"Neutral. The default Lekki choice."},oud:{who:"caller",line:'The guard straightens. "Corporate. Good."',access:1,note:"Reads as serious money."},sauvage:{who:"wife",line:"A wife on the main deck sneezes.",access:-1,note:"Too loud for a boat. Wives mark you."},baccarat:{who:"wife",line:'"Oh. He has taste."',access:1,note:"Main deck approves. Men are unmoved."},cocoa:{who:"caller",line:'He pauses. "Quiet money. I like that."',access:2,note:"Best access. Wives ignore you all night."}},Q=[{id:"01",type:"fork",title:"The Sitting Room Pitch",bg:"sittingroom",speaker:"tunde",face:"anxious",line:"Fifty hectares, Chief. Epe. Off-market. We close Monday.",prompt:"The gold iPhone lights up. +234 803 000 0000.",options:[{text:"Let it ring. Tunde has your full attention.",reply:'Tunde smiles and adjusts his glasses. "Thank you, Chief. As I was saying..."',next:"01b",flags:{stayed:!0}},{text:"Raise one finger. Answer it.",reply:`Tunde freezes mid-sentence. A deep voice: "Brafino. Ikoyi jetty. Sunday. 4 PM. Don't be late."`,next:"02",flags:{answered:!0}}]},{id:"01b",type:"ending",title:"THE BOAT LEFT",bg:"sittingroom",body:"The pitch ran until 6 PM. The Epe land sold on Tuesday. The number never called again.",replay:{label:"Run it back",next:"01"}},{id:"02",type:"fork",title:"The Invitation",bg:"sittingroom",speaker:"tunde",face:"anxious",line:"...Chief? The Epe numbers?",prompt:"Sunday. 4 PM. Ikoyi.",options:[{text:`"Pack the iPad, Tunde. We're going to Ikoyi."`,reply:'Tunde beams, standing up fast. "Let me go change my outfit, Chief!"',next:"03",flags:{path:"loyalty"}},{text:'"Pause. My stomach is turning. I need to rest."',reply:`Tunde packs the iPad slowly. He doesn't look up. "Monday, Chief."`,next:"03",flags:{path:"greed"}}]},{id:"03",type:"loadout",title:"The Scent Profile",bg:"closet",speaker:null,prompt:"Five bottles. One jetty full of people who will notice.",confirmLabel:"Walk out",options:[{text:"Creed Aventus",vibe:"Loud and expected. Money, no mystery.",flags:{scent:"creed"},next:"04"},{text:"Tom Ford Oud Wood",vibe:"Heavy, dark, corporate. Built for handshakes.",flags:{scent:"oud"},next:"04"},{text:"Sauvage Elixir",vibe:"Way too aggressive for a boat. The wives will sneeze.",flags:{scent:"sauvage"},next:"04"},{text:"MFK Baccarat Rouge 540",vibe:"Sweet, trendy, high-end. The wives will approve.",flags:{scent:"baccarat"},next:"04"},{text:"Pure cocoa butter. No cologne.",vibe:'"I am too rich to smell like a department store."',flags:{scent:"cocoa"},next:"04"}]},{id:"04",type:"hotspot",title:"The Jetty Ticket",bg:"jetty",speaker:null,prompt:"Three men. One nod gets you on the boat.",retryLine:`The guard's hand lands on your chest. "Chief. Move."`,targets:[{id:"loudshirt",label:"The man in the tight, shiny shirt shouting at a deckhand.",box:{x:6,y:52,w:22,h:30},correct:!1,reply:"A loud spender, not a power broker. Security blocks the ramp.",access:-1,next:"04"},{id:"linen",label:"The older man in black linen, quietly sipping water near the stern.",box:{x:66,y:44,w:20,h:34},correct:!0,reply:"He catches your eye. One slow nod. He whispers to the guard. The rope drops.",access:1,next:"05",flags:{spotted:!0}},{id:"polo",label:"The man in the polo shirt spraying cash at the live band.",box:{x:38,y:56,w:22,h:26},correct:!1,reply:"A politician's nephew spending allowance. He doesn't know your name. Neither does security.",access:-1,next:"04"}]},{id:"05",type:"cutscene",title:"The Tease",bg:"deck",speaker:"caller",face:"shadow",line:"Welcome to the deep water, Chief. The wives think this is a party. The men upstairs know it's a clearing house. Watch your step.",onEnter:{scentPayoff:!0},fadeToBlack:!0,endCard:{kicker:"ACT II",title:"UP NEXT",subtitle:"THE MAIN DECK GATEKEEPERS"}}],g={meta:_,characters:J,scentPayoffs:Z,scenes:Q},c=document.getElementById("stage"),u=g.meta,W=["01","02","03","04","05"],p={spark:'<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffe89a"/><stop offset="42%" stop-color="#f5b544"/><stop offset="100%" stop-color="#e2603f"/></linearGradient></defs><path d="M11 2.4l1.95 5.25 5.25 1.95-5.25 1.95L11 16.8l-1.95-5.25L3.8 9.6l5.25-1.95z" fill="url(#sparkGrad)"/><path d="M17.9 14.3l.85 2.25 2.25.85-2.25.85-.85 2.25-.85-2.25-2.25-.85 2.25-.85z" fill="#ffd166"/></svg>',mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="2.8" y="5.2" width="18.4" height="13.6" rx="2.2"/><path d="M3.6 6.9l8.4 5.7 8.4-5.7"/></svg>',pad:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 8.4h8a4.4 4.4 0 0 1 4.3 5.2l-.6 2.9a2.5 2.5 0 0 1-4.3 1.2l-1-1.2H9.6l-1 1.2a2.5 2.5 0 0 1-4.3-1.2l-.6-2.9A4.4 4.4 0 0 1 8 8.4Z"/><path d="M8.2 11.6v2.4M7 12.8h2.4M15.8 12h.01M17.4 13.6h.01"/></svg>',chev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5.5l6.5 6.5L9 18.5"/></svg>'},r={scene:null,flags:{},access:0,retries:0,seen:[]};let k=null,b=null,E=null,B=null;const n=e=>String(e).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]),m=e=>g.scenes.find(t=>t.id===e),V=e=>Math.max(-2,Math.min(4,e));function x(e){r.access=V(r.access+(e||0))}function M(e){e&&Object.assign(r.flags,e)}function f(e){k=null,b=null,document.body.classList.remove("auth"),r.scene=e;const t=m(e);if(!t)return z(e);g.meta.start!==e&&!r.seen.includes(e)&&r.seen.push(e),g.meta.start!==e&&D({chapters:r.seen.length,scene:e}),P(t)}function X(e){const t=W.indexOf(e.id),a=W.map((s,o)=>`<span class="dot${o===t?" on":""}${o<t?" done":""}"></span>`).join("");return`<header class="hud">
    <span class="chip">${n(u.title)}</span>
    <div class="dots" aria-hidden="true">${a}</div>
  </header>`}function q(e,t){const a=g.characters[e];if(!a)return"";const s=a.name.replace(/[^A-Za-z]/g,"").charAt(0)||"?";return`<div class="portrait char-${e}">
    <div class="bust"><span class="initial">${n(s)}</span></div>
    <div class="tag"><b>${n(a.name)}</b><span>${n(t||"")}</span></div>
  </div>`}function $(e,t,a=""){return`<div class="scene bg-${e.bg} ${a}">
    <div class="vignette"></div>
    ${X(e)}
    ${t}
  </div>`}function P(e){clearTimeout(E);const a={fork:ee,loadout:te,hotspot:ae,cutscene:se,ending:ne}[e.type]||z;c.innerHTML=a(e),c.dataset.scene=e.id}function ee(e){const t=e.options.map((s,o)=>`<button class="opt" data-opt="${o}"><span>${n(s.text)}</span><i aria-hidden="true">›</i></button>`).join(""),a=k?`<div class="reply" role="status">
         <p>${n(k.text)}</p>
         <button class="cont" data-continue="${n(k.next)}">Continue</button>
       </div>`:`<div class="options">${t}</div>`;return $(e,`<section class="mid">${q(e.speaker,e.face)}</section>
     <section class="dialogue">
       <div class="speaker">${n(g.characters[e.speaker]?.name||"")}</div>
       <p class="line">“${n(e.line)}”</p>
       ${e.prompt?`<p class="prompt">${n(e.prompt)}</p>`:""}
       ${a}
     </section>`)}function te(e){const t=e.options.map((a,s)=>`<button class="scent scent-${a.flags.scent}${b===s?" sel":""}" data-scent="${s}">
        <span class="bottle" aria-hidden="true"></span>
        <span class="scent-text">
          <b>${n(a.text)}</b>
          <span>${n(a.vibe)}</span>
        </span>
      </button>`).join("");return $(e,`<section class="panel top">
       <h2 class="scene-title">${n(e.title)}</h2>
       <p class="prompt">${n(e.prompt)}</p>
     </section>
     <section class="loadout">${t}</section>
     <section class="bottom">
       <button class="cont wide" data-confirm ${b===null?"disabled":""}>${n(e.confirmLabel||"Continue")}</button>
     </section>`)}function ae(e){const t=e.targets.map((a,s)=>`<button class="fig fig-${a.id}" data-target="${s}"
        style="left:${a.box.x}%;top:${a.box.y}%;width:${a.box.w}%;height:${a.box.h}%"
        aria-label="${n(a.label)}">
        <span class="fig-body" aria-hidden="true"></span>
        <span class="fig-label">${n(a.label)}</span>
      </button>`).join("");return $(e,`<section class="panel top">
       <h2 class="scene-title">${n(e.title)}</h2>
       <p class="prompt">${n(e.prompt)}</p>
     </section>
     <section class="jetty">${t}</section>
     <div class="toast-zone" aria-live="assertive"></div>`)}function se(e){const t=e.onEnter?.scentPayoff&&r.flags.scent?g.scentPayoffs[r.flags.scent]:null,a=t?`<p class="aside">${n(t.line)}</p>`:"";return t&&x(t.access),$(e,`<section class="mid">${q(e.speaker,e.face)}</section>
     <section class="dialogue center">
       ${a}
       <p class="line">“${n(e.line)}”</p>
       <button class="cont wide" data-finish>Continue</button>
     </section>
     <div class="fade" hidden></div>`)}function ne(e){return $(e,`<section class="ending">
       <p class="kicker">${n(u.act)}</p>
       <h1 class="end-title">${n(e.title)}</h1>
       <p class="end-body">${n(e.body)}</p>
       <button class="cont wide" data-replay="${n(e.replay.next)}">${n(e.replay.label)}</button>
     </section>`)}function z(e){return`<div class="scene bg-lagoon"><div class="ending"><h1 class="end-title">MISSING SCENE</h1><p class="end-body">${n(e)}</p></div></div>`}const A="coastline.save.v1";function S(){try{return JSON.parse(localStorage.getItem(A)||"null")}catch{return null}}function D(e){const t={naira:0,gems:0,chapters:0,...S()||{},...e};try{localStorage.setItem(A,JSON.stringify(t))}catch{}return t}const oe=e=>"₦"+Number(e||0).toLocaleString("en-NG");function U(){const e=S()||{naira:0,gems:0,chapters:0};return`<section class="auth-progress">
            <p class="auth-progress-title">${e.chapters>0?"We found progress on this phone":"Your progress shows here"}</p>
            <p class="auth-progress-stats">
              <span class="st">${oe(e.naira)}</span>
              <span class="sep">&middot;</span>
              <span class="st">${e.gems} gems</span>
              <span class="sep">&middot;</span>
              <span class="st">${e.chapters} story chapters</span>
            </p>
            <p class="auth-progress-note">Create an account or sign in to keep it safe and use it on other devices.</p>
          </section>`}const K={NG:"₦",US:"$",SDG:"SDG",INR:"₹",KRW:"₩",CA:"C$"},re=[["NG","Nigeria"],["US","America"],["SDG","Sudan"],["INR","India"],["KRW","Korea"],["CA","Canada"]];let y=null,h=null,v=!1,G="";function C(){document.body.classList.add("auth");const e=!!(y&&h&&v),t=[["under13","Under 13"],["13-17","13 - 17"],["18+","18 or over"]].map(([s,o])=>`<button class="auth-btn light gate-age${y===s?" on":""}" data-age="${s}">${o}</button>`).join(""),a=re.map(([s,o])=>`<button class="auth-btn ghost gate-region${h===s?" on":""}" data-region="${s}">
       <span class="rg">${s}</span>
       <span class="rn">${o}</span>
       <span class="rs">${K[s]}</span>
     </button>`).join("");c.innerHTML=`<div class="scene auth-scene">
    <main class="auth-shell">
      <section class="auth-card gate">
        <div class="auth-inner">
          <h1 class="auth-title gate-title">Pick your age range</h1>
          <p class="auth-tag">A quick check before you join the crew!</p>

          <div class="gate-ages">${t}</div>

          <p class="auth-label">Where are you playing from?</p>
          <p class="gate-hint">Your game money shows in your currency.</p>
          <div class="gate-regions">${a}</div>

          <label class="gate-terms">
            <input type="checkbox" id="age-terms" ${v?"checked":""}>
            <span>I accept the Terms and Conditions and have read the Privacy Policy.</span>
          </label>

          <button class="auth-btn primary gate-continue" data-age-continue ${e?"":"disabled"}>Continue</button>
          <a href="#" class="gate-back" data-age-back>&larr; Back</a>
        </div>
      </section>
    </main>
  </div>`,c.querySelector("#age-terms")?.addEventListener("change",s=>{v=s.target.checked;const o=c.querySelector("[data-age-continue]");o&&(o.disabled=!(y&&h&&v))})}function ie(e){document.body.classList.add("auth");const t=e.name?`, ${n(e.name)}`:"";c.innerHTML=`<div class="scene auth-scene">
    <main class="auth-shell">
      <section class="auth-card">
        <div class="auth-hero">
          <img src="assets/bg/coastline-party.jpg" alt="" aria-hidden="true">
          <span class="auth-brand">${n(u.title).toUpperCase()}</span>
        </div>
        <div class="auth-body">
          <h1 class="auth-title">Welcome back${t}!</h1>
          <p class="auth-tag">The boat is still waiting. Pick up where you stopped.</p>
          ${U()}
          <button class="auth-btn primary" data-resume>
            <span class="ic" aria-hidden="true">${p.pad}</span>
            <span class="lbl">Enter the boat</span>
            <span class="chev" aria-hidden="true">${p.chev}</span>
          </button>
          <a href="#" class="gate-back" data-startover>Start over</a>
        </div>
      </section>
    </main>
  </div>`}const Y="coastline.tour.v1",L=[{kicker:"Coastline Trips · 1 of 3",title:"Welcome aboard!",body:"You are on the boat with the crew. Everything you need is on this screen: the scene above, your choices below."},{kicker:"Coastline Trips · 2 of 3",title:"Your choices move the story",body:"Tap an option to answer. Some choices win you access with the crew, some cost you. There is no single right path."},{kicker:"Coastline Trips · 3 of 3",title:"It remembers where you stopped",body:"Naira, gems and chapters are saved on this phone. Close the tab and the boat waits where you left it."}];let T=0;function ce(){try{return localStorage.getItem(Y)==="1"}catch{return!0}}function R(){try{localStorage.setItem(Y,"1")}catch{}}function F(){const e=L[T],t=T===L.length-1,a=L.map((o,i)=>`<span class="${i===T?"on":""}"></span>`).join(""),s=document.createElement("div");s.className="tour-veil",s.innerHTML=`<section class="tour-card" role="dialog" aria-modal="true" aria-label="Welcome tour">
    <div class="tour-head">
      <span class="tour-avatar"><img src="assets/bg/coastline-party.jpg" alt=""></span>
      <div>
        <p class="tour-kicker">${n(e.kicker)}</p>
        <h2 class="tour-title">${n(e.title)}</h2>
      </div>
    </div>
    <p class="tour-body">${n(e.body)}</p>
    <div class="tour-dots" aria-hidden="true">${a}</div>
    <div class="tour-actions">
      <button class="tour-btn" type="button" data-tour-skip>Skip tour</button>
      <button class="tour-btn primary" type="button" data-tour-next>${t?"Start playing":"Show me"}</button>
    </div>
  </section>`,s.querySelector("[data-tour-skip]").addEventListener("click",()=>{R(),s.remove()}),s.querySelector("[data-tour-next]").addEventListener("click",()=>{if(t){R(),s.remove();return}T+=1,s.remove(),F()}),c.appendChild(s)}function I(){const e=S();if(e&&e.scene&&e.chapters>0)return ie(e);const t=n(u.title);document.body.classList.add("auth"),c.innerHTML=`<div class="scene auth-scene">
    <main class="auth-shell">
      <section class="auth-card">
        <div class="auth-hero">
          <img src="assets/bg/coastline-party.jpg" alt="" aria-hidden="true">
          <span class="auth-brand">${n(u.title).toUpperCase()}</span>
        </div>
        <div class="auth-body">
          <h1 class="auth-title">Welcome to<br>${t}</h1>
          <p class="auth-tag">${n(u.tagline)}</p>

          ${U()}

          <button class="auth-btn primary" data-auth="create">
            <span class="ic" aria-hidden="true">${p.spark}</span>
            <span class="lbl">Create Account</span>
            <span class="chev" aria-hidden="true">${p.chev}</span>
          </button>
          <button class="auth-btn light" data-auth="signin">
            <span class="ic" aria-hidden="true">${p.mail}</span>
            <span class="lbl">Sign In</span>
            <span class="chev" aria-hidden="true">${p.chev}</span>
          </button>

          <div class="auth-or"><span>or play now</span></div>

          <label class="auth-label" for="guest-name">What should the crew call you?</label>
          <input class="auth-input" id="guest-name" maxlength="20" autocomplete="off"
                 placeholder="Your first name or nickname">

          <button class="auth-btn ghost" data-begin>
            <span class="ic" aria-hidden="true"><img class="ic-img" src="assets/icons/guest.png" alt=""></span>
            <span class="lbl">Continue as Guest</span>
            <span class="chev" aria-hidden="true">${p.chev}</span>
          </button>

          <p class="auth-legal">By playing ${t}, as a guest or with an account, you agree to our
            Terms and Conditions and Privacy Policy.</p>
          <p class="auth-note">Guest progress is temporary. Money, gems and progress last only until you
            close the game, and can't move to another device.</p>

          <nav class="auth-links" aria-label="Legal">
            <a href="#" data-auth="about">About</a>
            <a href="#" data-auth="privacy">Privacy Policy</a>
            <a href="#" data-auth="terms">Terms</a>
            <a href="#" data-auth="copyright">Copyright</a>
            <a href="#" data-auth="contact">Contact</a>
          </nav>
        </div>
      </section>
    </main>
    <div class="toast-zone"></div>
  </div>`,c.querySelector("#guest-name")?.addEventListener("keydown",s=>{s.key==="Enter"&&(s.preventDefault(),c.querySelector("[data-begin]")?.click())})}c.addEventListener("click",e=>{const t=e.target.closest("[data-opt]");if(t){const d=m(r.scene),l=d.options[Number(t.dataset.opt)];M(l.flags),l.access&&x(l.access),k={text:l.reply||"…",next:l.next},P(d);return}const a=e.target.closest("[data-continue]");if(a)return f(a.dataset.continue);const s=e.target.closest("[data-scent]");if(s)return b=Number(s.dataset.scent),P(m(r.scene));if(e.target.closest("[data-confirm]")&&b!==null){const l=m(r.scene).options[b];return M(l.flags),f(l.next)}const i=e.target.closest("[data-target]");if(i)return le(Number(i.dataset.target));if(e.target.closest("[data-finish]"))return de();const O=e.target.closest("[data-replay]");if(O)return r.flags={},r.access=0,r.retries=0,r.seen=[],f(O.dataset.replay);if(e.target.closest("[data-auth]"))return e.preventDefault(),N("Prototype: accounts aren't connected yet.","bad");if(e.target.closest("[data-begin]")){const d=c.querySelector("#guest-name"),l=d&&d.value.trim().slice(0,20);return l&&(r.flags.guest=l),G=l||"",C()}if(e.target.closest("[data-resume]")){const d=S();return f(d&&d.scene||u.start)}if(e.target.closest("[data-startover]")){e.preventDefault();try{localStorage.removeItem(A)}catch{}return I()}const j=e.target.closest("[data-age]");if(j)return y=j.dataset.age,C();const H=e.target.closest("[data-region]");if(H)return h=H.dataset.region,C();if(e.target.closest("[data-age-back]"))return e.preventDefault(),I();if(e.target.closest("[data-age-continue]")){if(!(y&&h&&v))return;D({age:y,region:h,currency:K[h],name:G}),f(u.start),ce()||F();return}});function le(e){const t=m(r.scene),a=t.targets[e],s=c.querySelector(`[data-target="${e}"]`);a.correct?(M(a.flags),x(a.access),s?.classList.add("hit"),N(a.reply,"good"),setTimeout(()=>f(a.next),1200)):(r.retries+=1,x(a.access),s?.classList.remove("shake"),s?.offsetWidth,s?.classList.add("shake"),N(`${a.reply} ${t.retryLine||""}`,"bad"))}function N(e,t){const a=c.querySelector(".toast-zone");a&&(a.innerHTML=`<div class="toast ${t}">${n(e)}</div>`,clearTimeout(E),E=setTimeout(()=>a.innerHTML="",2600))}function de(){const e=m(r.scene),t=c.querySelector(".fade");t&&(t.hidden=!1,t.classList.add("on"),clearTimeout(B),B=setTimeout(()=>{c.innerHTML=`<div class="scene bg-deck endscene">
      <div class="vignette"></div>
      <section class="endcard">
        <p class="kicker">${n(e.endCard.kicker)}</p>
        <p class="end-sub">${n(e.endCard.title)}</p>
        <h2 class="upnext">${n(e.endCard.subtitle)}</h2>
        <button class="cont wide" data-replay="${n(u.start)}">Play again</button>
      </section>
    </div>`},900))}I();
