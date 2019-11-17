let curretType = 'login';
function setupNav(){
    const authBtn = document.querySelector('#navbar-auth > button');
    if (authBtn.dataset.auth_type == 'user_auth'){
        authBtn.onclick = () => {
            const auth_bg = document.querySelector('#auth-bg');
            auth_bg.style.display = 'flex';
        };
        document.querySelector('#auth-close > button').onclick = () => {
            const auth_bg = document.querySelector('#auth-bg');
            auth_bg.style.display = 'none';
            document.querySelector('#auth-error_msg').textContent = '';
            resetAuthDataField();
        };
    }else{
        authBtn.onclick = () => {
            logOut();
        }
    }
    

    document.querySelector('#navbar-profile').onclick = getProfileInfo;
}
function setUpAuthInterface(){
    document.querySelectorAll('#auth > nav > button')
    .forEach(b => {
        b.onclick = () => {
            document.querySelector('#auth-error_msg').textContent = '';
            document.querySelector('#auth-data-field')
            .innerHTML = getInterfaceFor(b.dataset.auth_type);
            document.querySelector(`#auth-${curretType}`)
            .style.color = 'grey';
            b.style.color = 'darkcyan';
            curretType = b.dataset.auth_type;
        };
    });
}

function getInterfaceFor(auth_type){
    if (auth_type == 'login'){

        return ejs.render(`
        <label>
        帳號:<input id='auth-data-acc' type='email' required>
        </label>
        <label>
        密碼:<input id='auth-data-pass'type='password' required>
        </label>
        `);
    }else{
        return ejs.render(`
        <label>
            姓名:<input id='auth-data-name' type='text' required>
        </label>
        <label>
            Email:<input id='auth-data-email' type='email' required>
        </label>
        <label>
        帳號:<input type='text' id='auth-data-acc' required>
        </label>
        <label>
            密碼:<input type='password' id='auth-data-pass' required>
        </label>
        `)
    }
}

function authSetup(){
    document.querySelector('#auth-send > button').onclick = () => {
        document.querySelector('#auth-error_msg').textContent = '';
        if (curretType == 'signup'){
            signUp();
        }else{
            logIn();
        }
    }
}

function signUp(){
    const name = document.querySelector('#auth-data-name').value;
    const acc = document.querySelector('#auth-data-acc').value;
    const pass = document.querySelector('#auth-data-pass').value;
    const email = document.querySelector('#auth-data-email').value;

    const req = new XMLHttpRequest();
    req.open('post', '/api/auth/signup');
    req.onload = () => {
        if (req.status != 200){
            document.querySelector('#auth-error_msg').textContent = req.responseText;
        }else{
            const token = JSON.parse(req.responseText).token;
            localStorage.setItem('token', token);
            location.reload();
        }             
    }
    const data = new FormData();
    data.append('name', name);
    data.append('account', acc);
    data.append('password', pass);
    data.append('email', email);

    req.send(data);
}
function logIn(){
    const acc = document.querySelector('#auth-data-acc').value;
    const pass = document.querySelector('#auth-data-pass').value;

    const req = new XMLHttpRequest();
    req.open('post', '/api/auth/login');
    req.onload = () => {
        if (req.status != 200){
            document.querySelector('#auth-error_msg').textContent = req.responseText;
        }else{
            const token = JSON.parse(req.responseText).token;
            localStorage.setItem('token', token);
            location.reload();
        }          
    }
    const data = new FormData();
    data.append('account', acc);
    data.append('password', pass);

    req.send(data);
}

function resetAuthDataField(){
    document.querySelectorAll('#auth-data-field input')
    .forEach(i => {
        i.value = '';
    });
}

function logOut(){
    //Delete Cookie
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    document.cookie = 'token=;'+ 'expires=' + now.toUTCString() + ';';

    localStorage.clear();
    const req = new XMLHttpRequest();
    req.open('post', '/api/auth/logout');
    req.onload = () => {
        location.reload();
    };
    req.send();
    
}

function getProfileInfo(){
    const token = localStorage.getItem('token');
    if (!token){
        alert('Please Log In/Sign Up first');
        return false;
    }
    return true;
}

