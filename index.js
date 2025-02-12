class Task {
  status;
  constructor(task) {
    this.task = task;
    this.status = "pending";
  }

  markAsDone() {
    this.status = "done";
  }

  markAsPending() {
    this.status = "pending";
  }
}

class TaskList {
  tasks;
  constructor() {
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push(task);
  }

  deleteTask(taskId) {
    this.tasks.splice(taskId, 1);
  }
}

class App {
  constructor() {
    this.taskList = new TaskList();

    this.taskInput = document.querySelector(".task-input");
    this.addBtn = document.querySelector(".add-btn");
    this.taskListContainer = document.querySelector(".task-list-container");

    this.editTaskInput = document.querySelector(".edit-task-input");
    this.okBtn = document.querySelector(".ok-btn");

    this.overlay = document.querySelector(".overlay");
    this.editTaskContainer = document.querySelector(".edit-container");
    this.closeBtn = document.querySelector(".close-icon");

    this.closeIcon = document.querySelector(".close-icon");

    this.clearBtn = document.querySelector(".clear-btn");

    window.addEventListener("keydown", (e) => {
      if (this.overlay.classList.contains("active")) {
        if (e.key === "Escape") this.closeModal();

        document.activeElement.blur();
      }
    });

    this.addBtn.addEventListener("click", () => {
      this.handleAddTask();
    });

    this.clearBtn.addEventListener("click", () => {
      this.taskList.tasks = this.taskList.tasks.filter(
        (task) => task.status === "pending",
      );
      this.render();
    });

    this.overlay.addEventListener("click", (e) => {
      if (e.target === this.overlay) {
        this.closeModal();
      }
    });

    this.closeBtn.addEventListener("click", () => {
      this.closeModal();
    });

    this.okBtn.addEventListener("click", () => {
      const taskId = this.editTaskContainer.dataset.editId;
      this.handleEditTask(taskId);
      this.closeModal();
      this.render();
    });

    this.taskInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.handleAddTask();
      }
    });

    this.editTaskInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const taskId = this.editTaskContainer.dataset.editId;
        this.handleEditTask(taskId);
        this.closeModal();
        this.render();
      }
    });

    this.taskListContainer.addEventListener("click", (e) => {
      const target = e.target;
      if (!target.classList.contains("buttons-container-btn")) return;

      const taskContainer = target.closest(".task-container");
      const taskId = taskContainer.dataset.taskId;
      const task = this.taskList.tasks[taskId];

      if (target.classList.contains("toggle-btn")) {
        this.toggleTask(task);
      } else if (target.classList.contains("delete-btn")) {
        this.handleDeleteTask(task);
      } else if (target.classList.contains("edit-btn")) {
        this.openModal();
        this.editTaskInput.value = task.task;
        this.editTaskContainer.dataset.editId = taskId;
      }
    });

    this.render();
  }

  handleAddTask() {
    const taskInputValue = this.taskInput.value;
    if (!taskInputValue.trim()) return;

    const text =
      taskInputValue.trim()[0].toUpperCase() + taskInputValue.slice(1);

    this.taskList.addTask(new Task(text));
    this.taskInput.value = "";
    this.render();
  }

  toggleTask(task) {
    if (task.status === "pending") {
      task.markAsDone();
    } else {
      task.markAsPending();
    }

    this.render();
  }

  handleDeleteTask(taskId) {
    this.taskList.deleteTask(taskId);

    this.render();
  }

  handleEditTask(taskId) {
    const editTaskInputValue = this.editTaskInput.value;
    if (!editTaskInputValue.trim()) return;

    const editedText =
      editTaskInputValue.trim()[0].toUpperCase() + editTaskInputValue.slice(1);

    this.taskList.tasks[taskId].task = editedText;
  }

  closeModal() {
    this.overlay.classList.remove("active");
    this.editTaskContainer.classList.remove("active");
    this.closeIcon.classList.remove("active");
  }

  openModal() {
    this.overlay.classList.add("active");
    this.editTaskContainer.classList.add("active");
    this.closeIcon.classList.add("active");
  }

  render() {
    this.taskListContainer.innerHTML = "";

    if (this.taskList.tasks.length === 0) return;

    this.taskList.tasks.forEach((task, i) => {
      // const HTML = `
      //             <div class="task-container ${task.status === "done" ? "completed" : ""}" data-task-id="${i}">
      //               <p class="task-paragraph">${task.task}</p>
      //               <div class="buttons-container">
      //                 <button class="buttons-container-btn toggle-btn">Toggle</button>
      //                 <button class="buttons-container-btn edit-btn">Edit</button>
      //                 <button class="buttons-container-btn delete-btn">Delete</button>
      //               </div>
      //             </div>`;
      //
      // this.taskListContainer.insertAdjacentHTML("afterbegin", HTML);

      const taskDiv = document.createElement("div");
      taskDiv.classList.add("task-container");
      if (task.status === "done") taskDiv.classList.add("completed");
      taskDiv.dataset.taskId = i;

      const taskParagraph = document.createElement("p");
      taskParagraph.classList.add("task-paragraph");

      if (task.task.length > 25)
        taskParagraph.textContent = task.task.slice(0, 22) + "...";
      else taskParagraph.textContent = task.task;

      taskParagraph.title = task.task;

      taskDiv.appendChild(taskParagraph);

      const btnDiv = document.createElement("div");
      btnDiv.classList.add("buttons-container");

      const btnTexts = ["Toggle", "Edit", "Delete"];

      btnTexts.forEach((text) => {
        const btn = document.createElement("button");
        btn.textContent = text;

        btn.classList.add("buttons-container-btn");

        if (btn.textContent === "Toggle") btn.classList.add("toggle-btn");
        else if (btn.textContent === "Edit") btn.classList.add("edit-btn");
        else if (btn.textContent === "Delete") btn.classList.add("delete-btn");

        btnDiv.appendChild(btn);
      });

      taskDiv.append(btnDiv);

      this.taskListContainer.append(taskDiv);
    });
  }
}

new App();
