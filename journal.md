# STEPS IN CREATING FULLSTACK

- npm init -y
- npm install express cors sqlite3

# BACKEND

## Database Connection
1. create database.js
2. require sqlite3
2.5. create variable for database file name (for ex. myDB.db)
3. create new instance of db by creating a variable and storing it in `new sqlite3.Database(database, (err) => {})`
    3.5 validate if there is an error, if there is log it
4. create a variable 'initDB', store arrow function for creating tables
5. inside is db.serialize(() => {})
6. create the query for CREATING `'CREATE TABLE IF NOT EXISTS myTable'`
    6.5 search for sqlite3 syntax like INTEGER etc
    6.6 FOREIGN KEY (patient_id) REFERENCES patients (id) ON DELETE CASCADE
7. create db.run(query, (err) => {})
8. export the db variable and initDB function

## App Shell
1. require express
2. require cors
3. require the database connection file { db, initDB }
4. create variable for PORT
5. create app = express()
6. middlewares: use .json()
7. middlewares: use cors()
8. call out initDB function
9. create app.listen to create server `console.log(`The port is listening at http://localhost:${PORT} ...`)`
10. create app.get(req, res) for client

## Making controller
1. create controllers folder
2. create a {table}Controllers js file

## POST METHOD in Patient Controller
1. require db instance in the database.js({ db } = require(database))
2. create variable `createSomething` (req, res) => {}
3. store the columns provided by the client (for ex. 'name', 'age') from req.body
4. create query for `INSERT FROM table () VALUES (?, ?)` and create params from columns
5. db.run(query, params, function(err)) kasi need sa `this.lastID`
6. check if may error if wala meron return mo 500 tas return mo lang yung nasa req.body kasama ID
7. module.exports = { createSomething }

## GET METHOD in Patient Controller
1. require db instance in the database.js
2. create variable `getSomething` (req, res) => {}
3. store the id given by the client from req.params
4. create query for `SELECT * FROM table WHERE id = ?` and create params from columns
5. db.get(query, params, (err, row) => {})
6. check if may error, send 500
7. check if may na fetch na row, send mo yung row, if wala sendan mo ng 404
8. module.exports

## GET METHOD (all rows) in Patient Controller
1. require db instance in the database.js
2. create variable `getAllSomething` (req, res) => {}
3. create the query `SELECT * FROM table`
4. db.all(query, [], (err, rows) => {}) lagay [] for convention lang
5. check if may error, send 500
6. check if may rows `if(rows)` send mo yung rows
7. module.exports = { } mo lahat 


## PUT METHOD in Patient Controller
1. require db instance in the database.js
2. create variable `updateSomething` (req, res) => {}
3. store the id from req.params
4. store the columns provided by the client (for ex. 'name', 'age') from req.body
5. create query `UPDATE table SET column = COALESCE(?, column) WHERE id = ?`
5.5. create params variable from columns
6. db.run(query, params, function(err) {})
7. check if may error, send 500
8. check if (this.changes > 0) send status 200, status 404 pag hindi kasi mali yung id nyan
9. module.exports then lagay route

## DELETE METHOD in Patient Controller
1. require db instance in the database.js
2. create variable `deleteSomething` (req, res) => {}
3. store the id from req.params
4. create the query `DELETE FROM table WHERE id = ?`
5. create params variable naka array nakalagay id
6. db.run(query, params, function(err) {})
7. check if may error, send 500
8. check if (this.changes > 0) send status 200, status 404 pag hindi kasi mali yung id nyan

## ROUTER ng Patient (router.route('./api/table/').get().post() = if want mo mag one line)
1. create a routes folder
2. create a patients.js inside
3. require express
4. const router = express.Router()
5. require the controller
6. router.post('/', createPatient)
7. router.get('/', getAllPatients)
8. router.put('/:id', updatePatient)
9. router.get('/:id', getPatient)
10. router.delete('/:id', deletePatient)
11. module.exports = router
12. declare a variable in `app.js` requiring the router: somethingRoutes
13. then app.use(`'/api/patients', routerVariable`) as middleware

---

## POST METHOD in Consultations Controller (RELATIONAL DB)
1. require db instance in the database.js
2. create variable `addSomething` (req, res) => {}
3. create variable to store patient_id(foreign key) from req.params
4. create variables to store the columns from req.body
5. validation for the important columns, return 400(human-error) status
6. create the query `INSERT INTO table (column, column) VALUES (?, ?)`
7. store the variables into a new variable `params` array
8. db.run(query, params, function(err){})
9. inside, validate if there is an error, return status 500
10. if none, return all the variables from the params array and status 201
11. module.exports

