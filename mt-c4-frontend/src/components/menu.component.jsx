// vendors
import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

const USERDATA = gql`
query User {
  user {
  name
  role  
  }
}
`;

const Menu = ({ setUser, user }) => {
  const { data, loading } = useQuery(USERDATA);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">{'Inicio'}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/projects">{'Projectos'}</Link>
            </li>

              {(() => {
                if(data){
                  if (data.role != "STUDENT") {
                    return (
                      <>
                        <li className="nav-item">
                        <Link className="nav-link" to="/users">{'Usuarios'}</Link>
                        </li>
                      </>
                    )
  
                  }
                }

              })()
              }

          </ul>
          <ul className="navbar-nav justify-content-end">
            {(() => {
              if (data) {
                return (<>
                  <li className="nav-item">
                    <Link className="nav-link" to="/users/upUser">{user}</Link>
                  </li>
                  <li className="nav-item">
                    <Link onClick={() => {
                      sessionStorage.removeItem('token')
                      sessionStorage.removeItem('User')
                      window.location.href = "/"
                    }} className="nav-link" to="/">{'log Out'}</Link>
                  </li>
                </>)
              } else {
                return (<>
                  <li className="nav-item">
                    <Link className="nav-link" to="/users/login">{'Ingresa'}</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/users/signup">{'Regístrate'}</Link>
                  </li>
                </>)
              }
            })()}

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Menu;