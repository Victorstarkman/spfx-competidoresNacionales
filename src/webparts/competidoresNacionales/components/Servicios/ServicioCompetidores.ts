import {SPHttpClient} from '@microsoft/sp-http';
import type { ICompetidor } from '../models/ICompetidor';
import type { IAntecedente } from '../models/IAntecedents';

import type { ICompetidorSharepoint } from '../models/ICompetidorSharepoint';
import type { IAntecedenteSharePoint } from '../models/IAntecedentesSharepoint';

import { transformarAntecedente } from './transformarAntecedentes';
import { transformarCompetidor } from './transformarCompetidor';

import type { ICompetidorParaCrear } from '../models/ICompetidorParaCrear';

import { normalizarNombres } from '../utilidades/normalizarNombres';

const sitio = 'https://dienstar.sharepoint.com'
const listas = {
    competidores: '74bfdf59-3ba2-420e-950d-d048a4d4b7a9',
    cronologia: 'b06863ce-2dc8-4388-992a-f9daa27b006e'
}

const consultarLista = async (
    spHttpClient: SPHttpClient,
    listaId: string
): Promise<unknown[]> => {

    let url: string | undefined =
        `${sitio}/_api/web/lists(guid'${listaId}')/items?$top=100`;

    const resultados: unknown[] = [];

    while (url) {
        const respuesta = await spHttpClient.get(
            url,
            SPHttpClient.configurations.v1
        );

        if (!respuesta.ok) {
            throw new Error(
                `Error SharePoint: ${respuesta.status}`
            );
        }

        const datos: {
            value: unknown[];
            '@odata.nextLink'?: string;
        } = await respuesta.json();

        resultados.push(...datos.value);

        url = datos['@odata.nextLink'];
    }

    return resultados;
};
export const consultarCompetidores = async (
    spHttpClient: SPHttpClient,
    ): Promise<ICompetidor[]> => {
       
       const datos = await consultarLista(
    spHttpClient,
    listas.competidores
);

return (datos as ICompetidorSharepoint[])
    .map(transformarCompetidor);
    };
    
export const consultarCronologia =async (
    spHttpClient : SPHttpClient
): Promise<IAntecedente[]> => {
 const datos = await consultarLista(
    spHttpClient,
    listas.cronologia
);

return (datos as IAntecedenteSharePoint[])
    .map(transformarAntecedente);
}

export const consultarOpcionesCampo = async(
    spHttpClient: SPHttpClient,
    nombreCampo: 'Perfil'| 'Alcance' | 'NivelEvidencia' | 'EstadoAnalisis'| 'Mercado'| 'TipoActor'
):Promise<string[]> => {
   const URL = `${sitio}/_api/web/lists(guid'${listas.competidores}')` +
    `/fields/getbyinternalnameortitle('${nombreCampo}')` +
    `?$select=Choices`;
    try {
        const respuesta = await spHttpClient.get(
           URL,
           SPHttpClient.configurations.v1,
           {
            headers:{
                Accept: 'application/json;odata=nometadata'
                }
           }
        )
        if(!respuesta.ok){
            throw new Error (`Error Status:consultando ${nombreCampo } ${respuesta.status}`)
        };
        const datos:{Choices:string[]}= await respuesta.json()
        
        return datos.Choices
    } catch (error) {
        console.log('Error:',error);
        throw error;
    }

}
export const crearCompetidor = async (
    spHttpClient:SPHttpClient,
    competidor: ICompetidorParaCrear
    ): Promise<number>=>{

        const URL = `${sitio}/_api/web/lists(guid'${listas.competidores}')/items`;
        console.log(
            'JSON enviado a SharePoint:',
            JSON.stringify(competidor, null, 2)
        );
        const respuesta = await spHttpClient.post(
            URL,
            SPHttpClient.configurations.v1,
            {headers:{
                Accept: 'application/json;odata=nometadata',
                'Content-type': 'application/json;odata=nometadata',
                
            },
            body: JSON.stringify(competidor)
        });
        if (!respuesta.ok){
            const detalle = await respuesta.text();
            throw new Error( 
                `Error al crear Competidor ${respuesta.status} - ${detalle}`
            );
        }
    const datos = await  respuesta.json();
    return datos.Id    
}

