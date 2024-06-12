from flask import Blueprint, render_template, request, flash, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from .models import User
from . import db
from flask_login import login_user, login_required, logout_user, current_user, login_required

auth = Blueprint("auth", __name__)


@auth.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get("username")
        mobilenumber = request.form.get("mobilenumber")

        user = User.query.filter_by(username=username).first()
        existing_mobilenumber = User.query.filter_by(mobilenumber=mobilenumber).first()
        
        if user:
            if existing_mobilenumber and  user.mobilenumber == existing_mobilenumber.mobilenumber:
                flash("Logged in!", category='success')
                login_user(user, remember=True)
                return redirect(url_for('views.user'))
            else:
                flash('Mobile Number is incorrect.', category='error')
        else:
            flash('Mobile Number does not exist.', category='error')

    return render_template("login.html")

@auth.route("/sign-up", methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        username = request.form.get('username')
        name = request.form.get('name')
        mobilenumber = request.form.get('mobilenumber')
        driverid = request.form.get('driverid')
        ambulanceno = request.form.get('ambulanceno')
        hostpitalname = request.form.get('hospitalname')
        aadharno = request.form.get('aadharno')
        print(username)
        print(name)
        print(mobilenumber)
        print(driverid)
        print(ambulanceno)
        print(hostpitalname)
        print(aadharno)
        
        username_exists = User.query.filter_by(username=username).first()
        existing_mobilenumber = User.query.filter_by(mobilenumber=mobilenumber).first()

        if existing_mobilenumber:
            flash('Mobile Number is already in use.', category='error')
        elif username_exists:
            flash('Username is already in use.', category='error')
        elif len(username) < 2:
            flash('Username is too short.', category='error')
        elif len(str(mobilenumber)) < 10:
            flash('Mobile Number is too short.', category='error')
        else:
            new_user = User(name=name, driver_id=driverid, username=username, mobilenumber=mobilenumber, ambulanceno=ambulanceno, hostpitalname=hostpitalname, aadharno=aadharno)
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user, remember=True)
            flash('User created!')
            return redirect(url_for('views.home'))

    return render_template("signup.html")


@auth.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("views.home"))