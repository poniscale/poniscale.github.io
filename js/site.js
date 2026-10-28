const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'關閉導覽選單':'開啟導覽選單');nav.classList.toggle('open',open);toggle.textContent=open?'×':'☰'});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){toggle.click();toggle.focus()}});
const filters=[...document.querySelectorAll('[data-filter]')],cards=[...document.querySelectorAll('.catalog .product-card')],search=document.querySelector('#productSearch');
let category=new URLSearchParams(location.search).get('category')||'全部商品';if(!filters.some(f=>f.dataset.filter===category))category='全部商品';
function filter(){const term=(search?.value||'').trim().toLocaleLowerCase();let total=0;cards.forEach(c=>{const show=(category==='全部商品'||c.dataset.category===category)&&c.dataset.search.toLocaleLowerCase().includes(term);c.hidden=!show;if(show)total++});filters.forEach(f=>f.setAttribute('aria-pressed',String(f.dataset.filter===category)));const status=document.querySelector('.result-count');if(status)status.textContent=`${category} / 共 ${total} 款商品`;const empty=document.querySelector('.empty-state');if(empty)empty.hidden=total!==0}
filters.forEach(f=>f.addEventListener('click',()=>{category=f.dataset.filter;const u=new URL(location.href);if(category==='全部商品')u.searchParams.delete('category');else u.searchParams.set('category',category);try{history.replaceState(null,'',u)}catch{}filter();document.querySelector('.catalog')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}));search?.addEventListener('input',filter);if(cards.length)filter();
const dialog=document.querySelector('#galleryDialog');let galleryTrigger;document.querySelectorAll('[data-image]').forEach(b=>b.addEventListener('click',()=>{galleryTrigger=b;dialog.querySelector('img').src=b.dataset.image;dialog.showModal()}));dialog?.querySelector('button').addEventListener('click',()=>dialog.close());dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});dialog?.addEventListener('close',()=>galleryTrigger?.focus());

const backToTop=document.querySelector('.back-to-top');
if(backToTop){const updateBackToTop=()=>{backToTop.hidden=window.scrollY<500};window.addEventListener('scroll',updateBackToTop,{passive:true});updateBackToTop();backToTop.addEventListener('click',()=>{window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})})}

const assistant=document.querySelector('.poni-assistant');
if(assistant){
 const launcher=assistant.querySelector('.assistant-launcher'),panel=assistant.querySelector('.assistant-panel'),close=assistant.querySelector('.assistant-close');
 function setAssistant(open,returnFocus=false){launcher.setAttribute('aria-expanded',String(open));launcher.setAttribute('aria-label',open?'關閉金來磅小助手快捷選單':'開啟金來磅小助手快捷選單');panel.hidden=!open;launcher.querySelector('.assistant-name > span').textContent=open?'－':'＋';if(open)panel.querySelector('a')?.focus();else if(returnFocus)launcher.focus()}
 launcher.addEventListener('click',()=>setAssistant(panel.hidden));
 close.addEventListener('click',()=>setAssistant(false,true));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){setAssistant(false,true)}});
 document.addEventListener('click',e=>{if(!panel.hidden&&!assistant.contains(e.target))setAssistant(false)});
 panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setAssistant(false)));
}

// Keep closed floating controls away from contact links and contact sections.
const contactAssistant=document.querySelector('.poni-assistant'),contactTop=document.querySelector('.back-to-top');
if(contactAssistant||contactTop){
 const contactZones=[...document.querySelectorAll('.contact-band,footer,.contact-layout')];
 const protectedLinks=[...document.querySelectorAll('a[href^="tel:"],a[href*="contact.html"],a[href*="line.me/"]')].filter(a=>!a.closest('.poni-assistant,.mobile-contact'));
 const overlaps=(a,b,pad=10)=>a.width>0&&a.height>0&&b.width>0&&b.height>0&&a.left<b.right+pad&&a.right>b.left-pad&&a.top<b.bottom+pad&&a.bottom>b.top-pad;
 let contactFrame=0;
 const updateContactClearance=()=>{contactFrame=0;const inContactZone=contactZones.some(el=>{const r=el.getBoundingClientRect();return r.height>0&&r.top<window.innerHeight-65&&r.bottom>80});
 for(const control of [contactAssistant,contactTop]){if(!control)continue;const open=control===contactAssistant&&control.querySelector('.assistant-launcher').getAttribute('aria-expanded')==='true';const bounds=control.getBoundingClientRect();const collision=protectedLinks.some(a=>{const r=a.getBoundingClientRect();return r.bottom>0&&r.top<window.innerHeight&&overlaps(bounds,r)});control.classList.toggle('avoid-contact',!open&&(inContactZone||collision));}
 };
 const scheduleContactClearance=()=>{if(!contactFrame)contactFrame=requestAnimationFrame(updateContactClearance)};
 window.addEventListener('scroll',scheduleContactClearance,{passive:true});window.addEventListener('resize',scheduleContactClearance);document.addEventListener('click',scheduleContactClearance);document.addEventListener('focusin',scheduleContactClearance);updateContactClearance();
}
