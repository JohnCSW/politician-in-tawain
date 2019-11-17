
function indicateNotFound(){
    const notfoundTemplate = `
        <h1 id='notfound_indicator'>
        找不到相關搜尋結果 <i class="far fa-dizzy"></i>
        </h1>
    `;
    return  notfoundHTML = ejs.render(notfoundTemplate);
}
function indicateWaiting(){
    const waitingTemplate = `
        <div class="spinner-border text-info" role="status" id='spinner'></div>
    `;
    return ejs.render(waitingTemplate);
}
