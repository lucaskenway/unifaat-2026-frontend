import type { Task } from "../types/api";
import type { TaskListItemElement } from "../types/dom";
import taskToggleHandler from "../listeners/taskToggleHandler";
import taskDeleteHandler from "../listeners/taskDeleteHandler";
import taskEditHandler from "../listeners/taskEditHandler";

export default function taskRender(task: Task, idUser: number, page: number): TaskListItemElement {
  const liElement = document.createElement("li") as TaskListItemElement;
  liElement.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
  liElement.taskId = task.id;
  liElement.userId = idUser;
  liElement.page = page;

  const checkboxElement = document.createElement("input");
  checkboxElement.type = "checkbox";
  checkboxElement.classList.add("form-check-input", "me-2");
  checkboxElement.checked = task.is_done;
  checkboxElement.addEventListener("change", taskToggleHandler);
  liElement.append(checkboxElement);

  const nameElement = document.createElement("span");
  nameElement.innerText = task.name;
  nameElement.classList.add("task-name", "flex-grow-1");

  if (task.is_done) {
    nameElement.classList.add("text-decoration-line-through", "text-muted");
  }

  liElement.append(nameElement);

  const buttonGroupElement = document.createElement("div");
  buttonGroupElement.classList.add("d-flex", "gap-2");

  const buttonEditElement = document.createElement("button");
  buttonEditElement.classList.add("btn", "btn-secondary", "btn-sm");
  buttonEditElement.innerText = "Editar";
  buttonEditElement.addEventListener("click", taskEditHandler);
  buttonGroupElement.append(buttonEditElement);

  const buttonDeleteElement = document.createElement("button");
  buttonDeleteElement.classList.add("btn", "btn-danger", "btn-sm");
  buttonDeleteElement.innerText = "Excluir";
  buttonDeleteElement.addEventListener("click", taskDeleteHandler);
  buttonGroupElement.append(buttonDeleteElement);

  liElement.append(buttonGroupElement);

  return liElement;
}
