import { $, $closest } from "./utils/dom.js";

const BASE_URL = "http://localhost:3000/api";
const MENU_API = {
  async addMenuByCategory(category, name) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw Error("메뉴 추가 에러");
  },
  async getAllMenuByCategory(category) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`);
    const result = await response.json(); // Promise{<resolved>} = {id, name}
    return result;
  },
  async updateMenu(category, menuId, name) {
    const response = await fetch(
      `${BASE_URL}/category/${category}/menu/${menuId}
    `,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ name }),
      }
    );
    if (!response.ok) return alert("Update Error");
    return response.json();
  },
  async toggleSoldOutMenu(category, menuId) {
    const response = await fetch(
      `${BASE_URL}/category/${category}/menu/${menuId}/soldout
    `,
      {
        method: "PUT",
      }
    );
    if (!response.status) {
      alert("Error Occured");
    }
    const result = response.json(); // Promise{<pending>}
    return result;
  },
  async deleteMenu(category, menuId) {
    const response = await fetch(
      `${BASE_URL}/category/${category}/menu/${menuId}`,
      { method: "DELETE" } // method : 'DELETE' 정의 안해주면 GET으로 인식하기에 404 NOT FOUND뜸
    );
    if (!response.ok) {
      const result = await response.json();
      throw Error(result.message);
    }
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
        (item) =>
          `<li class="menu-list-item" data-id=${item.id}>
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
    const menuName = $("#menu-name").value;
    try {
      await MENU_API.addMenuByCategory(currentCategory, menuName);
    } catch (e) {
      alert(`메뉴 추가 에러 : ${e.message}`);
    }
    try {
      let res = await MENU_API.getAllMenuByCategory(currentCategory);
      this.state[currentCategory] = res;
      render();
      $("#menu-name").value = "";
    } catch (e) {
      //async에서 throw한 걸 catch에서 받아옴
      alert(`메뉴 조회 에러 : ${e.message}`);
    }
  };
  const editMenuHandler = async (e) => {
    const $parent = e.target.closest("li");
    const $menuTarget = $parent.querySelector(".menu-name");
    const editId = $parent.closest("li").dataset.id;
    const msg = "메뉴 이름을 수정하시겠습니까?";
    const editedMenuName = prompt(msg, $menuTarget.innerText);
    //값 입력 안 하거나 ,prompt창을 그냥 닫을 때 => 메뉴명 변경X
    if (editedMenuName === "" || editedMenuName === null) return;
    await MENU_API.updateMenu(currentCategory, editId, editedMenuName);
    this.state[currentCategory] = await MENU_API.getAllMenuByCategory(
      currentCategory
    );
    render();
  };
  const removeMenuHandler = async (e) => {
    if (window.confirm("삭제하시겠습니까?")) {
      const target = $closest(e, ".menu-list-item");
      const removeId = target.dataset.id;
      await MENU_API.deleteMenu(currentCategory, removeId);
      this.state[currentCategory] = await MENU_API.getAllMenuByCategory(
        currentCategory
      );
      render();
    }
  };

  const soldOutMenuHandler = async (e) => {
    //해당 메뉴에 soldOut추가, storage에 데이터 저장 및 렌더링
    let menuId = e.target.closest("li").dataset.id;
    await MENU_API.toggleSoldOutMenu(currentCategory, menuId);
    let result = await MENU_API.getAllMenuByCategory(currentCategory);
    this.state[currentCategory] = result;
    render();
  };
  const updateMenuCount = () => {
    const menuCount = this.state[currentCategory].length;
    $("#menu-count").innerText = `총 ${menuCount}개`;
  };
  const initEventListener = () => {
    $("nav").addEventListener("click", async (e) => {
      const isCategoryBtn = e.target.classList.contains("cafe-category-name");
      if (isCategoryBtn) {
        currentCategory = e.target.dataset.categoryName;
        this.state[currentCategory] = await MENU_API.getAllMenuByCategory(
          currentCategory
        );
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
