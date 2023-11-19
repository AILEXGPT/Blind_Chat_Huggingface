import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Main } from "@/components/main";
import NoSSR from "@/components/no-ssr";

export default function Home() {
  return (
    <div id="content" className="pb-32 h-screen overflow-auto">
      <Header />
      <NoSSR>
        <Main />
      </NoSSR>
      <Footer />
    </div>
  );
}
