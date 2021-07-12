import '../css/index.scss';

document.addEventListener("DOMContentLoaded", () => {
    document.body.innerHTML = "<p aria-busy='true'>Loading tasks - please wait...</p>";

    contentFetcher.getContent("http://localhost:4000/api/tasks")
        .then(() => {
            contentFetcher.enableDone();
        })
        .then(() => {
            newTask.getForm("http://localhost:4000/api/tasks");
        });
});

let contentFetcher = {
    getContent: async (url) => {
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
                        listItem.innerHTML = "<form method='post' action='" + url + "/" + task.id + "'><label><input type='checkbox'" + (task.isDone === "1" ? "checked='checked'" : "") + " name='isDone' /><span>" + task.title + " " + task.importance + "</span></label></form>";
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
                contentFetcher.error(error);
            });
    },

    enableDone: () => {
        let taskLists = document.querySelectorAll("#todoList form,#doneList form");

        [].forEach.call(taskLists, (form) => {
            let field = form.querySelector("input[type='checkbox']");

            field.addEventListener("change", (e) => {
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
                        contentFetcher.getContent("http://localhost:4000/api/tasks")
                            .then(() => {
                                contentFetcher.enableDone();
                            })
                            .then(() => {
                                newTask.getForm("http://localhost:4000/api/tasks");
                            });
                    }
                    return Promise.reject(response);
                })

                .catch((error) => {
                    field.removeAttribute("disabled");
                    contentFetcher.getContent("http://localhost:4000/api/tasks")
                        .then(() => {
                            contentFetcher.enableDone();
                        })
                        .then(() => {
                            newTask.getForm("http://localhost:4000/api/tasks")
                        });
                    console.warn(error);
                });
            });
        });
    },

    error: (message) => {
        let errorMessage = "There was an error retrieving the tasks - please try reloading the page.If the error persists, please try again later or contact the site owner if possible.";
        document.body.innerHTML = "<p>" + errorMessage + "</p>";
        console.warn(message);
    }
};

let newTask = {
    getForm: (action) => {
        let newTask = document.createElement("li");
        newTask.innerHTML = "<form method='post' action='" + action + "' id='newTask'>+<input type='text' name='title' placeholder='Title' id='title' required='required' aria-required='true' title='New task title' value=''  /><input type='number' name='importance' placeholder='Importance' id='importance' required='required' aria-required='true' step='1' min='0' max='2' value='' /><input type='submit' value='Create' title='New task importance' /></form>";

        let taskList = document.getElementById("todoList");
        taskList.append(newTask);

        newTask.querySelector("form").addEventListener("submit", (e) => {
            if (e.target.id === "newTask") {

                let form = e.target,
                    fields = e.target.querySelectorAll('input'),
                    data = new FormData(form),
                    formObj = Object.fromEntries(data);

                [].forEach.call(fields, (field) => {
                    field.setAttribute("disabled", "disabled");
                });

                fetch(action, {
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
            e.preventDefault();
        });
    }
}