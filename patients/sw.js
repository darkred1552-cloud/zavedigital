const CACHE='zave-patients-v2';
const FILES=['/patients/','/patients/index.html','/patients/css/style.css','/patients/js/app.js','/patients/manifest.json','/patients/sw.js',
  '/patients/audio/water.mp3','/patients/audio/pain.mp3','/patients/audio/nurse.mp3','/patients/audio/bathroom.mp3',
  '/patients/audio/breath.mp3','/patients/audio/family.mp3','/patients/audio/hunger.mp3','/patients/audio/medicine.mp3',
  '/patients/audio/ok.mp3','/patients/audio/thanks.mp3','/patients/audio/doctor.mp3','/patients/audio/help.mp3',
  '/patients/audio/fire.mp3','/patients/audio/injury.mp3','/patients/audio/emergency_doctor.mp3','/patients/audio/food_serve.mp3',
  '/patients/audio/water_serve.mp3','/patients/audio/soap.mp3','/patients/audio/tissue.mp3','/patients/audio/clean_bathroom.mp3',
  '/patients/audio/call_son.mp3','/patients/audio/call_spouse.mp3','/patients/audio/call_parents.mp3','/patients/audio/call_friend.mp3',
  '/patients/audio/sleep.mp3','/patients/audio/story.mp3','/patients/audio/tv.mp3','/patients/audio/temperature.mp3'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).catch(()=>{})); self.skipToWait(); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))); });
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET') return;
  e.respondWith(caches.match(req).then(cached=>{
    const fetched=fetch(req).then(res=>{
      if(res && res.status===200){ const cl=res.clone(); caches.open(CACHE).then(c=>c.put(req,cl)); }
      return res;
    }).catch(()=>cached);
    return cached || fetched;
  }));
});
