import { DocumentRecord } from "@/type/DocumentsType"
import { useState } from "react"
import API from "@/services/API"


export function useDocuments() {
    const [records, setRecords] = useState<DocumentRecord[]>([]);


    const getListRecords = async () => {

        try {
            // const api = await API();
            const response = await API.get("")
            setRecords(response.data)
        } catch (error) {
            console.error("Error fetching records:", error)
            return [];
        }
    }

    const addRecord = async (record: Omit<DocumentRecord, "id" | "fechaCreacion">) => {
        //Axios.post("/api/documents", newRecord) // Assuming you have an API endpoint to save records
        await API.post("", record);
        //setRecords((prev) => [newRecord, ...prev])
        await getListRecords();
    }

    const deleteRecord = async (id: string) => {
        await API.delete(`/${id}`);
        //setRecords((prev) => prev.filter((record) => record.id !== id))
        await getListRecords();
    }

    const editRecord = (id: string, updatedRecord: Omit<DocumentRecord, "id" | "fechaCreacion">) => {
        setRecords((prev) =>
            prev.map((record) =>
                record.id === id
                    ? {
                        ...record,
                        ...updatedRecord,
                        fechaCreacion: new Date().toISOString(),
                    }
                    : record
            )
        )
    }
    return {
        records,
        addRecord,
        deleteRecord,
        editRecord,
        getListRecords
    }
}

