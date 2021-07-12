import '../css/index.scss';

document.addEventListener("DOMContentLoaded", () => {
    contentFetcher.getContent("http://localhost:4000/api/tasks");
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
            document.body.innerHTML = "";
            let taskList = document.createElement("ul");

            JSON.parse(data).map((task) => {
                console.log(task);
                let listItem = document.createElement("li");
                listItem.innerHTML = "<label><input type='checkbox'" + (task.isDone === "1" ? "checked='checked'" : "") + " /><span>" + task.title + "</span></label>";
                taskList.appendChild(listItem);
            });

            document.body.appendChild(taskList);
        });
    },

    error: (message) => {

    }
}

// 2 GET the list of Tasks from / api / task and render tasks to the page
// 3 Order each task using the importance property(0 = high, 1 = medium, 2 = low) and split into two lists based on the isDone property(0 - no done, 1 - done).Your prototype must be similar to the supplied wireframe sketch. 
// 4 Your prototype should be accessible to WCAG 2.1 AA compliance.Ensure that your UI is accessible and ensure further features added in tasks are accessible. 
// 5 Add mechanism to create new tasks with title and importance level(values 0, 1, or 2) that POSTs to / api / task and updates the UI with the task list.Both title and importance are required and should be validated on the client - side
// 6 There is an artificial 500ms latency on all GET and POST API requests.Improve the user experience by adding a loading state to the UI
// 7 Implement a mechanism to mark a Task as done on the UI and PATCH / api / task / <task.id> so a change to the isDone property of a task persists on page reload. The complete task should go into a separate list as suggested in the wireframe sketch
// 8 Add a control to allow a user to delete a Task, making a DELETE request to /api/task/<task.id> and updating the UI
// 9 Implement a mechanism to edit a task that allows a user to change the label and importance by PATCHing /api/task/<task.id>