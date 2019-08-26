class Task {
  constructor(name, item, amount) {
    this.name = name;
    this.item = item;
    this.amount = amount;
  }
}

class UI {
  addTaskToList(task) {
    const list = document.getElementById("task-list");
    // Create tr element
    const row = document.createElement("tr");
    // Insert cols
    row.innerHTML = `
      <td>${task.name}</td>
      <td>${task.item}</td>
      <td>${task.amount}</td>
      <td><a href="#" class="delete">X<a></td>
    `;

    list.appendChild(row);
  }

  showAlert(message, className) {
    // Create div
    const div = document.createElement("div");
    // Add classes
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get parent
    const container = document.querySelector(".container");
    // Get form
    const form = document.querySelector("#task-form");
    // Insert alert
    container.insertBefore(div, form);

    // Timeout after 3 sec
    setTimeout(function() {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  deleteTask(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById("name").value = "";
    document.getElementById("item").value = "";
    document.getElementById("amount").value = "";
  }
}

// Local Storage Class
class Store {
  static getTasks() {
    let tasks;
    if (localStorage.getItem("tasks") === null) {
      tasks = [];
    } else {
      tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    return tasks;
  }

  static displayTasks() {
    const tasks = Store.getTasks();

    tasks.forEach(function(task) {
      const ui = new UI();

      // Add new task to ui
      ui.addTaskToList(task);
    });
  }

  static addTask(task) {
    const tasks = Store.getTasks();

    tasks.push(task);

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  static removeTask(amount) {
    const tasks = Store.getTasks();

    tasks.forEach(function(task, index) {
      if (task.amount === amount) {
        tasks.splice(index, 1);
      }
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

// Dom Load event
document.addEventListener("DOMContentLoaded", Store.displayTasks);

// Event Listener for add task
document.getElementById("task-form").addEventListener("submit", function(e) {
  // Get form values
  const name = document.getElementById("name").value,
    item = document.getElementById("item").value,
    amount = document.getElementById("amount").value;

  // Instantiate task
  const task = new Task(name, item, amount);

  // Instantiate UI
  const ui = new UI();

  console.log(ui);

  // Validate
  if (name === "" || item === "" || amount === "") {
    // Error alert
    ui.showAlert("Please fill in all fields", "error");
  } else {
    // Add task to list
    ui.addTaskToList(task);

    // Add to ls
    Store.addTask(task);

    // Show success
    ui.showAlert("Person Added!", "success");

    // Clear fields
    ui.clearFields();
  }

  e.preventDefault();
});

// Event Listener for delete
document.getElementById("task-list").addEventListener("click", function(e) {
  // Instantiate UI
  const ui = new UI();

  const amountToBeRemoved =
    e.target.parentElement.previousElementSibling.textContent;

  // Delete Task
  ui.deleteTask(e.target);

  // Remove from local storage
  Store.removeTask(amountToBeRemoved);

  // Show message
  ui.showAlert("Task Removed!", "success");

  e.preventDefault();
});
