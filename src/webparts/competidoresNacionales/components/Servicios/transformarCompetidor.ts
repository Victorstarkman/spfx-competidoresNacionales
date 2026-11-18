import type { ICompetidorSharepoint } from "../models/ICompetidorSharepoint";
import type { ICompetidor } from "../models/ICompetidor";
import type { ICompetidorParaGuardar } from "../models/ICompetidorParaGuardar";
import type { ICompetidorParaCrear } from "../models/ICompetidorParaCrear";
import { obtenerFechaHoy } from "../utilidades/fecha";
import { TipoActor } from "../models/ICompetidorParaGuardar";
export const transformarCompetidor =(
    item: ICompetidorSharepoint
):ICompetidor => {
     return {
        id: item.Id,
        nombre: item.Title,
        tipoActor: item.TipoActor ?? '',
        perfil: item.Perfil?.join(' · ') ?? '',
        mercado: item.Mercado ?? '',
        alcance: item.Alcance?.join(' · ') ?? '',
        cobertura: item.Cobertura ?? '',
        fortalezaPrincipal: item.FortaliezaPrincipal ?? '',
        clientesComprobados: item.ClientesComprobados ?? '',
        nivelEvidencia: item.NivelEvidencia ?? '',
        ultimaVerificacion: item.UltimaVerificacion,
        web: item.Web?.Url ?? '',
        logo: item.Logo?.Url,
        estadoAnalisis: item.EstadoAnalisis ?? ''
    };
}
export const transformarCompetidorParaSharepoint = (
    item: ICompetidorParaGuardar
): ICompetidorParaCrear=> {
    return {
        Title: item.nombre,
        TipoActor:item.tipoActor,
        Perfil: item.perfil,
        Mercado: item.mercado,
        Alcance: item.alcance,
        Cobertura: item.cobertura,
        FortaliezaPrincipal: item.fortalezaPrincipal,
        ClientesComprobados: item.clientesComprobados,
        NivelEvidencia: item.nivelEvidencia,
        UltimaVerificacion: obtenerFechaHoy(),
        EstadoAnalisis: item.estadoAnalisis,
        Web: item.web
        ? {
            Url: item.web,
            Description: 'Sitio web'
        }
        : undefined,

    Logo: item.logo
        ? {
            Url: item.logo,
            Description: 'Logo'
        }
        : undefined,
        }
}
const convertirTipoActor = (valor?: string): TipoActor => {
    if (
        valor === 'Primario' ||
        valor === 'Secundario' ||
        valor === 'Referencia'
    ) {
        return valor;
    }

    return '';
};

export const transformarCompetidorParaFormulario =(
    item: ICompetidorSharepoint
): ICompetidorParaGuardar => {
    return {
        nombre: item.Title,
        tipoActor: convertirTipoActor(item.TipoActor),
        perfil: item.Perfil ?? [],
        mercado: item.Mercado ?? '',
        alcance: item.Alcance?? [],
        cobertura: item.Cobertura ?? '',
        fortalezaPrincipal: item.FortaliezaPrincipal ?? '',
        clientesComprobados: item.ClientesComprobados ?? '',
        nivelEvidencia: item.NivelEvidencia ?? '',
        ultimaVerificacion: item.UltimaVerificacion ??'',
        web: item.Web?.Url ?? '',
        logo: item.Logo?.Url ?? '',
        estadoAnalisis: item.EstadoAnalisis ?? ''
    }
}