from pathlib import Path       # used to build file system paths in a cross-platform way
from datetime import timedelta  # used to set JWT token expiry durations
import os                       # used to read environment variables
from dotenv import load_dotenv  # used to load variables from the .env file into os.environ

# This reads the .env file and makes all variables inside it available via os.getenv()
load_dotenv()

# BASE_DIR points to the backend/ folder (the parent of the voltix/ folder)
# We use this to build paths to other files like db.sqlite3
BASE_DIR = Path(__file__).resolve().parent.parent


# ── Security ──────────────────────────────────────────────────────────────────

# SECRET_KEY is used by Django to sign cookies, tokens, and sessions
# We never hardcode it — we read it from the .env file
SECRET_KEY = os.getenv('SECRET_KEY')

# DEBUG=True shows detailed error pages — only for development, never in production
DEBUG = os.getenv('DEBUG', 'False') == 'True'

# ALLOWED_HOSTS lists which domain names are allowed to access this server
# In dev: localhost and 127.0.0.1. In production: your actual domain
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')


# ── Apps ──────────────────────────────────────────────────────────────────────

# Every app that Django should know about must be listed here
INSTALLED_APPS = [
    # Django's built-in apps — admin panel, auth system, database, sessions, etc. 
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # djangorestframework — gives us APIView, serializers, response formatting
    'rest_framework',

    # simplejwt — handles JWT token generation, validation, and refresh
    'rest_framework_simplejwt',

    # token_blacklist — allows us to invalidate (blacklist) tokens on logout
    'rest_framework_simplejwt.token_blacklist',

    # corsheaders — allows the React frontend (different port) to call our API
    'corsheaders',

    # cloudinary — connects Django to Cloudinary for image hosting
    'cloudinary',

    # cloudinary_storage — makes Django use Cloudinary as the file storage backend
    'cloudinary_storage',

    # Our own apps — each one handles one feature of the system
    'users',      # authentication and user profiles
    'products',   # product catalog
    'cart',       # shopping cart
    'wishlist',   # wishlist
    'orders',     # order placement and history
    'reviews',    # product reviews
]


# ── Middleware ────────────────────────────────────────────────────────────────

# Middleware runs on every request and response, in order from top to bottom
MIDDLEWARE = [
    # CorsMiddleware MUST be first so it can add CORS headers before anything else runs
    'corsheaders.middleware.CorsMiddleware',

    # SecurityMiddleware adds HTTP security headers (e.g. HTTPS redirect in production)
    'django.middleware.security.SecurityMiddleware',

    # SessionMiddleware enables session support (needed for admin panel)
    'django.contrib.sessions.middleware.SessionMiddleware',

    # CommonMiddleware handles URL normalization (e.g. adds trailing slash)
    'django.middleware.common.CommonMiddleware',

    # CsrfViewMiddleware protects against Cross-Site Request Forgery attacks
    'django.middleware.csrf.CsrfViewMiddleware',

    # AuthenticationMiddleware attaches the logged-in user to every request object
    'django.contrib.auth.middleware.AuthenticationMiddleware',

    # MessageMiddleware enables Django's flash messages system
    'django.contrib.messages.middleware.MessageMiddleware',

    # XFrameOptionsMiddleware prevents the site from being embedded in iframes (clickjacking)
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Tells Django where the root URL configuration file is
ROOT_URLCONF = 'voltix.urls'


# ── Templates ─────────────────────────────────────────────────────────────────

# Django's template engine config — needed for the admin panel to render HTML
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],        # no custom template directories
        'APP_DIRS': True,  # look for templates inside each app's /templates/ folder
        'OPTIONS': {
            'context_processors': [
                # These inject variables (request, user, messages) into every template
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Tells Django which WSGI app to use when serving the project
WSGI_APPLICATION = 'voltix.wsgi.application'


# ── Database ──────────────────────────────────────────────────────────────────

# We use SQLite for development — it's a single file, no setup needed
# In production this would be replaced with PostgreSQL or MySQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',  # file lives at backend/db.sqlite3
    }
}


# ── Auth ──────────────────────────────────────────────────────────────────────

