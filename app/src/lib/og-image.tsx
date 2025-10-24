import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile } from "fs/promises";
import { join } from "path";

export interface OgImageProps {
  title?: string;
  description?: string;
  personalityType?: string;
  userAddress?: string;
}

export async function generateOgImage({
  title,
  description,
  personalityType,
  userAddress,
}: OgImageProps) {
  // Use environment variables for brand configuration
  const brandName = title || process.env.VITE_BRAND_NAME || "Web3Personality";
  const brandDomain = process.env.VITE_BRAND_DOMAIN || "web3personality.vercel.app";
  const defaultDescription = description || "Discover your on-chain personality";
  // Load fonts
  const interBold = await fetch(
    "https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap"
  ).then((res) => res.text());

  const fontUrl = interBold.match(/url\(([^)]+)\)/)?.[1];
  const fontData = fontUrl
    ? await fetch(fontUrl).then((res) => res.arrayBuffer())
    : undefined;

  // Load logo
  let logoBase64 = "";
  try {
    const logoPath = join(process.cwd(), "public", "typ3-logo.png");
    const logoBuffer = await readFile(logoPath);
    logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
  } catch (error) {
    console.error("Failed to load logo:", error);
  }

  // Brand colors - using cyan/turquoise accent
  const accentColor = "#00D9D9"; // Cyan accent from the logo
  const darkBg = "#0f172a"; // Dark slate background
  const accentGradient = "linear-gradient(135deg, #00D9D9 0%, #0891b2 100%)"; // Cyan gradient

  // Generate SVG with satori
  const svg = await satori(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: darkBg,
        padding: "0",
        color: "white",
        fontFamily: "Inter",
        position: "relative",
      }}
    >
      {/* Background Gradient Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: accentGradient,
          opacity: 0.15,
        }}
      />

      {/* Content Container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "80px",
          height: "100%",
          position: "relative",
          zIndex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Logo/Brand Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "60px",
          }}
        >
          {logoBase64 && (
            <img
              src={logoBase64}
              width={64}
              height={64}
              style={{
                marginRight: "20px",
              }}
            />
          )}
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: accentColor,
            }}
          >
            {brandName}
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {personalityType && (
            <div
              style={{
                fontSize: 80,
                fontWeight: 700,
                marginBottom: "30px",
                color: accentColor,
                lineHeight: 1.1,
              }}
            >
              {personalityType}
            </div>
          )}

          <div
            style={{
              fontSize: 40,
              color: "rgba(255, 255, 255, 0.95)",
              marginBottom: "20px",
              lineHeight: 1.3,
              maxWidth: "900px",
            }}
          >
            {defaultDescription}
          </div>

          {userAddress && (
            <div
              style={{
                fontSize: 28,
                color: accentColor,
                fontFamily: "monospace",
                marginTop: "20px",
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
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "60px",
            borderTop: `2px solid ${accentColor}33`,
            paddingTop: "30px",
            gap: "15px",
          }}
        >
          <div
            style={{
              fontSize: 26,
              color: "rgba(255, 255, 255, 0.9)",
              display: "flex",
              alignItems: "center",
            }}
          >
            Built on Base 🔵
          </div>
          <div
            style={{
              fontSize: 22,
              color: accentColor,
            }}
          >
            {brandDomain}
          </div>
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
