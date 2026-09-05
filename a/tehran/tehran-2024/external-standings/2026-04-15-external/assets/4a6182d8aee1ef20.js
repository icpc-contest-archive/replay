// Render Scoreboard
// By: Hamid Zarrabi-Zadeh

const renderScoreboard = () => {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = rows.map(item => {
        const [rank, university, name, solved, time, teamID, ...problems] = item;

        const team = `<td class="team" data="${teamID}">${escapeHtml(name)}` +
            `<span class="muted">${escapeHtml(university)}</span></td>`;
        const info = `<td>${solved}</td><td>${time}</td>`;

        const probs = problems.map((prob, index) => {
            const [time, att, cls, solved_time] = prob;
            const tries = (index === problems.length - 1) ? att : getTriesText(att);

            return `<td class="${cls || ''}" data="${solved_time || '0'}">` +
                `${time}<span class="muted"> ${tries}</span></td>`;
        }).join('\n');

        return `<tr><td>${rank}</td>${team}${info}${probs}</tr>`;
    }).join('\n');
};

const getTriesText = att => att == 0 ? '--' : `${att} ${att == 1 ? 'try' : 'tries'}`;

const escapeHtml = str => String(str).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);

renderScoreboard();
