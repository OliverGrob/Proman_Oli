import queries
import bcrypt


def hash_password(plain_text_password):
    hashed_bytes = bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt())
    return hashed_bytes.decode('utf-8')


def verify_password(plain_text_password, hashed_password):
    hashed_bytes_password = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_text_password.encode('utf-8'), hashed_bytes_password)


def unique_username(username):

    return queries.check_unique_username(username)


def valid_user(username, password):
    if len(queries.read_hashed_password(username)) != 0:
        return verify_password(password, queries.read_hashed_password(username)[0]["password"])

    return False
