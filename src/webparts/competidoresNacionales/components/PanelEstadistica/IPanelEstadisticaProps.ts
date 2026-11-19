import type { ICompetidor } from "../models/ICompetidor";

export  interface IPanelEstadisticaProps {
    competidores : ICompetidor[];
    onCerrar :() => void;
}
