import { erc721ABI, useAccount, useContractRead, useSignMessage } from "wagmi";
import { isAddress, verifyMessage } from "ethers/lib/utils.js";
import { Button, Input, InputNumber, QRCode } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import { BigNumber, constants } from "ethers";
import { messageToSign, truncateAddress } from "./constants";

function VerifyTokenOwnership() {
  const { address, isConnected } = useAccount({ onConnect: () => reset() });
  const {
    data = "0x0",
    isSuccess,
    isLoading,
    signMessage,
    reset,
  } = useSignMessage({
    message: messageToSign,
  });

  const [contractAddress, setContractAddress] = useState<`0x${string}`>(
    constants.AddressZero
  );
  const [tokenId, setTokenId] = useState<BigNumber>(constants.Zero);

  const {
    data: ownerAddress = constants.AddressZero,
    isSuccess: isOwnerAddressRetrieved,
  } = useContractRead({
    abi: erc721ABI,
    address: contractAddress,
    functionName: "ownerOf",
    args: [tokenId],
    enabled:
      isConnected &&
      contractAddress !== constants.AddressZero &&
      tokenId !== constants.Zero,
  });

  console.log(ownerAddress);

  const userAddress =
    isSuccess && isOwnerAddressRetrieved
      ? verifyMessage(messageToSign, data)
      : constants.AddressZero;

  return (
    <>
      {isConnected && (
        <h1 style={{ textAlign: "center" }}>Your address: {address}</h1>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2%",
        }}
      >
        <Input
          style={{ margin: "10px", width: "50%" }}
          placeholder="Contract Address"
          onChange={(e) => {
            if (!isAddress(e.target.value))
              console.log("Not a valid Eth address");

            setContractAddress(e.target.value as `0x${string}`);
          }}
        />

        <InputNumber
          style={{ margin: "10px", width: "50%" }}
          placeholder="Token Id"
          onChange={(userSuppliedTokenId) => {
            console.log(userSuppliedTokenId);
            setTokenId(BigNumber.from(userSuppliedTokenId));
          }}
        />
      </div>

      {isConnected && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="primary"
            onClick={() => signMessage()}
            loading={isLoading}
          >
            Sign to Verify
          </Button>
        </div>
      )}

      {isOwnerAddressRetrieved && isSuccess && (
        <>
          <h1 style={{ textAlign: "center" }}>
            Verified address: {truncateAddress(userAddress)}
          </h1>
          <h1 style={{ textAlign: "center" }}>
            Owner of token {tokenId.toString()} is {ownerAddress}
          </h1>
          {ownerAddress === userAddress ? (
            <h3 style={{ textAlign: "center" }}>
              Proof is valid <CheckOutlined style={{ color: "green" }} />
            </h3>
          ) : (
            <h3 style={{ textAlign: "center" }}>
              Proof is invalid <CloseOutlined style={{ color: "red" }} />
            </h3>
          )}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <QRCode
              value={"https://hicham010.github.io/hackathon-proof-of-address/"}
              icon="proofShakeLogo.png"
            />
          </div>
        </>
      )}
    </>
  );
}

export default VerifyTokenOwnership;
