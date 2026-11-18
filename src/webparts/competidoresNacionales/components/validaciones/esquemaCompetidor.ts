import {z} from 'zod';
const esquemaUrl = z.union([
    z.literal(''),
    z.url({
        protocol: /^https?$/,
        hostname: z.regexes.domain,
        message: 'Ingresá una URL válida con dominio y extensión'
    })
]);

export const esquemaCompetidor = z.object(
    {
        nombre: z.string()
        .trim()
        .min(1,'El nombre del Competidor es obligatorio'),

        tipoActor: z.string()
        .min(1, 'Selecciona un tipo de Actor'),

        mercado: z.string()
         .min(1, 'Selecciona un Mercado de Intervención'),
        
        perfil: z.array(z.string())
        .min(1, 'Selecciona al menos un perfil'),

        alcance: z.array(z.string())
        .min(1, 'Selecciona al menos un alcance'),

        web: esquemaUrl,
        
        logo:esquemaUrl,
        
        cobertura : z.string().trim(),

        fortalezaPrincipal: z.string().trim(),

        clientesComprobados: z.string().trim(),

        nivelEvidencia: z.string()
         .min(1, 'Seleccioná un nivel de evidencia'),

        estadoAnalisis: z.string()
        .min(1, 'Seleccioná un estado del análisis'),

        ultimaVerificacion: z.iso.date()


    }
);