import React from "react";
import { inject, observer } from "mobx-react";
import WalletStore from "../../stores/wallet";
import { WalletSummary as WalletSummaryModel } from "../../models/wallet";
import { walletRepository } from "../../repositories/wallet";
import { useSnackbar } from "notistack";
import WalletSummary from "../../components/WalletSummary";

interface Props {
  walletStore?: WalletStore;
}

const WalletSummaryContainer: React.FC<Props> = inject("walletStore")(
  observer((props) => {
    const walletStore = props.walletStore as WalletStore;
    const [summary, setSummary] = React.useState<WalletSummaryModel>();
    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
      const fetchSummary = async () => {
        try {
          setSummary(await walletRepository.summary());
        } catch (e) {
          enqueueSnackbar("보유화폐 현황을 불러오는 데 실패했습니다.", {
            variant: "error",
          });
        }
      };
      fetchSummary();
    }, [enqueueSnackbar]);

    return <WalletSummary wallets={walletStore.wallets} summary={summary} />;
  })
);

export default WalletSummaryContainer;
