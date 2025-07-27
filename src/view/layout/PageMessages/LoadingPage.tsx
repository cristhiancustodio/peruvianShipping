import { Loader2 } from "lucide-react";


export default function LoadingPage() {
    return (
        <div className="h-screen flex items-center justify-center">
            <Loader2 className="animate-spin" size={50} ></Loader2>
        </div>
    )
}