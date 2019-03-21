const apiKey = '8348f21dc81c4e5083d3195573bc7ec4';
const main = document.querySelector('main');
const sourceSelector = document.querySelector('#sourceSelector');
const prev = document.querySelector('#prev');
const next = document.querySelector('#next');
let defaultSource = 'polygon';
let defaultPage = 1;

window.addEventListener('load', async e => {
    updateNews();
    await updateSources();
    sourceSelector.value = defaultSource;

    // Get selected Source
    sourceSelector.addEventListener('change', e =>{
        defaultSource = sourceSelector.value;
        updateNews(e.target.value);
    });

    // Next Page
    next.addEventListener('click', function(){
        defaultPage++;
        updateNews();
    });
    // Prev Page
    prev.addEventListener('click', function(){
        defaultPage--;
        updateNews();
    });

    if('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.register('sw.js');
            console.log('SW registered');
        } catch (error) {
            console.log('SW registration failed');
        }
    }
});

// Get API Key
async function updateSources() {
    const res = await fetch(`https://newsapi.org/v2/sources?language=en&apiKey=${apiKey}`);
    const json = await res.json();

    // Fill #sourceSelector with API source array
    sourceSelector.innerHTML = json.sources.map(src => `<option value="${src.id}">${src.name}</option>`).join('\n');
}

async function updateNews(source = defaultSource, page = defaultPage) {
    const res = await fetch(`https://newsapi.org/v2/everything?language=en&pageSize=12&page=${page}&sources=${source}&apiKey=${apiKey}`);
    const json = await res.json();

    main.innerHTML = json.articles.map(createArticle).join('\n');
}

// Load Article
function createArticle(article) {
    return `
    <div class="article">
        <a href="${article.url}" target="_blank">
            <img src="${article.urlToImage}" alt="${article.title}">
                <h2>${article.title}</h2>
            <p class="articleText">${article.description}</p>
            <p class="articleDate">${article.publishedAt}</p>
        </a>
    </div>
    `;
  }

  