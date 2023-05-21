import { Spin } from "antd";
import { verifyMessage } from "ethers/lib/utils.js";
import { useParams } from "react-router-dom";
import { useAccount, useEnsAddress } from "wagmi";
import { messageToSign } from "./constants";

function Verifier() {
  const { isConnected } = useAccount();
  const { signature, ensName } = useParams<{
    signature: string;
    ensName: string;
  }>();

  const userAddress = verifyMessage(messageToSign, signature);
  const { data: ensNameOwner, isLoading } = useEnsAddress({
    name: ensName,
    enabled: isConnected,
  });

  console.log({ signature, ensName, ensNameOwner });

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Verifier</h1>
      <Spin
        size="large"
        spinning={isLoading}
      >
        <>
          {userAddress === ensNameOwner ? (
            <h3 style={{ textAlign: "center" }}>Verified</h3>
          ) : (
            <h3 style={{ textAlign: "center" }}>Not Verified</h3>
          )}
        </>
      </Spin>
    </>
  );
}

export default Verifier;
