(()=>{
  if('serviceWorker' in navigator){ navigator.serviceWorker.register('./sw.js').catch(()=>{}); }
  const q=id=>document.getElementById(id);
  const $=s=>document.querySelector(s);
  const $$=s=>Array.from(document.querySelectorAll(s));

  const quickItems=[
    {id:'water',label:'میرا پانی چاہیے',icon:'💧',audio:'water'},
    {id:'pain',label:'مجھے درد ہو رہا ہے',icon:'🤕',audio:'pain'},
    {id:'nurse',label:'نرس کو بلائیں',icon:'🩺',audio:'nurse'},
    {id:'bathroom',label:'میں باتھ روم جانا چاہتا ہوں',icon:'🚽',audio:'bathroom'},
    {id:'breath',label:'مجھے سانس لینے میں مشکل ہے',icon:'😮‍💨',audio:'breath'},
    {id:'family',label:'میرے گھر والوں کو بلائیں',icon:'👨‍👩‍👦',audio:'family'},
    {id:'hunger',label:'مجھے بھوک لگی ہے',icon:'🍞',audio:'hunger'},
    {id:'medicine',label:'مجھے دوا چاہیے',icon:'💊',audio:'medicine'},
    {id:'ok',label:'میں ٹھیک ہوں',icon:'🙂',audio:'ok'},
    {id:'thanks',label:'شکریہ',icon:'🙏',audio:'thanks'},
  ];

  const categories=[
    {id:'hospital',title:'ہسپتال',icon:'🏥',color:'#06b6d4',items:[
      {label:'ڈاکٹر چاہیے',audio:'doctor'},
      {label:'ویل چیئر چاہیے',audio:'wheelchair'},
      {label:'ٹیسٹ کروائیں',audio:'test'},
      {label:'دیگر',audio:'other_hospital'},
    ]},
    {id:'emergency',title:'ایمرجنسی',icon:'🚨',color:'#ef4444',items:[
      {label:'مدد کریں',audio:'help'},
      {label:'آگ / حادثہ',audio:'fire'},
      {label:'چوٹ لگ گئی',audio:'injury'},
      {label:'فوری ڈاکٹر',audio:'emergency_doctor'},
    ]},
    {id:'food',title:'کھانا / پینا',icon:'🍽️',color:'#f59e0b',items:[
      {label:'کھانا لائیں',audio:'food_serve'},
      {label:'پانی لائیں',audio:'water_serve'},
      {label:'چائے / کافی',audio:'tea'},
      {label:'رک جاؤ',audio:'stop_food'},
    ]},
    {id:'bathroom',title:'باتھ روم',icon:'🧹',color:'#10b981',items:[
      {label:'میں جانا چاہتا ہوں',audio:'go_bathroom'},
      {label:'صابون چاہیے',audio:'soap'},
      {label:'تولئیے کاغذ',audio:'tissue'},
      {label:'باتھ روم صاف کرئیں',audio:'clean_bathroom'},
    ]},
    {id:'family',title:'فیملی',icon:'👨‍👩‍👦',color:'#8b5cf6',items:[
      {label:'بیٹا / بیٹی بلاو',audio:'call_son'},
      {label:'بیوی / شوہر بلاو',audio:'call_spouse'},
      {label:'والدین بلاو',audio:'call_parents'},
      {label:'دوست بلاو',audio:'call_friend'},
    ]},
    {id:'daily',title:'روٹین',icon:'🗓️',color:'#06b6d4',items:[
      {label:'سونے کے لیے تیار ہوں',audio:'sleep'},
      {label:'کہانی سناؤ',audio:'story'},
      {label:'ٹی وی / موسیقی',audio:'tv'},
      {label:'درجہ حرارت بتائیں',audio:'temperature'},
    ]},
  ];

  let currentCat=null;
  let currentAudio=null;

  function speak(text){
    if(!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.lang='ur-PK';
    u.rate=0.95;
    u.pitch=1;
    u.volume=1;
    const voices=window.speechSynthesis.getVoices();
    const male=voices.find(v=>/ur|pk/i.test(v.lang) && /google|microsoft|humayun|rehan|male|saleem|zira/i.test(v.name));
    if(male) u.voice=male;
    window.speechSynthesis.speak(u);
  }
  function playAudioFile(base){
    const files=[`${base}.mp3`,`${base}.wav`,`${base}.ogg`];
    let tried=0;
    return new Promise(res=>{
      function tryNext(){
        if(tried>=files.length){ res(false); return; }
        const f=files[tried++];
        const el=new Audio(`audio/${f}`);
        el.onended=()=>res(true);
        el.onerror=tryNext;
        el.play().then(()=>res(true)).catch(tryNext);
      }
      tryNext();
    });
  }

  let ttsEnabled = true;

  async function tap(base){
    if(currentAudio){ try{currentAudio.pause();}catch(e){} currentAudio=null; }
    window.speechSynthesis.cancel();
    const did = await playAudioFile(base);
    if(ttsEnabled) speakFromLabel(base);
    showToast('🔊');
  }

  function toggleTts(){
    ttsEnabled = !ttsEnabled;
    const btn = document.getElementById('ttsToggle');
    if(btn){
      btn.textContent = ttsEnabled ? '🔊 TTS ON' : '🔇 TTS OFF';
      btn.style.background = ttsEnabled ? 'var(--accent2)' : 'var(--card)';
    }
    showToast(ttsEnabled ? 'TTS On' : 'TTS Off');
  }

  function renderQuick(){
    const g=q('quickGrid');
    g.innerHTML=quickItems.map(x=>`<div class="card" data-base="${x.id}" role="button" tabindex="0" aria-label="${x.label}"><div class="icon">${x.icon}</div><div class="label">${x.label}</div></div>`).join('');
    g.querySelectorAll('.card').forEach(c=>c.addEventListener('click',()=>tap(c.dataset.base)));
  }

  function renderCategories(){
    const g=q('catGrid');
    g.innerHTML=categories.map(c=>`<div class="cat" data-id="${c.id}" role="button" tabindex="0" aria-label="${c.title}"><div class="cat-icon" style="color:${c.color}">${c.icon}</div><div><div class="cat-title">${c.title}</div></div></div>`).join('');
    g.querySelectorAll('.cat').forEach(c=>c.addEventListener('click',()=>openCategory(c.dataset.id)));
  }

  function openCategory(id){
    const cat=categories.find(x=>x.id===id);
    if(!cat) return;
    currentCat=cat;
    const ov=q('overlay');
    ov.classList.remove('hidden');
    ov.innerHTML=`<div class="overlay-content"><h3>${cat.icon} ${cat.title}</h3><div>${cat.items.map((it,i)=>`<button data-i="${i}">${it.label}</button>`).join('')}</div><button class="close" id="closeOv">بند کریں</button></div>`;
    ov.querySelector('#closeOv').addEventListener('click',closeOverlay);
    ov.querySelectorAll('button[data-i]').forEach(b=>b.addEventListener('click',()=>{ closeOverlay(); tap(cat.items[+b.dataset.i].audio); }));
  }

  function closeOverlay(){
    q('overlay').classList.add('hidden');
    q('overlay').innerHTML='';
    currentCat=null;
  }

  function showToast(msg){ const t=q('toast'); t.textContent=msg; t.classList.remove('hidden'); setTimeout(()=>t.classList.add('hidden'),600); }

  function loadVoices(){
    if('speechSynthesis' in window){ window.speechSynthesis.getVoices(); }
  }

  function init(){
    renderQuick();
    renderCategories();
    loadVoices();
    window.speechSynthesis.onvoiceschanged=loadVoices;
    const tb=q('testSoundBtn');
    if(tb){ tb.addEventListener('click',()=>{ window.speechSynthesis.cancel(); speak('میں ٹھیک ہوں'); showToast('🔊'); }); }
    const tt=q('ttsToggle');
    if(tt){ tt.addEventListener('click',toggleTts); }
    const ib=q('infoBtn');
    if(ib){ ib.addEventListener('click',()=>{ alert('Zave for Patients v1\nTap any card to hear Urdu voice.\nOffline-ready.\nProject lead: Muhammad Arshad Zedi\nDeveloped by: ZAVE Digital'); }); }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
