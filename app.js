import { $, $closest } from "./utils/dom.js";
import store from "./store/storage.js";
// step1
// [O] 에스프레소 메뉴에 새로운 메뉴를 확인 버튼 또는 엔터키 입력으로 추가한다.
// [O] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
// [O] 사용자 입력값이 빈 값이라면 추가되지 않는다.
// [O] 메뉴의 수정 버튼을 눌러 메뉴 이름 수정할 수 있다.
// [O] 메뉴 수정시 브라우저에서 제공하는 prompt 인터페이스를 활용한다.
// [O] 메뉴 삭제 버튼을 이용하여 메뉴 삭제할 수 있다.
// [O] 메뉴 삭제시 브라우저에서 제공하는 confirm 인터페이스를 활용한다.
// [O] 총 메뉴 갯수를 count하여 상단에 보여준다.

// step2
// 추가
// localStorage에도 데이터 저장

// 수정
// 아이디 값으로 찾고, 그 값을 업데이트 후 로컬스토리지에도 저장

// 삭제
// 해당 키 값으로 로컬 스토리지에서도 삭제

function App() {
  this.state = {
    espresso: [],
    prapuccino: [],
    blendid: [],
    tivarna: [],
    dessert: [],
  };

  this.init = () => {
    if (store.getStorage() !== null) {
      this.state = store.getStorage();
    }
    render();
    initEventListener();
  };

  let currentCategory = "espresso";

  const menuTemplate = () =>
    this.state[currentCategory]
      .map(
        (item, index) =>
          `<li class="menu-list-item" data-id=${index}>
              <span class="${item.soldOut ? "sold-out" : ""} menu-name">${
            item.menu
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

  const addMenuNameHandler = () => {
    if ($("#menu-name").value === "") return alert("값을 입력하세요");
    const menuValue = $("#menu-name").value;
    this.state[currentCategory].push({ menu: menuValue });
    store.setStorage(this.state);
    render();
    $("#menu-name").value = "";
  };
  const editMenuHandler = (e) => {
    const $parent = e.target.closest("li");
    const $menuTarget = $parent.querySelector(".menu-name");
    const editIndex = $parent.closest("li").dataset.id;
    const msg = "메뉴 이름을 수정하시겠습니까?";
    const editedMenuName = prompt(msg, $menuTarget.innerText);
    //값 입력 안 하거나 ,prompt창을 그냥 닫을 때 => 메뉴명 변경X
    if (editedMenuName === "" || editedMenuName === null) return;
    this.state[currentCategory][editIndex] = { menu: editedMenuName };
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
    this.state[currentCategory][idx].soldOut = !this.state[currentCategory][idx]
      .soldOut;
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
