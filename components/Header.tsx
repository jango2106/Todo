import React from "react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { Button } from "flowbite-react";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  const userDetails = (
    <div className="justify-self-end flex gap-2 items-center">
      <p className="font-bold ">
        {session?.user?.name} {`(${session?.user?.email})`}
      </p>
      <Button
        color="none"
        size="sm"
        className="ml-auto border-solid border-2 border-sky-500"
        onClick={() => {
          router.push("/").then(() => signOut());
        }}
      >
        <a>Log out</a>
      </Button>
    </div>
  );

  const backButton = (
    <div className="justify-self-start">
      <Button onClick={() => router.back()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
          />
        </svg>

        <p className="pl-2">Back</p>
      </Button>
    </div>
  );

  return (
    <nav className="flex justify-between p-5">
      {session?.user ? (
        <>
          {backButton}
          {userDetails}
        </>
      ) : (
        <></>
      )}
    </nav>
  );
};

export default Header;
