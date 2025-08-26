import React, { lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Lazy load components
const TopNav = lazy(() => import("./layouts/common/TopNav"));
const AppRoutes = lazy(() => import("./routes"));

function App() {
  return (
    <AuthProvider>
      <div
        className="App"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <BrowserRouter>
          <Suspense fallback={<div style={{ height: '64px', backgroundColor: '#1976d2' }}></div>}>
            <TopNav />
          </Suspense>
          <main style={{ marginTop: "64px" }}>
            <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>}>
              <AppRoutes />
            </Suspense>
          </main>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
