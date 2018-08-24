from flask import Flask, render_template, session, jsonify, request
import queries
import util


app = Flask(__name__)


@app.route("/")
def boards():
    """ this is a one-pager which shows all the boards and cards """
    return render_template("boards.html")


@app.route("/check-for-user", methods=["POST"])
def check_for_user():
    if "username" in session:
        username = session["username"]
        status = True
    else:
        username = ""
        status = False

    return jsonify(status=status,
                   username=username)


@app.route("/add-new-user", methods=["POST"])
def add_new_user():
    if util.unique_username(request.form["username"]):
        queries.add_new_user(request.form["username"],
                             util.hash_password(request.form["password"]))
        message = "Registered successfully!"
        alert_color = "alert-success"
    else:
        message = "Username already exists!"
        alert_color = "alert-danger"

    return jsonify(message=message,
                   alertColor=alert_color)


@app.route("/login", methods=["POST"])
def login():
    if util.valid_user(request.form["username"], request.form["password"]):
        session["username"] = request.form["username"]
        message = "You logged in, " + request.form["username"] + "!"
        alert_color = "alert-success"
        username = request.form["username"]
    else:
        message = "Incorrect username or password!"
        alert_color = "alert-danger"
        username = ""

    return jsonify(message=message,
                   alertColor=alert_color,
                   username=username)


@app.route("/logout", methods=["POST"])
def logout():
    session.pop("username", None)
    message = "You logged out successfully!"
    alert_color = "alert-success"

    return jsonify(message=message,
                   alertColor=alert_color)


@app.route("/get-boards", methods=["POST"])
def get_boards():
    selected_boards = queries.get_boards(request.form["username"])

    return jsonify(selectedBoards=selected_boards)


@app.route("/get-board", methods=["POST"])
def get_board():
    selected_board = queries.get_board(request.form["boardId"])

    return jsonify(id=selected_board["id"],
                   title=selected_board["title"],
                   is_active=selected_board["is_active"],
                   user_id=selected_board["user_id"])


@app.route("/get-cards-by-board-id", methods=["POST"])
def get_cards_by_board_id():
    selected_cards = queries.get_cards_by_board_id(request.form["boardId"])

    return jsonify(selectedCards=selected_cards)


@app.route("/get-card-by-id", methods=["POST"])
def get_card_by_id():
    selected_card = queries.get_card_by_id(request.form["cardId"])[0]

    return jsonify(id=selected_card["id"],
                   title=selected_card["title"],
                   board_id=selected_card["board_id"],
                   status_id=selected_card["status_id"],
                   order=selected_card["order"])


@app.route("/add-new-board", methods=["POST"])
def add_new_board():
    new_board = {"title": request.form["title"],
                 "is_active": True,
                 "user_id": queries.get_user_id(request.form["username"])[0]["id"]}
    selected_board = queries.add_new_board(new_board)[0]

    return jsonify(id=selected_board["id"],
                   title=new_board["title"],
                   is_active=new_board["is_active"],
                   user_id=new_board["user_id"])


@app.route("/add-new-card", methods=["POST"])
def add_new_card():
    new_card = {"title": request.form["cardTitle"],
                "board_id": request.form["boardId"],
                "status_id": request.form["statusId"],
                "order": int(queries.get_new_order(request.form["boardId"])[0]["max"]) + 1 if
                queries.get_new_order(request.form["boardId"])[0]["max"] else 1,
                "is_active": True}
    selected_card = queries.add_new_card(new_card)[0]

    return jsonify(id=selected_card["id"],
                   title=new_card["title"],
                   board_id=new_card["board_id"],
                   status_id=new_card["status_id"],
                   order=new_card["order"],
                   is_active=new_card["is_active"])


@app.route("/edit-card", methods=["POST"])
def edit_card():
    edited_card = queries.edit_card(request.form["cardTitle"], request.form["cardId"])[0]

    return jsonify(cardId=edited_card["id"])


@app.route("/update-card", methods=["POST"])
def update_card():
    card_to_update = {"id": request.form["id"],
                      "title": request.form["cardTitle"],
                      "board_id": request.form["boardId"],
                      "status_id": request.form["statusId"],
                      "order": request.form["order"]}
    queries.update_card(card_to_update)

    return "Ok"


@app.route("/delete-card", methods=["POST"])
def delete_card():
    deleted_card = queries.delete_card(request.form["cardId"])[0]

    return jsonify(cardId=deleted_card["id"],
                   message="Card deleted!",
                   alert_color="alert-success")


if __name__ == "__main__":
    app.secret_key = "OliProMan"
    app.run(debug=True)
