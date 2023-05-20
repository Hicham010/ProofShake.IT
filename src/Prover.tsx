import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, QRCode } from "antd";
import { constants } from "ethers";
import { verifyMessage } from "ethers/lib/utils.js";
import { useParams } from "react-router-dom";
import { useAccount, useEnsAddress, useSignMessage } from "wagmi";
import { baseUrl } from "./constants";

function Prover() {
  const { ensName } = useParams<{ ensName: string }>();
  const { isConnected } = useAccount();
  const messageToSign = "gm wagmi frens";
  const {
    data = "0x0",
    isSuccess,
    signMessage,
  } = useSignMessage({
    message: messageToSign,
  });

  const { data: ensNameOwner, isSuccess: isOwnerAddressRetrieved } =
    useEnsAddress({
      name: ensName,
      enabled: isConnected,
    });

  const userAddress = isSuccess
    ? verifyMessage(messageToSign, data)
    : constants.AddressZero;

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Proving ownership of {ensName}</h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button onClick={() => signMessage()}>Verify {ensName}</Button>
      </div>
      {isOwnerAddressRetrieved && isSuccess && (
        <>
          <h1 style={{ textAlign: "center" }}>
            Verified address: {userAddress}
          </h1>

          <h1 style={{ textAlign: "center" }}>
            Owner of '{ensName}' is {ensNameOwner}
          </h1>

          {ensNameOwner === userAddress ? (
            <h3 style={{ textAlign: "center" }}>
              Address is right <CheckOutlined style={{ color: "green" }} />
            </h3>
          ) : (
            <h3 style={{ textAlign: "center" }}>
              Address is wrong <CloseOutlined style={{ color: "red" }} />
            </h3>
          )}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <QRCode value={`${baseUrl}/verifier/${data}/${ensName}`} />
          </div>
          {`${baseUrl}/verifier/${data}/${ensName}`}
        </>
      )}
      {ensNameOwner === null && isOwnerAddressRetrieved && (
        <h1 style={{ textAlign: "center" }}>
          The ENS name '{ensName}' is invalid
        </h1>
      )}
    </>
  );
}

export default Prover;
