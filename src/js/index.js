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

    }
}