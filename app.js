// 1. สร้าง Navbar และ Auth Modal ให้ทุกหน้าอัตโนมัติ
document.addEventListener('DOMContentLoaded', () => {
  injectSharedUI();
  checkAuthState();
  initSlider();
  centerCardsTrack();
});

function injectSharedUI() {
  const navHTML = `
    <nav class="navbar">
      <div class="nav-container">
        <a href="index.html" class="logo">
          <div class="logo-icon">🏢</div>
          <span>I love job</span>
        </a>
        <div id="navAuthArea">
          <button class="btn-emerald" onclick="openAuthModal('login')">เข้าสู่ระบบ</button>
        </div>
      </div>
    </nav>

    <div class="modal-overlay" id="authModal">
      <div class="modal-box">
        <button onclick="closeAuthModal()" style="position:absolute;top:14px;right:16px;border:none;background:none;font-size:1.2rem;cursor:pointer;">✕</button>
        <h3 id="modalTitle" style="margin-bottom:0.25rem;">เข้าสู่ระบบ I love job</h3>
        <p id="modalSub" style="font-size:0.85rem;color:#64748b;margin-bottom:1.25rem;">เริ่มต้นค้นหางานแรกสำหรับนักศึกษาจบใหม่</p>
        
        <form id="authForm" onsubmit="handleAuthSubmit(event)">
          <div class="form-group" id="nameField" style="display:none;">
            <label>ชื่อ-นามสกุล</label>
            <input type="text" id="authName" placeholder="เช่น วีรชัย คำตา">
          </div>
          <div class="form-group">
            <label>อีเมล</label>
            <input type="email" id="authEmail" required placeholder="demo@example.com">
          </div>
          <div class="form-group">
            <label>รหัสผ่าน</label>
            <input type="password" id="authPassword" required placeholder="••••••">
          </div>
          <button type="submit" class="btn-emerald" style="width:100%;justify-content:center;" id="authSubmitBtn">เข้าสู่ระบบ</button>
        </form>

        <div class="switch-auth" id="switchAuthText">
          ยังไม่มีบัญชี? <a onclick="toggleAuthMode('register')">สมัครสมาชิก</a>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('afterbegin', navHTML);
}

// 2. ระบบ Login / Register ผ่าน LocalStorage
let currentAuthMode = 'login';

function openAuthModal(mode = 'login') {
  toggleAuthMode(mode);
  document.getElementById('authModal').classList.add('active');
}

function closeAuthModal() {
  document.getElementById('authModal').classList.remove('active');
}

function toggleAuthMode(mode) {
  currentAuthMode = mode;
  const isReg = mode === 'register';
  document.getElementById('nameField').style.display = isReg ? 'block' : 'none';
  document.getElementById('modalTitle').innerText = isReg ? 'สมัครสมาชิกใหม่' : 'เข้าสู่ระบบ I love job';
  document.getElementById('authSubmitBtn').innerText = isReg ? 'สร้างบัญชี' : 'เข้าสู่ระบบ';
  document.getElementById('switchAuthText').innerHTML = isReg
    ? 'มีบัญชีอยู่แล้ว? <a onclick="toggleAuthMode(\'login\')">เข้าสู่ระบบ</a>'
    : 'ยังไม่มีบัญชี? <a onclick="toggleAuthMode(\'register\')">สมัครสมาชิก</a>';
}

function handleAuthSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value.trim();
  const name = document.getElementById('authName').value.trim();

  let users = JSON.parse(localStorage.getItem('ilovejob_users') || '[]');
  // บัญชีตัวอย่างเริ่มต้น
  if (!users.find(u => u.email === 'demo@example.com')) {
    users.push({ name: 'นักศึกษา ทดลองใช้งาน', email: 'demo@example.com', password: '123456' });
    localStorage.setItem('ilovejob_users', JSON.stringify(users));
  }

  if (currentAuthMode === 'register') {
    if (users.find(u => u.email === email)) {
      alert('อีเมลนี้ถูกใช้งานแล้ว');
      return;
    }
    const newUser = { name: name || email.split('@')[0], email, password };
    users.push(newUser);
    localStorage.setItem('ilovejob_users', JSON.stringify(users));
    localStorage.setItem('ilovejob_current_user', JSON.stringify(newUser));
    alert('สมัครสมาชิกและเข้าสู่ระบบสำเร็จ!');
    closeAuthModal();
    checkAuthState();
  } else {
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      localStorage.setItem('ilovejob_current_user', JSON.stringify(found));
      closeAuthModal();
      checkAuthState();
    } else {
      alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง (ทดลองใช้: demo@example.com / 123456)');
    }
  }
}

function checkAuthState() {
  const user = JSON.parse(localStorage.getItem('ilovejob_current_user'));
  const navArea = document.getElementById('navAuthArea');
  if (user && navArea) {
    navArea.innerHTML = `
      <div style="display:flex;align-items:center;gap:0.75rem;">
        <span style="font-size:0.9rem;font-weight:500;">👤 ${user.name}</span>
        <button class="btn-outline" onclick="logoutUser()">ออกจากระบบ</button>
      </div>
    `;
  }
}

function logoutUser() {
  localStorage.removeItem('ilovejob_current_user');
  location.reload();
}

// 3. สไลเดอร์ภาพ 8 รูปหน้าแรก
let slideIndex = 0;
let slideTimer;

function initSlider() {
  const track = document.getElementById('heroSlides');
  if (!track) return;
  slideTimer = setInterval(() => moveSlide(1), 4000);
}

function moveSlide(step) {
  const track = document.getElementById('heroSlides');
  if (!track) return;
  const total = track.children.length;
  slideIndex = (slideIndex + step + total) % total;
  track.style.transform = `translateX(-${slideIndex * 100}%)`;
}

// 4. เลื่อนกล่องตัวเลือก 10 ช่อง (เริ่มจากตรงกลาง)
function centerCardsTrack() {
  const track = document.getElementById('cardsTrack');
  if (track) {
    track.scrollLeft = (track.scrollWidth - track.clientWidth) / 2;
  }
}

function scrollCards(direction) {
  const track = document.getElementById('cardsTrack');
  if (track) {
    track.scrollBy({ left: direction * 300, behavior: 'smooth' });
  }
}
