function do_tweet () {
	const filtered_Elements = Array.from(document.querySelectorAll("*")).filter(
		(e) => e.textContent === "ポストする" && e.getAttribute("role") === "button");
	if (filtered_Elements.length !== 0) {
		filtered_Elements[0].click();
		return true;
	} else {
		return false;
	}
};

const interval_id = setInterval(() =>{
	let succeed = do_tweet();
	if (succeed) {
		console.log("[chromnisskey] twitter auto post succeed");
		clearInterval(interval_id);
	} else {
		console.log("[chromnisskey] twitter auto post failed. retrying...");
	}
}, 1500);
