let acts = [];

let nav = document.querySelector(".nav");
let title = document.querySelector(".title");
let list = document.querySelector(".list");
let total = document.querySelector(".total");
let totalDone = document.querySelector(".totalDone");

const input = document.querySelector(".add__input");
input.addEventListener("input", highlightBtn);

const btnAdd = document.querySelector(".btn--add");
btnAdd.addEventListener("click", addAct);

const btnDeleteAll = document.querySelector(".delete__all");
btnDeleteAll.addEventListener("click", deleteAll);

const myList = document.querySelector(".nav__btn");
myList.addEventListener("click", commuteList);

document.addEventListener("click", showBtnDeleteAll);
document.addEventListener("click", calcTotal);

// ======================================= Рэндеринг ===================================
if (localStorage.length>0) {
  nav.innerHTML=null;
  renderAllLists();
}

if (localStorage.getItem(`${title.innerHTML}`)) {
  acts = JSON.parse(localStorage.getItem(`${title.innerHTML}`));
  renderActs();
}

function renderAllLists() {
  let keys = Object.keys(localStorage)
  for (let key of keys) {
    let htmlList = `<button class="btn nav__btn" value="${key}">${key}</button>`;
    nav.insertAdjacentHTML("beforeend", htmlList);
  }
  title.innerHTML = localStorage.key(0);
  const allLists = document.querySelectorAll(".nav__btn");
  allLists.forEach((elem) => elem.addEventListener("click", commuteList));
}

function renderActs() {
  list.innerHTML=null;
  if (localStorage.getItem(`${title.innerHTML}`)) {
    acts = JSON.parse(localStorage.getItem(`${title.innerHTML}`));
  } else {
    acts = [];
  }
  acts.forEach((elem) => {
    let cssClass = elem.done ? "act act--done" : "act";
    let htmlAct = `<li class="${cssClass}" data-num=${elem.id}> ${elem.title}
                    <button class="btn completed" onclick="changeState(event)">Готово</button>
                    <button class="btn delete" onclick="deleteAct(event)">Удалить</button>
                 </li>`;
    list.insertAdjacentHTML("beforeend", htmlAct);
  });
  showBtnDeleteAll();
  calcTotal();
}

// ======================================= Добавляем новый список ================================
let btnAddList = document.querySelector(".add__list");
btnAddList.addEventListener("click", addList)

function addList() {
  let listName = prompt("Именуйте лист.", '')
  if (!listName) return;
  let htmlList = `<button class="btn nav__btn" value="${listName}">${listName}</button>`;
  nav.insertAdjacentHTML("beforeend", htmlList);

  list.innerHTML = null;
  title.innerHTML = `${listName}`;
  total.innerHTML = 0;
  totalDone.innerHTML = 0;
  
  const currentList = document.querySelectorAll(`[value="${listName}"]`);
  currentList.forEach((elem) => elem.addEventListener("click", commuteList));
}

// =================================== Переключение между списками =================================
function commuteList(event) {
  input.value = "";
  let currentBtn = event.target;
  title.innerHTML = currentBtn.value;
  renderActs();
}

// ==================================== Добавляем дело ==================================
function addAct() {
  if (!input.value) {
    input.focus();
    return;
  } else {
    let currentTitle = getTitle();
    const currentId = getSpecialId();
    let newAct = {
      id: currentId,
      title: input.value,
      localStorageKey: currentTitle,
      done: false,
    };

    acts.push(newAct);
    let sorted = acts.filter((obj) => {return obj.localStorageKey === title.innerHTML});
    localStorage.setItem(`${title.innerHTML}`, JSON.stringify(sorted));

    let htmlAct = `<li class="act" data-num=${currentId}> ${input.value}
                      <button class="btn completed" onclick="changeState(event)">Готово</button>
                      <button class="btn delete" onclick="deleteAct(event)">Удалить</button>
                   </li>`;
    list.insertAdjacentHTML("beforeend", htmlAct);

    input.value = "";
    input.focus();
    btnAdd.classList.remove("btn--active");
  }
  
  function getSpecialId() {
    let maxNumber = -1;
    for (let elem of acts) {
      if (elem.id > maxNumber) maxNumber = elem.id;
    }
    return maxNumber + 1;
  }

  function getTitle() {
    return title.innerHTML;
  };
}

// ================================= Меняем статус ===============================
function changeState(event) {
  let actHTML = event.target.closest(".act");
  let idHTML = +actHTML.dataset.num;
  let index = acts.findIndex((elem) => elem.id === idHTML);
  acts[index].done = !acts[index].done;
  let sorted = acts.filter((obj) => {return obj.localStorageKey === title.innerHTML});
  localStorage.setItem(`${title.innerHTML}`, JSON.stringify(sorted));

  let comletedAct = event.target.closest(".act");
  comletedAct.classList.toggle("act--done");
}

// ====================================== Удаляем дело ============================
function deleteAct(event) {
  let actHTML = event.target.closest(".act");
  let idHTML = +actHTML.dataset.num;
  let index = acts.findIndex((elem) => elem.id === idHTML);
  acts.splice(index, 1);
  let sorted = acts.filter((obj) => {return obj.localStorageKey === title.innerHTML});
  localStorage.setItem(`${title.innerHTML}`, JSON.stringify(sorted));

  actHTML.outerHTML = "";

  if (document.querySelectorAll(".act").length === 0) {
    localStorage.removeItem(`${title.innerHTML}`);
  }
}

//=================================== Удаляем все дела =========================
function deleteAll() {
  list.innerHTML = "";
  localStorage.removeItem(`${title.innerHTML}`);
}

// ====================================== Подсчеты ========================================
function calcTotal() {
  let allActs = document.querySelectorAll(".act");
  total.innerHTML = allActs.length;

  let allDoneActs = document.querySelectorAll(".act--done");
  totalDone.innerHTML = allDoneActs.length;
}

// ======================================= Кнопочки =======================================
function highlightBtn() {
  if (input.value) {
    btnAdd.classList.add("btn--active");
  } else {
    btnAdd.classList.remove("btn--active");
  }
}

function showBtnDeleteAll() {
  let btnDeleteAll = document.querySelector(".delete__all");
  let htmlActs = document.querySelectorAll(".act");
  if (htmlActs.length > 1) {
    btnDeleteAll.classList.add("visible");
  } else {
    btnDeleteAll.classList.remove("visible");
  }
}
