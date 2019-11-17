document.addEventListener('DOMContentLoaded', () => {
    setupNav();
    setUpAuthInterface();
    authSetup();
    document.querySelector('#search-send > button')
    .onclick = () => { 
        const query = {
            area: document.querySelector('#search-area > select').value,
            title: document.querySelector('#search-title > select').value,
            party: document.querySelector('#search-party > select').value,
            name: document.querySelector('#search-name > input').value
        }
        queryPoliticiansBy(query , displayPoliticians);
    }
    
});
//Accessing data and Handling business Logic:
function queryPoliticiansBy(info, displayPoliticians){
    let conditions = []
    for (let condition in info){
        conditions.push(`${condition}=${info[condition]}`);
    }
    const queryString = '?' + conditions.join('&');

    const request = new XMLHttpRequest();
    request.open('GET', '/api/politicians/search' + queryString);
    request.onload = () => {
        if(request.status == 200){
            const candidates = JSON.parse(request.responseText)['candidates'];
            displayPoliticians(candidates);
        }else{
            console.error('Something failed');
        }
        resetQuery();
    };
    request.send();
}
//Manipulate web component:
function displayPoliticians(candidates){
        document.querySelector('#result').innerHTML = "";
        const result = document.querySelector('#result');
        result.style.minHeight = '100vh';
        result.style.paddingTop = '7vh';
        if(candidates.length > 0){
            result.innerHTML += generatePreViewProfile(candidates);
        }else{
           result.innerHTML = indicateNotFound();
        }
        window.location.hash = '#result';
        // It matters(modification on history states enable smooth scrolling)
        history.replaceState(null, null, ' ');
}
function resetQuery(){
    document.querySelectorAll('select').forEach(s => {
        s.selectedIndex = 0;
    });
    document.querySelector('input').value = "";
}
function generatePreViewProfile(candidates){
    const htmlString = ejs.render(`
            <h2>搜尋結果</h2>
        <%  candidates.forEach( function (c) { %>
            <a class='result-preview' href='/detail/<%= c._id %>'>
                <img src='<%= c.imgsrc %>'>
                <label> 姓名: <%= c.name%> </label>
                <label> 區域: <%= c.area%> </label>
                <label>職稱: <%= c.title %> </label>
                <label>黨籍: <%= c.party%> </label>
                <label>性別: <%= c.gender%> </label>
            </a>
        <% }); %>
    `, {candidates: candidates});
    return htmlString;
}


