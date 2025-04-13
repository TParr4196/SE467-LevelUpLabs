467 starter repo

# Django Backend
This project uses a django backend server to handle the API requests, which will talk to a sqlite database.

## Setting Up Environment:

###  Ensure `pip` and `python` is installed                         <br /> 
- `pip --version`                                                   <br />
- `py --version` or `python --version`                              <br />

### Create the virtural environment
** In the repo's main directory

Windows:                                                            <br />
&nbsp;&nbsp;&nbsp; `py -m venv .venv` or `python -m venv .venv`     <br />
Unix/MacOS:                                                         <br />
&nbsp;&nbsp;&nbsp; `python -m venv .venv`

### Start the virtural environment
Windows:                                                            <br />
&nbsp;&nbsp;&nbsp;    `.venv\Scripts\activate.bat`                  <br />
Unix/MacOS:                                                         <br />
&nbsp;&nbsp;&nbsp;    `source .venv/bin/activate`                   <br />

If the virtural environment has started, you should see something like this in the terminal: <br />
&nbsp;&nbsp;&nbsp; `(.venv.) C:\Users\Your Name> `
<br /> <br />
## Install Django
Windows: 
- `py -m pip install Django`
- `python -m pip install django-cors-headers`

Unix?MacOS:
- `python -m pip install Django`  
- `python -m pip install django-cors-headers`

Verify that Django was installed
- `django-admin --version`

--Install Dependencies--
        TODO

Starting Server:
- Navigate to the `/Backend` folder
- `py manage.py runserver`


# React Frontend