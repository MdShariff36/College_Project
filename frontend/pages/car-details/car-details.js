const API = 'http://localhost:8080/api';
const id = new URLSearchParams(location.search).get('id');

async function load(){
  const res = await fetch(API + '/cars/' + id);
  if(!res.ok) return document.getElementById('card').textContent = 'Car not found';
  const car = await res.json();
  const root = document.getElementById('card');
  root.innerHTML = `
    <img src="${car.image || 'https://via.placeholder.com/800x400'}" />
    <div class="detail-row">
      <div>
        <h2>${car.make} ${car.model}</h2>
        <div class="muted">${car.year} • ${car.fuel}</div>
      </div>
      <div style="text-align:right">
        <div style="color:var(--accent);font-weight:700;font-size:28px">$${car.price}</div>
        <div style="font-size:12px;color:#777">per day</div>
      </div>
    </div>
    <div style="margin-top:10px">${car.features.map(f=>`<span class="tag">${f}</span>`).join('')}</div>
    <div class="book-section">
      <input id="from" type="date" />
      <input id="to" type="date" />
      <button class="book-btn" id="bookBtn">Book Now</button>
    </div>
    <div id="msg" style="color:red;margin-top:8px"></div>
  `;
  document.getElementById('bookBtn').addEventListener('click', book);
}
async function book(){
  const token = getToken();
  const msg = document.getElementById('msg'); msg.textContent='';
  if(!token){ window.location.href = '../login/login.html'; return; }
  const fromVal = document.getElementById('from').value;
  const toVal = document.getElementById('to').value;
  if(!fromVal || !toVal) { msg.textContent = 'Please pick both dates'; return; }
  const from = new Date(fromVal).toISOString();
  const to = new Date(toVal).toISOString();
  try {
    const res = await fetch(API + '/bookings', {
      method:'POST',
      headers: Object.assign({'Content-Type':'application/json'}, authHeader()),
      body: JSON.stringify({carId:id, from, to})
    });
    if(!res.ok){
      const t = await res.text();
      throw new Error(t || 'Booking failed');
    }
    alert('Booked successfully');
    window.location.href = '../bookings/bookings.html';
  } catch(e){
    msg.textContent = e.message;
  }
}
load();
