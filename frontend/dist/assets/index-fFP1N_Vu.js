(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`http://localhost:5000/api`,t={Aries:{symbol:`♈`,dates:`Mar 21 – Apr 19`,element:`Fire`,traits:[`Bold`,`Ambitious`,`Energetic`,`Courageous`],ruler:`Mars`,desc:`Aries leads with passion and courage. Your fiery spirit drives you to take initiative and blaze new trails. Today is perfect for starting new projects.`},Taurus:{symbol:`♉`,dates:`Apr 20 – May 20`,element:`Earth`,traits:[`Reliable`,`Patient`,`Determined`,`Sensual`],ruler:`Venus`,desc:`Taurus values stability and beauty. Your grounded nature helps others feel secure. Focus on self-care and financial planning today.`},Gemini:{symbol:`♊`,dates:`May 21 – Jun 20`,element:`Air`,traits:[`Versatile`,`Curious`,`Social`,`Witty`],ruler:`Mercury`,desc:`Gemini thrives on communication and learning. Your dual nature allows you to see all perspectives. A great day for networking.`},Cancer:{symbol:`♋`,dates:`Jun 21 – Jul 22`,element:`Water`,traits:[`Nurturing`,`Intuitive`,`Emotional`,`Protective`],ruler:`Moon`,desc:`Cancer connects deeply with emotions and family. Your intuition is strong today — trust your gut feelings.`},Leo:{symbol:`♌`,dates:`Jul 23 – Aug 22`,element:`Fire`,traits:[`Confident`,`Creative`,`Generous`,`Dramatic`],ruler:`Sun`,desc:`Leo radiates warmth and creativity. Your natural charisma draws people in. Express yourself boldly today.`},Virgo:{symbol:`♍`,dates:`Aug 23 – Sep 22`,element:`Earth`,traits:[`Analytical`,`Practical`,`Diligent`,`Kind`],ruler:`Mercury`,desc:`Virgo excels at details and service. Your practical approach solves problems others miss. Organize and plan today.`},Libra:{symbol:`♎`,dates:`Sep 23 – Oct 22`,element:`Air`,traits:[`Diplomatic`,`Harmonious`,`Fair`,`Social`],ruler:`Venus`,desc:`Libra seeks balance and beauty in all things. Your diplomatic skills are needed today — mediate and bring peace.`},Scorpio:{symbol:`♏`,dates:`Oct 23 – Nov 21`,element:`Water`,traits:[`Passionate`,`Resourceful`,`Determined`,`Mysterious`],ruler:`Pluto`,desc:`Scorpio transforms and regenerates. Your deep intensity uncovers hidden truths. Embrace transformation today.`},Sagittarius:{symbol:`♐`,dates:`Nov 22 – Dec 21`,element:`Fire`,traits:[`Adventurous`,`Optimistic`,`Philosophical`,`Free-spirited`],ruler:`Jupiter`,desc:`Sagittarius explores and expands horizons. Your optimism is contagious today. Plan a journey or learn something new.`},Capricorn:{symbol:`♑`,dates:`Dec 22 – Jan 19`,element:`Earth`,traits:[`Disciplined`,`Ambitious`,`Responsible`,`Patient`],ruler:`Saturn`,desc:`Capricorn builds for the long term. Your discipline and persistence pay off. Focus on career goals today.`},Aquarius:{symbol:`♒`,dates:`Jan 20 – Feb 18`,element:`Air`,traits:[`Innovative`,`Independent`,`Humanitarian`,`Original`],ruler:`Uranus`,desc:`Aquarius envisions the future. Your unconventional ideas inspire change. Connect with your community today.`},Pisces:{symbol:`♓`,dates:`Feb 19 – Mar 20`,element:`Water`,traits:[`Compassionate`,`Artistic`,`Intuitive`,`Dreamy`],ruler:`Neptune`,desc:`Pisces flows with creativity and empathy. Your artistic and spiritual side is heightened today. Create and dream.`}};function n(e){if(!e)return``;let t=new Date(e),n=t.getMonth()+1,r=t.getDate();return n===3&&r>=21||n===4&&r<=19?`Aries`:n===4&&r>=20||n===5&&r<=20?`Taurus`:n===5&&r>=21||n===6&&r<=20?`Gemini`:n===6&&r>=21||n===7&&r<=22?`Cancer`:n===7&&r>=23||n===8&&r<=22?`Leo`:n===8&&r>=23||n===9&&r<=22?`Virgo`:n===9&&r>=23||n===10&&r<=22?`Libra`:n===10&&r>=23||n===11&&r<=21?`Scorpio`:n===11&&r>=22||n===12&&r<=21?`Sagittarius`:n===12&&r>=22||n===1&&r<=19?`Capricorn`:n===1&&r>=20||n===2&&r<=18?`Aquarius`:`Pisces`}var r={user:a(),view:`dashboard`,customers:[],users:[],consultations:[],crmBookings:[],stats:{totalClients:0,upcomingConsultations:0,completedConsultations:0,pendingConsultations:0},userView:`dashboard`,astrologersList:[],userBookings:[],conversations:[],chatMessages:[],selectedAstrologer:null,selectedBookingChat:null,error:``},i=null;function a(){try{let e=localStorage.getItem(`user`);return e?JSON.parse(e):null}catch{return null}}function o(){return localStorage.getItem(`token`)}async function s(t,n={}){let r=await fetch(`${e}${t}`,{...n,headers:{"Content-Type":`application/json`,...o()?{Authorization:`Bearer ${o()}`}:{},...n.headers||{}}}),i=await r.json().catch(()=>({}));if(!r.ok)throw Error(i.message||`Request failed`);return i}async function c(){if(r.user)try{let[e,t,n,i,a]=await Promise.all([s(`/dashboard/stats`).catch(()=>r.stats),s(`/clients`).catch(()=>[]),s(`/consultations`).catch(()=>[]),r.user.role===`admin`?s(`/users`).catch(()=>[]):Promise.resolve([]),s(`/bookings`).catch(()=>[])]);r.stats=e,r.customers=t,r.consultations=n,r.users=i,r.crmBookings=a,r.error=``}catch(e){r.error=e.message}}async function l(){try{r.userBookings=await s(`/bookings`)}catch{r.userBookings=[]}}async function u(){try{r.astrologersList=await s(`/public/astrologers`)}catch{r.astrologersList=[]}}async function d(){try{r.conversations=await s(`/chat/conversations`)}catch{r.conversations=[]}}async function f(e){try{r.chatMessages=await s(`/chat/messages/${e}`)}catch{r.chatMessages=[]}}async function p(){!r.user||r.user.role!==`user`||await Promise.all([l(),u(),d()])}function m(e){localStorage.setItem(`token`,e.token),localStorage.setItem(`user`,JSON.stringify(e.user)),r.user=e.user}function h(){localStorage.removeItem(`token`),localStorage.removeItem(`user`),r.user=null,r.view=`dashboard`,r.userView=`dashboard`,r.selectedAstrologer=null,r.selectedBookingChat=null,i&&=(clearInterval(i),null),v()}function g(e,...t){return e.reduce((e,n,r)=>e+n+(t[r]??``),``)}function _(e){return String(e??``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`)}function v(){if(i&&=(clearInterval(i),null),!r.user){y();return}r.user.role===`user`?R():w()}function y(){let e=document.getElementById(`root`);e.innerHTML=g`
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
  `,document.getElementById(`goto-astrologer`)?.addEventListener(`click`,b),document.getElementById(`goto-user`)?.addEventListener(`click`,S)}function b(){let e=document.getElementById(`root`);e.innerHTML=g`
    <main class="auth-page">
      <section class="auth-panel">
        <div class="auth-copy">
          <span>Astrologer CRM</span>
          <h1>Manage customers, astrologers, and consultations.</h1>
          <p>Admin can control staff accounts while astrologers manage assigned customers.</p>
        </div>
        <form class="auth-form" id="astro-login-form">
          <h2>Astrologer Login</h2>
          ${r.error?`<div class="error-box">${_(r.error)}</div>`:``}
          <input name="email" placeholder="Email" required type="email" />
          <input name="password" placeholder="Password" required type="password" minlength="6" />
          <button class="primary-button" type="submit">Login</button>
          <button class="ghost-button" id="astro-show-register" type="button">Create admin/astrologer account</button>
          <button class="ghost-button" id="back-landing-1" type="button">← Back to Home</button>
        </form>
      </section>
    </main>
  `,document.getElementById(`back-landing-1`)?.addEventListener(`click`,()=>{r.error=``,y()}),document.getElementById(`astro-show-register`)?.addEventListener(`click`,x),document.getElementById(`astro-login-form`)?.addEventListener(`submit`,async e=>{e.preventDefault();let t=Object.fromEntries(new FormData(e.currentTarget));try{let e=await s(`/auth/login`,{method:`POST`,body:JSON.stringify(t)});if(e.user.role===`user`){r.error=`Please use the User Portal to login.`,b();return}m(e),await c(),v()}catch(e){r.error=e.message,b()}})}function x(){let e=document.getElementById(`root`);e.innerHTML=g`
    <main class="auth-page">
      <form class="auth-form solo" id="astro-register-form">
        <h2>Register Staff</h2>
        ${r.error?`<div class="error-box">${_(r.error)}</div>`:``}
        <input name="name" placeholder="Name" required />
        <input name="email" placeholder="Email" required type="email" />
        <input name="password" placeholder="Password" required type="password" minlength="6" />
        <select name="role"><option value="admin">Admin</option><option value="astrologer">Astrologer</option></select>
        <button class="primary-button" type="submit">Register</button>
        <button class="ghost-button" id="back-astro-login" type="button">← Back to Login</button>
      </form>
    </main>
  `,document.getElementById(`back-astro-login`)?.addEventListener(`click`,()=>{r.error=``,b()}),document.getElementById(`astro-register-form`)?.addEventListener(`submit`,async e=>{e.preventDefault();let t=Object.fromEntries(new FormData(e.currentTarget));try{await s(`/auth/register`,{method:`POST`,body:JSON.stringify(t)}),r.error=``,b()}catch(e){r.error=e.message,x()}})}function S(){let e=document.getElementById(`root`);e.innerHTML=g`
    <main class="user-auth-page">
      <form class="user-auth-form" id="user-login-form">
        <h2>⭐ User Login</h2>
        ${r.error?`<div class="error-box">${_(r.error)}</div>`:``}
        <input name="email" placeholder="Email" required type="email" />
        <input name="password" placeholder="Password" required type="password" minlength="6" />
        <button class="primary-button" type="submit">Login</button>
        <button class="ghost-button" id="goto-user-register" type="button">Create an account</button>
        <button class="ghost-button" id="back-landing-2" type="button">← Back to Home</button>
      </form>
    </main>
  `,document.getElementById(`back-landing-2`)?.addEventListener(`click`,()=>{r.error=``,y()}),document.getElementById(`goto-user-register`)?.addEventListener(`click`,()=>{r.error=``,C()}),document.getElementById(`user-login-form`)?.addEventListener(`submit`,async e=>{e.preventDefault();let t=Object.fromEntries(new FormData(e.currentTarget));try{let e=await s(`/auth/login`,{method:`POST`,body:JSON.stringify(t)});if(e.user.role!==`user`){r.error=`Please use the Astrologer Portal.`,S();return}m(e),await p(),v()}catch(e){r.error=e.message,S()}})}function C(){let e=document.getElementById(`root`);e.innerHTML=g`
    <main class="user-auth-page">
      <form class="user-auth-form" id="user-register-form">
        <h2>⭐ Create Account</h2>
        ${r.error?`<div class="error-box">${_(r.error)}</div>`:``}
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
  `,document.getElementById(`back-landing-3`)?.addEventListener(`click`,()=>{r.error=``,y()}),document.getElementById(`goto-user-login`)?.addEventListener(`click`,()=>{r.error=``,S()}),document.getElementById(`user-register-form`)?.addEventListener(`submit`,async e=>{e.preventDefault();let t=Object.fromEntries(new FormData(e.currentTarget));try{m(await s(`/auth/register-user`,{method:`POST`,body:JSON.stringify(t)})),await p(),v()}catch(e){r.error=e.message,C()}})}function w(){let e=document.getElementById(`root`);e.innerHTML=g`
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark">A</div>
          <div><strong>Astrologer CRM</strong><span>${_(r.user.role)}</span></div>
        </div>
        <nav class="nav-list">
          ${T(`dashboard`,`📊 Dashboard`)}
          ${T(`customers`,`👥 Customers`)}
          ${r.user.role===`admin`?T(`users`,`🛡️ Admin/Astrologers`):``}
          ${T(`bookings`,`📅 Bookings`)}
          ${T(`consultations`,`📋 Consultations`)}
        </nav>
        <button class="ghost-button logout-button" id="logout" type="button">🚪 Logout</button>
      </aside>
      <main class="content">
        <header class="topbar">
          <div><p>Welcome back</p><h1>${_(r.user.name)}</h1></div>
          <span class="role-pill">${_(r.user.role)}</span>
        </header>
        ${r.error?`<div class="error-box page-error">${_(r.error)}</div>`:``}
        ${E()}
      </main>
    </div>
  `,N()}function T(e,t){return`<button class="${r.view===e?`active`:``}" data-view="${e}" type="button">${t}</button>`}function E(){return r.view===`customers`?O():r.view===`users`&&r.user.role===`admin`?k():r.view===`bookings`?A():r.view===`consultations`?j():D()}function D(){return g`
    <section class="page-section">
      <div class="section-heading"><div><p>Overview</p><h2>Practice Snapshot</h2></div></div>
      <div class="stats-grid">
        ${[[`Total Customers`,r.stats.totalClients],[`Upcoming Consultations`,r.stats.upcomingConsultations],[`Completed Consultations`,r.stats.completedConsultations],[`Pending Consultations`,r.stats.pendingConsultations]].map(([e,t])=>g`
          <article class="stat-card">
            <div class="stat-icon">${_(e[0])}</div>
            <span>${_(e)}</span>
            <strong>${Number(t||0)}</strong>
          </article>
        `).join(``)}
      </div>
    </section>
  `}function O(){return g`
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
          ${r.users.filter(e=>e.role===`astrologer`).map(e=>`<option value="${e._id}">${_(e.name)}</option>`).join(``)}
        </select>
        <button class="primary-button compact" type="submit">Add Customer</button>
      </form>
      ${M([`Name`,`Phone`,`Zodiac`,`Assigned Astrologer`,`Actions`],r.customers.map(e=>g`
        <tr>
          <td><strong>${_(e.name)}</strong><span>${_(e.email)}</span></td>
          <td>${_(e.phone)}</td>
          <td>${_(e.zodiacSign||`Not set`)}</td>
          <td>${_(e.assignedAstrologer?.name||`Not assigned`)}</td>
          <td><button data-delete-customer="${e._id}" type="button">Delete</button></td>
        </tr>
      `),`No customers yet`)}
    </section>
  `}function k(){return g`
    <section class="page-section">
      <div class="section-heading"><div><p>Staff Access</p><h2>Admin / Astrologers</h2></div></div>
      <form class="data-form team-form" id="user-form">
        <input name="name" placeholder="Name" required />
        <input name="email" placeholder="Email" required type="email" />
        <input name="password" placeholder="Password" required type="password" minlength="6" />
        <select name="role"><option value="admin">Admin</option><option value="astrologer" selected>Astrologer</option></select>
        <button class="primary-button compact" type="submit">Add User</button>
      </form>
      ${M([`Name`,`Email`,`Role`,`Created`,`Actions`],r.users.map(e=>g`
        <tr>
          <td><strong>${_(e.name)}</strong><span>${_(e._id)}</span></td>
          <td>${_(e.email)}</td>
          <td><span class="role-pill">${_(e.role)}</span></td>
          <td>${e.createdAt?new Date(e.createdAt).toLocaleDateString():`-`}</td>
          <td><button data-delete-user="${e._id}" ${e._id===r.user.id?`disabled`:``} type="button">Delete</button></td>
        </tr>
      `),`No users yet`)}
    </section>
  `}function A(){return g`
    <section class="page-section">
      <div class="section-heading">
        <div>
          <p>${r.user.role===`astrologer`?`Your Booked Users`:`All User Bookings`}</p>
          <h2>Bookings</h2>
        </div>
      </div>
      ${M([`User`,`Date & Time`,`Duration`,`Amount`,`Status`,`Payment`,`Actions`],r.crmBookings.map(e=>g`
        <tr>
          <td>
            <strong>${_(e.userId?.name||`User`)}</strong>
            <span>${_(e.userId?.email||``)}${e.userId?.phone?` • ${_(e.userId.phone)}`:``}</span>
          </td>
          <td>${new Date(e.date).toLocaleDateString()} ${_(e.timeSlot||``)}</td>
          <td>${e.duration||30} min</td>
          <td><strong>₹${e.amount||0}</strong></td>
          <td><span class="status ${_((e.status||`Pending`).toLowerCase())}">${_(e.status||`Pending`)}</span></td>
          <td><span class="status ${e.paymentStatus===`Paid`?`completed`:`pending`}">${_(e.paymentStatus||`Pending`)}</span></td>
          <td>
            <div class="action-row">
              ${e.status===`Pending`?`<button data-booking-status="${e._id}" data-status="Confirmed" type="button">Confirm</button>`:``}
              ${e.status===`Confirmed`?`<button data-booking-status="${e._id}" data-status="Completed" type="button">Complete</button>`:``}
              ${[`Pending`,`Confirmed`].includes(e.status)?`<button data-booking-status="${e._id}" data-status="Cancelled" type="button">Cancel</button>`:``}
            </div>
          </td>
        </tr>
      `),r.user.role===`astrologer`?`No users have booked you yet.`:`No bookings yet.`)}
    </section>
  `}function j(){let e=r.users.filter(e=>e.role===`astrologer`);return g`
    <section class="page-section">
      <div class="section-heading"><div><p>Consultation Management</p><h2>Consultations</h2></div></div>
      <form class="data-form consultation-form" id="consultation-form">
        <select name="clientId" required>
          <option value="">Select customer</option>
          ${r.customers.map(e=>`<option value="${e._id}">${_(e.name)}</option>`).join(``)}
        </select>
        <select name="astrologerId">
          <option value="">Select astrologer</option>
          ${e.map(e=>`<option value="${e._id}">${_(e.name)}</option>`).join(``)}
        </select>
        <input name="date" required type="datetime-local" />
        <select name="status"><option>Scheduled</option><option>Pending</option><option>Completed</option><option>Cancelled</option></select>
        <textarea name="notes" placeholder="Consultation notes"></textarea>
        <button class="primary-button compact" type="submit">Add Consultation</button>
      </form>
      ${M([`Customer`,`Date`,`Status`,`Notes`,`AI Summary`,`Actions`],r.consultations.map(e=>g`
        <tr>
          <td><strong>${_(e.clientId?.name)}</strong><span>${_(e.astrologerId?.name)}</span></td>
          <td>${new Date(e.date).toLocaleString()}</td>
          <td><span class="status ${_(e.status.toLowerCase())}">${_(e.status)}</span></td>
          <td class="notes-cell">${_(e.notes||`No notes`)}</td>
          <td class="summary-cell">${_(e.aiSummary||`Not generated`)}</td>
          <td>
            <div class="action-row">
              <button data-summary="${e._id}" ${e.notes?``:`disabled`} type="button">AI</button>
              <button data-complete="${e._id}" type="button">Complete</button>
              <button data-delete-consultation="${e._id}" type="button">Delete</button>
            </div>
          </td>
        </tr>
      `),`No consultations yet`)}
    </section>
  `}function M(e,t,n){return g`
    <div class="table-wrap">
      <table>
        <thead><tr>${e.map(e=>`<th>${_(e)}</th>`).join(``)}</tr></thead>
        <tbody>${t.length?t.join(``):`<tr><td class="empty-table" colspan="${e.length}">${_(n)}</td></tr>`}</tbody>
      </table>
    </div>
  `}function N(){document.getElementById(`logout`)?.addEventListener(`click`,h),document.querySelectorAll(`[data-view]`).forEach(e=>{e.addEventListener(`click`,async()=>{r.view=e.dataset.view,await c(),w()})}),document.getElementById(`customer-form`)?.addEventListener(`submit`,P(`/clients`,`POST`)),document.getElementById(`user-form`)?.addEventListener(`submit`,P(`/users`,`POST`)),document.getElementById(`consultation-form`)?.addEventListener(`submit`,P(`/consultations`,`POST`)),document.querySelectorAll(`[data-delete-customer]`).forEach(e=>{e.addEventListener(`click`,()=>I(`/clients/${e.dataset.deleteCustomer}`))}),document.querySelectorAll(`[data-delete-user]`).forEach(e=>{e.addEventListener(`click`,()=>I(`/users/${e.dataset.deleteUser}`))}),document.querySelectorAll(`[data-delete-consultation]`).forEach(e=>{e.addEventListener(`click`,()=>I(`/consultations/${e.dataset.deleteConsultation}`))}),document.querySelectorAll(`[data-complete]`).forEach(e=>{e.addEventListener(`click`,()=>F(`/consultations/${e.dataset.complete}`,{status:`Completed`}))}),document.querySelectorAll(`[data-booking-status]`).forEach(e=>{e.addEventListener(`click`,()=>F(`/bookings/${e.dataset.bookingStatus}/status`,{status:e.dataset.status}))}),document.querySelectorAll(`[data-summary]`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=r.consultations.find(t=>t._id===e.dataset.summary);await F(`/ai/generate-summary`,{consultationId:t._id,notes:t.notes},`POST`)})})}function P(e,t){return async n=>{n.preventDefault();let i=Object.fromEntries(new FormData(n.currentTarget));try{await s(e,{method:t,body:JSON.stringify(i)}),await c(),w()}catch(e){r.error=e.message,w()}n.currentTarget.reset()}}async function F(e,t,n=`PUT`){try{await s(e,{method:n,body:JSON.stringify(t)}),await c(),w()}catch(e){r.error=e.message,w()}}async function I(e){try{await s(e,{method:`DELETE`}),await c(),w()}catch(e){r.error=e.message,w()}}function L(e,t,n){return`<button class="${r.userView===e?`active`:``}" data-uview="${e}" type="button">${t} ${n}</button>`}function R(){let e=document.getElementById(`root`),i=r.user.zodiacSign||n(r.user.dob)||``;e.innerHTML=g`
    <div class="app-shell user-portal">
      <aside class="sidebar user-sidebar">
        <div class="brand">
          <div class="brand-mark" style="background:linear-gradient(135deg,var(--purple-500),var(--purple-400));color:#fff;width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;">⭐</div>
          <div><strong>Astro Giri</strong><span>user</span></div>
        </div>
        <nav class="nav-list">
          ${L(`dashboard`,`🏠`,`Dashboard`)}
          ${L(`astrologers`,`🔮`,`Astrologers`)}
          ${L(`bookings`,`📅`,`My Bookings`)}
          ${L(`horoscope`,`♈`,`Horoscope`)}
          ${L(`payments`,`💳`,`Payments`)}
          ${L(`chat`,`💬`,`Chat`)}
        </nav>
        <button class="ghost-button logout-button" id="user-logout" type="button">🚪 Logout</button>
      </aside>
      <main class="content">
        <header class="topbar user-portal-topbar">
          <div><p>Welcome back</p><h1>${_(r.user.name)}</h1></div>
          <span class="role-pill user-role-pill">${i?`${t[i]?.symbol||`⭐`} ${i}`:`User`}</span>
        </header>
        ${r.error?`<div class="error-box page-error">${_(r.error)}</div>`:``}
        ${z()}
      </main>
    </div>
  `,q()}function z(){switch(r.userView){case`astrologers`:return r.selectedAstrologer?H():V();case`bookings`:return U();case`horoscope`:return W();case`payments`:return G();case`chat`:return K();default:return B()}}function B(){let e=r.userBookings.length,t=r.userBookings.filter(e=>e.status===`Confirmed`||e.status===`Pending`).length,n=r.userBookings.filter(e=>e.status===`Completed`).length;return g`
    <section class="page-section">
      <div class="section-heading"><div><p>Your Overview</p><h2>Dashboard</h2></div></div>
      <div class="stats-grid">
        ${[[`📅 Total Bookings`,e],[`⏰ Upcoming`,t],[`✅ Completed`,n],[`🔮 Astrologers`,r.astrologersList.length]].map(([e,t])=>g`
          <article class="user-stat-card">
            <div class="user-stat-icon">${e.split(` `)[0]}</div>
            <span>${_(e.substring(e.indexOf(` `)+1))}</span>
            <strong>${t}</strong>
          </article>
        `).join(``)}
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
  `}function V(){return r.astrologersList.length?g`
    <section class="page-section">
      <div class="section-heading"><div><p>Find Your Guide</p><h2>Browse Astrologers</h2></div></div>
      <div class="astrologer-grid">
        ${r.astrologersList.map(e=>g`
          <div class="astrologer-browse-card">
            <div class="card-header">
              <div class="avatar">${_((e.name||`A`)[0])}</div>
              <h3>${_(e.name)}</h3>
              <div class="specialization">${_(e.specialization||`General Astrology`)}</div>
            </div>
            <div class="card-body">
              <div class="card-meta">
                <span>Experience: <strong>${e.experience||0} yrs</strong></span>
                <span class="rating">${`★`.repeat(Math.round(e.rating||0))}${`☆`.repeat(5-Math.round(e.rating||0))}</span>
              </div>
              ${e.languages?.length?`<div class="languages-list">${e.languages.map(e=>`<span class="lang-tag">${_(e)}</span>`).join(``)}</div>`:``}
              <div class="card-meta">
                <span class="price">₹${e.hourlyRate||500} <small>/hr</small></span>
              </div>
              ${e.bio?`<p style="font-size:13px;color:var(--text-muted);margin:0;line-height:1.5">${_(e.bio).substring(0,100)}${e.bio.length>100?`...`:``}</p>`:``}
              <button class="book-btn" data-book-astrologer="${e._id}" type="button">Book Consultation →</button>
            </div>
          </div>
        `).join(``)}
      </div>
    </section>
  `:g`<section class="page-section">
      <div class="section-heading"><div><p>Find Your Guide</p><h2>Browse Astrologers</h2></div></div>
      <div class="empty-state"><p>No astrologers available at the moment. Check back soon!</p></div>
    </section>`}function H(){let e=r.selectedAstrologer;if(!e)return V();let t=[];for(let e=9;e<=20;e++)t.push(`${e.toString().padStart(2,`0`)}:00`),t.push(`${e.toString().padStart(2,`0`)}:30`);return g`
    <section class="page-section">
      <button class="back-btn" id="back-to-astrologers" type="button">← Back to Astrologers</button>
      <div class="section-heading"><div><p>Schedule Session</p><h2>Book with ${_(e.name)}</h2></div></div>
      <div class="booking-container">
        <form class="booking-form-card" id="booking-form">
          <h3>Consultation Details</h3>
          <label>Date<input name="date" required type="date" min="${new Date().toISOString().split(`T`)[0]}" /></label>
          <label>Time Slot
            <select name="timeSlot" required>
              <option value="">Select time</option>
              ${t.map(e=>`<option value="${e}">${e}</option>`).join(``)}
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
          <div class="summary-row"><span>Astrologer</span><strong>${_(e.name)}</strong></div>
          <div class="summary-row"><span>Specialization</span><strong>${_(e.specialization||`General`)}</strong></div>
          <div class="summary-row"><span>Rate</span><strong>₹${e.hourlyRate||500}/hr</strong></div>
          <div class="summary-row"><span>Duration</span><strong id="summary-duration">30 min</strong></div>
          <div class="summary-total"><span>Total</span><span id="summary-total">₹${Math.round((e.hourlyRate||500)*.5)}</span></div>
          <button class="confirm-btn" id="confirm-booking" type="button">✨ Confirm Booking</button>
        </div>
      </div>
    </section>
  `}function U(){return g`
    <section class="page-section">
      <div class="section-heading"><div><p>Your Sessions</p><h2>My Bookings</h2></div></div>
      ${M([`Astrologer`,`Date & Time`,`Duration`,`Status`,`Payment`,`Actions`],r.userBookings.map(e=>g`
        <tr>
          <td><strong>${_(e.astrologerId?.name)}</strong><span>${_(e.astrologerId?.specialization||``)}</span></td>
          <td>${new Date(e.date).toLocaleDateString()} ${_(e.timeSlot)}</td>
          <td>${e.duration} min</td>
          <td><span class="status ${_(e.status.toLowerCase())}">${_(e.status)}</span></td>
          <td><span class="status ${e.paymentStatus===`Paid`?`completed`:`pending`}">${_(e.paymentStatus)}</span></td>
          <td>
            <div class="action-row">
              ${e.paymentStatus===`Paid`?``:`<button class="pay-btn" data-pay-booking="${e._id}" type="button">Pay</button>`}
              ${e.status===`Pending`||e.status===`Confirmed`?`<button data-cancel-booking="${e._id}" type="button">Cancel</button>`:``}
              <button data-chat-booking="${e._id}" data-chat-other="${r.user.id===String(e.userId?._id||e.userId)?e.astrologerId?._id:e.userId?._id}" type="button">Chat</button>
            </div>
          </td>
        </tr>
      `),`No bookings yet. Browse astrologers to book your first consultation!`)}
    </section>
  `}function W(){let e=r.user.zodiacSign||n(r.user.dob)||``,i=t[e];return!e||!i?g`<section class="page-section">
      <div class="section-heading"><div><p>Cosmic Insight</p><h2>Your Horoscope</h2></div></div>
      <div class="horoscope-detail-card"><p>Please update your date of birth in your profile to see your horoscope.</p></div>
    </section>`:g`
    <section class="page-section">
      <div class="section-heading"><div><p>Cosmic Insight</p><h2>Your Horoscope</h2></div></div>
      <div class="horoscope-container">
        <div class="zodiac-card">
          <span class="zodiac-symbol">${i.symbol}</span>
          <h2>${_(e)}</h2>
          <p class="zodiac-dates">${i.dates}</p>
        </div>
        <div class="horoscope-info">
          <div class="horoscope-detail-card">
            <h3>☀️ Today's Energy</h3>
            <p>${i.desc}</p>
          </div>
          <div class="horoscope-detail-card">
            <h3>✨ Your Traits</h3>
            <div class="trait-tags">${i.traits.map(e=>`<span class="trait-tag">${e}</span>`).join(``)}</div>
          </div>
          <div class="horoscope-detail-card">
            <h3>🌍 Cosmic Details</h3>
            <p><strong>Element:</strong> ${i.element} &nbsp;&nbsp; <strong>Ruling Planet:</strong> ${i.ruler}</p>
          </div>
        </div>
      </div>
    </section>
  `}function G(){return g`
    <section class="page-section">
      <div class="section-heading"><div><p>Financial</p><h2>My Payments</h2></div></div>
      ${M([`Astrologer`,`Date`,`Duration`,`Amount`,`Status`,`Action`],r.userBookings.map(e=>g`
        <tr>
          <td><strong>${_(e.astrologerId?.name)}</strong></td>
          <td>${new Date(e.date).toLocaleDateString()}</td>
          <td>${e.duration} min</td>
          <td><strong>₹${e.amount}</strong></td>
          <td><span class="status ${e.paymentStatus===`Paid`?`completed`:`pending`}">${_(e.paymentStatus)}</span></td>
          <td>${e.paymentStatus===`Paid`?`<span style="color:var(--text-muted)">✅ Done</span>`:`<button class="pay-btn" data-pay-booking="${e._id}" type="button">💳 Pay Now</button>`}</td>
        </tr>
      `),`No payment records yet.`)}
    </section>
  `}function K(){let e=r.conversations;return g`
    <section class="page-section">
      <div class="section-heading"><div><p>Messages</p><h2>Chat</h2></div></div>
      <div class="chat-layout">
        <div class="chat-conversations">
          ${e.length?e.map(e=>{let t=r.user.role===`user`?e.booking.astrologerId:e.booking.userId;return g`
              <button class="chat-conv-item ${r.selectedBookingChat===e.booking._id?`active`:``}" data-open-chat="${e.booking._id}" data-chat-receiver="${t?._id}" type="button">
                <div class="conv-avatar">${_((t?.name||`?`)[0])}</div>
                <div class="conv-info">
                  <strong>${_(t?.name)}</strong>
                  <span>${_(e.lastMessage?.message||``)}</span>
                </div>
                ${e.unreadCount?`<span class="unread-badge">${e.unreadCount}</span>`:``}
              </button>
            `}).join(``):`<div class="chat-empty">No conversations yet</div>`}
        </div>
        <div class="chat-messages-panel">
          ${r.selectedBookingChat?g`
            <div class="chat-header">Conversation</div>
            <div class="chat-messages" id="chat-messages-area">
              ${r.chatMessages.length?r.chatMessages.map(e=>g`
                  <div class="chat-bubble ${String(e.senderId?._id||e.senderId)===r.user.id?`sent`:`received`}">
                    ${_(e.message)}
                    <span class="bubble-time">${new Date(e.createdAt).toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`})}</span>
                  </div>
                `).join(``):`<div class="chat-empty">No messages yet. Start the conversation!</div>`}
            </div>
            <form class="chat-input-bar" id="chat-send-form">
              <input name="message" placeholder="Type a message..." required autocomplete="off" />
              <button type="submit">Send</button>
            </form>
          `:`<div class="chat-empty">Select a conversation to start chatting</div>`}
        </div>
      </div>
    </section>
  `}function q(){document.getElementById(`user-logout`)?.addEventListener(`click`,h),document.querySelectorAll(`[data-uview]`).forEach(e=>{e.addEventListener(`click`,async()=>{r.userView=e.dataset.uview,r.selectedAstrologer=null,r.selectedBookingChat=null,r.error=``,await p(),R()})}),document.querySelectorAll(`[data-book-astrologer]`).forEach(e=>{e.addEventListener(`click`,()=>{r.selectedAstrologer=r.astrologersList.find(t=>t._id===e.dataset.bookAstrologer),R()})}),document.getElementById(`back-to-astrologers`)?.addEventListener(`click`,()=>{r.selectedAstrologer=null,R()});let e=document.getElementById(`booking-duration`);e&&r.selectedAstrologer&&e.addEventListener(`change`,()=>{let t=parseInt(e.value),n=r.selectedAstrologer.hourlyRate||500;document.getElementById(`summary-duration`).textContent=`${t} min`,document.getElementById(`summary-total`).textContent=`₹${Math.round(t/60*n)}`}),document.getElementById(`confirm-booking`)?.addEventListener(`click`,async()=>{let e=document.getElementById(`booking-form`);if(!e)return;let t=Object.fromEntries(new FormData(e));if(!t.date||!t.timeSlot){r.error=`Please select date and time.`,R();return}try{await s(`/bookings`,{method:`POST`,body:JSON.stringify({astrologerId:r.selectedAstrologer._id,date:t.date,timeSlot:t.timeSlot,duration:parseInt(t.duration)||30,notes:t.notes||``})}),r.selectedAstrologer=null,r.userView=`bookings`,await p(),R()}catch(e){r.error=e.message,R()}}),document.querySelectorAll(`[data-pay-booking]`).forEach(e=>{e.addEventListener(`click`,async()=>{try{await s(`/bookings/${e.dataset.payBooking}/pay`,{method:`PUT`}),await l(),R()}catch(e){r.error=e.message,R()}})}),document.querySelectorAll(`[data-cancel-booking]`).forEach(e=>{e.addEventListener(`click`,async()=>{try{await s(`/bookings/${e.dataset.cancelBooking}/status`,{method:`PUT`,body:JSON.stringify({status:`Cancelled`})}),await l(),R()}catch(e){r.error=e.message,R()}})}),document.querySelectorAll(`[data-chat-booking]`).forEach(e=>{e.addEventListener(`click`,async()=>{r.userView=`chat`,r.selectedBookingChat=e.dataset.chatBooking,await f(r.selectedBookingChat),await d(),R(),J()})}),document.querySelectorAll(`[data-open-chat]`).forEach(e=>{e.addEventListener(`click`,async()=>{r.selectedBookingChat=e.dataset.openChat,await f(r.selectedBookingChat),R(),J()})}),document.getElementById(`chat-send-form`)?.addEventListener(`submit`,async e=>{e.preventDefault();let t=e.currentTarget.querySelector(`input[name=message]`),n=t?.value?.trim();if(!n||!r.selectedBookingChat)return;let i=r.userBookings.find(e=>e._id===r.selectedBookingChat),a=``;if(i&&(a=r.user.id===String(i.userId?._id||i.userId)?i.astrologerId?._id||i.astrologerId:i.userId?._id||i.userId),!a){let e=r.conversations.find(e=>e.booking._id===r.selectedBookingChat);e&&(a=(r.user.role===`user`?e.booking.astrologerId:e.booking.userId)?._id)}if(!a){r.error=`Could not determine receiver.`,R();return}try{await s(`/chat/send`,{method:`POST`,body:JSON.stringify({bookingId:r.selectedBookingChat,receiverId:a,message:n})}),t.value=``,await f(r.selectedBookingChat),R();let e=document.getElementById(`chat-messages-area`);e&&(e.scrollTop=e.scrollHeight)}catch(e){r.error=e.message,R()}});let t=document.getElementById(`chat-messages-area`);t&&(t.scrollTop=t.scrollHeight)}function J(){i&&clearInterval(i),i=setInterval(async()=>{if(r.selectedBookingChat&&r.userView===`chat`){await f(r.selectedBookingChat);let e=document.getElementById(`chat-messages-area`);e&&e.querySelectorAll(`.chat-bubble`).length!==r.chatMessages.length&&R()}},5e3)}async function Y(){r.user&&(r.user.role===`user`?await p():await c()),v()}Y();