// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarBnB is Ownable {
    
    // Structs
    struct Car {
        address owner;
        string model;
        string city;
        uint256 pricePerDay;
        bool isAvailable;
    }
    
    struct Rental {
        uint256 carId;
        address renter;
        uint256 startTime;
        uint256 endTime;
        uint256 totalPrice;
        bool isActive;
    }
    
    // State
    mapping(uint256 => Car) public cars;
    mapping(uint256 => Rental) public rentals;
    mapping(address => bool) public verifiedUsers;
    
    uint256 public carCounter;
    uint256 public rentalCounter;
    
    IERC20 public cUSD;
    
    // Events
    event UserVerified(address indexed user);
    event CarListed(uint256 indexed carId, address indexed owner, string city, uint256 pricePerDay);
    event CarRented(uint256 indexed rentalId, uint256 indexed carId, address indexed renter);
    event RentalCompleted(uint256 indexed rentalId);
    
    constructor(address _cUSD) Ownable(msg.sender) {
        cUSD = IERC20(_cUSD);
    }
    
    // Self Protocol will call this after verification
    function verifyUser(address user) external onlyOwner {
        verifiedUsers[user] = true;
        emit UserVerified(user);
    }
    
    modifier onlyVerified() {
        require(verifiedUsers[msg.sender], "Must be verified");
        _;
    }
    
    function listCar(
        string calldata model,
        string calldata city,
        uint256 pricePerDay
    ) external onlyVerified returns (uint256) {
        uint256 carId = carCounter++;
        
        cars[carId] = Car({
            owner: msg.sender,
            model: model,
            city: city,
            pricePerDay: pricePerDay,
            isAvailable: true
        });
        
        emit CarListed(carId, msg.sender, city, pricePerDay);
        return carId;
    }
    
    function rentCar(uint256 carId, uint256 daysToRent) external onlyVerified returns (uint256) {
        Car storage car = cars[carId];
        require(car.isAvailable, "Car not available");
        require(car.owner != msg.sender, "Cannot rent own car");
        
        uint256 totalPrice = car.pricePerDay * daysToRent;
        
        require(
            cUSD.transferFrom(msg.sender, address(this), totalPrice),
            "Payment failed"
        );
        
        uint256 rentalId = rentalCounter++;
        
        rentals[rentalId] = Rental({
            carId: carId,
            renter: msg.sender,
            startTime: block.timestamp,
            endTime: block.timestamp + (daysToRent * 1 days),
            totalPrice: totalPrice,
            isActive: true
        });
        
        car.isAvailable = false;
        
        emit CarRented(rentalId, carId, msg.sender);
        return rentalId;
    }
    
    function completeRental(uint256 rentalId) external {
        Rental storage rental = rentals[rentalId];
        Car storage car = cars[rental.carId];
        
        require(rental.isActive, "Rental not active");
        require(
            msg.sender == car.owner || msg.sender == rental.renter,
            "Not authorized"
        );
        
        rental.isActive = false;
        car.isAvailable = true;
        
        require(
            cUSD.transfer(car.owner, rental.totalPrice),
            "Transfer failed"
        );
        
        emit RentalCompleted(rentalId);
    }
    
    // View functions
    function getCar(uint256 carId) external view returns (Car memory) {
        return cars[carId];
    }
    
    function getRental(uint256 rentalId) external view returns (Rental memory) {
        return rentals[rentalId];
    }
    
    function isUserVerified(address user) external view returns (bool) {
        return verifiedUsers[user];
    }
}