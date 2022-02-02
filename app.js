import { $, $closest } from "./utils/dom.js";
import store from "./store/storage.js";

const BASE_URL = "http://localhost:3000/api";
const MENU_API = {
  async getAllMenuByCategory(category) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`);
    const result = await response.json();
    return result;
  },
};
function App() {
  this.state = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };

  this.init = async () => {
    this.state[currentCategory] = await MENU_API.getAllMenuByCategory(
      currentCategory
    );
    render();
    initEventListener();
  };

  let currentCategory = "espresso";

  const menuTemplate = () =>
    this.state[currentCategory]
      .map(
        (item, index) =>
          `<li class="menu-list-item" data-id=${index}>
              <span class="${item.isSoldOut ? "sold-out" : ""} menu-name">${
            item.name
          }</span>
              <button
                type="button"
                class="menu-soldout-button">
                품절
              </button>
              <button
                type="button"
                class="menu-edit-button">
                수정
              </button>
              <button
                type="button"
                class="menu-remove-button">
                삭제
              </button>
            </li>`
      )
      .join("");

  const render = () => {
    const template = menuTemplate();
    $(".menu-list").innerHTML = template;
    updateMenuCount();
  };

  const addMenuNameHandler = async () => {
    if ($("#menu-name").value === "") return alert("값을 입력하세요");
    const menuValue = $("#menu-name").value;
    try {
      const res1 = await fetch(`${BASE_URL}/category/${currentCategory}/menu`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ name: menuValue }),
      });
      const res2 = await res1.json();
      if (res1.status !== 200 && res2.message) throw Error(res2.message);
    } catch (e) {
      alert(`메뉴 추가 에러 : ${e.message}`);
    }
    try {
      let res = await MENU_API.getAllMenuByCategory(currentCategory);
      this.state[currentCategory] = res;
      render();
      $("#menu-name").value = "";
    } catch (e) {}
  };
  const editMenuHandler = (e) => {
    const $parent = e.target.closest("li");
    const $menuTarget = $parent.querySelector(".menu-name");
    const editIndex = $parent.closest("li").dataset.id;
    const msg = "메뉴 이름을 수정하시겠습니까?";
    const editedMenuName = prompt(msg, $menuTarget.innerText);
    //값 입력 안 하거나 ,prompt창을 그냥 닫을 때 => 메뉴명 변경X
    if (editedMenuName === "" || editedMenuName === null) return;
    this.state[currentCategory][editIndex] = { name: editedMenuName };
    store.setStorage(this.state);
    render();
  };
  const removeMenuHandler = (e) => {
    if (window.confirm("삭제하시겠습니까?")) {
      const target = $closest(e, ".menu-list-item");
      const removeId = Number(target.dataset.id);
      this.state[currentCategory].splice(removeId, 1);
      store.setStorage(this.state);
      target.remove();
      render();
    }
  };

  const soldOutMenuHandler = (e) => {
    //해당 메뉴에 soldOut추가, storage에 데이터 저장 및 렌더링
    let idx = e.target.closest("li").dataset.id;
    this.state[currentCategory][idx].isSoldOut = !this.state[currentCategory][
      idx
    ].isSoldOut;
    store.setStorage(this.state);
    render();
  };
  const updateMenuCount = () => {
    const menuCount = this.state[currentCategory].length;
    $("#menu-count").innerText = `총 ${menuCount}개`;
  };
  const initEventListener = () => {
    $("nav").addEventListener("click", (e) => {
      const isCategoryBtn = e.target.classList.contains("cafe-category-name");
      if (isCategoryBtn) {
        currentCategory = e.target.dataset.categoryName;
        $(".category-title").innerText = `${e.target.innerText} 메뉴관리`;
        render();
      }
    });
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });
    $(".add-btn").addEventListener("click", addMenuNameHandler);
    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") return;
      addMenuNameHandler();
    });
    //edit => 이벤트 위임 이용
    $(".menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) editMenuHandler(e);
      if (e.target.classList.contains("menu-remove-button"))
        removeMenuHandler(e);
      if (e.target.classList.contains("menu-soldout-button"))
        soldOutMenuHandler(e);
    });
  };
}

const app = new App();
app.init();
