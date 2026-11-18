import * as React from 'react';
import styles from './PanelEdicion.module.scss'
import type { IPanelEdicionProps } from './IPanelEdicionProps';
import {Icon} from '@fluentui/react/lib/Icon'
import FormularioCompetidor from '../FormularioCompetidor/FormularioCompetidor';
import { normalizarNombres } from '../utilidades/normalizarNombres';
import { consultarCompetidorPorId} from '../Servicios/ServicioCompetidores'
import type { ICompetidorSharepoint } from '../models/ICompetidorSharepoint';
import ConfirmarEliminacion from '../ConfirmarEliminacion/ConfirmarEliminacion';


type Operacion = 'nuevo' | 'modificar' | 'eliminar' | undefined;

interface IEstadoPanel  {
    operacion: Operacion,
    competidorId: number | undefined,
    competidorNombre: string | undefined;
    guardando: boolean,
    error: string | undefined
}
const EstadoInicial:IEstadoPanel= {
    operacion: undefined,
    competidorId: undefined,
    competidorNombre: undefined,
    guardando:false,
    error: undefined
}
type Accion =
    | { type: 'NUEVO' }
    | { type: 'MODIFICAR' }
    | { type: 'ELIMINAR' }
    | { type: 'REINICIAR' }
    | {type:  'SELECCIONAR COMPETIDOR'; payload: {id: number, nombre: string}}
    