## GET METHOD in Consultations (all consultations) (RELATIONAL DB)
1. require db instance in the database.js
2. create variable `getAllSomething` (req, res) => {}
3. create variable to store patient_id(foreign key) from req.params
4. create the query `SELECT * FROM consultations WHERE id = ?`
5. store the variable into a new variable `params` array
6. db.all(query, params, function(err, rows){})
7. inside, validate if there is an error, return status 500
8. if none, return all rows, data:rows
9. module.exports

## REGISTER (Auth Controller)
1. require the database store to { db }
2. require bcrypt
3. create register = (req, res) => {}
4. const { username, password } from req.body
5. validate if none 400, they're both required
6. bcrypt.hash(password, 10, (err, hash)) => {}
7. validate error, if there is return 500
8. create query = `INSERT INTO users (username, password_hash) VALUES (?, ?)`
9. create params = [username, hash]
10. db.run(query, params, function(err) {})
11. validate error, if there is return 500
12. then res.status(201)
13. module.exports

## LOGIN (Auth Controller)
1. require the database store to { db }
2. require bcrypt
3. create login = (req, res) => {}
4. const { username, password } from req.body
5. validate if none 400, they're both required
6. create query = `SELECT * FROM users WHERE username = ?`
7. create params = `[username]`
8. db.get(query, params, (err, user) => {})
9. validate error, if there is return 500
10. validate if there is no user, return 401, the username or password must be invalid
11. if user was found, bcrypt.compare(password, user.password_hash, (err, result) => {})
12. validate error, if there is return 500
13. validate if there is result, if there is return 200, login was successful
14. else return 401, invalid username or password

## AUTH (Login) ROUTES
1. require express
2. declare router = express.Router()
3. require loginController
4. router.post('/register', authController.register)
5. router.post('/login', authController.login)
6. module.exports = router
7. add in app.js: app.use('/api/auth', authRoutes);

## LOGIN AUTH API (PUBLIC) Auth
1. export async function loginUser(credentials){}
2. const response = await fetch(api link) {}
3. method is POST, headers are 'Content-Type': 'application/json', then JSON.stringify(credentials)
4. check if response.ok is not true, throw new Error(invalid username or password)
5. store result = await response.json()
6. return result

## LOGIN FORM EVENTLISTENER (PUBLIC) Auth
1. Add an event listener to your login form with submit event
2. create credentials object = {username: usernameInputEl.value, password: passwordInputEl.value}
3. create try {} catch(err) {}
4. inside try, await authApi.loginUser(credentials)
5. sessionStorage.setItem('isLoggedIn', 'true')
6. window.location.href = 'dashboard.html'

## SEARCH A TABLE (CONTROLLER)
1. create a searchSomething variable = (req, res) => {}
2. const searchStr = req.query.name
3. if(!searchStr) return res.status(200).json({success:true,data:[]})
4. const query = `SELECT * FROM patients WHERE name LIKE ?`
5. const params = [`%${searchStr}%`]
6. create db.all(query, params, (err, rows) => {})
7. validate error, if there is return 500
8. outside, res.status(200)
9. add in your patients router: router.get('/search', patientController.searchPatient)

## SEARCH A TABLE (PUBLIC) API
1. export async function searchSomething(searchStr) {}
2. const response = await fetch(`/api/patients/search?name=${encodeURIComponent(searchStr)}`)
3. if(!response.ok) throw new Error('Failed to search')
4. const result = await response.json()
5. if(!result.success) throw new Error(result.data)
6. return result.data

## SEARCH A TABLE (PUBLIC)
1. add an `input` eventlistener to the input box element
2. add an async callback
3. add a try{} catch(err) {}
4. const patients = await patientApi.searchPatients(searchPatientEl.value)
5. if (patients.length === 0) loadPatients, then return
6. renderPatients(data:patients, container:patientListContainer)

---------------------------------------------------------

# FRONTEND (LATEST)

