import { db } from "./firebase-config.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

document.getElementById("year").textContent = new Date().getFullYear();
const list = document.getElementById("article-list");
const empty = document.getElementById("empty-state");
const error = document.getElementById("error-state");

function safeDate(value) {
  if (!value) return "";
  const date = value.toDate ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString(undefined, {year:"numeric", month:"long", day:"numeric"});
}
function escapeHTML(value="") {
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

try {
  const q = query(collection(db, "articles"), where("status", "==", "published"));
  const snapshot = await getDocs(q);
  const articles = snapshot.docs.map(d => ({id:d.id, ...d.data()}))
    .sort((a,b) => (b.publishedAt?.seconds || 0) - (a.publishedAt?.seconds || 0));
  list.innerHTML = "";
  if (!articles.length) empty.classList.remove("hidden");
  for (const article of articles) {
    const card = document.createElement("article");
    card.className = "article-card";
    const image = article.imageUrl ? `<img class="card-image" src="${escapeHTML(article.imageUrl)}" alt="" loading="lazy">` : "";
    card.innerHTML = `${image}<div class="card-body"><p class="eyebrow">${escapeHTML(article.category || "Article")} · ${safeDate(article.publishedAt)}</p><h3>${escapeHTML(article.title)}</h3><p class="muted">${escapeHTML(article.excerpt || "")}</p><a class="read-link" href="article.html?id=${encodeURIComponent(article.id)}">Read article →</a></div>`;
    list.appendChild(card);
  }
} catch (err) {
  console.error(err);
  list.innerHTML = "";
  error.textContent = "Unable to load articles. Check your Firebase configuration and Firestore security rules.";
  error.classList.remove("hidden");
}
