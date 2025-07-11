import { Kontostand } from "./Kontostand";
import TransactionList from "./TransactionList";

export default function Liste() {
  return (
    <>
      <Kontostand option="both" />
      <TransactionList option1="all" />
    </>
  );
}