1. Create public folder
2. app.use(express.static('public'))
3. create the files, ex. index.html, style.css, script.js
4. Copy paste this css code
    ```css
    .app-container {
        display: flex;
    }

    .sidebar {
        width: 250px;
        background-color: #fffffe;
        overflow-y: auto;
        height: 100vh;
        padding: 20px;
        display: flex;
        flex-direction: column;
    }

    .sidebar-header {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        margin-bottom: 25px;
        background-color: #f2f6ff;
    }

    .sidebar-logo {
        max-width: 150px;
    }

    .nav-group {
        margin-bottom: 25px;
    }

    .nav-group-title {
        font-size: 0.75rem;
        color: #a2a2a2;
        text-transform: uppercase;
        font-weight: 600;
        padding: 0 15px;
        margin-bottom: 10px;
        display: block;
    }

    .sidebar-nav .nav-link {
        display: flex;
        align-items: center;
        padding: 12px 15px;
        color: #3b3a3a;
        text-decoration: none;
        border-radius: 5px;
        margin-bottom: 5px;
        font-weight: 500;
        transition: all 0.2s ease-in-out;
    }

    .sidebar-nav .nav-link:hover {
        background-color: #f2f6ff;
        color: #9a9898;
    }

    .sidebar-nav .nav-link:active {
        background-color: #e5e8f0;
    }

    .sidebar-nav .nav-link.active {
        background-color: #f2f6ff;
        color: #17cac4;
        font-weight: 600;
    }

    .main-content {
        flex-grow: 1;
        background-color: #f2f6ff;
        height: 100vh;
        overflow-y: auto;
        padding: 15px;
    }

    .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.6);
        align-items: center;
        justify-content: center;
    }

    .modal-content {
        background-color: #fff;
        z-index: 999;
        padding: 25px;
        border-radius: 8px;
        width: 90%;
        max-width: 500px;
        position: relative;
    }

    .close-btn {
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 28px;
        font-weight: bold;
        color: #aaa;
        cursor: pointer;
    }

    .close-btn:hover {
        color: #333;
    }
    ```
5. Copy paste this html code
    ```html
    <div class="app-container">
        <aside class="sidebar">
            <nav class="sidebar-nav">
                <div class="sidebar-header">
                    <img src="assets/logo.png" alt="Task Manager App Logo" class="sidebar-logo">
                </div>
                <div class="nav-group">
                    <span class="nav-group-title">Menu</span>
                    <a href="dashboard.html" class="nav-link active">Dashboard</a>
                </div>
                <div class="nav-group">
                    <a href="settings.html" class="nav-link">Settings</a>
                    <a href="index.html" class="nav-link">Logout</a>
                </div>
            </nav>
        </aside>
        <main class="main-content">
            <header class="main-header">
                <h1 class="main-title">Task Manager App</h1>
                <button id="add-task-btn" class="btn btn-primary">Add New Task</button>
            </header>
        </main>
    </div>

    <div id="add-task-modal" class="modal">
        <div class="modal-content">
            <span class="close-btn" id="close-add-task-modal">&times;</span>
            <form id="add-task-form">
                <div>
                    <label class="small-lbl">Description</label>
                    <input type="text" id="task-description">
                </div>
                
                <div>
                    <label class="small-lbl">Priority</label>
                    <input type="text" id="task-priority">
                </div>

                <div>
                    <label class="small-lbl">Progress</label>
                    <input type="text" id="task-progress">
                </div>

                <div>
                    <label class="small-lbl">Status</label>
                    <input type="text" id="task-status">
                </div>

                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    </div>
    ```
6. add js folder
7. add tasks-api.js and create the export async function fetchSomething()
8. fetch for /api/tasks and store it to response variable (validate.ok)
9. await for response.json (validate.success, throw new error result.data)
10. return result.data
11. SCRIPT script.js: at the top of the file "import * as tasksApi and tasksUI from 'path'"
12. HTML: set the type of the script file to module
13. SCRIPT tasks-api:
    ```js
    export async function fetchTasks() {
        const response = await fetch('/api/tasks')
        if(!response.ok) {
            throw new Error('Error fetching tasks')
        }

        const result = await response.json()
        if(!result.success) {
            throw new Error(result.data)
        }

        return result.data
    }
    ```
