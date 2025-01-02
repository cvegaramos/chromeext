chrome.webNavigation.onCompleted.addListener((details) => {
  const url = new URL(details.url);
  const domain = url.hostname;

  chrome.storage.local.get(['user', 'organization', 'stats'], (result) => {
    const user = result.user || 'Unknown';
    const organization = result.organization || 'Unknown';
    const stats = result.stats || {};

    if (!stats[user]) {
      stats[user] = {};
    }
    if (!stats[user][organization]) {
      stats[user][organization] = { sites: {}, searches: {}, dataUsage: 0 };
    }

    if (!stats[user][organization].sites[domain]) {
      stats[user][organization].sites[domain] = 1;
    } else {
      stats[user][organization].sites[domain]++;
    }

    chrome.storage.local.set({ stats });
  });
});

chrome.webRequest.onCompleted.addListener((details) => {
  const dataUsage = details.responseHeaders
    .map(header => header.name.toLowerCase() === 'content-length' ? parseInt(header.value) : 0)
    .reduce((a, b) => a + b, 0);

  chrome.storage.local.get(['user', 'organization', 'stats'], (result) => {
    const user = result.user || 'Unknown';
    const organization = result.organization || 'Unknown';
    const stats = result.stats || {};

    if (!stats[user]) {
      stats[user] = {};
    }
    if (!stats[user][organization]) {
      stats[user][organization] = { sites: {}, searches: {}, dataUsage: 0 };
    }

    stats[user][organization].dataUsage += dataUsage;

    chrome.storage.local.set({ stats });
  });
}, { urls: ["<all_urls>"] }, ["responseHeaders"]);
