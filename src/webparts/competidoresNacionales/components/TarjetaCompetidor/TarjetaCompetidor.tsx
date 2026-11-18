import * as React from 'react'
import type { ITarjetaCompetidor } from './ITarjetaCompetidor'
import styles from './TarjetaCompetidor.module.scss'


const TarjetaCompetidor = (props: ITarjetaCompetidor):React.ReactElement =>{
    const iniciales = props.nombre
        .trim()
        .split(/\s+/)
        .slice(0,2)
        .map(palabra => palabra[0])
        .join("")
        .toUpperCase()

   return (
    <article className={styles.tarjeta}>

        <div className={styles.empresa}>
            <div className={styles.iconoEmpresa}>
                {props.logo ? (
                    <img
                        src={props.logo}
                        alt={`Logo de ${props.nombre}`}
                    />
                ) : (
                    <span>{iniciales}</span>
                )}
            </div>

            <h3>{props.nombre}</h3>
        </div>

        <p className={styles.perfil}>{props.perfil}</p>

        <div className={styles.pieTarjeta}>
            <p className={styles.cobertura}>
                Cobertura: {props.cobertura}
            </p>

            <div className={styles.acciones}>
                <span className={styles.tipoActor}>
                    {props.tipoActor}
                </span>

                <button 
                    className= {styles.verFicha}
                    type = "button"
                    onClick={()=> props.onSeleccionar(props.id)}
                    >
                    Ver ficha
                    <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        style={{ marginLeft: '6px', verticalAlign: 'middle' }}
                    >
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <path d="M15 4v16" />
                        <path d="m10 9 3 3-3 3" />
                    </svg>
                </button>
            </div>
        </div>

    </article>
);
}
export default TarjetaCompetidor;