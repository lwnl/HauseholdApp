import { Kontostand } from "./Kontostand";
import TransactionList from "./TransactionList";

export default function Ausgaenge() {
  return <>
  <Kontostand option="expense" />
  <TransactionList option1='expense' />
  </>
}