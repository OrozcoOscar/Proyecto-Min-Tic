// vendors

import React, { useCallback, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
// assets
import logo from 'assets/logo.svg';




const TABLA = ({ StatusDatos,getData2,setAdvances,ChangeVisual, getData,setIdAvances }) => {
    console.log(StatusDatos)
    if(StatusDatos){
        return (
            <>
                <div className="DivPadre inactivo">
                    <button type="button" className="btn btn-secondary mx-3" onClick={ChangeVisual}>Regresar</button>
                    <table className="table caption-top">
                        <caption>Lista de projecto</caption>
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Fecha</th>
                                <th scope="col">Accion</th>
                            </tr>
                        </thead>
                        <tbody>
    
                            {getData?.allAdvanceProject?.map(({ _id,addDate,description,observations}) => (
                                <tr>
                                    <th scope="row">1</th>
                                    <td>{new Date (parseInt(addDate)).toLocaleDateString()}</td>
                                    <td>
                                        <button type="button" className="btn btn-primary " data-bs-toggle="modal" onClick={()=> setIdAvances(_id)} data-bs-target="#actualizarAvances">Actualizando</button>
                                        <button type="button" className="btn btn-primary " data-bs-toggle="modal" onClick={()=> setAdvances({"description":description,"observations":observations})} data-bs-target="#MostrarAvances">Mostrar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }else{
        return (
            <>
                <div className="DivPadre inactivo">
                    <button type="button" className="btn btn-secondary mx-3" onClick={ChangeVisual}>Regresar</button>
                    <table className="table caption-top">
                        <caption>Lista de projecto2</caption>
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Fecha</th>
                                <th scope="col">Accion</th>
                            </tr>
                        </thead>
                        <tbody>
    
                            {getData2?.listarAdvances?.map(({ _id,addDate,description,observations}) => (
                                <tr>
                                    <th scope="row">1</th>
                                    <td>{new Date (parseInt(addDate)).toLocaleDateString()}</td>
                                    <td>
                                        <button type="button" className="btn btn-primary " data-bs-toggle="modal" onClick={()=> setIdAvances(_id)} data-bs-target="#actualizarAvancesleader">Actualizando</button>
                                        <button type="button" className="btn btn-primary " data-bs-toggle="modal" onClick={()=> setAdvances({"description":description,"observations":observations})} data-bs-target="#MostrarAvances">Mostrar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        ); 
    }

}


export default TABLA;
