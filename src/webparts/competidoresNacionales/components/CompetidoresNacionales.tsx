import * as React from 'react';
import styles from './CompetidoresNacionales.module.scss';
import type { ICompetidoresNacionalesProps } from './ICompetidoresNacionalesProps';
import TarjetaCompetidor from './TarjetaCompetidor/TarjetaCompetidor';
import DetalleCompetidor from './DetalleCompetidor/DetalleCompetidor';
import { consultarCompetidores,consultarCronologia } from './Servicios/ServicioCompetidores';
import type { ICompetidor } from './models/ICompetidor';
import type { IAntecedente } from './models/IAntecedents';
import PanelEdicion from './PanelEdicion/PanelEdicion';
import { createPortal } from 'react-dom';
import PanelEstadistica from './PanelEstadistica/PanelEstadistica';

const CompetidoresNacionales = (
  props: ICompetidoresNacionalesProps
): React.ReactElement => {
  //estados
  const [competidorSeleccionado,setCompetidorSeleccionado] = React.useState<number | null>(null);
  const [competidoresReales,setCompetidoresReales] = React.useState<ICompetidor[]>([])
  const [antecedentes, setAntecedentes] = React.useState<IAntecedente[]>([]);
  const [textoBusqueda,setTextoBusqueda]= React.useState<string>('')
  const [filtroTipoActor,setFiltroTipoActor] = React.useState<string>('Todos');
  const [panelEdicionAbierto,setPanelEdicionAbierto] = React.useState<boolean>(false);
  const [panelEstadisticaAbierto, setPanelEstadisticaAbierto] = React.useState<boolean>(false);
  //filtros
   const competidoresOrdenados = [...competidoresReales].sort((a, b) => a.nombre.localeCompare(b.nombre,'es',{
    sensitivity: 'base'
  }));
  const competidoresFiltrados = competidoresOrdenados.filter((item)=> {
    const coincideNombre = item.nombre 
    .toLowerCase()
    .includes(textoBusqueda.trim().toLowerCase());

    const tipo = item.tipoActor?.trim() ?? '';

    const coincideTipo =
      filtroTipoActor === 'Todos' ||
      (filtroTipoActor === 'Sin clasificación'
          ? tipo === ''
          : tipo === filtroTipoActor);
      return coincideNombre && coincideTipo
    })
  //fin de filtros
  //paginacion
  const [paginaActual, setPaginaActual] = React.useState<number>(1);
  const elementoPorPagina=8;
  const totalPaginas = Math.ceil(
    competidoresFiltrados.length/ elementoPorPagina
  );
  const indiceInicial = (paginaActual-1)*elementoPorPagina;
 

  const competidoresVisibles= competidoresFiltrados.slice(indiceInicial,indiceInicial+elementoPorPagina);
  //fin de paginacion
  //Contadores
  const totalCompetidores= competidoresReales.length;
  const totalPrimarios = competidoresReales.filter( item => item.tipoActor === 'Primario').length;
  const totalSecundarios = competidoresReales.filter( item => item.tipoActor === 'Secundario').length;
  const totalReferencia = competidoresReales.filter( item => item.tipoActor === 'Referencia').length;
  const totalSinClasificacion = competidoresReales.filter( item => !item.tipoActor?.trim() ).length;
  //fin de contadores
  //definiciones
 
  //funciones
  const empresaSeleccionada = competidoresReales.find(
    item => item.id === competidorSeleccionado
  )
  const antecedentesEmpresa = empresaSeleccionada
    ? antecedentes
        .filter(item =>
            item.mostrarEnCronologia &&
            (
                item.adjudicatariosIds.indexOf(empresaSeleccionada.id) !== -1 ||
                item.empresasParticipantesIds.indexOf(empresaSeleccionada.id) !== -1
            )
        )
        .sort((a, b) =>
            new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        )
    : [];
  const actualizarCompetidores=(id: number): void=> {
    const recargar = async () : Promise<void> => {
      try {
        const datos = await consultarCompetidores(
          props.spHttpClient
        );
        setCompetidoresReales(datos);
        setPaginaActual(1);
        console.log('Competidor incorporado ID:',id);

      } catch (error) {
        console.log('Error actualizando competidores',error)
      }
    }
    recargar().catch(error =>{
      console.log('Error inesperado: ',error)
    })
  };

  //===========================================
  //llamado a api
  React.useEffect(()=>{
    let activo = true;
    const cargarDatos =  async (): Promise<void> => {
      try {
        const datosCompetidores = await consultarCompetidores(
          props.spHttpClient
        );
        //console.log('Competidores transformados:', datosCompetidores);
        const datosCronologia = await consultarCronologia(
          props.spHttpClient
        );
         //console.log('Antecedentes transformados:', datosCronologia);
        if(activo){
          setCompetidoresReales(datosCompetidores);
          setAntecedentes(datosCronologia);
          //console.log('Competidores Sharepoint',datosCompetidores);
          //console.log('Cronologia Sharepoint',datosCronologia);
        }
      } catch (error) {
         if (activo) {
                console.error('Error consultando SharePoint:', error);
            };
      }
    }
    cargarDatos().catch(error => {
    console.error('Error al iniciar la carga:', error);
  });
  return () => {
    activo = false;
};
  },[props.spHttpClient])

   return (
    <section className= {styles.competidoresNacionales}>
      <header className= {styles.encabezado}>
        <h1>Mapa de Competidores Nacionales</h1>
        <p>Observatorio de competencia en medicina laboral</p>
         <div className={styles.informacionGeneral}>
            <p className={styles.resumen}>
                <strong>{totalCompetidores}</strong> relevados ·{' '}
                <strong>{totalPrimarios}</strong> primarios ·{' '}
                <strong>{totalSecundarios}</strong> secundarios ·{' '}
                <strong>{totalReferencia}</strong> referencias ·{' '}
                <strong>{totalSinClasificacion}</strong> sin clasificación
            </p>
  <div className={styles.herramientas}>
    <input
        type="text"
        placeholder="🔍  Buscar competidor por nombre..."
        value={textoBusqueda}
        onChange={(e) => {
            setTextoBusqueda(e.target.value);
            setPaginaActual(1);
        }}
    />

    <div className={styles.filtrosTipo}>
      {['Todos', 'Primario', 'Secundario', 'Referencia', 'Sin clasificación'].map(tipo => (
          <button
              key={tipo}
              type="button"
              className={filtroTipoActor === tipo ? styles.filtroActivo : ''}
              onClick={() => {
                              setFiltroTipoActor(tipo);
                              setPaginaActual(1);
                          }}
                      >
                 <span aria-hidden="true">
                    {tipo === 'Todos' ? '▦' :
                    tipo === 'Primario' ? '◆' :
                    tipo === 'Secundario' ? '◇' :
                    tipo === 'Referencia' ? '◎' : '?'}
                </span>
              {' '}
              {tipo === 'Primario' ? 'Primarios' :
              tipo === 'Secundario' ? 'Secundarios' :
              tipo === 'Referencia' ? 'Referencias' : tipo}
          </button>
            ))}
    </div>
            
  </div>
          <div className={styles.zonaDerecha}>

              <button
                  type="button"
                  className={styles.botonAdministrar}
                  onClick={() => setPanelEstadisticaAbierto(true)}
              >
                  Análisis de Mercado
              </button>
              <button
                  type="button"
                  className={styles.botonAdministrar}
                  onClick={() => setPanelEdicionAbierto(true)}
              >
                  Panel de Edición
              </button>
            </div>
            <div className={styles.ubicacion}>
            <span className={styles.pais}>Argentina</span>
            <span className={styles.fechaActualizacion}>
                Última actualización:
                <strong> 22 de oct de 2026</strong>
            </span>
            </div>
        </div>
      </header>
      <main className={styles.contenedor}>
          <section className={styles.catalogo}>
            <h2>Catálogo de Competidores</h2>
            <div className= {styles.grillaTarjetas}>
            {competidoresVisibles.map((item)=>(
                <TarjetaCompetidor 
                  key= {item.id}
                  id= {item.id}
                  nombre= {item.nombre}
                  perfil= {item.perfil}
                  cobertura = {item.cobertura}
                  tipoActor= {item.tipoActor}
                  logo= {item.logo}
                  onSeleccionar={setCompetidorSeleccionado}
                />
            ))}
            </div> 
          </section>
          <div className={styles.paginacion}>
          <button
              type="button"
              disabled={paginaActual === 1}
              onClick={() => setPaginaActual(paginaActual - 1)}
          >
              Anterior
          </button>

          <span>
              Página {paginaActual} de {totalPaginas}
          </span>

          <button
              type="button"
              disabled={paginaActual >= totalPaginas}
              onClick={() => setPaginaActual(paginaActual + 1)}
          >
              Siguiente
          </button>
      </div>
      </main>  
      {empresaSeleccionada && createPortal(
          <div className={styles.fondoDetalle}>
              <div
                  className={styles.panelDetalle}
                  role="dialog"
                  aria-modal="true"
                  aria-label={`Ficha de ${empresaSeleccionada.nombre}`}
              >
                  <DetalleCompetidor
                      competidor={empresaSeleccionada}
                      antecedentes={antecedentesEmpresa}
                      onCerrar={() => setCompetidorSeleccionado(null)}
                  />
              </div>
          </div>,
          document.body
      )}
      {panelEdicionAbierto && (
        <div className= {styles.fondoDetalle}>
          <div className={styles.panelDetalle}
            role= "dialog"
            aria-modal= "true"
            aria-label='Panel de Edición de competidores'
            >
              <PanelEdicion
                onCerrar= {()=> setPanelEdicionAbierto(false)}
                spHttpClient={props.spHttpClient}
                onCompetidorCreado={actualizarCompetidores}
                competidores = {competidoresReales}
              />
          </div>

        </div>
      )}
      {panelEstadisticaAbierto && createPortal (
          <div className= {styles.fondoDetalle}>
            <div className={styles.panelDetalle}
            role= "dialog"
            aria-modal= "true"
            aria-label='Panel de Analisis de Mercado'
            >
              <PanelEstadistica
                competidores={competidoresReales}
                onCerrar = {()=> setPanelEstadisticaAbierto(false)}
                />
            </div>

          </div>,
          document.body
      )}
    </section>
   )
}
export default CompetidoresNacionales

