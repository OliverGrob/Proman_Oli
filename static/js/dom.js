// It uses data_handler.js to visualize elements
let dom = {
    init: function () {
        dataHandler.userLoggedIn(dom.loadBoards, dom.loadLoginScreen)
    },
    loadLoginScreen: function () {
        $("#login-container").removeClass("d-none");
        $("#register-button").on("click", function () {
            if ($("#username_register").val() && $("#password_register").val() && $("#confirm_password").val()) {
                if ($("#password_register").val() === $("#confirm_password").val()) {
                    dataHandler.createNewUser($("#username_register").val(),
                        $("#password_register").val(),
                        $("#confirm_password").val(),
                        dom.resetRegisterInfo);
                }
                else {
                    let alertInfo = {"message": "Passwords do not match!",
                                     "alertColor": "alert-danger"};
                    dom.resetRegisterInfo(alertInfo);
                }
            }
        });
        $("#login-button").on("click", function () {
            if ($("#username_login").val() && $("#password_login").val()) {
                dataHandler.loginUser($("#username_login").val(),
                                      $("#password_login").val(),
                                      dom.loginUser)
            }
            $("#login-button").off("click");
        });
    },
    resetRegisterInfo: function (alertInfo) {
        dom.showAlert(alertInfo["message"], alertInfo["alertColor"]);
        $("#username_register").val("");
        $("#password_register").val("");
        $("#confirm_password").val("");
    },
    loginUser: function (alertInfo) {
        dom.showAlert(alertInfo["message"], alertInfo["alertColor"]);
        $("#username_login").val("");
        $("#password_login").val("");
        if (alertInfo["username"]) {
            $("#register-button").off();
            $("#login-container").addClass("d-none");
            dom.loadBoards(alertInfo["username"]);
        }
        else {
            dom.loadLoginScreen();
        }
    },
    logoutUser: function (alertInfo) {
        dom.showAlert(alertInfo["message"], alertInfo["alertColor"]);
        $("#username").text("ProMan");
        $("#logout-button").addClass("d-none");
        $("#boards").addClass("d-none");
        $("#boards").children().slice(2).remove();
        dom.loadLoginScreen();
    },
    showAlert: function (message, color) {
        $("#alert-message").first().text(message);
        $("#alert-message").toggleClass("d-none");
        $("#alert-message").toggleClass(color);
        $("#alert-message").fadeTo(2000, 500).slideUp(500, function() {
            $("#alert-message").slideUp(500);
            $("#alert-message").toggleClass("d-none");
            $("#alert-message").toggleClass(color);
        });
    },
    createBoardDiv: function (boardTitle, boardId) {
        return `
                <div class="container mb-4 p-4 proman-container text-white border border-success rounded">${boardTitle}
                    <button id="create_card_${boardId}" class="btn proman-button ml-2 collapse text-white"
                            data-toggle="modal" data-target="#createCardModal">
                        + New Card
                    </button>
                    <button id="open_board_${boardId}" class="btn proman-button float-right text-white"
                            data-toggle="collapse" data-target=" #${boardId}, #create_card_${boardId}">
                        +
                    </button>
                    <div class="row text-center mt-3 collapse proman-row p-2" id="${boardId}">
                        <div id="board_new_${boardId}" class="col-sm-6 col-md-4 col-lg-3">New</div>
                        <div id="board_todo_${boardId}" class="col-sm-6 col-md-4 col-lg-3">ToDo</div>
                        <div id="board_in_progress_${boardId}" class="col-sm-6 col-md-4 col-lg-3">In Progress</div>
                        <div id="board_done_${boardId}" class="col-sm-6 col-md-4 col-lg-3">Done</div>
                    </div>
                </div>
            `
    },
    loadBoards: function(username) {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(username, dom.showBoards);
    },
    showBoards: function(username, boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        $("#logout-button").toggleClass("d-none");
        $("#boards").toggleClass("d-none");
        $("#username").text(username);
        $("#logout-button").on("click", function () {
            dataHandler.logoutUser(dom.logoutUser);
            $("#logout-button").off("click");
        });
        document.getElementById("create_board_save").addEventListener("click", function () {
            if (document.getElementById("new_board_title").value) {
                dom.addNewBoard($("#username").text(),
                                document.getElementById("new_board_title").value);
                document.getElementById("new_board_title").value = "";
                document.getElementById("create_board_close").click();
            }
        });
        document.getElementById("create_board_close").addEventListener("click", function () {
            document.getElementById("new_board_title").value = "";
        });
        document.getElementById("create_card_save").addEventListener("click", function () {
            if (document.getElementById("new_card_title").value) {
                dom.addNewCard(document.getElementById("new_card_title").value, document.getElementById("new_card_board_id").value);
                document.getElementById("new_card_title").value = "";
                document.getElementById("create_card_close").click();
            }
        });
        document.getElementById("create_card_close").addEventListener("click", function () {
            document.getElementById("new_card_title").value = "";
        });
        for (let board of boards.selectedBoards) {
            dom.showBoard(board, false);
        }
    },
    loadCards: function(boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId, dom.showCards)
    },
    showCards: function(cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        for (let card of cards["selectedCards"]){
            let cardTitle = card.title;
            let cardDiv = `
                <div id="card_${card.id}" class="${card.board_id} p-3 rounded m-2 proman-card">${cardTitle}</div>
            `;
            let boardDiv = "";
            switch (card.status_id){
                case 1:
                    boardDiv = document.getElementById("board_new_" + card.board_id);
                    dom.appendToElement(boardDiv, cardDiv);
                    document.getElementById("card_" + card.id).classList.add("proman-card-new");
                    break;
                case 2:
                    boardDiv = document.getElementById("board_todo_" + card.board_id);
                    dom.appendToElement(boardDiv, cardDiv);
                    document.getElementById("card_" + card.id).classList.add("proman-card-todo");
                    break;
                case 3:
                    boardDiv = document.getElementById("board_in_progress_" + card.board_id);
                    dom.appendToElement(boardDiv, cardDiv);
                    document.getElementById("card_" + card.id).classList.add("proman-card-in-progress");
                    break;
                case 4:
                    boardDiv = document.getElementById("board_done_" + card.board_id);
                    dom.appendToElement(boardDiv, cardDiv);
                    document.getElementById("card_" + card.id).classList.add("proman-card-done");
                    break;
            }
            document.getElementById("card_" + card.id).addEventListener("dblclick", function () {
                if (document.getElementById("edit_card_title")){
                    document.getElementById("edit_card_title").remove();
                }
                let inputToEditCard = `
                    <input id="edit_card_title" type="text" required class="p-1 rounded" value="${card.title}">
                `;
                dom.appendToElement(document.getElementById("edit-card-modal-body"), inputToEditCard);
                document.getElementById("editCardTitle").click();
                document.getElementById("edit_card_save").addEventListener("click", function modalCardEditSave() {
                    dom.editCardTitle(document.getElementById("edit_card_title").value, card.id);
                    document.getElementById("edit_card_close").click();
                    document.getElementById("edit_card_save").removeEventListener("click", modalCardEditSave);
                    $("#edit_card_delete").off("click");
                });
                document.getElementById("edit_card_delete").addEventListener("click", function modalCardDelete() {
                    dom.deleteCard(card.id);
                    document.getElementById("edit_card_close").click();
                    document.getElementById("edit_card_delete").removeEventListener("click", modalCardDelete);
                    $("#edit_card_save").off("click");
                });
                $("#card_" + card.id).off("dblclick");
            });
        }
    },
    appendToElement: function(elementToExtend, textToAppend, prepend = false) {
        // function to append new DOM elements (represented by a string) to an existing DOM element
        let fakeDiv = document.createElement("div");
        fakeDiv.innerHTML = textToAppend.trim();

        for (childNode of fakeDiv.childNodes) {
            if (prepend) {
                elementToExtend.prependChild(childNode);
            } else {
                elementToExtend.appendChild(childNode);
            }
        }

        return elementToExtend.lastChild;
    },
    addNewBoard: function(username, newBoardTitle) {
        dataHandler.createNewBoard(username, newBoardTitle, dom.showBoard);
    },
    loadBoard: function(boardId) {
        dataHandler.getBoard(boardId, dom.showBoard);
    },
    showBoard: function(board, alert=true) {
        if (alert){
            dom.showAlert("Board created!", "alert-success")
        }
        let boardDiv = dom.createBoardDiv(board.title, board.id);
        dom.appendToElement(document.getElementById("boards"), boardDiv);
        document.getElementById("create_card_" + board.id).addEventListener("click", function () {
            if (document.getElementById("new_card_board_id")){
                document.getElementById("new_card_board_id").remove();
            }
            let hiddenDivToSendBoardId = `
                <input hidden id="new_card_board_id" value="${board.id}">
            `;
            dom.appendToElement(document.getElementById("new-card-modal-footer"), hiddenDivToSendBoardId);
        });
        dom.loadCards(board.id);
        // jquery
        $(document).ready( function(){

        // javascript
        // document.addEventListener("DOMContentLoaded", function() {

            dragula([document.getElementById("board_new_" + board.id),
                     document.getElementById("board_todo_" + board.id),
                     document.getElementById("board_in_progress_" + board.id),
                     // jquery
                     document.getElementById("board_done_" + board.id)]).on("dragend", function () {
                     // javascript
                     // document.getElementById("board_done_" + board.id)]).addEventListener("dragend", function () {
                dom.saveCards(board.id);
            });
        });
    },
    addNewCard: function(cardTitle, boardId) {
        dataHandler.createNewCard(cardTitle, boardId, 1, dom.showCard);
    },
    loadCard: function(cardId) {
        dataHandler.getCard(cardId, dom.showCard);
    },
    showCard: function(card) {
        dom.showAlert("Card created!", "alert-success");
        let cardTitle = card.title;
        let cardDiv = `
            <div id="card_${card.id}" class="${card.board_id} p-3 rounded m-2 proman-card">${cardTitle}</div>
        `;
        let boardDiv = document.getElementById("board_new_" + card.board_id);
        dom.appendToElement(boardDiv, cardDiv);
        document.getElementById("card_" + card.id).classList.add("proman-card-new");
        document.getElementById("card_" + card.id).addEventListener("dblclick", function () {
                if (document.getElementById("edit_card_title")){
                    document.getElementById("edit_card_title").remove();
                }
                let inputToEditCard = `
                    <input id="edit_card_title" type="text" required class="p-1 rounded" value="${card.title}">
                `;
                dom.appendToElement(document.getElementById("edit-card-modal-body"), inputToEditCard);
                document.getElementById("editCardTitle").click();
                document.getElementById("edit_card_save").addEventListener("click", function modalCardEditSave() {
                    dom.editCardTitle(document.getElementById("edit_card_title").value, card.id);
                    document.getElementById("edit_card_close").click();
                    document.getElementById("edit_card_save").removeEventListener("click", modalCardEditSave);
                    $("#edit_card_delete").off("click");
                });
                document.getElementById("edit_card_delete").addEventListener("click", function modalCardDelete() {
                    dom.deleteCard(card.id);
                    document.getElementById("edit_card_close").click();
                    document.getElementById("edit_card_delete").removeEventListener("click", modalCardDelete);
                    $("#edit_card_save").off("click");
                });
                $("#card_" + card.id).off("dblclick");
            });
    },
    editCardTitle: function(cardTitle, cardId) {
        dataHandler.editCard(cardTitle, cardId, dom.loadEditedCard);
    },
    loadEditedCard: function (cardId) {
        dataHandler.getCard(cardId, dom.updateCard);
    },
    deleteCard: function(cardId) {
        dataHandler.deleteCard(cardId, dom.deleteEditedCard);
    },
    deleteEditedCard: function (alertInfo) {
        dom.showAlert(alertInfo["message"], alertInfo["alert_color"]);
        $("#card_" + alertInfo["cardId"]).addClass("d-none");
    },
    updateCard: function (card) {
        dom.showAlert("Card edited!", "alert-success");
        document.getElementById("card_" + card.id).innerHTML = card.title;
        document.getElementById("card_" + card.id).addEventListener("dblclick", function () {
                if (document.getElementById("edit_card_title")){
                    document.getElementById("edit_card_title").remove();
                }
                let inputToEditCard = `
                    <input id="edit_card_title" type="text" required class="p-1 rounded" value="${card.title}">
                `;
                dom.appendToElement(document.getElementById("edit-card-modal-body"), inputToEditCard);
                document.getElementById("editCardTitle").click();
                document.getElementById("edit_card_save").addEventListener("click", function modalCardEditSave() {
                    dom.editCardTitle(document.getElementById("edit_card_title").value, card.id);
                    document.getElementById("edit_card_close").click();
                    document.getElementById("edit_card_save").removeEventListener("click", modalCardEditSave);
                    $("#edit_card_delete").off("click");
                });
                document.getElementById("edit_card_delete").addEventListener("click", function modalCardDelete() {
                    dom.deleteCard(card.id);
                    document.getElementById("edit_card_close").click();
                    document.getElementById("edit_card_delete").removeEventListener("click", modalCardDelete);
                    $("#edit_card_save").off("click");
                });
                $("#card_" + card.id).off("dblclick");
            });
    },
    saveCards: function(boardId) {
        let cardsToUpdate = document.getElementsByClassName(boardId);
        let statusId = 1;
        let orders = [1, 1, 1, 1];
        let order = 1;
        for (let cardToUpdate of cardsToUpdate){
            switch (cardToUpdate.parentNode.id){
                case "board_new_" + boardId:
                    cardToUpdate.classList.remove("proman-card-new",
                                                  "proman-card-todo",
                                                  "proman-card-in-progress",
                                                  "proman-card-done");
                    cardToUpdate.classList.add("proman-card-new");
                    statusId = 1;
                    order = orders[0];
                    orders[0]++;
                    break;
                case "board_todo_" + boardId:
                    cardToUpdate.classList.remove("proman-card-new",
                                                  "proman-card-todo",
                                                  "proman-card-in-progress",
                                                  "proman-card-done");
                    cardToUpdate.classList.add("proman-card-todo");
                    statusId = 2;
                    order = orders[1];
                    orders[1]++;
                    break;
                case "board_in_progress_" + boardId:
                    cardToUpdate.classList.remove("proman-card-new",
                                                  "proman-card-todo",
                                                  "proman-card-in-progress",
                                                  "proman-card-done");
                    cardToUpdate.classList.add("proman-card-in-progress");
                    statusId = 3;
                    order = orders[2];
                    orders[2]++;
                    break;
                case "board_done_" + boardId:
                    cardToUpdate.classList.remove("proman-card-new",
                                                  "proman-card-todo",
                                                  "proman-card-in-progress",
                                                  "proman-card-done");
                    cardToUpdate.classList.add("proman-card-done");
                    statusId = 4;
                    order = orders[3];
                    orders[3]++;
                    break;
            }
            let updatedCard = {
                "id": parseInt(cardToUpdate.id.split("_").pop()),
                "title": cardToUpdate.innerHTML,
                "board_id": boardId,
                "status_id": statusId,
                "order": order
            };
            dataHandler.updateCard(updatedCard);
        }
    }
    // here comes more features
};