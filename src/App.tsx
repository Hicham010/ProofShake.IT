import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSignMessage } from "wagmi";
import { verifyMessage } from "ethers/lib/utils.js";
import { Button } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

function App() {
  const { address, isConnected } = useAccount({ onConnect: () => reset() });
  const message = "gm wagmi frens";
  const {
    data = "0x0",
    isSuccess,
    isLoading,
    signMessage,
    reset,
  } = useSignMessage({
    message,
  });

  const userAddress = isSuccess ? verifyMessage(message, data) : "";

  return (
    <>
      <div style={{ display: "flex", justifyContent: "end", margin: "3%" }}>
        <ConnectButton
          showBalance={true}
          accountStatus={"full"}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          marginBottom: "2%",
        }}
      >
        {isConnected && (
          <h1 style={{ textAlign: "center" }}>Your address: {address}</h1>
        )}
        {isSuccess && (
          <h1 style={{ textAlign: "center" }}>
            Verified address: {userAddress}
          </h1>
        )}
        {isSuccess && (
          <>
            {address === userAddress ? (
              <CheckOutlined style={{ color: "green" }} />
            ) : (
              <CloseOutlined style={{ color: "red" }} />
            )}
          </>
        )}
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
    </>
  );
}

export default App;
