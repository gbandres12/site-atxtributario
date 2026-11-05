// WhatsApp: mensagem conforme a origem do anúncio + eventos de conversão
(function(){
  const WA_NUM='5592995096571';
  const qs=new URLSearchParams(location.search);
  try{if(qs.get('utm_source'))sessionStorage.setItem('src',qs.get('utm_source').toLowerCase())}catch(e){}
  const src=(()=>{try{return sessionStorage.getItem('src')}catch(e){return qs.get('utm_source')}})()||'';
  const origem=/face|insta|meta|ig|fb/.test(src)?'pelo Instagram':/google|gads|adwords/.test(src)||!src?'pelo Google':'pelo site';
  const waUrl=extra=>`https://wa.me/${WA_NUM}?text=${encodeURIComponent(`Oi, vim ${origem} e tenho interesse em serviços contábeis.${extra?' '+extra:''}`)}`;
  function track(cta){
    try{window.dataLayer=window.dataLayer||[];dataLayer.push({event:'whatsapp_click',cta,page:location.pathname})}catch(e){}
    try{window.gtag&&gtag('event','generate_lead',{method:'whatsapp',cta})}catch(e){}
    try{window.fbq&&fbq('track','Contact',{content_name:cta})}catch(e){}
  }
  document.addEventListener('click',e=>{const a=e.target.closest('.js-wa');if(!a)return;a.href=waUrl(a.dataset.extra||'');track(a.dataset.cta||'whatsapp')});
  document.querySelectorAll('.js-wa').forEach(a=>a.href=waUrl(a.dataset.extra||''));
})();
