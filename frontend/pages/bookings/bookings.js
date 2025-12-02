const API = 'http://localhost:8080/api';

async function loadBookings(){
  try {
    const res = await fetch(API + '/bookings', {headers: authHeader()});
    if(!res.ok){ throw new Error('Unauthorized'); }
    const list = await res.json();
    const root = document.getElementById('list'); root.innerHTML = '';
    // each booking: show car info
    for(const b of list){
      // get car
      const carRes = await fetch(API + '/cars/' + b.carId);
      const car = await carRes.json();
      const el = document.createElement('div'); el.className='card';
      el.innerHTML = `
        <div style="display:flex;gap:12px;align-items:center">
          <img src="${car.image || 'https://via.placeholder.com/200x120'}" style="width:180px;height:110px;object-fit:cover;border-radius:8px" />
          <div style="flex:1">
            <h3>${car.make} ${car.model}</h3>
            <div class="muted">${new Date(b.from).toLocaleString()} → ${new Date(b.to).toLocaleString()}</div>
          </div>
          <div style="text-align:right">
            <div style="color:var(--accent);font-weight:700">$${car.price}</div>
            <div style="font-size:12px;color:#777">per day</div>
          </div>
        </div>
      `;
      root.appendChild(el);
    }
  } catch(e){
    document.getElementById('list').innerHTML = '<div style="color:white;text-align:center">Please sign in to view your bookings.</div>';
  }
}
loadBookings();
