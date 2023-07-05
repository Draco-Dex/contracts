const hre = require("hardhat");

async function main() {
  //verify makerOrderManager
  // const makerOrderManagerAddress = "0xD0Cf68Bbe85D522Ea8A314588625DD7fd94EC7D1";
  // const makerOrderManagerContractArtifact = await hre.artifacts.readArtifact("MakerOrderManager");
  // await hre.run("verify:verify", {
  //   address: makerOrderManagerAddress,
  //   contract: makerOrderManagerContractArtifact,
  //   constructorArguments:["0xdEfB60ff7BA68D324Ec31Cd814301BFB3722A884","0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3"]
  // });
  // console.log("Verified makerOrderManager at address " , makerOrderManagerAddress);

// //verify SwapRouterHub
// const swapRouterHubAddress = "0xaA385114f8D8eF58C7abD9F00dCA2D759C8f770B";
// const swapRouterHubContractArtifact = await hre.artifacts.readArtifact("SwapRouterHub");
// await hre.run("verify:verify", {
//   address: swapRouterHubAddress,
//   contract: swapRouterHubContractArtifact,
//   constructorArguments:["0x0015C06093aC16253D6E264d18A1fB30B3Be79a6","0x1F98431c8aD98523631AE4a59f267346ea31F984","0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f","0xee01c0cd76354c383b8c7b4e65ea88d00b06f36f"]
// });
// console.log("Verified swapRouterHub at address " , swapRouterHubAddress);

// //verify Quoter
// const quoterAddress = "0x20a46359CcFEe8fCce11Cc0f3766E8dCD2dF4424";
// const quoterContractArtifact = await hre.artifacts.readArtifact("Quoter");
// await hre.run("verify:verify", {
//   address: quoterAddress,
//   contract: quoterContractArtifact,
//   constructorArguments:["0x0015C06093aC16253D6E264d18A1fB30B3Be79a6","0x1F98431c8aD98523631AE4a59f267346ea31F984","0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f","0xee01c0cd76354c383b8c7b4e65ea88d00b06f36f"]
// });
// console.log("Verified quoter at address " , quoterAddress);


// //verify GridQueryHelper
const gridQueryHelperAddress = "0xd1a783f59f738fC7b63e214f6361FeA67674CD55";
const gridQueryHelperContractArtifact = await hre.artifacts.readArtifact("GridQueryHelper");
await hre.run("verify:verify", {
  address: gridQueryHelperAddress,
  contract: gridQueryHelperContractArtifact
});
console.log("Verified GridQueryHelper at address " , gridQueryHelperAddress);


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });