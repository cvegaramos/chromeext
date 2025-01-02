document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['user', 'organization', 'stats'], (result) => {
    const user = result.user || 'Unknown';
    const organization = result.organization || 'Unknown';
    const stats = result.stats || {};

    const statsDiv = document.getElementById('stats');
    if (stats[user] && stats[user][organization]) {
      const userStats = stats[user][organization];
      statsDiv.innerHTML = `
        <h2>Usuario: ${user}</h2>
        <h3>Organización: ${organization}</h3>
        <h4>Sitios visitados:</h4>
        <ul>
          ${Object.entries(userStats.sites).map(([site, count]) => `<li>${site}: ${count} visitas</li>`).join('')}
        </ul>
        <h4>Consumo de datos: ${userStats.dataUsage} bytes</h4>
      `;
    } else {
      statsDiv.innerHTML = '<p>No hay estadísticas disponibles.</p>';
    }
  });
});
