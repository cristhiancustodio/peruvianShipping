"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Save } from "lucide-react"
import type { DocumentRecord } from "@/type/DocumentsType"


interface RegistrationFormProps {
    onSubmit: (record: Omit<DocumentRecord, "id" | "fechaCreacion">) => void
}

export function RegistrationForm({ onSubmit }: RegistrationFormProps) {
    const [formData, setFormData] = useState({
        fechaLlegada: "",
        cliente: "",
        numeroOrden: "",
        observacion: "",
        diasAntesAlerta: "",
    })

    const [documentos, setDocumentos] = useState<string[]>([])
    const [nuevoDocumento, setNuevoDocumento] = useState("")

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const agregarDocumento = () => {
        if (nuevoDocumento.trim()) {
            setDocumentos((prev) => [...prev, nuevoDocumento.trim()])
            setNuevoDocumento("")
        }
    }

    const eliminarDocumento = (index: number) => {
        setDocumentos((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.fechaLlegada || !formData.cliente || !formData.numeroOrden) {
            alert("Por favor complete todos los campos obligatorios")
            return
        }

        onSubmit({
            ...formData,
            documentosPendientes: documentos,
        })

        // Reset form
        setFormData({
            fechaLlegada: "",
            cliente: "",
            numeroOrden: "",
            observacion: "",
            diasAntesAlerta: "",
        })
        setDocumentos([]);
        setNuevoDocumento("");
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="fechaLlegada" className="text-sm font-medium">
                        Fecha de Llegada *
                    </Label>
                    <Input
                        id="fechaLlegada"
                        type="date"
                        value={formData.fechaLlegada}
                        onChange={(e) => handleInputChange("fechaLlegada", e.target.value)}
                        className="w-full"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cliente" className="text-sm font-medium">
                        Cliente *
                    </Label>
                    <Input
                        id="cliente"
                        type="text"
                        placeholder="Nombre del cliente"
                        value={formData.cliente}
                        onChange={(e) => handleInputChange("cliente", e.target.value)}
                        className="w-full"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="numeroOrden" className="text-sm font-medium">
                        N° Orden *
                    </Label>
                    <Input
                        id="numeroOrden"
                        type="text"
                        placeholder="Número de orden"
                        value={formData.numeroOrden}
                        onChange={(e) => handleInputChange("numeroOrden", e.target.value)}
                        className="w-full"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="diasAntesAlerta" className="text-sm font-medium">
                        Días Antes de la Alerta
                    </Label>
                    <Input
                        id="diasAntesAlerta"
                        type="date"
                        value={formData.diasAntesAlerta}
                        onChange={(e) => handleInputChange("diasAntesAlerta", e.target.value)}
                        className="w-full"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <Label className="text-sm font-medium">Documentos Pendientes</Label>
                <Card className="p-4 bg-gray-50">
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            placeholder="Nombre del documento"
                            value={nuevoDocumento}
                            onChange={(e) => setNuevoDocumento(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), agregarDocumento())}
                            className="flex-1"
                        />
                        <Button type="button" variant="outline" onClick={agregarDocumento} size="sm" className="px-3">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {documentos.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {documentos.map((doc, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                                    {doc}
                                    <button type="button" onClick={() => eliminarDocumento(index)} className="ml-1 hover:text-red-600">
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </Card>
            </div>

            <div className="space-y-2">
                <Label htmlFor="observacion" className="text-sm font-medium">
                    Observación
                </Label>
                <Textarea
                    id="observacion"
                    placeholder="Ingrese observaciones adicionales..."
                    value={formData.observacion}
                    onChange={(e) => handleInputChange("observacion", e.target.value)}
                    className="min-h-[100px] resize-none"
                />
            </div>

            <Button type="submit" className="w-full bg-primary/90 hover:bg-primary">
                <Save className="" />
                Guardar Registro
            </Button>
        </form>
    )
}
