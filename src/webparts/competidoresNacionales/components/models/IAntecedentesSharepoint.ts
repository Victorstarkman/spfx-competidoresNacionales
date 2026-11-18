export interface IAntecedenteSharePoint {
    Id: number;
    Title: string;

    Fecha?: string;
    FechaFin?: string;
    A_x00f1_o?: number;

    Organismo?: string;
    Objeto?: string;
    NumeroProceso?: string;

    ResultadoProceso?: string[];

    AdjudicatarioId?: number[];
    EmpresasParticipantesId?: number[];

    MostrarEnCronologia?: boolean;

    Fuente?: string;
    NivellEvidencia?: string;
    TipoServicio?: string[];

    MontoAdjudicado?: number;
    ImpactoCompetitivo?: string;
}