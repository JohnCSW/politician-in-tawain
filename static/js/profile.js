let currentType = 'ptt';
let req = new XMLHttpRequest();
document.addEventListener('DOMContentLoaded', ()=>{
    setupNav();
    setUpAuthInterface();
    authSetup();
    loadFavArticles(currentType);
    document.querySelector('#profile-backBtn').onclick = () => {
        window.history.back();
    }
    document.querySelectorAll('#profile-bookmarks-type > button')
    .forEach(b => {
        if (b.dataset.type == currentType){
            b.style.color = 'black';
        }
        b.onclick = () => {
            if (b.dataset.type != currentType){
                b.style.color = 'black';
                document.querySelector(`#profile-bookmarks-type > button[data-type='${currentType}']`)
                .style.color = 'grey';

                currentType = b.dataset.type;
                req.abort();
                loadFavArticles(currentType);
            }
        };
    });
    
});

function loadFavArticles(type) {
    req.open('GET',`/api/articles/fav_list?type=${type}`);
    req.onload = () => {
        const fav_articles = JSON.parse(req.responseText).fav_articles;
        generateFavListInterface(fav_articles);
    }
    req.send();

}

function generateFavListInterface(fav_articles){
    const innerHTML = ejs.render(`
    <% articles.forEach(function(a){ %>
        <div class='profile-bookmarks-news'>
        <section class='profile-bookmarks-news-img'>
            <img src='<%= a.politician_imglink %>'>
            <label><%= a.politician_name %></label>
        </section>
        <a class='profile-bookmarks-news-title' href='<%= a.link %>'>
            <h3><%= a.title %></h3>
        </a>
        <button class='profile-bookmarks-news-remove' data-article_id='<%= a._id %>'>
            <i class="far fa-trash-alt"></i>
        </button>
    </div>
    <% }); %>
    `, {articles: fav_articles});
    document.querySelector('#profile-bookmarks-list').innerHTML = innerHTML;

    document.querySelectorAll('.profile-bookmarks-news-remove').forEach(b => {
        b.onclick = () => { 
            removeFavArticle(b.dataset.article_id, () => {
                b.parentElement.style.animationPlayState = 'running';
                b.parentElement.addEventListener('animationend', () => {
                b.parentElement.remove();
                });
            }); 
        };
    });
    
}
function removeFavArticle(id, removeFromList){
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', '/api/articles/remove');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
        removeFromList();
    };
    xhr.send(JSON.stringify({ article_id: id}));
}