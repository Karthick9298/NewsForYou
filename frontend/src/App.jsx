import { ThemeProvider } from '@/components/theme-provider';
import { LandingPage } from '@/pages/LandingPage';

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="newsforu-theme">
            <LandingPage />
        </ThemeProvider>
    );
}
export default App;
