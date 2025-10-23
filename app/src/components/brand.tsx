import Type3Logo from "./assets/type3-logo.png";

export function Brand() {
  return (
    <span className="break-keep font-bold ml-2">
      <img className="inline-block w-8 mr-2" src={Type3Logo} alt="Typ3 Logo" />
      Typ3.xyz
    </span>
  );
}
