import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import AuthPage from "./pages/AuthPage/AuthPage";
import PageLayout from "./Layouts/PageLayout/PageLayout";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

function App() {
  const { data:authUser} = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json()
        if(data.error) return null
          
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch user");
        }
        console.log("authUser is here:", data)
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry:false,
    refetchOnWindowFocus: false,
  });

  if (authUser === undefined) return null; // Don't render anything until authUser is defined (either user or null)
  return (
    <PageLayout>
     <Routes>

        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/auth"/>}/>
        <Route path="/auth" element={!authUser ? <AuthPage /> : <Navigate to="/"/>}/>
        <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/auth"/>}/>


     </Routes>
     <Toaster/>

    </PageLayout>

  );
}

export default App;
