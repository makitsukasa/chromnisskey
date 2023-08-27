importScripts('setting.js');

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

chrome.omnibox.onInputEntered.addListener(text => {
	post_note(text);
});

// https://blog.shahednasser.com/register-a-keyword-in-chrome-omnibox-in-your-extension/
function post_note(text){
	fetch(SERVER + "/api/notes/create", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			"i": ACCESS_TOKEN,
			"text": text
		}),
	})
	.then((response) => {
		response.text()
		.then(content => {
			notify("succeed", JSON.parse(content)["createdNote"]["text"]);
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
	return true;
}
