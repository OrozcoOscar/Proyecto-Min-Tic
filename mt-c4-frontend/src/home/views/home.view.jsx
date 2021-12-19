// vendors
import React, { useState, useEffect } from "react";
import { useMutation, useQuery, gql } from '@apollo/client';
import { Formik } from "formik";
import * as Yup from 'yup';
import Alert from 'react-bootstrap/Alert';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import { Link } from 'react-router-dom';



const USERDATA = gql`
query User {
  user {
  name  
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

const LookProjectEnrollment = gql`
query User {
  user {
    enrollments {
      project {
        _id
        name
        phase
      }
    }
  }
}
`;
const LookAdvances = gql`
query AllAdvanceProject($idProject: ID!) {
  allAdvanceProject(_idProject: $idProject) {
  _id
  addDate
  description
  observations  
  }
}
`;
const CreateAdvances = gql`
mutation RegisterAdvance($input: RegisterInputAdvances!, $idProject: ID!) {
  registerAdvance(input: $input, _idProject: $idProject) {
    _id
  }
}
`;
const updateAvances = gql`
mutation UpdateAdvances($input: updateInputAdvances!, $idAdvances: ID!) {
  updateAdvances(input: $input, idAdvances: $idAdvances) {
  _id  
  }
}
`;
const ListAvances = gql`
query ListarAdvances($idProject: ID!) {
  listarAdvances(idProject: $idProject) {
    _id
    addDate
    description
    observations  
  }
}
`;

const validationSchema = Yup.object({
  description: Yup.string().required('Campo requerido'),
  observations: Yup.string().required('Campo requerido'),
})


const Home = ({setStatusDatos,setData2, getAdvance, setData, setUser, user, ChangeVisual, idAvances }) => {


  let user2 = JSON.parse(sessionStorage.getItem("User"))
  const { data } = useQuery(USERDATA);
  const dataLook = useQuery(LookProjectEnrollment).data;
  const dataVProject = useQuery(ProjectAllVisual).data;

  const [RegisterAdvances] = useMutation(CreateAdvances);
  const [ActualizandoAvances] = useMutation(updateAvances);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [codigo2, setCodigo2] = useState("");
  const dataAdvance = useQuery(LookAdvances, {
    variables: {
      idProject: codigo
    }
  }).data;
  const avancesList = useQuery(ListAvances, {
    variables: {
      idProject: codigo2
    }
  }).data;


  const initialValues = {
    description: '',
    observations: '',
  };
  const initialValues2 = {
    description: '',
    observations: '',
  };
  const initialValues3 = {
    description: '',
  };

  useEffect(() => {
    setUser((user2.name))

  }, [])

  useEffect(() => {
    setData(dataAdvance)
    setStatusDatos(true)
  }, [dataAdvance])

  useEffect(() => {
    setData2(avancesList)
    setStatusDatos(false)
  }, [avancesList])


  if (user2 == undefined) {
    user2 = { name: '', role: '' }
  }

  if (user2.role == "STUDENT") {
    return (

      <>
        {/* MODULO PARA REGISTRAR   */}
        <div className="modal fade" id="registroAdvance" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                    RegisterAdvances({
                      variables: {
                        input: {
                          ...values,
                        },
                        idProject: codigo
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
                    <Form noValidate onSubmit={(e) => { handleSubmit(e); window.location.reload("/") }}>

                      <Form.Group className="mb-3" controlId="formdescription">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                          name="description"
                          placeholder="Ingresa tu descipcion"
                          isInvalid={touched.description && !!errors.description}
                          {...getFieldProps('description')}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.description}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formobservations">
                        <Form.Label>GeneralObjective</Form.Label>
                        <Form.Control
                          name="observations"
                          placeholder="Ingresar su observacion"
                          isInvalid={touched.observations && !!errors.observations}
                          {...getFieldProps('observations')}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.observations}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Button type="submit" >Enviar</Button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
        {/* MODULO PARA ACTUALIZAR AVANCES   */}
        <div className="modal fade" id="actualizarAvances" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Actualizacion</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <Formik
                  initialValues={initialValues2}
                  // validationSchema={validationSchema}
                  onSubmit={(values) => {
                    ActualizandoAvances({
                      variables: {
                        input: {
                          ...values,
                        },
                        idAdvances: idAvances
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
                    <Form noValidate onSubmit={(e) => { handleSubmit(e); window.location.reload("/") }}>

                      <Form.Group className="mb-3" controlId="formdescription">
                        <Form.Label>description</Form.Label>
                        <Form.Control
                          name="description"
                          placeholder="Ingresa tu descipcion"
                          isInvalid={touched.description && !!errors.description}
                          {...getFieldProps('description')}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formobservations">
                        <Form.Label>GeneralObjective</Form.Label>
                        <Form.Control
                          name="observations"
                          placeholder="Ingresar su observacion"
                          isInvalid={touched.observations && !!errors.observations}
                          {...getFieldProps('observations')}
                        />
                      </Form.Group>
                      <Button type="submit" >Enviar</Button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
        {/* MODULO PARA MOSTRAR AVANCES  */}
        <div className="modal fade" id="MostrarAvances" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Actualizacion</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p>Descripcion</p>
                <p>{getAdvance.description}</p>
                <br />
                <p>Observaciones</p>
                <p>{getAdvance.observations}</p>
                <br />
              </div>
            </div>
          </div>
        </div>


        <div className="VisualProject">

          {dataLook?.user?.enrollments?.map((a) => {
            return a.project?.map(({ _id, name, phase }) => {

              return (
                <div className="card" style={{ width: "18rem" }}>
                  <div className="card-body">
                    <h5 className="card-title">{name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{phase}</h6>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <button type="button" className="btn btn-primary " data-bs-toggle="modal" onClick={() => setCodigo(_id)} data-bs-target="#registroAdvance">Añadir avances</button>
                    <button type="button" className="btn btn-secondary mx-3" onClick={() => {
                      setCodigo(_id)
                      ChangeVisual()
                    }}>Ver Avances</button>
                  </div>
                </div>
              )
            })
          })}
        </div>
      </>
    );

  } else if (user2.role == "LEADER") {
    return (

      <>
        {/* MODULO PARA ACTUALIZAR AVANCES  LISTADOS */}
        <div className="modal fade" id="actualizarAvances" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Actualizacion</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <Formik
                  initialValues={initialValues2}
                  // validationSchema={validationSchema}
                  onSubmit={(values) => {
                    ActualizandoAvances({
                      variables: {
                        input: {
                          ...values,
                        },
                        idAdvances: idAvances
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
                    <Form noValidate onSubmit={(e) => { handleSubmit(e); window.location.reload("/") }}>

                      <Form.Group className="mb-3" controlId="formdescription">
                        <Form.Label>description</Form.Label>
                        <Form.Control
                          name="description"
                          placeholder="Ingresa tu descipcion"
                          isInvalid={touched.description && !!errors.description}
                          {...getFieldProps('description')}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formobservations">
                        <Form.Label>GeneralObjective</Form.Label>
                        <Form.Control
                          name="observations"
                          placeholder="Ingresar su observacion"
                          isInvalid={touched.observations && !!errors.observations}
                          {...getFieldProps('observations')}
                        />
                      </Form.Group>
                      <Button type="submit" >Enviar</Button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
        {/* MODULO PARA ACTUALIZAR AVANCES  LISTADOS LEADER */}
        <div className="modal fade" id="actualizarAvancesleader" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Actualizacion</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <Formik
                  initialValues={initialValues3}
                  // validationSchema={validationSchema}
                  onSubmit={(values) => {
                    ActualizandoAvances({
                      variables: {
                        input: {
                          ...values,
                        },
                        idAdvances: idAvances
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
                    <Form noValidate onSubmit={(e) => { handleSubmit(e); window.location.reload("/") }}>

                      <Form.Group className="mb-3" controlId="formdescription">
                        <Form.Label>description</Form.Label>
                        <Form.Control
                          name="description"
                          placeholder="Ingresa tu descipcion"
                          isInvalid={touched.description && !!errors.description}
                          {...getFieldProps('description')}
                        />
                      </Form.Group>
                      <Button type="submit" >Enviar</Button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
        {/* MODULO PARA MOSTRAR AVANCES  */}
        <div className="modal fade" id="MostrarAvances" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Actualizacion</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p>Descripcion</p>
                <p>{getAdvance.description}</p>
                <br />
                <p>Observaciones</p>
                <p>{getAdvance.observations}</p>
                <br />
              </div>
            </div>
          </div>
        </div>


        <div className="VisualProject">
          {dataVProject?.allProjectsVisual?.map(({ _id, name, phase }) => (
            <div className="card" style={{ width: "18rem" }}>
              <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{phase}</h6>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <button type="button" className="btn btn-secondary mx-3" onClick={() => {
                  setCodigo2(_id)
                  ChangeVisual()
                }}>Ver Avances</button>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }else{
    return(
      <p>HOLA</p>
    )
  }

};

export default Home;
