import data_manager


def check_unique_username(username):
    return len(data_manager.execute_select('''
                SELECT username FROM users
                  WHERE username = %(username)s;
                ''', {"username": username})) == 0


def add_new_user(username, password):
    return data_manager.execute_dml_statement('''
                INSERT INTO users
                  VALUES (DEFAULT, %(username)s, %(password)s)
                ''', {"username": username, "password": password})


def read_hashed_password(username):
    return data_manager.execute_select('''
                SELECT password FROM users
                  WHERE username = %(username)s;
                ''', {"username": username})


def get_user_id(username):
    return data_manager.execute_select('''
                SELECT id FROM users
                  WHERE username = %(username)s;
                ''', {"username": username})


def get_boards(username):
    return data_manager.execute_select('''
                SELECT boards.* FROM boards JOIN users ON boards.user_id = users.id
                  WHERE users.username = %(username)s;
                ''', {"username": username})


def get_board(board_id):
    return data_manager.execute_select('''
                SELECT * FROM boards
                  WHERE id = %(board_is)s;
                ''', {"board_id": board_id})


def get_cards_by_board_id(board_id):
    return data_manager.execute_select('''
                SELECT * FROM cards
                  WHERE board_id = %(board_id)s AND is_active = TRUE;
                ''', {"board_id": board_id})


def get_card_by_id(card_id):
    return data_manager.execute_select('''
                SELECT * FROM cards
                  WHERE id = %(card_id)s;
                ''', {"card_id": card_id})


def add_new_board(new_board):
    # SELECT setval('table_id_seq', 3)
    return data_manager.execute_select('''
                INSERT INTO boards
                  VALUES (DEFAULT, %(title)s, %(is_active)s, %(user_id)s)
                  RETURNING id;
                ''', new_board)


def add_new_card(new_card):
    return data_manager.execute_select('''
                INSERT INTO cards
                  VALUES (DEFAULT, %(title)s, %(board_id)s, %(status_id)s, %(order)s, %(is_active)s)
                  RETURNING id;
                ''', new_card)


def get_new_order(board_id):
    return data_manager.execute_select('''
                SELECT MAX(cards.order) FROM cards
                  WHERE board_id = %(board_id)s;
                ''', {"board_id": board_id})


def edit_card(card_title, card_id):
    return data_manager.execute_select('''
                UPDATE cards
                  SET title = %(card_title)s
                  WHERE id = %(card_id)s
                  RETURNING id;
                ''', {"card_title": card_title, "card_id": card_id})


def update_card(updated_card):
    return data_manager.execute_dml_statement('''
                UPDATE cards
                  SET title = %(title)s, board_id = %(board_id)s, status_id = %(status_id)s, "order" = %(order)s
                  WHERE id = %(id)s;
                ''', updated_card)


def delete_card(card_id):
    return data_manager.execute_select('''
                UPDATE cards
                  SET is_active = FALSE 
                  WHERE id = %(card_id)s
                  RETURNING id;
                ''', {"card_id": card_id})
