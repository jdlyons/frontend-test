import '../css/index.scss';

document.addEventListener("DOMContentLoaded", () => {
    document.body.innerHTML = "";

    contentFetcher.getContent("http://localhost:4000/api/tasks")
        .then(() => {
            newTask.getForm("http://localhost:4000/api/tasks");
        });
});

let contentFetcher = {
    getContent: async (url) => {
        let errorMessage = "There was an error retrieving the request - please try again.";

        await fetch(url, {
            method: "get"
        })

            .then((response) => {
                if (!response.ok) {
                    contentFetcher.error(errorMessage);
                    throw Error(response.statusText);
                }

                return response.text();
            })

            .then((data) => {
                let taskList = document.createElement("ul");
                taskList.id = "tasks"

                JSON.parse(data)
                    .sort((a, b) => {
                        if (a.importance < b.importance) {
                            return -1;
                        }
                    })
                    .map((task) => {
                        let listItem = document.createElement("li");
                        listItem.innerHTML = "<label><input type='checkbox'" + (task.isDone === "1" ? "checked='checked'" : "") + " /><span>" + task.title + "</span></label>";
                        taskList.appendChild(listItem);
                    });

                document.body.appendChild(taskList);
            });
    },

    error: (message) => {
        document.body.innerHTML = "<p>There was an error retrieving the tasks - please try reloading the page.</p><p>If the error persists, please try again later or contact the site owner if possible.</p>";
        console.warn(message);
    }
};

let newTask = {
    getForm: (action) => {
        let newTask = document.createElement("li");
        newTask.innerHTML = "<form method='post' action='" + action + "' id='newTask'>+<input type='text' name='title' placeholder='Title' id='title' required='required' title='New task title' value='' /><input type='number' name='importance' placeholder='Importance' id='importance' required='required' step='1' min='0' max='2' value='' /><input type='submit' value='Create' title='New task importance' /></form>";

        let taskList = document.getElementById("tasks");
        taskList.append(newTask);

        document.addEventListener("submit", (e) => {
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
                        field.removeAttribute("disabled", "disabled");
                    });
                    window.location.reload();
                    console.warn(error);
                });
            }
            e.preventDefault();
        });
    }
}