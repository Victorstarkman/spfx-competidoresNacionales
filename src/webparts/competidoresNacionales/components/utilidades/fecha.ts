export const obtenerFechaHoy = (): string => {
    const ahora = new Date();

    const anio = ahora.getFullYear();
    const mes = ('0' + (ahora.getMonth() + 1)).slice(-2);
    const dia = ('0' + ahora.getDate()).slice(-2);

    return `${anio}-${mes}-${dia}`;
};