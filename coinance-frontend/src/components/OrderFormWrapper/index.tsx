import React from "react";
import { Tabs, Tab, Card } from "@material-ui/core";
import OrderBuyContainer from "../../containers/OrderBuyContainer";
import OrderSellContainer from "../../containers/OrderSellContainer";

const OrderFormWrapper: React.FC = () => {
  const [tab, setTab] = React.useState<number>(0);

  const handleTabChange = (e: React.ChangeEvent<{}>, newTab: number) => {
    setTab(newTab);
  };

  return (
    <Card elevation={10}>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="fullWidth"
        indicatorColor={tab === 0 ? "primary" : "secondary"}
      >
        <Tab label="매수" color="primary" />
        <Tab label="매도" color="secondary" />
      </Tabs>
      {tab === 0 ? <OrderBuyContainer /> : <OrderSellContainer />}
    </Card>
  );
};

export default OrderFormWrapper;
