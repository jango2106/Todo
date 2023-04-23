import React, { ReactNode } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode;
  title: string;
  subtitle?: string;
};

const Layout: React.FC<Props> = (props) => (
  <div className="screen">
    <Header />
    <div className="layout">
      <h1 className="text-2xl mb-2">{props.title}</h1>
      {props.subtitle ? (
        <h1 className="text-lg mb-2">{props.subtitle}</h1>
      ) : (
        <></>
      )}
      {props.children}
    </div>
    <style jsx global>{`
      html {
        box-sizing: border-box;
      }

      *,
      *:before,
      *:after {
        box-sizing: inherit;
      }

      body {
        margin: 0;
        padding: 0;
        font-size: 16px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
          "Segoe UI Symbol";
        background: rgba(0, 0, 0, 0.05);
      }
    `}</style>
    <style jsx>{`
      .layout {
        padding: 0 2rem;
      }
      @media screen and (min-width: 1024px) {
        .screen {
          margin: auto;
          width: 80%;
          max-width: 1024px;
        }
      }
    `}</style>
  </div>
);

export default Layout;
