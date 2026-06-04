// ===== ЛизингПро — статическая версия =====

// ---- НАСТРОЙКА FORMSPREE ----
// 1. Зарегистрируйтесь на https://formspree.io (бесплатный план: 50 заявок/мес)
// 2. Создайте новую форму, указав вашу почту
// 3. Скопируйте ID формы (например, "xayzgkqw") из URL вида:
//    https://formspree.io/f/xayzgkqw
// 4. Вставьте его ниже вместо YOUR_FORM_ID
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";
// -----------------------------

// Мобильное меню
const menuBtn = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
menuBtn?.addEventListener('click', () => mobileNav.classList.toggle('open'));
mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));

// ===== УСЛУГИ =====
const services = [
  { icon:'🚗', title:'Легковой транспорт', desc:'Седаны, кроссоверы, премиум-сегмент для руководителей и компании.', items:['Новые и с пробегом','Любые марки','Срок до 5 лет'], feat:true },
  { icon:'🚐', title:'Лёгкий коммерческий', desc:'Минивэны, фургоны, пикапы — для городских перевозок и доставки.', items:['Газель, Ford, VW','Аванс от 10%','Решение за 1 день'] },
  { icon:'🚛', title:'Грузовой транспорт', desc:'Седельные тягачи, самосвалы, рефрижераторы, прицепы и полуприцепы.', items:['MAN, Scania, КАМАЗ','Лизинг б/у техники','Сезонный график'] },
  { icon:'🚜', title:'Спецтехника', desc:'Экскаваторы, погрузчики, бульдозеры, краны и дорожная техника.', items:['Импортная и отечественная','Срок до 7 лет','Финансирование 90%'] },
  { icon:'⚙️', title:'Оборудование', desc:'Промышленное и торговое оборудование, станки, линии производства.', items:['Любая отрасль','Гибкий график','С НДС и без'] },
];
const sg = document.getElementById('servicesGrid');
services.forEach(s => {
  const el = document.createElement('a');
  el.href = '#apply';
  el.className = 'service' + (s.feat ? ' feat' : '');
  el.innerHTML = `
    <div class="service-top">
      <div class="service-icon">${s.icon}</div>
      <div class="service-arrow">↗</div>
    </div>
    <h3>${s.title}</h3>
    <p>${s.desc}</p>
    <ul>${s.items.map(i=>`<li>${i}</li>`).join('')}</ul>`;
  sg.appendChild(el);
});

// ===== КАЛЬКУЛЯТОР =====
const categories = [
  { id:'car', label:'Легковой', rate:0.09 },
  { id:'lcv', label:'Лёгкий коммерческий', rate:0.095 },
  { id:'truck', label:'Грузовой', rate:0.105 },
  { id:'special', label:'Спецтехника', rate:0.115 },
  { id:'equip', label:'Оборудование', rate:0.12 },
];
let activeCat = categories[0];

const fmt = (n) => new Intl.NumberFormat('ru-RU',{maximumFractionDigits:0}).format(Math.round(n)) + ' ₽';

const catChips = document.getElementById('catChips');
categories.forEach(c => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'chip' + (c.id === activeCat.id ? ' active' : '');
  b.textContent = c.label;
  b.addEventListener('click', () => {
    activeCat = c;
    catChips.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    recalc();
  });
  catChips.appendChild(b);
});

const priceEl = document.getElementById('price');
const advEl = document.getElementById('advance');
const termEl = document.getElementById('term');

function recalc(){
  const price = +priceEl.value;
  const advance = +advEl.value;
  const term = +termEl.value;
  const rate = activeCat.rate;
  const adv = price * advance / 100;
  const fin = price - adv;
  const r = rate / 12;
  const m = (fin * (r * Math.pow(1+r, term))) / (Math.pow(1+r, term) - 1);
  const tot = m * term + adv;
  document.getElementById('priceVal').textContent = fmt(price);
  document.getElementById('advVal').textContent = advance + '% · ' + fmt(adv);
  document.getElementById('termVal').textContent = term + ' мес.';
  document.getElementById('monthly').textContent = fmt(m);
  document.getElementById('financed').textContent = fmt(fin);
  document.getElementById('total').textContent = fmt(tot);
  document.getElementById('overpay').textContent = fmt(tot - price);
  document.getElementById('rate').textContent = '~ ' + (rate * 100).toFixed(1) + '% годовых';
}
[priceEl, advEl, termEl].forEach(e => e.addEventListener('input', recalc));
recalc();

// ===== ФОРМА КАТЕГОРИЙ =====
const formCats = document.getElementById('formCats');
const catInput = document.getElementById('catInput');
const catLabels = ['Легковой','Лёгкий коммерческий','Грузовой','Спецтехника','Оборудование'];
catLabels.forEach((c,i) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'chip' + (i===0 ? ' active' : '');
  b.textContent = c;
  b.addEventListener('click', () => {
    formCats.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    catInput.value = c;
  });
  formCats.appendChild(b);
});

// ===== Валидация формы: телефон и email =====
const form = document.getElementById('applyForm');
const msg = document.getElementById('formMsg');
const submitBtn = document.getElementById('submitBtn');

const phoneInput = form.querySelector('input[name="phone"]');
const emailInput = form.querySelector('input[name="email"]');

// Разрешаем ввод только цифр для телефона
phoneInput.addEventListener('input', () => {
  phoneInput.value = phoneInput.value.replace(/\D/g, '');
});

// ===== ОТПРАВКА ФОРМЫ ЧЕРЕЗ FORMSPREE С ПРОВЕРКОЙ EMAIL =====
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.hidden = true;

  const fd = new FormData(form);
  const name = (fd.get('name') || '').toString().trim();
  const phone = (fd.get('phone') || '').toString().trim();
  const email = (fd.get('email') || '').toString().trim();

  if (name.length < 2) return showMsg('Укажите имя', 'err');
  if (phone.length < 6) return showMsg('Укажите телефон', 'err');

  // Проверка email
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return showMsg('Введите корректный email в формате данные@домен', 'err');
  }

  if (FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) {
    return showMsg('⚠ Не настроен Formspree. Откройте script.js и вставьте ID формы.', 'err');
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Отправка…';

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method:'POST',
      headers:{ 'Accept':'application/json' },
      body: fd,
    });
    if (res.ok) {
      form.reset();
      formCats.querySelectorAll('.chip').forEach((x,i) => x.classList.toggle('active', i===0));
      catInput.value = 'Легковой';
      showMsg('✓ Заявка отправлена! Перезвоним в течение 15 минут.', 'ok');
    } else {
      const data = await res.json().catch(()=>({}));
      showMsg(data.error || 'Не удалось отправить. Попробуйте позже.', 'err');
    }
  } catch (err) {
    showMsg('Ошибка сети. Проверьте подключение и попробуйте снова.', 'err');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Отправить заявку';
  }
});

function showMsg(text, kind){
  msg.textContent = text;
  msg.className = 'form-msg ' + kind;
  msg.hidden = false;
}