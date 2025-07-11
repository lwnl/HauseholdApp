import TransactionList from "./TransactionList";
import { Kontostand } from "./Kontostand";

export default function Eingaenge() {
  return <>
  <Kontostand option="income" />
  <TransactionList option1='income' />
  </>
}