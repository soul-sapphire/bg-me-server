from flask import Flask, request, send_file
from rembg import remove
import requests
from PIL import Image
from io import BytesIO

app = Flask(__name__)

@app.route("/", methods=["GET"])
def process():
    url = request.args.get("u")
    if not url:
        return "No image url", 400

    r = requests.get(url)
    img = Image.open(BytesIO(r.content)).convert("RGBA")

    out = remove(img)

    buf = BytesIO()
    out.save(buf, format="PNG")
    buf.seek(0)

    return send_file(buf, mimetype="image/png", as_attachment=True,
                     download_name="removed-bg.png")

app.run(port=5000)
