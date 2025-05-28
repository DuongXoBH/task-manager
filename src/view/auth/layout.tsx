import type { ReactNode } from "react";

interface IAuthLayoutProps {
  children: ReactNode;
  title: string;
}
export default function AuthLayout({ children, title }: IAuthLayoutProps) {
  return (
    <div className="w-full bg-[url('/images/hero-image.jpg')] bg-[#1C1D1F] bg-no-repeat bg-top flex flex-col min-h-screen">
      <span className="w-full text-white text-xl font-bold h-[250px] flex justify-center items-center">
        {title}
      </span>
      {children}
    </div>
  );
}
