import type {SPHttpClient} from '@microsoft/sp-http'
import type { ICompetidor } from '../models/ICompetidor'

export interface IPanelEdicionProps  {
    onCerrar: () => void 
    spHttpClient: SPHttpClient
    onCompetidorCreado: (id: number)=> void
    competidores: ICompetidor[]
}