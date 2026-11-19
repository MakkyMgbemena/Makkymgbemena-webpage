(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const c of n)if(c.type==="childList")for(const f of c.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&o(f)}).observe(document,{childList:!0,subtree:!0});function a(n){const c={};return n.integrity&&(c.integrity=n.integrity),n.referrerPolicy&&(c.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?c.credentials="include":n.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function o(n){if(n.ep)return;n.ep=!0;const c=a(n);fetch(n.href,c)}})();const J={title:"Coastline Trips",act:"Acts I-II",start:"01",tagline:"Lifestyle, wealth and Networking."},Z={brafino:{name:"Chief Brafino",role:"The Chief",portraits:{neutral:"assets/characters/brafino/neutral.webp",cold:"assets/characters/brafino/cold.webp",grin:"assets/characters/brafino/grin.webp"}},tunde:{name:"Tunde",role:"Business partner",portraits:{anxious:"assets/characters/tunde/anxious.webp",beaming:"assets/characters/tunde/beaming.webp",deflated:"assets/characters/tunde/deflated.webp"}},caller:{name:"The Caller",role:"Unknown number",portraits:{shadow:"assets/characters/caller/shadow.webp"}},guard:{name:"Jetty Security",role:"Guard",portraits:{blank:"assets/characters/guard/blank.webp"}}},Q={creed:{who:"caller",line:'"You smell like every landlord in Lekki."',access:0,note:"Neutral. The default Lekki choice."},oud:{who:"caller",line:'The guard straightens. "Corporate. Good."',access:1,note:"Reads as serious money."},sauvage:{who:"wife",line:"A wife on the main deck sneezes.",access:-1,note:"Too loud for a boat. Wives mark you."},baccarat:{who:"wife",line:'"Oh. He has taste."',access:1,note:"Main deck approves. Men are unmoved."},cocoa:{who:"caller",line:'He pauses. "Quiet money. I like that."',access:2,note:"Best access. Wives ignore you all night."}},V=[{id:"01",type:"fork",title:"The Sitting Room Pitch",bg:"sittingroom",speaker:"tunde",face:"anxious",line:"Fifty hectares, Chief. Epe. Off-market. We close Monday.",prompt:"The gold iPhone lights up. +234 803 000 0000.",options:[{text:"Let it ring. Tunde has your full attention.",reply:'Tunde smiles and adjusts his glasses. "Thank you, Chief. As I was saying..."',next:"01b",flags:{stayed:!0}},{text:"Raise one finger. Answer it.",reply:`Tunde freezes mid-sentence. A deep voice: "Brafino. Ikoyi jetty. Sunday. 4 PM. Don't be late."`,next:"02",flags:{answered:!0}}]},{id:"01b",type:"ending",title:"THE BOAT LEFT",bg:"sittingroom",body:"The pitch ran until 6 PM. The Epe land sold on Tuesday. The number never called again.",replay:{label:"Run it back",next:"01"}},{id:"02",type:"fork",title:"The Invitation",bg:"sittingroom",speaker:"tunde",face:"anxious",line:"...Chief? The Epe numbers?",prompt:"Sunday. 4 PM. Ikoyi.",options:[{text:`"Pack the iPad, Tunde. We're going to Ikoyi."`,reply:'Tunde beams, standing up fast. "Let me go change my outfit, Chief!"',next:"03",flags:{path:"loyalty"}},{text:'"Pause. My stomach is turning. I need to rest."',reply:`Tunde packs the iPad slowly. He doesn't look up. "Monday, Chief."`,next:"03",flags:{path:"greed"}}]},{id:"03",type:"loadout",title:"The Scent Profile",bg:"closet",speaker:null,prompt:"Five bottles. One jetty full of people who will notice.",confirmLabel:"Walk out",options:[{text:"Creed Aventus",vibe:"Loud and expected. Money, no mystery.",flags:{scent:"creed"},next:"04"},{text:"Tom Ford Oud Wood",vibe:"Heavy, dark, corporate. Built for handshakes.",flags:{scent:"oud"},next:"04"},{text:"Sauvage Elixir",vibe:"Way too aggressive for a boat. The wives will sneeze.",flags:{scent:"sauvage"},next:"04"},{text:"MFK Baccarat Rouge 540",vibe:"Sweet, trendy, high-end. The wives will approve.",flags:{scent:"baccarat"},next:"04"},{text:"Pure cocoa butter. No cologne.",vibe:'"I am too rich to smell like a department store."',flags:{scent:"cocoa"},next:"04"}]},{id:"04",type:"hotspot",title:"The Jetty Ticket",bg:"jetty",speaker:null,prompt:"Three men. One nod gets you on the boat.",retryLine:`The guard's hand lands on your chest. "Chief. Move."`,targets:[{id:"loudshirt",label:"The man in the tight, shiny shirt shouting at a deckhand.",box:{x:6,y:52,w:22,h:30},correct:!1,reply:"A loud spender, not a power broker. Security blocks the ramp.",access:-1,next:"04"},{id:"linen",label:"The older man in black linen, quietly sipping water near the stern.",box:{x:66,y:44,w:20,h:34},correct:!0,reply:"He catches your eye. One slow nod. He whispers to the guard. The rope drops.",access:1,next:"05",flags:{spotted:!0}},{id:"polo",label:"The man in the polo shirt spraying cash at the live band.",box:{x:38,y:56,w:22,h:26},correct:!1,reply:"A politician's nephew spending allowance. He doesn't know your name. Neither does security.",access:-1,next:"04"}]},{id:"05",type:"cutscene",title:"The Tease",bg:"deck",speaker:"caller",face:"shadow",line:"Welcome to the deep water, Chief. The wives think this is a party. The men upstairs know it's a clearing house. Watch your step.",onEnter:{scentPayoff:!0},fadeToBlack:!0,endCard:{kicker:"ACT II",title:"UP NEXT",subtitle:"THE MAIN DECK GATEKEEPERS"}}],g={meta:J,characters:Z,scentPayoffs:Q,scenes:V},i=document.getElementById("stage"),d=g.meta,G=["01","02","03","04","05"],h={spark:'<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffe89a"/><stop offset="42%" stop-color="#f5b544"/><stop offset="100%" stop-color="#e2603f"/></linearGradient></defs><path d="M11 2.4l1.95 5.25 5.25 1.95-5.25 1.95L11 16.8l-1.95-5.25L3.8 9.6l5.25-1.95z" fill="url(#sparkGrad)"/><path d="M17.9 14.3l.85 2.25 2.25.85-2.25.85-.85 2.25-.85-2.25-2.25-.85 2.25-.85z" fill="#ffd166"/></svg>',mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="2.8" y="5.2" width="18.4" height="13.6" rx="2.2"/><path d="M3.6 6.9l8.4 5.7 8.4-5.7"/></svg>',pad:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 8.4h8a4.4 4.4 0 0 1 4.3 5.2l-.6 2.9a2.5 2.5 0 0 1-4.3 1.2l-1-1.2H9.6l-1 1.2a2.5 2.5 0 0 1-4.3-1.2l-.6-2.9A4.4 4.4 0 0 1 8 8.4Z"/><path d="M8.2 11.6v2.4M7 12.8h2.4M15.8 12h.01M17.4 13.6h.01"/></svg>',chev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5.5l6.5 6.5L9 18.5"/></svg>'},r={scene:null,flags:{},access:0,retries:0,seen:[]};let $=null,b=null,L=null,j=null;const s=e=>String(e).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]),m=e=>g.scenes.find(t=>t.id===e),X=e=>Math.max(-2,Math.min(4,e));function S(e){r.access=X(r.access+(e||0))}function M(e){e&&Object.assign(r.flags,e)}function y(e){$=null,b=null,document.body.classList.remove("auth"),r.scene=e;const t=m(e);if(!t)return U(e);g.meta.start!==e&&!r.seen.includes(e)&&r.seen.push(e),g.meta.start!==e&&z({chapters:r.seen.length,scene:e}),I(t)}function ee(e){const t=G.indexOf(e.id),a=G.map((o,n)=>`<span class="dot${n===t?" on":""}${n<t?" done":""}"></span>`).join("");return`<header class="hud">
    <span class="chip">${s(d.title)}</span>
    <div class="dots" aria-hidden="true">${a}</div>
  </header>`}function D(e,t){const a=g.characters[e];if(!a)return"";const o=a.name.replace(/[^A-Za-z]/g,"").charAt(0)||"?";return`<div class="portrait char-${e}">
    <div class="bust"><span class="initial">${s(o)}</span></div>
    <div class="tag"><b>${s(a.name)}</b><span>${s(t||"")}</span></div>
  </div>`}function w(e,t,a=""){return`<div class="scene bg-${e.bg} ${a}">
    <div class="vignette"></div>
    ${ee(e)}
    ${t}
  </div>`}function I(e){clearTimeout(L);const a={fork:te,loadout:ae,hotspot:se,cutscene:ne,ending:oe}[e.type]||U;i.innerHTML=a(e),i.dataset.scene=e.id}function te(e){const t=e.options.map((o,n)=>`<button class="opt" data-opt="${n}"><span>${s(o.text)}</span><i aria-hidden="true">›</i></button>`).join(""),a=$?`<div class="reply" role="status">
         <p>${s($.text)}</p>
         <button class="cont" data-continue="${s($.next)}">Continue</button>
       </div>`:`<div class="options">${t}</div>`;return w(e,`<section class="mid">${D(e.speaker,e.face)}</section>
     <section class="dialogue">
       <div class="speaker">${s(g.characters[e.speaker]?.name||"")}</div>
       <p class="line">“${s(e.line)}”</p>
       ${e.prompt?`<p class="prompt">${s(e.prompt)}</p>`:""}
       ${a}
     </section>`)}function ae(e){const t=e.options.map((a,o)=>`<button class="scent scent-${a.flags.scent}${b===o?" sel":""}" data-scent="${o}">
        <span class="bottle" aria-hidden="true"></span>
        <span class="scent-text">
          <b>${s(a.text)}</b>
          <span>${s(a.vibe)}</span>
        </span>
      </button>`).join("");return w(e,`<section class="panel top">
       <h2 class="scene-title">${s(e.title)}</h2>
       <p class="prompt">${s(e.prompt)}</p>
     </section>
     <section class="loadout">${t}</section>
     <section class="bottom">
       <button class="cont wide" data-confirm ${b===null?"disabled":""}>${s(e.confirmLabel||"Continue")}</button>
     </section>`)}function se(e){const t=e.targets.map((a,o)=>`<button class="fig fig-${a.id}" data-target="${o}"
        style="left:${a.box.x}%;top:${a.box.y}%;width:${a.box.w}%;height:${a.box.h}%"
        aria-label="${s(a.label)}">
        <span class="fig-body" aria-hidden="true"></span>
        <span class="fig-label">${s(a.label)}</span>
      </button>`).join("");return w(e,`<section class="panel top">
       <h2 class="scene-title">${s(e.title)}</h2>
       <p class="prompt">${s(e.prompt)}</p>
     </section>
     <section class="jetty">${t}</section>
     <div class="toast-zone" aria-live="assertive"></div>`)}function ne(e){const t=e.onEnter?.scentPayoff&&r.flags.scent?g.scentPayoffs[r.flags.scent]:null,a=t?`<p class="aside">${s(t.line)}</p>`:"";return t&&S(t.access),w(e,`<section class="mid">${D(e.speaker,e.face)}</section>
     <section class="dialogue center">
       ${a}
       <p class="line">“${s(e.line)}”</p>
       <button class="cont wide" data-finish>Continue</button>
     </section>
     <div class="fade" hidden></div>`)}function oe(e){return w(e,`<section class="ending">
       <p class="kicker">${s(d.act)}</p>
       <h1 class="end-title">${s(e.title)}</h1>
       <p class="end-body">${s(e.body)}</p>
       <button class="cont wide" data-replay="${s(e.replay.next)}">${s(e.replay.label)}</button>
     </section>`)}function U(e){return`<div class="scene bg-lagoon"><div class="ending"><h1 class="end-title">MISSING SCENE</h1><p class="end-body">${s(e)}</p></div></div>`}const N="coastline.save.v1";function T(){try{return JSON.parse(localStorage.getItem(N)||"null")}catch{return null}}function z(e){const t={naira:0,gems:0,chapters:0,...T()||{},...e};try{localStorage.setItem(N,JSON.stringify(t))}catch{}return t}const re=e=>"₦"+Number(e||0).toLocaleString("en-NG");function K(){const e=T()||{naira:0,gems:0,chapters:0};return`<section class="auth-progress">
            <p class="auth-progress-title">${e.chapters>0?"We found progress on this phone":"Your progress shows here"}</p>
            <p class="auth-progress-stats">
              <span class="st">${re(e.naira)}</span>
              <span class="sep">&middot;</span>
              <span class="st">${e.gems} gems</span>
              <span class="sep">&middot;</span>
              <span class="st">${e.chapters} story chapters</span>
            </p>
            <p class="auth-progress-note">Create an account or sign in to keep it safe and use it on other devices.</p>
          </section>`}const Y={NG:"₦",US:"$",SDG:"SDG",INR:"₹",KRW:"₩",CA:"C$"},ie=[["NG","Nigeria"],["US","America"],["SDG","Sudan"],["INR","India"],["KRW","Korea"],["CA","Canada"]];let v=null,p=null,k=!1,R="";function C(){document.body.classList.add("auth");const e=!!(v&&p&&k),t=[["under13","Under 13"],["13-17","13 - 17"],["18+","18 or over"]].map(([o,n])=>`<button class="auth-btn light gate-age${v===o?" on":""}" data-age="${o}">${n}</button>`).join(""),a=ie.map(([o,n])=>`<button class="auth-btn ghost gate-region${p===o?" on":""}" data-region="${o}">
       <span class="rg">${o}</span>
       <span class="rn">${n}</span>
       <span class="rs">${Y[o]}</span>
     </button>`).join("");i.innerHTML=`<div class="scene auth-scene">
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
            <input type="checkbox" id="age-terms" ${k?"checked":""}>
            <span>I accept the Terms and Conditions and have read the Privacy Policy.</span>
          </label>

          <button class="auth-btn primary gate-continue" data-age-continue ${e?"":"disabled"}>Continue</button>
          <a href="#" class="gate-back" data-age-back>&larr; Back</a>
        </div>
      </section>
    </main>
  </div>`,i.querySelector("#age-terms")?.addEventListener("change",o=>{k=o.target.checked;const n=i.querySelector("[data-age-continue]");n&&(n.disabled=!(v&&p&&k))})}function ce(e){document.body.classList.add("auth");const t=e.name?`, ${s(e.name)}`:"";i.innerHTML=`<div class="scene auth-scene">
    <main class="auth-shell">
      <section class="auth-card">
        <div class="auth-hero">
          <img src="assets/bg/coastline-party.jpg" alt="" aria-hidden="true">
          <span class="auth-brand">${s(d.title).toUpperCase()}</span>
        </div>
        <div class="auth-body">
          <h1 class="auth-title">Welcome back${t}!</h1>
          <p class="auth-tag">The boat is still waiting. Pick up where you stopped.</p>
          ${K()}
          <button class="auth-btn primary" data-resume>
            <span class="ic" aria-hidden="true">${h.pad}</span>
            <span class="lbl">Enter the boat</span>
            <span class="chev" aria-hidden="true">${h.chev}</span>
          </button>
          <a href="#" class="gate-back" data-startover>Start over</a>
        </div>
      </section>
    </main>
  </div>`}const F="coastline.tour.v1",W={default:{title:"Hey, welcome in!",body:"Make yourself at home. Let me give you a quick look around so you know the local vibe, food, and everyday etiquette before you head out.",cta:"Show me around"},US:{title:"Hey, welcome in!",body:"Make yourself at home. Let me give you a quick look around so you know the local vibe, food, and everyday etiquette before you head out.",cta:"Show me around"},CA:{title:"Coucou, installe-toi.",body:"On y va? Let me walk you through the unspoken rules—from café etiquette to how we actually talk—so you don't stick out.",cta:"C'est parti"},SDG:{title:"Hababak ashara!",body:"Ya zol, come sit. Let's pour some shai and I'll put you onto the real vibe around here before you step outside.",cta:"Yalla, let's go"},NG:{title:"How far! You don land.",body:"Drop your load, no form stranger. Make I run you through how we dey move here so nobody go sell you story.",cta:"Oya, show me"},INR:{title:"Aao yaar, come in!",body:"Relax bro, no tension. Let me give you the real lowdown on how things work here—food, banter, sab kuch (everything).",cta:"Chalo, dikhao"},KRW:{title:"Eoseo wa! Glad you made it.",body:"Don't stress the rules—I got you. Let me show you how we eat, drink, and read the nunchi (눈치) so you blend right in.",cta:"Kaja! (가자!)"}},q=[{kicker:"Coastline Trips · 2 of 3",title:"Your choices move the story",body:"Tap an option to answer. Some choices win you access with the crew, some cost you. There is no single right path."},{kicker:"Coastline Trips · 3 of 3",title:"It remembers where you stopped",body:"Naira, gems and chapters are saved on this phone. Close the tab and the boat waits where you left it."}];function le(){const e=r.flags.region||(T()||{}).region,t=W[e]||W.default;return[{kicker:"Coastline Trips · 1 of 3",title:t.title,body:t.body,cta:t.cta},q[0],q[1]]}let x=0;function ue(){try{return localStorage.getItem(F)==="1"}catch{return!0}}function B(){try{localStorage.setItem(F,"1")}catch{}}function _(){const e=le(),t=e[x],a=x===e.length-1,o=e.map((c,f)=>`<span class="${f===x?"on":""}"></span>`).join(""),n=document.createElement("div");n.className="tour-veil",n.innerHTML=`<section class="tour-card" role="dialog" aria-modal="true" aria-label="Welcome tour">
    <div class="tour-head">
      <span class="tour-avatar"><img src="assets/bg/coastline-party.jpg" alt=""></span>
      <div>
        <p class="tour-kicker">${s(t.kicker)}</p>
        <h2 class="tour-title">${s(t.title)}</h2>
      </div>
    </div>
    <p class="tour-body">${s(t.body)}</p>
    <div class="tour-dots" aria-hidden="true">${o}</div>
    <div class="tour-actions">
      <button class="tour-btn" type="button" data-tour-skip>Skip tour</button>
      <button class="tour-btn primary" type="button" data-tour-next>${t.cta||(a?"Start playing":"Show me")}</button>
    </div>
  </section>`,n.querySelector("[data-tour-skip]").addEventListener("click",()=>{B(),n.remove()}),n.querySelector("[data-tour-next]").addEventListener("click",()=>{if(a){B(),n.remove();return}x+=1,n.remove(),_()}),i.appendChild(n)}function E(){const e=T();if(e&&e.scene&&e.chapters>0)return ce(e);const t=s(d.title);document.body.classList.add("auth"),i.innerHTML=`<div class="scene auth-scene">
    <main class="auth-shell">
      <section class="auth-card">
        <div class="auth-hero">
          <img src="assets/bg/coastline-party.jpg" alt="" aria-hidden="true">
          <span class="auth-brand">${s(d.title).toUpperCase()}</span>
        </div>
        <div class="auth-body">
          <h1 class="auth-title">Welcome to<br>${t}</h1>
          <p class="auth-tag">${s(d.tagline)}</p>

          ${K()}

          <button class="auth-btn primary" data-auth="create">
            <span class="ic" aria-hidden="true">${h.spark}</span>
            <span class="lbl">Create Account</span>
            <span class="chev" aria-hidden="true">${h.chev}</span>
          </button>
          <button class="auth-btn light" data-auth="signin">
            <span class="ic" aria-hidden="true">${h.mail}</span>
            <span class="lbl">Sign In</span>
            <span class="chev" aria-hidden="true">${h.chev}</span>
          </button>

          <div class="auth-or"><span>or play now</span></div>

          <label class="auth-label" for="guest-name">What should the crew call you?</label>
          <input class="auth-input" id="guest-name" maxlength="20" autocomplete="off"
                 placeholder="Your first name or nickname">

          <button class="auth-btn ghost" data-begin>
            <span class="ic" aria-hidden="true"><img class="ic-img" src="assets/icons/guest.png" alt=""></span>
            <span class="lbl">Continue as Guest</span>
            <span class="chev" aria-hidden="true">${h.chev}</span>
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
  </div>`,i.querySelector("#guest-name")?.addEventListener("keydown",o=>{o.key==="Enter"&&(o.preventDefault(),i.querySelector("[data-begin]")?.click())})}i.addEventListener("click",e=>{const t=e.target.closest("[data-opt]");if(t){const u=m(r.scene),l=u.options[Number(t.dataset.opt)];M(l.flags),l.access&&S(l.access),$={text:l.reply||"…",next:l.next},I(u);return}const a=e.target.closest("[data-continue]");if(a)return y(a.dataset.continue);const o=e.target.closest("[data-scent]");if(o)return b=Number(o.dataset.scent),I(m(r.scene));if(e.target.closest("[data-confirm]")&&b!==null){const l=m(r.scene).options[b];return M(l.flags),y(l.next)}const c=e.target.closest("[data-target]");if(c)return de(Number(c.dataset.target));if(e.target.closest("[data-finish]"))return pe();const A=e.target.closest("[data-replay]");if(A)return r.flags={},r.access=0,r.retries=0,r.seen=[],y(A.dataset.replay);if(e.target.closest("[data-auth]"))return e.preventDefault(),P("Prototype: accounts aren't connected yet.","bad");if(e.target.closest("[data-begin]")){const u=i.querySelector("#guest-name"),l=u&&u.value.trim().slice(0,20);return l&&(r.flags.guest=l),R=l||"",C()}if(e.target.closest("[data-resume]")){const u=T();return y(u&&u.scene||d.start)}if(e.target.closest("[data-startover]")){e.preventDefault();try{localStorage.removeItem(N)}catch{}return E()}const O=e.target.closest("[data-age]");if(O)return v=O.dataset.age,C();const H=e.target.closest("[data-region]");if(H)return p=H.dataset.region,C();if(e.target.closest("[data-age-back]"))return e.preventDefault(),E();if(e.target.closest("[data-age-continue]")){if(!(v&&p&&k))return;r.flags.region=p,z({age:v,region:p,currency:Y[p],name:R}),y(d.start),ue()||_();return}});function de(e){const t=m(r.scene),a=t.targets[e],o=i.querySelector(`[data-target="${e}"]`);a.correct?(M(a.flags),S(a.access),o?.classList.add("hit"),P(a.reply,"good"),setTimeout(()=>y(a.next),1200)):(r.retries+=1,S(a.access),o?.classList.remove("shake"),o?.offsetWidth,o?.classList.add("shake"),P(`${a.reply} ${t.retryLine||""}`,"bad"))}function P(e,t){const a=i.querySelector(".toast-zone");a&&(a.innerHTML=`<div class="toast ${t}">${s(e)}</div>`,clearTimeout(L),L=setTimeout(()=>a.innerHTML="",2600))}function pe(){const e=m(r.scene),t=i.querySelector(".fade");t&&(t.hidden=!1,t.classList.add("on"),clearTimeout(j),j=setTimeout(()=>{i.innerHTML=`<div class="scene bg-deck endscene">
      <div class="vignette"></div>
      <section class="endcard">
        <p class="kicker">${s(e.endCard.kicker)}</p>
        <p class="end-sub">${s(e.endCard.title)}</p>
        <h2 class="upnext">${s(e.endCard.subtitle)}</h2>
        <button class="cont wide" data-replay="${s(d.start)}">Play again</button>
      </section>
    </div>`},900))}E();
