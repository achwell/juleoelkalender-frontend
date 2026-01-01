import FullScreenLoader from "@/components/FullScreenLoader";
import router from "@/routes";
import { Suspense } from "react";
import { RouterProvider } from "react-router";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
    return (
        <Suspense fallback={<FullScreenLoader />}>
            <div>
                <RouterProvider router={router} />
            </div>
        </Suspense>
    );
};

export default App;
