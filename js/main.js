(function(){
  // split text into per-word animated spans (keeps <br>)
  document.querySelectorAll('[data-split]').forEach(function(el){
    var start=parseFloat(el.dataset.start), dur=el.dataset.dur, i=0;
    var nodes=Array.prototype.slice.call(el.childNodes);
    el.textContent='';
    var cur=el;
    nodes.forEach(function(n){
      if(n.nodeType===3){
        n.textContent.split(/\s+/).filter(Boolean).forEach(function(word,k,arr){
          var s=document.createElement('span');
          s.className='w';
          s.style.setProperty('--d',(start+i*.06).toFixed(2)+'s');
          s.style.animationDuration=dur+'s';
          s.textContent=word;
          i++;
          cur.appendChild(s);
          cur.appendChild(document.createTextNode(' '));
        });
      } else {
        cur.appendChild(n);
      }
    });
    if(el.classList.contains('tag')){
      var f=el.querySelector('.w'), wrap=document.createElement('span');
      wrap.className='first';
      var line=[],n=f;
      while(n&&n.nodeName!=='BR'){line.push(n);n=n.nextSibling}
      el.insertBefore(wrap,f);
      line.forEach(function(x){wrap.appendChild(x)});
    }
  });

  // nav: hamburger + language
  var burger=document.getElementById('burger'), menu=document.getElementById('menu');
  burger.addEventListener('click',function(){
    var o=menu.classList.toggle('open'); burger.setAttribute('aria-expanded',o);
  });
  document.addEventListener('click',function(e){
    if(!menu.contains(e.target)&&!burger.contains(e.target)){menu.classList.remove('open');burger.setAttribute('aria-expanded','false')}
  });
  document.querySelectorAll('.lang button').forEach(function(b){
    b.addEventListener('click',function(){
      document.querySelectorAll('.lang button').forEach(function(x){x.classList.toggle('on',x===b)});
      document.documentElement.lang=b.dataset.lang==='BA'?'bs':'en';
    });
  });

  // video: never stops + progress bars
  var v=document.getElementById('vid'), bars=[].slice.call(document.querySelectorAll('#bars .bar'));
  function play(){var p=v.play(); if(p&&p.catch)p.catch(function(){})}
  ['pause','ended','stalled','suspend','waiting'].forEach(function(ev){v.addEventListener(ev,function(){if(ev==='ended')v.currentTime=0;play()})});
  v.addEventListener('canplay',play);
  setInterval(function(){if(v.paused||v.ended)play()},1000);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)play()});
  ['touchstart','pointerdown','click'].forEach(function(ev){document.addEventListener(ev,play,{once:true,passive:true})});
  var active=0;
  function setActive(i){if(i===active)return;active=i;bars.forEach(function(b,k){b.classList.toggle('on',k===i)})}
  v.addEventListener('timeupdate',function(){
    if(!v.duration)return;
    setActive(Math.min(3,Math.floor(v.currentTime/v.duration*4)));
  });
  bars.forEach(function(b,i){
    b.addEventListener('click',function(){
      if(v.duration){v.currentTime=i*v.duration/4+.01}
      setActive(i);play();
    });
  });

  // scroll-triggered section 2
  var sec=document.getElementById('latest');
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es,o){
      es.forEach(function(e){if(e.isIntersecting){sec.classList.add('in');o.disconnect()}});
    },{threshold:.15}).observe(sec);
  } else sec.classList.add('in');
})();
