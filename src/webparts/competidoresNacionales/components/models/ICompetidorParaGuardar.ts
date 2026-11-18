export type TipoActor = 
    | 'Primario'
    | 'Secundario'
    | 'Referencia'
    | '';
export interface ICompetidorParaGuardar {
 nombre: string;
 tipoActor: TipoActor;
 perfil: string[];
 mercado: string;
 alcance: string[];
 cobertura: string;
 fortalezaPrincipal: string;
 clientesComprobados: string;
 nivelEvidencia: string;
 ultimaVerificacion: string ;
 web: string;
 logo: string;
 estadoAnalisis: string;
}