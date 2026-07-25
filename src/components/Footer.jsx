export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} Mockcall AI · Demo environment</span>
        <span>Built to demonstrate an n8n lead profiling workflow</span>
      </div>
    </footer>
  );
}