14. SCRIPT tasks-ui:
    ```js
    export const renderTasks = (tasks, divContainer) => {
        divContainer.innerHTML = ``

        if(tasks.length === 0) {
            divContainer.innerHTML = `<p style="text-align:center;">No tasks found.</p>`
            return 
        }

        const table = document.createElement('table')
        table.className = 'table tasks'
        table.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Description</th>
                    <th>Priority</th>
                    <th>Progress</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody></tbody>
        `
        const tbody = table.querySelector('tbody')

        tasks.forEach(task => {
            const row = document.createElement('tr')
            row.className = 'task-item'
            row.dataset.id = task.id

            row.innerHTML = `
                <td>${task.id}</td>
                <td>${task.description}</td>
                <td>${task.priority}</td>
                <td>${task.progress}</td>
                <td>${task.status}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn edit-btn">Edit</button>
                        <button class="btn done-btn">Done</button>
                        <button class="btn delete-btn">Delete</button>
                    </div>
                </td>
            `

            tbody.appendChild(row)
        });
        
        divContainer.appendChild(table)
        console.log(divContainer)
    }
    ```
15. SCRIPT scriptjs: fetch the container for the table
16. SCRIPT scriptjs: create loadSomething function, GREAT now you can load your data
    ```js
    async function loadTasks() {
        try {
            const tasks = await tasksApi.fetchTasks()
            renderTasks(tasks, taskListContainer)
        } catch(err) {
            console.error(err)
        }
    }
    ```
17. Change the architecture, we will have one file that is about API, and UI
18. SCRIPT: In adding data, add event listener to your form
    ```js
    if(addTaskForm) {
            addTaskForm.addEventListener('submit', async (e) => {
                e.preventDefault()

                const taskInfo = {
                    description: document.querySelector('#task-description').value,
                    priority: document.querySelector('#task-priority').value,
                    progress: document.querySelector('#task-progress').value,
                    status: document.querySelector('#task-status').value
                }

                try {
                    await api.createTask(taskInfo)
                    alert('Added task successfully')
                    closeModal(addTaskModal)
                } catch(err) {
                    console.error(err)
                }

                loadTasks()
            })
        }
    ```
19. SCRIPT: Add event listener to your add task button and close modal button
    ```js
    if(addTaskBtn) {
        addTaskBtn.addEventListener('click', (e) => {
            e.preventDefault()

            addTaskModal.style.display = 'flex'
        })

        closeAddTaskModal.addEventListener('click', (e) => {
            e.preventDefault()

            closeModal(addTaskModal)
        })
    }

    const closeModal = (modal) => {
        modal.style.display = 'none'
    }
    ```
20. SCRIPT: Add event listener to the wrapper of your table, for DELETING
    ```js
    if(taskListContainer) {
        taskListContainer.addEventListener('click', async (e) => {
            e.preventDefault()

            const target = e.target
            const taskItem = target.closest('.task-item');
            if (!taskItem) return;

            const taskID = taskItem.dataset.id

            // for delete
            if(target.classList.contains('delete-btn')) {
                if(confirm('Are you sure you want to delete this task?')) {
                    try {
                        await api.deleteTask(taskID)
                        loadTasks()
                    } catch(err) {
                        console.error(err)
                    }
                }
            }

            // for done
            // for edit
        })
    }
    ```
21. 
---------------------------------------------------------

# FRONTEND (OLD)

1. Create public folder
2. app.use(express.static('public'))
3. create the files, ex. index.html, style.css, script.js
4. HTML: An outer `<div class="app-container">` was created to hold the two main sections: `<aside class="sidebar">` for navigation and `<main class="main-content">` for everything else.
    ```html
    <div class="app-container">
        <aside class="sidebar">
            <nav class="sidebar-nav">
                <div class="sidebar-header">
                    <img src="assets/hp-logo.png" alt="Hi-Precision Logo" class="sidebar-logo">
                </div>
                <div class="nav-group">
                    <span class="nav-group-title">Menu</span>
                    <a href="#" class="nav-link">Dashboard</a>
                    <a href="#" class="nav-link active">Patients</a>
                </div>
                <div class="nav-group">
                    <span class="nav-group-title">System</span>
                    <a href="#" class="nav-link">Settings</a>
                    <a href="index.html" class="nav-link">Logout</a>
                </div>
            </nav>
        </aside>
        <main class="main-content">
            <header class="main-header">
                <h1 class="main-title">Patient Records</h1>
                <button id="add-patient-btn" class="btn btn-primary">Add New Patient</button>
            </header>
        </main>
    </div>
    ```
5. CSS: The magic happens with Flexbox.
    ```css
    .app-container {
        display: flex; /* Arranges sidebar and main content side-by-side */
    }
    .sidebar {
        width: 250px;
        background-color: #fffffe;
        overflow-y: auto;
        height: 100vh;
        padding: 20px;
        display: flex;
        flex-direction: column;
    }
    .main-content {
        flex-grow: 1;
        background-color: #f2f6ff;
        height: 100vh;
        overflow-y: auto;
    }
    ```
6. then append this for .sidebar style:
    ```css
    .sidebar-header {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        margin-bottom: 25px;
        background-color: #f2f6ff;
    }

    .sidebar-logo {
        max-width: 150px;
    }

    .nav-group {
        margin-bottom: 25px;
    }

    .nav-group-title {
        font-size: 0.75rem;
        color: #a2a2a2;
        text-transform: uppercase;
        font-weight: 600;
        padding: 0 15px;
        margin-bottom: 10px;
        display: block;
    }

    .sidebar-nav .nav-link {
        display: flex;
        align-items: center;
        padding: 12px 15px;
        color: #3b3a3a;
        text-decoration: none;
        border-radius: 5px;
        margin-bottom: 5px;
        font-weight: 500;
        transition: all 0.2s ease-in-out;
    }

    .sidebar-nav .nav-link:hover {
        background-color: #f2f6ff;
        color: #9a9898;
    }

    .sidebar-nav .nav-link:active {
        background-color: #e5e8f0;
    }

    .sidebar-nav .nav-link.active {
        background-color: #f2f6ff;
        color: #17cac4;
        font-weight: 600;
    }
    ```
7. HTML: The forms (add-patient-form, add-consultation-form) were wrapped inside a standard modal structure. They were moved to the bottom of the `<body>`, outside the .app-container, because they are independent overlays.
    ```html
    <div id="add-patient-modal" class="modal">
        <div class="modal-content">
            <span class="close-btn" id="close-add-patient-modal">&times;</span>
            <!-- Modal Header, Body, and Form go here -->
        </div>
    </div>
    ```
8. CSS: The modal's styling is key to its function.
    ```css
    .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.6);
        align-items: center;
        justify-content: center;
    }

    .modal-content {
        background-color: #fff;
        z-index: 999;
        padding: 25px;
        border-radius: 8px;
        width: 90%;
        max-width: 500px;
        position: relative;
    }

    .close-btn {
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 28px;
        font-weight: bold;
        color: #aaa;
        cursor: pointer;
    }

    .close-btn:hover {
        color: #333;
    }
    ```
9. JS: is used to toggle the modal's visibility. It changes the display property from none to flex.
    ```js
    const addPatientModal = document.querySelector('#add-patient-modal');
    const addPatientBtn = document.querySelector('#add-patient-btn');
    const closeModalBtn = document.querySelector('#close-add-patient-modal');

    // To OPEN the modal:
    addPatientBtn.addEventListener('click', () => {
        addPatientModal.style.display = "flex"; // "flex" activates the centering styles
    });

    // To CLOSE the modal:
    closeModalBtn.addEventListener('click', () => {
        addPatientModal.style.display = "none";
    });
    ```
10. JS: Add this add patient event listener
    ```js
    if(addPatientForm) {
        addPatientForm.addEventListener('submit', async (event) => {
            event.preventDefault()

            const name = document.querySelector('#patient-name').value
            const dob = document.querySelector('#patient-dob').value
            const address = document.querySelector('#patient-address').value

            try {
                const response = await fetch('/api/patients', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, dob, address })
                })

                const result = await response.json()

                if(result.success) {
                    addPatientForm.reset()
                    fetchPatients()
                } else {
                    alert(`Error adding patient: ${result.data}`)
                }
            } catch(err) {
                console.error(`Failed adding patient: ${err}`)
                alert('A network error occured. Please check your console (CTRL + SHIFT + I).')
            }
        })
    }
    ```

## HAMBURGER (RESPONSIVE TO MOBILE)
1. HTML: A `<button class="hamburger-btn">` was added to the header. It contains three `<span>` elements that act as the lines of the icon.
    ```html
    <button class="hamburger-btn" id="hamburger-btn">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
    </button>
    ```
2. CSS (Media Queries): Media queries are used to apply styles only when the screen is below a certain width (e.g., 768px).
    ```css
    .main-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        background-color: #fff;
        border-bottom: 1px solid #eee;
    }

    .hamburger-btn {
        display: none;
        flex-direction: column;
        justify-content: space-around;
        width: 30px;
        height: 25px;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
    }

    .hamburger-line {
        width: 30px;
        height: 3px;
        background-color: #333;
        border-radius: 5px;
    }

    
    @media (max-width: 991px) {
        .consultation-wrapper {
            flex-direction: column;
            height: auto; /* Let content height be natural */
        }

        /* Add a separator line on mobile */
        .consultation-form-section {
            padding-bottom: 25px;
            margin-bottom: 25px;
            border-bottom: 1px solid #eee;
        }

        /* Remove desktop-only styles */
        .consultation-list-section {
            border-left: none;
            padding-left: 0;
        }

        /* --- GENERAL MOBILE STYLES --- */
        @media (max-width: 768px) {
            body.sidebar-open::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1999;
            }
            .sidebar {
                position: fixed;
                top: 0;
                left: 0;
                z-index: 2000;
                transform: translateX(-100%);
                transition: transform 0.3s ease-in-out;
            }
            .sidebar.show {
                transform: translateX(0);
            }
            .main-content {
                margin-left: 0;
            }
            .hamburger-btn {
                display: flex;
            }
            .modal-content {
                margin: 5% auto;
                width: 95%;
            }
        }
    }
    ```
3. JS: adds and removes the .show class to the sidebar when the hamburger button is clicked, triggering the CSS transition.
    ```js
    const sidebar = document.querySelector(".sidebar");
    const hamburgerBtn = document.querySelector("#hamburger-btn");
    const body = document.body;

    hamburgerBtn.addEventListener('click', (event) => {
        event.stopPropagation(); 
        
        sidebar.classList.toggle('show');
        body.classList.toggle('sidebar-open');
    });

    body.addEventListener('click', (event) => {
        if (body.classList.contains('sidebar-open')) {
            if (!sidebar.contains(event.target)) {
                sidebar.classList.remove('show');
                body.classList.remove('sidebar-open');
            }
        }
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && body.classList.contains('sidebar-open')) {
            sidebar.classList.remove('show');
            body.classList.remove('sidebar-open');
        }
    });
    ```

## DISPLAYING DATA (NOT UPDATED)
1. HTML: Inside main-container, below `<header>`, paste:
    ```html
    <section class="content-card">
        <div id="patient-list-container">
            <!-- Patient table will be inserted here by JavaScript -->
        </div>
    </section>
    ```
2. JS: Add fetchPatients function
    ```js
    const fetchPatients = async () => {
        try {
            const response = await fetch('/api/patients') // returns a Response promise object that contains response from server
            const result = await response.json() // .json() returns a Promise object that's why we `await`, may success property tsaka nandito yung data
            const resultData = result.data // yung loob ng (json)data na sinesend natin sa API
            if(result.success) {
                patientListContainer.innerHTML = ''

                if(resultData.length === 0) {
                    patientListContainer.innerHTML = `<p>No patients found.</p>`
                } else {
                    const patientsTable = document.createElement('table');
                    patientsTable.className = 'patient-table';
                    patientsTable.innerHTML = `
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Date of Birth</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody></tbody>  <!-- The body is initially empty -->
                    `;
                    const tbody = patientsTable.querySelector('tbody');

                    resultData.forEach(patient => {

                        const row = document.createElement('tr');
                        row.className = 'patient-item'; // Moved from div to tr
                        row.dataset.id = patient.id;
                        
                        row.innerHTML = `
                            <td>${patient.name}</td>
                            <td>${new Date(patient.dob).toLocaleDateString()}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn view-btn">View</button>
                                    <button class="btn delete-btn">Delete</button>
                                </div>
                            </td>
                        `;

                        // NEW CODE
                        tbody.appendChild(row); // Appends the row inside the loop
                    });
                    // After the loop finishes:
                    patientListContainer.appendChild(patientsTable);
                }
            } else {
                patientListContainer.innerHTML = ''
                patientListContainer.innerHTML = `Error fetching patients: ${resultData}`
            }
        } catch (err) {
            console.error(`Failed fetching patients: ${err}`)
            alert('A network error occured. Please check your console (CTRL + SHIFT + I).')
        }
    }
    ```
3. CSS: We applied standard table styling to create a clean, modern look.
    ```css
    .patient-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    }

    .patient-table th, .patient-table td {
        padding: 16px;
        text-align: left;
        border-bottom: 1px solid #eaecf0;
    }

    .patient-table thead th {
        color: #667085;
        font-size: 0.8rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .patient-table tbody tr:last-child td {
        border-bottom: none;
    }

    .patient-table tbody tr:hover {
        background-color: #f9fafb;
    }

    .patient-table th:last-child,
    .patient-table td:last-child {
        text-align: center;
    }

    .action-buttons {
        display: flex;
        justify-content: center;
        gap: 8px;
    }

    .patient-table .btn {
        padding: 4px 12px;
        font-size: 0.8rem;
        font-weight: 500;
        border-radius: 16px;
        border: 1px solid transparent;
    }

    .patient-table .view-btn {
        background-color: #f2f4f7;
        border-color: #d0d5dd;
        color: #344054;
    }
    .patient-table .view-btn:hover {
        background-color: #e4e7ec;
    }

    .patient-table .delete-btn {
        background-color: #fee2e2;
        border-color: #fecaca;
        color: #b91c1c;
    }
    .patient-table .delete-btn:hover {
        background-color: #fecaca;
    }
    ```

## DISPLAYING DATA PT.2 VIA MODAL & CARDS (NOT UPDATED)
1. HTML: Add consultations modal outside app-container
    ```html

    <div id="consultations-modal" class="modal">
        <div class="modal-content modal-lg">
            <div class="modal-header">
                <h2 id="consultation-header" class="modal-title">Consultations for...</h2>
                <span class="close-btn" id="close-consultations-modal">&times;</span>
            </div>

            <div class="modal-body">
                <!-- Section 1: The Form -->
                <div class='consultation-wrapper'>
                    <div class="consultation-form-section">
                        <h3>Add New Consultation</h3>
                        <form id="add-consultation-form">
                            <div class="form-group">
                                <label for="consultation-date">Date</label>
                                <input type="date" id="consultation-date" required>
                            </div>
                            <div class="form-group">
                                <label for="consultation-complaint">Complaint</label>
                                <textarea id="consultation-complaint" placeholder="Patient's chief complaint..." required></textarea>
                            </div>
                            <div class="form-group">
                                <label for="consultation-diagnosis">Diagnosis</label>
                                <input type="text" id="consultation-diagnosis" placeholder="Official diagnosis">
                            </div>
                            <div class="form-group">
                                <label for="consultation-treatment">Treatment</label>
                                <input type="text" id="consultation-treatment" placeholder="Prescription or treatment plan">
                            </div>
                            <button type="submit" class="btn btn-primary form-submit-btn">Add Consultation</button>
                        </form>
                    </div>

                    <!-- Section 2: The History List -->
                    <div class="consultation-list-section">
                        <h3>Patient History</h3>
                        <div id="consultations-list">
                            <!-- Consultation cards will be injected here -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    ```
2. CSS: Paste the form in the consultation-form-section, now add these styles:
    ```css
    
    .modal-content.modal-lg {
        max-width: 900px;
    }

    /* This allows the main modal body to handle scrolling */
    .modal-body {
        padding: 25px;
        flex: 1;
        overflow: hidden; /* Prevents this element from scrolling */
        min-height: 0;
        display: flex;   /* This is the crucial part that was missing */
    }

    /* THIS is the element that should scroll. */
    #consultations-list {
        flex: 1;
        overflow-y: auto; /* The scrollbar goes here! */
        padding-right: 15px;
        min-height: 0;
    }

    .consultation-form-section {
        padding-bottom: 25px; /* Space between form and history */
        margin-bottom: 25px; /* Space between form and history */
        border-bottom: 1px solid #eee; /* Separator line */
    }

    .consultation-list-section {
        flex: 1.2;
        padding-left: 30px;
        border-left: 1px solid #eee;
        
        /* These two lines are essential for the layout to work */
        display: flex;
        flex-direction: column;
    }

    .consultation-wrapper {
        display: flex;
        gap: 30px;
        flex: 1; /* This tells it to fill the space of its parent (.modal-body) */
        min-height: 0; 
    }

    /* The individual consultation cards with a white background */
    .consultation-item {
        background-color: #fff; /* White cards */
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 15px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }

    .consultation-item:last-child {
        margin-bottom: 0; /* Remove margin from the last card */
    }

    .consultation-item p {
        margin-bottom: 8px;
    }

    .consultation-item p strong {
        font-weight: 500;
    }

    #consultations-list::-webkit-scrollbar {
        width: 8px;
    }

    #consultations-list::-webkit-scrollbar-track {
        background: var(--light-gray);
        border-radius: 10px;
    }

    #consultations-list::-webkit-scrollbar-thumb {
        background-color: #c1c1c1;
        border-radius: 10px;
        border: 2px solid var(--light-gray);
    }

    #consultations-list::-webkit-scrollbar-thumb:hover {
        background-color: #a8a8a8;
    }

    @media (max-width: 992px) {
        .consultation-wrapper {
            flex-direction: column;
        }
        .consultation-list-section {
            border-left: none;
            padding-left: 0;
            margin-top: 20px;
            border-top: 1px solid var(--border-color);
            padding-top: 20px;
        }
    }
    ```
3. JS: add these constants in script (consultation modal)
    ```js
    const consultationsModal = document.querySelector('#consultations-modal');
    const consultationHeader = document.querySelector('#consultation-header');
    const consultationList = document.querySelector('#consultations-list');
    const closeConsultationsModalBtn = document.querySelector('#close-consultations-modal');
    const addConsultationForm = document.querySelector('#add-consultation-form');

    // Close Consultations Modal
    if(closeConsultationsModalBtn) {
        closeConsultationsModalBtn.addEventListener('click', () => {
            consultationsModal.style.display = "none";
        });
    }
    ```
4. JS: Add fetchConsultations function
    ```js
    const fetchConsultations = async (patientId, patientName) => {
        currentPatientId = patientId;
        consultationHeader.textContent = `Consultations for ${patientName}`;
        
        try {
            const response = await fetch(`/api/patients/${patientId}/consultations`);
            const result = await response.json();
            const resultData = result.data;

            consultationList.innerHTML = ''; // Clear previous list

            if (result.success) {
                if (resultData.length === 0) {
                    consultationList.innerHTML = `<p>No consultations found for this patient.</p>`;
                } else {
                    resultData.forEach(consult => {
                        const consultItem = document.createElement('div');
                        consultItem.className = 'consultation-item';
                        consultItem.innerHTML = `
                            <p><strong>Date:</strong> ${new Date(consult.consultation_date).toLocaleDateString()}</p>
                            <p><strong>Complaint:</strong> ${consult.complaint}</p>
                            <p><strong>Diagnosis:</strong> ${consult.diagnosis || 'N/A'}</p>
                            <p><strong>Treatment:</strong> ${consult.treatment || 'N/A'}</p>
                        `;
                        consultationList.appendChild(consultItem);
                    });
                }
                // Show the modal AFTER data is fetched and rendered
                consultationsModal.style.display = 'flex';
            } else {
                consultationList.innerHTML = `<p>Error fetching consultations: ${resultData}</p>`;
            }
        } catch (err) {
            console.error(`Failed fetching consultations: ${err}`);
            alert('A network error occurred. Please check your console (CTRL + SHIFT + I).');
        }
    };
    ```
5. JS: Add this patientListContainer (div that wraps the patients table) event listener
    ```js
    if(patientListContainer) {
        patientListContainer.addEventListener('click', async (event) => {
            const target = event.target;
            const patientItem = target.closest('.patient-item'); // pag pinindot mo yung container, hahanapin niya kung anong patientItem pinindot mo
            if (!patientItem) return;

            const patientId = patientItem.dataset.id;

            // DELETE BUTTON
            if (target.classList.contains('delete-btn')) { // classList, ginagawang array yung class names mo
                if (confirm('Are you sure you want to delete this patient and ALL of their records?')) {
                    try {
                        const response = await fetch(`/api/patients/${patientId}`, { method: 'DELETE' });
                        const result = await response.json();
                        if (result.success) {
                            fetchPatients(); // Refresh list
                        } else {
                            alert(`Error deleting patient: ${result.data}`);
                        }
                    } catch (err) {
                        console.error(`Failed to delete patient: ${err}`);
                        alert('A network error occurred.');
                    }
                }
            }

            // VIEW BUTTON
            if (target.classList.contains('view-btn')) {
                const patientName = patientItem.querySelector('td:first-child').textContent;
                fetchConsultations(patientId, patientName);
            }
        });
    }
    ```
6. JS: Add addConsultationForm event handler"
    ```js
    if(addConsultationForm) {
        addConsultationForm.addEventListener('submit', async (event) => {
            event.preventDefault()

            if(!currentPatientId) {
                return alert('Please select a patient first!')
            }

            const complaint = document.querySelector('#consultation-complaint').value
            const diagnosis = document.querySelector('#consultation-diagnosis').value
            const treatment = document.querySelector('#consultation-treatment').value
            const consultation_date = document.querySelector('#consultation-date').value
            
            // tatanggalin yung 'Consultations for ' tas ang natira magiging value ni patientName
            const patientName = consultationHeader.textContent.replace('Consultations for ', '')
            alert('running')
            try {
                const response = await fetch(`/api/patients/${currentPatientId}/consultations`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ complaint, diagnosis, treatment, consultation_date })
                })
                const result = await response.json()

                if(result.success){
                    addConsultationForm.reset()
                    fetchConsultations(currentPatientId, patientName)
                } else {
                    alert(`Error adding consultation: ${result.data}`)
                }
            } catch(err) {
                console.error(`Failed adding consultation: ${err}`)
                alert('A network error occured. Please check your console (CTRL + SHIFT + I).')
            }
        })
    }
    ```










# NOTESSSSSSSSSSSSSSSSS
1. in getting all rows, dont make an else in `if(rows)`, just send the rows even if its empty
2. in form handlers always check if they exists first `if(form){}` before adding eventlisteners to them