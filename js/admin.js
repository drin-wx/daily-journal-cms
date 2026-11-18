import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const $ = id => document.getElementById(id);
const form = $("article-form"), message = $("editor-message"), list = $("manage-list");
let currentUser = null;

onAuthStateChanged(auth, async user => {
  if (!user || !user.emailVerified) { location.href = "login.html"; return; }
  currentUser = user;
  $("admin-email").textContent = user.email || "";
  await loadArticles();
});

$("logout-button").addEventListener("click", async () => { await signOut(auth); location.href = "index.html"; });
$("cancel-edit").addEventListener("click", resetForm);

form.addEventListener("submit", async e => {
  e.preventDefault();
  if (!currentUser) return;
  const id = $("article-id").value;
  const status = $("status").value;
  const data = {
    title: $("title").value.trim(),
    category: $("category").value.trim(),
    imageUrl: $("image-url").value.trim(),
    excerpt: $("excerpt").value.trim(),
    content: $("content").value.trim(),
    status,
    updatedAt: serverTimestamp()
  };
  if (!data.title || !data.content) return showMessage("Please enter an article title and content.");
  const button = $("save-button"); button.disabled = true; button.textContent = "Saving…";
  try {
    if (id) {
      data.publishedAt = status === "published" ? (window._originalPublishedAt || serverTimestamp()) : null;
      await updateDoc(doc(db,"articles",id), data);
      showMessage("Article updated successfully.");
    } else {
      data.author = currentUser.email;
      data.createdAt = serverTimestamp();
      data.publishedAt = status === "published" ? serverTimestamp() : null;
      await addDoc(collection(db,"articles"),data);
      showMessage(status === "published" ? "Article published successfully!" : "Draft saved successfully.");
    }
    resetForm(); await loadArticles();
  } catch(err) {
    console.error(err); showMessage("Could not save. Check your Firebase configuration and Firestore rules.");
  } finally { button.disabled = false; button.textContent = "Save article"; }
});

async function loadArticles() {
  try {
    const snap = await getDocs(query(collection(db,"articles"),orderBy("updatedAt","desc")));
    const items = snap.docs.map(d=>({id:d.id,...d.data()}));
    $("article-count").textContent = `${items.length} article(s)`;
    list.innerHTML = "";
    if (!items.length) { list.innerHTML = '<p class="muted">You have not created any articles yet.</p>'; return; }
    for (const a of items) {
      const row = document.createElement("div"); row.className = "manage-item";
      const info = document.createElement("div");
      const title = document.createElement("strong"); title.textContent = a.title || "Untitled";
      const meta = document.createElement("p"); meta.className = "muted small"; meta.textContent = `${a.category || "Uncategorized"} · ${a.status || "draft"}`;
      info.append(title,meta);
      const actions = document.createElement("div"); actions.className = "button-row";
      const edit = document.createElement("button"); edit.className = "button secondary small-button"; edit.textContent = "Edit"; edit.addEventListener("click",()=>editArticle(a));
      const del = document.createElement("button"); del.className = "button danger small-button"; del.textContent = "Delete"; del.addEventListener("click",()=>removeArticle(a));
      if (a.status === "published") {
        const view = document.createElement("a"); view.className="read-link"; view.href=`article.html?id=${encodeURIComponent(a.id)}`; view.target="_blank"; view.textContent="View"; actions.append(view);
      }
      actions.append(edit,del); row.append(info,actions); list.append(row);
    }
  } catch(err) { console.error(err); list.textContent = "Unable to load articles. Check Firestore rules."; }
}
function editArticle(a) {
  $("article-id").value=a.id; $("title").value=a.title||""; $("category").value=a.category||"";
  $("image-url").value=a.imageUrl||""; $("excerpt").value=a.excerpt||""; $("content").value=a.content||"";
  $("status").value=a.status||"draft"; window._originalPublishedAt=a.publishedAt||null;
  $("form-heading").textContent="Edit article"; $("save-button").textContent="Save changes"; $("cancel-edit").classList.remove("hidden");
  window.scrollTo({top:0,behavior:"smooth"});
}
async function removeArticle(a) {
  if (!confirm(`Delete "${a.title}"? This cannot be undone.`)) return;
  try { await deleteDoc(doc(db,"articles",a.id)); showMessage("Article deleted."); await loadArticles(); }
  catch(err) { console.error(err); showMessage("Unable to delete article."); }
}
function resetForm() {
  form.reset(); $("article-id").value=""; $("form-heading").textContent="Create an article";
  $("save-button").textContent="Save article"; $("cancel-edit").classList.add("hidden"); window._originalPublishedAt=null;
}
function showMessage(text) { message.textContent=text; message.classList.remove("hidden"); }
document.getElementById("year").textContent=new Date().getFullYear();
