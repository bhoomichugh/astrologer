(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const c of n)if(c.type==="childList")for(const i of c.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function s(n){const c={};return n.integrity&&(c.integrity=n.integrity),n.referrerPolicy&&(c.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?c.credentials="include":n.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function a(n){if(n.ep)return;n.ep=!0;const c=s(n);fetch(n.href,c)}})();const G="http://localhost:5000/api",U={Aries:{symbol:"♈",dates:"Mar 21 – Apr 19",element:"Fire",traits:["Bold","Ambitious","Energetic","Courageous"],ruler:"Mars",desc:"Aries leads with passion and courage. Your fiery spirit drives you to take initiative and blaze new trails. Today is perfect for starting new projects."},Taurus:{symbol:"♉",dates:"Apr 20 – May 20",element:"Earth",traits:["Reliable","Patient","Determined","Sensual"],ruler:"Venus",desc:"Taurus values stability and beauty. Your grounded nature helps others feel secure. Focus on self-care and financial planning today."},Gemini:{symbol:"♊",dates:"May 21 – Jun 20",element:"Air",traits:["Versatile","Curious","Social","Witty"],ruler:"Mercury",desc:"Gemini thrives on communication and learning. Your dual nature allows you to see all perspectives. A great day for networking."},Cancer:{symbol:"♋",dates:"Jun 21 – Jul 22",element:"Water",traits:["Nurturing","Intuitive","Emotional","Protective"],ruler:"Moon",desc:"Cancer connects deeply with emotions and family. Your intuition is strong today — trust your gut feelings."},Leo:{symbol:"♌",dates:"Jul 23 – Aug 22",element:"Fire",traits:["Confident","Creative","Generous","Dramatic"],ruler:"Sun",desc:"Leo radiates warmth and creativity. Your natural charisma draws people in. Express yourself boldly today."},Virgo:{symbol:"♍",dates:"Aug 23 – Sep 22",element:"Earth",traits:["Analytical","Practical","Diligent","Kind"],ruler:"Mercury",desc:"Virgo excels at details and service. Your practical approach solves problems others miss. Organize and plan today."},Libra:{symbol:"♎",dates:"Sep 23 – Oct 22",element:"Air",traits:["Diplomatic","Harmonious","Fair","Social"],ruler:"Venus",desc:"Libra seeks balance and beauty in all things. Your diplomatic skills are needed today — mediate and bring peace."},Scorpio:{symbol:"♏",dates:"Oct 23 – Nov 21",element:"Water",traits:["Passionate","Resourceful","Determined","Mysterious"],ruler:"Pluto",desc:"Scorpio transforms and regenerates. Your deep intensity uncovers hidden truths. Embrace transformation today."},Sagittarius:{symbol:"♐",dates:"Nov 22 – Dec 21",element:"Fire",traits:["Adventurous","Optimistic","Philosophical","Free-spirited"],ruler:"Jupiter",desc:"Sagittarius explores and expands horizons. Your optimism is contagious today. Plan a journey or learn something new."},Capricorn:{symbol:"♑",dates:"Dec 22 – Jan 19",element:"Earth",traits:["Disciplined","Ambitious","Responsible","Patient"],ruler:"Saturn",desc:"Capricorn builds for the long term. Your discipline and persistence pay off. Focus on career goals today."},Aquarius:{symbol:"♒",dates:"Jan 20 – Feb 18",element:"Air",traits:["Innovative","Independent","Humanitarian","Original"],ruler:"Uranus",desc:"Aquarius envisions the future. Your unconventional ideas inspire change. Connect with your community today."},Pisces:{symbol:"♓",dates:"Feb 19 – Mar 20",element:"Water",traits:["Compassionate","Artistic","Intuitive","Dreamy"],ruler:"Neptune",desc:"Pisces flows with creativity and empathy. Your artistic and spiritual side is heightened today. Create and dream."}};function Y(t){if(!t)return"";const o=new Date(t),s=o.getMonth()+1,a=o.getDate();return s===3&&a>=21||s===4&&a<=19?"Aries":s===4&&a>=20||s===5&&a<=20?"Taurus":s===5&&a>=21||s===6&&a<=20?"Gemini":s===6&&a>=21||s===7&&a<=22?"Cancer":s===7&&a>=23||s===8&&a<=22?"Leo":s===8&&a>=23||s===9&&a<=22?"Virgo":s===9&&a>=23||s===10&&a<=22?"Libra":s===10&&a>=23||s===11&&a<=21?"Scorpio":s===11&&a>=22||s===12&&a<=21?"Sagittarius":s===12&&a>=22||s===1&&a<=19?"Capricorn":s===1&&a>=20||s===2&&a<=18?"Aquarius":"Pisces"}const e={user:W(),view:"dashboard",customers:[],users:[],consultations:[],crmBookings:[],stats:{totalClients:0,upcomingConsultations:0,completedConsultations:0,pendingConsultations:0},userView:"dashboard",astrologersList:[],userBookings:[],conversations:[],chatMessages:[],selectedAstrologer:null,selectedBookingChat:null,error:""};let p=null;function W(){try{const t=localStorage.getItem("user");return t?JSON.parse(t):null}catch{return null}}function R(){return localStorage.getItem("token")}async function l(t,o={}){const s=await fetch(`${G}${t}`,{...o,headers:{"Content-Type":"application/json",...R()?{Authorization:`Bearer ${R()}`}:{},...o.headers||{}}}),a=await s.json().catch(()=>({}));if(!s.ok)throw new Error(a.message||"Request failed");return a}async function b(){if(e.user)try{const[t,o,s,a,n]=await Promise.all([l("/dashboard/stats").catch(()=>e.stats),l("/clients").catch(()=>[]),l("/consultations").catch(()=>[]),e.user.role==="admin"?l("/users").catch(()=>[]):Promise.resolve([]),l("/bookings").catch(()=>[])]);e.stats=t,e.customers=o,e.consultations=s,e.users=a,e.crmBookings=n,e.error=""}catch(t){e.error=t.message}}async function q(){try{e.userBookings=await l("/bookings")}catch{e.userBookings=[]}}async function Z(){try{e.astrologersList=await l("/public/astrologers")}catch{e.astrologersList=[]}}async function F(){try{e.conversations=await l("/chat/conversations")}catch{e.conversations=[]}}async function B(t){try{e.chatMessages=await l(`/chat/messages/${t}`)}catch{e.chatMessages=[]}}async function S(){!e.user||e.user.role!=="user"||await Promise.all([q(),Z(),F()])}function T(t){localStorage.setItem("token",t.token),localStorage.setItem("user",JSON.stringify(t.user)),e.user=t.user}function z(){localStorage.removeItem("token"),localStorage.removeItem("user"),e.user=null,e.view="dashboard",e.userView="dashboard",e.selectedAstrologer=null,e.selectedBookingChat=null,p&&(clearInterval(p),p=null),C()}function d(t,...o){return t.reduce((s,a,n)=>s+a+(o[n]??""),"")}function r(t){return String(t??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}function C(){if(p&&(clearInterval(p),p=null),!e.user){L();return}e.user.role==="user"?m():h()}function L(){var o,s;const t=document.getElementById("root");t.innerHTML=d`
    <main class="landing-page">
      <div class="landing-brand">
        <span class="brand-icon">✨</span>
        <h1>Astro Giri</h1>
        <p>Your Cosmic Journey Starts Here</p>
      </div>
      <div class="portal-cards">
        <div class="portal-card astrologer-card-portal" id="goto-astrologer">
          <span class="card-icon">🔮</span>
          <h2>Astrologer Portal</h2>
          <p>Manage consultations, clients, and your practice with powerful CRM tools</p>
          <button class="card-button" type="button">Login as Astrologer →</button>
        </div>
        <div class="portal-card user-card-portal" id="goto-user">
          <span class="card-icon">⭐</span>
          <h2>User Portal</h2>
          <p>Book consultations, explore astrologers, and discover your cosmic destiny</p>
          <button class="card-button" type="button">Login / Register →</button>
        </div>
      </div>
    </main>
  `,(o=document.getElementById("goto-astrologer"))==null||o.addEventListener("click",A),(s=document.getElementById("goto-user"))==null||s.addEventListener("click",I)}function A(){var o,s,a;const t=document.getElementById("root");t.innerHTML=d`
    <main class="auth-page">
      <section class="auth-panel">
        <div class="auth-copy">
          <span>Astrologer CRM</span>
          <h1>Manage customers, astrologers, and consultations.</h1>
          <p>Admin can control staff accounts while astrologers manage assigned customers.</p>
        </div>
        <form class="auth-form" id="astro-login-form">
          <h2>Astrologer Login</h2>
          ${e.error?`<div class="error-box">${r(e.error)}</div>`:""}
          <input name="email" placeholder="Email" required type="email" />
          <input name="password" placeholder="Password" required type="password" minlength="6" />
          <button class="primary-button" type="submit">Login</button>
          <button class="ghost-button" id="astro-show-register" type="button">Create admin/astrologer account</button>
          <button class="ghost-button" id="back-landing-1" type="button">← Back to Home</button>
        </form>
      </section>
    </main>
  `,(o=document.getElementById("back-landing-1"))==null||o.addEventListener("click",()=>{e.error="",L()}),(s=document.getElementById("astro-show-register"))==null||s.addEventListener("click",H),(a=document.getElementById("astro-login-form"))==null||a.addEventListener("submit",async n=>{n.preventDefault();const c=Object.fromEntries(new FormData(n.currentTarget));try{const i=await l("/auth/login",{method:"POST",body:JSON.stringify(c)});if(i.user.role==="user"){e.error="Please use the User Portal to login.",A();return}T(i),await b(),C()}catch(i){e.error=i.message,A()}})}function H(){var o,s;const t=document.getElementById("root");t.innerHTML=d`
    <main class="auth-page">
      <form class="auth-form solo" id="astro-register-form">
        <h2>Register Staff</h2>
        ${e.error?`<div class="error-box">${r(e.error)}</div>`:""}
        <input name="name" placeholder="Name" required />
        <input name="email" placeholder="Email" required type="email" />
        <input name="password" placeholder="Password" required type="password" minlength="6" />
        <select name="role"><option value="admin">Admin</option><option value="astrologer">Astrologer</option></select>
        <button class="primary-button" type="submit">Register</button>
        <button class="ghost-button" id="back-astro-login" type="button">← Back to Login</button>
      </form>
    </main>
  `,(o=document.getElementById("back-astro-login"))==null||o.addEventListener("click",()=>{e.error="",A()}),(s=document.getElementById("astro-register-form"))==null||s.addEventListener("submit",async a=>{a.preventDefault();const n=Object.fromEntries(new FormData(a.currentTarget));try{await l("/auth/register",{method:"POST",body:JSON.stringify(n)}),e.error="",A()}catch(c){e.error=c.message,H()}})}function I(){var o,s,a;const t=document.getElementById("root");t.innerHTML=d`
    <main class="user-auth-page">
      <form class="user-auth-form" id="user-login-form">
        <h2>⭐ User Login</h2>
        ${e.error?`<div class="error-box">${r(e.error)}</div>`:""}
        <input name="email" placeholder="Email" required type="email" />
        <input name="password" placeholder="Password" required type="password" minlength="6" />
        <button class="primary-button" type="submit">Login</button>
        <button class="ghost-button" id="goto-user-register" type="button">Create an account</button>
        <button class="ghost-button" id="back-landing-2" type="button">← Back to Home</button>
      </form>
    </main>
  `,(o=document.getElementById("back-landing-2"))==null||o.addEventListener("click",()=>{e.error="",L()}),(s=document.getElementById("goto-user-register"))==null||s.addEventListener("click",()=>{e.error="",J()}),(a=document.getElementById("user-login-form"))==null||a.addEventListener("submit",async n=>{n.preventDefault();const c=Object.fromEntries(new FormData(n.currentTarget));try{const i=await l("/auth/login",{method:"POST",body:JSON.stringify(c)});if(i.user.role!=="user"){e.error="Please use the Astrologer Portal.",I();return}T(i),await S(),C()}catch(i){e.error=i.message,I()}})}function J(){var o,s,a;const t=document.getElementById("root");t.innerHTML=d`
    <main class="user-auth-page">
      <form class="user-auth-form" id="user-register-form">
        <h2>⭐ Create Account</h2>
        ${e.error?`<div class="error-box">${r(e.error)}</div>`:""}
        <input name="name" placeholder="Full Name" required />
        <input name="email" placeholder="Email" required type="email" />
        <input name="password" placeholder="Password (min 6 chars)" required type="password" minlength="6" />
        <input name="phone" placeholder="Phone Number" />
        <label>Date of Birth<input name="dob" type="date" /></label>
        <button class="primary-button" type="submit">Create Account</button>
        <button class="ghost-button" id="goto-user-login" type="button">Already have an account? Login</button>
        <button class="ghost-button" id="back-landing-3" type="button">← Back to Home</button>
      </form>
    </main>
  `,(o=document.getElementById("back-landing-3"))==null||o.addEventListener("click",()=>{e.error="",L()}),(s=document.getElementById("goto-user-login"))==null||s.addEventListener("click",()=>{e.error="",I()}),(a=document.getElementById("user-register-form"))==null||a.addEventListener("submit",async n=>{n.preventDefault();const c=Object.fromEntries(new FormData(n.currentTarget));try{const i=await l("/auth/register-user",{method:"POST",body:JSON.stringify(c)});T(i),await S(),C()}catch(i){e.error=i.message,J()}})}function h(){const t=document.getElementById("root");t.innerHTML=d`
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark">A</div>
          <div><strong>Astrologer CRM</strong><span>${r(e.user.role)}</span></div>
        </div>
        <nav class="nav-list">
          ${w("dashboard","📊 Dashboard")}
          ${w("customers","👥 Customers")}
          ${e.user.role==="admin"?w("users","🛡️ Admin/Astrologers"):""}
          ${w("bookings","📅 Bookings")}
          ${w("consultations","📋 Consultations")}
        </nav>
        <button class="ghost-button logout-button" id="logout" type="button">🚪 Logout</button>
      </aside>
      <main class="content">
        <header class="topbar">
          <div><p>Welcome back</p><h1>${r(e.user.name)}</h1></div>
          <span class="role-pill">${r(e.user.role)}</span>
        </header>
        ${e.error?`<div class="error-box page-error">${r(e.error)}</div>`:""}
        ${K()}
      </main>
    </div>
  `,st()}function w(t,o){return`<button class="${e.view===t?"active":""}" data-view="${t}" type="button">${o}</button>`}function K(){return e.view==="customers"?X():e.view==="users"&&e.user.role==="admin"?tt():e.view==="bookings"?et():e.view==="consultations"?ot():Q()}function Q(){const t=[["Total Customers",e.stats.totalClients],["Upcoming Consultations",e.stats.upcomingConsultations],["Completed Consultations",e.stats.completedConsultations],["Pending Consultations",e.stats.pendingConsultations]];return d`
    <section class="page-section">
      <div class="section-heading"><div><p>Overview</p><h2>Practice Snapshot</h2></div></div>
      <div class="stats-grid">
        ${t.map(([o,s])=>d`
          <article class="stat-card">
            <div class="stat-icon">${r(o[0])}</div>
            <span>${r(o)}</span>
            <strong>${Number(s||0)}</strong>
          </article>
        `).join("")}
      </div>
    </section>
  `}function X(){const t=e.users.filter(o=>o.role==="astrologer");return d`
    <section class="page-section">
      <div class="section-heading"><div><p>Customer Management</p><h2>Customers</h2></div></div>
      <form class="data-form" id="customer-form">
        <input name="name" placeholder="Name" required />
        <input name="email" placeholder="Email" type="email" />
        <input name="phone" placeholder="Phone" required />
        <input name="dob" type="date" />
        <input name="zodiacSign" placeholder="Zodiac" />
        <select name="assignedAstrologer">
          <option value="">Assign astrologer</option>
          ${t.map(o=>`<option value="${o._id}">${r(o.name)}</option>`).join("")}
        </select>
        <button class="primary-button compact" type="submit">Add Customer</button>
      </form>
      ${f(["Name","Phone","Zodiac","Assigned Astrologer","Actions"],e.customers.map(o=>{var s;return d`
        <tr>
          <td><strong>${r(o.name)}</strong><span>${r(o.email)}</span></td>
          <td>${r(o.phone)}</td>
          <td>${r(o.zodiacSign||"Not set")}</td>
          <td>${r(((s=o.assignedAstrologer)==null?void 0:s.name)||"Not assigned")}</td>
          <td><button data-delete-customer="${o._id}" type="button">Delete</button></td>
        </tr>
      `}),"No customers yet")}
    </section>
  `}function tt(){return d`
    <section class="page-section">
      <div class="section-heading"><div><p>Staff Access</p><h2>Admin / Astrologers</h2></div></div>
      <form class="data-form team-form" id="user-form">
        <input name="name" placeholder="Name" required />
        <input name="email" placeholder="Email" required type="email" />
        <input name="password" placeholder="Password" required type="password" minlength="6" />
        <select name="role"><option value="admin">Admin</option><option value="astrologer" selected>Astrologer</option></select>
        <button class="primary-button compact" type="submit">Add User</button>
      </form>
      ${f(["Name","Email","Role","Created","Actions"],e.users.map(t=>d`
        <tr>
          <td><strong>${r(t.name)}</strong><span>${r(t._id)}</span></td>
          <td>${r(t.email)}</td>
          <td><span class="role-pill">${r(t.role)}</span></td>
          <td>${t.createdAt?new Date(t.createdAt).toLocaleDateString():"-"}</td>
          <td><button data-delete-user="${t._id}" ${t._id===e.user.id?"disabled":""} type="button">Delete</button></td>
        </tr>
      `),"No users yet")}
    </section>
  `}function et(){return d`
    <section class="page-section">
      <div class="section-heading">
        <div>
          <p>${e.user.role==="astrologer"?"Your Booked Users":"All User Bookings"}</p>
          <h2>Bookings</h2>
        </div>
      </div>
      ${f(["User","Date & Time","Duration","Amount","Status","Payment","Actions"],e.crmBookings.map(t=>{var o,s,a;return d`
        <tr>
          <td>
            <strong>${r(((o=t.userId)==null?void 0:o.name)||"User")}</strong>
            <span>${r(((s=t.userId)==null?void 0:s.email)||"")}${(a=t.userId)!=null&&a.phone?` • ${r(t.userId.phone)}`:""}</span>
          </td>
          <td>${new Date(t.date).toLocaleDateString()} ${r(t.timeSlot||"")}</td>
          <td>${t.duration||30} min</td>
          <td><strong>₹${t.amount||0}</strong></td>
          <td><span class="status ${r((t.status||"Pending").toLowerCase())}">${r(t.status||"Pending")}</span></td>
          <td><span class="status ${t.paymentStatus==="Paid"?"completed":"pending"}">${r(t.paymentStatus||"Pending")}</span></td>
          <td>
            <div class="action-row">
              ${t.status==="Pending"?`<button data-booking-status="${t._id}" data-status="Confirmed" type="button">Confirm</button>`:""}
              ${t.status==="Confirmed"?`<button data-booking-status="${t._id}" data-status="Completed" type="button">Complete</button>`:""}
              ${["Pending","Confirmed"].includes(t.status)?`<button data-booking-status="${t._id}" data-status="Cancelled" type="button">Cancel</button>`:""}
            </div>
          </td>
        </tr>
      `}),e.user.role==="astrologer"?"No users have booked you yet.":"No bookings yet.")}
    </section>
  `}function ot(){const t=e.users.filter(o=>o.role==="astrologer");return d`
    <section class="page-section">
      <div class="section-heading"><div><p>Consultation Management</p><h2>Consultations</h2></div></div>
      <form class="data-form consultation-form" id="consultation-form">
        <select name="clientId" required>
          <option value="">Select customer</option>
          ${e.customers.map(o=>`<option value="${o._id}">${r(o.name)}</option>`).join("")}
        </select>
        <select name="astrologerId">
          <option value="">Select astrologer</option>
          ${t.map(o=>`<option value="${o._id}">${r(o.name)}</option>`).join("")}
        </select>
        <input name="date" required type="datetime-local" />
        <select name="status"><option>Scheduled</option><option>Pending</option><option>Completed</option><option>Cancelled</option></select>
        <textarea name="notes" placeholder="Consultation notes"></textarea>
        <button class="primary-button compact" type="submit">Add Consultation</button>
      </form>
      ${f(["Customer","Date","Status","Notes","AI Summary","Actions"],e.consultations.map(o=>{var s,a;return d`
        <tr>
          <td><strong>${r((s=o.clientId)==null?void 0:s.name)}</strong><span>${r((a=o.astrologerId)==null?void 0:a.name)}</span></td>
          <td>${new Date(o.date).toLocaleString()}</td>
          <td><span class="status ${r(o.status.toLowerCase())}">${r(o.status)}</span></td>
          <td class="notes-cell">${r(o.notes||"No notes")}</td>
          <td class="summary-cell">${r(o.aiSummary||"Not generated")}</td>
          <td>
            <div class="action-row">
              <button data-summary="${o._id}" ${o.notes?"":"disabled"} type="button">AI</button>
              <button data-complete="${o._id}" type="button">Complete</button>
              <button data-delete-consultation="${o._id}" type="button">Delete</button>
            </div>
          </td>
        </tr>
      `}),"No consultations yet")}
    </section>
  `}function f(t,o,s){return d`
    <div class="table-wrap">
      <table>
        <thead><tr>${t.map(a=>`<th>${r(a)}</th>`).join("")}</tr></thead>
        <tbody>${o.length?o.join(""):`<tr><td class="empty-table" colspan="${t.length}">${r(s)}</td></tr>`}</tbody>
      </table>
    </div>
  `}function st(){var t,o,s,a;(t=document.getElementById("logout"))==null||t.addEventListener("click",z),document.querySelectorAll("[data-view]").forEach(n=>{n.addEventListener("click",async()=>{e.view=n.dataset.view,await b(),h()})}),(o=document.getElementById("customer-form"))==null||o.addEventListener("submit",P("/clients","POST")),(s=document.getElementById("user-form"))==null||s.addEventListener("submit",P("/users","POST")),(a=document.getElementById("consultation-form"))==null||a.addEventListener("submit",P("/consultations","POST")),document.querySelectorAll("[data-delete-customer]").forEach(n=>{n.addEventListener("click",()=>D(`/clients/${n.dataset.deleteCustomer}`))}),document.querySelectorAll("[data-delete-user]").forEach(n=>{n.addEventListener("click",()=>D(`/users/${n.dataset.deleteUser}`))}),document.querySelectorAll("[data-delete-consultation]").forEach(n=>{n.addEventListener("click",()=>D(`/consultations/${n.dataset.deleteConsultation}`))}),document.querySelectorAll("[data-complete]").forEach(n=>{n.addEventListener("click",()=>M(`/consultations/${n.dataset.complete}`,{status:"Completed"}))}),document.querySelectorAll("[data-booking-status]").forEach(n=>{n.addEventListener("click",()=>M(`/bookings/${n.dataset.bookingStatus}/status`,{status:n.dataset.status}))}),document.querySelectorAll("[data-summary]").forEach(n=>{n.addEventListener("click",async()=>{const c=e.consultations.find(i=>i._id===n.dataset.summary);await M("/ai/generate-summary",{consultationId:c._id,notes:c.notes},"POST")})})}function P(t,o){return async s=>{s.preventDefault();const a=Object.fromEntries(new FormData(s.currentTarget));try{await l(t,{method:o,body:JSON.stringify(a)}),await b(),h()}catch(n){e.error=n.message,h()}s.currentTarget.reset()}}async function M(t,o,s="PUT"){try{await l(t,{method:s,body:JSON.stringify(o)}),await b(),h()}catch(a){e.error=a.message,h()}}async function D(t){try{await l(t,{method:"DELETE"}),await b(),h()}catch(o){e.error=o.message,h()}}function y(t,o,s){return`<button class="${e.userView===t?"active":""}" data-uview="${t}" type="button">${o} ${s}</button>`}function m(){var s;const t=document.getElementById("root"),o=e.user.zodiacSign||Y(e.user.dob)||"";t.innerHTML=d`
    <div class="app-shell user-portal">
      <aside class="sidebar user-sidebar">
        <div class="brand">
          <div class="brand-mark" style="background:linear-gradient(135deg,var(--purple-500),var(--purple-400));color:#fff;width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;">⭐</div>
          <div><strong>Astro Giri</strong><span>user</span></div>
        </div>
        <nav class="nav-list">
          ${y("dashboard","🏠","Dashboard")}
          ${y("astrologers","🔮","Astrologers")}
          ${y("bookings","📅","My Bookings")}
          ${y("horoscope","♈","Horoscope")}
          ${y("payments","💳","Payments")}
          ${y("chat","💬","Chat")}
        </nav>
        <button class="ghost-button logout-button" id="user-logout" type="button">🚪 Logout</button>
      </aside>
      <main class="content">
        <header class="topbar user-portal-topbar">
          <div><p>Welcome back</p><h1>${r(e.user.name)}</h1></div>
          <span class="role-pill user-role-pill">${o?`${((s=U[o])==null?void 0:s.symbol)||"⭐"} ${o}`:"User"}</span>
        </header>
        ${e.error?`<div class="error-box page-error">${r(e.error)}</div>`:""}
        ${at()}
      </main>
    </div>
  `,ut()}function at(){switch(e.userView){case"astrologers":return e.selectedAstrologer?rt():V();case"bookings":return it();case"horoscope":return dt();case"payments":return ct();case"chat":return lt();default:return nt()}}function nt(){const t=e.userBookings.length,o=e.userBookings.filter(a=>a.status==="Confirmed"||a.status==="Pending").length,s=e.userBookings.filter(a=>a.status==="Completed").length;return d`
    <section class="page-section">
      <div class="section-heading"><div><p>Your Overview</p><h2>Dashboard</h2></div></div>
      <div class="stats-grid">
        ${[["📅 Total Bookings",t],["⏰ Upcoming",o],["✅ Completed",s],["🔮 Astrologers",e.astrologersList.length]].map(([a,n])=>d`
          <article class="user-stat-card">
            <div class="user-stat-icon">${a.split(" ")[0]}</div>
            <span>${r(a.substring(a.indexOf(" ")+1))}</span>
            <strong>${n}</strong>
          </article>
        `).join("")}
      </div>
      <div class="quick-actions">
        <button class="quick-action-card" data-uview="astrologers" type="button">
          <div class="qa-icon">🔮</div>
          <div class="qa-text"><strong>Book Consultation</strong><span>Browse astrologers & book</span></div>
        </button>
        <button class="quick-action-card" data-uview="horoscope" type="button">
          <div class="qa-icon">♈</div>
          <div class="qa-text"><strong>View Horoscope</strong><span>Your zodiac insights</span></div>
        </button>
        <button class="quick-action-card" data-uview="chat" type="button">
          <div class="qa-icon">💬</div>
          <div class="qa-text"><strong>Messages</strong><span>Chat with astrologers</span></div>
        </button>
        <button class="quick-action-card" data-uview="payments" type="button">
          <div class="qa-icon">💳</div>
          <div class="qa-text"><strong>Payments</strong><span>View payment history</span></div>
        </button>
      </div>
    </section>
  `}function V(){return e.astrologersList.length?d`
    <section class="page-section">
      <div class="section-heading"><div><p>Find Your Guide</p><h2>Browse Astrologers</h2></div></div>
      <div class="astrologer-grid">
        ${e.astrologersList.map(t=>{var o;return d`
          <div class="astrologer-browse-card">
            <div class="card-header">
              <div class="avatar">${r((t.name||"A")[0])}</div>
              <h3>${r(t.name)}</h3>
              <div class="specialization">${r(t.specialization||"General Astrology")}</div>
            </div>
            <div class="card-body">
              <div class="card-meta">
                <span>Experience: <strong>${t.experience||0} yrs</strong></span>
                <span class="rating">${"★".repeat(Math.round(t.rating||0))}${"☆".repeat(5-Math.round(t.rating||0))}</span>
              </div>
              ${(o=t.languages)!=null&&o.length?`<div class="languages-list">${t.languages.map(s=>`<span class="lang-tag">${r(s)}</span>`).join("")}</div>`:""}
              <div class="card-meta">
                <span class="price">₹${t.hourlyRate||500} <small>/hr</small></span>
              </div>
              ${t.bio?`<p style="font-size:13px;color:var(--text-muted);margin:0;line-height:1.5">${r(t.bio).substring(0,100)}${t.bio.length>100?"...":""}</p>`:""}
              <button class="book-btn" data-book-astrologer="${t._id}" type="button">Book Consultation →</button>
            </div>
          </div>
        `}).join("")}
      </div>
    </section>
  `:d`<section class="page-section">
      <div class="section-heading"><div><p>Find Your Guide</p><h2>Browse Astrologers</h2></div></div>
      <div class="empty-state"><p>No astrologers available at the moment. Check back soon!</p></div>
    </section>`}function rt(){const t=e.selectedAstrologer;if(!t)return V();const o=[];for(let s=9;s<=20;s++)o.push(`${s.toString().padStart(2,"0")}:00`),o.push(`${s.toString().padStart(2,"0")}:30`);return d`
    <section class="page-section">
      <button class="back-btn" id="back-to-astrologers" type="button">← Back to Astrologers</button>
      <div class="section-heading"><div><p>Schedule Session</p><h2>Book with ${r(t.name)}</h2></div></div>
      <div class="booking-container">
        <form class="booking-form-card" id="booking-form">
          <h3>Consultation Details</h3>
          <label>Date<input name="date" required type="date" min="${new Date().toISOString().split("T")[0]}" /></label>
          <label>Time Slot
            <select name="timeSlot" required>
              <option value="">Select time</option>
              ${o.map(s=>`<option value="${s}">${s}</option>`).join("")}
            </select>
          </label>
          <label>Duration
            <select name="duration" id="booking-duration">
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </label>
          <label>Notes / Questions<textarea name="notes" placeholder="Describe what you'd like to discuss..." rows="4"></textarea></label>
        </form>
        <div class="booking-summary">
          <h4>Booking Summary</h4>
          <div class="summary-row"><span>Astrologer</span><strong>${r(t.name)}</strong></div>
          <div class="summary-row"><span>Specialization</span><strong>${r(t.specialization||"General")}</strong></div>
          <div class="summary-row"><span>Rate</span><strong>₹${t.hourlyRate||500}/hr</strong></div>
          <div class="summary-row"><span>Duration</span><strong id="summary-duration">30 min</strong></div>
          <div class="summary-total"><span>Total</span><span id="summary-total">₹${Math.round((t.hourlyRate||500)*.5)}</span></div>
          <button class="confirm-btn" id="confirm-booking" type="button">✨ Confirm Booking</button>
        </div>
      </div>
    </section>
  `}function it(){return d`
    <section class="page-section">
      <div class="section-heading"><div><p>Your Sessions</p><h2>My Bookings</h2></div></div>
      ${f(["Astrologer","Date & Time","Duration","Status","Payment","Actions"],e.userBookings.map(t=>{var o,s,a,n,c;return d`
        <tr>
          <td><strong>${r((o=t.astrologerId)==null?void 0:o.name)}</strong><span>${r(((s=t.astrologerId)==null?void 0:s.specialization)||"")}</span></td>
          <td>${new Date(t.date).toLocaleDateString()} ${r(t.timeSlot)}</td>
          <td>${t.duration} min</td>
          <td><span class="status ${r(t.status.toLowerCase())}">${r(t.status)}</span></td>
          <td><span class="status ${t.paymentStatus==="Paid"?"completed":"pending"}">${r(t.paymentStatus)}</span></td>
          <td>
            <div class="action-row">
              ${t.paymentStatus!=="Paid"?`<button class="pay-btn" data-pay-booking="${t._id}" type="button">Pay</button>`:""}
              ${t.status==="Pending"||t.status==="Confirmed"?`<button data-cancel-booking="${t._id}" type="button">Cancel</button>`:""}
              <button data-chat-booking="${t._id}" data-chat-other="${e.user.id===String(((a=t.userId)==null?void 0:a._id)||t.userId)?(n=t.astrologerId)==null?void 0:n._id:(c=t.userId)==null?void 0:c._id}" type="button">Chat</button>
            </div>
          </td>
        </tr>
      `}),"No bookings yet. Browse astrologers to book your first consultation!")}
    </section>
  `}function dt(){const t=e.user.zodiacSign||Y(e.user.dob)||"",o=U[t];return!t||!o?d`<section class="page-section">
      <div class="section-heading"><div><p>Cosmic Insight</p><h2>Your Horoscope</h2></div></div>
      <div class="horoscope-detail-card"><p>Please update your date of birth in your profile to see your horoscope.</p></div>
    </section>`:d`
    <section class="page-section">
      <div class="section-heading"><div><p>Cosmic Insight</p><h2>Your Horoscope</h2></div></div>
      <div class="horoscope-container">
        <div class="zodiac-card">
          <span class="zodiac-symbol">${o.symbol}</span>
          <h2>${r(t)}</h2>
          <p class="zodiac-dates">${o.dates}</p>
        </div>
        <div class="horoscope-info">
          <div class="horoscope-detail-card">
            <h3>☀️ Today's Energy</h3>
            <p>${o.desc}</p>
          </div>
          <div class="horoscope-detail-card">
            <h3>✨ Your Traits</h3>
            <div class="trait-tags">${o.traits.map(s=>`<span class="trait-tag">${s}</span>`).join("")}</div>
          </div>
          <div class="horoscope-detail-card">
            <h3>🌍 Cosmic Details</h3>
            <p><strong>Element:</strong> ${o.element} &nbsp;&nbsp; <strong>Ruling Planet:</strong> ${o.ruler}</p>
          </div>
        </div>
      </div>
    </section>
  `}function ct(){return d`
    <section class="page-section">
      <div class="section-heading"><div><p>Financial</p><h2>My Payments</h2></div></div>
      ${f(["Astrologer","Date","Duration","Amount","Status","Action"],e.userBookings.map(t=>{var o;return d`
        <tr>
          <td><strong>${r((o=t.astrologerId)==null?void 0:o.name)}</strong></td>
          <td>${new Date(t.date).toLocaleDateString()}</td>
          <td>${t.duration} min</td>
          <td><strong>₹${t.amount}</strong></td>
          <td><span class="status ${t.paymentStatus==="Paid"?"completed":"pending"}">${r(t.paymentStatus)}</span></td>
          <td>${t.paymentStatus!=="Paid"?`<button class="pay-btn" data-pay-booking="${t._id}" type="button">💳 Pay Now</button>`:'<span style="color:var(--text-muted)">✅ Done</span>'}</td>
        </tr>
      `}),"No payment records yet.")}
    </section>
  `}function lt(){const t=e.conversations;return d`
    <section class="page-section">
      <div class="section-heading"><div><p>Messages</p><h2>Chat</h2></div></div>
      <div class="chat-layout">
        <div class="chat-conversations">
          ${t.length?t.map(o=>{var n;const s=e.user.role==="user"?o.booking.astrologerId:o.booking.userId,a=e.selectedBookingChat===o.booking._id;return d`
              <button class="chat-conv-item ${a?"active":""}" data-open-chat="${o.booking._id}" data-chat-receiver="${s==null?void 0:s._id}" type="button">
                <div class="conv-avatar">${r(((s==null?void 0:s.name)||"?")[0])}</div>
                <div class="conv-info">
                  <strong>${r(s==null?void 0:s.name)}</strong>
                  <span>${r(((n=o.lastMessage)==null?void 0:n.message)||"")}</span>
                </div>
                ${o.unreadCount?`<span class="unread-badge">${o.unreadCount}</span>`:""}
              </button>
            `}).join(""):'<div class="chat-empty">No conversations yet</div>'}
        </div>
        <div class="chat-messages-panel">
          ${e.selectedBookingChat?d`
            <div class="chat-header">Conversation</div>
            <div class="chat-messages" id="chat-messages-area">
              ${e.chatMessages.length?e.chatMessages.map(o=>{var a;const s=String(((a=o.senderId)==null?void 0:a._id)||o.senderId)===e.user.id;return d`
                  <div class="chat-bubble ${s?"sent":"received"}">
                    ${r(o.message)}
                    <span class="bubble-time">${new Date(o.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>
                  </div>
                `}).join(""):'<div class="chat-empty">No messages yet. Start the conversation!</div>'}
            </div>
            <form class="chat-input-bar" id="chat-send-form">
              <input name="message" placeholder="Type a message..." required autocomplete="off" />
              <button type="submit">Send</button>
            </form>
          `:'<div class="chat-empty">Select a conversation to start chatting</div>'}
        </div>
      </div>
    </section>
  `}function ut(){var s,a,n,c;(s=document.getElementById("user-logout"))==null||s.addEventListener("click",z),document.querySelectorAll("[data-uview]").forEach(i=>{i.addEventListener("click",async()=>{e.userView=i.dataset.uview,e.selectedAstrologer=null,e.selectedBookingChat=null,e.error="",await S(),m()})}),document.querySelectorAll("[data-book-astrologer]").forEach(i=>{i.addEventListener("click",()=>{e.selectedAstrologer=e.astrologersList.find(u=>u._id===i.dataset.bookAstrologer),m()})}),(a=document.getElementById("back-to-astrologers"))==null||a.addEventListener("click",()=>{e.selectedAstrologer=null,m()});const t=document.getElementById("booking-duration");t&&e.selectedAstrologer&&t.addEventListener("change",()=>{const i=parseInt(t.value),u=e.selectedAstrologer.hourlyRate||500;document.getElementById("summary-duration").textContent=`${i} min`,document.getElementById("summary-total").textContent=`₹${Math.round(u*(i/60))}`}),(n=document.getElementById("confirm-booking"))==null||n.addEventListener("click",async()=>{const i=document.getElementById("booking-form");if(!i)return;const u=Object.fromEntries(new FormData(i));if(!u.date||!u.timeSlot){e.error="Please select date and time.",m();return}try{await l("/bookings",{method:"POST",body:JSON.stringify({astrologerId:e.selectedAstrologer._id,date:u.date,timeSlot:u.timeSlot,duration:parseInt(u.duration)||30,notes:u.notes||""})}),e.selectedAstrologer=null,e.userView="bookings",await S(),m()}catch(E){e.error=E.message,m()}}),document.querySelectorAll("[data-pay-booking]").forEach(i=>{i.addEventListener("click",async()=>{try{await l(`/bookings/${i.dataset.payBooking}/pay`,{method:"PUT"}),await q(),m()}catch(u){e.error=u.message,m()}})}),document.querySelectorAll("[data-cancel-booking]").forEach(i=>{i.addEventListener("click",async()=>{try{await l(`/bookings/${i.dataset.cancelBooking}/status`,{method:"PUT",body:JSON.stringify({status:"Cancelled"})}),await q(),m()}catch(u){e.error=u.message,m()}})}),document.querySelectorAll("[data-chat-booking]").forEach(i=>{i.addEventListener("click",async()=>{e.userView="chat",e.selectedBookingChat=i.dataset.chatBooking,await B(e.selectedBookingChat),await F(),m(),j()})}),document.querySelectorAll("[data-open-chat]").forEach(i=>{i.addEventListener("click",async()=>{e.selectedBookingChat=i.dataset.openChat,await B(e.selectedBookingChat),m(),j()})}),(c=document.getElementById("chat-send-form"))==null||c.addEventListener("submit",async i=>{var N,O,_,x;i.preventDefault();const u=i.currentTarget.querySelector("input[name=message]"),E=(N=u==null?void 0:u.value)==null?void 0:N.trim();if(!E||!e.selectedBookingChat)return;const v=e.userBookings.find(g=>g._id===e.selectedBookingChat);let $="";if(v&&($=e.user.id===String(((O=v.userId)==null?void 0:O._id)||v.userId)?((_=v.astrologerId)==null?void 0:_._id)||v.astrologerId:((x=v.userId)==null?void 0:x._id)||v.userId),!$){const g=e.conversations.find(k=>k.booking._id===e.selectedBookingChat);if(g){const k=e.user.role==="user"?g.booking.astrologerId:g.booking.userId;$=k==null?void 0:k._id}}if(!$){e.error="Could not determine receiver.",m();return}try{await l("/chat/send",{method:"POST",body:JSON.stringify({bookingId:e.selectedBookingChat,receiverId:$,message:E})}),u.value="",await B(e.selectedBookingChat),m();const g=document.getElementById("chat-messages-area");g&&(g.scrollTop=g.scrollHeight)}catch(g){e.error=g.message,m()}});const o=document.getElementById("chat-messages-area");o&&(o.scrollTop=o.scrollHeight)}function j(){p&&clearInterval(p),p=setInterval(async()=>{if(e.selectedBookingChat&&e.userView==="chat"){await B(e.selectedBookingChat);const t=document.getElementById("chat-messages-area");t&&t.querySelectorAll(".chat-bubble").length!==e.chatMessages.length&&m()}},5e3)}async function mt(){e.user&&(e.user.role==="user"?await S():await b()),C()}mt();
