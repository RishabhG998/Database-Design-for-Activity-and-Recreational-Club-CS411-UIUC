import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PureComponent } from "react";
import Header from "./components/common/header";
import UserHome from "./components/user-home";
import AdminHome from "./components/admin-home";
import Login from "./components/login";
import NoPage from "./components/common/no-page";
import EditUser from "./components/edit-user";
import FacilitiesBooking from "./components/facilities-booking";
import CreateEvent from "./components/event-create"

export class App extends PureComponent {

  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className="App">
        <Header/>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<NoPage />} />
            <Route path="/" element={<Login />}/>
            <Route index element={<Login />} />
            <Route path="login" element={<Login />}/>
            <Route path="userHome" element={<UserHome />} />
            <Route path="adminHome" element={<AdminHome />} />
            <Route path="editUser" element={<EditUser />} />
            <Route path="facilityBooking" element={<FacilitiesBooking />}/>
            <Route path="createEvent" element={<CreateEvent />}/>
          </Routes>
        </BrowserRouter>
      </div>
    )
  }
};

export default App;