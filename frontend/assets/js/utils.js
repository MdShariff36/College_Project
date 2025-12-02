// small helpers used across pages
function getToken() {
  return localStorage.getItem("token");
}
function saveToken(t) {
  localStorage.setItem("token", t);
}
function clearToken() {
  localStorage.removeItem("token");
}
function authHeader() {
  const t = getToken();
  return t ? { Authorization: "Bearer " + t } : {};
}

function handleFetchErrors(res) {
  if (!res.ok)
    return res.text().then((t) => {
      throw new Error(t || res.statusText);
    });
  return res.json();
}
