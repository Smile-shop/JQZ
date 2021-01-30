import Vue from "vue";
import dialog from "./index.vue";

let DialogConstructor = Vue.extend(dialog);

const Dialog = function(options = {}) {
  const instance = new DialogConstructor({
    data: options
  });
  document.body.appendChild(instance.$mount().$el);
};

export default Dialog;