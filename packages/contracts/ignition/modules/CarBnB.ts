import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// cUSD Celo Sepolia testnet
const CUSD_SEPOLIA = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

const CarBnBModule = buildModule("CarbNBModule", (m) => {
  const carbnb = m.contract("CarBnB", [CUSD_SEPOLIA]);
  return { carbnb };
});

export default CarBnBModule;