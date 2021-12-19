// vedors
import React, { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery, gql } from '@apollo/client';
import Form from 'react-bootstrap/Form';
import { Formik } from "formik";
import Button from "react-bootstrap/Button";
import * as Yup from 'yup';

// styles
import 'projects/styles/projects.styles.scss';

const updateStatusProjecto = gql`
mutation UpdateStatusProject($idProject: ID!, $status: String!) {
  updateStatusProject(_idProject: $idProject, status: $status) {
    _id
  }
}`;
const UpdatePhaseProject = gql`
mutation UpdatePhaseProject($idProject: ID!, $phase: String!) {
  updatePhaseProject(_idProject: $idProject, phase: $phase) {
    _id
  }
}`;
const ActualizarEstadoEnrollment = gql`
mutation UpdateStatusEnrollment($idEnrollment: ID!, $status: String!) {
  updateStatusEnrollment(_idEnrollment: $idEnrollment, status: $status) {
    status
  }
}
`;

const ProjectAllVisual = gql`
query AllProjectsVisual {
  allProjectsVisual {
    _id
    name
    startDate
    endDate
    budget
    leader {
      fullName
    }
    phase
    generalObjective
    specificObjectives
    status
  }
}`;
const VisualizarEstudiantes = gql`
query ProjectsVisual($idProject: ID!) {
  ProjectsVisual(idProject: $idProject) {
  enrollments {
    _id
    student {
      fullName
    }
    status
  }
  }
}
`;

const ProjectAll = gql`
query AllProjects {
  allProjects {
    _id
    name
    startDate
    endDate
    budget
    leader {
      fullName
    }
    phase
    generalObjective
    specificObjectives
    status
  }
}`;

const updateProject = gql`
mutation UpdateProject($input: RegisterInputProjectUpdate!, $idProject: ID!) {
  updateProject(input: $input, _idProject: $idProject) {
    _id
  }
}`;
const CreateProject = gql`
mutation CreateProject($input: RegisterInputProject!) {
  createProject(input: $input) {
  _id  
  }
}`;

const Registro = gql`
mutation RegisterEnrollment($idProject: ID!) {
  registerEnrollment(_idProject: $idProject) {
    status
  }
}`;


const initialValues = {
  name: '',
  generalObjective: '',
  specificObjectives: '',
  budget: '',
};


const validationSchema = Yup.object({
  name: Yup.string().required('Campo requerido'),
  budget: Yup.number('Ingresa solo números').required('Campo requerido'),
  generalObjective: Yup.string().required('Campo requerido'),
  specificObjectives: Yup.string().required('Campo requerido'),

})


