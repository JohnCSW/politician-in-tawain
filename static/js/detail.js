const request = new XMLHttpRequest();
let currentType = 'news';
document.addEventListener('DOMContentLoaded', () => {
    setUpAuthInterface();
    authSetup();
    startup();
    document.querySelectorAll('#content-nav > button').forEach(b => {
        b.onclick = () => {
            const name = document.querySelector('#profile-name').dataset.profile_info;
            const type = b.dataset.content_type;

            if (type != currentType ){
                document.querySelector(`button[data-content_type=${currentType}]`)
                .style.backgroundColor = 'darkcyan';
                b.style.backgroundColor = 'darkblue';
                currentType = type;
                request.abort();
                document.querySelector('#content-headlines').innerHTML = indicateWaiting();
                loadInfo(name, type, displayInfo);
            }
            
        };
    });
  
});
function startup(){
    setupNav();
    document.querySelector(`button[data-content_type=${currentType}]`)
    .style.backgroundColor = 'darkblue';
    const name = document.querySelector('#profile-name').dataset.profile_info;

    document.querySelector('#content-headlines').innerHTML = indicateWaiting();

    loadInfo(name, 'news', displayInfo);
}

function loadInfo(name, type, displayInfo){
    
    request.open('POST', `/api/politicians/${type}`);
    request.onload = () => {
        if (request.status == 200){
            const data = JSON.parse(request.responseText);
            if (data.headlines.length <= 0){
                document.querySelector('#content-headlines').innerHTML = indicateNotFound();
            }else{
                displayInfo(data.headlines);
            }
        }else{
            document.querySelector('#content-headlines').innerHTML = indicateNotFound();

        }
    };
    const data = new FormData();
    data.append('name', name);
    request.send(data);
}

function displayInfo(headlines){
    const template = `
        <% headlines.forEach(function(h) { %>
            <div class='headlines'>
            <a href='<%= h.link %>' target="_blank">
                <%= h.title %>
            </a>
            <button class='headlines-fav' data-isAdded>
            <i class="far fa-heart"></i>
            </button>
            </div>
        <% }); %>
    `;
   const infoHTML = ejs.render(template, {headlines: headlines});
   document.querySelector('#content-headlines').innerHTML = infoHTML;
   setUpFavButton();
}
function setUpFavButton(){

    document.querySelectorAll('.headlines-fav').forEach(b => {
        b.onclick = () => {
            const title = b.previousElementSibling.innerHTML;
            const link = b.previousElementSibling.href;
            if (!b.dataset.isAdded) {
                addFavArticles(title, link , (article_id) => {
                    b.dataset.isAdded = true;
                    b.dataset.article_id = article_id;
                    b.innerHTML = '<i class="fas fa-heart"></i>'
                });
            }else{
                removeFavArticles(b.dataset.article_id, () => {
                    b.dataset.article_id = '';
                    b.dataset.isAdded = '';
                    b.innerHTML = '<i class="far fa-heart"></i>';
                });
            }
            
        };
   });
}
function addFavArticles(title, link, noteButton) {
    if (!localStorage.getItem('token')){
        alert('Please Log In / Sign up first!');
    }else {
        const politician_imglink = document.querySelector('#profile-img').src;
        const politician_name = document.querySelector('#profile-name').dataset.profile_info;
        const req = new XMLHttpRequest();
        req.open('POST', '/api/articles/add');
        req.setRequestHeader('Content-Type', 'application/json');
        req.responseType = 'json';
        req.onload = () => {
            noteButton(req.response.article_id);
        }
        const data = JSON.stringify({
            title: title.trim(),
            link: link,
            type: currentType,
            politician_name: politician_name,
            politician_imglink: politician_imglink
        });
        req.send(data);
    }
}
function removeFavArticles(id, noteButton){
    const req = new XMLHttpRequest();
    req.open('DELETE', '/api/articles/remove');
    req.setRequestHeader('Content-Type', 'application/json');
    req.onload = () => {
        noteButton();
    }
    req.send(JSON.stringify({article_id: id}));
    console.log('remove articles');
}