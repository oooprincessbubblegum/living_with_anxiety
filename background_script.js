// A whole bunch of stuff you probably don't want to mess with
// that just maintains the integrity of the extension in terms
// of the brwoser function, making the icon toggle, and telling
// the content script whether it can run.

function updateBadge(paused) {
  badge_text = paused ? "X" : "";
  chrome.browserAction.setBadgeText({text: badge_text});
}

function setPaused(paused) {
  localStorage.setItem('paused', paused);
  updateBadge(paused);
}

// Set the extension to pause on install

chrome.runtime.onInstalled.addListener(function() {
  setPaused(true);
});

// If the extension's icon is clicked, toggle it

chrome.browserAction.onClicked.addListener(function(tab){
  state = localStorage.getItem('paused') == 'true'
  setPaused(!state);
  chrome.tabs.update(tab.id, {url: tab.url});
});

// Receive messages from the content script

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.name == "isPaused?") {
    sendResponse({value: localStorage.getItem('paused')});
  }
});

// Set the badge to be correct

updateBadge(localStorage.getItem('paused') == true);
