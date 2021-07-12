# Storm ID Frontend Test – A Todo List Prototype

A test API, a build system, and a series of tasks to complete.

## Practicalities

Please make a fork of this project for your work.

Each commit you make should relate to a single task. A complex task may have many commits, this is up to you.

The app can be set up and run via the command line:

| What | How |
|-|-|
| set up (install and db migrations) | `npm i`
| run api and dev server | `npm start` |
| run unit tests | `npm t` |

In the default set up the <b>API runs on http://localhost:4000</b>, the <b>app runs on http://localhost:8080</b>.

We'll ask you to implement features task-by-task, but here is an overview of the API that you'll be building against:

| Action | Endpoint | Description
|-|-|-|
| GET | /api/todo | Get all todo
| GET | /api/todo/<task.id> | Get a todo
| POST | /api/todo | Add a todo
| PATCH | /api/todo/<task.id> | Patch a todo
| DELETE | /api/todo/<task.id> | Delete a todo


This repo includes webpack (https://webpack.js.org/concepts) and includes support for JSX, SCSS (https://sass-lang.com/documentation/file.SASS_REFERENCE.html), and Jest (https://jestjs.io/), <b>but you are free to complete these tasks however you wish, using whatever tools you wish<b>.

## Tasks

| # | Description |
|-|-|
| 1 | ~~Install dependencies, run the app and api, and have a play around~~ |
| 2 | ~~GET the list of Tasks from /api/task and render tasks to the page~~ |
| 3 | Order each task using the importance property (0 = high, 1 = medium, 2 = low) and split into two lists based on the isDone property (0 - no done, 1 - done). Your prototype must be similar to the supplied [wireframe sketch](wireframe/wireframe.svg).
| 4 | Your prototype should be accessible to WCAG 2.1 AA compliance. Ensure that your UI is accessible and ensure further features added in tasks are accessible.
| 5 | Add mechanism to create new tasks with title and importance level (values 0, 1, or 2) that POSTs to /api/task and updates the UI with the task list. Both title and importance are required and should be validated on the client-side |
| 6 |  There is an artificial 500ms latency on all GET and POST API requests. Improve the user experience by adding a loading state to the UI |
| 7 | Implement a mechanism to mark a Task as done on the UI and PATCH /api/task/<task.id> so a change to the isDone property of a task persists on page reload. The complete task should go into a separate list as suggested in the [wireframe sketch](wireframe/wireframe.svg) |
| 8 | Add a control to allow a user to delete a Task, making a DELETE request to /api/task/<task.id> and updating the UI |
| 9 | Implement a mechanism to edit a task that allows a user to change the label and importance by PATCHing /api/task/<task.id> |
