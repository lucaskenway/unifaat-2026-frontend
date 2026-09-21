import tasksListRender from "../render/tasksListRender";
import { taskUpdateApi } from "../api/taskUpdateApi";
import type { TaskListItemElement } from "../types/dom";

export default function taskEditHandler(event: Event): void {
  const editButton = event.currentTarget as HTMLButtonElement;
  const liElement = editButton.closest("li") as TaskListItemElement | null;
  if (!liElement) return;

  const nameElement = liElement.querySelector<HTMLSpanElement>(".task-name");
  if (!nameElement) return;

  const { userId: idUser, taskId, page } = liElement;
  const currentName = nameElement.innerText;

  const inputElement = document.createElement("input");
  inputElement.type = "text";
  inputElement.classList.add("form-control", "form-control-sm", "flex-grow-1", "me-2");
  inputElement.value = currentName;

  nameElement.replaceWith(inputElement);
  inputElement.focus();

  editButton.innerText = "Salvar";
  editButton.classList.remove("btn-secondary");
  editButton.classList.add("btn-success");
  editButton.removeEventListener("click", taskEditHandler);

  const saveEdit = async (): Promise<void> => {
    const newName = inputElement.value.trim();

    if (!newName) {
      alert("O nome da tarefa não pode ficar vazio");
      inputElement.focus();
      return;
    }

    try {
      if (newName !== currentName) {
        await taskUpdateApi(taskId, { name: newName });
      }
      await tasksListRender(idUser, page);
    } catch (error) {
      alert("Erro ao editar tarefa");
      console.error(error);
    }
  };

  editButton.addEventListener("click", () => void saveEdit(), { once: true });

  inputElement.addEventListener("keydown", (keyEvent: KeyboardEvent) => {
    if (keyEvent.key === "Enter") {
      keyEvent.preventDefault();
      void saveEdit();
    }
  });
}
