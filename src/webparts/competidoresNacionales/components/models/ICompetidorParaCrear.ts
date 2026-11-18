export interface ICompetidorParaCrear{
    Title: string,
    TipoActor:string,
    Perfil: string[],
    Mercado: string,
    Alcance:  string[],
    Cobertura:string,
    FortaliezaPrincipal:string,
    ClientesComprobados:string,
    NivelEvidencia:string,
    UltimaVerificacion: string,
    EstadoAnalisis: string,
    Web?: {
    Url: string;
    Description: string;
    };

    Logo?: {
        Url: string;
        Description: string;
    };
}