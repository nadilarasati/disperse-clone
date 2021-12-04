import { ethers } from "ethers";
import { useEffect, useState } from "react";
import ERC20 from "../artifacts/ERC20.json";

const Payment = ({ address }) => {
  const [currentLink, setCurrentLink] = useState(null);
  const [ethBalance, setEthBalance] = useState(null);
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenDetails, setTokenDetails] = useState({
    name: null,
    symbol: null,
    balance: null,
  });
  const [isTokenLoading, setIsTokenLoading] = useState(false);

  const getEthBalance = async (ethereum) => {
    if (!ethBalance) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      let ethBalance = await provider.getBalance(address);
      ethBalance = ethers.utils.formatEther(ethBalance);
      setEthBalance(ethBalance);
    }
  };

  const loadToken = async () => {
    try {
      setIsTokenLoading(true);
      const { ethereum } = window;
      if (ethereum && tokenAddress !== "") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        console.log(signer);
        const erc20 = new ethers.Contract(tokenAddress, ERC20.abi, signer);
        const name = await erc20.name();
        const symbol = await erc20.symbol();
        const balance = await erc20.balanceOf(address);
        setTokenDetails({
          name,
          symbol,
          balance: ethers.utils.formatEther(balance),
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsTokenLoading(false);
    }
  };

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      getEthBalance(ethereum);
    }
  }, [currentLink]);

  return (
    <div className="pt-16">
      <h3 className="text-2xl font-light italic">
        send
        <span
          onClick={() => setCurrentLink("ether")}
          className={`border-gray-600 border-b-2 ${
            currentLink !== "ether" ? "text-gray-500" : ""
          }`}
        >
          {" "}
          ether{" "}
        </span>
        or
        <span
          onClick={() => setCurrentLink("token")}
          className={`border-gray-600 border-b-2 ${
            currentLink !== "token" ? "text-gray-500" : ""
          }`}
        >
          {" "}
          token
        </span>
      </h3>

      {currentLink === "ether" && (
        <p className="pt-4 text-l font-light italic">
          you have {ethBalance} <span className="pt-1 text-sm">ETH</span>
        </p>
      )}
      {currentLink === "token" && (
        <div className="mt-12 mb-24">
          <h3 className="text-2xl font-light">token address</h3>
          <div className="flex mt-6">
            <input
              type="text"
              className="text-l py-2 px-1 border-b-2 border-black"
              placeholder="0x2b1F577230F4D72B3818895688b66abD9701B4dC"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              style={{
                width: "80%",
                background: "aquamarine",
                color: "#768882",
              }}
            />
            <button
              onClick={loadToken}
              className="ml-4 px-2"
              style={{
                background: "aquamarine",
                boxShadow: "6px 6px crimson",
              }}
            >
              load
            </button>
          </div>
          {isTokenLoading && (
            <p className="pt-4 text-l font-light italic">
              loading token info ...
            </p>
          )}
          {!isTokenLoading && tokenDetails.name && (
            <p className="pt-4 text-l font-light">
              you have {tokenDetails.balance}{" "}
              <span className="pt-1 text-xs">{tokenDetails.symbol}</span> (
              {tokenDetails.name})
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Payment;
