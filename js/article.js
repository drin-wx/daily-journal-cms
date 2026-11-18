import { db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
document.getElementById("year").textContent = new Date().getFullYear();
const content = document.getElementById("article-content");
const error = document.getElementById("article-error");
const id = new URLSearchParams(location.search).get("id");
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
if (!id) showError("Article not found.");
else {
  try {
    const snap = await getDoc(doc(db,"articles",id));
    if (!snap.exists() || snap.data().status !== "published") showError("This article is unavailable.");
    else {
      const a = snap.data();
      const date = a.publishedAt?.toDate ? a.publishedAt.toDate().toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"}) : "";
      const image = a.imageUrl ? `<img class="article-hero-image" src="${esc(a.imageUrl)}" alt="">` : "";
      content.innerHTML = `<p class="eyebrow">${esc(a.category || "Article")} · ${date}</p><h1>${esc(a.title)}</h1>${a.excerpt ? `<p class="article-excerpt">${esc(a.excerpt)}</p>` : ""}${image}<div class="article-text">${esc(a.content || "").replace(/\n/g,"<br>")}</div>`;
      document.title = `${a.title} | The Daily Journal`;
    }
  } catch(e) { console.error(e); showError("Unable to load this article. Please check your Firebase setup."); }
}
function showError(message){content.innerHTML="";error.textContent=message;error.classList.remove("hidden");}
