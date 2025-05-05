467 starter repo

# Django Backend

This project uses a django backend server to handle the API requests, which will talk to a sqlite database.

## Setting Up Environment:

### Ensure `pip` and `python` is installed <br />

- `pip --version` <br />
- `py --version` or `python --version` <br />

### Create the virtural environment

\*\* In the repo's main directory

Windows: <br />
&nbsp;&nbsp;&nbsp; `py -m venv .venv` or `python -m venv .venv` <br />
Unix/MacOS: <br />
&nbsp;&nbsp;&nbsp; `python -m venv .venv`

### Start the virtural environment

Windows: <br />
&nbsp;&nbsp;&nbsp; `.venv\Scripts\activate` <br />
Unix/MacOS: <br />
&nbsp;&nbsp;&nbsp; `source .venv/bin/activate` <br />

If the virtural environment has started, you should see something like this in the terminal: <br />
&nbsp;&nbsp;&nbsp; `(.venv.) C:\Users\Your Name> `
<br /> <br />

## Install Django

`pip install -r requirements.txt`

Verify that Django was installed

- `django-admin --version`

--Install Dependencies--

npm install react-native-paper react-native-vector-icons


Starting Server:

- Navigate to the `/Backend` folder
- `py manage.py runserver`

# React Frontend
- From `/Turbine`
- `npx expo start`