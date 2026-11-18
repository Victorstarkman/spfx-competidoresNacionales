import type { ICompetidor } from "../models/ICompetidor";
import type { IAntecedente } from "../models/IAntecedents";

export interface IDetalleCompetidorProps {
 competidor: ICompetidor;
 antecedentes:IAntecedente[];
 onCerrar: ()=>void;
}