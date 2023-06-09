import Header from "@/components/shared/header";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Context from "../../context/context";
import { AuthProvider } from "../../context/authContext";
import { ToastContainer } from "react-toastify";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Kerberos</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Context>
        <AuthProvider>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <div className="w-screen min-h-screen gradient-background">
            <Header />
            <Component {...pageProps} />
          </div>
        </AuthProvider>
      </Context>
    </>
  );
}
