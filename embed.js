/* Shared multi-platform embed resolver.
   Exposes window.getEmbedHTML(url) and window.processEmbeds().
   Used by the specialist dashboard now and the public Local Ad Screen later. */
(function(){
  function esc(s){var d=document.createElement("div");d.textContent=s||"";return d.innerHTML;}

  var scriptsLoaded = { instagram:false, tiktok:false, twitter:false };

  function loadScript(id, src){
    if(document.getElementById(id)) return;
    var s=document.createElement("script");
    s.id=id; s.src=src; s.async=true;
    document.body.appendChild(s);
  }

  // Load each third-party embed script exactly once per page load
  function ensureScripts(){
    if(!scriptsLoaded.instagram){
      loadScript("instagram-embed-js","https://www.instagram.com/embed.js");
      scriptsLoaded.instagram=true;
    }
    if(!scriptsLoaded.tiktok){
      loadScript("tiktok-embed-js","https://www.tiktok.com/embed.js");
      scriptsLoaded.tiktok=true;
    }
    if(!scriptsLoaded.twitter){
      loadScript("twitter-widgets-js","https://platform.twitter.com/widgets.js");
      scriptsLoaded.twitter=true;
    }
  }

  // Re-run each library's DOM scanning after we inject blockquotes dynamically
  function processEmbeds(){
    try{ if(window.instgrm && window.instgrm.Embeds && window.instgrm.Embeds.process) window.instgrm.Embeds.process(); }catch(e){}
    try{ if(window.twttr && window.twttr.widgets && window.twttr.widgets.load) window.twttr.widgets.load(); }catch(e){}
    try{ if(window.tiktokEmbed && window.tiktokEmbed.lib) window.tiktokEmbed.lib(); }catch(e){}
    try{ if(window.tiktok && window.tiktok.refresh) window.tiktok.refresh(); }catch(e){}
  }

  // Detect source type and return embed markup, or a clear unsupported message
  function getEmbedHTML(url){
    var u=String(url||"").trim();
    if(!u) return '';
    var baseImg=' style="max-width:100%;max-height:180px;border-radius:8px;margin-top:8px"';
    var baseIframe=' style="width:100%;aspect-ratio:16/9;border:0;border-radius:8px;margin-top:8px"';

    // Direct image file
    if(/\.(png|jpe?g|webp|gif|svg)$/i.test(u)) return '<img src="'+esc(u)+'"'+baseImg+'>';

    // Direct video file
    if(/\.(mp4|webm|ogg|mov|m4v)$/i.test(u)) return '<video src="'+esc(u)+'" controls'+baseImg+'></video>';

    // YouTube
    if(/youtube\.com|youtu\.be/i.test(u)){
      var m=u.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
      if(m) return '<iframe src="https://www.youtube.com/embed/'+m[1]+'"'+baseIframe+' allowfullscreen></iframe>';
      return '<div class="muted">Unsupported YouTube link format.</div>';
    }

    // TikTok — official blockquote + script
    if(/tiktok\.com/i.test(u)){
      ensureScripts();
      return '<blockquote class="tiktok-embed" cite="'+esc(u)+'" data-unique-id="'+esc(u)+'" data-embed-type="creator" style="max-width:325px;min-width:325px;margin-top:8px">'+esc(u)+'</blockquote>';
    }

    // Instagram — official blockquote + script
    if(/instagram\.com|instagr\.am/i.test(u)){
      ensureScripts();
      return '<blockquote class="instagram-media" data-instgrm-permalink="'+esc(u)+'" data-instgrm-version="14" style="background:#fafafa;border:1px solid #dbdbdb;border-radius:8px;margin:8px auto 0;max-width:540px;padding:8px;line-height:1.5">'+esc(u)+'</blockquote>';
    }

    // X / Twitter — official blockquote + widgets.js
    if(/twitter\.com|x\.com/i.test(u)){
      ensureScripts();
      var statusId = u.match(/(?:twitter\.com|x\.com)\/[^\/]+\/status\/(\d+)/);
      var embedUrl = statusId ? 'https://twitter.com/i/status/'+statusId[1] : esc(u);
      return '<blockquote class="twitter-tweet" cite="'+esc(u)+'"><a href="'+embedUrl+'"></a></blockquote>';
    }

    // Facebook public post — post plugin iframe
    if(/facebook\.com|fb\.com/i.test(u)){
      return '<iframe src="https://www.facebook.com/plugins/post.php?href='+encodeURIComponent(u)+'&width=500&show_text=true" style="width:100%;max-width:500px;min-height:300px;border:0;border-radius:8px;margin-top:8px;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>';
    }

    // LinkedIn — not supported this stage
    if(/linkedin\.com/i.test(u)){
      return '<div class="muted" style="padding:10px;border:1px dashed rgba(147,188,94,.5);border-radius:8px;margin-top:8px">LinkedIn embeds aren\'t supported yet — paste the raw embed code instead.</div>';
    }

    // Unknown
    return '<div class="muted" style="padding:10px;border:1px dashed rgba(147,188,94,.5);border-radius:8px;margin-top:8px">Unsupported link format.</div>';
  }

  window.getEmbedHTML = getEmbedHTML;
  window.processEmbeds = function(){ ensureScripts(); processEmbeds(); };
})();
