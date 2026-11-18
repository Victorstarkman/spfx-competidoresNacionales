import * as React from 'react';
import styles from './FormularioCompetidor.module.scss';
import type { IFormularioCompetidorProps } from './IFormularioCompetidorProps';
import { Icon } from '@fluentui/react/lib/Icon';
import {esquemaCompetidor} from '../validaciones/esquemaCompetidor';
import { consultarOpcionesCampo, crearCompetidor, existeCompetidor,actualizarCompetidor } from '../Servicios/ServicioCompetidores'
import { transformarCompetidorParaSharepoint, transformarCompetidorParaFormulario} from '../Servicios/transformarCompetidor'
import { ICompetidorParaGuardar,TipoActor } from '../models/ICompetidorParaGuardar';
import { obtenerFechaHoy } from '../utilidades/fecha';


interface IEstadoFormulario {
    nombre: string;
    tipoActor: TipoActor;
    perfil: string[];
    mercado: string;
    alcance: string[];
    cobertura: string;
    fortalezaPrincipal: string;
    clientesComprobados: string;
    nivelEvidencia: string;
    ultimaVerificacion: string;
    web: string;
    logo: string;
    estadoAnalisis: string;
}
type AccionFormulario = {
    [K in keyof IEstadoFormulario]: {
        type: 'CAMBIAR_CAMPO';
        payload: {
            campo: K;
            valor: IEstadoFormulario[K];
        };
    };
}[keyof IEstadoFormulario] | {
    type: 'LIMPIAR';
} | {
    type: 'CARGAR_COMPETIDOR';
    payload: IEstadoFormulario
};

const EstadoFormularioInicial:IEstadoFormulario= {
    nombre: '',
    tipoActor: '',
    perfil: [],
    mercado: '',
    alcance: [],
    cobertura: '',
    fortalezaPrincipal: '',
    clientesComprobados: '',
    nivelEvidencia: '',
    ultimaVerificacion: '',
    web: '',
    logo: '',
    estadoAnalisis:'' 
}
const reducerFormulario=(
    estado: IEstadoFormulario,
    accion: AccionFormulario
): IEstadoFormulario => {
    switch(accion.type){
        case 'CAMBIAR_CAMPO':
        return{
            ...estado,
            [accion.payload.campo]: accion.payload.valor
        }
        case 'LIMPIAR':
            return EstadoFormularioInicial
        
        case 'CARGAR_COMPETIDOR':
            return accion.payload;
        default :
            return estado    
    }
}

