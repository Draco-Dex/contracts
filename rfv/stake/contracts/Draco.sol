// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

// import {IERC20} from "openzeppelin/token/ERC20/IERC20.sol";
import {ERC20} from "./tokens/ERC20.sol";
import {IGrid} from "./interfaces/IGrid.sol";


contract Draco is ERC20 {

    error VaultAlreadySet();
    error Unauthorized();


    address public immutable drs; // Jimmy Revenue Service (DRS) address
    address public vault; // uDraco vault address
    address public immutable controller; 

    // in 10ths of a percent because of the .5% DRS_FEE
    uint256 public constant BUY_BURN_FEE = 40;
    uint256 public constant SELL_BURN_FEE = 10;
    uint256 public constant SELL_STAKER_FEE = 30;
    uint256 public constant DRS_FEE = 5;

    uint256 internal constant PRECISION = 1e18;
    uint256 public constant INITIAL_TOTAL_SUPPLY = 69_420_001 * 1e18;


    constructor(address drs_) ERC20("DRACO", "DRACO", 18) {
        // Mint initial supply to controller
          drs = drs_;
          controller = msg.sender;
        _mint(msg.sender, INITIAL_TOTAL_SUPPLY);
    }


    function setVault(address vault_) external {
        if (msg.sender != controller) revert Unauthorized();
        if (vault != address(0)) revert VaultAlreadySet();
        vault = vault_;
    }

    /// -----------------------------------------------------------------------
    /// OVERRIDES
    /// -----------------------------------------------------------------------
    function transfer(
        address to_,
        uint256 amount_
    ) public virtual override returns (bool) {
        balanceOf[msg.sender] -= amount_;

        uint256 _amount = _chargeTax(msg.sender, to_, amount_);

        unchecked {
            balanceOf[to_] += _amount;
        }

        emit Transfer(msg.sender, to_, _amount);

        return true;
    }

    function transferFrom(
        address from_,
        address to_,
        uint256 amount_
    ) public virtual override returns (bool) {

        // Saves gas for limited approvals.
        uint256 allowed = allowance[from_][msg.sender];

        if (allowed != type(uint256).max)
            allowance[from_][msg.sender] = allowed - amount_;

        balanceOf[from_] -= amount_;

        uint256 _amount = _chargeTax(msg.sender, to_, amount_);

        unchecked {
            balanceOf[to_] += _amount;
        }

        emit Transfer(from_, to_, _amount);

        return true;
    }

    /// -----------------------------------------------------------------------
    /// TAX LOGIC
    /// -----------------------------------------------------------------------

    function _chargeTax(
        address from,
        address to,
        uint256 amount
    ) internal returns (uint256 _amount) {
        _amount = amount;
       
        uint256 sendToVault;

        // BUYS: 4% burn / 0% stakers / .5% JRS)
        // SELLS: 1% burn / 3% stakers / .5% JRS)
        // Buy tax
        if (_isDracoPool(from)) {
            uint256 drsFee = _calculateFee(_amount, DRS_FEE);
            uint256 burn = _calculateFee(_amount, BUY_BURN_FEE);

            balanceOf[drs] += drsFee;
            emit Transfer(from, drs, drsFee);

            unchecked {
                totalSupply -= burn;
            }
            emit Transfer(from, address(0), burn);

            _amount -= (drsFee + burn);
        }

        // Sell tax
        if (_isDracoPool(to)) {
            uint256 drsFee = _calculateFee(_amount, DRS_FEE);
            uint256 burn = _calculateFee(_amount, SELL_BURN_FEE);
            sendToVault = _calculateFee(_amount, SELL_STAKER_FEE);

            balanceOf[drs] += drsFee;
            emit Transfer(from, drs, drsFee);

            balanceOf[vault] += sendToVault;
            emit Transfer(from, vault, sendToVault);

            unchecked {
                totalSupply -= burn;
            }
            emit Transfer(from, address(0), burn);

            _amount -= (drsFee + sendToVault + burn);

        }
    }

    /// -----------------------------------------------------------------------
    /// MORE HELPERS AND VIEW FUNCS
    /// -----------------------------------------------------------------------

    function _calculateFee(
        uint256 amount,
        uint256 pct
    ) internal pure returns (uint256) {
        uint256 feePercentage = (PRECISION * pct) / 1000; // x pct
        return (amount * feePercentage) / PRECISION;
    }

    function _isDracoPool(address target) internal view returns (bool) {
        if (target.code.length == 0) return false;

        IGrid grid = IGrid(target);

        try grid.token0() {} catch (bytes memory) {
            return false;
        }

        try grid.token1() {} catch (bytes memory) {
            return false;
        }

        try grid.resolution() {} catch (bytes memory) {
            return false;
        }
        if(grid.token0() == address(0)){
            return false;
        }
         if(grid.token1() == address(0)){
            return false;
        }
         if(grid.resolution() == 0){
            return false;
        }
        return true;
    }

}
