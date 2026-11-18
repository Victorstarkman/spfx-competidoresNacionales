export interface ITarjetaCompetidor {
    id:number;
    nombre: string;
    perfil: string;
    cobertura: string;
    tipoActor: string;
    logo?: string;
    onSeleccionar: (id:number) => void;
}