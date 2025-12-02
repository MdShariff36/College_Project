const API = 'http://localhost:8080/api';
const qs = new URLSearchParams(location.search);
document.getElementById('q').value = qs.get('q') || '';

document.getElementById('searchBtn').addEventListener('click', () => {
  const q = document.getElementById('q').value.trim();
  loadCars(q);
});

async function loadCars(q=''){
  const url = API + '/cars' + (q? '?q='+encodeURIComponent(q):'');
  const res = await fetch(url);
  const cars = await res.json();
  const root = document.getElementById('list'); root.innerHTML = '';
  cars.forEach(car=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `
      <img src="${car.image || 'https://via.placeholder.com/800x400?text=Car'}" />
      <div class="title">
        <div>
          <h3>${car.make} ${car.model}</h3>
          <div class="muted">${car.year} • ${car.fuel}</div>
        </div>
        <div style="text-align:right">
          <div style="color:var(--accent);font-weight:700;font-size:22px">$${car.price}</div>
          <div style="font-size:12px;color:#777">per day</div>
        </div>
      </div>
      <div style="margin-top:10px">
        ${car.features.map(f=>`<span class="tag">${f}</span>`).join('')}
      </div>
      <a class="book-btn" href="../car-details/car-details.html?id=${car.id}">View / Book</a>
    `;
    root.appendChild(card);
  });
}

loadCars(document.getElementById('q').value);
