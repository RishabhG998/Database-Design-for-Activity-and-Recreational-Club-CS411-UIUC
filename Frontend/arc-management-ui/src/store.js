import { createStore } from "redux";
import reducer from "./reducers/index";
 
function configureStore() {
  return createStore(reducer);
}

export default configureStore;