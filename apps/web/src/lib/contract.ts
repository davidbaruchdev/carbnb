export const CARBNB_ADDRESS = "0x78B4720E6A45a9dfbb5d72C6f019020556a85600";

export const CARBNB_ABI = [
  {
    "inputs": [{"internalType": "address","name": "user","type": "address"}],
    "name": "verifyUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string","name": "model","type": "string"},
      {"internalType": "string","name": "city","type": "string"},
      {"internalType": "uint256","name": "pricePerDay","type": "uint256"}
    ],
    "name": "listCar",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256","name": "carId","type": "uint256"},
      {"internalType": "uint256","name": "daysToRent","type": "uint256"}
    ],
    "name": "rentCar",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256","name": "carId","type": "uint256"}],
    "name": "getCar",
    "outputs": [
      {
        "components": [
          {"internalType": "address","name": "owner","type": "address"},
          {"internalType": "string","name": "model","type": "string"},
          {"internalType": "string","name": "city","type": "string"},
          {"internalType": "uint256","name": "pricePerDay","type": "uint256"},
          {"internalType": "bool","name": "isAvailable","type": "bool"}
        ],
        "internalType": "struct CarbNB.Car",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "user","type": "address"}],
    "name": "isUserVerified",
    "outputs": [{"internalType": "bool","name": "","type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "carCounter",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;