import type {SPHttpClient} from '@microsoft/sp-http';

export interface IConfirmarEliminacionProps{

    spHttpClient: SPHttpClient;
    competidorId: number;
    competidorNombre : string;
    onCompetidorEliminado:(id: number)=> void 
}