export const existeCompetidor = async (
    spHttpClient: SPHttpClient,
    nombre: string,
    idExcluir ? : number
): Promise<boolean> => {

    const nombreNormalizado = normalizarNombres(nombre);

    const URL =
        `${sitio}/_api/web/lists(guid'${listas.competidores}')/items` +
        `?$select=Id,Title&$top=100`;

   // console.log('Nombre ingresado:', nombre);
    //console.log('Nombre normalizado:', nombreNormalizado);
    /* console.log(
        'Mega S.R.L. normalizado:',
        NormalizarNombre('Mega S.R.L.')
    ); */

    const respuesta = await spHttpClient.get(
        URL,
        SPHttpClient.configurations.v1,
        {
            headers: {
                Accept: 'application/json;odata=nometadata'
            }
        }
    );

    if (!respuesta.ok) {
        throw new Error(
            `Error al verificar duplicados: ${respuesta.status}`
        );
    }

    const datos: {
        value: Array<{ Id: number; Title: string }>
    } = await respuesta.json();

    //console.log('Competidores recuperados:', datos.value.length);

  /*   console.log(
        'Registros relacionados con Mega:',
        datos.value.filter(competidor =>
            NormalizarNombre(competidor.Title).indexOf('mega') !== -1
        )
    ); */
    

    const duplicado = datos.value.some(competidor => {
        if(competidor.Id === idExcluir){
            return false;
        }
        return normalizarNombres(competidor.Title) === nombreNormalizado;
        }
    );

    //console.log('¿Existe competidor duplicado?', duplicado);

    return duplicado;
};
export const consultarCompetidorPorId =async (
    spHttpClient:SPHttpClient,
    id:number
    ):Promise<ICompetidorSharepoint> =>{

        const URL = `${sitio}/_api/web/lists(guid'${listas.competidores}')` +
    `/items(${id})`;
        const respuesta = await spHttpClient.get (
            URL,
            SPHttpClient.configurations.v1,
            {headers:{
                Accept : 'application/json;odata=nometadata'
            }}
        )
        if(!respuesta.ok){
            const detalle = await respuesta.text();

            console.error('ID consultado:', id);
            console.error('URL consultada:', URL);
            console.error('Respuesta de SharePoint:', detalle);

            throw new Error(
                `Error en la consulta por ID: ${respuesta.status}`
            );
        }
        const datos = await  respuesta.json();
        return datos;
}
export const actualizarCompetidor = async( 
    spHttpClient:SPHttpClient,
    competidor: ICompetidorParaCrear,
    id:number
    ):Promise<void> => {
            const URL =
        `${sitio}/_api/web/lists(guid'${listas.competidores}')/items(${id})` 
      
        const respuesta = await spHttpClient.post(
            URL,
            SPHttpClient.configurations.v1,
            {headers: {
                Accept: 'application/json;odata.metada=none',
                'Content-type': 'application/json',
                'IF-MATCH':'*',
                'X-HTTP-Method': 'MERGE'
            },
            body: JSON.stringify(competidor)
            }
        )
        if(!respuesta.ok){
            const detalle = await respuesta.text();
            throw new Error(`Error al actualizar competidor ${id}`+
                `${respuesta.status} - ${detalle}`
            )   
        }

    }
    export const eliminarCompetidor = async(
        spHttpClient: SPHttpClient,
        id: number
    ):Promise <void> => {
        const URL =  `${sitio}/_api/web/lists(guid'${listas.competidores}')/items(${id})`
        console.log('ID que vamos a eliminar:', id);
        console.log('URL de eliminación:', URL);
        const respuesta = await spHttpClient.post(
            URL,
            SPHttpClient.configurations.v1,
            {
                headers:{
                    Accept: 'application/json;odata=nometadata',
                    'IF-MATCH':'*',
                    'X-HTTP-Method': 'DELETE'
                }
            }
        );
        console.log('Estado HTTP del DELETE:', respuesta.status);
        console.log('¿DELETE exitoso?:', respuesta.ok);

         if (!respuesta.ok) {
            const detalle = await respuesta.text();
            console.error('Respuesta de SharePoint:', detalle);
            throw new Error(
                `Error al eliminar competidor ${id}: ` +
                `${respuesta.status} - ${detalle}`
            );
    }
};
