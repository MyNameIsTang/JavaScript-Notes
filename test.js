(function deleteElement() {
  const read = document.querySelector("#read_all_wrapper");
  read.remove();
  const body = document.querySelector("#body-inner");
  body.setAttribute("style", "overflow: unset; max-height: unset");
  const utterances = document.querySelector(".utterances");
  utterances.remove();
})();
