import * as React from 'react';
import styles from './DetalleCompetidor.module.scss';
import type { IDetalleCompetidorProps} from './IDetalleCompetidorProps';

const DetalleCompetidor =(props: IDetalleCompetidorProps): React.ReactElement => {
    const {competidor, onCerrar} = props;   
    return (
        <>
    <section className={styles.detalle}>
         <header className={styles.encabezado}>
           <div className={styles.tituloEmpresa}>
                    <h2>
                        {competidor.nombre}{' '}
                        <span className={styles.tipoActor}>
                            {competidor.tipoActor}
                        </span>
                    </h2>
            </div>

            <button
                type="button"
                onClick={onCerrar}
                aria-label="Cerrar detalle"
            >
                ✕
            </button>
        </header>

        <div className={styles.filaDetalle}>
            <h3>Perfil</h3>
            <div className={styles.valorDetalle}>
                {competidor.perfil}
            </div>
        </div>

        <div className={styles.filaDetalle}>
            <h3>Cobertura</h3>
            <div className={styles.valorDetalle}>
                <strong>{competidor.alcance}</strong>
                <p>{competidor.cobertura}</p>
            </div>
        </div>

        <div className={styles.filaDetalle}>
            <h3>Fortaleza</h3>
            <div className={styles.valorDetalle}>
                {competidor.fortalezaPrincipal}
            </div>
        </div>

        <div className={styles.filaDetalle}>
            <h3>Clientes comprobados</h3>
            <div className={styles.valorDetalle}>
                <div className={styles.clientes}>
                    {competidor.clientesComprobados || 'No informados'}
                </div>
            </div>
        </div>

        <div className={styles.filaDetalle}>
            <h3>Evidencia</h3>
            <div className={styles.valorDetalle}>
                <strong>{competidor.nivelEvidencia}</strong>
                <p>
                    <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#078C87"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        style={{
                            marginRight: '7px',
                            verticalAlign: 'middle'
                        }}
                    >
                        <rect x="3" y="5" width="18" height="16" rx="2" />
                        <path d="M16 3v4M8 3v4M3 10h18" />
                        <path d="m9 16 2 2 4-4" />
                    </svg>
                    Última verificación: {competidor.ultimaVerificacion
                        ? new Date(competidor.ultimaVerificacion).toLocaleDateString('es-AR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            timeZone: 'UTC'
                        })
                        : 'No informada'}
                </p>
            </div>
        </div>

        <div className={styles.filaDetalle}>
            <h3>Web</h3>
            <div className={styles.valorDetalle}>
                {competidor.web ? (
                    <a
                        href={competidor.web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.enlaceWeb}
                    >
                        Abrir sitio web ↗
                    </a>
                ) : (
                    'No informada'
                )}
            </div>
        </div>
    </section>
    <section className={styles.historial}>
        <div className={styles.cabeceraHistorial}>
            <h3>Antecedentes en licitaciones públicas</h3>

            <button
                type="button"
                className={styles.botonCerrarInferior}
                onClick={props.onCerrar}
            >
                ✕ Cerrar ficha
            </button>
        </div>
        {props.antecedentes.length === 0 
         ? (<p>No hay antecedentes públicos asociados</p>):
         (
            props.antecedentes.map (item => (
                <article key={item.id} className= {styles.evento}>
                    <div className={styles.fechaEvento}>
                    {item.fecha
                        ? new Date(item.fecha).toLocaleDateString('es-AR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            timeZone: 'UTC'
                        })
                        : 'Sin fecha'}
                    </div>
                     <div className={styles.contenidoEvento}>
                        <span className={styles.estadoEvento}>
                            {item.resultadoProceso}
                        </span>

                    <   strong>{item.organismo}</strong>

                    <p>{item.objeto}</p>
                    </div>
                </article>
            )
         ))
        }

    </section>

        </>
    )
}
export default DetalleCompetidor