const FormularioCompetidor = (props: IFormularioCompetidorProps):React.ReactElement =>{
   //estado 
    const [estado,dispatch ] = React.useReducer(reducerFormulario,EstadoFormularioInicial);
    const [errores,setErrores] = React.useState<Record<string, string>>({});
    const [opcionesPerfil,setOpcionesPerfil]= React.useState<string[]>([]);
    const [opcionesAlcance,setOpcionesAlcance]= React.useState<string[]>([]);
    const [opcionesNivelEvidencia,setOpcionesNivelEvidencia]= React.useState<string[]>([]);
    const [opcionesEstadoAnalisis,setOpcionesEstadoAnalisis]= React.useState<string[]>([]);
    const [opcionesMercado,setOpcionesMercado]= React.useState<string[]>([]);
    const [opcionesTipoActor,setOpcionesTipoActor]= React.useState<string[]>([]);
    const [guardando, setGuardando] = React.useState<boolean>(false);
    const [mensajeExito, setMensajeExito] = React.useState('');
    const [mensajeError, setMensajeError] = React.useState('');
    //funciones
    const limpiarError = (campo: string): void => {
    setErrores(erroresActuales => {
        const nuevosErrores = { ...erroresActuales };
        delete nuevosErrores[campo];
        return nuevosErrores;
    });
};
    const cambiarSeleccion = (
        campo: 'perfil' | 'alcance',
        valor: string
        ): void => {

        const valoresActuales = estado[campo];

        const existe = valoresActuales.indexOf(valor) !== -1;

        const nuevosValores = existe
            ? valoresActuales.filter(item => item !== valor)
            : [...valoresActuales, valor];

            if (campo === 'perfil') {
            dispatch({
                type: 'CAMBIAR_CAMPO',
                payload: {
                    campo: 'perfil',
                    valor: nuevosValores
                }
            });
        } else {
            dispatch({
                type: 'CAMBIAR_CAMPO',
                payload: {
                    campo: 'alcance',
                    valor: nuevosValores
                }
            });
        }
        limpiarError(campo);
    };
    const validarFormulario = (
        datos: ICompetidorParaGuardar
    ):boolean =>{
        const resultado = esquemaCompetidor.safeParse(datos);
        if (!resultado.success){
           const nuevosErrores: Record<string, string>= {};
           
           resultado.error.issues.forEach(issue => {
            const campo= String(issue.path[0]);
            nuevosErrores[campo]= issue.message;
           })

            setErrores(nuevosErrores)
            
            return false
        }
        //console.log('Datos válidos:', resultado.data);
        setErrores({});
        return true;
    }
    const guardarCompetidor = async ():Promise<void> => {
        setMensajeExito('');
        setMensajeError('');
        const datosParaGuardar = {
            ...estado,
            ultimaVerificacion: obtenerFechaHoy()
        }
        if(!validarFormulario(datosParaGuardar)){
            return
        }
        const datosParaSharepoint = transformarCompetidorParaSharepoint(datosParaGuardar);
        try {
            setGuardando(true);
            const duplicado =await existeCompetidor (props.spHttpClient,
                 datosParaGuardar.nombre,
                 props.competidorParaEditar?.Id)
            if(duplicado){
                setErrores({
                    ...errores,
                    nombre: 'Ya existe otro competidor con ese nombre'
                })
            }     
            if (props.competidorParaEditar) {

                // MODIFICAR COMPETIDOR EXISTENTE

                const id = props.competidorParaEditar.Id;

                await actualizarCompetidor(
                    props.spHttpClient,
                    datosParaSharepoint,
                    id,
                );

                props.onCompetidorCreado(id);

                setMensajeExito(
                    `Competidor actualizado correctamente. ID: ${id}`
                );

                setErrores({});

            } else {

        // CREAR COMPETIDOR NUEVO

        const idCreado = await crearCompetidor(
            props.spHttpClient,
            datosParaSharepoint
        );

        props.onCompetidorCreado(idCreado);

        setMensajeExito(
            `Competidor creado correctamente. ID: ${idCreado}`
        );

            dispatch({ type: 'LIMPIAR' });
            setErrores({});
            }
        } catch (error) {
            console.error('Error al guardar competidor:', error);
            setMensajeError(
                error instanceof Error
                ?  `No se pudo guardar el competidor: ${error.message}`
                : 'No se pudo guardar el competidor.'
            )
        } finally {
            setGuardando(false);
        }
    };
    //borrado de error de campos 
    //consultas a API 
    React.useEffect(() =>{
        let activo= true;
       
        const cargarOpciones = async():Promise<void>=>{
            try {
                const perfil = await consultarOpcionesCampo(
                    props.spHttpClient,
                    'Perfil'
                );
                const alcance = await consultarOpcionesCampo(
                    props.spHttpClient,
                    'Alcance'
                );
                const niveles = await consultarOpcionesCampo(
                    props.spHttpClient,
                    'NivelEvidencia'
                );
                const estados = await consultarOpcionesCampo(
                    props.spHttpClient,
                    'EstadoAnalisis'
                );
                const mercado = await consultarOpcionesCampo(
                    props.spHttpClient,
                    'Mercado'
                );
                const tipoActor = await consultarOpcionesCampo(
                    props.spHttpClient,
                    'TipoActor'
                );
            
                if(activo){
                    setOpcionesPerfil(perfil);
                    setOpcionesAlcance(alcance);
                    setOpcionesEstadoAnalisis(estados);
                    setOpcionesNivelEvidencia(niveles);
                    setOpcionesMercado(mercado);
                    setOpcionesTipoActor(tipoActor);
                }
           
            } catch (error) {
            console.error('Error cargando opciones:', error);
            }
        };
        cargarOpciones().catch(error => {
        console.error('Error inesperado:', error);
        });
        return ()=>{ activo= false}
    },[props.spHttpClient])

    React.useEffect(()=> {
        if (props.competidorParaEditar){
            const dataFormulario = transformarCompetidorParaFormulario(props.competidorParaEditar);
            dispatch({type:'CARGAR_COMPETIDOR', payload: dataFormulario});
        }
    },[props.competidorParaEditar])
    return (
    <section className={styles.formulario}>

        <h3>{props.competidorParaEditar ? 'Modificar Competidor': 'Nuevo Competidor'}</h3>
        <div className={styles.campo}>
            <label htmlFor="nombreCompetidor">
                Nombre de la empresa
            </label>
       
            <input
                id="nombreCompetidor"
                type="text"
                placeholder="Ingresá el nombre de la empresa"
                value = {estado.nombre}
                onChange={(e) => {
                    dispatch({
                        type: 'CAMBIAR_CAMPO',
                        payload: {
                            campo: 'nombre',
                            valor: e.currentTarget.value
                        }
                    });

                    limpiarError('nombre');
                }}
            />
             <span className={styles.mensajeError}>
                {errores.nombre}
            </span>
            <label htmlFor="tipoActor">Tipo de Empresa</label>
            <select
                id="tipoActor"
                name="tipoActor"
                value={estado.tipoActor}
                onChange={(e) =>{ dispatch({
                    type: 'CAMBIAR_CAMPO',
                    payload: {
                        campo: 'tipoActor',
                        valor: e.currentTarget.value as TipoActor
                    }
                });
                limpiarError('tipoActor');
            }}
            >
                <option value="">Seleccionar tipo de actor</option>

                {opcionesTipoActor.map(opcion => (
                    <option key={opcion} value={opcion}>
                        {opcion}
                    </option>
                ))}
            </select>
                {errores.tipoActor && (
                    <span className={styles.mensajeError}>
                        {errores.tipoActor}
                    </span>
                )}
                <label htmlFor="mercado">Mercado</label>

                <select
                    id="mercado"
                    name="mercado"
                    value={estado.mercado}
                    onChange={(e) => {dispatch({
                        type: 'CAMBIAR_CAMPO',
                        payload: {
                            campo: 'mercado',
                            valor: e.currentTarget.value
                        }
                    });
                    limpiarError('mercado')
                }}
                >
                    <option value="">Seleccionar mercado</option>

                    {opcionesMercado.map(opcion => (
                        <option key={opcion} value={opcion}>
                            {opcion}
                        </option>
                    ))}
                </select>
                {errores.mercado && (
                    <span className={styles.mensajeError}>
                        {errores.mercado}
                    </span>
                )}
                  <label htmlFor="cobertura">Cobertura</label>

                    <input
                        id="cobertura"
                        name="cobertura"
                        type="text"
                        placeholder="Ej.: Nacional, CABA, Mendoza..."
                        value={estado.cobertura}
                        onChange={(e) => dispatch({
                            type: 'CAMBIAR_CAMPO',
                            payload: {
                                campo: 'cobertura',
                                valor: e.currentTarget.value
                            }
                        })}
                    />
                       <label>Perfil</label>

                    <div className={styles.opcionesMultiples}>

                        {opcionesPerfil.map(opcion => (
                            <label key={opcion} className={styles.opcionCheckbox}>

                                <input
                                    type="checkbox"
                                    checked={estado.perfil.indexOf(opcion) !== -1}
                                    onChange={() => cambiarSeleccion('perfil', opcion)}
                                />

                                <span>{opcion}</span>

                            </label>
                        ))}
                    </div>
                        {errores.perfil && (
                            <span className={styles.mensajeError}>
                                {errores.perfil}
                            </span>
                        )}
                     <label>Alcance</label>

                    <div className={styles.opcionesMultiples}>
                        {opcionesAlcance.map(opcion => (
                            <label
                                key={opcion}
                                className={styles.opcionCheckbox}
                            >
                                <input
                                    type="checkbox"
                                    name="alcance"
                                    value={opcion}
                                    checked={estado.alcance.indexOf(opcion) !== -1}
                                    onChange={() => 
                                        cambiarSeleccion('alcance', opcion)}
                                />

                                <span>{opcion}</span>
                            </label>
                        ))}
                    </div>
                     {errores.alcance && (
                            <span className={styles.mensajeError}>
                                {errores.alcance}
                            </span>
                        )}
                      <label htmlFor="fortalezaPrincipal">
                        Fortaleza principal
                    </label>

                    <textarea
                        id="fortalezaPrincipal"
                        name="fortalezaPrincipal"
                        rows={3}
                        placeholder="Describí la principal fortaleza del competidor"
                        value={estado.fortalezaPrincipal}
                        onChange={(e) => dispatch({
                            type: 'CAMBIAR_CAMPO',
                            payload: {
                                campo: 'fortalezaPrincipal',
                                valor: e.currentTarget.value
                            }
                        })}
                    />
                      <label htmlFor="clientesComprobados">
                    Clientes comprobados
                </label>

                <textarea
                    id="clientesComprobados"
                    name="clientesComprobados"
                    rows={3}
                    placeholder="Ingresá los clientes cuya relación esté documentada"
                    value={estado.clientesComprobados}
                    onChange={(e) => dispatch({
                        type: 'CAMBIAR_CAMPO',
                        payload: {
                            campo: 'clientesComprobados',
                            valor: e.currentTarget.value
                        }
                    })}
                />
                  <label htmlFor="web">Sitio web</label>

                    <input
                        id="web"
                        name="web"
                        type="url"
                        placeholder="https://www.empresa.com.ar"
                        value={estado.web}
                        onChange={(e) =>{ dispatch({
                            type: 'CAMBIAR_CAMPO',
                            payload: {
                                campo: 'web',
                                valor: e.currentTarget.value
                            }
                        })
                        limpiarError('web')
                    }}
                    />
                   {errores.web && (
                        <span className= {styles.mensajeError}>
                            {errores.web}
                        </span>
                   )}
                    <label htmlFor="logo">URL del logo</label>

                    <input
                        id="logo"
                        name="logo"
                        type="url"
                        placeholder="https://www.empresa.com.ar/logo.png"
                        value={estado.logo}
                        onChange={(e) => {dispatch({
                            type: 'CAMBIAR_CAMPO',
                            payload: {
                                campo: 'logo',
                                valor: e.currentTarget.value
                            }
                        })
                         limpiarError('logo')
                    }}
                    />
                    {errores.logo && (
                        <span className= {styles.mensajeError}>
                            {errores.logo}
                        </span>
                   )}
                  
                <label htmlFor="nivelEvidencia">
                    Nivel de evidencia
                </label>

                <select
                    id="nivelEvidencia"
                    name="nivelEvidencia"
                    value={estado.nivelEvidencia}
                    onChange={(e) => {dispatch({
                        type: 'CAMBIAR_CAMPO',
                        payload: {
                            campo: 'nivelEvidencia',
                            valor: e.currentTarget.value
                        }
                    })
                    limpiarError('nivelEvidencia');
                }}
                >
                    <option value="">Seleccionar nivel de evidencia</option>

                    {opcionesNivelEvidencia.map(opcion => (
                        <option key={opcion} value={opcion}>
                            {opcion}
                        </option>
                    ))}
                </select>
                {errores.nivelEvidencia && (
                    <span className={styles.mensajeError}>
                        {errores.nivelEvidencia}
                    </span>
                )}
                <label htmlFor="estadoAnalisis">
                    Estado del análisis
                </label>

                <select
                    id="estadoAnalisis"
                    name="estadoAnalisis"
                    value={estado.estadoAnalisis}
                    onChange={(e) => {dispatch({
                        type: 'CAMBIAR_CAMPO',
                        payload: {
                            campo: 'estadoAnalisis',
                            valor: e.currentTarget.value
                        }
                    })
                    limpiarError('estadoAnalisis');
                }}
                >
                    <option value="">Seleccionar estado del análisis</option>

                    {opcionesEstadoAnalisis.map(opcion => (
                        <option key={opcion} value={opcion}>
                            {opcion}
                        </option>
                    ))}
                </select>
                {errores.estadoAnalisis && (
                    <span className={styles.mensajeError}>
                        {errores.estadoAnalisis}
                    </span>
                )}
        </div>
        <div className={styles.acciones}>
            <button
                type="button"
                className={styles.botonCancelar}
                onClick={()=>dispatch({type:'LIMPIAR'})}
            >
                <Icon iconName="Clear" />
                Limpiar Formulario
            </button>
            <button
                type="button"
                className={styles.botonGuardar}
                disabled= {guardando}
                onClick={() => {
                     guardarCompetidor().catch(error => {
                        console.error('Error inesperado:', error);
                    });
                    
                }}
            >
                <Icon iconName='Save'/>
                {guardando ?
                     ('Guardando...')
                    : props.competidorParaEditar
                        ? 'Guardar Cambios'
                        :'Crear Competidor'}
            </button>
        </div>
        {mensajeExito && (
            <p className= {styles.mensajeExito} role="status">
                {mensajeExito}
            </p>
        )}
        {mensajeError && (
            <p className= {styles.mensajeErrorGuardado} role="alert">
                {mensajeError}
            </p>
        )}
    </section>
    );
}
export default FormularioCompetidor