import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'default-secret-key-change-in-production'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Database Configuration
    # Default to SQLite for dev, allow override for Prod (PostgreSQL)
    database_url = os.environ.get('DATABASE_URL')
    if database_url and database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
        
    SQLALCHEMY_DATABASE_URI = database_url or 'sqlite:///inventrobil.db'
    
    # Admin Defaults for First Run
    ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'owner')
    ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'owner123')
    
    # Session
    SESSION_TYPE = 'filesystem'
    PERMANENT_SESSION_LIFETIME = 28800  # 8 hours
