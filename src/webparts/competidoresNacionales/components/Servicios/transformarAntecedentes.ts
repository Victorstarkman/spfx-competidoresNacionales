import type { IAntecedente } from "../models/IAntecedents";
import type { IAntecedenteSharePoint } from "../models/IAntecedentesSharepoint";

export const transformarAntecedente = (
    item: IAntecedenteSharePoint
): IAntecedente => {

    return {
        id: item.Id,
        fecha: item.Fecha ?? '',
        organismo: item.Organismo ?? '',
        objeto: item.Objeto ?? '',
        resultadoProceso: item.ResultadoProceso?.join(' · ') ?? '',
        numeroProceso: item.NumeroProceso ?? '',
        fuente: item.Fuente ?? '',
        adjudicatariosIds: item.AdjudicatarioId ?? [],
        empresasParticipantesIds: item.EmpresasParticipantesId ?? [],
        mostrarEnCronologia: item.MostrarEnCronologia ?? false
    };
};