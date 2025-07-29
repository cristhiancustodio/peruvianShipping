export interface DocumentRecord {
    id: string
    fechaLlegada: string
    cliente: string
    numeroOrden: string
    documentosPendientes: string[]
    observacion: string
    diasAntesAlerta: string
    fechaCreacion: string
    notificado: boolean
}

