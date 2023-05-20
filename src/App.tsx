import { ConnectButton } from "@rainbow-me/rainbowkit";
import { erc721ABI, useAccount, useContractRead, useSignMessage } from "wagmi";
import { isAddress, verifyMessage } from "ethers/lib/utils.js";
import { Button, DatePicker, Input, InputNumber, message } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { BigNumber, constants } from "ethers";

function App() {
  const { address, isConnected } = useAccount({ onConnect: () => reset() });
  const messageToSign = "gm wagmi frens";
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

  const userAddress =
    isSuccess && isOwnerAddressRetrieved
      ? verifyMessage(messageToSign, data)
      : constants.AddressZero;

  useEffect(() => {
    message.error({
      content: "No Internet Connection",
      key: "test",
      duration: navigator.onLine ? Infinity : 0,
    });
  }, []);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "end", margin: "3%" }}>
        <ConnectButton
          showBalance={true}
          accountStatus={"full"}
        />
      </div>

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
        {/* <Form.Item>
          <DatePicker />
        </Form.Item> */}
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
            Verified address: {userAddress}
          </h1>
          <h1 style={{ textAlign: "center" }}>
            Owner of token {tokenId.toString()} is {ownerAddress}
          </h1>
          {ownerAddress === userAddress ? (
            <h3 style={{ textAlign: "center" }}>
              Address is right <CheckOutlined style={{ color: "green" }} />
            </h3>
          ) : (
            <h3 style={{ textAlign: "center" }}>
              Address is wrong <CloseOutlined style={{ color: "red" }} />
            </h3>
          )}
        </>
      )}
    </>
  );
}

export default App;
