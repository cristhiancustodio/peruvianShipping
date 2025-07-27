"use client"
import { ArrowLeft } from "lucide-react";
import { Button } from '@/components/ui/button'
import { useNavigate } from "react-router";


export default function GoBack() {
    const navigate = useNavigate();
    return (

        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
        </Button>
    )
}