from flask import Blueprint, render_template
from flask_login import login_required, current_user

views = Blueprint("views", __name__)



@views.route("/home")
@login_required
def home():
    return render_template("home.html", name=current_user.username)

@views.route("/")
@views.route("/user")
@login_required
def user():
    return render_template("user.html", name=current_user.username)

@views.route("/driver")
@login_required
def driver():
    return render_template("closest_ambu.html", name=current_user.username)

@views.route("/dashboard")
@login_required
def dashboard():
    return render_template("dashboard.html", name=current_user.username)

@views.route("/closest")
@login_required
def closest_ambulance():
    return render_template("driver.html", name=current_user.username)