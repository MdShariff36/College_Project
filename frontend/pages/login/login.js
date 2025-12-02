const API = 'http://localhost:8080/api';

document.getElementById('signinBtn').addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const msg = document.getElementById('msg');
  msg.textContent = '';
  try {
    const res = await fetch(`${API}/auth/signin`, {
      method:'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({email,password})
    });
    const data = await res.json();
    if(!res.ok) throw new Error(data || 'Sign in failed');
    saveToken(data.token);
    window.location.href = '../../pages/car-list/car-list.html';
  } catch (e) {
    msg.textContent = e.message || 'Sign in failed';
  }
});
