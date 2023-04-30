import { Button, Card } from "flowbite-react";
import { Provider } from "next-auth/providers";
import { signIn } from "next-auth/react";
import { AuthSvgs } from "../constants/svgs";

type LoginProps = {
  providers: Provider[];
};

const Login: React.FC<LoginProps> = ({ providers }) => {
  const getProviderSvg = (key: string) => {
    const svg = AuthSvgs.get(key);

    return svg ? (
      <svg className="w-4 h-4 mr-2 -ml-1" viewBox={svg.viewbox}>
        <path fill={svg.fill} d={svg.d}></path>
      </svg>
    ) : (
      <></>
    );
  };
  return (
    <Card>
      <h1>
        Prioritized Todo List... its not done yet but feel free to login and use
        it anyway!
      </h1>

      {Object.values(providers).map((provider) => (
        <Button color="dark" onClick={() => signIn(provider.id)}>
          {getProviderSvg(provider.id)}
          Log In with {provider.name}
        </Button>
      ))}
    </Card>
  );
};

export default Login;
