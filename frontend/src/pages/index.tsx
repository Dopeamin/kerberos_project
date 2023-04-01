import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="w-full flex justify-center">
        <div className="w-full max-w-7xl flex justify-center text-7xl text-white font-bold py-10 px-10 gap-10 flex-col md:flex-row items-center">
          <div className="max-w-xl z-20">
            <h1>Choose a server to use</h1>
            <h1>And get authenticated</h1>
            <p className="text-sm text-gray-400 font-medium mt-4">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur
              repellat voluptatem, provident optio id dolores ea repellendus,
              molestias placeat omnis maxime aliquam, excepturi iusto! Expedita
              quos omnis aliquid dolores quas?
            </p>
          </div>
          <div className="flex-1 h-[300px] md:h-[500px] relative opacity-40 z-10">
            <div className="absolute md:-left-40 w-full h-full">
              <Image
                className="absolute left-40"
                fill
                objectFit="cover"
                src={
                  "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
                }
                alt={"Image"}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-screen w-screen z-20 absolute top-0 overflow-auto p-10 box-border">
        <div className="flex-1"></div>
        <div className="flex-1 flex flex-col items-center py-4">
          <div className="flex bg-zinc-800 p-4 rounded-xl shadow-md text-gray-300 w-60 transition-all ease-out cursor-pointer hover:-translate-y-1 hover:shadow-purple-900 mb-10">
            <h2 className="code">ChatGPT Api</h2>
          </div>
          <div className="flex bg-zinc-800 p-4 rounded-xl shadow-md text-gray-300 w-60 transition-all ease-out cursor-pointer hover:-translate-y-1 hover:shadow-purple-900 mb-10">
            <h2 className="code">Coming soon</h2>
          </div>
          <div className="flex bg-zinc-800 p-4 rounded-xl shadow-md text-gray-300 w-60 transition-all ease-out cursor-pointer hover:-translate-y-1 hover:shadow-purple-900 mb-10">
            <h2 className="code">Coming soon</h2>
          </div>
          <div className="flex bg-zinc-800 p-4 rounded-xl shadow-md text-gray-300 w-60 transition-all ease-out cursor-pointer hover:-translate-y-1 hover:shadow-purple-900 mb-10">
            <h2 className="code">Coming soon</h2>
          </div>
          <div className="flex bg-zinc-800 p-4 rounded-xl shadow-md text-gray-300 w-60 transition-all ease-out cursor-pointer hover:-translate-y-1 hover:shadow-purple-900 mb-10">
            <h2 className="code">Coming soon</h2>
          </div>
          <div className="flex bg-zinc-800 p-4 rounded-xl shadow-md text-gray-300 w-60 transition-all ease-out cursor-pointer hover:-translate-y-1 hover:shadow-purple-900 mb-10">
            <h2 className="code">Coming soon</h2>
          </div>
          <div className="flex bg-zinc-800 p-4 rounded-xl shadow-md text-gray-300 w-60 transition-all ease-out cursor-pointer hover:-translate-y-1 hover:shadow-purple-900 mb-10">
            <h2 className="code">Coming soon</h2>
          </div>
          <div className="flex bg-zinc-800 p-4 rounded-xl shadow-md text-gray-300 w-60 transition-all ease-out cursor-pointer hover:-translate-y-1 hover:shadow-purple-900 mb-10">
            <h2 className="code">Coming soon</h2>
          </div>
        </div>
      </div>
      <div className="fixed top-0 left-0 w-screen h-screen bg-black z-40 opacity-70"></div>
      <div className="fixed top-0 left-0 w-screen h-screen flex flex-row z-40 justify-center items-center">
        <div className="flex flex-col bg-zinc-800 p-8 rounded-xl shadow-md text-gray-300 transition-all ease-out cursor-pointer">
          <h2 className="code mb-4">
            Please provide a valid username, or{" "}
            <Link href={"/signup"}>
              <span className="code font-bold text-purple-400">Signup</span>
            </Link>
          </h2>
          <input
            className="py-2 px-4 w-full bg-zinc-600 rounded text-zinc-300 outline-none focus:shadow-xl transition-all ease-in-out"
            placeholder="Username"
            type="text"
            name="username"
          ></input>
          <button
            className="w-full bg-purple-600 py-2 mt-4 px-2 rounded-md text-white font-semibold text-md transition-all ease-out hover:-translate-y-1 hover:shadow-lg disabled:opacity-20"

          >
            <p>Confirm</p>
          </button>
        </div>
      </div>
    </>
  );
}
