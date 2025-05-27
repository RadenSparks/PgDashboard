import { Stack } from "@chakra-ui/react";
import { Sidebar } from "./Sidebar";
import { MainContent } from "./MainContent";

function App() {
  return (
    <Stack flexDirection="row" height="100vh" alignItems="stretch" bg="bg.muted">
      <Sidebar />
      <MainContent />
    </Stack>
  );
}

export default App;
