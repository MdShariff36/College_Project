const API = 'http://localhost:8080/api';
const content = document.getElementById('content');

async function loadProfile(){
  const token = getToken();
  if(!token){ content.innerHTML = '<div>Please sign in. <a href="../login/login.html">Sign in</a></div>'; return; }
  // backend doesn't expose user GET in baseline — but token maps to user in AuthService.
  // We'll call /auth/me if implemented; else display token presence.
  content.innerHTML = `<div>Signed in (token present)</div>`;
}

document.getElementById('logoutBtn').addEventListener('click', ()=>{
  clearToken(); window.location.href = '../login/login.html';
});

loadProfile();
