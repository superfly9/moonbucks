const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// const app = {
//   addMenuHandler() {
//     $(".add-btn").addEventListener("click", (e) => {
//       console.log("e", e);
//       e.preventDefault();
//     });
//   },
//   init() {
//     this.addMenuHandler();
//   },
// };

// app.init();

// step1
// [O] 에스프레소 메뉴에 새로운 메뉴를 확인 버튼 또는 엔터키 입력으로 추가한다.
// [O] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
// [O] 사용자 입력값이 빈 값이라면 추가되지 않는다.
// [O] 메뉴의 수정 버튼을 눌러 메뉴 이름 수정할 수 있다.
// [O] 메뉴 수정시 브라우저에서 제공하는 prompt 인터페이스를 활용한다.
// 메뉴 삭제 버튼을 이용하여 메뉴 삭제할 수 있다.
// 메뉴 삭제시 브라우저에서 제공하는 confirm 인터페이스를 활용한다.
// 총 메뉴 갯수를 count하여 상단에 보여준다.
function App() {
  //form vs button어디에 이벤트 추가할 것인가
  const addMenuName = () => {
    if ($("#menu-name").value === "") {
      return alert("값을 입력하세요");
    }
    const menuValue = $("#menu-name").value;
    const template = menuTemplate(menuValue);
    $(".menu-list").insertAdjacentHTML("beforeend", template);
    const menuCount = $$(".menu-list-item").length; // #menu-list에 li추가 후 바로 그 갯수를 계산해옴
    $("#menu-count").innerText = `총 ${menuCount}개`;
    $("#menu-name").value = "";
  };

  const menuTemplate = (menuName) => `<li class="menu-list-item">
  <span class="menu-name">${menuName}</span>
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
</li>`;
  $("#menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });
  //add
  $(".add-btn").addEventListener("click", addMenuName);
  //add
  $("#menu-name").addEventListener("keypress", (e) => {
    //한글 입력시 keypress이벤트 발생 안 한다.아스키코드에 한글이 없어서 안됩니다.
    if (e.key !== "Enter") return;
    addMenuName();
    // innerText vs textContent?
  });
  //edit => 이벤트 위임 이용
  $(".menu-list").addEventListener("click", (e) => {
    console.log(e.target);
    if (e.target.classList.contains("menu-edit-button")) {
      const menuTarget = e.target
        .closest(".menu-list")
        .querySelector(".menu-name");
      const currentMenuName = menuTarget.textContent;
      console.log("[current Menu]:", currentMenuName);
      const editedMenuName = prompt(
        "메뉴 이름을 수정하시겠습니까?",
        currentMenuName
      );
      menuTarget.textContent = editedMenuName;
    }
  });
}
App();
