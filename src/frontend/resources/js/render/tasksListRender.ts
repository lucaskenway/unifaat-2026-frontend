import taskRender from "./taskRender";
import { tasksListApi } from "../api/tasksListApi";
import type { PaginatedResponse, Task } from "../types/api";

export default async function tasksListRender(idUser: number, page = 1): Promise<void> {
  const container = document.querySelector("#tasks-container");

  if (!container) return;

  container.innerHTML = "";

  const ulElement = document.createElement("ul");
  ulElement.id = "tasks-list";
  ulElement.classList.add("list-group");

  container.append(ulElement);

  let listApi = await tasksListApi({ page });

  // Se a página pedida ficou vazia (ex: última tarefa da página foi excluída),
  // volta pra última página que ainda tem conteúdo.
  if (listApi.data.length === 0 && page > 1 && listApi.total > 0) {
    const lastPage = Math.max(1, Math.ceil(listApi.total / listApi.limit));
    listApi = await tasksListApi({ page: lastPage });
  }

  ulElement.innerHTML = "";

  if (listApi.data.length === 0) {
    const emptyElement = document.createElement("li");
    emptyElement.classList.add("list-group-item", "text-center", "text-muted");
    emptyElement.innerText = "Nenhuma tarefa encontrada. Crie uma nova!";
    ulElement.append(emptyElement);
  } else {
    listApi.data.forEach((task) => {
      const liElement = taskRender(task, idUser, listApi.page);
      ulElement.append(liElement);
    });
  }

  container.append(renderPaginationControls(idUser, listApi));
}

function renderPaginationControls(idUser: number, { page, limit, total }: PaginatedResponse<Task>): HTMLElement {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const navElement = document.createElement("div");
  navElement.classList.add("d-flex", "justify-content-between", "align-items-center", "mt-3");

  const prevButton = document.createElement("button");
  prevButton.type = "button";
  prevButton.classList.add("btn", "btn-outline-secondary", "btn-sm");
  prevButton.innerText = "Anterior";
  prevButton.disabled = page <= 1;
  prevButton.addEventListener("click", () => void tasksListRender(idUser, page - 1));

  const infoElement = document.createElement("span");
  infoElement.classList.add("text-muted");
  infoElement.innerText = `Página ${page} de ${totalPages}`;

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.classList.add("btn", "btn-outline-secondary", "btn-sm");
  nextButton.innerText = "Próxima";
  nextButton.disabled = page >= totalPages;
  nextButton.addEventListener("click", () => void tasksListRender(idUser, page + 1));

  navElement.append(prevButton, infoElement, nextButton);

  return navElement;
}
