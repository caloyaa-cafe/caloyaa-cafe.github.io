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
  // Existing Caloyaa photography where it fits; category art otherwise. Illustrative, not a photo of the exact item.
  const foodImage=(name,category)=>{
    if(/momo/i.test(name))return '/hero-2.jpg';
    if(/wrap/i.test(name))return '/hero-3.jpg';
    if(/maggi/i.test(name))return '/hero-4.jpg';
    if(/burger/i.test(name))return '/hero-1.jpg';
    if(/sandwich/i.test(name))return art('🥪','#f4c990');
    if(/pasta/i.test(name))return art('🍝','#f8cd9e');
    if(/bread/i.test(name))return art('🥖','#f2cd9b');
    if(/fries|chips/i.test(name))return art('🍟','#ffdb9c');
    if(/shake|mocktail|coffee|coke|red bull|monster/i.test(name))return art('🥤','#f1b4c1');
    if(/ice cream/i.test(name))return art('🍨','#e3c6f1');
    if(/brownie|chocolate|kit kat|dairy milk|5 star/i.test(name))return art('🍫','#c79c8e');
    return category===6?'/hero-1.jpg':art('🍽️','#f1d3bd');
  };
  document.querySelectorAll('.food-group').forEach((group, i) => {
    group.querySelectorAll('.menu-item').forEach((card,j) => {
      const badge=document.createElement('span');badge.className='cal-veg';badge.setAttribute('aria-label','Vegetarian');
      if([0,1,2,6].includes(i)) card.querySelector('.item-info')?.prepend(badge);
      const img=document.createElement('img');img.className='cal-food-photo';const name=card.querySelector('.item-info strong')?.textContent||'';img.src=foodImage(name,i);img.alt='Illustrative '+name+' artwork';img.loading=j<3?'eager':'lazy';
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

// Show personal and payment details only when a customer enters checkout.
(() => {
  const checkout = document.getElementById('order');
  if (!checkout) return;
  const open = () => { checkout.classList.add('checkout-open'); };
  if (location.hash === '#order') open();
  document.addEventListener('click', event => {
    if (event.target.closest('#cart-checkout, a[href="#order"]')) open();
  }, true);
  window.addEventListener('hashchange', () => {
    if (location.hash === '#order') open();
  });
})();

// Private portal order intake. WhatsApp remains a separate backup path.
(() => {
  const checkout = document.getElementById('order');
  const wa = document.getElementById('whatsapp');
  if (!checkout || !wa) return;
  const primary = document.createElement('button');
  primary.type = 'button';
  primary.id = 'portal-order';
  primary.className = 'order-button';
  primary.textContent = 'Send order request to Caloyaa';
  primary.disabled = true;
  primary.setAttribute('aria-describedby','portal-result');
  wa.before(primary);
  const note = document.createElement('p');
  note.className = 'send-note';
  note.textContent = 'Your order appears in Caloyaa’s private portal. Payment is checked by the cafe before acceptance.';
  primary.after(note);
  const result = document.createElement('div');
  result.id = 'portal-result';
  result.setAttribute('role','status');
  note.after(result);
  const labels = checkout.querySelector('.section-head p');
  if (labels) labels.textContent = 'No login required. Send to our private order portal or use WhatsApp as a backup.';
  const time = document.getElementById('preorder-time');
  const timeLabel = document.getElementById('time-wrap');
  if (timeLabel) timeLabel.firstChild.textContent = 'Preferred time (required)';
  time.required = true;
  const backup = document.createElement('p');
  backup.className = 'send-note';
  backup.textContent = 'Backup: WhatsApp opens a prefilled order. Tap Send there to place it by WhatsApp instead. Do not use both methods for the same order.';
  wa.before(backup);
  const sync = () => {
    primary.disabled = wa.disabled || primary.dataset.sent === 'yes' || primary.dataset.sending === 'yes';
    wa.textContent = primary.hidden ? (wa.disabled ? 'Enter UTR to continue to WhatsApp ↗' : 'Continue to WhatsApp ↗') : primary.dataset.sent === 'yes' ? 'Order sent in portal' : wa.disabled ? 'Enter UTR for WhatsApp backup ↗' : 'Send via WhatsApp instead ↗';
  };
  const watch = new MutationObserver(sync);
  watch.observe(wa,{attributes:true,attributeFilter:['disabled']});
  document.getElementById('utr').addEventListener('input',sync);
  document.addEventListener('click',() => queueMicrotask(sync));
  sync();
  primary.hidden = true;
  sync();
  if (labels) labels.textContent = 'No login required. Check the prefilled WhatsApp order before you send it.';
  backup.hidden = true;
  note.hidden = true;
  primary.addEventListener('click',async () => {
    if (primary.disabled) return;
    if (!time.value.trim()) {
      document.getElementById('error').textContent = 'Enter the time you want your order.';
      document.getElementById('error').hidden = false;
      time.focus();
      return;
    }
    const modeButton = document.querySelector('[data-mode].chosen');
    const orderType = modeButton?.dataset.mode || 'Pickup';
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const utr = document.getElementById('utr').value.trim();
    const details = document.getElementById('detail').value.trim();
    const items = [...document.querySelectorAll('.menu-item')].map(card => ({
      name:card.querySelector('.item-info strong')?.textContent.trim(),
      quantity:Number(card.querySelector('output')?.textContent)
    })).filter(item => item.name && item.quantity > 0);
    if (!items.length || !name || !/^[+\d\s()-]{7,18}$/.test(phone) || !/^\d{8,30}$/.test(utr) || (orderType !== 'Pickup' && !details)) {
      document.getElementById('error').textContent = 'Check your basket, name, phone, order details and UTR.';
      document.getElementById('error').hidden = false;
      return;
    }
    primary.dataset.sending = 'yes'; sync();
    result.textContent = 'Sending order request...';
    const payload = {
      name,
      phone,
      desiredTime:time.value.trim(),
      utr,
      orderType,
      details,
      notes:document.getElementById('notes').value.trim(),
      outlet:document.getElementById('outlet-select')?.value,
      items
    };
    try {
      const response = await fetch('https://caloyaa-orders.nikhilpratap099.workers.dev/api/orders',{
        method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok || !data.statusUrl) throw Error(data.error || 'Order was not sent.');
      const link = document.createElement('a');
      link.href = data.statusUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Track your order live';
      result.replaceChildren(document.createTextNode('Order request received. Caloyaa must accept it after checking payment. '),link);
      primary.dataset.sent = 'yes';
      wa.disabled = true;
      wa.textContent = 'Order sent in portal';
      primary.textContent = 'Order request sent';
      try { localStorage.setItem('caloyaa-last-status',data.statusUrl); } catch {}
    } catch (error) {
      result.textContent = error.message || 'Could not send order. Check your connection before trying again.';
    } finally { delete primary.dataset.sending; sync(); }
  });
})();
