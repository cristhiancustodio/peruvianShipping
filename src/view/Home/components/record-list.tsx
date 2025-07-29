"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, FileText, Clock, Trash2, AlertCircle, Pencil, Check } from "lucide-react"
import type { DocumentRecord } from "@/type/DocumentsType"



interface RecordsListProps {
    records: DocumentRecord[]
    onDelete: (id: string) => void
    onEdit: (id: string, updatedRecord: Omit<DocumentRecord, "id" | "fechaCreacion">) => void
}


export function RecordsList({ records, onDelete, onEdit }: RecordsListProps) {
    const formatDate = (dateString: string) => {
        if (!dateString) return "No especificada"
        return new Date(dateString).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const isAlertDate = (alertDate: string) => {
        if (!alertDate) return false
        const today = new Date()
        const alert = new Date(alertDate)
        return alert <= today
    }

    if (records.length === 0) {
        return (
            <Card className="max-w-2xl mx-auto text-center py-12">
                <CardContent>
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay registros</h3>
                    <p className="text-gray-500">Agregue su primer registro usando el formulario</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Registros Guardados</h2>
                <p className="text-gray-600">Total de registros: {records.length}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {records.map((record) => (
                    <Card key={record.id} className="shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                    Orden #{record.numeroOrden}
                                </CardTitle>
                                <div className="">
                                    {/* button edit */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(record.id, record)}
                                        className=""
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    {/* button delete */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(record.id)}
                                        className=""
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>

                                </div>
                            </div>
                            {isAlertDate(record.diasAntesAlerta) && (
                                <div className="flex items-center gap-1 text-amber-600 text-sm">
                                    <AlertCircle className="h-4 w-4" />
                                    Alerta activa
                                </div>
                            )}
                            {record.notificado 
                            ? <div className="text-sm text-green-600 flex gap-1">
                                <Check size={20} />
                                Notificado</div>
                            : <div className="text-sm text-amber-600">Pendiente por notificar</div>
                            }
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">Cliente:</span>
                                    <span>{record.cliente}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">Llegada:</span>
                                    <span>{formatDate(record.fechaLlegada)}</span>
                                </div>

                                {record.diasAntesAlerta && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium">Alerta:</span>
                                        <span className={isAlertDate(record.diasAntesAlerta) ? "text-amber-600 font-medium" : ""}>
                                            {formatDate(record.diasAntesAlerta)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {record.documentosPendientes.length > 0 && (
                                <div className="space-y-2">
                                    <span className="text-sm font-medium text-gray-700">Documentos Pendientes:</span>
                                    <div className="flex flex-wrap gap-1">
                                        {record.documentosPendientes.map((doc, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {doc}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {record.observacion && (
                                <div className="space-y-1">
                                    <span className="text-sm font-medium text-gray-700">Observación:</span>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded text-wrap break-words">
                                        {record.observacion}
                                    </p>
                                </div>
                            )}

                            <div className="pt-2 border-t text-xs text-gray-500">Creado: {formatDate(record.fechaCreacion)}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
