// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
let dataHandler = {
    userLoggedIn: function (callbackTrue, callbackFalse) {
        $.ajax({
            type: "POST",
            url: "/check-for-user",
            success: function (userLoggedIn) {
                if (userLoggedIn["status"]) {
                    callbackTrue(userLoggedIn["username"]);
                }
                else {
                    callbackFalse();
                }
            }
        });
    },
    createNewUser: function (username, password, confirmPassword, callback) {
        $.ajax({
            type: "POST",
            url: "/add-new-user",
            data: {"username": username,
                   "password": password,
                   "confirmPassword": confirmPassword},
            success: function (alertInfo) {
                callback(alertInfo);
            }
        });
    },
    loginUser: function (username, password, callback) {
        $.ajax({
            type: "POST",
            url: "/login",
            data: {"username": username,
                   "password": password},
            success: function (alertInfo) {
                callback(alertInfo);
            }
        });
    },
    logoutUser: function (callback) {
        $.ajax({
            type: "POST",
            url: "/logout",
            success: function (alertInfo) {
                callback(alertInfo);
            }
        })
    },
    getBoards: function(username, callback) {
        // the boards are retrieved and then the callback function is called with the boards
        $.ajax({
            type: "POST",
            url: "/get-boards",
            data: {"username": username},
            success: function (allBoards) {
                callback(username, allBoards);
            }
        });
    },
    getBoard: function(boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
        $.ajax({
            type: "POST",
            url: "/get-board",
            data: {"boardId": boardId},
            success: function (selectedBoard) {
                callback(selectedBoard);
            }
        });
    },
    getStatuses: function(callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
    },
    getStatus: function(statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: function(boardId, callback) {
        // the cards are retrieved and then the callback function is called with the cards
        $.ajax({
            type: "POST",
            url: "/get-cards-by-board-id",
            data: {"boardId": boardId},
            success: function (selectedCards) {
                callback(selectedCards);
            }
        });
    },
    getCard: function(cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
        $.ajax({
            type: "POST",
            url: "/get-card-by-id",
            data: {"cardId": cardId},
            success: function (selectedCard) {
                callback(selectedCard);
            }
        });
    },
    createNewBoard: function(username, boardTitle, callback) {
        // creates new board, saves it and calls the callback function with its data
        $.ajax({
            type: "POST",
            url: "/add-new-board",
            data: {"username": username,
                   "title": boardTitle},
            success: function (newBoard) {
                callback(newBoard);
            }
        });
    },
    createNewCard: function(cardTitle, boardId, statusId, callback) {
        // creates new card, saves it and calls the callback function with its data
        $.ajax({
            type: "POST",
            url: "/add-new-card",
            data: {"cardTitle": cardTitle,
                   "boardId": boardId,
                   "statusId": statusId},
            success: function (newCard) {
                callback(newCard);
            }
        });
    },
    editCard: function (cardTitle, cardId, callback) {
        $.ajax({
            type: "POST",
            url: "/edit-card",
            data: {"cardTitle": cardTitle,
                   "cardId": cardId},
            success: function (cardId) {
                callback(cardId["cardId"]);
            }
        });
    },
    updateCard: function (updatedCard) {
        $.ajax({
            type: "POST",
            url: "/update-card",
            data: {"id": updatedCard.id,
                   "cardTitle": updatedCard.title,
                   "boardId": updatedCard.board_id,
                   "statusId": updatedCard.status_id,
                   "order": updatedCard.order}
        });
    },
    deleteCard: function (cardId, callback) {
        $.ajax({
            type: "POST",
            url: "/delete-card",
            data: {"cardId": cardId},
            success: function (alertInfo) {
                callback(alertInfo);
            }
        });
    }
    // here comes more features
};