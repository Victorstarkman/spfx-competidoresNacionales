export interface IAntecedente {
    id: number;
    fecha: string;
    organismo: string;
    objeto: string;
    resultadoProceso: string;
    numeroProceso: string;
    fuente: string;
    adjudicatariosIds: number[];
    empresasParticipantesIds: number[];
    mostrarEnCronologia: boolean;
}