const reducer = (
    estado: IEstadoPanel,
    accion: Accion
): IEstadoPanel => {
    switch (accion.type) {
        case 'NUEVO':
            return {
                ...estado,
                operacion:'nuevo',
                competidorId:undefined,
                error: undefined
            };

        case 'MODIFICAR':
            return {
                ...estado,
                operacion:'modificar',
                competidorId:undefined,
                error: undefined
            };

        case 'ELIMINAR':
            return {
                ...estado,
                operacion:'eliminar',
                competidorId:undefined,
                error: undefined
            };

        case 'REINICIAR':
            return EstadoInicial;

        case 'SELECCIONAR COMPETIDOR':
            return {
                ...estado,
                competidorId: accion.payload.id,
                competidorNombre: accion.payload.nombre,
                error: undefined
            }

        default:
            return estado;
    }
};
const PanelEdicion  =(props : IPanelEdicionProps):React.ReactElement =>{
    //estados
  const [estado, dispatch] = React.useReducer(reducer,EstadoInicial)
  const [textoBusqueda, setTextoBusqueda] = React.useState<string>('');
  const [competidorParaEditar,setCompetidorParaEditar]= React.useState<ICompetidorSharepoint | null>(null);
  const [mensajeEliminacion,setMensajeEliminacion]= React.useState<string>('');
  //funciones
  const competidoresEncontrados= textoBusqueda.trim()
    ? props.competidores.filter(competidor => 
        normalizarNombres(competidor.nombre)
        .includes(normalizarNombres(textoBusqueda))
    )
    : [];
//funciones

//consulta api
React.useEffect(()=> {
    let activo = true;
    if (estado.operacion !== 'modificar' || 
        estado.competidorId === undefined
    ){
        setCompetidorParaEditar(null);
        return;
    }
    const id = estado.competidorId;
    const cargarCompetidor = async():Promise<void> => {
        try {
            const datos = await consultarCompetidorPorId( 
                props.spHttpClient,
                id);
            if (activo){
                setCompetidorParaEditar(datos)
            }
        } catch (error) {
             console.error('Error al recuperar competidor:', error);
        }
    };
    cargarCompetidor().catch(error=> {
        console.log('Error inesperado en la consulta de competidor por Id',error)
    });
    return() => {
        activo=false
    }
},[props.spHttpClient,estado.competidorId,estado.operacion])
//=====================================================================================
   
return (
    <div className={styles.panelEdicion}>
        {mensajeEliminacion && (
    <p className={styles.mensajeEliminacion}>
        {mensajeEliminacion}
    </p>
        )}
        {/* ENCABEZADO */}
        <header className={styles.encabezado}>
            <h2>
                 <svg
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#078C87"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M4 7h9" />
                    <path d="M17 7h3" />
                    <circle cx="15" cy="7" r="2" />
                    <path d="M4 17h3" />
                    <path d="M11 17h9" />
                    <circle cx="9" cy="17" r="2" />
                </svg>
                Panel de Edición</h2>

            <button
                type="button"
                onClick={props.onCerrar}
                className={styles.botonCerrar}
                aria-label="Cerrar panel de edición"
            >
                ✕
            </button>
        </header>

        {/* BOTONES DE OPERACIÓN */}
        <div className={styles.opciones}>

            <button
                type="button"
                className={estado.operacion === 'nuevo' ? styles.activo : ''}
                onClick={() => dispatch({ type: 'NUEVO' })}
            >
                <Icon iconName="Add" />
                Nuevo
            </button>

            <button
                type="button"
                className={estado.operacion === 'modificar' ? styles.activo : ''}
                onClick={() => dispatch({ type: 'MODIFICAR' })}
            >
                <Icon iconName="Edit" />
                Modificar
            </button>

            <button
                type="button"
                className={estado.operacion === 'eliminar' ? styles.activo : ''}
                onClick={() => dispatch({ type: 'ELIMINAR' })}
            >
                <Icon iconName="Delete" />
                Eliminar
            </button>

        </div>

        {/* PANTALLA DE BIENVENIDA */}
        {estado.operacion === undefined && (
            <div className={styles.bienvenida}>
                <Icon
                    iconName="ClipboardList"
                    className={styles.iconoBienvenida}
                />

                <h3>Administración de competidores</h3>

                <p>
                    Seleccioná una operación para trabajar con los
                    registros de Competidores Nacionales.
                </p>

                <span>
                    Podés incorporar nuevas empresas, actualizar información
                    existente o eliminar registros.
                </span>
            </div>
        )}

        {/* NUEVO COMPETIDOR */}
        {estado.operacion === 'nuevo' && (
            <div>
                <FormularioCompetidor
                    onCancelar={() => dispatch({ type: 'REINICIAR' })}
                    spHttpClient={props.spHttpClient}
                    onCompetidorCreado={props.onCompetidorCreado}
                />
            </div>
        )}

        {/* BUSCADOR COMPARTIDO: MODIFICAR Y ELIMINAR */}
        {(estado.operacion === 'modificar' ||
          estado.operacion === 'eliminar') && (

            <div className={styles.buscadorCompetidor}>

                <label htmlFor="buscarCompetidor">
                    {estado.operacion === 'eliminar'
                        ? 'Buscar Empresa para Eliminar'
                        : 'Buscar Empresa para Modificar'}
                </label>

                <input
                    type="text"
                    id="buscarCompetidor"
                    placeholder="Escribí el nombre de la empresa"
                    value={textoBusqueda}
                    onChange={(e) => setTextoBusqueda(e.target.value)}
                />

                {/* RESULTADOS DE LA BÚSQUEDA */}
                {competidoresEncontrados.map(competidor => (
                    <button
                        key={competidor.id}
                        type="button"
                        onClick={() =>
                            dispatch({
                                type: 'SELECCIONAR COMPETIDOR',
                                payload: {
                                    id: competidor.id,
                                    nombre: competidor.nombre
                                }
                            })
                        }
                    >
                        {competidor.nombre}
                    </button>
                ))}

                {/* EMPRESA SELECCIONADA */}
                {estado.competidorId !== undefined && (
                    <div className={styles.empresaSeleccionada}>
                        <strong>Empresa seleccionada:</strong>
                        <p>{estado.competidorNombre}</p>
                        <small>ID: {estado.competidorId}</small>
                    </div>
                )}

                {/* FORMULARIO PARA MODIFICAR */}
                {estado.operacion === 'modificar' &&
                 competidorParaEditar && (

                    <FormularioCompetidor
                        key={competidorParaEditar.Id}
                        spHttpClient={props.spHttpClient}
                        onCancelar={() => dispatch({ type: 'REINICIAR' })}
                        onCompetidorCreado={props.onCompetidorCreado}
                        competidorParaEditar={competidorParaEditar}
                    />
                )}

                {/* CONFIRMACIÓN PARA ELIMINAR */}
                {estado.operacion === 'eliminar' &&
                 estado.competidorId !== undefined && (
                    <ConfirmarEliminacion 
                        spHttpClient={props.spHttpClient}
                        competidorId={estado.competidorId}
                        competidorNombre={estado.competidorNombre ?? ''}
                        onCompetidorEliminado={(id)=>{
                            props.onCompetidorCreado(id);
                            dispatch ({type:'REINICIAR'});
                            setTextoBusqueda('');
                            setMensajeEliminacion(
                                `Competidor eliminado Correctamente ID: ${id}`
                            )
                        }}
                        />                    
                )}

            </div>
        )}

    </div>
    );
}
export default PanelEdicion