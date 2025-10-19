(() => {
  const SITE_VERSION = '1.2';
  const SAVED_VERSION = localStorage.getItem('siteVersion');
  if (SAVED_VERSION !== SITE_VERSION) {
    localStorage.removeItem('mockSessionUser');
    localStorage.setItem('siteVersion', SITE_VERSION);
  }

  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const formTitle = document.getElementById('formTitle');
  const formSubtitle = document.getElementById('formSubtitle');
  const messageBox = document.getElementById('message');

  const usersDBKey = 'mockUsersDB';
  const sessionKey = 'mockSessionUser';

  const getCurrentUser = ()=> JSON.parse(localStorage.getItem(sessionKey)||'null');
  const setCurrentUser = user => localStorage.setItem(sessionKey,JSON.stringify(user));
  const clearCurrentUser = ()=>localStorage.removeItem(sessionKey);
  const loadUsers = ()=>JSON.parse(localStorage.getItem(usersDBKey)||'[]');
  const saveUsers = users=>localStorage.setItem(usersDBKey,JSON.stringify(users));
  const emailExists = email=>loadUsers().some(u=>u.email.toLowerCase()===email.toLowerCase());
  const createUser = data=>{ const users=loadUsers(); users.push(data); saveUsers(users); };
  const authenticate = (email,password)=>loadUsers().find(u=>u.email.toLowerCase()===email.toLowerCase() && u.password===password);

  const showMessage = (text,type='error')=>{
    messageBox.textContent=text;
    messageBox.className='message '+(type==='error'?'error':'success');
    messageBox.style.display='block';
  }
  const clearMessage = ()=>{ messageBox.textContent=''; messageBox.className='message'; messageBox.style.display='none'; }

  const switchToLogin = ()=>{
    loginTab.classList.add('active'); registerTab.classList.remove('active');
    loginForm.classList.add('active'); registerForm.classList.remove('active');
    formTitle.textContent='התחברות לאתר'; formSubtitle.textContent='הזן את הפרטים שלך כדי להתחבר';
    clearMessage();
  }

  const switchToRegister = ()=>{
    registerTab.classList.add('active'); loginTab.classList.remove('active');
    registerForm.classList.add('active'); loginForm.classList.remove('active');
    formTitle.textContent='הרשמה לאתר'; formSubtitle.textContent='הזן את הפרטים כדי ליצור חשבון חדש';
    clearMessage();
  }

  loginTab.addEventListener('click',switchToLogin);
  registerTab.addEventListener('click',switchToRegister);

  const onLoginSuccess=user=>{
    setCurrentUser(user);
    showMessage(`שלום ${user.name||user.email}! ההתחברות בוצעה בהצלחה.`, 'success');
    setTimeout(()=>{ window.location.href='site.html'; }, 800);
  }

  const passwordsMatch = (p1,p2)=>p1===p2;

  loginForm.addEventListener('submit',e=>{
    e.preventDefault(); clearMessage();
    const email=loginForm.email.value.trim();
    const password=loginForm.password.value;
    if(!email||!password){ showMessage('אנא מלא את כל השדות'); return; }
    const user=authenticate(email,password);
    if(!user){ showMessage('אימייל או סיסמה שגויים'); return; }
    onLoginSuccess(user);
  });

  registerForm.addEventListener('submit',e=>{
    e.preventDefault(); clearMessage();
    const name=registerForm.name.value.trim();
    const email=registerForm.email.value.trim();
    const password=registerForm.password.value;
    const passwordConfirm=registerForm.passwordConfirm.value;
    if(!name||!email||!password||!passwordConfirm){ showMessage('אנא מלא את כל השדות'); return; }
    if(!passwordsMatch(password,passwordConfirm)){ showMessage('הסיסמאות אינן תואמות'); return; }
    if(password.length<6){ showMessage('הסיסמה חייבת להכיל לפחות 6 תווים'); return; }
    if(emailExists(email)){ showMessage('כתובת הדואר האלקטרוני כבר רשומה במערכת'); return; }
    createUser({name,email,password});
    showMessage('הרשמה הצליחה! עכשיו תוכל להתחבר.','success');
    setTimeout(switchToLogin,1500);
  });

  window.addEventListener('DOMContentLoaded',()=>{
    const currentUser=getCurrentUser();
    if(currentUser){ window.location.href='site.html'; }
  });
})();
