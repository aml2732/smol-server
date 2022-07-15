#How import syntax looks
from flask import Flask, request
from markupsafe import escape
from flask import render_template



# __name__ is a special keyword referencing the module/project name
app = Flask(__name__)

list_of_users = ["Bill","Colby", "Darcie", "Kat", "Steven", "Tanner"]
messageHistory = [];
# @signifies a decorator
# Where "/" is a parameter, and landing_page = app.route(landing_page(param)); essentially
@app.route("/")
def landing_page():
    return render_template('landing_page.html', users=list_of_users)

@app.route("/api/getMessageHistory")
def getMessageHistory():
    return {"response": messageHistory};

@app.route("/api/saveNewMessage", methods=['POST'])
def saveNewMessage():
    try:
        messageHistory.append(request.get_json())
        return {"response": "success"}
    except:
        return {"response": "failure"}


@app.route("/reply/<name>")
def reply_name_route(name):
    return f"Hello {escape(name)}, it was so nice to finally talk to you."

# @app.route("/repeat", methods=['POST'])
# def repeat_payload_route():
#     return f"For clarity, you said: {escape(request.data)}"
# Lookup later *args, **kwargs