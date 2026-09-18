const fs = require("fs")
const requestHandler = (req, res) => {
    if (req.url === "/" && req.method === "GET") {
    
            res.setHeader("Content-Type", "text/html");
    
            res.end(`
                <html>
                    <body>
                        <form action="/" method="POST">
                            <label>Message:</label>
                            <input type="text" name="message">
                            <button type="submit">Send</button>
                        </form>
                    </body>
                </html>
            `);
        }
    
        // POST request → receive form data
        else if (req.url === "/" && req.method === "POST") {
    
            let body = "";
    
            req.on("data", (chunk) => {
                body += chunk.toString();
            });
    
            req.on("end", () => {
    
                console.log("Received:", body);
    
                // message=Hello
                const message = body.split("=")[1];
    
                // Write message to file
                fs.writeFileSync("message", message);
    
                console.log("Message saved!");
    
                // Redirect with 302
                res.statusCode = 302;
                res.setHeader("Location", "/");
    
                res.end();
            });
        }
    
        // Anything else
        else {
            res.statusCode = 404;
            res.end("Page Not Found");
        }
}

module.exports = requestHandler;