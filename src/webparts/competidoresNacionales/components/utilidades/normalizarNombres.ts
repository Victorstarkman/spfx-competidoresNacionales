export const normalizarNombres = (nombre:string):string => {
    
    const nombreNormalizado=  nombre.trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\bs\s*\.?\s*r\s*\.?\s*l\.?\b/g, 'srl')
        .replace(/\bs\s*\.?\s*a\.?\b/g, 'sa')
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
        return nombreNormalizado
}