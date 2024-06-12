from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    driver_id = db.Column(db.Integer, unique=True)
    username = db.Column(db.String(50))
    name = db.Column(db.String(50))
    mobilenumber = db.Column(db.Integer, unique=True)
    ambulanceno = db.Column(db.Integer, unique=True)
    hostpitalname = db.Column(db.String(50))
    aadharno = db.Column(db.Integer, unique=True)
    date_created = db.Column(db.DateTime(timezone=True), default=func.now())

    def get_id(self):
        return str(self.id)