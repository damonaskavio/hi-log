import { RouterProvider } from "react-router-dom";
import router from "./router";

import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
