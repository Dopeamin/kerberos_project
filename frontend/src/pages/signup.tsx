import { signup } from "@/utils/requests";
import axios from "axios";
import { useRouter } from "next/router";
import * as React from "react";
import { MouseEventHandler, ChangeEventHandler } from "react";
import { InfinitySpin } from "react-loader-spinner";
import { toast } from "react-toastify";

export interface ISignUpProps {}

export default function SignUp(props: ISignUpProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [userName, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const router = useRouter();

  const onClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    signup(userName, password)
      .then((res) => {
        toast.success("Registered successfully");
        router.push("/");
      })
      .catch((res) => {
        toast.error("A Problem happened. Please try again later");
        console.log(res);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const setUsernameValue: ChangeEventHandler<HTMLInputElement> = (e) => {
    console.log(e.target.value);
    setUsername(e.target.value);
  };

  const setPasswordValue: ChangeEventHandler<HTMLInputElement> = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="flex justify-center w-full items-center">
      <div className="flex flex-col w-full max-w-7xl mt-10 items-center">
        <h1 className="text-center text-white text-4xl font-bold">
          Register your account
        </h1>
        <p className="px-4 max-w-4xl text-center text-sm text-gray-400 py-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque
          deleniti nisi magnam dignissimos consequatur eligendi ipsam veniam
          voluptate nobis sint expedita ratione at, suscipit rem qui aut sed.
          Fugit, itaque.
        </p>
        <div className="py-10 px-4 w-full flex justify-center">
          <form className="flex flex-col gap-4 w-full max-w-[600px]">
            <div>
              <input
                className="py-4 px-6 w-full bg-zinc-800 rounded text-zinc-300 outline-none focus:shadow-xl transition-all ease-in-out"
                placeholder="Username"
                type="text"
                name="userName"
                value={userName}
                onChange={setUsernameValue}
              ></input>
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
              disabled={isLoading || !userName || !password}
            >
              <p>Sign Up</p>
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
    </div>
  );
}