# Tell Django to use our custom User model instead of its built-in one
# This must be set BEFORE running the first migration — cannot change it after
AUTH_USER_MODEL = 'users.User'

# Password validation rules — Django enforces these on signup and password change
AUTH_PASSWORD_VALIDATORS = [
    # Password cannot be too similar to the username or email
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    # Password must be at least 8 characters
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    # Password cannot be a commonly used password (e.g. "password123")
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    # Password cannot be entirely numeric
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# ── DRF (Django REST Framework) ───────────────────────────────────────────────

REST_FRAMEWORK = {
    # Every API request must include a valid JWT Bearer token to be authenticated
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),

    # By default, all endpoints require the user to be logged in
    # Individual views can override this with AllowAny for public endpoints
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),

    # Always return JSON responses (not browsable HTML API in production)
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
}


# ── JWT Configuration ─────────────────────────────────────────────────────────

SIMPLE_JWT = {
    # Access token expires after 1 day — used for API requests
    'ACCESS_TOKEN_LIFETIME':  timedelta(days=1),

    # Refresh token expires after 7 days — used to get a new access token
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),

    # When the refresh token is used, a new one is issued automatically
    'ROTATE_REFRESH_TOKENS':  True,

    # The old refresh token is blacklisted after rotation so it can't be reused
    'BLACKLIST_AFTER_ROTATION': True,

    # Tokens are sent in the Authorization header as: Bearer <token>
    'AUTH_HEADER_TYPES': ('Bearer',),
}


# ── CORS ──────────────────────────────────────────────────────────────────────

# List of origins (frontend URLs) that are allowed to make API requests
# React runs on localhost:3000 during development
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',')

# Allow the frontend to send cookies (needed for refresh token in httpOnly cookie)
CORS_ALLOW_CREDENTIALS = True


# ── Cloudinary ────────────────────────────────────────────────────────────────

# Credentials for our Cloudinary account — all read from .env
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.getenv('CLOUDINARY_CLOUD_NAME'),
    'API_KEY':    os.getenv('CLOUDINARY_API_KEY'),
    'API_SECRET': os.getenv('CLOUDINARY_API_SECRET'),
}

# Tell Django to use Cloudinary instead of local disk for all uploaded files (ImageField)
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'


# ── Email ─────────────────────────────────────────────────────────────────────

# — Email Configuration ——————————————————————————————————————————————————————
# — Email Configuration ——————————————————————————————————————————————————————

# We use the standard SMTP backend to send real emails via Brevo
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# Brevo SMTP server address
EMAIL_HOST = os.getenv('EMAIL_HOST')

# Port 587 is the standard for SMTP with TLS/STARTTLS
# We use int() because the port must be a number, not a string
EMAIL_PORT = int(os.getenv('EMAIL_PORT', 587))

# TLS encrypts the connection to the Brevo server (STARTTLS on port 587)
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True') == 'True'

# SSL is the alternative wrapper used on port 465 — exactly one of TLS/SSL must be True
EMAIL_USE_SSL = os.getenv('EMAIL_USE_SSL', 'False') == 'True'

# Your Brevo login email (the ID from image_8736f1.png)
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')

# Your Brevo SMTP Key (the password from image_8736f1.png)
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')

# The "From" name and address shown in the user's inbox
DEFAULT_FROM_EMAIL = f"Voltix Shop <{EMAIL_HOST_USER}>"

# ── Internationalisation ──────────────────────────────────────────────────────

LANGUAGE_CODE = 'en-us'   # default language
TIME_ZONE     = 'UTC'     # all datetimes stored in UTC
USE_I18N      = True      # enable Django's translation system
USE_TZ        = True      # make Django timezone-aware (store UTC in DB)


# ── Static & Media ────────────────────────────────────────────────────────────

# URL prefix for static files (CSS, JS for admin panel)
STATIC_URL = '/static/'

# URL prefix for media files (uploaded images) — Cloudinary handles actual storage
MEDIA_URL  = '/media/'

# Default primary key type for all models — BigAutoField = 64-bit integer ID
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'