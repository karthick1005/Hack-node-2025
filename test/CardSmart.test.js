const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CardSmart Contract", function () {
  let CardSmart;
  let cardSmart;
  let owner;
  let user1;
  let user2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers
    CardSmart = await ethers.getContractFactory("CardSmart");
    [owner, user1, user2, ...addrs] = await ethers.getSigners();

    // Deploy the contract
    cardSmart = await CardSmart.deploy();
    await cardSmart.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await cardSmart.owner()).to.equal(owner.address);
    });

    it("Should have zero initial cards and transactions", async function () {
      expect(await cardSmart.getTotalCards()).to.equal(0);
      expect(await cardSmart.getTotalTransactions()).to.equal(0);
    });
  });

  describe("User Registration", function () {
    it("Should allow owner to register users", async function () {
      await cardSmart.registerUser(user1.address);
      expect(await cardSmart.authorizedUsers(user1.address)).to.equal(true);
    });

    it("Should emit UserRegistered event", async function () {
      await expect(cardSmart.registerUser(user1.address))
        .to.emit(cardSmart, "UserRegistered")
        .withArgs(user1.address);
    });

    it("Should not allow non-owner to register users", async function () {
      await expect(
        cardSmart.connect(user1).registerUser(user2.address)
      ).to.be.revertedWithCustomError(cardSmart, "OwnableUnauthorizedAccount");
    });

    it("Should not allow registering same user twice", async function () {
      await cardSmart.registerUser(user1.address);
      await expect(
        cardSmart.registerUser(user1.address)
      ).to.be.revertedWith("User already registered");
    });

    it("Should initialize user analytics correctly", async function () {
      await cardSmart.registerUser(user1.address);
      const analytics = await cardSmart.getUserAnalytics(user1.address);
      
      expect(analytics.totalCards).to.equal(0);
      expect(analytics.totalTransactions).to.equal(0);
      expect(analytics.totalSpent).to.equal(0);
      expect(analytics.totalIncome).to.equal(0);
      expect(analytics.monthlySpending).to.equal(0);
      expect(analytics.preferredCategory).to.equal("general");
      expect(analytics.lastActivity).to.be.above(0);
    });
  });

  describe("Card Management", function () {
    beforeEach(async function () {
      // Register user1 for card tests
      await cardSmart.registerUser(user1.address);
    });

    it("Should allow authorized users to create cards", async function () {
      const cardNumber = "4111111111111111";
      const cardName = "Test Credit Card";
      const category = "Credit";
      const creditLimit = ethers.parseEther("5");

      await expect(
        cardSmart.connect(user1).createCard(cardNumber, cardName, category, creditLimit)
      ).to.emit(cardSmart, "CardCreated");

      expect(await cardSmart.getTotalCards()).to.equal(1);
    });

    it("Should not allow unauthorized users to create cards", async function () {
      await expect(
        cardSmart.connect(user2).createCard("4111111111111111", "Test Card", "Credit", 5000)
      ).to.be.revertedWith("User not authorized");
    });

    it("Should store card details correctly", async function () {
      const cardNumber = "4111111111111111";
      const cardName = "Test Credit Card";
      const category = "Credit";
      const creditLimit = ethers.parseEther("5");

      await cardSmart.connect(user1).createCard(cardNumber, cardName, category, creditLimit);
      
      const card = await cardSmart.getCard(1);
      expect(card.cardNumber).to.equal(cardNumber);
      expect(card.cardName).to.equal(cardName);
      expect(card.category).to.equal(category);
      expect(card.creditLimit).to.equal(creditLimit);
      expect(card.owner).to.equal(user1.address);
      expect(card.isActive).to.equal(true);
      expect(card.balance).to.equal(0);
    });

    it("Should update user analytics when creating card", async function () {
      await cardSmart.connect(user1).createCard("4111111111111111", "Test Card", "Credit", 5000);
      
      const analytics = await cardSmart.getUserAnalytics(user1.address);
      expect(analytics.totalCards).to.equal(1);
    });

    it("Should allow card owner to update balance", async function () {
      await cardSmart.connect(user1).createCard("4111111111111111", "Test Card", "Credit", 5000);
      
      const newBalance = ethers.parseEther("1");
      await expect(
        cardSmart.connect(user1).updateCardBalance(1, newBalance)
      ).to.emit(cardSmart, "BalanceUpdated")
      .withArgs(1, newBalance);

      const card = await cardSmart.getCard(1);
      expect(card.balance).to.equal(newBalance);
    });

    it("Should not allow non-owner to update card balance", async function () {
      await cardSmart.connect(user1).createCard("4111111111111111", "Test Card", "Credit", 5000);
      
      await expect(
        cardSmart.connect(user2).updateCardBalance(1, 1000)
      ).to.be.revertedWith("Not card owner");
    });

    it("Should toggle card status", async function () {
      await cardSmart.connect(user1).createCard("4111111111111111", "Test Card", "Credit", 5000);
      
      await cardSmart.connect(user1).toggleCardStatus(1);
      let card = await cardSmart.getCard(1);
      expect(card.isActive).to.equal(false);

      await cardSmart.connect(user1).toggleCardStatus(1);
      card = await cardSmart.getCard(1);
      expect(card.isActive).to.equal(true);
    });

    it("Should return user's cards", async function () {
      await cardSmart.connect(user1).createCard("4111111111111111", "Card 1", "Credit", 5000);
      await cardSmart.connect(user1).createCard("4222222222222222", "Card 2", "Debit", 3000);
      
      const userCards = await cardSmart.getUserCards(user1.address);
      expect(userCards.length).to.equal(2);
      expect(userCards[0]).to.equal(1);
      expect(userCards[1]).to.equal(2);
    });
  });

  describe("Transaction Management", function () {
    beforeEach(async function () {
      // Register user and create a card for transaction tests
      await cardSmart.registerUser(user1.address);
      await cardSmart.connect(user1).createCard("4111111111111111", "Test Card", "Credit", ethers.parseEther("5"));
      await cardSmart.connect(user1).updateCardBalance(1, ethers.parseEther("2")); // Set initial balance
    });

    it("Should create expense transaction correctly", async function () {
      const amount = ethers.parseEther("0.5");
      const transactionName = "Coffee Purchase";
      const category = "Food & Dining";
      const transactionType = "expense";
      const blockchainHash = "0x1234567890abcdef";

      await expect(
        cardSmart.connect(user1).createTransaction(1, transactionName, amount, category, transactionType, blockchainHash)
      ).to.emit(cardSmart, "TransactionCreated")
      .withArgs(1, 1, amount);

      const transaction = await cardSmart.getTransaction(1);
      expect(transaction.transactionName).to.equal(transactionName);
      expect(transaction.amount).to.equal(amount);
      expect(transaction.category).to.equal(category);
      expect(transaction.transactionType).to.equal(transactionType);
      expect(transaction.user).to.equal(user1.address);
      expect(transaction.isConfirmed).to.equal(false);
    });

    it("Should create income transaction correctly", async function () {
      const amount = ethers.parseEther("1");
      const transactionName = "Salary Credit";
      const category = "Income";
      const transactionType = "income";
      const blockchainHash = "0xabcdef1234567890";

      await cardSmart.connect(user1).createTransaction(1, transactionName, amount, category, transactionType, blockchainHash);
      
      const transaction = await cardSmart.getTransaction(1);
      expect(transaction.transactionType).to.equal(transactionType);
      
      // Check if balance increased for income
      const card = await cardSmart.getCard(1);
      expect(card.balance).to.equal(ethers.parseEther("3")); // 2 + 1
    });

    it("Should update card and user analytics for expense transactions", async function () {
      const amount = ethers.parseEther("0.5");
      
      await cardSmart.connect(user1).createTransaction(1, "Test Expense", amount, "Shopping", "expense", "0x123");
      
      const card = await cardSmart.getCard(1);
      expect(card.totalTransactions).to.equal(1);
      expect(card.totalSpent).to.equal(amount);
      expect(card.balance).to.equal(ethers.parseEther("1.5")); // 2 - 0.5

      const analytics = await cardSmart.getUserAnalytics(user1.address);
      expect(analytics.totalTransactions).to.equal(1);
      expect(analytics.totalSpent).to.equal(amount);
    });

    it("Should update user analytics for income transactions", async function () {
      const amount = ethers.parseEther("1");
      
      await cardSmart.connect(user1).createTransaction(1, "Test Income", amount, "Salary", "income", "0x456");
      
      const analytics = await cardSmart.getUserAnalytics(user1.address);
      expect(analytics.totalIncome).to.equal(amount);
    });

    it("Should not allow creating transaction for non-existent card", async function () {
      await expect(
        cardSmart.connect(user1).createTransaction(999, "Test", 100, "Test", "expense", "0x123")
      ).to.be.revertedWith("Card does not exist");
    });

    it("Should not allow non-card-owner to create transaction", async function () {
      await cardSmart.registerUser(user2.address);
      
      await expect(
        cardSmart.connect(user2).createTransaction(1, "Test", 100, "Test", "expense", "0x123")
      ).to.be.revertedWith("Not card owner");
    });

    it("Should not allow zero amount transactions", async function () {
      await expect(
        cardSmart.connect(user1).createTransaction(1, "Test", 0, "Test", "expense", "0x123")
      ).to.be.revertedWith("Amount must be greater than zero");
    });

    it("Should allow owner to confirm transactions", async function () {
      await cardSmart.connect(user1).createTransaction(1, "Test", 100, "Test", "expense", "0x123");
      
      const newHash = "0x789abc";
      await expect(
        cardSmart.confirmTransaction(1, newHash)
      ).to.emit(cardSmart, "TransactionConfirmed")
      .withArgs(1, newHash);

      const transaction = await cardSmart.getTransaction(1);
      expect(transaction.isConfirmed).to.equal(true);
      expect(transaction.blockchainHash).to.equal(newHash);
    });

    it("Should return user's transactions", async function () {
      await cardSmart.connect(user1).createTransaction(1, "Transaction 1", 100, "Test", "expense", "0x111");
      await cardSmart.connect(user1).createTransaction(1, "Transaction 2", 200, "Test", "income", "0x222");
      
      const userTransactions = await cardSmart.getUserTransactions(user1.address);
      expect(userTransactions.length).to.equal(2);
    });
  });

  describe("Security and Access Control", function () {
    it("Should not allow non-owner to confirm transactions", async function () {
      await cardSmart.registerUser(user1.address);
      await cardSmart.connect(user1).createCard("4111111111111111", "Test Card", "Credit", 5000);
      await cardSmart.connect(user1).createTransaction(1, "Test", 100, "Test", "expense", "0x123");
      
      await expect(
        cardSmart.connect(user1).confirmTransaction(1, "0x456")
      ).to.be.revertedWithCustomError(cardSmart, "OwnableUnauthorizedAccount");
    });

    it("Should handle emergency withdrawal", async function () {
      // Send some ether to the contract
      await owner.sendTransaction({
        to: await cardSmart.getAddress(),
        value: ethers.parseEther("1")
      });

      const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
      await cardSmart.emergencyWithdraw();
      const finalOwnerBalance = await ethers.provider.getBalance(owner.address);

      expect(finalOwnerBalance).to.be.above(initialOwnerBalance);
    });

    it("Should receive ether", async function () {
      await owner.sendTransaction({
        to: await cardSmart.getAddress(),
        value: ethers.parseEther("1")
      });

      expect(await ethers.provider.getBalance(await cardSmart.getAddress())).to.equal(
        ethers.parseEther("1")
      );
    });
  });

  describe("Error Handling", function () {
    it("Should revert on invalid card access", async function () {
      await expect(
        cardSmart.getCard(999)
      ).to.be.revertedWith("Card does not exist");
    });

    it("Should revert on invalid transaction access", async function () {
      await expect(
        cardSmart.getTransaction(999)
      ).to.be.revertedWith("Transaction does not exist");
    });

    it("Should require card name when creating card", async function () {
      await cardSmart.registerUser(user1.address);
      
      await expect(
        cardSmart.connect(user1).createCard("4111111111111111", "", "Credit", 5000)
      ).to.be.revertedWith("Card name required");
    });

    it("Should require transaction name when creating transaction", async function () {
      await cardSmart.registerUser(user1.address);
      await cardSmart.connect(user1).createCard("4111111111111111", "Test Card", "Credit", 5000);
      
      await expect(
        cardSmart.connect(user1).createTransaction(1, "", 100, "Test", "expense", "0x123")
      ).to.be.revertedWith("Transaction name required");
    });
  });
});
