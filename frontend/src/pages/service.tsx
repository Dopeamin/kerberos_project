import { useRouter } from "next/router";
import * as React from "react";
import { UserData } from "../../context/context";

export interface IServiceProps {}

export default function Service(props: IServiceProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [message, setMessage] = React.useState("");
  const context = React.useContext(UserData);

  const router = useRouter();
  React.useEffect(() => {
    if (context) {
      if (!context.userData?.username) {
        router.push("/");
      }
    }
  }, [context]);
  const onClick = async (e: any) => {};

  const setPasswordValue = (e: any) => {
    setPassword(e.target.value);
  };

  const setMessageValue = (e: any) => {
    setMessage(e.target.value);
  };
  return (
    <div className="flex justify-center w-full items-center">
      <div className="flex flex-col w-full max-w-7xl mt-10 items-center">
        <h1 className="text-center text-white text-4xl font-bold code">
          USE OUR CHATGPT API
        </h1>
        <p className="px-4 max-w-4xl text-center text-sm text-gray-400 py-4">
          If you already have an account please type in your email and password
          and message to be sent
        </p>
        <div className="py-10 px-4 w-full flex justify-center">
          <form className="flex flex-col gap-4 w-full max-w-[600px]">
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <textarea
                className="py-4 px-6 flex-1 h-40 bg-zinc-800 rounded text-zinc-300 outline-none focus:shadow-xl transition-all ease-in-out"
                placeholder="Question ..."
                onKeyUp={setMessageValue}
                name="message"
              ></textarea>
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <input
                className="py-4 px-6 flex-1 bg-zinc-800 rounded text-zinc-300 outline-none focus:shadow-xl transition-all ease-in-out"
                placeholder="Password"
                onKeyUp={setPasswordValue}
                type="password"
                name="password"
              ></input>
            </div>
            <button
              className="w-full bg-purple-600 py-4 mt-10 px-4 rounded-md text-white font-semibold text-lg transition-all ease-out hover:-translate-y-1 hover:shadow-lg disabled:opacity-20"
              onClick={onClick}
              disabled={isLoading || !password || !message}
            >
              <p>Send message</p>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
