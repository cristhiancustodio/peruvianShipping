import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Plus } from "lucide-react"
import { RegistrationForm } from "./components/registration-form"
import { RecordsList } from "./components/record-list"


import { useEffect } from "react"
import { useDocuments } from "@/hook/useDocuments"



const Home = () => {
    const { records, addRecord, getListRecords, deleteRecord, editRecord } = useDocuments();
    
    useEffect(() => {
        getListRecords();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-3 bg-primary rounded-full">
                            <FileText className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900">Sistema de Gestión Documental</h1>
                    </div>
                    <p className="text-lg text-gray-600">Administra y controla tus documentos de manera eficiente</p>
                </div>

                <Tabs defaultValue="form" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                        <TabsTrigger value="form" className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Nuevo Registro
                        </TabsTrigger>
                        <TabsTrigger value="records" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Registros ({records.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="form">
                        <Card className="max-w-2xl mx-auto shadow-lg">
                            <CardHeader className="">
                                <CardTitle className="text-2xl">Agregar Nuevo Registro</CardTitle>
                                <CardDescription className="">
                                    Complete la información del documento y cliente
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-6">
                                <RegistrationForm onSubmit={addRecord} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="records">
                        <RecordsList records={records} onDelete={deleteRecord} onEdit={editRecord} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
export default Home;