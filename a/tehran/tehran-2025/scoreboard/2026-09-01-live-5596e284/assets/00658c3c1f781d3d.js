// Render Scoreboard
// By: Hamid Zarrabi-Zadeh


const renderScoreboard = () => {
    const container = document.querySelector('.container');
    container.innerHTML = rows.map(item => {
        const [rank, affiliation, countryCode, countryName, name, solved, time, teamID, logo, ...problems] = item;

        const problemsHtml = problems.map((prob, index) => {
            const [time, att, cls, solvedTime] = prob;
            if (index === problems.length - 1) return '';
            const res = att ? `${att}–${time}` : '';

            return `<span class="${cls || 'empty'}" data="${solvedTime || '0'}">` +
                (res ? res : `${String.fromCharCode(65 + index)}`) + '</span>';
        }).join('\n');

        const scoreBadge = `${solved} – ${time}`;
        let flag = '';
        let subtitle = affiliation;
        if (flagType == 'country') {
            flag = `<img class="logo" src="img/flags/4x3/${countryCode}.svg" alt="${countryCode}" title="${countryName}"></img>`;
            subtitle = `${affiliation} - ${countryName}`;
        } else if (flagType == 'institution') {
            flag = `<img class="logo institution" src="img/logos/${logo}.png" alt="${affiliation}" title="${affiliation}"></img>`;
        }

        return `
        <div class="score-row" data-team="${teamID}">
            <div class="rank">${rank}</div>
            ${flag}
            <div class="name">${escapeHtml(name)} 
            <div class="subtitle">${subtitle}</div></div>
            <div class="problems">
                ${problemsHtml}
            </div>
            <div class="score-badge">${scoreBadge}</div>
        </div>`;
    }).join('\n');
};

function updateWidths() {
    const width = flagType === 'none' ? '50px 1fr 58% 90px' : '50px 60px 1fr 55% 90px';

    document.querySelectorAll('.score-row').forEach(row => {
        row.style.gridTemplateColumns = width;
    });
}

const escapeHtml = str => String(str).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);


//------------------------ Photo Modal ------------------------

function openModal() {
    document.getElementById("photoModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("photoModal").style.display = "none";
}

//------------------------ Main ------------------------

document.addEventListener("DOMContentLoaded", async () => {
    // const rows = await loadJson('js/scores.json');
    renderScoreboard();
    updateWidths();

    // init modal
    const img = document.querySelector("#photoModal img");
    document.querySelectorAll(".scoreboard div.name, .scoreboard img.logo").forEach(el => {
        el.addEventListener("click", () => {
            const num = +el.closest(".score-row").dataset.team;
            img.src = `photos/${num}.${photoFormat}`;
            openModal();
        });
    });
});
