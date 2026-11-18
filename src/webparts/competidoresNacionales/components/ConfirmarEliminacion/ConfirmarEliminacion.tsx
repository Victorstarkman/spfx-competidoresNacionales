import * as React from 'react';
import type { IConfirmarEliminacionProps } from "./IConfirmarEliminacionProps";
import styles from './ConfirmarEliminacion.module.scss'
import {Icon} from '@fluentui/react/lib/Icon';
import { eliminarCompetidor } from '../Servicios/ServicioCompetidores';

const ConfirmarEliminacion =  (props: IConfirmarEliminacionProps): React.ReactElement => {
   //estados
    const [eliminando,setEliminando] = React.useState<boolean>(false);
    const [mensajeError,setMensajeError]= React.useState<string>('');
    const [mensajeExito,setMensajeExito]= React.useState<string>('');
   //funciones
    const confirmarEliminacion = async():Promise<void>=>{
        if(eliminando) return;
        setMensajeError('');
        setMensajeExito('');
        setEliminando(true);
        try {
            await eliminarCompetidor(props.spHttpClient,props.competidorId);
            setMensajeExito('Competidor eliminado correctamente');
            props.onCompetidorEliminado (props.competidorId);

        } catch (error) {
            console.error('Error al eliminar competidor',error);
            setMensajeError(
                error instanceof Error
                ? `No se ha podido eliminar ${error.message}`
                : 'No se pudo eliminar el competidor'
            )
        }finally {
            setEliminando(false)
        }
    }
   return (
      <>
      <div className={styles.confirmacionEliminar}>

          <p className={styles.textoConfirmacion}>
              ¿Estás seguro de que querés eliminar
              <strong> {props.competidorNombre}</strong>?
          </p>

          <p className={styles.idConfirmacion}>
              ID: {props.competidorId}
          </p>

          <button
              type="button"
              className={styles.botonConfirmarEliminar}
              disabled = {eliminando || mensajeExito !== ''}
              onClick = {()=> {
                  confirmarEliminacion().catch(console.error);
              } }
          >
              <Icon 
                  iconName="Delete"
                   />
               {eliminando ? 'Eliminando...' : 'Confirmar eliminación'}
          </button>
      </div>
      <div>
      {mensajeExito && (
        <p className={styles.mensajeExito}>{mensajeExito}</p>
        )}
      {mensajeError && (
          <p className={styles.mensajeError}>{mensajeError}</p>
      )}
      </div>
      
      </>  

)}
   

export default ConfirmarEliminacion