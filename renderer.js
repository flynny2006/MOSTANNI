const viewsContainer = document.getElementById('views-container');
const urlInput = document.getElementById('url-input');
const goButton = document.getElementById('go-button');
const tabSelect = document.getElementById('tab-select');
const newTabButton = document.getElementById('new-tab');

let tabs = [];
let activeTabIndex = 0;

function createTab(url = 'https://example.com') {
  const webview = document.createElement('webview');
  webview.setAttribute('src', url);
  webview.setAttribute('allowpopups', '');
  webview.classList.add('webview');

  const index = tabs.length;
  tabs.push({ webview, url });

  const option = document.createElement('option');
  option.value = index;
  option.text = `Tab ${index + 1}`;
  tabSelect.appendChild(option);

  webview.addEventListener('did-navigate-in-page', () => {
    tabs[index].url = webview.getURL();
    if (index === activeTabIndex) urlInput.value = webview.getURL();
  });

  webview.addEventListener('did-navigate', () => {
    tabs[index].url = webview.getURL();
    if (index === activeTabIndex) urlInput.value = webview.getURL();
  });

  viewsContainer.appendChild(webview);
  switchTab(index);
}

function switchTab(index) {
  tabs.forEach((tab, i) => {
    tab.webview.style.display = i === index ? 'flex' : 'none';
  });
  activeTabIndex = index;
  tabSelect.value = index;
  urlInput.value = tabs[index].url;
}

function navigate() {
  let url = urlInput.value.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  const tab = tabs[activeTabIndex];
  tab.webview.setAttribute('src', url);
  tab.url = url;
  urlInput.value = url;
}

goButton.addEventListener('click', navigate);
urlInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') navigate();
});
tabSelect.addEventListener('change', (e) => {
  switchTab(Number(e.target.value));
});
newTabButton.addEventListener('click', () => createTab('https://example.com'));

window.electronAPI.onSaveSession(() => {
  const data = tabs.map(t => t.url);
  require('fs').writeFileSync('sessions.json', JSON.stringify(data));
});

// Load saved session
window.addEventListener('DOMContentLoaded', () => {
  let savedTabs = [];
  try {
    savedTabs = JSON.parse(require('fs').readFileSync('sessions.json'));
  } catch {}
  if (savedTabs.length === 0) savedTabs = ['https://example.com'];
  savedTabs.forEach(url => createTab(url));
});
