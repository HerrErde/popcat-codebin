from datetime import datetime

import uvicorn
from pydantic import BaseModel, ValidationError, constr
from quart import Quart, jsonify, render_template, request

import config
from db import DBHandler

app = Quart(__name__)
app.url_map.strict_slashes = False

db_handler = DBHandler()


@app.before_serving
async def before_serving():
    # Initialize the DB handler before the app starts
    await db_handler.initialize()


@app.route("/")
async def home():
    return await render_template("index.html")


@app.route("/create")
async def create():
    return await render_template("create.html")


@app.route("/<slug>", methods=["GET"])
async def redirect_url(slug):
    return await render_template("code.html")


class PasteModel(BaseModel):
    title: constr(min_length=1)
    description: constr(min_length=1)
    code: constr(min_length=1)
    theme: constr(min_length=1)
    language: constr(min_length=1)
    time: datetime


@app.route("/api/createpaste", methods=["POST"])
async def createpaste():
    try:
        data = await request.get_json()
        paste = PasteModel(**data)
    except (TypeError, ValidationError) as e:
        return jsonify({"error": str(e)}), 400

    success, slug = await db_handler.create(
        paste.title,
        paste.description,
        paste.code,
        paste.theme,
        paste.language,
        paste.time.isoformat() if hasattr(paste, "time") else None,
    )

    if success:
        return jsonify({"slug": slug}), 200
    else:
        return jsonify({"error": "Paste with this code already exists!"}), 400


@app.route("/api/getpaste/<slug>", methods=["GET"])
async def get_paste(slug):
    success, data = await db_handler.info(slug)
    if success and data:
        return {"paste": data}, 200
    elif success and not data:
        return jsonify({"error": "No URLs found"}), 400
    else:
        return jsonify({"error": "There was an Error"}), 500


startargs = {"host": config.HOST, "port": config.PORT, "reload": config.DEBUG}

if __name__ == "__main__":
    uvicorn.run("main:app", **startargs)
