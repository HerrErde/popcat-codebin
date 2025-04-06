from quart import Quart, render_template_string

app = Quart(__name__)

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Save to LocalStorage</title>
</head>
<body>
    <textarea id="data" rows="10" cols="30"></textarea>
    <button onclick="saveData()">Save</button>
    <script>
        function saveData() {
            const text = document.getElementById("data").value;
            localStorage.setItem("savedText", text);
        }
        
        window.onload = function() {
            document.getElementById("data").value = localStorage.getItem("savedText") || "";
        };
    </script>
</body>
</html>
"""


@app.route("/")
async def index():
    return await render_template_string(HTML_TEMPLATE)


if __name__ == "__main__":
    app.run(debug=True)
