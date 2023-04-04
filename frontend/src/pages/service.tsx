import { useRouter } from "next/router";
import * as React from "react";
import { UserDataContext } from "../../context/context";
import { useCallback, useContext } from "react";
import { useAuth } from "../../context/authContext";
import { InfinitySpin } from "react-loader-spinner";
import { toast } from "react-toastify";
import axios from "axios";

export interface IServiceProps {}

export default function Service(props: IServiceProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [result, setResult] = React.useState("");
  const [message, setMessage] = React.useState("");
  const { userData } = useContext(UserDataContext);
  const { askForST } = useAuth();

  const router = useRouter();
  React.useEffect(() => {
    if (!userData?.username) {
      router.push("/");
    }
  }, [router, userData]);
  const onClick: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      askForST(password)
        .catch((e) => {
          toast.error("A Problem happened. Please try again later");
        })
        .then(async (res) => {
          console.log(res);
          try {
            const result = await axios.post(
              "http://localhost:3001/answer",
              { question: message },
              {
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": ""
                },
              }
            );
            console.log(result);
            setResult(result.data);
          } catch (e) {
            console.error(e);
            toast.error("A Problem happened. Please try again later");
          }
        })
        .finally(() => setIsLoading(false));
    },
    [password, askForST]
  );

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
                onChange={setMessageValue}
                name="message"
              ></textarea>
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <input
                className="py-4 px-6 flex-1 bg-zinc-800 rounded text-zinc-300 outline-none focus:shadow-xl transition-all ease-in-out"
                placeholder="Password"
                onChange={setPasswordValue}
                value={password}
                type="password"
                name="password"
              ></input>
            </div>
            <button
              className="w-full bg-purple-600 py-4 mt-10 px-4 rounded-md text-white font-semibold text-lg transition-all ease-out hover:-translate-y-1 hover:shadow-lg disabled:opacity-20"
              onClick={onClick}
              disabled={isLoading || !password}
            >
              <p>Send message</p>
            </button>
          </form>
        </div>
      </div>
      {isLoading && (
        <>
          <div className="fixed z-40 bg-black w-screen h-screen top-0 left-0 opacity-60"></div>
          <div className="fixed flex justify-center items-center z-40  w-screen h-screen top-0 left-0">
            <InfinitySpin width="200" color="white" />
          </div>
        </>
      )}
      {result && (
        <>
          <div className="fixed z-40 bg-black w-screen h-screen top-0 left-0 opacity-60"></div>
          <div className="fixed flex justify-center items-center z-40  w-screen h-screen top-0 left-0 p-4">
            <div className="flex flex-col bg-zinc-800 p-8 rounded-xl shadow-md text-gray-300 transition-all ease-out cursor-pointer max-w-screen-lg">
              <h2 className="code mb-4 text-lg">
                This is the answer to your question
              </h2>
              <p className="code mb-4 text-sm p-4 bg-zinc-900 rounded-lg">
                {result}
              </p>
              <button
                className="w-full bg-purple-600 py-2 mt-4 px-2 rounded-md text-white font-semibold text-md transition-all ease-out hover:-translate-y-1 hover:shadow-lg disabled:opacity-20"
                onClick={() => {
                  setResult("");
                }}
              >
                <p>Okay</p>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
