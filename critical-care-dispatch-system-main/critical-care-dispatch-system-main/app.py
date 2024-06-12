from Website import create_app
from flask_login import current_user

if __name__ == "__main__":
  app=create_app()
  
  @app.context_processor
  def inject_authentication():
      return {'user_authenticated': current_user.is_authenticated}
  app.run(debug="true")