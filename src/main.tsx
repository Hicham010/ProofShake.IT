import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import { WagmiConfig, configureChains, createClient, mainnet } from "wagmi";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { publicProvider } from "wagmi/providers/public";
import { HashRouter } from "react-router-dom";
import { store } from "./app/store";
import { Provider } from "react-redux";

import "@rainbow-me/rainbowkit/styles.css";
// import "antd/dist/antd.css";

// import { ConfigProvider } from "antd";

const { chains, provider } = configureChains([mainnet], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "ERC20 ZK-Permit",
  projectId: "004c893129510636115d7dbdeb119a45",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

// const proofShakeTheme = {
// colorPrimary: "#a3daff",
// colorSecondary: "#a3daff",
// colorLink: "#559b7b",
// colorError: "#EC4D4F",
// colorWarning: "#FFF962",
// colorSuccess: "#52c41a",
// colorInfo: "#1890ff",
// };

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* <ConfigProvider
      theme={{
        token: proofShakeTheme,
      }}
    > */}
    <Provider store={store}>
      <HashRouter>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider
            showRecentTransactions={true}
            chains={chains}
            coolMode={true}
            modalSize={"compact"}
          >
            <App />
          </RainbowKitProvider>
        </WagmiConfig>
      </HashRouter>
    </Provider>
    {/* </ConfigProvider> */}
  </React.StrictMode>
);
