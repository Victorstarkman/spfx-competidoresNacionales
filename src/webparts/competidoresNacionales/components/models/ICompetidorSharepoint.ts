export interface ICompetidorSharepoint{
    Id: number;
    Title: string;
    TipoActor?: string;
    Perfil?:string[];
    Alcance?:string[];
    Cobertura?:string;
    Mercado?:string;
    FortaliezaPrincipal:string;
    ClientesComprobados?:string;
    NivelEvidencia?: string;
    UltimaVerificacion?:string;
    EstadoAnalisis?:string;

    Logo?: {
        Url: string,
        Description: String
    }
     Web?: {
        Url: string;
        Description?: string;
    };
}