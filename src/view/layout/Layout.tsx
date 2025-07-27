import React from "react";
import { Outlet } from "react-router";

function Layout() {
    return (
        <>
            <div className="flex flex-col h-screen">
                <div className="flex-1">
                    <Outlet />
                </div>
                <div className="">
                    {/* <Footer></Footer> */}
                </div>
            </div>
        </>
    )
}
export default React.memo(Layout);