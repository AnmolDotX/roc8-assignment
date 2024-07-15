import { EmailTemplate } from "emails/EmailTemplate";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="">
      <h1>Hello world</h1>
      <EmailTemplate name = "Anmol" email="kumaranmol@gmail.com" otp= {12345}/>
    </main>
  );
}
