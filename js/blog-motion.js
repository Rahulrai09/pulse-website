/* Pulse blog motion: fade-up reveal, count-up figures, reading progress. Content stays visible if this fails. */
(function(){
  var art=document.querySelector('.blog-article');
  if(!art||!('IntersectionObserver' in window))return;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  // reading progress
  var bar=document.createElement('div');bar.id='bm-progress';document.body.appendChild(bar);
  function prog(){var r=art.getBoundingClientRect(),h=r.height-innerHeight;var p=h>0?Math.min(Math.max(-r.top/h,0),1):1;bar.style.width=(p*100)+'%';}
  addEventListener('scroll',prog,{passive:true});prog();
  if(reduce)return;
  document.documentElement.classList.add('bm-js');
  var fold=innerHeight*0.92;
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target;el.classList.add('bm-in');
    el.querySelectorAll('.bm-num').forEach(count);if(el.classList.contains('bm-num'))count(el);io.unobserve(el);});},{threshold:.12,rootMargin:'0px 0px -30px 0px'});
  function watch(el,cls){if(el.getBoundingClientRect().top<fold)return; el.classList.add(cls);io.observe(el);}
  // reveal: top-level blocks of the article, list cards, images
  Array.prototype.forEach.call(art.children,function(el){if(el.matches('script,style,.bx-crumbs,.blog-title,.blog-meta,.blog-deck,.bx-byline,.bx-toc'))return;watch(el,el.tagName==='IMG'||el.tagName==='FIGURE'?'bm-ri':'bm-rv');});
  art.querySelectorAll('.bx-rel > li,.key-facts li').forEach(function(li,i){li.style.setProperty('--bm-d',((i%4)*0.08)+'s');});
  // count-up: short figures in <strong>, table cells and Key Facts, e.g. "15%", "120 to 200 ms", "Rs 7 lakh to Rs 22 lakh"
  var NUM=/\d{1,3}(?:,\d{2,3})+(?:\.\d+)?|\d+(?:\.\d+)?/g;
  var OK=/^(?:\s|rs\.?|₹|to|and|or|–|-|—|%|\+|\/|lakh|lakhs|crore|crores|k|ms|mmhg|mg\/dl|g\/dl|mm|cm|ml|l|kg|w|kw|hours?|hrs?|minutes?|mins?|days?|weeks?|months?|years?|beds?|units?|per|a|day|month|x|×|about|up|over|under|less|than|more|cmh2o|bpm|ft|sq|watts?)*$/i;
  art.querySelectorAll('strong,b,td').forEach(function(el){
    if(el.children.length)return;var t=el.textContent.trim();if(!t||t.length>48)return;
    var nums=t.match(NUM);if(!nums||nums.length>2)return;
    if(!OK.test(t.replace(NUM,' ')))return;
    if(nums.length===1&&/^(19|20)\d\d$/.test(t))return; // a bare year
    if(nums.some(function(x){return /^(19|20)\d\d$/.test(x)&&!/[%₹]|rs|lakh|crore/i.test(t)&&nums.length===2&&/^(19|20)\d\d$/.test(nums[0])}))return; // year ranges
    if(nums.every(function(x){return parseFloat(x.replace(/,/g,''))===0}))return;
    el.classList.add('bm-num');el.dataset.bmTxt=t;
    if(el.getBoundingClientRect().top>=fold&&!el.closest('.bm-rv,.bm-ri'))io.observe(el);
  });
  function count(el){if(el.dataset.bmDone)return;el.dataset.bmDone=1;var t=el.dataset.bmTxt,st=null,dur=1100;
    function f(ts){if(!st)st=ts;var p=Math.min((ts-st)/dur,1),e=1-Math.pow(1-p,3);
      el.textContent=p<1?t.replace(NUM,function(x){var d=(x.split('.')[1]||'').length,v=parseFloat(x.replace(/,/g,''))*e,s=d?v.toFixed(d):String(Math.round(v));
        if(x.indexOf(',')>-1){var q=s.split('.');q[0]=Number(q[0]).toLocaleString('en-IN');s=q.join('.');}return s;}):t;
      if(p<1)requestAnimationFrame(f);}
    requestAnimationFrame(f);}
})();
