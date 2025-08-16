import { auth, storage, db } from "./firebase.js";
import {
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  ref, uploadBytesResumable, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import {
  collection, addDoc, getDocs, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/** فقط افرادی که ایمیل‌شون در این لیست هست ادمین به‌حساب میان */
const adminEmails = [
  "admin@mixrealm.com"
];

const byId = (id)=>document.getElementById(id);
const statusEl = byId("status");
const bar = byId("bar");
const progressBox = byId("progress");
const listEl = byId("songsList");

function setStatus(t){ statusEl.textContent = t || ""; }
function setProgress(p){ bar.style.width = (p||0) + "%"; }

onAuthStateChanged(auth, (user)=>{
  if(!user || !adminEmails.includes((user.email||"").toLowerCase())){
    alert("دسترسی فقط برای ادمین است!");
    location.href = "login.html";
  }
});

byId("btnSignOut")?.addEventListener("click", async ()=>{
  await signOut(auth);
  location.href = "login.html";
});

byId("uploadForm")?.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const name = byId("songName").value.trim();
  const artist = byId("artistName").value.trim();
  const genre = byId("genre").value.trim();
  const audio = byId("audioFile").files[0];
  const cover = byId("coverFile").files[0];

  if(!name || !artist || !audio || !cover){
    setStatus("لطفاً همه فیلدها را پر کنید.");
    return;
  }

  try{
    setStatus("در حال آپلود فایل‌ها…");
    progressBox.hidden = false; setProgress(0);

    // آپلود صوت
    const aRef = ref(storage, `tracks/${Date.now()}_${audio.name}`);
    const aTask = uploadBytesResumable(aRef, audio);
    await new Promise((res,rej)=>{
      aTask.on("state_changed",(s)=>{
        const p = Math.round((s.bytesTransferred / s.totalBytes)*100);
        setProgress(p*0.7); // 70% برای صوت
      }, rej, res);
    });
    const audioURL = await getDownloadURL(aRef);

    // آپلود کاور
    const cRef = ref(storage, `covers/${Date.now()}_${cover.name}`);
    const cTask = uploadBytesResumable(cRef, cover);
    await new Promise((res,rej)=>{
      cTask.on("state_changed",(s)=>{
        const p = Math.round((s.bytesTransferred / s.totalBytes)*100);
        setProgress(70 + p*0.3); // 30% برای کاور
      }, rej, res);
    });
    const coverURL = await getDownloadURL(cRef);

    // ذخیره رکورد در Firestore
    await addDoc(collection(db,"songs"),{
      name, artist, genre: genre || null,
      audio: audioURL, cover: coverURL,
      createdAt: serverTimestamp()
    });

    setStatus("✅ آهنگ با موفقیت اضافه شد.");
    setProgress(100);
    loadSongs(); // رفرش لیست
    (e.target).reset();
    setTimeout(()=>{ progressBox.hidden = true; setProgress(0); }, 1200);
  }catch(err){
    console.error(err);
    setStatus("❌ خطا در آپلود: " + (err.message||err));
  }
});

async function loadSongs(){
  const q = query(collection(db,"songs"), orderBy("createdAt","desc"));
  const snap = await getDocs(q);
  listEl.innerHTML = "";
  snap.forEach(doc=>{
    const s = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${s.cover}" alt="">
      <div class="meta">
        <span class="name">${s.name}</span>
        <span class="artist">${s.artist}${s.genre? " • " + s.genre : ""}</span>
      </div>
      <audio controls src="${s.audio}" style="margin-inline-start:auto;max-width:220px"></audio>
    `;
    listEl.appendChild(li);
  });
}
loadSongs();
