import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import RoutesPage from "./routes";

function App() {
  return (
    <div className="app">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="page-content">
          <RoutesPage />
        </div>
      </div>
    </div>
  );
}

export default App;