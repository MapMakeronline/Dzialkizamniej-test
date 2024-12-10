import { MapView } from './components/Map/MapView';
import { LayerTree } from './components/LayerTree/LayerTree';
import { GoogleAuth } from './components/Auth/GoogleAuth';
import { LoadingOverlay } from './components/LoadingOverlay/LoadingOverlay';
import { useLoadingStore } from './store/loadingStore';
import { FirebaseTest } from './components/Debug/FirebaseTest';

function App() {
  const { isLoading, message } = useLoadingStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <LayerTree />
      <main className="h-screen">
        <GoogleAuth />
        <MapView />
      </main>
      {isLoading && <LoadingOverlay message={message || undefined} />}
      <FirebaseTest />
    </div>
  );
}

export default App;