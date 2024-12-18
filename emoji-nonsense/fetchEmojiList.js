const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

async function fetchEmojiList() {
    try {
        // URL for the Unicode Emoji List
        const url = "https://unicode.org/emoji/charts/full-emoji-list.html";
        
        // Fetch the HTML content of the page
	if (fs.existsSync("full-emoji-list.html")) {
	    console.log("Getting full emoji list from local file...");
	    data = fs.readFileSync("full-emoji-list.html");
	} else {
	    console.log("Getting full emoji list from unicode.org (takes a while)...");
	    const { data } = await axios.get(url)
		.then((response) => {
		    fs.writeFileSync("full-emoji-list.html", response.data);
		    return response;
		});
	}

        // Load the HTML into cheerio for parsing
	console.log("Loading data into cheerio...");
        const $ = cheerio.load(data);
        
        const emojiCodepoints = [];
        
        // Select rows of the emoji table
        $("tr").each((_, row) => {
            // Select the Unicode codepoint cell
            const codeCell = $(row).find("td.code");
            if (codeCell.length > 0) {
                const codeText = codeCell.text().trim();
                const codePoints = codeText.split(" ").map(cp => parseInt(cp, 16)); // Parse codepoints as hex
                emojiCodepoints.push(codePoints.length > 1 ? codePoints : codePoints[0]);
		console.log(`Pushed ${codePoints[0]}`);
            }
        });

        // Save the array to a file
        fs.writeFileSync("emojiCodepoints.js", `const emojiCodepoints = ${JSON.stringify(emojiCodepoints, null, 2)};\n\nmodule.exports = emojiCodepoints;`);
        
        console.log("Emoji list has been saved to emojiCodepoints.js");
    } catch (error) {
        console.error("An error occurred while fetching the emoji list:", error.message);
    }
}

console.log("Running fetchEmojiList()...");
fetchEmojiList();

