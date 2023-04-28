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
      <h1 className="text-2xl mb-2 font-bold">{props.title}</h1>
      {props.subtitle ? (
        <p className="text-lg mb-2 text-italic">{props.subtitle}</p>
      ) : (
        <></>
      )}
      {props.children}
    </div>
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
      .text-italic {
        font-style: italic;
      }
    `}</style>
  </div>
);

export default Layout;