const Projects = () => {
  const user = JSON.parse(sessionStorage.getItem("User"))
  const { data, loading } = useQuery(user.role == "LEADER" ? ProjectAllVisual : ProjectAll);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [codigoP, setCodigoP] = useState("");
  const [Probando, setProbando] = useState("");
  const [actualizarProjectos, setActualizarProjectos] = useState({});
  const [projectoView, setprojectoView] = useState({ name: "", startDate: "", endDate: "", leader: { fullName: "" }, phase: "", specificObjectives: "", generalObjective: "" });
  const [registerEnrollment, errorPrueba] = useMutation(Registro);
  const [updateProjectos] = useMutation(updateProject);
  const [updateStatusProject] = useMutation(updateStatusProjecto);
  const [createProject] = useMutation(CreateProject);
  const [updatePhaseProject] = useMutation(UpdatePhaseProject);
  const [visualizarStudent] = useMutation(ActualizarEstadoEnrollment);
  const dataUSER = useQuery(VisualizarEstudiantes, {
    variables: {
      idProject: codigoP
    }
  }).data;

 const initialValuesNew = {
    name: actualizarProjectos.name,
    generalObjective: actualizarProjectos.generalObjective,
    specificObjectives: actualizarProjectos.specificObjectives,
    budget: actualizarProjectos.budget,
 }

  useEffect(() => {
    if (errorPrueba.error) alert(errorPrueba.error);
  }, [errorPrueba]);
  

  if (user.role == "LEADER") {

    return (

      <>
        {/* MODULO PARA REGISTRAR   */}
        <div className="modal fade" id="registro" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Registro</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={(values) => {
                    createProject({
                      variables: {
                        input: {
                          ...values,
                        },
                      }
                    })
                      .then(() => {
                        setError(false);
                        setSuccess(true);
                      })
                      .catch(() => setError(true));
                  }}
                >
                  {({
                    handleSubmit,
                    getFieldProps,
                    errors,
                    touched
                  }) => (
                    <Form noValidate onSubmit={(e) => { handleSubmit(e); window.location.reload("/projects") }}>

                      <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                          name="name"
                          placeholder="Ingresa tu nombre"
                          isInvalid={touched.name && !!errors.name}
                          {...getFieldProps('name')}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.name}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formgeneralObjective">
                        <Form.Label>GeneralObjective</Form.Label>
                        <Form.Control
                          name="generalObjective"
                          placeholder="Ingresar objetivos generales"
                          isInvalid={touched.generalObjective && !!errors.generalObjective}
                          {...getFieldProps('generalObjective')}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.generalObjective}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formspecificObjectives">
                        <Form.Label>SpecificObjectives</Form.Label>
                        <Form.Control
                          name="specificObjectives"
                          placeholder="Ingresar specificObjectives"
                          isInvalid={touched.SpecificObjectives && !!errors.SpecificObjectives}
                          {...getFieldProps('specificObjectives')}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.SpecificObjectives}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formbudget">
                        <Form.Label>Budget</Form.Label>
                        <Form.Control
                          name="budget"
                          type="number"
                          placeholder="Ingresa tu budget"
                          isInvalid={touched.budget && !!errors.budget}
                          {...getFieldProps('budget')}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.budget}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Button type="submit" >Enviar</Button>
                    </Form>
                  )}
                </Formik>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>


        {/* MODULO PARA MOSTRAR  */}
        <div className="modal fade" id="MOSTRAR" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p>Nombre:</p>
                <p>{projectoView.name}</p>
                <br />
                <p>StartDate:</p>
                <p>{new Date(parseInt(projectoView.startDate)).toLocaleDateString() == "31/12/1969" ? "dd/mm/aaaa" : new Date(parseInt(projectoView.startDate)).toLocaleDateString()}</p>
                <br />
                <p>endDate:</p>
                <p>{new Date(parseInt(projectoView.endDate)).toLocaleDateString() == "31/12/1969" ? "dd/mm/aaaa" : new Date(parseInt(projectoView.endDate)).toLocaleDateString()}</p>
                <br />
                <p>generalObjective:</p>
                <p>{projectoView.generalObjective}</p>
                <br />
                <p>specificObjectives:</p>
                <p>{projectoView.specificObjectives}</p>
                <br />
                <p>Fullname Leader:</p>
                <p>{projectoView.leader.fullName}</p>
                <br />
                <p>Phase:</p>
                <p>{projectoView.phase}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>

        {/* MODULO PARA MOSTRAR INDIVIDUO */}
        <div className="modal fade" id="MOSTRARI" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p>Nombre:</p>
                <p>{projectoView.name}</p>
                <br />
                <p>StartDate:</p>
                <p>{new Date(parseInt(projectoView.startDate)).toLocaleDateString() == "31/12/1969" ? "dd/mm/aaaa" : new Date(parseInt(projectoView.startDate)).toLocaleDateString()}</p>
                <br />
                <p>endDate:</p>
                <p>{new Date(parseInt(projectoView.endDate)).toLocaleDateString() == "31/12/1969" ? "dd/mm/aaaa" : new Date(parseInt(projectoView.endDate)).toLocaleDateString()}</p>
                <br />
                <p>generalObjective:</p>
                <p>{projectoView.generalObjective}</p>
                <br />
                <p>specificObjectives:</p>
                <p>{projectoView.specificObjectives}</p>
                <br />
                <p>Fullname Leader:</p>
                <p>{projectoView.leader.fullName}</p>
                <br />
                <p>Phase:</p>
                <p>{projectoView.phase}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>

        {/* MODULO PARA ACTUALIZAR   */}
        <div className="modal fade " id="actualizar" tabindex="-1" aria-labelledby="exampleModalLabel" >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">{projectoView.name}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <Formik
                // name:'Perro',generalObjective,specificObjectives,budget
                  initialValues={{generalObjective:'gato',specificObjectives:'TEAMO',budget:12345}}
                  // validationSchema={validationSchema}
                  onSubmit={(values) => {
                    updateProjectos({
                      variables: {
                        input: {
                          ...values,
                        },
                        idProject: projectoView._id,
                      }
                    })
                      .then(() => {
                        setError(false);
                        setSuccess(true);
                      })
                      .catch(() => setError(true));
                  }}
                >
                  {({
                    handleSubmit,
                    getFieldProps,
                    errors,
                    touched
                  }) => (
                    <Form noValidate onSubmit={(e) => { handleSubmit(e); window.location.reload("/projects") }}>

                      <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                          name="name"
                          placeholder="Ingresa tu nombre"
                          isInvalid={touched.name && !!errors.name}
                          {...getFieldProps('name')}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formgeneralObjective">
                        <Form.Label>GeneralObjective</Form.Label>
                        <Form.Control
                          name="generalObjective"
                          placeholder="Ingresar objetivos generales"
                          isInvalid={touched.generalObjective && !!errors.generalObjective}
                          {...getFieldProps('generalObjective')}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formspecificObjectives">
                        <Form.Label>SpecificObjectives</Form.Label>
                        <Form.Control
                          name="specificObjectives"
                          placeholder="Ingresar specificObjectives"
                          isInvalid={touched.SpecificObjectives && !!errors.SpecificObjectives}
                          {...getFieldProps('specificObjectives')}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formbudget">
                        <Form.Label>Budget</Form.Label>
                        <Form.Control
                          name="budget"
                          type="number"
                          placeholder="Ingresa tu budget"
                          isInvalid={touched.budget && !!errors.budget}
                          {...getFieldProps('budget')}
                        />
                      </Form.Group>
                      <Button type="submit" >Enviar</Button>
                    </Form>
                  )}
                </Formik>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
        {/* ////////////////////////////// */}
        {/* MODULO PARA ACTUALIZAR ESTUDIANTES  */}
        <div className="modal fade" id="actualizarStudent" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Actualizar</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <table className="table caption-top">
                  <caption>List of users</caption>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Nombre Estudiante</th>
                      <th scope="col">Accion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataUSER?.ProjectsVisual?.map((a) => {
                      return a.enrollments?.map(({_id,status,student})=>(
                          <>
                            <tr>
                              <th scope="row">1</th>
                              <td>{student.fullName}</td>
                              <td>
                  <select defaultValue={status} onChange={e => visualizarStudent({ variables: { idEnrollment: _id, status: e.target.value } })}>
                    <option value="ACEPTED">Aceptado</option>
                    <option value="REJECTED">Rechazado</option>
                  </select>
                </td>
                            </tr>
                          </>
                      ))
                      })}

                  </tbody>
                </table>
 
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
        {/* ////////////////////////////// */}
        <table className="table caption-top">
          <caption>Lista de projecto</caption>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Projecto</th>
              <th scope="col">startDate</th>
              <th scope="col">endDate</th>
              <th scope="col">Accion</th>
              <th scope="col">Status</th>
            </tr>
          </thead>

          <tbody>

            {data?.allProjectsVisual?.map(({ _id, name, startDate, endDate, generalObjective, specificObjectives, leader, phase, status,budget }, i) => (
              <tr key={i}>
                <th scope="row">1</th>
                <td>{name}</td>
                <td>{(new Date(parseInt(startDate))).toLocaleDateString() == "31/12/1969" ? "dd/mm/aaaa" : new Date(parseInt(startDate)).toLocaleDateString()}</td>
                <td>{(new Date(parseInt(endDate))).toLocaleDateString() == "31/12/1969" ? "dd/mm/aaaa" : new Date(parseInt(startDate)).toLocaleDateString()}</td>
                <td>
                  <button type="button" className="btn btn-primary " data-bs-toggle="modal" onClick={() =>{
                  setprojectoView({ _id, name, leader: { fullName: "" } })
                  setActualizarProjectos({name,generalObjective,specificObjectives,budget})}} data-bs-target="#actualizar">Actualizando</button>
                  <button type="button" className="btn btn-primary mx-2" data-bs-toggle="modal" onClick={() => setprojectoView({ _id, name, startDate, endDate, leader, phase, specificObjectives, generalObjective })} data-bs-target="#MOSTRAR">Mostrar</button>
                  <button type="button" className="btn btn-primary mx-2" data-bs-toggle="modal" onClick={() => setCodigoP(_id)} data-bs-target="#actualizarStudent">Estudiantes</button>
                </td>
                <td>
                  <select disabled={status != "INACTIVE" ? false : true} defaultValue={phase} onChange={e => updatePhaseProject({ variables: { idProject: _id, phase: e.target.value } })}>
                    <option value="WAIT">Esperando</option>
                    <option value="STARTED">Iniciado</option>
                    <option value="IN PROGRESS">En progreso</option>
                    <option value="ENDED">Terminado</option>
                  </select>
                </td>
              </tr>
            ))}

          </tbody>
        </table>
        <button type="button" className="btn btn-primary " data-bs-toggle="modal" data-bs-target="#registro">Registrar</button>
      </>

    )
  } else {
    return (
      <>

        {/* MODULO PARA MOSTRAR  */}
        <div className="modal fade" id="MOSTRAR" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {console.log(projectoView)}
                <p>Nombre:</p>
                <p>{projectoView.name}</p>
                <br />
                <p>StartDate:</p>
                <p>{new Date(parseInt(projectoView.startDate)).toLocaleDateString() == "31/12/1969" ? "dd/mm/aaaa" : new Date(parseInt(projectoView.startDate)).toLocaleDateString()}</p>
                <br />
                <p>endDate:</p>
                <p>{new Date(parseInt(projectoView.endDate)).toLocaleDateString() == "31/12/1969" ? "dd/mm/aaaa" : new Date(parseInt(projectoView.endDate)).toLocaleDateString()}</p>
                <br />
                <p>generalObjective:</p>
                <p>{projectoView.generalObjective}</p>
                <br />
                <p>specificObjectives:</p>
                <p>{projectoView.specificObjectives}</p>
                <br />
                <p>Fullname Leader:</p>
                <p>{projectoView.leader.fullName}</p>
                <br />
                <p>Phase:</p>
                <p>{projectoView.phase}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>

        <table className="table caption-top">
          <caption>List of users</caption>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Projecto</th>
              <th scope="col">StartDate</th>
              <th scope="col">EndDate</th>
              <th scope="col">Accion</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>

            {data?.allProjects?.map(({ _id, name, startDate, endDate, generalObjective, specificObjectives, leader, phase, status }, i) => (
              <tr key={i}>
                <th scope="row">1</th>
                <td>{name}</td>

                <td>{new Date(parseInt(startDate)).toLocaleDateString() == "31/12/1969" ? "dd/mm/aaaa" : new Date(parseInt(startDate)).toLocaleDateString()}</td>
                <td>{new Date(parseInt(endDate)).toLocaleDateString() == "31/12/1969" ? "dd/mm/aaaa" : new Date(parseInt(endDate)).toLocaleDateString()}</td>
                <td><button disabled={status != "INACTIVE" ? false : true} type="button" className="btn btn-primary " onClick={() => registerEnrollment({ variables: { idProject: _id } })}>Registro</button>
                  <button type="button" className="btn btn-primary mx-2" data-bs-toggle="modal" onClick={() => setprojectoView({ _id, name, startDate, endDate, leader, phase, specificObjectives, generalObjective })} data-bs-target="#MOSTRAR">Mostrar</button>
                </td>
                <td>
                  <select disabled={user.role == "ADMIN" ? false : true} defaultValue={status} onChange={e => updateStatusProject({ variables: { idProject: _id, status: e.target.value } })}>
                    <option value="ACTIVE">Activado</option>
                    <option value="INACTIVE">No activado</option>
                  </select>
                </td>
              </tr>
            ))}


          </tbody>
        </table>
      </>
    )
  }

};


export default Projects;