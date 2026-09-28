// Visual catalog enhancements. Cart, prices and live stock remain in the original order script.
(() => {
  const section = document.querySelector('.menu-section .wrap');
  const head = section?.querySelector('.section-head');
  if (!section || !head || document.getElementById('cal-search')) return;
  const bar = document.createElement('label');
  bar.className = 'cal-search';
  bar.innerHTML = '<span aria-hidden="true">⌕</span><input id="cal-search" type="search" autocomplete="off" placeholder="Search burgers, momos, wraps..." aria-label="Search Caloyaa menu">';
  head.after(bar);
  const results = document.createElement('p'); results.className='cal-results'; results.setAttribute('role','status');
  bar.after(results);
  const empty = document.createElement('p'); empty.className='catalog-empty'; empty.textContent='No matches found. Try another item.'; empty.hidden=true;
  document.getElementById('menu-groups')?.after(empty);
  const art=(emoji,background)=>'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><rect width="240" height="240" rx="26" fill="${background}"/><circle cx="120" cy="110" r="82" fill="#ffffff55"/><text x="120" y="150" text-anchor="middle" font-size="105">${emoji}</text></svg>`);
  const photos = ['/hero-1.jpg','/hero-3.jpg','/hero-4.jpg',art('🍫','#f7c5ac'),art('🍟','#ffcf96'),art('🥤','#f8b9c4'),'/hero-1.jpg'];
  document.querySelectorAll('.food-group').forEach((group, i) => {
    group.querySelectorAll('.menu-item').forEach((card,j) => {
      const badge=document.createElement('span');badge.className='cal-veg';badge.setAttribute('aria-label','Vegetarian');
      if([0,1,2,6].includes(i)) card.querySelector('.item-info')?.prepend(badge);
      const img=document.createElement('img');img.className='cal-food-photo';const name=card.querySelector('.item-info strong')?.textContent||'';img.src=/momo/i.test(name)?'/hero-2.jpg':/fries/i.test(name)?'/hero-1.jpg':photos[i]||photos[0];img.alt='Illustrative '+group.querySelector('h3')?.textContent.replace(/^\W+/,'').trim()+' food';img.loading=j<3?'eager':'lazy';
      card.append(img);
    });
  });
  const search=bar.querySelector('input');
  function filter(){const q=search.value.trim().toLocaleLowerCase();let count=0;
    document.querySelectorAll('.food-group').forEach(group=>{let shown=0;group.querySelectorAll('.menu-item').forEach(card=>{
      const name=card.querySelector('.item-info strong')?.textContent||''; const match=name.toLocaleLowerCase().includes(q)||(!q&&true);
      card.hidden=!match;if(match){shown++;count++}
    });group.hidden=!shown});
    results.textContent=q?`${count} item${count===1?'':'s'} found`:'';empty.hidden=!!count;
  }
  search.addEventListener('input',filter);
  document.querySelectorAll('.category-nav a,.category-tile').forEach(a=>a.addEventListener('click',()=>{if(search.value){search.value='';filter()}}));
})();
