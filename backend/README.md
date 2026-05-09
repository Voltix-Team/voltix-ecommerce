# How To Run It 
Step 1 — Go into the backend folder
bash
cd backend

Step 2 — Create your virtual environment
bash
python -m venv venv

Step 3 — Activate it
bash
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
You should see (venv) at the start of your terminal line.

Step 4 — Install dependencies
bash
pip install -r requirements.txt

Step 5 — Create your .env file
Copy the example file:
bash
cp .env.example .env
Then fill in the values — get the real values from Randa privately (do NOT commit your .env to GitHub).

Step 6 — Run migrations
bash
python manage.py migrate

Step 7 — Start the server
bash
python manage.py runserver