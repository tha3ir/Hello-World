function App() {
  const Hero = window.Hero;
  const Capabilities = window.Capabilities;

  return (
    <main className="bg-black font-body">
      <Hero />
      <Capabilities />
    </main>
  );
}

window.App = App;

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
