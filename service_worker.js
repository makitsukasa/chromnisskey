importScripts('setting.js');

chrome.omnibox.onInputEntered.addListener(post_note);
chrome.omnibox.onInputChanged.addListener(suggest_channel);
chrome.omnibox.setDefaultSuggestion({description: "create public note"});

// notify chromnitweet
// https://github.com/dwyer/chromnitweet/blob/master/background.js
function notify(title, message){
	chrome.notifications.create('chromnisskey', {
		type: 'basic',
		// https://misskey-hub.net/appendix/assets.html
		iconUrl: "icon.png",
		title: title,
		message: message,
	}, id => {
		setTimeout(() => {
			chrome.notifications.clear(id, () => {});
		}, 3000);
	});
}

// https://blog.shahednasser.com/register-a-keyword-in-chrome-omnibox-in-your-extension/
function post_note(text){
	channelId = null;
	match = text.match(/^channelId\:([0-9a-zA-Z]+)\,text\:(.*)/);
	if (match) {
		channelId = match[1];
		text = match[2];
	}

	fetch(MISSKEY_SERVER + "/api/notes/create", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			"i": MISSKEY_ACCESS_TOKEN,
			"channelId": channelId,
			"text": text
		}),
	})
	.then((response) => {
		response.json()
		.then(content => {
			notify("succeed", content["createdNote"]["text"]);
			console.log(content);
		})
		.catch(error => {
			notify("opps", "something wrong");
			console.log(error)
		});
	})
	.catch(error => {
		notify("opps", "something wrong");
		console.log(error);
	});

	// open twitter page
	if (USE_TWITTER) {
		chrome.tabs.create({'url': TWITTER_URL + text});
	}

	return true;
}

function suggest_channel(text, suggest) {
	if (text != "ch") return;

	fetch(MISSKEY_SERVER + "/api/channels/my-favorites", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			"i": MISSKEY_ACCESS_TOKEN
		}),
	})
	.then((response) => {
		response.json()
		.then(content => {
			suggests = [];
			for (let i in content) {
				console.log(content[i]["id"], content[i]["name"]);
				suggests.push({
					content: `channelId:${content[i]["id"]},text:`,
					description: `channel:${content[i]["name"]}(${content[i]["id"]})`,
				});
			}
			suggest(suggests);
		})
		.catch(error => {
			notify("opps", "something wrong");
			console.log(error)
		});
	})
	.catch(error => {
		notify("opps", "something wrong");
		console.log(error);
	});
}
