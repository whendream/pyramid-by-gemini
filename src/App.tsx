import MainLayout from "./components/layout/MainLayout";
import Calculator from "./components/calculator/Calculator";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <>
      <MainLayout>
        <Calculator />
      </MainLayout>
      <Analytics />
    </>
  );
}
export default App;
