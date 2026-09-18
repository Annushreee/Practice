const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {

    // GET /
    if (req.url === "/" && req.method === "GET") {

        let messages = "";

        // Read existing messages
        if (fs.existsSync("message")) {
            messages = fs.readFileSync("message", "utf8");
        }

        // Convert messages into HTML
        const messageList = messages
            .split("\n")
            .filter(message => message.trim() !== "")
            .map(message => `<p>${message}</p>`)
            .join("");

        res.setHeader("Content-Type", "text/html");

        res.end(`
            <html>
                <body>

                    <h1>Messages</h1>

                    ${messageList}

                    <form action="/" method="POST">
                        <input 
                            type="text" 
                            name="message" 
                            placeholder="Enter message"
                        >
                        <button type="submit">Send</button>
                    </form>

                </body>
            </html>
        `);
    }

    // POST /
    else if (req.url === "/" && req.method === "POST") {

        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {

            // body = message=Hello
            const message = decodeURIComponent(
                body.split("=")[1]
            );

            let oldMessages = "";

            if (fs.existsSync("message")) {
                oldMessages = fs.readFileSync("message", "utf8");
            }

            // New message goes FIRST
            const updatedMessages =
                message + "\n" + oldMessages;

            fs.writeFileSync(
                "message",
                updatedMessages
            );

            // 302 redirect
            res.statusCode = 302;
            res.setHeader("Location", "/");

            res.end();
        });
    }

    else {
        res.statusCode = 404;
        res.end("Page Not Found");
    }

});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});