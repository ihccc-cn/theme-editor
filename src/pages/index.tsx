import ThemeEditor from "./editor-theme/index";

window.onload = () => {
  document.documentElement.setAttribute("data-theme", "defaultLight");
};

export default function HomePage() {
  return <ThemeEditor />;
}
