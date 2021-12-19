// vendors
import React, {useState } from "react";
import { Route, Routes } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

// styles
import 'styles/App.scss';

// views
import Home from 'home/views/home.view';
import Projects from 'projects/views/projects.view';
import SignUp from 'users/views/signup.view';
import Menu from 'components/menu.component';
import Users from 'users/views/users.view';
import Login from 'users/views/login.view';
import Update from 'users/views/UpUser.view';
import NoAccess from 'components/no-access.component';
import Tabla from 'components/TablasMostrar';


function App() {
  const ChangeVisual = ()=>{    
    document.querySelector(".VisualProject").classList.toggle("inactivo")
    document.querySelector(".DivPadre").classList.toggle("inactivo")
  }

  const [varUser,setVarUser] = useState("")
  const [idAvances,setIdAvances] = useState("")
  const [getData,setData] = useState([])
  const [getData2,setData2] = useState([])
  const [getAdvance,setAdvances] = useState({})
  const [StatusDatos,setStatusDatos] = useState(true)

  return (
    <>
      <Menu setUser = {setVarUser} user = {varUser}/>
      
      <Container>
        <Routes>
          <Route index element={
          <Home setStatusDatos={setStatusDatos} setData2={setData2} getAdvance={getAdvance} setData={setData} getData={getData} setUser = {setVarUser} user = {varUser} ChangeVisual={ChangeVisual} idAvances={idAvances} />} 
          />
          <Route path="projects" element={<Projects />} />
          <Route path="users">
            <Route index element={<Users />} />
            <Route path="upUser" element={<Update  setUser = {setVarUser} user = {varUser}/>} />
            <Route path="signup" element={<SignUp />} />
            <Route path="login" element={<Login />} />
          </Route>
          <Route path="no-access" element={<NoAccess />}/>
        </Routes>
        <Tabla  StatusDatos={StatusDatos} getData2={getData2} setAdvances={setAdvances} ChangeVisual={ChangeVisual} setData = {setData} getData = {getData} setIdAvances={setIdAvances}  />
      </Container>
    </>
  );
}

export default App;
