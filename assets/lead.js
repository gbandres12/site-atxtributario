// Formulário de lead: valida, guarda os dados na sessão e leva para /obrigado
(function(){
  // URL do App Script da planilha de leads (Implantar > App da Web). Vazio = não envia.
  const LEAD_ENDPOINT='';
  const fmtTel=v=>{const d=v.replace(/\D/g,'').slice(0,11);
    if(d.length<3)return d;if(d.length<8)return `(${d.slice(0,2)}) ${d.slice(2)}`;
    return `(${d.slice(0,2)}) ${d.slice(2,d.length-4)}-${d.slice(-4)}`};
  document.querySelectorAll('.lead-form').forEach(f=>{
    const tel=f.querySelector('[name=telefone]');
    tel.addEventListener('input',()=>tel.value=fmtTel(tel.value));
    f.addEventListener('submit',e=>{
      e.preventDefault();
      const d=Object.fromEntries(new FormData(f));
      const err=f.querySelector('.lead-err');
      if(d.nome.trim().length<2){err.textContent='Informe seu nome.';return}
      if(d.telefone.replace(/\D/g,'').length<10){err.textContent='Informe um telefone com DDD.';return}
      if(!d.nicho||!d.faturamento){err.textContent='Escolha o segmento e o faturamento.';return}
      err.textContent='';
      let src='';try{src=sessionStorage.getItem('src')||''}catch(e){}
      d.origem=src;d.pagina=location.pathname;
      try{sessionStorage.setItem('lead',JSON.stringify(d))}catch(e){}
      try{window.dataLayer=window.dataLayer||[];dataLayer.push({event:'lead_form_submit',nicho:d.nicho,faturamento:d.faturamento,page:location.pathname})}catch(e){}
      if(LEAD_ENDPOINT){
        const body=JSON.stringify({...d,data:new Date().toISOString()});
        let sent=false;try{sent=navigator.sendBeacon(LEAD_ENDPOINT,body)}catch(e){}
        if(!sent){try{fetch(LEAD_ENDPOINT,{method:'POST',mode:'no-cors',body,keepalive:true})}catch(e){}}
      }
      location.href='/obrigado';
    });
  });
})();
