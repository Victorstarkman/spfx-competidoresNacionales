import * as React from 'react';
import type { IPanelEstadisticaProps } from './IPanelEstadisticaProps';
import styles from './PanelEstadistica.module.scss'

const PanelEstadistica = 
(props: IPanelEstadisticaProps): React.ReactElement =>{
    //estado
    const [seccionActiva, setSeccionActiva]= React.useState<'actor' | 'mercado' | 'perfiles'>('actor');
    //funciones
    const totalCompetidores = props.competidores.length;
    const totalCompetidoresPrimarios = props.competidores.filter(competidor => competidor.tipoActor==='Primario').length;
    const totalCompetidoresSecundarios = props.competidores.filter(competidor => competidor.tipoActor==='Secundario').length;
    const totalCompetidoresReferencia = props.competidores.filter(competidor => competidor.tipoActor==='Referencia').length;
    const totalSinClasificacion = props.competidores.filter(competidor => !competidor.tipoActor?.trim()).length;
    const distribucion = [
        { nombre: 'Primarios', cantidad: totalCompetidoresPrimarios, color: '#078C87' },
        { nombre: 'Secundarios', cantidad: totalCompetidoresSecundarios, color: '#526B80' },
        { nombre: 'Referencias', cantidad: totalCompetidoresReferencia, color: '#D5A35C' },
        { nombre: 'Sin clasificación', cantidad: totalSinClasificacion, color: '#B8C9D1' }
    ];

    let acumulado = 0;

    const sectores = distribucion.map(item => {
        const inicio = acumulado;

        acumulado += totalCompetidores > 0
            ? (item.cantidad / totalCompetidores) * 100
            : 0;

        return `${item.color} ${inicio}% ${acumulado}%`;
    });

    const fondoGrafico = totalCompetidores > 0
        ? `conic-gradient(${sectores.join(', ')})`
        : '#DCE8E9';
    ///Variables de mercados para el analisis 
    //====================================================
    const conteoMercados = props.competidores.reduce(
        (acumulador,competidor) => { 
             const mercado = competidor.mercado?.trim() || 'Sin Clasificación';
             acumulador[mercado] = (acumulador[mercado] || 0)+1;
             return acumulador
        },
        {} as Record<string,number>
    );
    const distribucionMercados = Object.keys(conteoMercados) .map(nombre => ({
        nombre: nombre,
        cantidad: conteoMercados[nombre]
    }))
       .sort((a, b) => b.cantidad - a.cantidad);
    //console.log('Variable: ', distribucionMercados)
    ///variables para conteo de perfiles
    //========================================================
    const conteoPerfiles = props.competidores.reduce (
        (acumulador,competidor) => {

            const perfiles = competidor.perfil
            .split(/\s*[·•]\s*/)
            .map(perfil => perfil.trim())
            .filter(perfil => perfil !=='')
        // Evitamos duplicar perfil en una misma empresa
            const perfilesUnicos = perfiles.filter(
                (perfil,indice) => perfiles.indexOf(perfil)=== indice);
            perfilesUnicos.forEach(perfil => {
                acumulador[perfil] = (acumulador[perfil] || 0)+1
            });
            return acumulador

    },{}as Record <string,number>)
   // console.log ('Perfiles: ', conteoPerfiles)
   const distribucionPerfiles = Object.keys(conteoPerfiles)
    .map(nombre => ({
        nombre,
        cantidad: conteoPerfiles[nombre]
    }))
    .sort((a, b) => b.cantidad - a.cantidad);
   //JSX
   //===================================================
    return(
        <section className={styles.panelEstadisticas }>
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
                        <path d="M3 20H21" />
                        <path d="M5 16V12M10 16V9M15 16V11M20 16V5" />
                        <path d="M4 9L10 5L15 8L20 3" />
                    </svg>
                    Análisis de Mercado
                </h2>

                <button
                    type="button"
                    onClick={props.onCerrar}
                    className={styles.botonCerrar}
                    aria-label="Cerrar análisis del mercado"
                >
                    ✕
                </button>
            </header>
            <nav className= {styles.navegacion} aria-label ='Secciones estadisticas'>
                {[
                    {id:'actor',titulo:'Tipo de Competidor'},
                    {id:'mercado',titulo:'Mercado'},
                    {id:'perfiles',titulo:'Perfiles'},
                ].map( item => 
                    <button 
                        type="button" 
                        key= {item.id} 
                        className= { 
                            seccionActiva === item.id 
                            ? styles.navegacionActiva
                            : ''}
                            onClick= {()=> setSeccionActiva(item.id as 'actor' | 'mercado' | 'perfiles')}>
                                {item.titulo}
                            </button>

                )}
            </nav>
            {seccionActiva === 'actor' &&(
                <>
                    <div className= {styles.grillaKpi}>
                {[
                    { titulo: 'Total competidores', valor: totalCompetidores },
                    { titulo: 'Primarios', valor: totalCompetidoresPrimarios },
                    { titulo: 'Secundarios', valor: totalCompetidoresSecundarios },
                    { titulo: 'Referencias', valor: totalCompetidoresReferencia },
                    { titulo: 'Sin Clasificación', valor: totalSinClasificacion }]
                    .map((indicador,indice)=> {
                        const porcentaje = totalCompetidores > 0 
                            ? (indicador.valor/totalCompetidores * 100).toFixed(1)
                            :'0.0' 
                            
                            return (
                        <article 
                            key = {indicador.titulo}
                            className={`${styles.tarjetaKpi} ${
                                indice === 0 ? styles.tarjetaPrincipal : ''
                            }`}
                            >
                            <span className={styles.etiquetaKpi }>
                                {indicador.titulo}
                            </span>
                            <span className={styles.valorKpi}>
                                {indicador.valor}
                            </span>
                            <span className={styles.porcentajeKpi}>
                                {indice === 0
                                    ? '100% del universo'
                                    : `${porcentaje.replace('.', ',')}%`}
                                </span>

                        </article>
                        )})}
                    </div> 
                    <div className={styles.seccionGrafico}>
                        <h3>Distribución por tipo de Competidor</h3>

                        <div className={styles.contenidoGrafico}>
                            <div
                                className={styles.graficoCircular}
                                style={{ background: fondoGrafico  }}
                                role="img"
                                aria-label={`Distribución de ${totalCompetidores} competidores por tipo de actor`}
                            />

                            <div className={styles.leyendaGrafico}>
                                {distribucion.map(item => (
                                    <div key={item.nombre} className={styles.itemLeyenda}>
                                        <span
                                            className={styles.colorLeyenda}
                                            style={{ backgroundColor: item.color }}
                                        />

                                        <span>{item.nombre}</span>

                                        <strong>
                                            {item.cantidad} (
                                            {totalCompetidores > 0
                                                ? (item.cantidad / totalCompetidores * 100)
                                                    .toFixed(1).replace('.', ',')
                                                : '0,0'}%)
                                        </strong>
                                    </div>
                                            ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
            {seccionActiva === 'mercado' && (
                <>
                    <div className={styles.grillaKpi}>
                            <article
                                className={`${styles.tarjetaKpi} ${styles.tarjetaPrincipal}`}
                            >
                                <span className={styles.etiquetaKpi}>
                                    Total competidores
                                </span>

                                <div className={styles.datosKpi}>
                                    <strong className={styles.valorKpi}>
                                        {totalCompetidores}
                                    </strong>

                                    <span className={styles.porcentajeKpi}>
                                        {totalCompetidores > 0 ? '100% del universo' : 'Sin registros'}
                                    </span>
                                </div>
                            </article>
                        {distribucionMercados.map(item => {

                        const porcentaje = totalCompetidores > 0
                            ? (item.cantidad / totalCompetidores * 100)
                                .toFixed(1).replace('.', ',')
                            : '0,0';

                                return (
                                    <article
                                        key={item.nombre}
                                        className={styles.tarjetaKpi}
                                    >
                                        <span className={styles.etiquetaKpi}>
                                            {item.nombre}
                                        </span>

                                        <div className={styles.datosKpi}>
                                            <strong className={styles.valorKpi}>
                                                {item.cantidad}
                                            </strong>

                                            <span className={styles.porcentajeKpi}>
                                                {porcentaje}%
                                            </span>
                                        </div>
                                    </article>
                                );
                            })}

                    </div>
                    <div className= {styles.seccionGrafico}>
                         <h3>Distribución por mercado</h3>
                        {distribucionMercados.map(item => {

                            const porcentaje = totalCompetidores > 0
                                ? item.cantidad / totalCompetidores * 100
                                : 0;

                            return (
                                <div key={item.nombre} className={styles.filaMercado}>
                                    <div className={styles.encabezadoBarra}>
                                        <span>{item.nombre}</span>

                                        <strong>
                                            {item.cantidad} · {porcentaje.toFixed(1).replace('.', ',')}%
                                        </strong>
                                    </div>

                                    <div className={styles.fondoBarra}>
                                        <div
                                            className={styles.barraMercado}
                                            style={{ width: `${porcentaje}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
           {seccionActiva === 'perfiles' && (
    <div className={styles.seccionGrafico}>

        <h3>Empresas por perfil competitivo</h3>

        <p>
            Universo analizado: {totalCompetidores} empresas.
        </p>

        {distribucionPerfiles.map(item => {

            const porcentaje = totalCompetidores > 0
                ? item.cantidad / totalCompetidores * 100
                : 0;

            return (
                <div
                    key={item.nombre}
                    className={styles.filaMercado}
                >
                    <div className={styles.encabezadoBarra}>
                        <span>{item.nombre}</span>

                        <strong>
                            {item.cantidad} · {porcentaje.toFixed(1).replace('.', ',')}%
                        </strong>
                    </div>

                    <div className={styles.fondoBarra}>
                        <div
                            className={styles.barraMercado}
                            style={{ width: `${porcentaje}%` }}
                        />
                    </div>
                </div>
            );
        })}

        <p>
            <strong>Cómo interpretar este análisis:</strong>{' '}
            Una empresa puede tener varios perfiles competitivos
            y se contabiliza una vez en cada perfil.
            Por eso, la suma de las cantidades y de los porcentajes
            puede superar el total de empresas relevadas.
        </p>

    </div>
)}
        </section>

    )
}
export default PanelEstadistica