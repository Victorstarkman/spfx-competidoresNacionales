import type {SPHttpClient} from '@microsoft/sp-http'
import type { ICompetidorSharepoint } from '../models/ICompetidorSharepoint';

export interface IFormularioCompetidorProps {
    onCancelar: ()=> void
    spHttpClient: SPHttpClient
    onCompetidorCreado : (id:number)=> void;
    competidorParaEditar?: ICompetidorSharepoint 
}