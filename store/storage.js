const store = {
  getStorage() {
    return JSON.parse(localStorage.getItem("menu"));
  },
  setStorage(value) {
    localStorage.setItem("menu", JSON.stringify(value));
  },
};
export default store;
