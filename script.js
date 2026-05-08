/* ============================================
   PETSHOP - Application Logic
   ============================================ */

// --- State ---
const state = {
  currentUser: null,
  pets: [],
  users: [],
  editingPetId: null,
  nextPetId: 1,
  nextUserId: 1,
};

// --- Seed Data ---
function seedData() {
  const stored = localStorage.getItem('petshop_data');
  if (stored) {
    const data = JSON.parse(stored);
    state.pets = data.pets || [];
    state.users = data.users || [];
    state.nextPetId = data.nextPetId || 1;
    state.nextUserId = data.nextUserId || 1;
    state.currentUser = data.currentUser || null;
    return;
  }

  state.users = [
    { id_user: 1, name_user: 'Maria Silva', email_user: 'maria@email.com', login_user: 'maria', password_user: '123456', address_user: 'Rua das Flores, 123', obs: '', status: 'active' },
    { id_user: 2, name_user: 'João Santos', email_user: 'joao@email.com', login_user: 'joao', password_user: '123456', address_user: 'Av. Brasil, 456', obs: '', status: 'active' },
  ];
  state.nextUserId = 3;

  state.pets = [
    { id_pet: 1, name_pet: 'Thor', race_pet: 'Golden Retriever', age_pet: '3 anos', weight_pet: 32, color_pet: 'Dourado', owner_pet: 'Maria Silva', picture_pet: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=600', obs: 'Muito brincalhão e carinhoso', status: 'active' },
    { id_pet: 2, name_pet: 'Luna', race_pet: 'Gato Persa', age_pet: '2 anos', weight_pet: 4.5, color_pet: 'Branco', owner_pet: 'João Santos', picture_pet: 'https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg?auto=compress&cs=tinysrgb&w=600', obs: 'Muito dócil e tranquila', status: 'active' },
    { id_pet: 3, name_pet: 'Max', race_pet: 'Pastor Alemão', age_pet: '5 anos', weight_pet: 38, color_pet: 'Preto e Marrom', owner_pet: 'Maria Silva', picture_pet: 'https://images.pexels.com/photos/1583523/pexels-photo-1583523.jpeg?auto=compress&cs=tinysrgb&w=600', obs: '', status: 'active' },
    { id_pet: 4, name_pet: 'Nina', race_pet: 'Poodle', age_pet: '1 ano', weight_pet: 5, color_pet: 'Branco', owner_pet: 'João Santos', picture_pet: 'https://images.pexels.com/photos/39317/toy-dog-bichon-frise-39317.jpeg?auto=compress&cs=tinysrgb&w=600', obs: 'Adora passear no parque', status: 'active' },
    { id_pet: 5, name_pet: 'Simba', race_pet: 'Gato Siamês', age_pet: '4 anos', weight_pet: 3.8, color_pet: 'Creme e Marrom', owner_pet: 'Maria Silva', picture_pet: 'https://images.pexels.com/photos/1543793/pexels-photo-1543793.jpeg?auto=compress&cs=tinysrgb&w=600', obs: '', status: 'active' },
    { id_pet: 6, name_pet: 'Buddy', race_pet: 'Labrador', age_pet: '2 anos', weight_pet: 28, color_pet: 'Chocolate', owner_pet: 'João Santos', picture_pet: 'https://images.pexels.com/photos/257540/pexels-photo-257540.jpeg?auto=compress&cs=tinysrgb&w=600', obs: 'Muito ativo, precisa de exercício diário', status: 'active' },
  ];
  state.nextPetId = 7;

  saveState();
}

function saveState() {
  localStorage.setItem('petshop_data', JSON.stringify({
    pets: state.pets,
    users: state.users,
    nextPetId: state.nextPetId,
    nextUserId: state.nextUserId,
    currentUser: state.currentUser,
  }));
}

// --- DOM Helpers ---
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// --- Navigation ---
function navigateTo(screen) {
  $$('.screen').forEach(s => s.classList.remove('active'));
  const target = $(`#screen${capitalize(screen)}`);
  if (target) {
    target.classList.add('active');
  }

  // Update nav links
  $$('.nav-link[data-nav]').forEach(link => {
    link.classList.toggle('active', link.dataset.nav === screen);
  });

  // Close mobile menu
  $('#navbarLinks').classList.remove('open');
  $('#navbarToggle').classList.remove('active');

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Screen-specific init
  if (screen === 'home') renderPets();
  if (screen === 'register-pet') resetPetForm();
}

function capitalize(str) {
  if (str === 'home') return 'Home';
  if (str === 'register') return 'Register';
  if (str === 'login') return 'Login';
  if (str === 'register-pet') return 'RegisterPet';
  if (str === 'pet-detail') return 'PetDetail';
  return str;
}

// --- Toast ---
function showToast(message, type = 'info') {
  const container = $('#toastContainer');
  const icons = {
    success: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    warning: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    info: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// --- Loading ---
function showLoading() {
  $('#loadingOverlay').classList.add('active');
}

function hideLoading() {
  $('#loadingOverlay').classList.remove('active');
}

// --- Confirm Modal ---
let confirmCallback = null;

function showConfirm(title, text, onConfirm) {
  $('#confirmTitle').textContent = title;
  $('#confirmText').textContent = text;
  $('#confirmModal').classList.add('active');
  confirmCallback = onConfirm;
}

// --- Render Pets ---
function renderPets(filter = '') {
  const grid = $('#petsGrid');
  const empty = $('#emptyState');
  const search = filter || $('#searchPets').value || '';

  let filtered = state.pets.filter(p => p.status !== 'deleted');

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name_pet.toLowerCase().includes(q) ||
      p.race_pet.toLowerCase().includes(q) ||
      p.owner_pet.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  grid.innerHTML = filtered.map(pet => `
    <div class="pet-card" data-id="${pet.id_pet}">
      <div class="pet-card-photo">
        ${pet.picture_pet
          ? `<img src="${pet.picture_pet}" alt="${pet.name_pet}" loading="lazy" />`
          : `<div class="no-photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>`
        }
        <span class="pet-card-badge">${pet.race_pet}</span>
      </div>
      <div class="pet-card-body">
        <h3 class="pet-card-name">${pet.name_pet}</h3>
        <div class="pet-card-info">
          <span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${pet.age_pet}
          </span>
          <span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            ${pet.owner_pet}
          </span>
        </div>
        <div class="pet-card-actions">
          <button class="btn btn-primary btn-sm" data-action="view" data-id="${pet.id_pet}">Ver Detalhes</button>
          <button class="btn btn-outline btn-sm" data-action="edit" data-id="${pet.id_pet}">Editar</button>
          <button class="btn btn-danger-outline btn-sm" data-action="delete" data-id="${pet.id_pet}">Excluir</button>
        </div>
      </div>
    </div>
  `).join('');
}

// --- Pet Detail ---
function showPetDetail(petId) {
  const pet = state.pets.find(p => p.id_pet === petId);
  if (!pet) return;

  $('#detailPhoto').src = pet.picture_pet || 'https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=600';
  $('#detailName').textContent = pet.name_pet;
  $('#detailRace').textContent = pet.race_pet;
  $('#detailColor').textContent = pet.color_pet || 'Não informada';
  $('#detailAge').textContent = pet.age_pet;
  $('#detailWeight').textContent = pet.weight_pet ? `${pet.weight_pet} kg` : 'Não informado';
  $('#detailOwner').textContent = pet.owner_pet;

  if (pet.obs && pet.obs.trim()) {
    $('#detailObsSection').style.display = 'block';
    $('#detailObs').textContent = pet.obs;
  } else {
    $('#detailObsSection').style.display = 'none';
  }

  // Store current pet id for edit/delete from detail screen
  $('#detailEditBtn').dataset.id = pet.id_pet;
  $('#detailDeleteBtn').dataset.id = pet.id_pet;

  navigateTo('pet-detail');
}

// --- Pet Form ---
function resetPetForm() {
  const form = $('#formPet');
  form.reset();
  $('#petId').value = '';
  state.editingPetId = null;
  $('#petFormTitle').textContent = 'Cadastrar Pet';
  $('#petFormSubtitle').textContent = 'Preencha os dados do seu pet';
  $('#btnSavePet').textContent = 'Salvar Pet';
  clearUploadPreview();
  clearFormErrors('formPet');
}

function editPet(petId) {
  const pet = state.pets.find(p => p.id_pet === petId);
  if (!pet) return;

  state.editingPetId = petId;
  $('#petId').value = pet.id_pet;
  $('#petName').value = pet.name_pet;
  $('#petRace').value = pet.race_pet;
  $('#petColor').value = pet.color_pet;
  $('#petAge').value = pet.age_pet;
  $('#petWeight').value = pet.weight_pet;
  $('#petOwner').value = pet.owner_pet;
  $('#petObs').value = pet.obs || '';

  if (pet.picture_pet) {
    showUploadPreview(pet.picture_pet);
  } else {
    clearUploadPreview();
  }

  $('#petFormTitle').textContent = 'Editar Pet';
  $('#petFormSubtitle').textContent = 'Atualize os dados do pet';
  $('#btnSavePet').textContent = 'Atualizar Pet';

  navigateTo('register-pet');
}

function deletePet(petId) {
  const pet = state.pets.find(p => p.id_pet === petId);
  if (!pet) return;

  showConfirm(
    'Excluir Pet',
    `Tem certeza que deseja excluir ${pet.name_pet}? Esta ação não pode ser desfeita.`,
    () => {
      showLoading();
      setTimeout(() => {
        const idx = state.pets.findIndex(p => p.id_pet === petId);
        if (idx !== -1) {
          state.pets[idx].status = 'deleted';
        }
        saveState();
        hideLoading();
        showToast(`${pet.name_pet} foi excluído com sucesso.`, 'success');
        navigateTo('home');
      }, 600);
    }
  );
}

// --- Upload Preview ---
let currentPictureData = null;

function showUploadPreview(src) {
  currentPictureData = src;
  $('#previewImg').src = src;
  $('#uploadPreview').style.display = 'block';
  $('#uploadPlaceholder').style.display = 'none';
}

function clearUploadPreview() {
  currentPictureData = null;
  $('#previewImg').src = '';
  $('#uploadPreview').style.display = 'none';
  $('#uploadPlaceholder').style.display = 'flex';
  $('#petPicture').value = '';
}

function handleFileUpload(file) {
  if (!file || !file.type.startsWith('image/')) {
    showToast('Por favor, selecione uma imagem válida.', 'error');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showToast('A imagem deve ter no máximo 5MB.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    showUploadPreview(e.target.result);
  };
  reader.readAsDataURL(file);
}

// --- Form Validation ---
function clearFormErrors(formId) {
  const form = $(`#${formId}`);
  form.querySelectorAll('.field-error').forEach(el => el.textContent = '');
  form.querySelectorAll('.input-wrapper').forEach(el => el.classList.remove('error'));
}

function setError(fieldId, errorId, message) {
  $(`#${errorId}`).textContent = message;
  $(`#${fieldId}`).closest('.input-wrapper').classList.add('error');
}

function validateRegisterForm() {
  clearFormErrors('formRegister');
  let valid = true;

  const name = $('#regName').value.trim();
  const email = $('#regEmail').value.trim();
  const login = $('#regLogin').value.trim();
  const password = $('#regPassword').value.trim();

  if (!name) { setError('regName', 'errRegName', 'Nome é obrigatório'); valid = false; }
  if (!email) { setError('regEmail', 'errRegEmail', 'Email é obrigatório'); valid = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('regEmail', 'errRegEmail', 'Email inválido'); valid = false; }
  if (!login) { setError('regLogin', 'errRegLogin', 'Login é obrigatório'); valid = false; }
  else if (state.users.some(u => u.login_user === login)) { setError('regLogin', 'errRegLogin', 'Este login já está em uso'); valid = false; }
  if (!password) { setError('regPassword', 'errRegPassword', 'Senha é obrigatória'); valid = false; }
  else if (password.length < 6) { setError('regPassword', 'errRegPassword', 'Mínimo de 6 caracteres'); valid = false; }

  return valid;
}

function validateLoginForm() {
  clearFormErrors('formLogin');
  let valid = true;

  if (!$('#loginUser').value.trim()) { setError('loginUser', 'errLoginUser', 'Login é obrigatório'); valid = false; }
  if (!$('#loginPassword').value.trim()) { setError('loginPassword', 'errLoginPassword', 'Senha é obrigatória'); valid = false; }

  return valid;
}

function validatePetForm() {
  clearFormErrors('formPet');
  let valid = true;

  if (!$('#petName').value.trim()) { setError('petName', 'errPetName', 'Nome é obrigatório'); valid = false; }
  if (!$('#petRace').value.trim()) { setError('petRace', 'errPetRace', 'Raça é obrigatória'); valid = false; }
  if (!$('#petAge').value.trim()) { setError('petAge', 'errPetAge', 'Idade é obrigatória'); valid = false; }
  if (!$('#petOwner').value.trim()) { setError('petOwner', 'errPetOwner', 'Dono é obrigatório'); valid = false; }

  return valid;
}

// --- Auth ---
function updateAuthUI() {
  const navLogin = $('#navLogin');
  const navRegister = $('#navRegister');
  const navUser = $('#navUser');
  const navLogout = $('#navLogout');
  const navRegisterPet = $('#navRegisterPet');

  if (state.currentUser) {
    navLogin.style.display = 'none';
    navRegister.style.display = 'none';
    navUser.style.display = 'inline-flex';
    navUser.textContent = state.currentUser.name_user;
    navLogout.style.display = 'inline-flex';
    navRegisterPet.style.display = 'inline-flex';
  } else {
    navLogin.style.display = 'inline-flex';
    navRegister.style.display = 'inline-flex';
    navUser.style.display = 'none';
    navLogout.style.display = 'none';
    navRegisterPet.style.display = 'none';
  }
}

function login(login, password) {
  const user = state.users.find(u => u.login_user === login && u.password_user === password && u.status !== 'deleted');
  if (!user) {
    showToast('Login ou senha incorretos.', 'error');
    return false;
  }
  state.currentUser = user;
  saveState();
  updateAuthUI();
  showToast(`Bem-vindo(a), ${user.name_user}!`, 'success');
  navigateTo('home');
  return true;
}

function logout() {
  state.currentUser = null;
  saveState();
  updateAuthUI();
  showToast('Você saiu da sua conta.', 'info');
  navigateTo('home');
}

function registerUser(data) {
  const user = {
    id_user: state.nextUserId++,
    name_user: data.name_user,
    email_user: data.email_user,
    login_user: data.login_user,
    password_user: data.password_user,
    address_user: data.address_user || '',
    obs: '',
    status: 'active',
  };
  state.users.push(user);
  saveState();
  return user;
}

// --- Init ---
function init() {
  seedData();
  updateAuthUI();
  renderPets();

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    $('#navbar').classList.toggle('scrolled', window.scrollY > 10);
  });

  // Mobile menu toggle
  $('#navbarToggle').addEventListener('click', () => {
    $('#navbarToggle').classList.toggle('active');
    $('#navbarLinks').classList.toggle('open');
  });

  // Navigation links
  document.addEventListener('click', (e) => {
    const navLink = e.target.closest('[data-nav]');
    if (navLink) {
      e.preventDefault();
      navigateTo(navLink.dataset.nav);
    }
  });

  // Pet card actions (delegated)
  $('#petsGrid').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id = parseInt(btn.dataset.id);
    if (btn.dataset.action === 'view') showPetDetail(id);
    else if (btn.dataset.action === 'edit') editPet(id);
    else if (btn.dataset.action === 'delete') deletePet(id);
  });

  // Detail screen actions
  $('#detailEditBtn').addEventListener('click', () => {
    editPet(parseInt($('#detailEditBtn').dataset.id));
  });
  $('#detailDeleteBtn').addEventListener('click', () => {
    deletePet(parseInt($('#detailDeleteBtn').dataset.id));
  });

  // Search
  $('#searchPets').addEventListener('input', (e) => {
    renderPets(e.target.value);
  });

  // Toggle password visibility
  $$('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = $(`#${btn.dataset.target}`);
      const isPassword = target.type === 'password';
      target.type = isPassword ? 'text' : 'password';
    });
  });

  // Register form
  $('#formRegister').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateRegisterForm()) return;

    showLoading();
    setTimeout(() => {
      registerUser({
        name_user: $('#regName').value.trim(),
        email_user: $('#regEmail').value.trim(),
        login_user: $('#regLogin').value.trim(),
        password_user: $('#regPassword').value.trim(),
        address_user: $('#regAddress').value.trim(),
      });
      hideLoading();
      showToast('Conta criada com sucesso! Faça login.', 'success');
      navigateTo('login');
    }, 800);
  });

  // Login form
  $('#formLogin').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateLoginForm()) return;

    showLoading();
    setTimeout(() => {
      login($('#loginUser').value.trim(), $('#loginPassword').value.trim());
      hideLoading();
    }, 800);
  });

  // Logout
  $('#navLogout').addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });

  // Pet form
  $('#formPet').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validatePetForm()) return;

    showLoading();
    setTimeout(() => {
      const petData = {
        name_pet: $('#petName').value.trim(),
        race_pet: $('#petRace').value.trim(),
        color_pet: $('#petColor').value.trim(),
        age_pet: $('#petAge').value.trim(),
        weight_pet: parseFloat($('#petWeight').value) || 0,
        owner_pet: $('#petOwner').value.trim(),
        picture_pet: currentPictureData || '',
        obs: $('#petObs').value.trim(),
        status: 'active',
      };

      if (state.editingPetId) {
        const idx = state.pets.findIndex(p => p.id_pet === state.editingPetId);
        if (idx !== -1) {
          state.pets[idx] = { ...state.pets[idx], ...petData };
        }
        hideLoading();
        showToast(`${petData.name_pet} atualizado com sucesso!`, 'success');
      } else {
        petData.id_pet = state.nextPetId++;
        state.pets.push(petData);
        hideLoading();
        showToast(`${petData.name_pet} cadastrado com sucesso!`, 'success');
      }

      saveState();
      navigateTo('home');
    }, 800);
  });

  // Upload area
  const uploadArea = $('#uploadArea');
  const fileInput = $('#petPicture');

  uploadArea.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    if (e.target.files[0]) handleFileUpload(e.target.files[0]);
  });

  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    if (e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]);
  });

  $('#uploadRemove').addEventListener('click', (e) => {
    e.stopPropagation();
    clearUploadPreview();
  });

  // Confirm modal
  $('#confirmCancel').addEventListener('click', () => {
    $('#confirmModal').classList.remove('active');
    confirmCallback = null;
  });

  $('#confirmOk').addEventListener('click', () => {
    $('#confirmModal').classList.remove('active');
    if (confirmCallback) confirmCallback();
    confirmCallback = null;
  });

  // Close modal on overlay click
  $('#confirmModal').addEventListener('click', (e) => {
    if (e.target === $('#confirmModal')) {
      $('#confirmModal').classList.remove('active');
      confirmCallback = null;
    }
  });
}

// Start
document.addEventListener('DOMContentLoaded', init);
