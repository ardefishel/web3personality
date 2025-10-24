import Typ3Logo from "./assets/typ3-logo.png";

export function Brand() {
  return (
    <span className="break-keep font-bold ml-2">
      <img className="inline-block w-8 mr-2" src={Typ3Logo} alt="Typ3 Logo" />
      Web3Personality
    </span>
  );
}

// Export the logo separately for use in places that need just the logo
export { Typ3Logo as Logo }
