import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Button, message } from "antd";
import { constants } from "ethers";
import { isAddress, verifyMessage } from "ethers/lib/utils.js";
import { useParams } from "react-router-dom";
import { useAccount, useEnsAddress, useSignMessage } from "wagmi";
import { useSubmitSessionResultMutation } from "./app/api";
import { messageToSign, truncateAddress } from "./constants";

function Prover() {
  const { ensNameOrAddress, sessionid } = useParams<{
    ensNameOrAddress: string;
    sessionid: string;
  }>();
  // console.log({ ensNameOrAddress, sessionid });
  // console.log({ sessionid });
  const { isConnected } = useAccount();
  const {
    data = "0x0",
    isSuccess,
    isLoading: isSigning,
    signMessageAsync,
  } = useSignMessage({
    message: messageToSign,
  });

  const { data: ensNameOwner, isSuccess: isOwnerAddressRetrieved } =
    useEnsAddress({
      name: ensNameOrAddress,
      enabled: isConnected,
    });

  const userAddress = isSuccess
    ? verifyMessage(messageToSign, data)
    : constants.AddressZero;

  const [submitSession] = useSubmitSessionResultMutation();

  const truncatedAddrOrEns = isAddress(ensNameOrAddress)
    ? truncateAddress(ensNameOrAddress)
    : ensNameOrAddress;

  return (
    <>
      <h1 style={{ textAlign: "center" }}>
        Proving ownership of {truncatedAddrOrEns}
      </h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          loading={isSigning}
          disabled={!isConnected}
          type="primary"
          onClick={async () => {
            try {
              const signatureFromSigning = await signMessageAsync();
              const resp = await submitSession({
                sessionid,
                proofstring: signatureFromSigning,
              });
              message.success("Proof successfully send");
              console.log(resp);
            } catch (error) {
              console.error(error);
              message.success("Failed to send proof");
            }
          }}
        >
          Verify {truncatedAddrOrEns}
        </Button>
      </div>
      {isOwnerAddressRetrieved && isSuccess && (
        <>
          {ensNameOwner === userAddress ? (
            <h1 style={{ textAlign: "center" }}>
              Proof is valid <CheckCircleOutlined style={{ color: "green" }} />
            </h1>
          ) : (
            <>
              <h1 style={{ textAlign: "center" }}>Proof is invalid</h1>
              <div>
                <CloseOutlined style={{ color: "red" }} />
              </div>
            </>
          )}

          <h3 style={{ textAlign: "center" }}>
            Verified address: {truncateAddress(userAddress)}
          </h3>

          {!isAddress(ensNameOrAddress) && (
            <>
              {ensNameOwner ? (
                <h1 style={{ textAlign: "center" }}>
                  Owner of '{truncatedAddrOrEns}' is {ensNameOwner}
                </h1>
              ) : (
                <h1 style={{ textAlign: "center" }}>
                  '{truncatedAddrOrEns}' doesn't have an owner
                </h1>
              )}
            </>
          )}

          {/* <div style={{ display: "flex", justifyContent: "center" }}>
            <QRCode value={`${baseUrl}/verifier/${data}/${ensName}`} />
          </div>
          {`${baseUrl}/verifier/${data}/${ensName}`} */}
        </>
      )}
      {ensNameOwner === null && isOwnerAddressRetrieved && (
        <h1 style={{ textAlign: "center" }}>
          The ENS name '{truncatedAddrOrEns}' is invalid
        </h1>
      )}
    </>
  );
}

export default Prover;
