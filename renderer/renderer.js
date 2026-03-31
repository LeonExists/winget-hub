// === Apps - UI Logic ===
const appGrid = document.getElementById('app-grid');


window.addEventListener('DOMContentLoaded', async () => {
    await refreshAll();
});

const refreshBtn = document.getElementById('refresh-btn');
refreshBtn.addEventListener('click', async () => {
    await refreshAll();
});

async function refreshAll() {
    const apps = await window.winget.listApps();

    appGrid.innerHTML = ''; // Clear existing list

    apps.forEach(app => {
        createAppItem(app);
    });
}


function createAppItem(app) {
    const newApp = document.createElement('div');
    newApp.classList.add('app-item');
    newApp.innerHTML = `
        <img src="https://via.placeholder.com/64" alt="${app.Name} Icon" class="app-icon">
        <span class="app-name">${app.Name}</span>
        <span class="app-id">${app.Id}</span>
        <span class="app-version">${app.Version}</span>

        <div class="actions">
            <button class="update-btn">Update</button>
            <button class="uninstall-btn">Uninstall</button>
        </div>
    `;
    appGrid.appendChild(newApp);

    // update & uninstall button logic...
    // ...
}