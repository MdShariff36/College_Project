const API = 'http://localhost:8080/api';

document.getElementById('signupBtn').addEventListener('click', async () => {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const password = document.getElementById('password').value;
  const msg = document.getElementById('msg'); msg.textContent = '';
  try {
    const res = await fetch(`${API}/auth/signup`, {
      method:'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({name,email,phone,password})
    });
    if(!res.ok){
      const t = await res.text();
      throw new Error(t || 'Sign up failed');
    }
    alert('Account created, please sign in');
    window.location.href = '../login/login.html';
  } catch(e){
    msg.textContent = e.message;
  }
});
