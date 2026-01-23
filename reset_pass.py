from app import create_app
from extensions import db
from models import User
from utils import hash_password

app = create_app()

users_to_reset = [
    {"username": "owner", "password": "owner123", "role": "Owner", "email": "owner@inventrobil.com"},
    {"username": "manager", "password": "manager123", "role": "Manager", "email": "manager@inventrobil.com"},
    {"username": "cashier", "password": "cashier123", "role": "Cashier", "email": "cashier@inventrobil.com"}
]

with app.app_context():
    # Ensure tables exist (in case they were deleted)
    db.create_all()
    
    print("Resetting passwords...")
    for user_data in users_to_reset:
        user = User.query.filter_by(username=user_data['username']).first()
        if user:
            print(f"Updating existing user: {user_data['username']}")
            user.password = hash_password(user_data['password'])
            user.role = user_data['role'] # Ensure role is correct too
            user.email = user_data['email']
        else:
            print(f"Creating new user: {user_data['username']}")
            new_user = User(
                username=user_data['username'],
                password=hash_password(user_data['password']),
                role=user_data['role'],
                email=user_data['email']
            )
            db.session.add(new_user)
    
    db.session.commit()
    print("Passwords reset successfully.")
