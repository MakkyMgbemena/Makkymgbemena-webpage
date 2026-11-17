(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const w of i.addedNodes)w.tagName==="LINK"&&w.rel==="modulepreload"&&n(w)}).observe(document,{childList:!0,subtree:!0});function a(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(o){if(o.ep)return;o.ep=!0;const i=a(o);fetch(o.href,i)}})();const z={title:"Coastline Trips",act:"Acts I-II",start:"01",tagline:"Lifestyle, wealth and Networking."},D={brafino:{name:"Chief Brafino",role:"The Chief",portraits:{neutral:"assets/characters/brafino/neutral.webp",cold:"assets/characters/brafino/cold.webp",grin:"assets/characters/brafino/grin.webp"}},tunde:{name:"Tunde",role:"Business partner",portraits:{anxious:"assets/characters/tunde/anxious.webp",beaming:"assets/characters/tunde/beaming.webp",deflated:"assets/characters/tunde/deflated.webp"}},caller:{name:"The Caller",role:"Unknown number",portraits:{shadow:"assets/characters/caller/shadow.webp"}},guard:{name:"Jetty Security",role:"Guard",portraits:{blank:"assets/characters/guard/blank.webp"}}},F={creed:{who:"caller",line:'"You smell like every landlord in Lekki."',access:0,note:"Neutral. The default Lekki choice."},oud:{who:"caller",line:'The guard straightens. "Corporate. Good."',access:1,note:"Reads as serious money."},sauvage:{who:"wife",line:"A wife on the main deck sneezes.",access:-1,note:"Too loud for a boat. Wives mark you."},baccarat:{who:"wife",line:'"Oh. He has taste."',access:1,note:"Main deck approves. Men are unmoved."},cocoa:{who:"caller",line:'He pauses. "Quiet money. I like that."',access:2,note:"Best access. Wives ignore you all night."}},K=[{id:"01",type:"fork",title:"The Sitting Room Pitch",bg:"sittingroom",speaker:"tunde",face:"anxious",line:"Fifty hectares, Chief. Epe. Off-market. We close Monday.",prompt:"The gold iPhone lights up. +234 803 000 0000.",options:[{text:"Let it ring. Tunde has your full attention.",reply:'Tunde smiles and adjusts his glasses. "Thank you, Chief. As I was saying..."',next:"01b",flags:{stayed:!0}},{text:"Raise one finger. Answer it.",reply:`Tunde freezes mid-sentence. A deep voice: "Brafino. Ikoyi jetty. Sunday. 4 PM. Don't be late."`,next:"02",flags:{answered:!0}}]},{id:"01b",type:"ending",title:"THE BOAT LEFT",bg:"sittingroom",body:"The pitch ran until 6 PM. The Epe land sold on Tuesday. The number never called again.",replay:{label:"Run it back",next:"01"}},{id:"02",type:"fork",title:"The Invitation",bg:"sittingroom",speaker:"tunde",face:"anxious",line:"...Chief? The Epe numbers?",prompt:"Sunday. 4 PM. Ikoyi.",options:[{text:`"Pack the iPad, Tunde. We're going to Ikoyi."`,reply:'Tunde beams, standing up fast. "Let me go change my outfit, Chief!"',next:"03",flags:{path:"loyalty"}},{text:'"Pause. My stomach is turning. I need to rest."',reply:`Tunde packs the iPad slowly. He doesn't look up. "Monday, Chief."`,next:"03",flags:{path:"greed"}}]},{id:"03",type:"loadout",title:"The Scent Profile",bg:"closet",speaker:null,prompt:"Five bottles. One jetty full of people who will notice.",confirmLabel:"Walk out",options:[{text:"Creed Aventus",vibe:"Loud and expected. Money, no mystery.",flags:{scent:"creed"},next:"04"},{text:"Tom Ford Oud Wood",vibe:"Heavy, dark, corporate. Built for handshakes.",flags:{scent:"oud"},next:"04"},{text:"Sauvage Elixir",vibe:"Way too aggressive for a boat. The wives will sneeze.",flags:{scent:"sauvage"},next:"04"},{text:"MFK Baccarat Rouge 540",vibe:"Sweet, trendy, high-end. The wives will approve.",flags:{scent:"baccarat"},next:"04"},{text:"Pure cocoa butter. No cologne.",vibe:'"I am too rich to smell like a department store."',flags:{scent:"cocoa"},next:"04"}]},{id:"04",type:"hotspot",title:"The Jetty Ticket",bg:"jetty",speaker:null,prompt:"Three men. One nod gets you on the boat.",retryLine:`The guard's hand lands on your chest. "Chief. Move."`,targets:[{id:"loudshirt",label:"The man in the tight, shiny shirt shouting at a deckhand.",box:{x:6,y:52,w:22,h:30},correct:!1,reply:"A loud spender, not a power broker. Security blocks the ramp.",access:-1,next:"04"},{id:"linen",label:"The older man in black linen, quietly sipping water near the stern.",box:{x:66,y:44,w:20,h:34},correct:!0,reply:"He catches your eye. One slow nod. He whispers to the guard. The rope drops.",access:1,next:"05",flags:{spotted:!0}},{id:"polo",label:"The man in the polo shirt spraying cash at the live band.",box:{x:38,y:56,w:22,h:26},correct:!1,reply:"A politician's nephew spending allowance. He doesn't know your name. Neither does security.",access:-1,next:"04"}]},{id:"05",type:"cutscene",title:"The Tease",bg:"deck",speaker:"caller",face:"shadow",line:"Welcome to the deep water, Chief. The wives think this is a party. The men upstairs know it's a clearing house. Watch your step.",onEnter:{scentPayoff:!0},fadeToBlack:!0,endCard:{kicker:"ACT II",title:"UP NEXT",subtitle:"THE MAIN DECK GATEKEEPERS"}}],p={meta:z,characters:D,scentPayoffs:F,scenes:K},c=document.getElementById("stage"),u=p.meta,A=["01","02","03","04","05"],y={spark:'<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffe89a"/><stop offset="42%" stop-color="#f5b544"/><stop offset="100%" stop-color="#e2603f"/></linearGradient></defs><path d="M11 2.4l1.95 5.25 5.25 1.95-5.25 1.95L11 16.8l-1.95-5.25L3.8 9.6l5.25-1.95z" fill="url(#sparkGrad)"/><path d="M17.9 14.3l.85 2.25 2.25.85-2.25.85-.85 2.25-.85-2.25-2.25-.85 2.25-.85z" fill="#ffd166"/></svg>',mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="2.8" y="5.2" width="18.4" height="13.6" rx="2.2"/><path d="M3.6 6.9l8.4 5.7 8.4-5.7"/></svg>',chev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5.5l6.5 6.5L9 18.5"/></svg>'},r={scene:null,flags:{},access:0,retries:0,seen:[]};let $=null,g=null,C=null,N=null;const s=e=>String(e).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]),f=e=>p.scenes.find(t=>t.id===e),U=e=>Math.max(-2,Math.min(4,e));function T(e){r.access=U(r.access+(e||0))}function S(e){e&&Object.assign(r.flags,e)}function m(e){$=null,g=null,document.body.classList.remove("auth"),r.scene=e;const t=f(e);if(!t)return B(e);p.meta.start!==e&&!r.seen.includes(e)&&r.seen.push(e),p.meta.start!==e&&W({chapters:r.seen.length}),L(t)}function Y(e){const t=A.indexOf(e.id),a=A.map((n,o)=>`<span class="dot${o===t?" on":""}${o<t?" done":""}"></span>`).join("");return`<header class="hud">
    <span class="chip">${s(u.title)}</span>
    <div class="dots" aria-hidden="true">${a}</div>
  </header>`}function G(e,t){const a=p.characters[e];if(!a)return"";const n=a.name.replace(/[^A-Za-z]/g,"").charAt(0)||"?";return`<div class="portrait char-${e}">
    <div class="bust"><span class="initial">${s(n)}</span></div>
    <div class="tag"><b>${s(a.name)}</b><span>${s(t||"")}</span></div>
  </div>`}function k(e,t,a=""){return`<div class="scene bg-${e.bg} ${a}">
    <div class="vignette"></div>
    ${Y(e)}
    ${t}
  </div>`}function L(e){clearTimeout(C);const a={fork:J,loadout:_,hotspot:Q,cutscene:V,ending:X}[e.type]||B;c.innerHTML=a(e),c.dataset.scene=e.id}function J(e){const t=e.options.map((n,o)=>`<button class="opt" data-opt="${o}"><span>${s(n.text)}</span><i aria-hidden="true">›</i></button>`).join(""),a=$?`<div class="reply" role="status">
         <p>${s($.text)}</p>
         <button class="cont" data-continue="${s($.next)}">Continue</button>
       </div>`:`<div class="options">${t}</div>`;return k(e,`<section class="mid">${G(e.speaker,e.face)}</section>
     <section class="dialogue">
       <div class="speaker">${s(p.characters[e.speaker]?.name||"")}</div>
       <p class="line">“${s(e.line)}”</p>
       ${e.prompt?`<p class="prompt">${s(e.prompt)}</p>`:""}
       ${a}
     </section>`)}function _(e){const t=e.options.map((a,n)=>`<button class="scent scent-${a.flags.scent}${g===n?" sel":""}" data-scent="${n}">
        <span class="bottle" aria-hidden="true"></span>
        <span class="scent-text">
          <b>${s(a.text)}</b>
          <span>${s(a.vibe)}</span>
        </span>
      </button>`).join("");return k(e,`<section class="panel top">
       <h2 class="scene-title">${s(e.title)}</h2>
       <p class="prompt">${s(e.prompt)}</p>
     </section>
     <section class="loadout">${t}</section>
     <section class="bottom">
       <button class="cont wide" data-confirm ${g===null?"disabled":""}>${s(e.confirmLabel||"Continue")}</button>
     </section>`)}function Q(e){const t=e.targets.map((a,n)=>`<button class="fig fig-${a.id}" data-target="${n}"
        style="left:${a.box.x}%;top:${a.box.y}%;width:${a.box.w}%;height:${a.box.h}%"
        aria-label="${s(a.label)}">
        <span class="fig-body" aria-hidden="true"></span>
        <span class="fig-label">${s(a.label)}</span>
      </button>`).join("");return k(e,`<section class="panel top">
       <h2 class="scene-title">${s(e.title)}</h2>
       <p class="prompt">${s(e.prompt)}</p>
     </section>
     <section class="jetty">${t}</section>
     <div class="toast-zone" aria-live="assertive"></div>`)}function V(e){const t=e.onEnter?.scentPayoff&&r.flags.scent?p.scentPayoffs[r.flags.scent]:null,a=t?`<p class="aside">${s(t.line)}</p>`:"";return t&&T(t.access),k(e,`<section class="mid">${G(e.speaker,e.face)}</section>
     <section class="dialogue center">
       ${a}
       <p class="line">“${s(e.line)}”</p>
       <button class="cont wide" data-finish>Continue</button>
     </section>
     <div class="fade" hidden></div>`)}function X(e){return k(e,`<section class="ending">
       <p class="kicker">${s(u.act)}</p>
       <h1 class="end-title">${s(e.title)}</h1>
       <p class="end-body">${s(e.body)}</p>
       <button class="cont wide" data-replay="${s(e.replay.next)}">${s(e.replay.label)}</button>
     </section>`)}function B(e){return`<div class="scene bg-lagoon"><div class="ending"><h1 class="end-title">MISSING SCENE</h1><p class="end-body">${s(e)}</p></div></div>`}const H="coastline.save.v1";function j(){try{return JSON.parse(localStorage.getItem(H)||"null")}catch{return null}}function W(e){const t={naira:0,gems:0,chapters:0,...j()||{},...e};try{localStorage.setItem(H,JSON.stringify(t))}catch{}return t}const Z=e=>"₦"+Number(e||0).toLocaleString("en-NG");function ee(){const e=j()||{naira:0,gems:0,chapters:0};return`<section class="auth-progress">
            <p class="auth-progress-title">${e.chapters>0?"We found progress on this phone":"Your progress shows here"}</p>
            <p class="auth-progress-stats">
              <span class="st">${Z(e.naira)}</span>
              <span class="sep">&middot;</span>
              <span class="st">${e.gems} gems</span>
              <span class="sep">&middot;</span>
              <span class="st">${e.chapters} story chapters</span>
            </p>
            <p class="auth-progress-note">Create an account or sign in to keep it safe and use it on other devices.</p>
          </section>`}const R={NG:"₦",US:"$",SDG:"SDG",INR:"₹",KRW:"₩",CA:"C$"},te=[["NG","Nigeria"],["US","America"],["SDG","Sudan"],["INR","India"],["KRW","Korea"],["CA","Canada"]];let b=null,d=null,v=!1,O="";function x(){document.body.classList.add("auth");const e=!!(b&&d&&v),t=[["under13","Under 13"],["13-17","13 - 17"],["18+","18 or over"]].map(([n,o])=>`<button class="auth-btn light gate-age${b===n?" on":""}" data-age="${n}">${o}</button>`).join(""),a=te.map(([n,o])=>`<button class="auth-btn ghost gate-region${d===n?" on":""}" data-region="${n}">
       <span class="rg">${n}</span>
       <span class="rn">${o}</span>
       <span class="rs">${R[n]}</span>
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
  </div>`,c.querySelector("#age-terms")?.addEventListener("change",n=>{v=n.target.checked;const o=c.querySelector("[data-age-continue]");o&&(o.disabled=!(b&&d&&v))})}function q(){const e=s(u.title);document.body.classList.add("auth"),c.innerHTML=`<div class="scene auth-scene">
    <main class="auth-shell">
      <section class="auth-card">
        <div class="auth-hero">
          <img src="assets/bg/coastline-party.jpg" alt="" aria-hidden="true">
          <span class="auth-brand">${s(u.title).toUpperCase()}</span>
        </div>
        <div class="auth-body">
          <h1 class="auth-title">Welcome to<br>${e}</h1>
          <p class="auth-tag">${s(u.tagline)}</p>

          ${ee()}

          <button class="auth-btn primary" data-auth="create">
            <span class="ic" aria-hidden="true">${y.spark}</span>
            <span class="lbl">Create Account</span>
            <span class="chev" aria-hidden="true">${y.chev}</span>
          </button>
          <button class="auth-btn light" data-auth="signin">
            <span class="ic" aria-hidden="true">${y.mail}</span>
            <span class="lbl">Sign In</span>
            <span class="chev" aria-hidden="true">${y.chev}</span>
          </button>

          <div class="auth-or"><span>or play now</span></div>

          <label class="auth-label" for="guest-name">What should the crew call you?</label>
          <input class="auth-input" id="guest-name" maxlength="20" autocomplete="off"
                 placeholder="Your first name or nickname">

          <button class="auth-btn ghost" data-begin>
            <span class="ic" aria-hidden="true"><img class="ic-img" src="assets/icons/guest.png" alt=""></span>
            <span class="lbl">Continue as Guest</span>
            <span class="chev" aria-hidden="true">${y.chev}</span>
          </button>

          <p class="auth-legal">By playing ${e}, as a guest or with an account, you agree to our
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
  </div>`,c.querySelector("#guest-name")?.addEventListener("keydown",a=>{a.key==="Enter"&&(a.preventDefault(),c.querySelector("[data-begin]")?.click())})}c.addEventListener("click",e=>{const t=e.target.closest("[data-opt]");if(t){const h=f(r.scene),l=h.options[Number(t.dataset.opt)];S(l.flags),l.access&&T(l.access),$={text:l.reply||"…",next:l.next},L(h);return}const a=e.target.closest("[data-continue]");if(a)return m(a.dataset.continue);const n=e.target.closest("[data-scent]");if(n)return g=Number(n.dataset.scent),L(f(r.scene));if(e.target.closest("[data-confirm]")&&g!==null){const l=f(r.scene).options[g];return S(l.flags),m(l.next)}const i=e.target.closest("[data-target]");if(i)return ae(Number(i.dataset.target));if(e.target.closest("[data-finish]"))return se();const E=e.target.closest("[data-replay]");if(E)return r.flags={},r.access=0,r.retries=0,r.seen=[],m(E.dataset.replay);if(e.target.closest("[data-auth]"))return e.preventDefault(),P("Prototype: accounts aren't connected yet.","bad");if(e.target.closest("[data-begin]")){const h=c.querySelector("#guest-name"),l=h&&h.value.trim().slice(0,20);return l&&(r.flags.guest=l),O=l||"",x()}const I=e.target.closest("[data-age]");if(I)return b=I.dataset.age,x();const M=e.target.closest("[data-region]");if(M)return d=M.dataset.region,x();if(e.target.closest("[data-age-back]"))return e.preventDefault(),q();if(e.target.closest("[data-age-continue]"))return b&&d&&v?(W({age:b,region:d,currency:R[d],name:O}),m(u.start)):void 0});function ae(e){const t=f(r.scene),a=t.targets[e],n=c.querySelector(`[data-target="${e}"]`);a.correct?(S(a.flags),T(a.access),n?.classList.add("hit"),P(a.reply,"good"),setTimeout(()=>m(a.next),1200)):(r.retries+=1,T(a.access),n?.classList.remove("shake"),n?.offsetWidth,n?.classList.add("shake"),P(`${a.reply} ${t.retryLine||""}`,"bad"))}function P(e,t){const a=c.querySelector(".toast-zone");a&&(a.innerHTML=`<div class="toast ${t}">${s(e)}</div>`,clearTimeout(C),C=setTimeout(()=>a.innerHTML="",2600))}function se(){const e=f(r.scene),t=c.querySelector(".fade");t&&(t.hidden=!1,t.classList.add("on"),clearTimeout(N),N=setTimeout(()=>{c.innerHTML=`<div class="scene bg-deck endscene">
      <div class="vignette"></div>
      <section class="endcard">
        <p class="kicker">${s(e.endCard.kicker)}</p>
        <p class="end-sub">${s(e.endCard.title)}</p>
        <h2 class="upnext">${s(e.endCard.subtitle)}</h2>
        <button class="cont wide" data-replay="${s(u.start)}">Play again</button>
      </section>
    </div>`},900))}q();
