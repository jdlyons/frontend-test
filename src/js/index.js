import '../css/index.scss';

document.addEventListener("DOMContentLoaded", () => {
    document.body.innerHTML = "<p aria-busy='true'>Loading tasks - please wait...</p>";

    eventHandlers.attach();

    let tasksApi = "http://localhost:4000/api/tasks";
    taskOperations.getTasks(tasksApi)
        .then(() => {
            taskOperations.getNew(tasksApi);
        });
});

let eventHandlers = {
    attach: () => {
        ["click", "change", "submit"].forEach(event =>
            document.addEventListener(event, (e) => {
                console.log(e);
                if (e.type === "submit" && e.target.id === "newTask") {
                    taskOperations.add(e.target);
                } else if (e.type === "submit" && e.target.classList.contains("delete")) {
                    taskOperations.delete(e.target);
                    e.preventDefault();
                } else if (e.type === "change" && e.target.name === "isDone" && e.target.closest("form").length > 0) {
                    taskOperations.updateStatus(e.target.closest("form"));
                    e.preventDefault();
                }
            }, false)
        );
    }    
};

let taskOperations = {
    getTasks: async (url) => {
        await fetch(url, {
            method: "get"
        })

        .then((response) => {
            if (response.ok) {
                return response.text();
            }
        })

        .then((data) => {
            document.body.innerHTML = "";

            let todoList = document.createElement("ul"),
                doneList = document.createElement("ul");
            todoList.id = "todoList";
            doneList.id = "doneList";

            JSON.parse(data)
                .sort((a, b) => {
                    if (a.importance < b.importance) {
                        return -1;
                    }
                })
                .map((task) => {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = `<form method='post' action='${url}/${task.id}'>
                        <label for='${task.id}-isdone' class='hidden'>Task done?</label>
                        <input type='checkbox'${task.isDone === "1" ? "checked='checked'" : ""} name='isDone' id='${task.id}-isdone' aria-label='Task done status' />
                        <span>${task.title}</span>
                    </form>
                    <form class='delete' method='post' action='${url}/${task.id}'>
                        <input type='submit' class='delete' value='Delete task' />
                    </form>`;

                    if (task.isDone === "1") {
                        doneList.appendChild(listItem);
                    } else {
                        todoList.appendChild(listItem);
                    }
                });

            document.body.appendChild(todoList);
            document.body.appendChild(doneList);
        })

        .catch((error) => {
            taskOperations.error(error);
        });
    },

    error: (message) => {
        let errorMessage = "There was an error retrieving the tasks - please try reloading the page. If the error persists, please try again later or contact the site owner if possible.";
        document.body.innerHTML = `<p>${errorMessage}</p>`;
        console.warn(message);
    },

    delete: async (form) => {
        await fetch(form.action, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        })

        .then((data) => {
            window.location.reload();
        })

        .catch((error) => {
            window.location.reload();
            console.warn(error);
        });
    },

    updateStatus: (form) => {
        let field = form.querySelector("input[name='isDone']");
        field.setAttribute("disabled", "disabled");

        fetch(form.action, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "isDone": field.checked ? 1 : 0 }),
        })

        .then((response) => {
            if (response.ok) {
                field.removeAttribute("disabled");
                taskOperations.getTasks("http://localhost:4000/api/tasks")
                .then(() => {
                    taskOperations.getNew("http://localhost:4000/api/tasks");
                });
            }
            return Promise.reject(response);
        })

        .catch((error) => {
            field.removeAttribute("disabled");
            taskOperations.getTasks("http://localhost:4000/api/tasks")
            .then(() => {
                taskOperations.getNew("http://localhost:4000/api/tasks")
            });
            console.warn(error);
        });
    },

    getNew: (action) => {
        let newTask = document.createElement("li");
        newTask.innerHTML = `<form method='post' action='${action}' id='newTask'>
            + <label for='newtitle' class='hidden'>New task title</label>
            <input type='text' name='title' placeholder='Title' id='newtitle' required='required' title='New task title' title='New task title' aria-label='New task title' value='' />
            <label for='newimportance' class='hidden'>New task importance</label>
            <input type='number' name='importance' placeholder='Importance' id='newimportance' required='required' step='1' min='0' max='2' value='' title='New task importance' aria-label='New task importance' />
            <input type='submit' value='Create' title='New task importance' />
        </form>`;

        let taskList = document.getElementById("todoList");
        taskList.append(newTask);
    },

    add: (form) => {
        let fields = form.querySelectorAll("input:not([type='submit'])"),
            data = new FormData(form),
            formObj = Object.fromEntries(data);

        [].forEach.call(fields, (field) => {
            field.setAttribute("disabled", "disabled");
        });

        fetch(form.action, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formObj),
        })

        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        })

        .then((data) => {
            window.location.reload();
        })

        .catch((error) => {
            [].forEach.call(fields, (field) => {
                field.removeAttribute("disabled");
            });
            window.location.reload();
            console.warn(error);
        });
    }
};