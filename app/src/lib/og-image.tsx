import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

export interface OgImageProps {
  title?: string;
  description?: string;
  personalityType?: string;
  userAddress?: string;
}

export async function generateOgImage({
  title = "Web3Personality",
  description = "Discover your on-chain personality on Base",
  personalityType,
  userAddress,
}: OgImageProps) {
  // Load fonts
  const interBold = await fetch(
    "https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap"
  ).then((res) => res.text());

  const fontUrl = interBold.match(/url\(([^)]+)\)/)?.[1];
  const fontData = fontUrl
    ? await fetch(fontUrl).then((res) => res.arrayBuffer())
    : undefined;

  // Generate SVG with satori
  const svg = await satori(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0f172a",
        backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "80px",
        color: "white",
        fontFamily: "Inter",
      }}
    >
      {/* Logo/Brand Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "60px",
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "white",
          }}
        >
          {title}
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
        }}
      >
        {personalityType && (
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              marginBottom: "30px",
              color: "white",
            }}
          >
            {personalityType}
          </div>
        )}

        <div
          style={{
            fontSize: 36,
            color: "rgba(255, 255, 255, 0.9)",
            marginBottom: "20px",
          }}
        >
          {description}
        </div>

        {userAddress && (
          <div
            style={{
              fontSize: 24,
              color: "rgba(255, 255, 255, 0.7)",
              fontFamily: "monospace",
            }}
          >
            {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "40px",
        }}
      >
        <div
          style={{
            fontSize: 24,
            color: "rgba(255, 255, 255, 0.8)",
          }}
        >
          Built on Base 🔵
        </div>
        <div
          style={{
            fontSize: 20,
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          web3personality.vercel.app
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: fontData
        ? [
            {
              name: "Inter",
              data: fontData,
              weight: 700,
              style: "normal",
            },
          ]
        : [],
    }
  );

  // Convert SVG to PNG using Resvg
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: 1200,
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return pngBuffer;
}
