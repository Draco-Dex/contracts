import {ethers} from "hardhat";

async function main() {


    //draco
    const dracoFactory= await ethers.getContractFactory("Draco");
    const draco = await dracoFactory.deploy();
    await draco.deployed();
    console.log("draco :", draco.address);

    //SwapRouterHub
    const swapRouterHubFactory= await ethers.getContractFactory("SwapRouterHub");
    const swapRouterHub = await swapRouterHubFactory.deploy("0x8aD24467cA24E280b96b6Dd5e17426c54a758E17","0x1F98431c8aD98523631AE4a59f267346ea31F984","0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f","0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3",draco.address);
    await swapRouterHub.deployed();
    console.log("swapRouterHub :", swapRouterHub.address);

    //Quoter
    const quoterFactory= await ethers.getContractFactory("Quoter");
    const quoter = await quoterFactory.deploy("0x8aD24467cA24E280b96b6Dd5e17426c54a758E17","0x1F98431c8aD98523631AE4a59f267346ea31F984","0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f","0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3");
    await quoter.deployed();
    console.log("quoter :", quoter.address);

    //部署makerOrderManager
    const ordetFactory = await ethers.getContractFactory("MakerOrderManager");
    const makerOrderManager = await ordetFactory.deploy("0x8aD24467cA24E280b96b6Dd5e17426c54a758E17","0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3",
    draco.address,swapRouterHub.address,quoter.address);
    await makerOrderManager.deployed();
    console.log("makerOrderManager :", makerOrderManager.address);

 
     //GridQueryHelper
     const gridQueryHelperFactory= await ethers.getContractFactory("GridQueryHelper");
     const gridQueryHelper = await gridQueryHelperFactory.deploy();
     await gridQueryHelper.deployed();
     console.log("gridQueryHelper :", gridQueryHelper.address);
    
}

main()
    .then(() => process.exit())
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
